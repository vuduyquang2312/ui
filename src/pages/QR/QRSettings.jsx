import React, { useState, useEffect } from 'react';
import { IoCloseOutline } from "react-icons/io5";
import { MayTinhDatCuoc, tinhToanSoTienDatCuoc } from './MayTinhDatCuoc';

export default function QRSettings({
    selectedOption,
    setSelectedOption,
    selectedTemplate,
    setSelectedTemplate,
    selectedBin,
    setSelectedBin,
    closeOptions,
    handleConfirm
}) {
    const [accountNumber, setAccountNumber] = useState('');
    const [localSelectedOption, setLocalSelectedOption] = useState(selectedOption || "Mặc định");
    const [localSelectedTemplate, setLocalSelectedTemplate] = useState(selectedTemplate || "compact");
    const [localSelectedPurpose, setLocalSelectedPurpose] = useState("QR chuyển khoản");
    const [bankDetails, setBankDetails] = useState(null);
    const [logo, setLogo] = useState(null);
    const [showBettingForm, setShowBettingForm] = useState(false);
    const [bettingFormData, setBettingFormData] = useState({
        soTienVon: "",
        taiKhoanNganHang: "",
        tiLeAn: "",
        phuongPhap: "gấp thếp",
        troChoi: "Chẵn lẻ"
    });

    useEffect(() => {
        const fetchBankDetails = () => {
            const savedBank = localStorage.getItem('selectedBank');
            if (savedBank) {
                const parsedBank = JSON.parse(savedBank);
                setBankDetails(parsedBank);
                setLogo(parsedBank.logo);
            }
        };

        fetchBankDetails();
        const intervalId = setInterval(fetchBankDetails, 1000);

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        if (localSelectedPurpose === "QR đặt cược") {
            setLocalSelectedOption("Có số tiền và nội dung");
            setLocalSelectedTemplate("compact: QR kèm logo VietQR, Napas, ngân hàng");
        }
    }, [localSelectedPurpose]);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(value);
    };

    const handleTienVonChange = (e) => {
        let value = e.target.value.replace(/[^0-9]/g, "");
        setBettingFormData({
            ...bettingFormData,
            soTienVon: formatCurrency(value)
        });
    };

    const handleBettingFormChange = (e) => {
        setBettingFormData({
            ...bettingFormData,
            [e.target.name]: e.target.value
        });
    };

    const handlePurposeChange = (e) => {
        const newPurpose = e.target.value;
        setLocalSelectedPurpose(newPurpose);
        if (newPurpose === "QR đặt cược") {
            setLocalSelectedOption("Có số tiền và nội dung");
            setLocalSelectedTemplate("compact: QR kèm logo VietQR, Napas, ngân hàng");
        }
    };

    const handleInitialConfirm = () => {
        localStorage.setItem('selectedOption', localSelectedOption);
        localStorage.setItem('selectedTemplate', localSelectedTemplate);
        
        // Update parent component state
        setSelectedOption(localSelectedOption);
        setSelectedTemplate(localSelectedTemplate);
        if (localSelectedPurpose === "QR đặt cược") {
            setShowBettingForm(true);
        } else {
            handleConfirm({
                localSelectedOption,
                localSelectedTemplate,
                localSelectedPurpose
            });
        }
    };
    const [ketQuaTinhToan, setKetQuaTinhToan] = useState(null);
    const handleBettingConfirm = () => {
        console.log("Dữ liệu Biểu mẫu Đặt cược:", bettingFormData);
        
        const tongSoTien = parseInt(bettingFormData.soTienVon.replace(/[^\d]/g, ''), 10);
        const soTay = parseInt(bettingFormData.soTayChiaVon, 10) || 3;
        const cacKhoanTienDatCuoc = tinhToanSoTienDatCuoc(tongSoTien, bettingFormData.phuongPhap, soTay);
    
        // Hiển thị kết quả tính toán
        setKetQuaTinhToan(
            <div className="mt-4 p-4 bg-gray-100 rounded-md">
                <h3 className="font-bold mb-2">Kết quả tính toán số tiền đặt cược:</h3>
                {cacKhoanTienDatCuoc.map((soTien, index) => (
                    <p key={index}>
                        Tay {index + 1}: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(soTien)}
                    </p>
                ))}
            </div>
        );
    
        handleConfirm({
            localSelectedOption,
            localSelectedTemplate,
            localSelectedPurpose,
            ...bettingFormData
        });
    };

    if (showBettingForm) {
        return (
            <div className="flex flex-col w-full mt-4 text-xs md:text-sm p-6 bg-white rounded-lg border mx-auto">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xs md:text-sm text-gray-700"></h3>
                    <IoCloseOutline
                        className="cursor-pointer text-2xl text-gray-950 hover:text-gray-700"
                        onClick={closeOptions}
                    />
                </div>

                <div className="mb-6 flex">
                    <div className='w-1/2'>
                        <label className="block text-gray-500 mb-2 text-xs md:text-sm">Số tiền vốn:</label>
                        <input
                            type="text"
                            name="soTienVon"
                            className="block w-full mt-2 p-3 text-xs md:text-sm bg-white text-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                            value={bettingFormData.soTienVon}
                            onChange={handleTienVonChange}
                        />
                    </div>
                    <div className='w-1/2 ml-4'>
                        <label className="block text-gray-500 mb-2 text-xs md:text-sm">STK đặt cược:</label>
                        <input
                            type="text"
                            name="stkDatCuoc"
                            className="block w-full mt-2 p-3 text-xs md:text-sm bg-white text-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                            value={bettingFormData.stkDatCuoc}
                            onChange={handleBettingFormChange}
                        />
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-gray-500 mb-2 text-xs md:text-sm">Ngân hàng đặt cược:</label>
                    <div className="relative">
                        <input
                            className="border w-full border-gray-300 rounded-md py-2 px-4 text-xs md:text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                            placeholder="Nhập tên ngân hàng/BIN"
                            value={bankDetails ? bankDetails.name : accountNumber}
                            readOnly
                        />
                        {logo && (
                            <img
                                src={logo}
                                alt="Logo ngân hàng"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-12 md:w-16 h-auto object-contain"
                            />
                        )}
                    </div>
                </div>

                <div className="mb-6 flex">
                    <div className='w-1/4'>
                        <label className="block text-gray-500 mb-2 text-xs md:text-sm">Chọn trò chơi:</label>
                        <select
                            name="troChoi"
                            className="block w-full mt-2 p-3 text-xs md:text-sm bg-white text-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                            value={bettingFormData.troChoi}
                            onChange={handleBettingFormChange}
                        >
                            <option value="ChanLe">Chẵn lẻ</option>
                            <option value="ChanLe2">Chẵn lẻ 2</option>
                            <option value="TaiXiu">Tài xỉu</option>
                            <option value="TaiXiu2">Tài xỉu 2</option>
                        </select>
                    </div>
                    <div className='w-3/4 ml-4'>
                        <label className="block text-gray-500 mb-2 text-xs md:text-sm">
                            Tỉ lệ ăn<span className='text-red-400 ml-2'>(Khi win):</span>
                        </label>
                        <input
                            type="text"
                            name="tiLeAn"
                            className="block w-full mt-2 p-3 text-xs md:text-sm bg-white text-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                            value={bettingFormData.tiLeAn}
                            onChange={handleBettingFormChange}
                        />
                    </div>
                </div>

                <div className="mb-6 flex">
                    <div className='w-1/3'>
                        <label className="block text-gray-500 mb-2 text-xs md:text-sm">Phương pháp:</label>
                        <select
                            name="phuongPhap"
                            className="block w-full mt-2 p-3 text-xs md:text-sm bg-white text-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                            value={bettingFormData.phuongPhap}
                            onChange={handleBettingFormChange}
                        >
                            <option value="gapThep">Gấp thếp</option>
                            <option value="fibonacci">Fibonacci</option>
                        </select>
                    </div>
                    <div className='w-2/3 ml-4'>
                        <label className="block text-gray-500 mb-2 text-xs md:text-sm">Nhập số tay muốn chia vốn:<span className='text-red-400 ml-2'>(3-7)</span></label>
                        <input
                            type="number"
                            name="soTayChiaVon"
                            
                            className="block w-full mt-2 p-3 text-xs md:text-sm bg-white text-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                            value={bettingFormData.soTayChiaVon}
                            onChange={handleBettingFormChange}
                            min="3"
                            max="7"
                        />
                    </div>
                </div>
                
                <div className="mb-6 flex">
                    <div className='w-1/3'>
                        <label className="block text-gray-500 mb-2 text-xs md:text-sm">Chốt lãi:</label>
                        <input
                            type="number"
                            name="chotLai"
                            className="block w-full mt-2 p-3 text-xs md:text-sm bg-white text-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                            value={bettingFormData.chotLai}
                            onChange={handleBettingFormChange}
                        />
                    </div>
                    <div className='w-1/3 ml-4'>
                        <label className="block text-gray-500 mb-2 text-xs md:text-sm">Cắt lỗ:</label>
                        <input
                            type="number"
                            name="catLo"
                            className="block w-full mt-2 p-3 text-xs md:text-sm bg-white text-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                            value={bettingFormData.catLo}
                            onChange={handleBettingFormChange}
                        />
                    </div>
                    <div className='w-1/3 ml-4'>
                        <label className="block text-gray-500 mb-2 text-xs md:text-sm">Nội dung:</label>
                        <input
                            type="text"
                            name="noiDung"
                            className="block w-full mt-2 p-3 text-xs md:text-sm bg-white text-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                            value={bettingFormData.noiDung}
                            onChange={handleBettingFormChange}
                        />
                    </div>
                </div>
                {ketQuaTinhToan}
                <button
                    className="mt-4 p-3 bg-[#34D399] text-white rounded-md w-full text-xs md:text-sm hover:bg-[#2BBF88] transition-all"
                    onClick={handleBettingConfirm}
                >
                    Xác nhận
                </button>
            </div>

        );
    }

    return (
        <div className="flex flex-col md:w-full mt-4 text-xs md:text-sm p-6 bg-white rounded-lg border mx-auto">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs md:text-sm text-gray-700 "></h3>
                <IoCloseOutline
                    className="cursor-pointer text-2xl text-gray-950 hover:text-gray-700"
                    onClick={closeOptions}
                />
            </div>

            <div className="mb-6">
                <label className="block text-gray-500 mb-2 text-xs md:text-sm ">
                    Chọn loại QR:
                </label>
                <select
                    className="block w-full mt-2 p-3 text-xs md:text-sm bg-white text-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                    value={localSelectedOption}
                    onChange={(e) => setLocalSelectedOption(e.target.value)}
                    disabled={localSelectedPurpose === "QR đặt cược"}
                >
                    <option value="Mặc định">Mặc định</option>
                    <option value="Có số tiền và nội dung">Có số tiền và nội dung</option>
                </select>
            </div>

            <div className="mb-6">
                <label className="block text-gray-500  mb-2 text-xs md:text-sm">
                    Chọn template QR:
                </label>
                <select
                    className="block w-full mt-2 p-3 border border-gray-300 bg-white text-xs md:text-sm text-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                    value={localSelectedTemplate}
                    onChange={(e) => setLocalSelectedTemplate(e.target.value)}
                    disabled={localSelectedPurpose === "QR đặt cược"}
                >
                    <option value="compact2">compact2: Mã QR, các logo, thông tin chuyển khoản</option>
                    <option value="compact">compact: QR kèm logo VietQR, Napas, ngân hàng</option>
                    <option value="qr_only">qr_only: Trả về ảnh QR đơn giản, chỉ bao gồm QR</option>
                    <option value="print">print: Mã QR, các logo và đầy đủ thông tin chuyển khoản</option>
                </select>
            </div>

            <div className="mb-6">
                <label className="block text-gray-500 mb-2 text-xs md:text-sm">
                    Chọn mục đích QR:
                </label>
                <select
                    className="block w-full mt-2 p-3 text-xs md:text-sm bg-white text-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                    value={localSelectedPurpose}
                    onChange={handlePurposeChange}
                >
                    <option value="QR chuyển khoản">QR chuyển khoản</option>
                    <option value="QR đặt cược">QR đặt cược</option>
                </select>
            </div>

            <button
                className="mt-4 p-3 bg-[#34D399] text-white rounded-md w-full text-xs md:text-sm hover:bg-[#2BBF88] transition-all"
                onClick={handleInitialConfirm}
            >
                Xác nhận
            </button>
        </div>
    );
}
