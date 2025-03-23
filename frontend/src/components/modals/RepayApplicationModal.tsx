import React, { useState } from "react";
import { RepayApplicationRequest } from "../../types/application";
interface RepayApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRepay: (data: RepayApplicationRequest) => void;
  applicationId: string;
  requestedAmount: number;
}

export const RepayApplicationModal: React.FC<RepayApplicationModalProps> = ({
  isOpen,
  onClose,
  onRepay,
  applicationId,
  requestedAmount,
}) => {
  const [amount, setAmount] = useState<number>(requestedAmount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRepay({
      applicationId,
      amount,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Repay Application</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount
            </label>
            <input
              type="number"
              value={amount || ""}
              onChange={(e) => setAmount(Number(e.target.value))}
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter amount to repay"
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
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Repay
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
