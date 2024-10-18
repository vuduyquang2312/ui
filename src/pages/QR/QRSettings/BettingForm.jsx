import React, { useState, useEffect } from 'react';
import { IoCloseOutline } from "react-icons/io5";
import BettingForm from './BettingForm';
import { fetchBankDetails } from '../utils/index';
import { DEFAULT_OPTION, DEFAULT_TEMPLATE, DEFAULT_PURPOSE } from '../constants/index';

export default function QRSettings({
    selectedOption,
    selectedTemplate,
    closeOptions,
    handleConfirm
}) {
    const [localSelectedOption, setLocalSelectedOption] = useState(selectedOption || DEFAULT_OPTION);
    const [localSelectedTemplate, setLocalSelectedTemplate] = useState(selectedTemplate || DEFAULT_TEMPLATE);
    const [localSelectedPurpose, setLocalSelectedPurpose] = useState(DEFAULT_PURPOSE);
    const [bankDetails, setBankDetails] = useState(null);
    const [logo, setLogo] = useState(null);
    const [showBettingForm, setShowBettingForm] = useState(false);

    useEffect(() => {
        const intervalId = setInterval(() => fetchBankDetails(setBankDetails, setLogo), 1000);
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        if (localSelectedPurpose === "QR đặt cược") {
            setLocalSelectedOption("Có số tiền và nội dung");
        }
    }, [localSelectedPurpose]);

    const handlePurposeChange = (e) => {
        const newPurpose = e.target.value;
        setLocalSelectedPurpose(newPurpose);
        if (newPurpose === "QR đặt cược") {
            setLocalSelectedOption("Có số tiền và nội dung");
        }
    };

    const handleInitialConfirm = () => {
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

    if (showBettingForm) {
        return (
            <BettingForm
                closeOptions={closeOptions}
                handleConfirm={handleConfirm}
                bankDetails={bankDetails}
                logo={logo}
                localSelectedOption={localSelectedOption}
                localSelectedTemplate={localSelectedTemplate}
                localSelectedPurpose={localSelectedPurpose}
            />
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

            {/* Các phần select và input giữ nguyên */}

            <button
                className="mt-4 p-3 bg-[#34D399] text-white rounded-md w-full text-xs md:text-sm hover:bg-[#2BBF88] transition-all"
                onClick={handleInitialConfirm}
            >
                Xác nhận
            </button>
        </div>
    );
}