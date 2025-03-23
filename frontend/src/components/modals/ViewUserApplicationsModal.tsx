import React from "react";
import { Application } from "../../types/application";
import { User } from "../../types/user";

interface ViewUserApplicationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  applications: Application[];
}

export const ViewUserApplicationsModal: React.FC<
  ViewUserApplicationsModalProps
> = ({ isOpen, onClose, users, applications }) => {
  const [selectedUserId, setSelectedUserId] = React.useState<string>("");

  const userApplications = applications.filter(
    (app) => app.userId === selectedUserId
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">View User Applications</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select User
          </label>
          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Select a user</option>
            {users.map((user) => (
              <option key={user.userId} value={user.userId}>
                User {user.userId.slice(0, 8)} ({user.userRole})
              </option>
            ))}
          </select>
        </div>

        {selectedUserId && (
          <div className="mt-4">
            <h3 className="text-lg font-medium mb-2">Applications</h3>
            <div className="space-y-4">
              {userApplications.length === 0 ? (
                <p className="text-gray-500">
                  No applications found for this user.
                </p>
              ) : (
                userApplications.map((app) => (
                  <div
                    key={app.applicationId}
                    className="border rounded-lg p-4 bg-gray-50"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Amount
                        </p>
                        <p className="text-lg">${app.requestedAmount}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Status
                        </p>
                        <p className="text-lg capitalize">
                          {app.applicationState}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Created At
                        </p>
                        <p className="text-lg">
                          {new Date(app.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Due Date
                        </p>
                        <p className="text-lg">
                          {new Date(app.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
