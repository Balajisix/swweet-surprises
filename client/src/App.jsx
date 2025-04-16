import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import AuthLayout from "./components/auth/layout";
import AuthLogin from "./pages/auth/login";
import ForgotPass from "./pages/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";
import AuthRegister from "./pages/auth/register";

import AdminLayout from "./components/admin-view/layout";
import AdminDashboard from "./pages/admin-view/dashboard";
import AdminProducts from "./pages/admin-view/products";
import AdminOrders from "./pages/admin-view/orders";
import AdminFeatures from "./pages/admin-view/features";

import ShoppingLayout from "./components/shopping-view/layout";
import ShoppingHome from "./pages/shopping-view/home";
import ShoppingListing from "./pages/shopping-view/listing";
import ShoppingCheckout from "./pages/shopping-view/checkout";
import ShoppingAccount from "./pages/shopping-view/account";
import PaypalReturnPage from "./pages/shopping-view/paypal-return";
import PaymentSuccessPage from "./pages/shopping-view/payment-success";
import SearchProducts from "./pages/shopping-view/search";
import ProductDetailsPage from "./components/shopping-view/product-details";

import NotFound from "./pages/not-found";
import UnauthPage from "./pages/unauth-page";

import { checkAuth } from "./store/auth-slice";
import { Skeleton } from "@/components/ui/skeleton";

function App() {
  const { user, isAuthenticated, isLoading, authChecked } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  // ✅ Checkout Protected Component
  const ProtectedRoute = ({ children }) => {
    if (!authChecked) {
      return <Skeleton className="w-[800px] bg-black h-[600px]" />;
    }

    return isAuthenticated ? (
      <>{children}</>
    ) : (
      <Navigate to="/auth/login" state={{ from: location }} replace />
    );
  };

  // ✅ Admin Protected Component
  const AdminProtected = ({ children }) => {
    if (!authChecked) {
      return <Skeleton className="w-[800px] bg-black h-[600px]" />;
    }

    return user?.role === "admin" ? (
      <>{children}</>
    ) : (
      <Navigate to="/unauth-page" replace />
    );
  };

  return (
    <div className="flex flex-col overflow-hidden bg-white">
      <Routes>
        {/* 🚀 Redirect root "/" to shop/home */}
        <Route path="/" element={<Navigate to="/shop/home" replace />} />

        {/* 🔐 Auth Routes */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route index element={<Navigate to="login" replace />} />
          <Route path="login" element={<AuthLogin />} />
          <Route path="register" element={<AuthRegister />} />
          <Route path="forgot-password" element={<ForgotPass />} />
        </Route>

        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* 🛒 Shopping Routes */}
        <Route path="/shop" element={<ShoppingLayout />}>
          <Route path="home" element={<ShoppingHome />} />
          <Route path="productpage" element={<ProductDetailsPage />} />
          <Route path="listing" element={<ShoppingListing />} />
          <Route
            path="checkout"
            element={
              <ProtectedRoute>
                <ShoppingCheckout />
              </ProtectedRoute>
            }
          />
          <Route path="account" element={<ShoppingAccount />} />
          <Route path="paypal-return" element={<PaypalReturnPage />} />
          <Route path="payment-success" element={<PaymentSuccessPage />} />
          <Route path="search" element={<SearchProducts />} />
        </Route>

        {/* 🛠 Admin Routes (Protected) */}
        <Route
          path="/admin"
          element={
            <AdminProtected>
              <AdminLayout />
            </AdminProtected>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="features" element={<AdminFeatures />} />
        </Route>

        <Route path="/unauth-page" element={<UnauthPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
