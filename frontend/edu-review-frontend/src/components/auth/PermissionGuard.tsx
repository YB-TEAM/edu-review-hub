"use client";

import { ReactNode } from 'react';
import { usePermissions } from '@/hooks/usePermissions';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';

interface PermissionGuardProps {
  children: ReactNode;
  requiredPermissions?: string[];
  requiredRole?: 'student' | 'university_rep' | 'moderator' | 'admin' | 'super_admin';
  fallback?: ReactNode;
  redirectTo?: string;
  showToast?: boolean;
}

export const PermissionGuard = ({
  children,
  requiredPermissions = [],
  requiredRole,
  fallback,
  redirectTo,
  showToast = true,
}: PermissionGuardProps) => {
  const { hasPermission, hasAllPermissions, userRole, isAuthenticated } = usePermissions();
  const { user } = useAuth();
  const router = useRouter();

  // Check if user has required permissions
  const hasRequiredPermissions = requiredPermissions.length === 0 || 
    hasAllPermissions(requiredPermissions);

  // Check if user has required role
  const hasRequiredRole = !requiredRole || userRole === requiredRole;

  // Check if user can access
  const canAccess = hasRequiredPermissions && hasRequiredRole;

  useEffect(() => {
    if (!isAuthenticated) {
      if (showToast) {
        toast.error('Vui lòng đăng nhập để truy cập trang này');
      }
      if (redirectTo) {
        router.push(redirectTo);
      } else {
        router.push('/auth/login');
      }
      return;
    }

    if (!canAccess) {
      if (showToast) {
        toast.error('Bạn không có quyền truy cập trang này');
      }
      if (redirectTo) {
        router.push(redirectTo);
      } else {
        router.push('/');
      }
    }
  }, [canAccess, isAuthenticated, redirectTo, router, showToast]);

  // Show fallback while checking permissions
  if (!isAuthenticated) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Đang kiểm tra quyền truy cập...</h2>
          <p className="text-gray-600">Vui lòng đợi trong giây lát</p>
        </div>
      </div>
    );
  }

  // Show fallback if user doesn't have required permissions
  if (!canAccess) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Không có quyền truy cập</h2>
          <p className="text-gray-600 mb-4">
            Bạn không có quyền truy cập trang này
          </p>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  // Render children if user has required permissions
  return <>{children}</>;
};

// Specialized permission guards for common use cases
export const BlogCreateGuard = ({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) => (
  <PermissionGuard
    requiredPermissions={['blog:create']}
    fallback={fallback}
    redirectTo="/auth/login"
  >
    {children}
  </PermissionGuard>
);

export const BlogModerateGuard = ({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) => (
  <PermissionGuard
    requiredPermissions={['blog:moderate']}
    fallback={fallback}
    redirectTo="/"
  >
    {children}
  </PermissionGuard>
);

export const BlogAdminGuard = ({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) => (
  <PermissionGuard
    requiredPermissions={['blog:manage:all']}
    fallback={fallback}
    redirectTo="/"
  >
    {children}
  </PermissionGuard>
);

export const AuthenticatedGuard = ({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) => (
  <PermissionGuard
    fallback={fallback}
    redirectTo="/auth/login"
  >
    {children}
  </PermissionGuard>
);
