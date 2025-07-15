import React from "react";
import { Badge } from "./ui/badge";

interface StatusBarProps {
  pendingCount?: number;
  completedCount?: number;
}

const StatusBar = ({
  pendingCount = 0,
  completedCount = 0,
}: StatusBarProps) => {
  const totalCount = pendingCount + completedCount;

  return (
    <div className="w-full bg-background border-t py-3 px-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <span className="text-sm text-muted-foreground mr-2">Pending:</span>
          <Badge variant="secondary" className="bg-amber-100 text-amber-700">
            {pendingCount}
          </Badge>
        </div>
        <div className="flex items-center">
          <span className="text-sm text-muted-foreground mr-2">Completed:</span>
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            {completedCount}
          </Badge>
        </div>
      </div>
      <div className="text-sm text-muted-foreground">
        Total: {totalCount} {totalCount === 1 ? "task" : "tasks"}
      </div>
    </div>
  );
};

export default StatusBar;
