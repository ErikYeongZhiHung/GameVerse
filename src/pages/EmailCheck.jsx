import { Mail, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function EmailCheck() {
  const [dots, setDots] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const userEmail = location.state?.email;

  useEffect(() => {
    // Animate dots (...)
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : ""));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!userEmail) return;

    let pollInterval;

    // Function to check verification status
    const checkVerification = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/auth/check-verification?email=${userEmail}`
        );
        const data = await res.json();

        console.log("Checking verification status:", data);

        if (data.verified) {
          console.log("User verified! Redirecting to home...");
          clearInterval(pollInterval);
          navigate("/");
        }
      } catch (err) {
        console.error("Error checking verification:", err);
      }
    };

    // Start polling every 3 seconds
    pollInterval = setInterval(checkVerification, 3000);

    // Cleanup function
    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [userEmail, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md text-center">
        <div className="flex justify-center mb-6">
          <Mail className="w-16 h-16 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold mb-3 text-gray-800">
          Check Your Email ✉️
        </h1>
        <p className="text-gray-600 mb-6">
          We’ve sent a message to <strong>{userEmail}</strong>. <br />
          Please check your inbox to verify your account.
        </p>

        <div className="flex items-center justify-center text-blue-600 mb-3">
          <Loader2 className="animate-spin w-6 h-6 mr-2" />
          <span>Waiting for confirmation{dots}</span>
        </div>

        <p className="text-sm text-gray-500 mt-4">
          Didn’t receive the email? <br />
          <a
            href="#"
            className="text-blue-600 hover:underline"
            onClick={() => window.location.reload()}
          >
            Resend email
          </a>
        </p>
      </div>
    </div>
  );
}
