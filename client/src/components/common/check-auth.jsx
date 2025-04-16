import { Navigate, useLocation } from "react-router-dom";

function CheckAuth({ isAuthenticated, authChecked, isLoading, user, children }) {
  const location = useLocation();

  if (isLoading || !authChecked) {
    return <div>Loading...</div>;
  }

  // Allow unauthenticated access to specific public routes
  const publicRoutes = ["/auth/login", "/auth/register", "/auth/forgot-password"];
  const isResetPasswordRoute = location.pathname.startsWith("/auth/reset-password");

  if (!isAuthenticated && (publicRoutes.includes(location.pathname) || isResetPasswordRoute)) {
    return <>{children}</>;
  }

  // Redirect root path based on authentication and role
  if (location.pathname === "/") {
    if (!isAuthenticated) {
      return <Navigate to="/auth/login" />;
    } else {
      if (user?.role === "admin") {
        return <Navigate to="/admin/dashboard" />;
      } else {
        return <Navigate to="/shop/home" />;
      }
    }
  }

  // Redirect unauthenticated users trying to access restricted routes
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Redirect authenticated users away from public auth pages
  if (
    isAuthenticated &&
    (location.pathname.includes("/login") ||
      location.pathname.includes("/register") ||
      location.pathname.includes("/forgot-password") ||
      isResetPasswordRoute)
  ) {
    if (user?.role === "admin") {
      return <Navigate to="/admin/dashboard" />;
    } else {
      return <Navigate to="/shop/home" />;
    }
  }

  // Restrict access for non-admin users trying to access admin routes
  if (
    isAuthenticated &&
    user?.role !== "admin" &&
    location.pathname.includes("admin")
  ) {
    return <Navigate to="/unauth-page" />;
  }

  // Restrict access for admin users trying to access shop routes
  if (
    isAuthenticated &&
    user?.role === "admin" &&
    location.pathname.includes("shop")
  ) {
    return <Navigate to="/admin/dashboard" />;
  }

  return <>{children}</>;
}

export default CheckAuth;