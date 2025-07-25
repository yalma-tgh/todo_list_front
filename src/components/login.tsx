import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // If the user is already logged in, redirect to the home page
    const token = localStorage.getItem("access_token");
    if (token) {
      // Validate token before redirecting
      validateToken(token).then(isValid => {
        if (isValid) {
          navigate("/");
        } else {
          // Clear invalid token
          localStorage.removeItem("access_token");
        }
      });
    }
  }, [navigate]);

  // Function to validate token
  const validateToken = async (token: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/tasks/", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.status !== 401;
    } catch (err) {
      console.error("Token validation error:", err);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      console.log("Attempting login with:", { email });
      
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ email, password }),
      });

      console.log("Login response status:", response.status);
      
      const data = await response.json();

      if (!response.ok) {
        setError(data.detail || "Login failed. Check your credentials.");
        return;
      }

      if (data.access_token) {
        console.log("Login successful, token received");
        localStorage.setItem("access_token", data.access_token);
        
        // Verify token works immediately after login
        const isValid = await validateToken(data.access_token);
        if (isValid) {
          navigate("/"); // Redirect to home after successful login
        } else {
          setError("Authentication failed. Please try again.");
          localStorage.removeItem("access_token");
        }
      } else {
        setError("Login failed: No access token received.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred during login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="p-6 max-w-md w-full bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-blue-500 text-white p-2 rounded disabled:bg-blue-300"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          <p className="mt-4 text-center">
            Don't have an account?{" "}
            <a href="/register" className="text-blue-500 hover:underline">
              Register here
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}