import React from 'react';
import { GrMoney } from "react-icons/gr";
import { MdInsertChartOutlined } from "react-icons/md";

const AccountInfo = ({ accountInfo, totalInbound, totalOutbound, totalBalance }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  return (
    <div className="w-full md:w-1/4 md:p-4 px-2 rounded-xl h-100">
      <div className="flex flex-col justify-between p-8 rounded-xl text-black bg-[#ffffff] border text-center">
        <span className='flex justify-center mb-4 text-xs p-2 rounded-xl md:text-sm'>
          <GrMoney className="mr-2 text-xs md:text-sm" />
          Thông tin tài khoản
        </span>
        <p className="mb-8 text-xs md:text-sm flex justify-between p-1 border-b border-gray-400">
          <span className='text-xs md:text-sm'>Số dư:</span>
          <span className="text-xs md:text-sm text-black">{formatCurrency(accountInfo.totalBalance)}</span>
        </p>
        <p className="mb-8 text-xs md:text-sm flex justify-between p-1 border-b border-gray-400">
          <span className='text-xs md:text-sm'>Tên tài khoản:</span>
          <span className="text-xs md:text-sm text-black">{accountInfo.accountName}</span>
        </p>
        <p className="flex justify-between p-1 border-b border-gray-400">
          <span className='text-xs md:text-sm'>Số tài khoản:</span>
          <span className="text-xs md:text-sm text-black">{accountInfo.accountNumber}</span>
        </p>
      </div>
      <div className='p-6 overflow-x-auto mt-1 bg-[#ffffff] h-100 text-black rounded-xl border flex flex-col'>
        <div className='flex items-center justify-center my-2'>
          <MdInsertChartOutlined className='mr-2 text-xs md:text-sm' />
          <span className='text-xs md:text-sm'>Thống kê giao dịch</span>
        </div>
        <div className='flex text-xs flex-col'>
          <div className='flex justify-between p-4 text-center border-b border-gray-400'>
            <span className='text-xs md:text-sm'>Chuyển</span>
            <span className='text-xs md:text-sm'>{formatCurrency(totalOutbound)}</span>
          </div>
          <div className='flex justify-between p-4 text-center border-b border-gray-400'>
            <span className='text-xs md:text-sm'>Nhận</span>
            <span className='text-xs md:text-sm'>{formatCurrency(totalInbound)}</span>
          </div>
          <div className='flex justify-between p-4 text-center border-b border-gray-400'>
            <span className='text-xs md:text-sm'>Lời/Lỗ</span>
            <span className='text-xs md:text-sm'>{formatCurrency(totalBalance)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountInfo;