// components/RandomNumber.js
import React, { useState, useEffect } from 'react';
import { CiSettings } from "react-icons/ci";
import { MdAutorenew } from "react-icons/md";
import SettingsForm from './SettingsForm';
import ResultsTable from './ResultsTable';

export default function RandomNumber() {
    const [currentTime, setCurrentTime] = useState('');
    const [data, setData] = useState([]);
    const [isTableVisible, setIsTableVisible] = useState(false);
    const [isSettingsVisible, setIsSettingsVisible] = useState(false);
    const [selectedGames, setSelectedGames] = useState([]);

    const getCurrentTime = () => {
        const now = new Date();
        const year = now.getFullYear().toString();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const hour = now.getHours().toString().padStart(2, '0');
        const minute = now.getMinutes().toString().padStart(2, '0');
        const second = now.getSeconds().toString().padStart(2, '0');
        const millisecond = now.getMilliseconds().toString().padStart(3, '0');

        const fullTimeString = `${year}${month}${day}${hour}${minute}${second}${millisecond}`;
        setCurrentTime(fullTimeString);
    };

    useEffect(() => {
        const timer = setInterval(getCurrentTime, 1);
        return () => clearInterval(timer);
    }, []);

    const handleStop = () => {
        const storedSelectedGames = JSON.parse(localStorage.getItem('selectedGames'));

        if (!storedSelectedGames || storedSelectedGames.length === 0) {
            alert("Vui lòng chọn game trong phần cài đặt trước khi dừng!");
            toggleSettings();
            return; // Dừng lại nếu không có game đã chọn
        }

        const lastDigit = parseInt(currentTime.slice(-1));
        const isEven = lastDigit % 2 === 0;
        const isTai = lastDigit >= 5 && lastDigit <= 8;
        const isXiu = lastDigit >= 1 && lastDigit <= 4;
        const hideInput = lastDigit === 0 || lastDigit === 9;

        setData(prevData => [
            {
                id: prevData.length + 1,
                time: currentTime,
                isEven,
                isTai,
                isXiu,
                hideInput,
                result: null
            },
            ...prevData
        ]);

        setIsTableVisible(true);
    };

    const handleReload = () => {
        setData([]);
        setIsTableVisible(false);
    };

    const toggleSettings = () => {
        setIsSettingsVisible(!isSettingsVisible);
    };

    return (
        <div className='flex flex-col items-center p-2 bg-gray-100 min-h-screen'>
            <div className="flex items-center border p-6 rounded-xl w-full bg-orange-200 text-gray-500">
                <span className="text-center text-xs md:text-sm">MiliSecond:</span>
                <div className="flex justify-start items-center ml-4">
                    <span className="text-xs md:text-sm font-semibold">{currentTime}</span>
                </div>
                <button
                    onClick={handleStop}
                    className="ml-auto bg-white text-gray-500 text-xs md:text-sm px-4 py-2 rounded-lg  focus:outline-none  transition-all duration-200"
                >
                    Dừng
                </button>
            </div>

            <div className="flex justify-between items-center w-full mt-4 space-x-4">
                {/* Cài đặt */}
                <div
                    className="flex items-center space-x-2 cursor-pointer w-1/2 justify-center border bg-white hover:bg-orange-100 p-4 rounded-xl transition-all duration-200"
                    onClick={toggleSettings}
                >
                    <CiSettings className="text-sm text-orange-500" />
                    <span className="text-xs md:text-sm font-medium text-orange-600">Cài đặt</span>
                </div>

                {/* Reload */}
                <div
                    className="flex items-center space-x-2 cursor-pointer w-1/2 justify-center border bg-white hover:bg-orange-100 p-4 rounded-xl transition-all duration-200"
                    onClick={handleReload}
                >
                    <MdAutorenew className="text-sm text-orange-600" />
                    <span className="text-xs md:text-sm text-orange-600">Reload</span>
                </div>
            </div>

            {isSettingsVisible && (
                <SettingsForm
                    selectedGames={selectedGames}
                    setSelectedGames={setSelectedGames}
                    toggleSettings={toggleSettings}
                    handleReload={handleReload}
                />
            )}

            {isTableVisible && (
                <ResultsTable data={data} />
            )}
        </div>
    );
}
