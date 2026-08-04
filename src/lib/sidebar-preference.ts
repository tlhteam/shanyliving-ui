export const sidebarCookies = {
  admin: "shany-admin-sidebar",
  customer: "shany-customer-sidebar"
};

export function persistSidebarPreference(cookieName: string, collapsed: boolean) {
  document.cookie = `${cookieName}=${collapsed ? "collapsed" : "expanded"};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;
}
