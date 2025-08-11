// Blog System Permissions
export const BLOG_PERMISSIONS = {
  // Public permissions (không cần đăng nhập)
  VIEW_PUBLIC_BLOGS: 'blog:view:public',
  VIEW_PUBLIC_BLOG_DETAIL: 'blog:view:public:detail',
  
  // User permissions (cần đăng nhập)
  CREATE_BLOG: 'blog:create',
  EDIT_OWN_BLOG: 'blog:edit:own',
  DELETE_OWN_BLOG: 'blog:delete:own',
  PUBLISH_OWN_BLOG: 'blog:publish:own',
  VIEW_OWN_DRAFTS: 'blog:view:own:drafts',
  LIKE_BLOG: 'blog:like',
  COMMENT_BLOG: 'blog:comment',
  
  // Moderator permissions
  MODERATE_BLOG: 'blog:moderate',
  APPROVE_BLOG: 'blog:approve',
  REJECT_BLOG: 'blog:reject',
  BAN_BLOG: 'blog:ban',
  VIEW_PENDING_BLOGS: 'blog:view:pending',
  
  // Admin permissions
  MANAGE_ALL_BLOGS: 'blog:manage:all',
  DELETE_ANY_BLOG: 'blog:delete:any',
  MANAGE_TAGS: 'blog:manage:tags',
  VIEW_BLOG_ANALYTICS: 'blog:view:analytics',
} as const;

// User Role Permissions Mapping
export const ROLE_PERMISSIONS = {
  student: [
    BLOG_PERMISSIONS.VIEW_PUBLIC_BLOGS,
    BLOG_PERMISSIONS.VIEW_PUBLIC_BLOG_DETAIL,
    BLOG_PERMISSIONS.CREATE_BLOG,
    BLOG_PERMISSIONS.EDIT_OWN_BLOG,
    BLOG_PERMISSIONS.DELETE_OWN_BLOG,
    BLOG_PERMISSIONS.PUBLISH_OWN_BLOG,
    BLOG_PERMISSIONS.VIEW_OWN_DRAFTS,
    BLOG_PERMISSIONS.LIKE_BLOG,
    BLOG_PERMISSIONS.COMMENT_BLOG,
  ],
  
  university_rep: [
    BLOG_PERMISSIONS.VIEW_PUBLIC_BLOGS,
    BLOG_PERMISSIONS.VIEW_PUBLIC_BLOG_DETAIL,
    BLOG_PERMISSIONS.CREATE_BLOG,
    BLOG_PERMISSIONS.EDIT_OWN_BLOG,
    BLOG_PERMISSIONS.DELETE_OWN_BLOG,
    BLOG_PERMISSIONS.PUBLISH_OWN_BLOG,
    BLOG_PERMISSIONS.VIEW_OWN_DRAFTS,
    BLOG_PERMISSIONS.LIKE_BLOG,
    BLOG_PERMISSIONS.COMMENT_BLOG,
  ],
  
  moderator: [
    BLOG_PERMISSIONS.VIEW_PUBLIC_BLOGS,
    BLOG_PERMISSIONS.VIEW_PUBLIC_BLOG_DETAIL,
    BLOG_PERMISSIONS.CREATE_BLOG,
    BLOG_PERMISSIONS.EDIT_OWN_BLOG,
    BLOG_PERMISSIONS.DELETE_OWN_BLOG,
    BLOG_PERMISSIONS.PUBLISH_OWN_BLOG,
    BLOG_PERMISSIONS.VIEW_OWN_DRAFTS,
    BLOG_PERMISSIONS.LIKE_BLOG,
    BLOG_PERMISSIONS.COMMENT_BLOG,
    BLOG_PERMISSIONS.MODERATE_BLOG,
    BLOG_PERMISSIONS.APPROVE_BLOG,
    BLOG_PERMISSIONS.REJECT_BLOG,
    BLOG_PERMISSIONS.BAN_BLOG,
    BLOG_PERMISSIONS.VIEW_PENDING_BLOGS,
  ],
  
  admin: [
    BLOG_PERMISSIONS.VIEW_PUBLIC_BLOGS,
    BLOG_PERMISSIONS.VIEW_PUBLIC_BLOG_DETAIL,
    BLOG_PERMISSIONS.CREATE_BLOG,
    BLOG_PERMISSIONS.EDIT_OWN_BLOG,
    BLOG_PERMISSIONS.DELETE_OWN_BLOG,
    BLOG_PERMISSIONS.PUBLISH_OWN_BLOG,
    BLOG_PERMISSIONS.VIEW_OWN_DRAFTS,
    BLOG_PERMISSIONS.LIKE_BLOG,
    BLOG_PERMISSIONS.COMMENT_BLOG,
    BLOG_PERMISSIONS.MODERATE_BLOG,
    BLOG_PERMISSIONS.APPROVE_BLOG,
    BLOG_PERMISSIONS.REJECT_BLOG,
    BLOG_PERMISSIONS.BAN_BLOG,
    BLOG_PERMISSIONS.VIEW_PENDING_BLOGS,
    BLOG_PERMISSIONS.MANAGE_ALL_BLOGS,
    BLOG_PERMISSIONS.DELETE_ANY_BLOG,
    BLOG_PERMISSIONS.MANAGE_TAGS,
    BLOG_PERMISSIONS.VIEW_BLOG_ANALYTICS,
  ],
  
  super_admin: [
    // Tất cả permissions
    ...Object.values(BLOG_PERMISSIONS),
  ],
} as const;

// Permission check helper
export const hasPermission = (
  userRole: keyof typeof ROLE_PERMISSIONS | null,
  permission: string
): boolean => {
  if (!userRole) return false;
  
  const userPermissions = ROLE_PERMISSIONS[userRole] || [];
  return userPermissions.includes(permission as any);
};

// Multiple permissions check
export const hasAnyPermission = (
  userRole: keyof typeof ROLE_PERMISSIONS | null,
  permissions: string[]
): boolean => {
  return permissions.some(permission => hasPermission(userRole, permission));
};

export const hasAllPermissions = (
  userRole: keyof typeof ROLE_PERMISSIONS | null,
  permissions: string[]
): boolean => {
  return permissions.every(permission => hasPermission(userRole, permission));
};
