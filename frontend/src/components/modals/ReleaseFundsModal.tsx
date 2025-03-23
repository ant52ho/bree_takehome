import React, { useState } from "react";

interface ReleaseFundsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { count: number }) => void;
}

export const ReleaseFundsModal: React.FC<ReleaseFundsModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [count, setCount] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ count });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Release Scheduled Funds</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Applications
            </label>
            <input
              type="number"
              value={count || ""}
              onChange={(e) =>
                setCount(parseInt(e.target.value === "" ? "0" : e.target.value))
              }
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Release Funds
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
