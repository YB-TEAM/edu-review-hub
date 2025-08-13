// ignore_for_file: non_constant_identifier_names

import 'package:dartz/dartz.dart';
import 'package:edu_review_mobile/core/error/failures.dart';
import 'package:edu_review_mobile/features/user_profile/data/data_souces/remote/profile_api_service.dart';
import 'package:edu_review_mobile/features/user_profile/data/models/blog_edit_params.dart';
import 'package:edu_review_mobile/features/user_profile/data/models/blog_response.dart';
import 'package:edu_review_mobile/features/user_profile/data/models/edit_profile.dart';
import 'package:edu_review_mobile/features/user_profile/domain/entities/profile.dart';
import 'package:edu_review_mobile/features/user_profile/domain/repository/profile_repository.dart';
import 'package:edu_review_mobile/service_locator.dart';

class ProfileRepositoryImpl extends ProfileRepository {
  @override
  Future<Either<Failure, ProfileEntity>> getUser() async {
    return await sl<ProfileApiService>().getUser();
  }

  @override
  Future<Either<Failure, List<BlogResponse>>> getBlogs() async {
    return await sl<ProfileApiService>().getBlogs();
  }

  @override
  Future<Either<Failure, void>> deleteBlog(int blogId) async {
    return await sl<ProfileApiService>().deleteBlog(blogId);
  }

  @override
  Future<Either<Failure, BlogResponse>> publishBlog(int blogId) async {
    return await sl<ProfileApiService>().publishBlog(blogId);
  }

  @override
  Future<Either<Failure, BlogResponse>> editBlog(EditBlogParams editBlogParams) async {
    return await sl<ProfileApiService>().editBlog(editBlogParams);
  }
  
  @override
  Future<Either<Failure, ProfileEntity>> editProfile(EditProfileModel editModel) async {
    return await sl<ProfileApiService>().editProfile(editModel);
  }
}
