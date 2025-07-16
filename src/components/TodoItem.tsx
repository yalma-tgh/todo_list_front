import React from "react";
import { Card, CardContent } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";

interface TodoItemProps {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  createdAt: string;
  onToggleComplete: (id: number) => void;
  onDelete: (id: number) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({
  id,
  title,
  description,
  completed,
  createdAt,
  onToggleComplete,
  onDelete,
}) => {
  return (
    <Card className="bg-white w-full h-full transition-all hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Checkbox
            id={`todo-${id}`}
            checked={completed}
            onCheckedChange={() => onToggleComplete(id)}
            className="mt-1"
          />
          <div className="flex-1">
            <h3
              className={`text-lg font-medium mb-1 ${completed ? "line-through text-gray-400" : "text-gray-800"}`}
            >
              {title || "Untitled Task"}
            </h3>
            <p
              className={`text-sm mb-2 ${completed ? "line-through text-gray-400" : "text-gray-600"}`}
            >
              {description || "No description"}
            </p>
            <p className="text-xs text-gray-500">Created: {createdAt}</p>
          </div>
          <Button variant="destructive" size="sm" onClick={() => onDelete(id)}>
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TodoItem;
