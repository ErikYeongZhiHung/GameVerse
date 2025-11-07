import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { apiConfig } from "../api/api";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState("loading"); // loading, success, error
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const token = searchParams.get("token");
        if (!token) {
          setVerificationStatus("error");
          setMessage("Invalid verification link");
          return;
        }

        const response = await apiConfig.get(`/auth/verify-email?token=${token}`);
        
        if (response.data.success) {
          setVerificationStatus("success");
          setMessage("Email verified successfully!");
          
          // Redirect to home page after 2 seconds
          setTimeout(() => {
            navigate("/");
          }, 2000);
        } else {
          setVerificationStatus("error");
          setMessage(response.data.message || "Verification failed");
        }
      } catch (error) {
        setVerificationStatus("error");
        setMessage("Verification failed. Please try again.");
        console.error("Verification error:", error);
      }
    };

    // Wait 5 seconds before calling the API
    const timer = setTimeout(() => {
      verifyEmail();
    }, 5000);

    return () => clearTimeout(timer);
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md text-center">
        {verificationStatus === "loading" && (
          <>
            <div className="flex justify-center mb-6">
              <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
            </div>
            <h1 className="text-2xl font-bold mb-3 text-gray-800">
              Verifying Your Email...
            </h1>
            <p className="text-gray-600">
              Please wait while we verify your email address.
            </p>
          </>
        )}

        {verificationStatus === "success" && (
          <>
            <div className="flex justify-center mb-6">
              <CheckCircle className="w-16 h-16 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold mb-3 text-gray-800">
              Email Verified! ✅
            </h1>
            <p className="text-gray-600 mb-4">{message}</p>
            <p className="text-sm text-gray-500">
              Redirecting you to the home page...
            </p>
          </>
        )}

        {verificationStatus === "error" && (
          <>
            <div className="flex justify-center mb-6">
              <XCircle className="w-16 h-16 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold mb-3 text-gray-800">
              Verification Failed ❌
            </h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <button
              onClick={() => navigate("/signup")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition"
            >
              Go to Sign Up
            </button>
          </>
        )}
      </div>
    </div>
  );
}