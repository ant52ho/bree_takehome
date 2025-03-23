import React, { useState } from "react";

interface DisburseApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDisburse: (data: {
    applicationId: string;
    expressDelivery?: boolean;
    tip?: number;
  }) => void;
  applicationId: string;
}

export const DisburseApplicationModal: React.FC<
  DisburseApplicationModalProps
> = ({ isOpen, onClose, onDisburse, applicationId }) => {
  const [expressDelivery, setExpressDelivery] = useState(false);
  const [tip, setTip] = useState<number | undefined>(undefined);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onDisburse({
      applicationId,
      expressDelivery,
      tip,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Disburse Application</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Express Delivery
            </label>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={expressDelivery}
                onChange={(e) => setExpressDelivery(e.target.checked)}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-600">
                Enable express delivery
              </span>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tip (Optional)
            </label>
            <input
              type="number"
              value={tip || ""}
              onChange={(e) =>
                setTip(e.target.value ? Number(e.target.value) : undefined)
              }
              min="0"
              step="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter tip amount"
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
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Disburse
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
