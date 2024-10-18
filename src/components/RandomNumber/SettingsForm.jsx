// src/components/RandomNumber/SettingsForm.jsx
import React from 'react';
import { RiCloseLine } from "react-icons/ri";

const SettingsForm = ({ selectedGames, setSelectedGames, handleReload, toggleSettings }) => {
    const handleGameSelection = (game) => {
        setSelectedGames([game]);
    };

    const handleConfirm = () => {
        localStorage.setItem('selectedGames', JSON.stringify(selectedGames));
        toggleSettings();
    };

    const handleClick = () => {
        handleConfirm();
        handleReload();
    };

    return (
        <div className='mt-6 w-full bg-white rounded-xl p-6'>
            <div className="flex justify-between items-center mb-6">
                <h2 className='text-center text-xs md:text-sm text-gray-800'>Chọn trò chơi</h2>
                <RiCloseLine className="text-2xl text-gray-500 cursor-pointer hover:text-orange-600" onClick={toggleSettings} />
            </div>
            <div className='grid md:grid-cols-7 grid-cols-2 text-xs md:text-sm'>
                {['Chẵn/Lẻ', 'Tài/Xỉu', 'Chẵn/Lẻ 2', 'Tài/Xỉu 2', 'Xiên', '1 Phần 3', 'Đoán số'].map((game, index) => (
                    <label key={index} className='flex items-center mt-2 p-2 rounded-lg transition'>
                        <input
                            type="radio"
                            name="game"
                            checked={selectedGames[0] === game}
                            onChange={() => handleGameSelection(game)}
                            className='mr-2 text-orange-500 focus:ring-orange-400'
                        />
                        <span className='text-gray-700'>{game}</span>
                    </label>
                ))}
            </div>
            <div className="flex justify-end mt-6">
                <button
                    onClick={handleClick}
                    className="bg-orange-500 text-white px-6 py-2 text-xs md:text-sm rounded-lg shadow-md hover:bg-orange-600 transition-all duration-200"
                >
                    Xác nhận
                </button>
            </div>
        </div>
    );
};

export default SettingsForm;
