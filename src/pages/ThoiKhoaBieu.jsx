import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiEdit } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { MdSearch } from "react-icons/md";
import { MdPreview } from "react-icons/md";

const tietHocMap = {
    'T1-3': '7:00 - 8:40',
    'T4-6': '9:40 - 11:20',
    'T7-9': '13:00 - 14:40',
    'T10-12': '15:40 - 17:20',
    'T13-15': '18:30 - 20:10',
};

const thuMap = {
    'Thứ 2': 1,
    'Thứ 3': 2,
    'Thứ 4': 3,
    'Thứ 5': 4,
    'Thứ 6': 5,
    'Thứ 7': 6,
};

export default function ThoiKhoaBieu() {
    const [thoiKhoaBieu, setThoiKhoaBieu] = useState([]);
    const [selectedView, setSelectedView] = useState('Toàn bộ');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchThoiKhoaBieu = async () => {
            try {
                const response = await axios.get('http://192.168.1.6:5000/tkb');
                setThoiKhoaBieu(response.data);
            } catch (error) {
                console.error("Có lỗi khi lấy dữ liệu thời khóa biểu:", error);
            }
        };

        fetchThoiKhoaBieu();
    }, []);

    const tachLichHoc = (lichHoc) => {
        const [phanTruoc, ...phanSau] = lichHoc.split(' ');
        const thuVaTiet = phanSau.join(' ');
        const [thuc, tiet] = thuVaTiet.split('(');
        return { phanTruoc, thuc: thuc.trim(), tiet: tiet ? tiet.replace(')', '').trim() : '' };
    };

    const chuyenDoiTiet = (tiet) => {
        return tietHocMap[tiet] || tiet;
    };

    const layThoiGianBatDauGanNhat = (data) => {
        const today = new Date();
        const thoiGianBatDau = data.map(item => {
            const { thuc, phanTruoc } = tachLichHoc(item.lichHoc);
            const ngay = new Date(today);
            const weekDay = thuMap[thuc];
            if (weekDay) {
                ngay.setDate(today.getDate() + (weekDay - today.getDay() + 7) % 7);
            }

            const [startDate] = phanTruoc.split('-');
            const [day, month, year] = startDate.split('/').map(Number);
            const formattedDate = new Date(year + 2000, month - 1, day);

            return { ...item, ngayBatDau: formattedDate };
        }).sort((a, b) => a.ngayBatDau - b.ngayBatDau)[0];

        return thoiGianBatDau ? thoiGianBatDau.ngayBatDau : null;
    };

    const getStatus = (item) => {
        const { phanTruoc } = tachLichHoc(item.lichHoc);
        const [startDate, endDate] = phanTruoc.split('-').map(date => {
            const [day, month, year] = date.split('/').map(Number);
            return new Date(year + 2000, month - 1, day);
        });

        const today = new Date();
        if (today >= startDate && today <= endDate) {
            return { text: 'Đang diễn ra', backGround: 'bg-green-500', color: 'text-green-600' };
        } else if (today < startDate) {
            return { text: 'Chuẩn bị tới', backGround: 'bg-blue-500', color: 'text-blue-600' };
        } else {
            return { text: 'Quá hạn', backGround: 'bg-red-500', color: 'text-red-600' };
        }
    };

    const filterThoiKhoaBieu = (data) => {
        const thoiGianBatDauGanNhat = layThoiGianBatDauGanNhat(data);

        let filteredData = data;

        if (selectedView === 'Gần thời gian hiện tại') {
            filteredData = data.filter(item => {
                const { phanTruoc } = tachLichHoc(item.lichHoc);
                const [startDate] = phanTruoc.split('-');
                const [day, month, year] = startDate.split('/').map(Number);
                const formattedDate = new Date(year + 2000, month - 1, day);

                return formattedDate.getTime() === thoiGianBatDauGanNhat?.getTime();
            });
        } else if (selectedView === 'Sắp tới') {
            filteredData = data.filter(item => {
                const { phanTruoc } = tachLichHoc(item.lichHoc);
                const [startDate] = phanTruoc.split('-');
                const [day, month, year] = startDate.split('/').map(Number);
                const formattedDate = new Date(year + 2000, month - 1, day);

                return formattedDate.getTime() > thoiGianBatDauGanNhat?.getTime();
            });
        }

        // Apply search term filter
        if (searchTerm) {
            filteredData = filteredData.filter(item =>
                item.tenHocPhan.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.giaoVien.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        return filteredData;
    };

    const thoiKhoaBieuSapXep = filterThoiKhoaBieu(thoiKhoaBieu).sort((a, b) => {
        const { phanTruoc: aPhanTruoc, thuc: aThuc } = tachLichHoc(a.lichHoc);
        const { phanTruoc: bPhanTruoc, thuc: bThuc } = tachLichHoc(b.lichHoc);

        // Sắp xếp theo thứ trong tuần
        const thuOrder = thuMap[aThuc] - thuMap[bThuc];
        if (thuOrder !== 0) return thuOrder;

        // Nếu cùng thứ, sắp xếp theo ngày
        const [aStartDate] = aPhanTruoc.split('-');
        const [bStartDate] = bPhanTruoc.split('-');
        const [aDay, aMonth, aYear] = aStartDate.split('/').map(Number);
        const [bDay, bMonth, bYear] = bStartDate.split('/').map(Number);

        const aDate = new Date(aYear + 2000, aMonth - 1, aDay);
        const bDate = new Date(bYear + 2000, bMonth - 1, bDay);

        return aDate - bDate;
    });

    return (
        <div className="w-full bg-white rounded-lg">
            <div className='flex justify-center mb-4'>
                <div className='flex flex-col md:flex-row items-center w-full p-2 md:p-4'>
                    {/* Input field with icon inside */}
                    <div className="relative w-full md:w-3/4">
                        <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl" />
                        <input
                            type="text"
                            placeholder="Nhập tên môn học/giáo viên:"
                            className="border w-full text-xs md:text-sm text-gray-500 p-3 pl-10 rounded-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Select field with icon inside */}
                    <div className="relative w-full md:w-1/4 mt-4 md:mt-0 md:ml-4">
                        <MdPreview className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl" />
                        <select
                            id="viewSelect"
                            value={selectedView}
                            onChange={(e) => setSelectedView(e.target.value)}
                            className="border text-xs md:text-sm text-gray-500 p-3 pl-10 rounded-sm w-full"
                        >
                            <option value="Toàn bộ" className='text-gray-500'>Toàn bộ</option>
                            <option value="Gần thời gian hiện tại" className='text-gray-500'>Gần thời gian hiện tại</option>
                            <option value="Sắp tới" className='text-gray-500'>Sắp tới</option>
                        </select>
                    </div>
                </div>
            </div>



            <div className="overflow-x-auto">
                {/* <div className="flex justify-around items-center">
                    <div className="w-1/4 bg-blue-100 text-center border  rounded p-2 ">
                        <span className="text-xs md:text-sm text-gray-500">Lịch học hôm nay</span>
                    </div>
                    
                    <div className="w-3/4 bg-blue-100 text-center border  rounded p-2 ml-2">
                        <span className="text-xs md:text-sm text-gray-500">Lịch học tuần tới</span>
                    </div>
                </div> */}




                <table className="min-w-full mt-2 bg-white rounded-xl text-xs md:text-sm border-gray-300">
                    <thead className="bg-purple-200">
                        <tr>
                            <th className="py-4 px-2 border-b-8 border-[#eff3f4] text-center text-gray-500">STT</th>
                            <th className="py-4 px-14  whitespace-nowrap md:px-6 border-b-8 border-[#eff3f4] text-center text-gray-500">Tên học phần</th>
                            <th className="py-4 px-8 md:px-6 whitespace-nowrap border-b-8 border-[#eff3f4] text-center text-gray-500">Ngày tháng</th>
                            <th className="py-4 px-8 md:px-6 border-b-8 border-[#eff3f4] text-center text-gray-500">Thứ</th>
                            <th className="py-4 px-12 md:px-6 whitespace-nowrap border-b-8 border-[#eff3f4] text-center text-gray-500">Giờ học</th>
                            <th className="py-4 px-20 md:px-6 border-b-8 whitespace-nowrap border-[#eff3f4] text-center text-gray-500">Phòng học</th>
                            <th className="py-4 px-12 md:px-6 border-b-8  whitespace-nowrap border-[#eff3f4] text-center text-gray-500">Giáo viên</th>
                            <th className="py-4 px-12 md:px-6 border-b-8 whitespace-nowrap border-[#eff3f4] text-center text-gray-500">Trạng thái</th>
                            <th className="py-4 px-6 md:px-6 border-b-8 border-[#eff3f4] text-center text-gray-500"> </th>
                            <th className="py-4 px-6 md:px-6 border-b-8 border-[#eff3f4] text-center text-gray-500"> </th>
                        </tr>
                    </thead>
                    <tbody>
                        {thoiKhoaBieuSapXep.map((item, index) => {
                            const { phanTruoc, thuc, tiet } = tachLichHoc(item.lichHoc);
                            const { text: statusText, color: statusColor, backGround: statusBackground } = getStatus(item);
                            return (
                                <tr key={index}>
                                    <td className="text-center  border-b-8 border-[#eff3f4] py-4 px-6 text-gray-500">{index + 1}</td>
                                    <td className="text-left border-b-8 border-[#eff3f4] py-4  text-gray-500">{item.tenHocPhan}</td>
                                    <td className="text-center border-b-8 border-[#eff3f4] py-4 px-6 text-gray-500">{phanTruoc}</td>
                                    <td className="text-center border-b-8 border-[#eff3f4] py-4 px-6 text-gray-500">{thuc}</td>
                                    <td className="text-center border-b-8 border-[#eff3f4] py-4 px-6 text-gray-500">{chuyenDoiTiet(tiet)}</td>
                                    <td className="text-left border-b-8 border-[#eff3f4] py-4 px-6 text-gray-500">{item.phongHoc}</td>
                                    <td className="text-left border-b-8 border-[#eff3f4] py-4 px-6 text-gray-500">{item.giaoVien}</td>
                                    <td className={`text-center border-b-8 border-[#eff3f4] py-2 px-6 ${statusColor}`}>
                                        <span className={`w-2 h-2 rounded-full inline-block ${statusBackground}`} style={{ display: 'inline-block', marginRight: '5px' }}></span>
                                        {statusText}
                                    </td>
                                    <td className='text-center border-b-8 border-[#eff3f4] py-4 px-6 text-green-500'>
                                        <FiEdit className='text-sm md:text-base cursor-pointer' />
                                    </td>
                                    <td className='text-center border-b-8 border-[#eff3f4] py-4 px-6 text-red-500'>
                                        <MdDelete className='text-sm md:text-xl cursor-pointer' />
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}