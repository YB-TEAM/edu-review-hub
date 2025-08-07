  import 'package:edu_review_mobile/core/usecases/no_params.dart';
  import 'package:edu_review_mobile/features/user_profile/domain/usecases/get_blog.dart';
  import 'package:edu_review_mobile/features/user_profile/domain/usecases/get_user.dart';
  import 'package:edu_review_mobile/features/user_profile/presentation/bloc/user_display_state.dart';
  import 'package:edu_review_mobile/service_locator.dart';
  import 'package:flutter_bloc/flutter_bloc.dart';

  class UserDisplayCubit extends Cubit<UserDisplayState> {
    UserDisplayCubit() : super(UserLoading());

    Future<void> displayUser() async {
      final userResult = await sl<GetUserUseCase>().call(NoParams());
      final blogResult = await sl<GetMyBlogUseCase>().call(NoParams());

      // Kiểm tra lỗi trước
      if (userResult.isLeft()) {
        final error = userResult.swap().getOrElse(() => throw Exception());
        emit(LoadUserFailure(errorMessage: error.message));
        return;
      }

      if (blogResult.isLeft()) {
        final error = blogResult.swap().getOrElse(() => throw Exception());
        emit(LoadUserFailure(errorMessage: error.message));
        return;
      }

      final profile = userResult.getOrElse(() => throw Exception());
      final blogs = blogResult.getOrElse(() => []);

      emit(UserLoaded(profileEntity: profile, blogs: blogs));
    }

    Future<void> reloadUser() async {
      emit(UserLoading());
      await displayUser();
    }
  }
