import React from 'react';

export default function UserAccount() {
  return (
    <div className="p-6 bg-white m-2 rounded-xl">
      <h2 className="text-sm text-gray-500 md:text-xl  flex justify-center mb-6 p-4">Thêm tài khoản</h2>

      {/* Form section */}
      <form className="space-y-4 mb-6 text-xs md:text-sm text-gray-500">
        <div className="flex items-center">
          <label htmlFor="accountType" className="w-48">Phân loại tài khoản:</label>
          <select id="accountType" name="accountType" className="p-2 border border-gray-300 rounded-md w-full">
            <option value="social">Mạng xã hội</option>
            <option value="bank">Ngân hàng</option>
            <option value="personal">Tài khoản cá nhân</option>
            <option value="other">Khác</option>
          </select>
        </div>
        <div className="flex items-center">
          <label htmlFor="username" className="w-48">Tên tài khoản:</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Nhập tên tài khoản"
            className="p-2 border border-gray-300 rounded-md w-full"
          />
        </div>
        <div className="flex items-center">
          <label htmlFor="username" className="w-48">Tên người dùng:</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Nhập tên tài khoản"
            className="p-2 border border-gray-300 rounded-md w-full"
          />
        </div>

        <div className="flex items-center">
          <label htmlFor="password" className="w-48">Mật khẩu:</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Nhập mật khẩu"
            className="p-2 border border-gray-300 rounded-md w-full"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-4 flex justify-center text-xs md:text-sm rounded-md hover:bg-blue-600"
        >
          Xác nhận
        </button>
      </form>


    </div>
  );
}
