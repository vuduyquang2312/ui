// src/components/RandomNumber/TimeDisplay.jsx
import React from 'react';

const TimeDisplay = ({ currentTime, onStop }) => {
    return (
        <div className='flex items-center border p-6 rounded-xl w-full bg-white'>
            <span className='text-center text-xs md:text-sm'>MiliSecond:</span>
            <div className='flex justify-start items-center ml-4'>
                <span className='text-xs md:text-sm'>{currentTime}</span>
            </div>
            <button
                onClick={onStop}
                className='ml-auto bg-[#e2f0ed] text-xs md:text-sm text-black px-4 py-2 rounded-lg hover:bg-[#d2e3df] focus:outline-none focus:ring-2 focus:ring-[#e2f0ed]'
            >
                Dừng
            </button>
        </div>
    );
};

export default TimeDisplay;
