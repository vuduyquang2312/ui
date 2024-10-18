import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { GrMoney } from "react-icons/gr";
import { GrTransaction } from "react-icons/gr";
import { MdInsertChartOutlined } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { motion } from "framer-motion";
const socket = io('http://192.168.1.6:5000');

const TransactionDetailsModal = ({ isOpen, onClose, transaction }) => {
  if (!isOpen) return null;

  const isInbound = transaction.creditAmount > 0;

  // Hàm xử lý mô tả
  const sanitizeDescription = (description) => {
    // Loại bỏ từ "CUSTOMER" nếu có
    const sanitizedDescription = description.replace(/CUSTOMER/g, "");

    // Kiểm tra các ký tự đặc biệt và chỉ lấy phần trước chúng
    const regex = /[-.:]/;
    const match = sanitizedDescription.match(regex);

    if (match) {
      return sanitizedDescription.substring(0, match.index);
    }

    // Nếu không có ký tự đặc biệt, trả về chuỗi đã loại bỏ "CUSTOMER"
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
        className="bg-white p-6 rounded-xl shadow-lg max-w-md text-xs md:text-sm w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold mb-4 text-center text-gray-800 border-b border-gray-300 pb-2">
          {isInbound ? "Nhận tiền" : "Chuyển tiền"}
        </h2>
        <div className="space-y-4 text-gray-700">
          {/* Số tiền */}
          <div className="flex justify-between w-full border-b pb-4">
            <span className="text-gray-600">Số tiền:</span>
            <span className="text-gray-800">{isInbound ? transaction.creditAmount.toLocaleString() + 'đ' : transaction.debitAmount.toLocaleString() + 'đ'}</span>
          </div>
          {/* Thời gian */}
          <div className="flex justify-between w-full border-b pb-4">
            <span className="text-gray-600">Thời gian:</span>
            <span className="text-gray-800">{transaction.time}</span>
          </div>
          {/* Nội dung */}
          <div className="flex justify-between w-full border-b pb-4">
            <span className="text-gray-600">Nội dung:</span>
            <span className="text-gray-800">{sanitizeDescription(transaction.description)}</span>
          </div>
          {/* Mã giao dịch */}
          <div className="flex justify-between w-full border-b pb-4">
            <span className="text-gray-600">Mã giao dịch:</span>
            <span className="text-gray-800">{transaction.transactionId}</span>
          </div>
          {/* Nếu là chuyển tiền thì hiển thị thêm tài khoản và ngân hàng */}
          {!isInbound && (
            <div className="flex justify-between w-full border-b pb-4">
              <span className="text-gray-600">Tới tài khoản:</span>
              <span className="text-gray-800">{transaction.noidung}</span>
            </div>
          )}
          {/* Các thông tin khác nếu cần */}
          <div className="flex justify-between w-full border-b pb-4">
            <span className="text-gray-600">Loại giao dịch:</span>
            <span className="text-gray-800">{transaction.type}</span>
          </div>
        </div>
        <button
          className="mt-4 bg-gradient-to-r from-indigo-500 to-blue-500 text-white px-4 py-2 rounded-lg hover:from-indigo-600 hover:to-blue-600 transition-all duration-300 ease-in-out"
          onClick={onClose}
        >
          Đóng
        </button>
      </motion.div>
    </motion.div>

  );
};



