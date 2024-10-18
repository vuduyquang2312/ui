import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import { FaRegBell, FaRegUser, FaBars, FaTimes } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import Account from "./pages/Account";
import History from "./pages/History";
import Chart from "./pages/Chart";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import QR from "./pages/QR";
import RandomNumber from './components/RandomNumber';
import ThoiKhoaBieu from './pages/ThoiKhoaBieu';
import UserAccount from './pages/UserAccount';
import './App.css';

const App = () => {
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleNotification = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  const isAuthPage = (pathname) => {
    return pathname.includes('/auth');
  };

  return (
    <Router>
      <div className="flex flex-col md:flex-row">
        {!isAuthPage(window.location.pathname) && (
          <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        )}

        <div className="flex-1 bg-[#eff3f4] min-h-screen rounded-sm">
          {!isAuthPage(window.location.pathname) && (
            <div className="w-auto h-20 bg-[#eff3f4] md:h-28 flex items-center justify-between border-b-2 px-8 md:px-8">
              <div className="flex items-center">
                <span className="hidden md:block text-lg md:text-base font-normal text-white"></span>
              </div>

              <div className="flex items-center justify-between space-x-6 md:space-x-8">
                <div className="relative"></div>
                <div className="flex items-center space-x-8">
                  <FaRegBell
                    className="text-[#6667ba] cursor-pointer text-base md:text-xl"
                    onClick={toggleNotification}
                  />
                  {isNotificationOpen && (
                    <div className="absolute top-20 right-20 bg-[#eff3f4] border shadow-lg w-80 rounded-lg p-4 z-50 flex flex-col">
                      <div className="flex items-center justify-between">
                        <span></span>
                        <span className="text-black  text-base">Thông báo</span>
                        <IoMdClose className='text-black cursor-pointer' onClick={toggleNotification}/>
                      </div>
                      <div className='p-4'>
                        <ul className="space-y-2 mt-4">
                          <li className="border-b border-gray-600 text-sm text-black py-2 flex flex-col">
                            <span>+2.000đ</span>
                            <span className='pt-2'>FT24274390251160</span>
                          </li>
                        </ul>
                        <ul className="space-y-2 mt-4">
                          <li className="border-b border-gray-600 text-sm text-black py-2 flex flex-col">
                            <span>+2.000đ</span>
                            <span className='pt-2'>FT24274390251160</span>
                          </li>
                        </ul>
                        <ul className="space-y-2 mt-4">
                          <li className="border-b border-gray-600 text-sm text-black py-2 flex flex-col">
                            <span>+2.000đ</span>
                            <span className='pt-2'>FT24274390251160</span>
                          </li>
                        </ul>
                        <ul className="space-y-2 mt-4">
                          <li className="border-b border-gray-600 text-sm text-black py-2 flex flex-col">
                            <span>+2.000đ</span>
                            <span className='pt-2'>FT24274390251160</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}
                  <FaRegUser className="text-[#6667ba] cursor-pointer text-base md:text-xl" />
                  <div className="md:hidden">
                    {isSidebarOpen ? (
                      <FaTimes className="text-[#6667ba] text-base cursor-pointer" onClick={toggleSidebar} />
                    ) : (
                      <FaBars className="text-[#6667ba] text-base cursor-pointer" onClick={toggleSidebar} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="md:p-2 md:h-[calc(100vh-7rem)] overflow-y-auto">
            <Routes>
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/register" element={<Register />} />
              <Route path="/" element={<div className="p-6">Welcome Home!</div>} />
              <Route path="/create-qr" element={<QR />} />
              <Route path="/account" element={<Account />} />
              <Route path="/history" element={<History />} />
              <Route path="/thoi-khoa-bieu" element={<ThoiKhoaBieu />} />
              <Route path="/chart" element={<Chart />} />
              <Route path="/random-number"/>
              <Route path="/random-milisecond" element={<RandomNumber />} />
              <Route path="/user-account" element={<UserAccount />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;