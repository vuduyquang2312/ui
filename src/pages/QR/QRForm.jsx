import React, { useState, useEffect } from 'react';
import { saveAs } from 'file-saver';
import { HiOutlineDownload } from "react-icons/hi";
import { IoIosWarning } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion"
import { FaCheck } from 'react-icons/fa';

export default function QRForm({ selectedOption, selectedTemplate }) {
    const [accountNumber, setAccountNumber] = useState('');
    const [amount, setAmount] = useState('');
    const [content, setContent] = useState('');
    const [money, setMoney] = useState(''); // Dữ liệu chưa định dạng
    const [receiverName, setReceiverName] = useState('');
    const [bankDetails, setBankDetails] = useState(null);
    const [logo, setLogo] = useState(null);
    const [qrLink, setQrLink] = useState(''); // State lưu link QR
    const [showTemplateWarning, setShowTemplateWarning] = useState(false);
    const [isDownloaded, setIsDownloaded] = useState(false);





    useEffect(() => {
        // Function to fetch the bank details from localStorage
        const fetchBankDetails = () => {
            const savedBank = localStorage.getItem('selectedBank');
            if (savedBank) {
                setBankDetails(JSON.parse(savedBank));
            }
            const saveLogo = localStorage.getItem('selectedBank');
            if (saveLogo) {
                setLogo(JSON.parse(saveLogo));
            }
        };

        // Initial fetch
        fetchBankDetails();

        // Set interval to fetch the bank details every 1 second (1000 ms)
        const intervalId = setInterval(fetchBankDetails, 1000);

        // Cleanup interval when component unmounts
        return () => {
            clearInterval(intervalId);
        };
    }, []);

    // Lấy selectedBank từ localStorage
    const selectedBank = JSON.parse(localStorage.getItem("selectedBank"));

    // Kiểm tra xem selectedBank có tồn tại và lấy bin từ đó
    const bankId = selectedBank ? selectedBank.bin : null;
    const logoBank = selectedBank ? selectedBank.logo : null;

    const formatMoney = (value) => {
        const numberValue = value.replace(/\D/g, ""); // Xóa tất cả ký tự không phải số
        return new Intl.NumberFormat("vi-VN").format(numberValue); // Định dạng theo chuẩn VND
    };

    const handleChange = (e) => {
        let value = e.target.value;
        value = value.replace(/[^0-9]/g, ""); // Loại bỏ ký tự không phải số
        setMoney(value); // Lưu giá trị chưa định dạng vào money
    };

    const handleBlur = () => {
        if (money) {
            setMoney(formatMoney(money)); // Định dạng tiền khi người dùng rời khỏi input
        }
    };

    const handleSubmit = () => {
        setIsDownloaded(false);
        if (!bankId) {
            alert("Không tìm thấy BANK_ID trong localStorage!");
            return;
        }
        if (!money) {
            const generatedQrLink = `https://img.vietqr.io/image/${bankId}-${amount}-${selectedTemplate}.png`;
            setQrLink(generatedQrLink);
        }
        else {
            // Tạo URL từ các giá trị đã nhập và BANK_ID từ localStorage
            const generatedQrLink = `https://img.vietqr.io/image/${bankId}-${amount}-${selectedTemplate}.png?amount=${money.replace(/\D/g, "")}&addInfo=${content}&accountName=${receiverName}`;
            setQrLink(generatedQrLink);
        }
    };

    const downloadQR = () => {
        setIsDownloaded(true);
        if (qrLink) {
            fetch(qrLink)
                .then((response) => response.blob())
                .then((blob) => {
                    saveAs(blob, 'QR_Code.png');
                })
                .catch((error) => {
                    console.error('Error downloading the QR image:', error);
                });
        }
        
    };

    return (
        <div className="mt-4 bg-white p-8 md:p-6 rounded-lg ">
            <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-1/2">
                    {selectedOption === "Mặc định" ? (
                        <div className="flex flex-col md:p-6 space-y-4 md:space-y-6">
                            <label className="block text-gray-500 text-xs md:text-sm">Chọn ngân hàng:</label>
                            <div className="relative">
                                <input
                                    className="border w-full border-gray-300 rounded-md py-2 px-4 text-xs md:text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                                    placeholder="Nhập tên ngân hàng/BIN"
                                    value={bankDetails ? bankDetails.name : accountNumber} // Sử dụng tên ngân hàng từ localStorage nếu có
                                    readOnly // Làm cho trường chỉ đọc
                                />
                                {logo && (
                                    <img
                                        src={logoBank}
                                        alt="Logo ngân hàng"
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 w-12 md:w-16 h-auto object-contain"
                                    />
                                )}
                            </div>
                            <label className="block text-gray-500 text-xs md:text-sm">Nhập số tài khoản:</label>
                            <input
                                className="border border-gray-300 rounded-md py-2 px-4 text-xs md:text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                                placeholder="Nhập số tài khoản"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                            <label className="block text-gray-500 text-xs md:text-sm">Template:</label>
                            <input
                                type="text"
                                value={selectedTemplate || ""}
                                readOnly
                                onFocus={() => setShowTemplateWarning(true)} // Hiển thị span khi focus
                                onBlur={() => setShowTemplateWarning(false)}
                                className="block w-full py-2 px-4 border text-xs md:text-sm border-gray-300 text-gray-500 rounded-md"
                            />
                            {showTemplateWarning && (
                                <span className='text-xs flex items-center md:text-sm text-red-400 pl-2'>
                                    <IoIosWarning className='mr-2' />
                                    Vui lòng nhấn cài đặt để tùy chỉnh template
                                </span>
                            )}
                            <button
                                onClick={handleSubmit}
                                className="mt-6 p-3 text-xs md:text-sm bg-green-300 text-gray-600 rounded-md  focus:outline-none focus:ring-4 focus:ring-green-300"
                            >
                                <motion.div
                                    whileHover={{ scale: 1.1 }} // Khi rê chuột, nút sẽ lớn lên 10%
                                    whileTap={{ scale: 0.95 }}  // Khi bấm vào nút, nút sẽ nhỏ lại 5%
                                >
                                    Xác nhận
                                </motion.div>
                            </button>

                        </div>
                    ) : (
                        <div className="flex flex-col space-y-4">
                            <label className="block text-gray-500 text-xs md:text-sm">Chọn ngân hàng:</label>
                            <div className="relative">
                                <input
                                    className="border w-full border-gray-300 rounded-md py-2 px-4 text-xs md:text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                                    placeholder="Nhập tên ngân hàng/BIN"
                                    value={bankDetails ? bankDetails.name : accountNumber} // Sử dụng tên ngân hàng từ localStorage nếu có
                                    readOnly // Làm cho trường chỉ đọc
                                />
                                {logo && (
                                    <img
                                        src={logoBank}
                                        alt="Logo ngân hàng"
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 w-12 md:w-16 h-auto object-contain"
                                    />
                                )}
                            </div>
                            <label className="block text-gray-500 text-xs md:text-sm">Nhập số tài khoản:</label>
                            <input
                                className="border border-gray-300 rounded-md py-2 px-4 text-xs md:text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                                placeholder="Nhập số tài khoản"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                            <label className="block text-gray-500 text-xs md:text-sm">Nhập số tiền:</label>
                            <input
                                className="border border-gray-300 rounded-md py-2 px-4 text-xs md:text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                                placeholder="Nhập số tiền"
                                value={money ? formatMoney(money) : ""}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                            <label className="block text-gray-500 text-xs md:text-sm">Nhập nội dung chuyển tiền:</label>
                            <input
                                className="border border-gray-300 rounded-md py-2 px-4 text-xs md:text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                                placeholder="Nhập nội dung chuyển tiền"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            />
                            <label className="block text-gray-500 text-xs md:text-sm">Nhập tên người nhận:</label>
                            <input
                                className="border border-gray-300 rounded-md py-2 px-4 text-xs md:text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                                placeholder="Nhập tên người nhận"
                                value={receiverName}
                                onChange={(e) => setReceiverName(e.target.value)}
                            />
                            <label className="block text-gray-500 text-xs md:text-sm">Template QR đã chọn:</label>
                            <input
                                type="text"
                                value={selectedTemplate || ""}
                                readOnly
                                className="block w-full py-2 px-4 border text-xs md:text-sm border-gray-300 text-gray-500 rounded-md"
                            />
                            <button
                                onClick={handleSubmit}
                                className="mt-6 p-3 text-xs md:text-sm bg-green-300 text-gray-600 rounded-md  focus:outline-none focus:ring-4 focus:ring-green-300 "
                            >
                                Xác nhận
                            </button>
                        </div>
                    )}
                </div>
                {/* Phần bên phải hiển thị QR code nếu qrLink có giá trị */}
                {qrLink && (
                    <div className="w-full md:w-1/2 mt-4">
                        <div className="flex flex-col justify-center items-center">
                            <img src={qrLink} alt="QR Code" className="w-full h-auto md:max-w-80" />
                            <motion.button
                                onClick={downloadQR}
                                className={`mt-6 py-4 px-6 text-xs md:text-sm flex justify-center items-center text-gray-600 rounded-lg ${isDownloaded ? 'bg-green-300' : 'bg-green-300'

                                    }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                animate={isDownloaded ? { scale: [1, 1.1, 1], transition: { duration: 0.2 } } : {}}
                            >
                                {/* AnimatePresence với mode="wait" để quản lý fade-in/out của icon */}
                                <AnimatePresence mode="wait">
                                    {isDownloaded ? (
                                        <motion.div
                                            key="check"
                                            initial={{ opacity: 0, scale: 0.5 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.5 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <FaCheck className="mr-2 text-sm" />
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="download"
                                            initial={{ opacity: 0, scale: 0.5 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.5 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <HiOutlineDownload className="mr-2 text-sm" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Nội dung nút thay đổi dựa vào trạng thái */}
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {isDownloaded ? 'Đã tải xong' : 'Tải QR về'}
                                </motion.span>
                            </motion.button>

                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