const Account = () => {
  const [accountInfo, setAccountInfo] = useState({
    balance: 0,
    accountName: "",
    accountNumber: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageInbound, setCurrentPageInbound] = useState(1); // Thêm state cho bảng nhận tiền
  const [currentPageOutbound, setCurrentPageOutbound] = useState(1); // Thêm state cho bảng chuyển tiền
  const itemsPerPage = 5;
  const [totalBalance, setTotalBalance] = useState(0);

  const [transactionHistory, setTransactionHistory] = useState([]);
  const [inboundTransactions, setInboundTransactions] = useState([]); // Giao dịch nhận tiền
  const [outboundTransactions, setOutboundTransactions] = useState([]); // Giao dịch chuyển tiền
  const [totalInbound, setTotalInbound] = useState(0); // Tổng số tiền nhận
  const [totalOutbound, setTotalOutbound] = useState(0); // Tổng số tiền chuyển
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (transaction) => {
    console.log('Opening modal for transaction:', transaction);
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
  };

  const paginateData = (data, currentPage) => {
    if (window.innerWidth >= 768) {  // Assuming 768px is the breakpoint for md
      return data;  // Return all data for PC
    }
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

  const totalPages = (data) => Math.ceil(data.length / itemsPerPage);

  const renderPagination = (data, currentPage, setCurrentPage) => {
    const pages = totalPages(data); // Tổng số trang
    const visiblePages = 5; // Số nút trang hiển thị

    const getPaginationButtons = () => {
      let buttons = [];

      // Nếu tổng số trang nhỏ hơn hoặc bằng số nút hiển thị
      if (pages <= visiblePages) {
        for (let i = 1; i <= pages; i++) {
          buttons.push(
            <motion.button
              key={i}
              onClick={() => setCurrentPage(i)}
              className={`px-3 text-xs my-4 py-1 rounded transition-all duration-300 ${currentPage === i ? 'bg-blue-500 text-white' : 'bg-white text-black hover:bg-blue-200'}`}
            >
              {i}
            </motion.button>
          );
        }
      } else {
        // Hiển thị các nút phân trang với dấu "..." khi số trang lớn hơn visiblePages
        if (currentPage <= 2) {
          // Nếu trang hiện tại gần đầu
          for (let i = 1; i <= visiblePages - 1; i++) {
            buttons.push(
              <motion.button
                key={i}
                onClick={() => setCurrentPage(i)}
                className={`px-3 my-4 text-xs py-1 rounded transition-all duration-300 ${currentPage === i ? 'bg-blue-500 text-white' : 'bg-white text-black hover:bg-blue-200'}`}
              >
                {i}
              </motion.button>
            );
          }
          buttons.push(<span key="dots" className="px-3 my-4 py-1">...</span>);
          buttons.push(
            <motion.button
              key={pages}
              onClick={() => setCurrentPage(pages)}
              className="px-3 text-xs my-4 py-1 rounded bg-white text-black hover:bg-blue-200"
            >
              {pages}
            </motion.button>
          );
        } else if (currentPage > 2 && currentPage < pages - 2) {
          // Nếu trang hiện tại ở giữa
          buttons.push(
            <motion.button
              key={1}
              onClick={() => setCurrentPage(1)}
              className="px-3 my-4 py-1 rounded bg-white text-black hover:bg-blue-200"
            >
              1
            </motion.button>
          );
          buttons.push(<span key="dots-start" className="px-3 my-4 py-1">...</span>);
          for (let i = currentPage - 1; i <= currentPage + 1; i++) {
            buttons.push(
              <motion.button
                key={i}
                onClick={() => setCurrentPage(i)}
                className={`px-3 my-4 py-1 rounded transition-all duration-300 ${currentPage === i ? 'bg-blue-500 text-white' : 'bg-white text-black hover:bg-blue-200'}`}
              >
                {i}
              </motion.button>
            );
          }
          buttons.push(<span key="dots-end" className="px-3 my-4 py-1">...</span>);
          buttons.push(
            <motion.button
              key={pages}
              onClick={() => setCurrentPage(pages)}
              className="px-3 my-4 py-1 rounded bg-white text-black hover:bg-blue-200"
            >
              {pages}
            </motion.button>
          );
        } else {
          // Nếu trang hiện tại gần cuối
          buttons.push(
            <motion.button
              key={1}
              onClick={() => setCurrentPage(1)}
              className="px-3 my-4 py-1 rounded bg-white text-black hover:bg-blue-200"
            >
              1
            </motion.button>
          );
          buttons.push(<span key="dots" className="px-3 my-4 py-1">...</span>);
          for (let i = pages - (visiblePages - 2); i <= pages; i++) {
            buttons.push(
              <motion.button
                key={i}
                onClick={() => setCurrentPage(i)}
                className={`px-3 my-4 py-1 rounded transition-all duration-300 ${currentPage === i ? 'bg-blue-500 text-white' : 'bg-white text-black hover:bg-blue-200'}`}
              >
                {i}
              </motion.button>
            );
          }
        }
      }

      return buttons;
    };

    return <div className="flex justify-center mt-4 space-x-2">{getPaginationButtons()}</div>;
  };



  useEffect(() => {
    socket.on('bankInfo', (data) => {
      if (data.totalBalance) {
        setAccountInfo((prevInfo) => ({
          ...prevInfo,
          balance: data.totalBalance,
          accountName: data.name,
          accountNumber: data.number,


        }));
      }
    });

    socket.on('transactionsHistory', (data) => {
      // Lọc và định dạng dữ liệu giao dịch
      const formattedTransactions = data?.map((transaction, index) => {
        const debitAmount = parseFloat(transaction.debitAmount) || 0;
        const creditAmount = parseFloat(transaction.creditAmount) || 0;
        const netAmount = creditAmount - debitAmount;
        return {
          key: index + 1,
          amount: `${(creditAmount - debitAmount).toLocaleString('vi-VN')}đ`,
          transactionId: transaction.refNo,
          time: transaction.transactionDate,
          type: transaction.type,
          noidung: transaction.toAccountName,
          description: transaction.transactionDesc,
          debitAmount,
          creditAmount,
          netAmount,
        };
      }) || [];

      setTransactionHistory(formattedTransactions);

      // Phân loại giao dịch thành nhận tiền và chuyển tiền
      const outbound = formattedTransactions.filter(transaction => transaction.debitAmount > 0);
      const inbound = formattedTransactions.filter(transaction => transaction.creditAmount > 0);
      const total = inbound.reduce((sum, transaction) => sum + transaction.creditAmount, 0) - outbound.reduce((sum, transaction) => sum + transaction.debitAmount, 0);
      setOutboundTransactions(outbound);
      setInboundTransactions(inbound);


      setTotalBalance(total);
      // Tính tổng số tiền nhận và số tiền chuyển
      const totalInboundAmount = formattedTransactions.reduce((total, transaction) => total + transaction.creditAmount, 0);
      const totalOutboundAmount = formattedTransactions.reduce((total, transaction) => total + transaction.debitAmount, 0);

      setTotalInbound(totalInboundAmount);
      setTotalOutbound(totalOutboundAmount);
    });


    // Dọn dẹp sự kiện khi component unmount
    return () => {
      socket.off('bankInfo');
      socket.off('transactionHistory');
    };
  }, []);


  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col mt-2 md:mt-0 md:flex-row text-white text-base">
        <div className="w-full md:w-1/4 md:p-4 px-2 rounded-xl h-full">
          <div className="flex flex-col justify-between p-8 rounded-xl text-black bg-white border border-gray-200 text-center h-full">
            <span className="flex justify-center mb-4 text-xs p-2 rounded-xl md:text-sm bg-blue-100 text-blue-600">
              <GrMoney className="mr-2 text-xs md:text-sm" />
              Thông tin tài khoản
            </span>
            <p className="mb-8 text-xs md:text-sm flex justify-between p-1 border-b border-gray-300">
              <span className="text-gray-500">Số dư:</span>
              <span className="text-gray-500">{formatCurrency(accountInfo.balance)}</span>
            </p>
            <p className="mb-8 text-xs md:text-sm flex justify-between p-1 border-b border-gray-300">
              <span className="text-gray-500">Tên tài khoản:</span>
              <span className="text-gray-500">{accountInfo.accountName}</span>
            </p>
            <p className="flex justify-between text-xs md:text-sm p-1 border-b border-gray-300">
              <span className="text-gray-500">Số tài khoản:</span>
              <span className="text-gray-500">{accountInfo.accountNumber}</span>
            </p>
          </div>

          <div className="p-6 overflow-x-auto mt-4 bg-white h-full text-gray-500 rounded-xl border border-gray-200 flex flex-col">
            <div className="flex items-center justify-center my-2 bg-green-100 text-green-600 p-2 rounded-lg">
              <MdInsertChartOutlined className="mr-2 text-xs md:text-sm" />
              <span className="text-xs md:text-sm">Thống kê giao dịch</span>
            </div>
            <div className="flex text-xs flex-col md:text-sm">
              <div className="flex justify-between p-4 text-center border-b border-gray-300">
                <span className="text-gray-500">Chuyển</span>
                <span className="text-red-700">{formatCurrency(totalOutbound)}</span>
              </div>
              <div className="flex justify-between p-4 text-center border-b border-gray-300">
                <span className="text-gray-500">Nhận</span>
                <span className="text-green-700">{formatCurrency(totalInbound)}</span>
              </div>
              <div className="flex justify-between p-4 text-center border-b border-gray-300">
                <span className="text-gray-500">Lời/Lỗ</span>
                <span className={` ${totalBalance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {formatCurrency(totalBalance)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full md:w-3/4 md:p-4 mt-4 md:mt-0 px-2 rounded-xl h-full">


          <div className="bg-white border rounded-xl">
            {/* Div chứa tiêu đề "Giao dịch hôm nay" */}
            <div className="text-xs md:text-sm flex items-center justify-center p-4 text-purple-600 rounded-t-xl bg-purple-300 md:mb-3 mb-2">
              <GrTransaction className="mr-2 text-xs md:text-sm" />
              <span>Giao dịch hôm nay</span>
            </div>

            {/* Thẻ div chứa table cuộn ngang */}
            <div className="overflow-x-auto md:overflow-y-auto md:h-[477px] p-2">
              {transactionHistory.length > 0 ? (
                <div>
                  <table className="w-full table-auto">
                    <thead>
                      <tr className="text-gray-500 font-normal">
                        <th className="p-4 text-xs md:text-sm text-center">STT</th>
                        <th className="p-4 text-xs md:text-sm text-center">Số tiền</th>
                        <th className="p-4 text-xs md:text-sm text-center">Mã GD</th>
                        <th className="p-4 text-xs md:text-sm text-center">Thời gian</th>
                        <th className="p-4 text-xs md:text-sm text-center">Chi tiết</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginateData(transactionHistory, currentPage).map((item) => (
                        <tr key={item.key}>
                          <td className="p-4 text-xs md:text-sm text-center border-b text-gray-500 border-gray-200">{item.key}</td>
                          <td className="p-4 text-xs md:text-sm text-center border-b text-gray-500 border-gray-200">{item.amount}</td>
                          <td className="p-4 text-xs md:text-sm text-center border-b text-gray-500 border-gray-200">{item.transactionId}</td>
                          <td className="p-4 text-xs md:text-sm text-center border-b text-gray-500 border-gray-200">{item.time}</td>
                          <td className="px-8 text-xs md:text-sm text-center border-b text-gray-500 border-gray-200">
                            <span className="flex justify-center">
                              <FaEye className="text-[#ad0fc2b3] text-base cursor-pointer" onClick={() => handleOpenModal(item)} />
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="md:hidden">
                    {renderPagination(transactionHistory, currentPage, setCurrentPage)}
                  </div>
                </div>
              ) : (
                <p className="text-center text-xs text-[#393b3a]">Bạn chưa có giao dịch nào</p>
              )}
            </div>
          </div>


        </div>




      </div>
      <div className="flex flex-col md:px-2 mt-4 md:mt-0 md:flex-row">
        <div className="w-full md:w-1/2  px-2 font-light rounded-t-xl text-xs md:text-base ">

          <div className="overflow-y-auto md:max-h-[650px] bg-[#ffffff] rounded-t-xl border text-black">
        {/* <div className="text-xs md:text-sm flex items-center justify-center p-4 text-purple-600 rounded-t-xl bg-purple-300 md:mb-3 mb-2"> */}
            <div className="text-xs md:text-sm flex items-center justify-center rounded-t-xl p-4 text-blue-600 bg-blue-300   transition-shadow duration-300 ease-in-out">
              <GrTransaction className="mr-2 text-xs md:text-sm" />
              <span>Giao dịch nhận tiền</span>
            </div>

            {inboundTransactions.length > 0 ? (
              <div className='overflow-x-auto md:overflow-y-auto'>
                <table className="w-full table-auto">
                  <thead>
                    <tr className="font-light text-gray-500">
                      <th className="p-4 text-xs md:text-sm text-center">STT</th>
                      <th className="p-4 text-xs md:text-sm text-center">Số tiền</th>
                      <th className="p-4 text-xs md:text-sm text-center">Mã GD</th>
                      <th className="p-4 text-xs md:text-sm text-center">Thời gian</th>
                      <th className="p-4 text-xs md:text-sm text-center">Chi tiết</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginateData(inboundTransactions, currentPageInbound).map((item, index) => (
                      <tr key={item.key}>
                        <td className="p-4 text-xs  text-center border-b text-gray-500 border-gray-200">{index + 1}</td>
                        <td className="p-4 text-xs md:text-sm text-center text-gray-500 border-b border-gray-200">{item.amount}</td>
                        <td className="p-4 text-xs md:text-sm text-center text-gray-500 border-b border-gray-200">{item.transactionId}</td>
                        <td className="p-4 text-xs md:text-sm text-center text-gray-500 border-b border-gray-200">{item.time}</td>
                        <td className="px-8 text-xs md:text-sm text-center border-b text-gray-500 border-gray-200">
                            <span className="flex justify-center">
                              <FaEye className="text-[#ad0fc2b3] text-base cursor-pointer" onClick={() => handleOpenModal(item)} />
                            </span>
                          </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="md:hidden">
                  {renderPagination(inboundTransactions, currentPageInbound, setCurrentPageInbound)}
                </div>
              </div>
            ) : (
              <p className="text-center text-xs text-white">Bạn chưa có giao dịch nào</p>
            )}
          </div>
        </div>

        <div className="w-full md:w-1/2 mt-4 md:mt-0  px-2 font-light rounded-xl text-xs md:text-base">

          <div className="overflow-y-auto md:max-h-[650px] bg-[#ffffff] border text-black rounded-xl">

            <div className="text-xs md:text-sm flex items-center justify-center rounded-t-xl p-4 text-green-600 bg-green-300   transition-shadow duration-300 ease-in-out">
              <GrTransaction className="mr-2 text-xs md:text-sm" />
              <span>Giao dịch chuyển tiền</span>
            </div>

            {outboundTransactions.length > 0 ? (
              <div className='overflow-x-auto md:overflow-y-auto'>
                <table className="w-full table-auto">
                  <thead>
                    <tr className="font-light text-gray-500">
                      <th className="p-4 text-xs md:text-sm  text-center">STT</th>
                      <th className="p-4 text-xs md:text-sm text-center">Số tiền</th>
                      <th className="p-4 text-xs md:text-sm text-center">Mã GD</th>
                      <th className="p-4 text-xs md:text-sm text-center">Thời gian</th>
                      <th className="p-4 text-xs md:text-sm text-center">Chi tiết</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginateData(outboundTransactions, currentPageOutbound).map((item, index) => (
                      <tr key={item.key} className='text-gray-500'>
                        <td className="p-4 text-xs md:text-sm text-center border-b border-gray-200">{index + 1}</td>
                        <td className="p-4 text-xs md:text-sm text-center border-b border-gray-200">{item.amount}</td>
                        <td className="p-4 text-xs md:text-sm text-center border-b border-gray-200">{item.transactionId}</td>
                        <td className="p-4 text-xs md:text-sm text-center border-b border-gray-200">{item.time}</td>
                        <td className="px-8 text-xs md:text-sm text-center border-b text-gray-400 border-gray-200">
                            <span className="flex justify-center">
                              <FaEye className="text-[#ad0fc2b3] text-base cursor-pointer" onClick={() => handleOpenModal(item)} />
                            </span>
                          </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="md:hidden">
                  {renderPagination(outboundTransactions, currentPageOutbound, setCurrentPageOutbound)}
                </div>
              </div>
            ) : (
              <p className="text-center text-xs text-white">Bạn chưa có giao dịch nào</p>
            )}
          </div>
        </div>
      </div>
      <TransactionDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        transaction={selectedTransaction}
      />
    </motion.div>
  );
};

export default Account;