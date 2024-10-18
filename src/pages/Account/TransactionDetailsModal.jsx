import React from 'react';
import { motion } from "framer-motion";

const TransactionDetailsModal = ({ isOpen, onClose, transaction }) => {
  if (!isOpen) return null;

  const isInbound = transaction.creditAmount > 0;

  const sanitizeDescription = (description) => {
    // Remove "CUSTOMER" from the description
    const sanitizedDescription = description.replace(/CUSTOMER/g, "");
  
    // Check for special characters and only take the part before them
    const regex = /[-.:]/;
    const match = sanitizedDescription.match(regex);
    
    if (match) {
      return sanitizedDescription.substring(0, match.index);
    }
    
    // If no special characters, return the sanitized description
    return sanitizedDescription;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        className="bg-white p-6 rounded-lg max-w-md text-xs md:text-sm w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold mb-4 text-center text-[#393b3a] border-b border-gray-300 p-2">
          {isInbound ? "Nhận tiền" : "Chuyển tiền"}
        </h2>
        <div className="space-y-4 text-[#393b3a]">
          <div className="flex justify-between w-full border-b pb-4">
            <strong>Số tiền:</strong>
            <span>{isInbound ? transaction.creditAmount.toLocaleString() + 'đ' : transaction.debitAmount.toLocaleString() + 'đ'}</span>
          </div>
          <div className="flex justify-between w-full border-b pb-4">
            <strong>Thời gian:</strong>
            <span>{transaction.time}</span>
          </div>
          <div className="flex justify-between w-full border-b pb-4">
            <strong>Nội dung:</strong>
            <span>{sanitizeDescription(transaction.description)}</span>
          </div>
          <div className="flex justify-between w-full border-b pb-4">
            <strong>Mã giao dịch:</strong>
            <span>{transaction.transactionId}</span>
          </div>
          {!isInbound && (
            <div className="flex justify-between w-full border-b pb-4">
              <strong>Tới tài khoản:</strong>
              <span>{transaction.noidung}</span>
            </div>
          )}
          <div className="flex justify-between w-full border-b pb-4">
            <strong>Loại giao dịch:</strong>
            <span>{transaction.type}</span>
          </div>
        </div>
        <button
          className="mt-4 bg-[#879fff] text-white px-4 py-2 rounded hover:bg-[#6d8bff] w-full"
          onClick={onClose}
        >
          Đóng
        </button>
      </motion.div>
    </motion.div>
  );
};

export default TransactionDetailsModal;