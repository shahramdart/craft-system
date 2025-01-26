import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const FormUserUpdate = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = location.state || {};

  useEffect(() => {
    const getUserById = async () => {
      if (!id) return;
      try {
        const response = await axios.get(
          `http://localhost:4000/api/users/${id}`
        );
        setName(response.data.name);
        setEmail(response.data.email);
        setRole(response.data.permission);
        setUserPhone(response.data.user_phone);
      } catch (error) {
        setMsg("Error fetching user data");
      }
    };
    getUserById();
  }, [id]);

  const updateUser = async (e) => {
    e.preventDefault();

    const roleMap = { admin: 1, user: 2 };
    const permissionValue = roleMap[role];

    const userData = {
      name,
      email,
      user_phone: userPhone,
      permission: permissionValue,
      ...(password && { password }),
    };

    try {
      await axios.put(`http://localhost:4000/api/users/${id}`, userData);
      navigate("/users");
    } catch (error) {
      setMsg("Error updating user");
    }
  };

  return (
    <div className="p-6 min-h-screen overflow-hidden bg-gray-100">
      <h2 className="text-3xl font-bold text-gray-800 mt-4 mb-6 text-center">
        نوێکردنەوەی بەکارهێنەر
      </h2>
      <div className="bg-white rounded-md p-6 shadow-lg max-w-4xl mx-auto">
        <form onSubmit={updateUser}>
          {msg && <p className="text-center text-red-500 mb-4">{msg}</p>}

          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-black mb-2">
                ناو
              </label>
              <input
                type="text"
                id="name"
                className="w-full p-3 rounded-md bg-white shadow-md border border-gray-300"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ناوی بەکارهێنەر"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-black mb-2">
                ئیمەیڵ
              </label>
              <input
                type="email"
                id="email"
                className="w-full p-3 rounded-md bg-white shadow-md border border-gray-300"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ئیمەیڵ"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-black mb-2">
                وشەی نهێنی نوێ
              </label>
              <input
                type="password"
                id="password"
                className="w-full p-3 rounded-md bg-white shadow-md border border-gray-300"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="وشەی نهێنی نوێ"
              />
            </div>

            <div>
              <label htmlFor="userPhone" className="block text-black mb-2">
                ژمارە مۆبایل
              </label>
              <input
                type="text"
                id="userPhone"
                className="w-full p-3 rounded-md bg-white shadow-md border border-gray-300"
                value={userPhone}
                onChange={(e) => setUserPhone(e.target.value)}
                placeholder="ژمارە مۆبایل"
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-black mb-2">
                دەسەڵات
              </label>
              <select
                id="role"
                className="w-full p-3 rounded-md bg-white shadow-md border border-gray-300"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="">دەسەڵات هەڵبژێرە</option>
                <option value="admin">بەڕێوەبەر</option>
                <option value="user">بەکارهێنەر</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition-all"
          >
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormUserUpdate;
