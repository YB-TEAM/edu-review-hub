class UniversityResponse {
  final int id;
  final String name;
  final String? shortName;
  final String? englishName;
  final String? address;
  final List<String> location;
  final String? city;
  final String? province;
  final String? phone;
  final String? email;
  final String? website;
  final String? facebook;
  final String? logoUrl;
  final String? bannerUrl;
  final String? description;
  final String? history;
  final String? mission;
  final String? vision;
  final String type; 
  final String status; 
  final int? foundedYear;
  final String? accreditation;
  final List<String> specializations;
  final List<String> facilities;
  final List<String> achievements;
  final String? rankingNational;
  final String? rankingInternational;
  final int? studentCount;
  final int? facultyCount;
  final String? acceptanceRate;
  final String? tuitionFeeMin;
  final String? tuitionFeeMax;
  final String currency;
  final List<String> admissionRequirements;
  final List<String> scholarships;
  final List<String> internationalPartnerships;
  final String? campusMapUrl;
  final String? latitude;
  final String? longitude;
  final bool isFeatured;
  final bool isVerified;
  // final String? viewCount;
  // final int reviewCount;
  final String? averageRating;
  // final int totalRating;
  final DateTime createdAt;
  final DateTime updatedAt;

  UniversityResponse({
    required this.id,
    required this.name,
    this.shortName,
    this.englishName,
    this.address,
    this.location = const [],
    this.city,
    this.province,
    this.phone,
    this.email,
    this.website,
    this.facebook,
    this.logoUrl,
    this.bannerUrl,
    this.description,
    this.history,
    this.mission,
    this.vision,
    required this.type,
    required this.status,
    this.foundedYear,
    this.accreditation,
    this.specializations = const [],
    this.facilities = const [],
    this.achievements = const [],
    this.rankingNational,
    this.rankingInternational,
    this.studentCount,
    this.facultyCount,
    this.acceptanceRate,
    this.tuitionFeeMin,
    this.tuitionFeeMax,
    required this.currency,
    this.admissionRequirements = const [],
    this.scholarships = const [],
    this.internationalPartnerships = const [],
    this.campusMapUrl,
    this.latitude,
    this.longitude,
    this.isFeatured = false,
    this.isVerified = false,
    // this.viewCount,
    // this.reviewCount = 0,
    this.averageRating,
    // this.totalRating = 0,
    required this.createdAt,
    required this.updatedAt,
  });

  factory UniversityResponse.fromJson(Map<String, dynamic> json) {
    return UniversityResponse(
      id: json["id"],
      name: json["name"],
      shortName: json["short_name"],
      englishName: json["english_name"],
      address: json["address"],
      location: List<String>.from(json["location"] ?? []),
      city: json["city"],
      province: json["province"],
      phone: json["phone"],
      email: json["email"],
      website: json["website"],
      facebook: json["facebook"],
      logoUrl: json["logo_url"],
      bannerUrl: json["banner_url"],
      description: json["description"],
      history: json["history"],
      mission: json["mission"],
      vision: json["vision"],
      type: json["type"] ?? "public",
      status: json["status"] ?? "active",
      foundedYear: json["founded_year"],
      accreditation: json["accreditation"],
      specializations: List<String>.from(json["specializations"] ?? []),
      facilities: List<String>.from(json["facilities"] ?? []),
      achievements: List<String>.from(json["achievements"] ?? []),
      rankingNational: json["ranking_national"],
      rankingInternational: json["ranking_international"],
      studentCount: json["student_count"],
      facultyCount: json["faculty_count"],
      acceptanceRate: json["acceptance_rate"],
      tuitionFeeMin: json["tuition_fee_min"],
      tuitionFeeMax: json["tuition_fee_max"],
      currency: json["currency"] ?? "VND",
      admissionRequirements:
          List<String>.from(json["admission_requirements"] ?? []),
      scholarships: List<String>.from(json["scholarships"] ?? []),
      internationalPartnerships:
          List<String>.from(json["international_partnerships"] ?? []),
      campusMapUrl: json["campus_map_url"],
      latitude: json["latitude"],
      longitude: json["longitude"],
      isFeatured: json["is_featured"] ?? false,
      isVerified: json["is_verified"] ?? false,
      // viewCount: json["view_count"] ?? 0,
      // reviewCount: json["review_count"] ?? 0,
      averageRating: json["average_rating"] ?? "0.00",
      // totalRating: json["total_rating"] ?? 0,
      createdAt: DateTime.parse(json["created_at"]),
      updatedAt: DateTime.parse(json["updated_at"]),
    );
  }
}
