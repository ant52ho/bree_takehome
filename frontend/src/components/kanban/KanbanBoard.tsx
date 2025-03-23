import React from "react";
import {
  Application,
  DisburseApplicationRequest,
  RepayApplicationRequest,
  CancelApplicationRequest,
  RejectApplicationRequest,
} from "../../types/application";
import { UserRole } from "../../types/user";
import { KanbanColumn } from "./KanbanColumn";

interface KanbanBoardProps {
  applications: Application[];
  userRole: UserRole;
  onDisburse: (data: DisburseApplicationRequest) => void;
  onRepay: (data: RepayApplicationRequest) => void;
  onCancel: (data: CancelApplicationRequest) => void;
  onReject: (data: RejectApplicationRequest) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  applications,
  userRole,
  onDisburse,
  onRepay,
  onCancel,
  onReject,
}) => {
  const columns = [
    {
      title: "Open",
      state: "open" as const,
      applications: applications.filter(
        (app) => app.applicationState === "open"
      ),
    },
    {
      title: "Outstanding",
      state: "outstanding" as const,
      applications: applications.filter(
        (app) => app.applicationState === "outstanding"
      ),
    },
    {
      title: "Repaid",
      state: "repaid" as const,
      applications: applications.filter(
        (app) => app.applicationState === "repaid"
      ),
    },
    {
      title: "Cancelled",
      state: "cancelled" as const,
      applications: applications.filter(
        (app) => app.applicationState === "cancelled"
      ),
    },
    {
      title: "Rejected",
      state: "rejected" as const,
      applications: applications.filter(
        (app) => app.applicationState === "rejected"
      ),
    },
  ];

  return (
    <div className="flex gap-4 overflow-x-auto p-4">
      {columns.map(({ title, applications: columnApplications }) => (
        <KanbanColumn
          key={title}
          title={title}
          applications={columnApplications}
          userRole={userRole}
          onDisburse={onDisburse}
          onRepay={onRepay}
          onCancel={onCancel}
          onReject={onReject}
        />
      ))}
    </div>
  );
};
