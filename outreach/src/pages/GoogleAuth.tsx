import axios from "axios";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const GoogleAuth = () => {
  const [searchParams, _] = useSearchParams();
  const { setToken } = useAuth();

  const fetchToken = async () => {
    try {
      // Redirect to backend Google OAuth endpoint
      const code = searchParams.get("code");
      if (!code) {
        console.error("No code found in URL");
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/auth/google/token`,
        { params: { code } }
      );

      const { accessToken } = response.data.tokens;
      setToken(accessToken);
      console.log("Google OAuth successful, access token set.");
    } catch (error) {
      console.error("Error during Google OAuth:", error);
    }
  };

  useEffect(() => {
    fetchToken();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-2xl font-bold">
        Please wait while we authenticate with Google...
      </h1>
    </div>
  );
};

export default GoogleAuth;
