import React from "react";
import { Card, CardContent } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { format } from "date-fns";

interface TodoItemProps {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
  onToggleComplete: (id: string) => void;
}

const TodoItem = ({
  id,
  title,
  description,
  completed,
  createdAt,
  onToggleComplete = () => {},
}: TodoItemProps) => {
  const formattedDate = createdAt
    ? format(new Date(createdAt), "MMM dd, yyyy")
    : "Date unavailable";

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
              {description || "No description provided"}
            </p>
            <p className="text-xs text-gray-500">Created: {formattedDate}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TodoItem;
