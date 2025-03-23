import React, { useState } from "react";
import {
  Application,
  DisburseApplicationRequest,
  RepayApplicationRequest,
  CancelApplicationRequest,
  RejectApplicationRequest,
} from "../../types/application";
import { UserRole } from "../../types/user";
import { format } from "date-fns";
import { DisburseApplicationModal } from "../modals/DisburseApplicationModal";
import { RepayApplicationModal } from "../modals/RepayApplicationModal";

interface ApplicationCardProps {
  application: Application;
  userRole: UserRole;
  onDisburse: (data: DisburseApplicationRequest) => void;
  onRepay: (data: RepayApplicationRequest) => void;
  onCancel: (data: CancelApplicationRequest) => void;
  onReject: (data: RejectApplicationRequest) => void;
}

export const ApplicationCard: React.FC<ApplicationCardProps> = ({
  application,
  userRole,
  onDisburse,
  onRepay,
  onCancel,
  onReject,
}) => {
  const isAdmin = userRole === "admin";
  const canDisburse = application.applicationState === "open";
  const canRepay = application.applicationState === "outstanding";
  const canCancel = application.applicationState === "open";
  const canReject = isAdmin && application.applicationState === "open";
  const [isDisburseModalOpen, setIsDisburseModalOpen] = useState(false);
  const [isRepayModalOpen, setIsRepayModalOpen] = useState(false);

  return (
    <>
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold">
            Application #{application.applicationId.slice(0, 8)}
          </h3>
          <span
            className={`px-2 py-1 rounded text-sm ${
              application.applicationState === "open"
                ? "bg-blue-100 text-blue-800"
                : application.applicationState === "outstanding"
                ? "bg-yellow-100 text-yellow-800"
                : application.applicationState === "repaid"
                ? "bg-green-100 text-green-800"
                : application.applicationState === "cancelled"
                ? "bg-gray-100 text-gray-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {application.applicationState}
          </span>
        </div>

        <div className="space-y-2 text-sm">
          <p>User ID: {application.userId}</p>
          <p>Amount: ${application.requestedAmount.toFixed(2)}</p>
          <p>
            Due Date: {format(new Date(application.dueDate), "MMM d, yyyy")}
          </p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {canDisburse && (
            <button
              onClick={() => setIsDisburseModalOpen(true)}
              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
            >
              Disburse
            </button>
          )}

          {canRepay && (
            <button
              onClick={() => setIsRepayModalOpen(true)}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              Repay
            </button>
          )}

          {canCancel && (
            <button
              onClick={() =>
                onCancel({ applicationId: application.applicationId })
              }
              className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          )}

          {canReject && (
            <button
              onClick={() =>
                onReject({ applicationId: application.applicationId })
              }
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Reject
            </button>
          )}
        </div>
      </div>

      <DisburseApplicationModal
        isOpen={isDisburseModalOpen}
        onClose={() => setIsDisburseModalOpen(false)}
        onDisburse={onDisburse}
        applicationId={application.applicationId}
      />

      <RepayApplicationModal
        isOpen={isRepayModalOpen}
        onClose={() => setIsRepayModalOpen(false)}
        onRepay={onRepay}
        applicationId={application.applicationId}
        requestedAmount={application.requestedAmount}
      />
    </>
  );
};
