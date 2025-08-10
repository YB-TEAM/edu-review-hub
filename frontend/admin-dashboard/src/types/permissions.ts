export type UserRole = 'super_admin' | 'admin' | 'moderator';

export interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: string;
}

export interface RolePermissions {
  role: UserRole;
  permissions: Permission[];
  menuItems: MenuItem[];
}

export interface MenuItem {
  id: string;
  label: string;
  path: string;
  icon: string;
  permissions?: string[];
  children?: MenuItem[];
}

// Định nghĩa tất cả permissions có thể có
export const ALL_PERMISSIONS: Permission[] = [
  // User Management
  { id: 'users.view', name: 'Xem người dùng', description: 'Xem danh sách người dùng', resource: 'users', action: 'view' },
  { id: 'users.create', name: 'Tạo người dùng', description: 'Tạo người dùng mới', resource: 'users', action: 'create' },
  { id: 'users.edit', name: 'Sửa người dùng', description: 'Sửa thông tin người dùng', resource: 'users', action: 'edit' },
  { id: 'users.delete', name: 'Xóa người dùng', description: 'Xóa người dùng', resource: 'users', action: 'delete' },
  { id: 'users.ban', name: 'Cấm người dùng', description: 'Cấm hoặc mở cấm người dùng', resource: 'users', action: 'ban' },
  { id: 'users.change_role', name: 'Thay đổi role', description: 'Thay đổi role của người dùng', resource: 'users', action: 'change_role' },

  // Blog Management
  { id: 'blogs.view', name: 'Xem blog', description: 'Xem danh sách blog', resource: 'blogs', action: 'view' },
  { id: 'blogs.create', name: 'Tạo blog', description: 'Tạo blog mới', resource: 'blogs', action: 'create' },
  { id: 'blogs.edit', name: 'Sửa blog', description: 'Sửa nội dung blog', resource: 'blogs', action: 'edit' },
  { id: 'blogs.delete', name: 'Xóa blog', description: 'Xóa blog', resource: 'blogs', action: 'delete' },
  { id: 'blogs.moderate', name: 'Kiểm duyệt blog', description: 'Phê duyệt hoặc từ chối blog', resource: 'blogs', action: 'moderate' },

  // University Management
  { id: 'universities.view', name: 'Xem đại học', description: 'Xem danh sách đại học', resource: 'universities', action: 'view' },
  { id: 'universities.create', name: 'Tạo đại học', description: 'Tạo đại học mới', resource: 'universities', action: 'create' },
  { id: 'universities.edit', name: 'Sửa đại học', description: 'Sửa thông tin đại học', resource: 'universities', action: 'edit' },
  { id: 'universities.delete', name: 'Xóa đại học', description: 'Xóa đại học', resource: 'universities', action: 'delete' },

  // System Management
  { id: 'system.view', name: 'Xem hệ thống', description: 'Xem thông tin hệ thống', resource: 'system', action: 'view' },
  { id: 'system.settings', name: 'Cài đặt hệ thống', description: 'Thay đổi cài đặt hệ thống', resource: 'system', action: 'settings' },
  { id: 'system.logs', name: 'Xem logs', description: 'Xem logs hệ thống', resource: 'system', action: 'logs' },
  { id: 'system.backup', name: 'Backup hệ thống', description: 'Tạo và khôi phục backup', resource: 'system', action: 'backup' },

  // Analytics
  { id: 'analytics.view', name: 'Xem analytics', description: 'Xem thống kê và báo cáo', resource: 'analytics', action: 'view' },
  { id: 'analytics.export', name: 'Xuất báo cáo', description: 'Xuất báo cáo analytics', resource: 'analytics', action: 'export' },

  // Tags Management
  { id: 'tags.view', name: 'Xem tags', description: 'Xem danh sách tags', resource: 'tags', action: 'view' },
  { id: 'tags.create', name: 'Tạo tags', description: 'Tạo tags mới', resource: 'tags', action: 'create' },
  { id: 'tags.edit', name: 'Sửa tags', description: 'Sửa thông tin tags', resource: 'tags', action: 'edit' },
  { id: 'tags.delete', name: 'Xóa tags', description: 'Xóa tags', resource: 'tags', action: 'delete' },
];

// Định nghĩa permissions cho từng role
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  super_admin: ALL_PERMISSIONS.map(p => p.id),
  admin: [
    'users.view', 'users.edit', 'users.ban',
    'blogs.view', 'blogs.edit', 'blogs.moderate',
    'universities.view', 'universities.edit',
    'system.view', 'system.settings',
    'analytics.view', 'analytics.export',
    'tags.view', 'tags.edit'
  ],
  moderator: [
    'users.view',
    'blogs.view', 'blogs.moderate',
    'universities.view',
    'analytics.view',
    'tags.view'
  ]
};

// Định nghĩa menu items cho từng role
export const ROLE_MENU_ITEMS: Record<UserRole, MenuItem[]> = {
  super_admin: [
    { id: 'overview', label: 'Tổng quan', path: '/dashboard', icon: 'Home' },
    { id: 'users', label: 'Người dùng', path: '/dashboard/users', icon: 'Users' },
    { id: 'blogs', label: 'Blog', path: '/dashboard/blogs', icon: 'FileText' },
    { id: 'universities', label: 'Đại học', path: '/dashboard/universities', icon: 'Building2' },
    { id: 'tags', label: 'Tags', path: '/dashboard/tags', icon: 'Tags' },
    { id: 'analytics', label: 'Analytics', path: '/dashboard/analytics', icon: 'BarChart3' },
    { id: 'system', label: 'Hệ thống', path: '/dashboard/system', icon: 'Settings' },
    { id: 'security', label: 'Bảo mật', path: '/dashboard/security', icon: 'Shield' },
  ],
  admin: [
    { id: 'overview', label: 'Tổng quan', path: '/dashboard', icon: 'Home' },
    { id: 'users', label: 'Người dùng', path: '/dashboard/users', icon: 'Users' },
    { id: 'blogs', label: 'Blog', path: '/dashboard/blogs', icon: 'FileText' },
    { id: 'universities', label: 'Đại học', path: '/dashboard/universities', icon: 'Building2' },
    { id: 'tags', label: 'Tags', path: '/dashboard/tags', icon: 'Tags' },
    { id: 'analytics', label: 'Analytics', path: '/dashboard/analytics', icon: 'BarChart3' },
    { id: 'system', label: 'Hệ thống', path: '/dashboard/system', icon: 'Settings' },
  ],
  moderator: [
    { id: 'overview', label: 'Tổng quan', path: '/dashboard', icon: 'Home' },
    { id: 'blogs', label: 'Blog', path: '/dashboard/blogs', icon: 'FileText' },
    { id: 'universities', label: 'Đại học', path: '/dashboard/universities', icon: 'Building2' },
    { id: 'analytics', label: 'Analytics', path: '/dashboard/analytics', icon: 'BarChart3' },
  ]
};

// Helper function để kiểm tra permission
export function hasPermission(userRole: UserRole, permissionId: string): boolean {
  return ROLE_PERMISSIONS[userRole]?.includes(permissionId) || false;
}

// Helper function để lấy menu items cho role
export function getMenuItemsForRole(role: UserRole): MenuItem[] {
  return ROLE_MENU_ITEMS[role] || [];
}
