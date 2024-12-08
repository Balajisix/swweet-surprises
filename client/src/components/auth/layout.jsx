import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="flex min-h-screen w-full bg-pink-50">
      <div className="hidden lg:flex items-center justify-center bg-pink-300 w-1/2 px-12 animate-slideIn">
        <div className="max-w-md space-y-6 text-center text-pink-900">
          <h1 className="text-5xl font-extrabold tracking-tight animate-fadeIn">
            Swweet Surprises
          </h1>
          <p className="text-lg text-pink-800 animate-fadeIn delay-200">
            Discover our delightful gift collection!
          </p>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center bg-pink-100 px-4 py-12 sm:px-6 lg:px-8 animate-fadeIn">
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;
