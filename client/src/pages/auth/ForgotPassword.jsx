import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Gift, Mail } from 'lucide-react';
import axios from 'axios';
const BACKEND_URL = "https://backend-api-ten-sigma.vercel.app";
// const BACKEND_URL = "http://localhost:5000";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // API Call for Password Reset using axios
    try {
      const response = await axios.post(`${BACKEND_URL}/api/auth/reset-password`, {
        email,
      });

      if (response.status === 200) {
        setIsEmailSent(true);
      } else {
        window.alert('Password reset failed!');
      }
    } catch (error) {
      window.alert('An error occurred while resetting the password!');
    }
  };

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex items-center justify-center">
          <div className="h-12 w-12 rounded-full bg-pink-200 flex items-center justify-center">
            <Gift className="h-8 w-8 text-pink-600" />
          </div>
          <h1 className="ml-3 text-3xl font-bold text-pink-900">Sweet Surprises</h1>
        </div>
        <h2 className="mt-6 text-center text-2xl font-semibold text-pink-800">
          Reset Your Password
        </h2>
      </div>
  
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-lg rounded-lg">
          {isEmailSent ? (
            <div className="text-center space-y-6">
              <p className="text-lg font-medium text-gray-900">
                We've sent a reset password link to your email!
              </p>
              <p
                className="text-pink-600 hover:text-pink-800 cursor-pointer"
                onClick={() => navigate('/')}
              >
                Click here after resetting your password to return to the login page.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-pink-900">
                  Email Address
                </label>
                <div className="mt-1 relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-400">
                    <Mail size={20} />
                  </span>
                  <input
                    type="email"
                    required
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
  
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                >
                  Send Reset Link
                </button>
              </div>
  
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="text-sm text-pink-600 hover:text-pink-800"
                >
                  Back to Sign in
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
  
};

export default ForgotPassword;