class UploadImageResponse {
  final String publicId;
  final String secureUrl;
  final String url;
  final int width;
  final int height;
  final String format;
  final int bytes;
  final DateTime createdAt;

  UploadImageResponse({
    required this.publicId,
    required this.secureUrl,
    required this.url,
    required this.width,
    required this.height,
    required this.format,
    required this.bytes,
    required this.createdAt,
  });

  factory UploadImageResponse.fromMap(Map<String, dynamic> map) {
    return UploadImageResponse(
      publicId: map['publicId'] ?? '',
      secureUrl: map['secureUrl'] ?? '',
      url: map['url'] ?? '',
      width: map['width'] ?? 0,
      height: map['height'] ?? 0,
      format: map['format'] ?? '',
      bytes: map['bytes'] ?? 0,
      createdAt: DateTime.parse(map['createdAt']),
    );
  }
}
