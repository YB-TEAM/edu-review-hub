export interface NavItem {
  label: string;
  href: string;
  isActive?: boolean;
  badge?: string;
  icon?: string;
}

export const NAV_ITEMS: NavItem[] = [
  {
    label: "Trang chủ",
    href: "/",
    isActive: true,
    icon: "home",
  },
  {
    label: "Tính năng",
    href: "#features",
    icon: "features",
  },
  {
    label: "Cách hoạt động",
    href: "#how-it-works",
    icon: "workflow",
  },
  {
    label: "Đánh giá",
    href: "#reviews",
    badge: "Mới",
    icon: "star",
  },
  {
    label: "Blog",
    href: "/blog",
    icon: "blog",
  },
  {
    label: "Liên hệ",
    href: "#contact",
    icon: "contact",
  },
];

export const NAVBAR_CONFIG = {
  scrollThreshold: 50,
  hideThreshold: 100,
  logoText: "EduReview",
  logoShort: "E",
  ctaPrimary: "Bắt đầu ngay",
  ctaSecondary: "Đăng nhập",
};
