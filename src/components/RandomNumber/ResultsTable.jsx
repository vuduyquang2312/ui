// src/components/RandomNumber/ResultsTable.jsx
import React from 'react';
import { motion } from 'framer-motion';

const ResultsTable = ({ data }) => {
    const selectedGames = JSON.parse(localStorage.getItem('selectedGames')) || [];
    
    // Giới hạn dữ liệu chỉ còn 6 hàng mới nhất, với dữ liệu mới nhất ở đầu
    const limitedData = data.slice(0, 6);

    return (
        <motion.div
            className='mt-4 w-full p-4 text-gray-500 bg-white rounded-xl overflow-x-auto'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <motion.table
                className='table-auto text-xs md:text-sm w-full text-center'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <thead>
                    <tr>
                        <th className='p-4 border-b'>STT</th>
                        <th className='p-4 border-b'>Mã MiliSecond</th>
                        {selectedGames.includes('Chẵn/Lẻ') && (
                            <>
                                <th className='p-4 border-b'>Chẵn</th>
                                <th className='p-4 border-b'>Lẻ</th>
                            </>
                        )}
                        {selectedGames.includes('Tài/Xỉu') && (
                            <>
                                <th className='p-4 border-b'>Tài</th>
                                <th className='p-4 border-b'>Xỉu</th>
                            </>
                        )}
                        {selectedGames.includes('Chẵn/Lẻ 2') && (
                            <>
                                <th className='p-4 border-b'>Chẵn 2</th>
                                <th className='p-4 border-b'>Lẻ 2</th>
                            </>
                        )}
                        {selectedGames.includes('Tài/Xỉu 2') && (
                            <>
                                <th className='p-4 border-b'>Tài 2</th>
                                <th className='p-4 border-b'>Xỉu 2</th>
                            </>
                        )}
                        {selectedGames.includes('Xiên') && (
                            <>
                                <th className='p-4 border-b'>CX</th>
                                <th className='p-4 border-b'>LT</th>
                                <th className='p-4 border-b'>CT</th>
                                <th className='p-4 border-b'>LX</th>
                            </>
                        )}
                        {selectedGames.includes('1 Phần 3') && (
                            <>
                                <th className='p-4 border-b'>N1</th>
                                <th className='p-4 border-b'>N2</th>
                                <th className='p-4 border-b'>N3</th>
                            </>
                        )}
                        {selectedGames.includes('Đoán số') && (
                            <th className='p-4 border-b'>Số</th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {limitedData.map((row, index) => {
                        const lastDigit = row.time.toString().slice(-1);
                        const lastTwoDigits = row.time.toString().slice(-2);
                        const sumLastTwoDigits = parseInt(lastTwoDigits[0]) + parseInt(lastTwoDigits[1]);
                        const finalDigit = sumLastTwoDigits % 10;

                        return (
                            <tr key={index}>
                                <td className='p-4 border-b'>{index + 1}</td>
                                <td className='p-4 border-b'>{row.time}</td>
                                {selectedGames.includes('Chẵn/Lẻ') && (
                                    <>
                                        <td className='p-4 border-b'>
                                            <input
                                                type="checkbox"
                                                checked={lastDigit % 2 === 0 && lastDigit != 0}
                                                readOnly
                                                className="appearance-none h-5 w-5 border border-gray-300 rounded-full checked:bg-blue-500 checked:border-transparent focus:outline-none"
                                            />
                                        </td>
                                        <td className='p-4 border-b'>
                                            <input
                                                type="checkbox"
                                                checked={lastDigit % 2 !== 0 && lastDigit != 9}
                                                readOnly
                                                className="appearance-none h-5 w-5 border border-gray-300 rounded-full checked:bg-blue-500 checked:border-transparent focus:outline-none"
                                            />
                                        </td>
                                    </>
                                )}
                                {selectedGames.includes('Tài/Xỉu') && (
                                    <>
                                        <td className='p-4 border-b' >
                                            <input
                                                type="checkbox"
                                                checked={lastDigit >= 5 && lastDigit != 9}
                                                readOnly
                                                className="appearance-none h-5 w-5 border border-gray-300 rounded-full checked:bg-blue-500 checked:border-transparent focus:outline-none"
                                            />
                                        </td>
                                        <td className='p-4 border-b'>
                                            <input
                                                type="checkbox"
                                                checked={lastDigit < 5 && lastDigit != 0}
                                                readOnly
                                                className="appearance-none h-5 w-5 border border-gray-300 rounded-full checked:bg-blue-500 checked:border-transparent focus:outline-none"
                                            />
                                        </td>
                                    </>
                                )}
                                {selectedGames.includes('Chẵn/Lẻ 2') && (
                                    <>
                                        <td className='p-8 md:p-4 border-b'>
                                            <input
                                                type="checkbox"
                                                checked={finalDigit === 0 || finalDigit === 2 || finalDigit % 2 === 0}
                                                readOnly
                                                className="appearance-none h-5 w-5 border border-gray-300 rounded-full checked:bg-blue-500 checked:border-transparent focus:outline-none"
                                            />
                                        </td>
                                        <td className='p-8 md:p-4 border-b'>
                                            <input
                                                type="checkbox"
                                                checked={finalDigit === 1 || finalDigit === 3 || finalDigit % 2 !== 0}
                                                readOnly
                                                className="appearance-none h-5 w-5 border border-gray-300 rounded-full checked:bg-blue-500 checked:border-transparent focus:outline-none"
                                            />
                                        </td>
                                    </>
                                )}
                                {selectedGames.includes('Tài/Xỉu 2') && (
                                    <>
                                        <td className='p-4 border-b'>
                                            <input
                                                type="checkbox"
                                                checked={finalDigit >= 5}
                                                readOnly
                                                className="appearance-none h-5 w-5 border border-gray-300 rounded-full checked:bg-blue-500 checked:border-transparent focus:outline-none"
                                            />
                                        </td>
                                        <td className='p-4 border-b'>
                                            <input
                                                type="checkbox"
                                                checked={finalDigit < 5}
                                                readOnly
                                                className="appearance-none h-5 w-5 border border-gray-300 rounded-full checked:bg-blue-500 checked:border-transparent focus:outline-none"
                                            />
                                        </td>
                                    </>
                                )}
                                {selectedGames.includes('Xiên') && (
                                    <>
                                        <td className='p-4 border-b'>
                                            <input
                                                type="checkbox"
                                                checked={finalDigit === 2 || finalDigit === 4}
                                                readOnly
                                                className="appearance-none h-5 w-5 border border-gray-300 rounded-full checked:bg-blue-500 checked:border-transparent focus:outline-none"
                                            />
                                        </td>
                                        <td className='p-4 border-b'>
                                            <input
                                                type="checkbox"
                                                checked={finalDigit === 5 || finalDigit === 7 || finalDigit === 9}
                                                readOnly
                                                className="appearance-none h-5 w-5 border border-gray-300 rounded-full checked:bg-blue-500 checked:border-transparent focus:outline-none"
                                            />
                                        </td>
                                        <td className='p-4 border-b'>
                                            <input
                                                type="checkbox"
                                                checked={finalDigit === 6 || finalDigit === 8}
                                                readOnly
                                                className="appearance-none h-5 w-5 border border-gray-300 rounded-full checked:bg-blue-500 checked:border-transparent focus:outline-none"
                                            />
                                        </td>
                                        <td className='p-4 border-b'>
                                            <input
                                                type="checkbox"
                                                checked={finalDigit === 1 || finalDigit === 3}
                                                readOnly
                                                className="appearance-none h-5 w-5 border border-gray-300 rounded-full checked:bg-blue-500 checked:border-transparent focus:outline-none"
                                            />
                                        </td>
                                    </>
                                )}
                                {selectedGames.includes('1 Phần 3') && (
                                    <>
                                        <td className='p-4 border-b'>
                                            <input
                                                type="checkbox"
                                                checked={finalDigit === 1 || finalDigit === 5 || finalDigit === 7}
                                                readOnly
                                                className="appearance-none h-5 w-5 border border-gray-300 rounded-full checked:bg-blue-500 checked:border-transparent focus:outline-none"
                                            />
                                        </td>
                                        <td className='p-4 border-b'>
                                            <input
                                                type="checkbox"
                                                checked={finalDigit === 2 || finalDigit === 4 || finalDigit === 8}
                                                readOnly
                                                className="appearance-none h-5 w-5 border border-gray-300 rounded-full checked:bg-blue-500 checked:border-transparent focus:outline-none"
                                            />
                                        </td>
                                        <td className='p-4 border-b'>
                                            <input
                                                type="checkbox"
                                                checked={finalDigit === 3 || finalDigit === 6 || finalDigit === 9}
                                                readOnly
                                                className="appearance-none h-5 w-5 border border-gray-300 rounded-full checked:bg-blue-500 checked:border-transparent focus:outline-none"
                                            />
                                        </td>
                                    </>
                                )}
                                {selectedGames.includes('Đoán số') && (
                                    <td className='p-4 border-b'>D{finalDigit}</td>
                                )}
                            </tr>
                        );
                    })}
                </tbody>
            </motion.table>
        </motion.div>
    );
};

export default ResultsTable;