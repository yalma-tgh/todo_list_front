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
  const navigate = useNavigate();

  const fetchTasks = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      console.log("Fetching tasks with token:", token.substring(0, 10) + "...");
      
      const response = await fetch("/api/tasks/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Tasks response status:", response.status);

      if (response.status === 401) {
        console.log("Unauthorized access, attempting to refresh token...");
        // Try to refresh the session by forcing a new login
        localStorage.removeItem("access_token");
        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch tasks: ${response.status}`);
      }

      const data = await response.json();
      setTasks(data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError("An error occurred while fetching tasks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
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
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
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