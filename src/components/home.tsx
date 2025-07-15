import React, { useState } from "react";
import TodoForm from "./TodoForm";
import TodoList from "./TodoList";
import StatusBar from "./StatusBar";

interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([
    {
      id: "1",
      title: "Complete project proposal",
      description: "Finish the draft and send it to the team for review",
      completed: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      title: "Buy groceries",
      description: "Milk, eggs, bread, and vegetables",
      completed: true,
      createdAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    },
    {
      id: "3",
      title: "Schedule dentist appointment",
      description: "Call Dr. Smith for a checkup",
      completed: false,
      createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    },
  ]);

  const addTodo = (title: string, description: string) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      title,
      description,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTodos([newTodo, ...todos]);
  };

  const toggleTodoCompletion = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
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
          <TodoList todos={todos} onToggleComplete={toggleTodoCompletion} />
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
