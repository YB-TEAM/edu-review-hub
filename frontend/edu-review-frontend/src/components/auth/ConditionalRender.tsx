"use client";

import { ReactNode } from 'react';
import { usePermissions } from '@/hooks/usePermissions';

interface ConditionalRenderProps {
  children: ReactNode;
  condition: boolean;
  fallback?: ReactNode;
}

export const ConditionalRender = ({ 
  children, 
  condition, 
  fallback = null 
}: ConditionalRenderProps) => {
  return condition ? <>{children}</> : <>{fallback}</>;
};

// Permission-based conditional renders
export const IfCanCreateBlog = ({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) => {
  const { canCreateBlog } = usePermissions();
  return <ConditionalRender condition={canCreateBlog} fallback={fallback}>{children}</ConditionalRender>;
};

export const IfCanModerateBlog = ({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) => {
  const { canModerateBlog } = usePermissions();
  return <ConditionalRender condition={canModerateBlog} fallback={fallback}>{children}</ConditionalRender>;
};

export const IfCanManageAllBlogs = ({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) => {
  const { canManageAllBlogs } = usePermissions();
  return <ConditionalRender condition={canManageAllBlogs} fallback={fallback}>{children}</ConditionalRender>;
};

export const IfCanViewOwnDrafts = ({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) => {
  const { canViewOwnDrafts } = usePermissions();
  return <ConditionalRender condition={canViewOwnDrafts} fallback={fallback}>{children}</ConditionalRender>;
};

export const IfCanLikeBlog = ({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) => {
  const { canLikeBlog } = usePermissions();
  return <ConditionalRender condition={canLikeBlog} fallback={fallback}>{children}</ConditionalRender>;
};

export const IfCanCommentBlog = ({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) => {
  const { canCommentBlog } = usePermissions();
  return <ConditionalRender condition={canCommentBlog} fallback={fallback}>{children}</ConditionalRender>;
};

export const IfAuthenticated = ({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) => {
  const { isAuthenticated } = usePermissions();
  return <ConditionalRender condition={isAuthenticated} fallback={fallback}>{children}</ConditionalRender>;
};

export const IfNotAuthenticated = ({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) => {
  const { isAuthenticated } = usePermissions();
  return <ConditionalRender condition={!isAuthenticated} fallback={fallback}>{children}</ConditionalRender>;
};

// Role-based conditional renders
export const IfStudent = ({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) => {
  const { isStudent } = usePermissions();
  return <ConditionalRender condition={isStudent} fallback={fallback}>{children}</ConditionalRender>;
};

export const IfModerator = ({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) => {
  const { isModerator } = usePermissions();
  return <ConditionalRender condition={isModerator} fallback={fallback}>{children}</ConditionalRender>;
};

export const IfAdmin = ({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) => {
  const { isAdmin } = usePermissions();
  return <ConditionalRender condition={isAdmin} fallback={fallback}>{children}</ConditionalRender>;
};

export const IfSuperAdmin = ({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) => {
  const { isSuperAdmin } = usePermissions();
  return <ConditionalRender condition={isSuperAdmin} fallback={fallback}>{children}</ConditionalRender>;
};
