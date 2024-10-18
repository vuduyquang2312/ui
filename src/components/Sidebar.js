import { Link } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import { TbCalendarTime } from "react-icons/tb";
import { HiHome } from "react-icons/hi2";
import { MdAccountBalance } from "react-icons/md";
import { ImClock } from "react-icons/im";
import { TbArrowsRandom } from "react-icons/tb";
import { IoMdSettings } from "react-icons/io";
import { IoHourglassOutline } from "react-icons/io5";
import { LuPlusCircle } from "react-icons/lu";
import { MdAccountTree } from "react-icons/md";
import { MdOutlineWorkHistory } from "react-icons/md";
import { useState } from "react";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  // State để lưu mục được chọn
  const [activeLink, setActiveLink] = useState("/");

  // Hàm để xử lý khi nhấn vào một mục
  const handleClick = (link) => {
    setActiveLink(link);
    toggleSidebar();
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 md:hidden z-40"
          onClick={toggleSidebar}
        ></div>
      )}

      <div
        className={`fixed inset-y-0 left-0 transform ${isOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 font-normal md:relative md:translate-x-0 md:w-64 w-52 h-screen overflow-y-auto bg-white text-gray-700 z-50 shadow-lg`}
      >
        <div className="flex justify-between items-center h-20 px-4 md:h-28 border-b border-gray-200">
          <h2 className="text-xl font-medium"></h2>
          <FaTimes
            className="text-gray-500 text-sm cursor-pointer md:hidden"
            onClick={toggleSidebar}
          />
        </div>

        <nav className="flex flex-col p-4 text-xs md:space-y-4 space-y-2">
          <Link
            to="/"
            className={`flex items-center hover:bg-blue-200 text-gray-500 transition duration-300 p-4 text-xs md:text-sm rounded-lg ${activeLink === "/" ? "bg-blue-200 text-blue-500" : ""}`}
            onClick={() => handleClick("/")}
          >
            <HiHome className="mr-3 text-blue-500" />
            Trang chủ
          </Link>

          <span className="text-xs md:text-sm text-gray-500 mt-4">Ngân hàng</span>
          <Link
            to="/account"
            className={`flex items-center hover:bg-indigo-200 text-gray-500 transition duration-300 p-4 text-xs md:text-sm rounded-lg ${activeLink === "/account" ? "bg-indigo-200 text-indigo-500" : ""}`}
            onClick={() => handleClick("/account")}
          >
            <MdAccountBalance className="mr-3 text-indigo-500" />
            Tài khoản
          </Link>
          <Link
            to="/history"
            className={`flex items-center hover:bg-teal-200 text-gray-500 transition duration-300 p-4 text-xs md:text-sm rounded-lg ${activeLink === "/history" ? "bg-teal-200 text-teal-500" : ""}`}
            onClick={() => handleClick("/history")}
          >
            <ImClock className="mr-3 text-teal-500" />
            Lịch sử giao dịch
          </Link>

          <Link
            to="/create-qr"
            className={`flex items-center hover:bg-green-300 text-gray-500 transition duration-300 p-4 text-xs md:text-sm rounded-lg ${activeLink === "/create-qr" ? "bg-green-300 text-green-500" : ""}`}
            onClick={() => handleClick("/create-qr")}
          >
            <LuPlusCircle className="mr-3 text-green-500" />
            Tạo QR
          </Link>

          <span className="text-xs md:text-sm mt-4 text-gray-500">Quản lí</span>
          <Link
            to="/thoi-khoa-bieu"
            className={`flex items-center hover:bg-purple-200 text-gray-500 transition duration-300 p-4 text-xs md:text-sm rounded-lg ${activeLink === "/thoi-khoa-bieu" ? "bg-purple-200 text-purple-500" : ""}`}
            onClick={() => handleClick("/thoi-khoa-bieu")}
          >
            <TbCalendarTime className="mr-3 text-purple-500" />
            Thời khóa biểu
          </Link>
          <Link
            to="/user-account"
            className={`flex items-center hover:bg-pink-200 text-gray-500 transition duration-300 p-4 text-xs md:text-sm rounded-lg ${activeLink === "/telegram" ? "bg-pink-200 text-pink-500" : ""}`}
            onClick={() => handleClick("/user-account")}
          >
            <MdAccountTree className="mr-3 text-pink-500" />
            Tài khoản
          </Link>
          <Link
            to="/tien-luong"
            className={`flex items-center hover:bg-pink-200 text-gray-500 transition duration-300 p-4 text-xs md:text-sm rounded-lg ${activeLink === "/tien-luong" ? "bg-purple-200 text-pink-500" : ""}`}
            onClick={() => handleClick("/tien-luong")}
          >
            <MdOutlineWorkHistory  className="mr-3 text-pink-500" />
            Tiền lương
          </Link>
          <span className="text-xs md:text-sm mt-4 text-gray-500">Ngẫu nhiên</span>
          <Link
            to="/random-number"
            className={`flex items-center hover:bg-yellow-200 text-gray-500 transition duration-300 p-4 text-xs md:text-sm rounded-lg ${activeLink === "/random-number" ? "bg-yellow-200 text-yellow-500" : ""}`}
            onClick={() => handleClick("/random-number")}
          >
            <TbArrowsRandom className="mr-3 text-yellow-500" />
            Số ngẫu nhiên
          </Link>
          <Link
            to="/random-milisecond"
            className={`flex items-center hover:bg-orange-200 text-gray-500 transition duration-300 p-4 text-xs md:text-sm rounded-lg ${activeLink === "/random-milisecond" ? "bg-orange-200 text-orange-500" : ""}`}
            onClick={() => handleClick("/random-milisecond")}
          >
            <IoHourglassOutline className="mr-3 text-orange-500" />
            MiliSecond
          </Link>

          <span className="text-xs md:text-sm mt-4 text-gray-500">Cài đặt</span>
          <Link
            to="/settings"
            className={`flex items-center hover:bg-red-200 text-gray-500 transition duration-300 p-4 text-xs md:text-sm rounded-lg ${activeLink === "/settings" ? "bg-red-200 text-red-500" : ""}`}
            onClick={() => handleClick("/settings")}
          >
            <IoMdSettings className="mr-3 text-red-500" />
            Cài đặt
          </Link>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
