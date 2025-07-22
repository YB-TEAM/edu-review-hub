import 'package:dio/dio.dart';
import 'package:edu_review_mobile/features/auth/data/data_sources/local/auth_local_service.dart';
import 'package:edu_review_mobile/features/auth/data/data_sources/remote/auth_api_service.dart';

class AuthInterceptor extends Interceptor {
  final AuthLocalService localService;
  final AuthApiService apiService;
  final Dio dio; 

  AuthInterceptor({
    required this.localService,
    required this.apiService,
    required this.dio,
  });

  bool _isRefreshing = false;
  final List<Function(RequestOptions)> _retryQueue = [];

  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) async {
    final token = await localService.getAccessToken();
    if (token != null) {
      // Skip token check for refresh token endpoint
      if (!options.path.contains('refresh-token')) {
        try {
          // Verify token before using it
          final tokenParts = token.split('.');
          if (tokenParts.length != 3) {
            await localService.clearTokens();
            return handler.next(options);
          }
        } catch (e) {
          await localService.clearTokens();
          return handler.next(options);
        }
      }
      options.headers['Authorization'] = 'Bearer $token';
    }
    handler.next(options);
  }

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) async {
    if (err.response?.statusCode == 401 && !_isRefreshing) {
      _isRefreshing = true;

      try {
        final refreshToken = await localService.getRefreshToken();
        if (refreshToken == null) {
          await localService.clearTokens();
          return handler.next(err); 
        }

        // Gọi API refresh token
        final response = await apiService.refreshToken(refreshToken);

        final newAccessToken = response.accessToken;
        final newRefreshToken = response.refreshToken;

        // Lưu token mới
        await localService.saveTokens(newAccessToken, newRefreshToken);

        // Retry các request trong queue
        for (var retry in _retryQueue) {
          await retry(err.requestOptions);
        }
        _retryQueue.clear();

        // Retry request ban đầu
        final retryRequest = await _retry(err.requestOptions, newAccessToken);
        _isRefreshing = false;
        return handler.resolve(retryRequest);
      } catch (e) {
        _isRefreshing = false;
        _retryQueue.clear();
        await localService.clearTokens();
        return handler.next(err);
      }
    } else if (err.response?.statusCode == 401 && _isRefreshing) {
      // Xếp hàng request nếu đang refresh
      _retryQueue.add((RequestOptions requestOptions) async {
        final accessToken = await localService.getAccessToken();
        if (accessToken != null) {
          final retryRequest = await _retry(requestOptions, accessToken);
          handler.resolve(retryRequest);
        } else {
          handler.next(err);
        }
      });
    } else {
      return handler.next(err);
    }
  }

  Future<Response<dynamic>> _retry(RequestOptions requestOptions, String? accessToken) async {
    if (accessToken == null) {
      throw DioException(
        requestOptions: requestOptions,
        error: 'Access token is null after refresh',
      );
    }

    final options = Options(
      method: requestOptions.method,
      headers: {
        ...requestOptions.headers,
        'Authorization': 'Bearer $accessToken',
      },
    );

    return dio.request(
      requestOptions.path,
      data: requestOptions.data,
      queryParameters: requestOptions.queryParameters,
      options: options,
    );
  }
}