import React, { useState, useEffect } from "react";
import TodoForm from "./TodoForm";
import TodoList from "./TodoList";
import StatusBar from "./StatusBar";

interface Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  created_at: string;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);

  const fetchTodos = async () => {
    try {
      const response = await fetch("http://localhost:8000/tasks/");
      const data = await response.json();
      setTodos(data);
    } catch (err) {
      console.error("Error fetching todos:", err);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = async (title: string, description: string) => {
    try {
      const response = await fetch("http://localhost:8000/tasks/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      await fetchTodos();
    } catch (err) {
      console.error("Error adding todo:", err);
    }
  };

  const toggleTodoCompletion = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8000/tasks/${id}/toggle-complete`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      await fetchTodos();
    } catch (err) {
      console.error("Error toggling todo:", err);
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      await fetch(`http://localhost:8000/tasks/${id}`, {
        method: "DELETE",
      });
      await fetchTodos();
    } catch (err) {
      console.error("Error deleting todo:", err);
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
