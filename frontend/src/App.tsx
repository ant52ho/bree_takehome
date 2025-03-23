import React, { useState, useEffect } from "react";
import { UserRole, User, CreateUserRequest } from "./types/user";
import {
  CreateApplicationRequest,
  DisburseApplicationRequest,
  RepayApplicationRequest,
  CancelApplicationRequest,
  RejectApplicationRequest,
  ReleaseFundsRequest,
} from "./types/application";
import { KanbanBoard } from "./components/kanban/KanbanBoard";
import { CreateUserModal } from "./components/modals/CreateUserModal";
import { CreateApplicationModal } from "./components/modals/CreateApplicationModal";
import { ReleaseFundsModal } from "./components/modals/ReleaseFundsModal";
import { ViewUserApplicationsModal } from "./components/modals/ViewUserApplicationsModal";
import { useApplications } from "./hooks/useApplications";
import { useUsers } from "./hooks/useUsers";
import { authApi } from "./services/api";
import { applicationsApi } from "./services/api";

function App() {
  const [userRole, setUserRole] = useState<UserRole>("customer");
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
  const [isCreateApplicationModalOpen, setIsCreateApplicationModalOpen] =
    useState(false);
  const [isReleaseFundsModalOpen, setIsReleaseFundsModalOpen] = useState(false);
  const [isViewUserApplicationsModalOpen, setIsViewUserApplicationsModalOpen] =
    useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    applications,
    loading: applicationsLoading,
    error: applicationsError,
    createApplication,
    disburseApplication,
    repayApplication,
    cancelApplication,
    rejectApplication,
    loadApplications,
  } = useApplications();

  const {
    users,
    loading: usersLoading,
    error: usersError,
    createUser,
    loadUsers,
  } = useUsers();

  useEffect(() => {
    loadUsers();
    loadApplications();
  }, [loadUsers, loadApplications]);

  const handleRoleChange = async (newRole: UserRole) => {
    try {
      const token = await authApi.generateToken(newRole);
      localStorage.setItem("authToken", token);
      setUserRole(newRole);
      // Reload data with new role
      loadUsers();
    } catch (error) {
      console.error("Failed to generate token:", error);
    }
  };

  const handleCreateUser = async (data: CreateUserRequest) => {
    await createUser(data);
  };

  const handleCreateApplication = async (data: CreateApplicationRequest) => {
    await createApplication(data);
    await loadApplications();
  };

  const handleDisburse = async (data: DisburseApplicationRequest) => {
    await disburseApplication(data);
    await loadApplications();
  };

  const handleRepay = async (data: RepayApplicationRequest) => {
    await repayApplication(data);
    await loadApplications();
  };

  const handleCancel = async (data: CancelApplicationRequest) => {
    await cancelApplication(data);
  };

  const handleReject = async (data: RejectApplicationRequest) => {
    await rejectApplication(data);
  };

  const handleReleaseFunds = async (data: ReleaseFundsRequest) => {
    await applicationsApi.releaseFunds(data);
    await loadApplications();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Line of Credit Dashboard
            </h1>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Role:</span>
              <select
                value={userRole}
                onChange={(e) => handleRoleChange(e.target.value as UserRole)}
                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="customer">Customer</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <div className="flex space-x-4">
            {userRole === "admin" && (
              <button
                onClick={() => setIsReleaseFundsModalOpen(true)}
                className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700"
              >
                Release Scheduled Funds
              </button>
            )}
            <button
              onClick={() => setIsViewUserApplicationsModalOpen(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              View User Applications
            </button>
            <button
              onClick={() => setIsCreateUserModalOpen(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
            >
              Create User
            </button>
            <button
              onClick={() => setIsCreateApplicationModalOpen(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Create Application
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {applicationsError && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{applicationsError}</p>
                {applicationsError !== "Failed to load application history" && (
                  <p className="text-sm text-red-600 mt-1">
                    Please try again or contact support if the issue persists.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-green-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">{successMessage}</p>
              </div>
            </div>
          </div>
        )}

        {applicationsLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        ) : (
          <KanbanBoard
            applications={applications}
            userRole={userRole}
            onDisburse={handleDisburse}
            onRepay={handleRepay}
            onCancel={handleCancel}
            onReject={handleReject}
          />
        )}
      </main>

      <CreateUserModal
        isOpen={isCreateUserModalOpen}
        onClose={() => setIsCreateUserModalOpen(false)}
        onSubmit={handleCreateUser}
      />

      <CreateApplicationModal
        isOpen={isCreateApplicationModalOpen}
        onClose={() => setIsCreateApplicationModalOpen(false)}
        onSubmit={handleCreateApplication}
        users={users}
      />

      <ReleaseFundsModal
        isOpen={isReleaseFundsModalOpen}
        onClose={() => setIsReleaseFundsModalOpen(false)}
        onSubmit={handleReleaseFunds}
      />

      <ViewUserApplicationsModal
        isOpen={isViewUserApplicationsModalOpen}
        onClose={() => setIsViewUserApplicationsModalOpen(false)}
        users={users}
        applications={applications}
      />
    </div>
  );
}

export default App;
