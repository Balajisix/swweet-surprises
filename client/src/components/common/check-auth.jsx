import { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";

function CheckAuth({ isAuthenticated, authChecked, isLoading, user, children }) {
  const location = useLocation();
  
  // Local state to track user authentication from localStorage
  const [isAuthenticatedFromStorage, setIsAuthenticatedFromStorage] = useState(isAuthenticated);

  // On component mount, check if there's an authenticated user in localStorage
  useEffect(() => {
    const userFromStorage = localStorage.getItem("user");
    if (userFromStorage) {
      setIsAuthenticatedFromStorage(true); // User is authenticated
    } else {
      setIsAuthenticatedFromStorage(false); // User is not authenticated
    }
  }, []);

  // If authentication status is still being checked, show a loading state
  if (isLoading || !authChecked) {
    return <div>Loading...</div>;
  }

  // Allow unauthenticated access to specific public routes
  const publicRoutes = ["/auth/login", "/auth/register", "/auth/forgot-password"];
  const isResetPasswordRoute = location.pathname.startsWith("/auth/reset-password");

  if (!isAuthenticatedFromStorage && (publicRoutes.includes(location.pathname) || isResetPasswordRoute)) {
    return <>{children}</>;
  }

  // Redirect root path based on authentication and role
  if (location.pathname === "/") {
    if (!isAuthenticatedFromStorage) {
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
  if (!isAuthenticatedFromStorage) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Redirect authenticated users away from public auth pages
  if (
    isAuthenticatedFromStorage &&
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
    isAuthenticatedFromStorage &&
    user?.role !== "admin" &&
    location.pathname.includes("admin")
  ) {
    return <Navigate to="/unauth-page" />;
  }

  // Restrict access for admin users trying to access shop routes
  if (
    isAuthenticatedFromStorage &&
    user?.role === "admin" &&
    location.pathname.includes("shop")
  ) {
    return <Navigate to="/admin/dashboard" />;
  }

  return <>{children}</>;
}

export default CheckAuth;
