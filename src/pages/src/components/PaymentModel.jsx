import { useState } from "react";

export default function PaymentModal({ onClose, onConfirm }) {
  const [selected, setSelected] = useState("");

  // Updated payment options
  const paymentOptions = ["Debit Card", "Credit Card"];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <div className="bg-[#18181b] rounded-xl shadow-xl p-6 w-[350px]">
        <h2 className="text-xl font-bold text-white mb-4">
          Select Payment Method
        </h2>

        <div className="space-y-3">
          {paymentOptions.map((method) => (
            <label
              key={method}
              className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition ${
                selected === method
                  ? "border-blue-500 bg-blue-500/20"
                  : "border-gray-600 hover:border-blue-400"
              }`}
            >
              <input
                type="radio"
                name="payment"
                value={method}
                checked={selected === method}
                onChange={() => setSelected(method)}
                className="accent-blue-500"
              />
              <span className="text-white">{method}</span>
            </label>
          ))}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(selected)}
            disabled={!selected}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
