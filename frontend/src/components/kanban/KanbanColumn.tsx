import React from "react";
import {
  Application,
  DisburseApplicationRequest,
  RepayApplicationRequest,
  CancelApplicationRequest,
  RejectApplicationRequest,
} from "../../types/application";
import { UserRole } from "../../types/user";
import { ApplicationCard } from "./ApplicationCard";

interface KanbanColumnProps {
  title: string;
  applications: Application[];
  userRole: UserRole;
  onDisburse: (data: DisburseApplicationRequest) => void;
  onRepay: (data: RepayApplicationRequest) => void;
  onCancel: (data: CancelApplicationRequest) => void;
  onReject: (data: RejectApplicationRequest) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  title,
  applications,
  userRole,
  onDisburse,
  onRepay,
  onCancel,
  onReject,
}) => {
  // sort by ascending due date
  const sortedApplications = applications.sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );
  return (
    <div className="flex-1 min-w-[300px] bg-gray-50 rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <div className="space-y-4">
        {sortedApplications.map((application) => (
          <ApplicationCard
            key={application.applicationId}
            application={application}
            userRole={userRole}
            onDisburse={onDisburse}
            onRepay={onRepay}
            onCancel={onCancel}
            onReject={onReject}
          />
        ))}
      </div>
    </div>
  );
};
