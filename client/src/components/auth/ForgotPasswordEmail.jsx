import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Gift } from 'lucide-react';
import axios from 'axios';
const BACKEND_URL = "https://backend-api-ten-sigma.vercel.app";
// const BACKEND_URL = "http://localhost:5000";

const ForgotPasswordEmail = () => {
  const { token } = useParams();
  console.log(token);
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [isPasswordUpdated, setIsPasswordUpdated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate('/');
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPasswordMismatch(newPassword !== confirmPassword);
    if (newPassword !== confirmPassword) return;

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/auth/reset-password/${token}`,
        { newPassword }
      );
      if (response.status === 200) {
        setIsPasswordUpdated(true);
      } else {
        alert('Failed to update password!');
      }
    } catch (error) {
      alert('An error occurred while resetting the password!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50 flex items-center justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex items-center justify-center bg-white shadow-lg rounded-lg p-6">
          <Gift className="h-10 w-10 text-pink-500" />
          <h1 className="ml-3 text-3xl font-extrabold text-gray-800">Swweet Surprises</h1>
        </div>
        <h2 className="mt-6 text-center text-2xl font-semibold text-gray-700">
          Set a New Password
        </h2>
      </div>
  
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-lg rounded-lg">
          {isPasswordUpdated ? (
            <div className="text-center space-y-6">
              <p className="text-lg font-semibold text-gray-800">
                Your password has been updated successfully.
              </p>
              <button
                onClick={() => navigate('/')}
                className="text-pink-600 hover:text-pink-800 underline"
              >
                Back to Sign in
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  New Password
                </label>
                <div className="mt-1 relative">
                  <input
                    type="password"
                    required
                    minLength={6}
                    className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
              </div>
  
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Confirm Password
                </label>
                <div className="mt-1 relative">
                  <input
                    type="password"
                    required
                    minLength={6}
                    className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                {passwordMismatch && (
                  <p className="text-red-600 text-sm mt-2">
                    Passwords do not match.
                  </p>
                )}
              </div>
  
              <div>
                <button
                  type="submit"
                  className="w-full py-2 px-4 bg-pink-600 text-white rounded-lg shadow-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                  disabled={isLoading || passwordMismatch}
                >
                  {isLoading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
  
              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="text-sm text-pink-600 hover:text-pink-800 underline"
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

export default ForgotPasswordEmail;
