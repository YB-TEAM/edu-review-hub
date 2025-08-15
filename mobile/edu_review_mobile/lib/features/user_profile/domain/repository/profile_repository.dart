import 'package:dartz/dartz.dart';
import 'package:edu_review_mobile/core/error/failures.dart';
import 'package:edu_review_mobile/features/user_profile/data/models/blog_edit_params.dart';
import 'package:edu_review_mobile/features/user_profile/data/models/blog_response.dart';
import 'package:edu_review_mobile/features/user_profile/data/models/edit_profile.dart';
import 'package:edu_review_mobile/features/user_profile/domain/entities/profile.dart';

abstract class ProfileRepository {
  Future<Either<Failure, ProfileEntity>> getUser();
  Future<Either<Failure, void>> deleteBlog(int blogId);
  Future<Either<Failure, List<BlogResponse>>> getBlogs();
  Future<Either<Failure, BlogResponse>> publishBlog(int blogId);
   Future<Either<Failure, BlogResponse>> editBlog(EditBlogParams editBlogParams);
  Future<Either<Failure, ProfileEntity>> editProfile(EditProfileModel editModel);
}
