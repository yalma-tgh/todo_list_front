import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

interface TodoFormProps {
  onAddTodo: (title: string, description: string) => void;
}

const TodoForm = ({ onAddTodo = () => {} }: TodoFormProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAddTodo(title, description);
      setTitle("");
      setDescription("");
    }
  };

  return (
    <Card className="w-full bg-white shadow-sm mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-medium">Add New Task</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title
            </label>
            <Input
              id="title"
              placeholder="Enter task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              placeholder="Enter task description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full min-h-[80px]"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white"
            disabled={!title.trim()}
          >
            Add Task
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default TodoForm;
