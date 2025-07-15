import React from "react";
import TodoItem from "./TodoItem";

interface Todo {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  completed: boolean;
}

interface TodoListProps {
  todos: Todo[];
  onToggleComplete: (id: string) => void;
}

const TodoList = ({
  todos = [],
  onToggleComplete = () => {},
}: TodoListProps) => {
  // If there are no todos, show a message
  if (todos.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <p className="text-gray-500">
          No tasks yet. Add a new task to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Your Tasks</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            id={todo.id}
            title={todo.title}
            description={todo.description}
            createdAt={todo.createdAt}
            completed={todo.completed}
            onToggleComplete={onToggleComplete}
          />
        ))}
      </div>
    </div>
  );
};

export default TodoList;
