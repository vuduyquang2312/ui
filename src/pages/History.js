import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

const socket = io('http://192.168.1.6:5000');

const History = () => {
  const [totalOutbound, setTotalOutbound] = useState(0);
  const [totalInbound, setTotalInbound] = useState(0);

  useEffect(() => {
    socket.on('transactionsHistory', (data) => {
      console.log(data); // Kiểm tra dữ liệu nhận được
      const dailyData = {};
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();
      const firstDayOfMonth = new Date(currentYear, currentMonth - 1, 1);
      const lastDayOfMonth = new Date(currentYear, currentMonth, 0);
  
      for (let date = firstDayOfMonth; date <= lastDayOfMonth; date.setDate(date.getDate() + 1)) {
        const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
        dailyData[formattedDate] = { date: formattedDate, outbound: 0, inbound: 0 };
      }
  
      data.forEach((transaction) => {
        console.log(transaction.transactionDate); // Kiểm tra định dạng ngày
        const date = new Date(transaction.transactionDate);
        const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
        const debitAmount = parseFloat(transaction.debitAmount) || 0;
        const creditAmount = parseFloat(transaction.creditAmount) || 0;
        
        console.log('dailyData:', dailyData);

        if (dailyData[formattedDate]) {
          dailyData[formattedDate].outbound += debitAmount;
          dailyData[formattedDate].inbound += creditAmount;
        }
      });
  
      // Calculate the total outbound and inbound amounts
      const outbound = Object.values(dailyData).reduce((sum, transaction) => sum + transaction.outbound, 0);
      const inbound = Object.values(dailyData).reduce((sum, transaction) => sum + transaction.inbound, 0);
  
      setTotalOutbound(outbound);
      setTotalInbound(inbound);
  
      // Log the summarized data
      Object.values(dailyData).forEach(({ date, outbound, inbound }) => {
        const total = outbound + inbound;
        console.log(`Ngày: ${date}, Tổng số tiền chuyển: ${outbound}, Tổng số tiền nhận: ${inbound}, Tổng số tiền giao dịch: ${total}`);
      });
    });
  
    return () => {
      socket.off('transactionsHistory');
    };
  }, []);
  

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  return (
    <div className="p-2 md:flex">
      <div className="basis-1/4 p-4 bg-white rounded-xl">
        <div className="flex items-center w-full mb-4 md:p-4 p-2 border-b">
          <div className="w-1/2 flex justify-center">
            <FaArrowUp className="text-green-500 md:w-6 md:h-6 w-4 h-4 mr-4" />
          </div>
          <div className="flex-1 w-1/2 flex flex-col">
            <span className="text-xs md:text-base">{formatCurrency(totalOutbound)}</span>
            <span className="text-gray-400 md:text-sm text-xs mt-4">Tổng số tiền chuyển</span>
          </div>
        </div>

        <div className="flex items-center w-full mt-6 md:p-4 p-2">
          <div className="w-1/2 flex justify-center">
            <FaArrowDown className="text-red-500 md:w-6 md:h-6 w-4 h-4 mr-4" />
          </div>
          <div className="flex-1 flex flex-col">
            <span className="text-xs md:text-base">{formatCurrency(totalInbound)}</span>
            <span className="text-gray-400 md:text-sm text-xs mt-4">Tổng số tiền nhận</span>
          </div>
        </div>
      </div>

      <div className="basis-3/4 p-4 bg-white rounded-xl md:ml-2 mt-4 md:mt-0 shadow-md">
        <div className="flex justify-between items-center mb-4">
          <span className="text-center md:text-base text-xs ml-2">Biểu đồ thống kê giao dịch</span>
          <select className="p-2 border border-gray-300 rounded-md text-sm md:text-base">
            <option value="month">Tháng này</option>
            <option value="7days">7 Ngày gần đây</option>
          </select>
        </div>

        {/* Đây là nơi bạn sẽ thêm biểu đồ */}
        <div>
          {/* Biểu đồ thống kê sẽ hiển thị ở đây */}
        </div>
      </div>
    </div>
  );
};

export default History;
