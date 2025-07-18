import React, { useState, useEffect } from "react";
import TodoForm from "./TodoForm";
import TodoList from "./TodoList";
import StatusBar from "./StatusBar";
import { useNavigate } from "react-router-dom";

interface Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  created_at: string;
}

const API_BASE_URL = "http://localhost:8000";

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchTodos = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/`, {
        credentials: "include",
      });
      console.log("Response headers:", response.headers);

      if (!response.ok) {
        if (response.status === 401) {
          setError("Please log in.");
          navigate("/login");
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setTodos(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching todos:", err);
      setError("Failed to load tasks.");
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [navigate]);

  const addTodo = async (title: string, description: string) => {
    const newTodo = {
      title,
      description,
      completed: false,
      created_at: new Date().toISOString(),
    };

    try {
      const response = await fetch(`${API_BASE_URL}/tasks/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(newTodo),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      await fetchTodos();
    } catch (err) {
      console.error("Error adding todo:", err);
      setError("Failed to add task.");
    }
  };

  const toggleTodoCompletion = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${id}/toggle-complete`, {
        method: "PUT",
        credentials: "include",
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      await fetchTodos();
    } catch (err) {
      console.error("Error toggling todo:", err);
      setError("Failed to update task.");
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      await fetchTodos();
    } catch (err) {
      console.error("Error deleting todo:", err);
      setError("Failed to delete task.");
    }
  };

  const completedCount = todos.filter((todo) => todo.completed).length;
  const pendingCount = todos.length - completedCount;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Todo List</h1>
          <p className="text-gray-600">Manage your tasks efficiently</p>
        </header>

        {error && (
          <div className="mb-4 text-red-600 font-medium bg-red-100 p-2 rounded">
            {error}
          </div>
        )}

        <TodoForm onAddTodo={addTodo} />

        <div className="mt-8">
          <TodoList
            todos={todos}
            onToggleComplete={toggleTodoCompletion}
            onDelete={deleteTodo}
          />
        </div>

        <div className="mt-6">
          <StatusBar
            pendingCount={pendingCount}
            completedCount={completedCount}
          />
        </div>
      </div>
    </div>
  );
}