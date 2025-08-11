import { useAuth } from './useAuth';
import { 
  hasPermission, 
  hasAnyPermission, 
  hasAllPermissions,
  BLOG_PERMISSIONS 
} from '@/lib/permissions';

export const usePermissions = () => {
  const { user } = useAuth();
  const userRole = user?.accountType || null;

  return {
    // Basic permission checks
    canViewPublicBlogs: hasPermission(userRole, BLOG_PERMISSIONS.VIEW_PUBLIC_BLOGS),
    canViewPublicBlogDetail: hasPermission(userRole, BLOG_PERMISSIONS.VIEW_PUBLIC_BLOG_DETAIL),
    
    // User permissions
    canCreateBlog: hasPermission(userRole, BLOG_PERMISSIONS.CREATE_BLOG),
    canEditOwnBlog: hasPermission(userRole, BLOG_PERMISSIONS.EDIT_OWN_BLOG),
    canDeleteOwnBlog: hasPermission(userRole, BLOG_PERMISSIONS.DELETE_OWN_BLOG),
    canPublishOwnBlog: hasPermission(userRole, BLOG_PERMISSIONS.PUBLISH_OWN_BLOG),
    canViewOwnDrafts: hasPermission(userRole, BLOG_PERMISSIONS.VIEW_OWN_DRAFTS),
    canLikeBlog: hasPermission(userRole, BLOG_PERMISSIONS.LIKE_BLOG),
    canCommentBlog: hasPermission(userRole, BLOG_PERMISSIONS.COMMENT_BLOG),
    
    // Moderator permissions
    canModerateBlog: hasPermission(userRole, BLOG_PERMISSIONS.MODERATE_BLOG),
    canApproveBlog: hasPermission(userRole, BLOG_PERMISSIONS.APPROVE_BLOG),
    canRejectBlog: hasPermission(userRole, BLOG_PERMISSIONS.REJECT_BLOG),
    canBanBlog: hasPermission(userRole, BLOG_PERMISSIONS.BAN_BLOG),
    canViewPendingBlogs: hasPermission(userRole, BLOG_PERMISSIONS.VIEW_PENDING_BLOGS),
    
    // Admin permissions
    canManageAllBlogs: hasPermission(userRole, BLOG_PERMISSIONS.MANAGE_ALL_BLOGS),
    canDeleteAnyBlog: hasPermission(userRole, BLOG_PERMISSIONS.DELETE_ANY_BLOG),
    canManageTags: hasPermission(userRole, BLOG_PERMISSIONS.MANAGE_TAGS),
    canViewBlogAnalytics: hasPermission(userRole, BLOG_PERMISSIONS.VIEW_BLOG_ANALYTICS),
    
    // Helper functions
    hasPermission: (permission: string) => hasPermission(userRole, permission),
    hasAnyPermission: (permissions: string[]) => hasAnyPermission(userRole, permissions),
    hasAllPermissions: (permissions: string[]) => hasAllPermissions(userRole, permissions),
    
    // Role checks
    isStudent: userRole === 'student',
    isUniversityRep: userRole === 'university_rep',
    isModerator: userRole === 'moderator',
    isAdmin: userRole === 'admin',
    isSuperAdmin: userRole === 'super_admin',
    
    // User info
    userRole,
    isAuthenticated: !!user,
  };
};
