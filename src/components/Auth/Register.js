import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Thêm thư viện axios để gửi dữ liệu lên server

export default function Register() {
  // State để quản lý các giá trị nhập liệu
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState(''); // Thêm state để quản lý lỗi
  const navigate = useNavigate(); // Sử dụng hook để điều hướng

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Xử lý logic đăng ký ở đây
    try {
      const response = await axios.post('http://192.168.1.6:5000/api/auth/register', {
        username,
        password,
        email,
      });
      console.log(response.data);
        navigate('/auth/login')
    } catch (error) {
      console.error('Lỗi khi đăng ký:', error);
      setError(error.response.data.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0f1233]">
        
      <form
        onSubmit={handleSubmit}
        className="bg-[#16193c] p-6 rounded-lg shadow-md w-96"
      >
        <h2 className="text-white text-sm flex justify-center font-semibold mb-4">Đăng ký</h2>
        {error && <span className="text-red-500 my-4 flex justify-center text-xs mt-2">{error}</span>}
        <div className="mb-4">
          <label htmlFor="username" className="block text-xs text-white mb-1">Tên đăng nhập:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full h-8 px-3 mt-2 text-white text-xs outline-none bg-[#0f1233] rounded-md focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-xs text-white mb-1">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-8 mt-2 px-3 text-white text-xs bg-[#0f1233] rounded-md focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-xs text-white mb-1">Mật khẩu:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-8 mt-2 px-3 text-white text-xs bg-[#0f1233] rounded-md focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full h-10 mt-4 bg-[#373d7e] text-white text-xs rounded-md hover:bg-blue-600"
        >
          Đăng Ký
        </button>

        <p className="text-white text-xs flex justify-center mt-4">
          Đã có tài khoản? <Link to="/auth/login" className="text-blue-500 ml-1">Đăng nhập</Link>
        </p>

        
      </form>
    </div>
  );
}
