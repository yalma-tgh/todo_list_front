import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [tokenInfo, setTokenInfo] = useState<any>(null);
  const [tokenTestInfo, setTokenTestInfo] = useState<any>(null);
  const navigate = useNavigate();

  // Function to debug token
  const debugToken = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    try {
      // First call the original debug endpoint
      const response = await fetch("/api/debug/token", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log("Token debug info:", data);
        setTokenInfo(data);
      } else {
        console.error("Failed to debug token:", response.status);
      }
      
      // Then call the simplified test endpoint
      const testResponse = await fetch("/api/debug/token-test", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (testResponse.ok) {
        const testData = await testResponse.json();
        console.log("Token test info:", testData);
        setTokenTestInfo(testData);
      } else {
        console.error("Failed to test token:", testResponse.status);
      }
    } catch (err) {
      console.error("Error debugging token:", err);
    }
  };

  const fetchTasks = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      console.log("Fetching tasks with token:", token.substring(0, 20) + "...");
      
      // Call debug endpoint first
      await debugToken();
      
      console.log("Making request to /api/tasks/ with auth header");
      const response = await fetch("/api/tasks/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Tasks response status:", response.status);
      console.log("Tasks response headers:", response.headers);

      // Log the raw response
      try {
        const responseText = await response.text();
        console.log("Raw response:", responseText);
        
        // Now parse the response if it's JSON
        if (responseText) {
          try {
            const data = JSON.parse(responseText);
            setTasks(data);
          } catch (parseError) {
            console.error("Failed to parse response as JSON:", parseError);
            setError("Received invalid data from server");
            
            // Try the public endpoint as fallback
            console.log("Trying public tasks endpoint as fallback");
            await fetchPublicTasks();
          }
        } else {
          console.log("Response was empty");
          setTasks([]);
          
          // Try the public endpoint as fallback
          console.log("Trying public tasks endpoint as fallback");
          await fetchPublicTasks();
        }
      } catch (textError) {
        console.error("Failed to read response text:", textError);
        setError("Failed to read server response");
        
        // Try the public endpoint as fallback
        console.log("Trying public tasks endpoint as fallback");
        await fetchPublicTasks();
      }

      if (response.status === 401) {
        console.log("Unauthorized access, attempting public tasks endpoint");
        // Try the public endpoint
        await fetchPublicTasks();
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch tasks: ${response.status}`);
      }
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError("An error occurred while fetching tasks.");
      
      // Try the public endpoint as fallback
      console.log("Trying public tasks endpoint as fallback");
      await fetchPublicTasks();
    } finally {
      setLoading(false);
    }
  };
  
  const fetchPublicTasks = async () => {
    try {
      console.log("Fetching public tasks");
      const response = await fetch("/api/public-tasks/");
      
      if (response.ok) {
        const data = await response.json();
        console.log("Public tasks fetched successfully:", data);
        setTasks(data);
        setError(null);
      } else {
        console.error("Failed to fetch public tasks:", response.status);
        setError("Failed to fetch tasks. Using public endpoint failed too.");
      }
    } catch (err) {
      console.error("Error fetching public tasks:", err);
      setError("Could not connect to the server.");
    }
  };

  useEffect(() => {
    fetchTasks();
    // Try to debug the token right away
    const token = localStorage.getItem("access_token");
    if (token) {
      debugToken();
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Todo List</h1>
          <div>
            <button
              onClick={debugToken}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
            >
              Debug Token
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
        
        {tokenInfo && (
          <div className="mb-4 p-4 bg-gray-50 border rounded">
            <h2 className="font-bold mb-2">Token Debug Info</h2>
            {tokenInfo.validation_check && (
              <div className="grid grid-cols-2 gap-2">
                <div>Issuer Match:</div>
                <div>{tokenInfo.validation_check.issuer_match ? '✅' : '❌'}</div>
                <div>Audience Match:</div>
                <div>{tokenInfo.validation_check.audience_match ? '✅' : '❌'}</div>
                <div>Token Expired:</div>
                <div>{tokenInfo.validation_check.token_expired === false ? '✅ Valid' : '❌ Expired'}</div>
                <div>Issuer:</div>
                <div className="text-xs break-all">{tokenInfo.payload_info?.iss}</div>
                <div>Expected Issuer:</div>
                <div className="text-xs break-all">{tokenInfo.authentik_config?.issuer}</div>
                <div>Audience:</div>
                <div>{tokenInfo.payload_info?.aud}</div>
                <div>Expected Audience:</div>
                <div>{tokenInfo.authentik_config?.client_id}</div>
              </div>
            )}
            {tokenInfo.error && (
              <div className="text-red-500">{tokenInfo.error}</div>
            )}
          </div>
        )}
        
        {tokenTestInfo && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded">
            <h2 className="font-bold mb-2 text-green-800">Token Test Results</h2>
            {tokenTestInfo.status && (
              <div className="mb-2 text-green-700">{tokenTestInfo.status}</div>
            )}
            {tokenTestInfo.payload_summary && (
              <div className="grid grid-cols-2 gap-2">
                <div className="font-semibold">Issuer:</div>
                <div className="text-xs break-all">{tokenTestInfo.payload_summary.iss}</div>
                <div className="font-semibold">Audience:</div>
                <div>{tokenTestInfo.payload_summary.aud}</div>
                <div className="font-semibold">Expiration:</div>
                <div>{new Date(tokenTestInfo.payload_summary.exp * 1000).toLocaleString()}</div>
                <div className="font-semibold">User Email:</div>
                <div>{tokenTestInfo.user_info?.email}</div>
                <div className="font-semibold">Username:</div>
                <div>{tokenTestInfo.user_info?.username}</div>
              </div>
            )}
            {tokenTestInfo.error && (
              <div className="text-red-500">{tokenTestInfo.error}</div>
            )}
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>{error}</p>
            <button 
              onClick={fetchTasks}
              className="bg-blue-500 text-white px-3 py-1 rounded mt-2 text-sm hover:bg-blue-600"
            >
              Try Again
            </button>
          </div>
        )}
        
        {loading ? (
          <div className="text-center py-4">Loading tasks...</div>
        ) : (
          <div>
            {tasks.length > 0 ? (
              <ul>
                {tasks.map((task) => (
                  <li
                    key={task.id}
                    className="border-b py-2 flex justify-between items-center"
                  >
                    <div>
                      <h3 className="font-semibold">{task.title}</h3>
                      <p className="text-gray-600">{task.description}</p>
                    </div>
                    <span
                      className={`px-2 py-1 text-sm rounded ${
                        task.completed
                          ? "bg-green-200 text-green-800"
                          : "bg-yellow-200 text-yellow-800"
                      }`}
                    >
                      {task.completed ? "Completed" : "Pending"}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No tasks found. Create one!</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}