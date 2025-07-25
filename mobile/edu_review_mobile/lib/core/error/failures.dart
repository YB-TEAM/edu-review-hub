abstract class Failure {
  final String message;
  final int? statusCode;

  const Failure(this.message, {this.statusCode});
}

class ServerFailure extends Failure {
  const ServerFailure(String message, {int? statusCode})
      : super(message, statusCode: statusCode);
}

class CacheFailure extends Failure {
  const CacheFailure(String message, {int? statusCode})
      : super(message, statusCode: statusCode);
}

class NetworkFailure extends Failure {
  const NetworkFailure(String message, {int? statusCode})
      : super(message, statusCode: statusCode);
}
