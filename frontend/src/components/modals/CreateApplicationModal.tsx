import React, { useState } from "react";
import { CreateApplicationRequest } from "../../types/application";
import { User } from "../../types/user";

interface CreateApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateApplicationRequest) => Promise<void>;
  users: User[];
}

export const CreateApplicationModal: React.FC<CreateApplicationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  users,
}) => {
  const [formData, setFormData] = useState<CreateApplicationRequest>({
    userId: "",
    requestedAmount: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.userId || !formData.requestedAmount) {
      return;
    }
    await onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Create New Application</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              User
            </label>
            <select
              value={formData.userId}
              onChange={(e) =>
                setFormData({ ...formData, userId: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select a user</option>
              {users.map((user) => (
                <option key={user.userId} value={user.userId}>
                  {user.userId} (Limit: ${user.creditLimit})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Requested Amount
            </label>
            <input
              type="number"
              value={formData.requestedAmount || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  requestedAmount:
                    e.target.value === "" ? 0 : Number(e.target.value),
                })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              min="0"
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!formData.userId || !formData.requestedAmount}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
