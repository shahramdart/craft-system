import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const FormAddUser = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [permissions, setPermissions] = useState([]);
  const [selectedPermission, setSelectedPermission] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  // Fetch permissions from the backend
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/permission"
        );
        setPermissions(response.data);
      } catch (error) {
        console.error("Failed to fetch permissions:", error);
        setMsg("Failed to load permissions");
      }
    };

    fetchPermissions();
  }, []);

  const saveUser = async (e) => {
    e.preventDefault();

    // Basic validation
    if (
      !name ||
      !email ||
      !password ||
      !userPhone ||
      !confirmPassword ||
      !selectedPermission
    ) {
      setMsg("All fields are required!");
      return;
    }

    // Check if password and confirm password match
    if (password !== confirmPassword) {
      setMsg("Passwords do not match!");
      return;
    }

    try {
      await axios.post("http://localhost:4000/api/users", {
        name,
        email,
        password,
        user_phone: userPhone,
        permission: selectedPermission, // Send the permission name, not the ID
      });
      navigate("/users"); // Redirect after successful creation
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg); // Display error message from backend
      } else {
        setMsg("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="p-6 bg-gray-800 min-h-screen overflow-hidden">
      <h2 className="text-2xl font-bold text-white mt-4 mb-4">Add User</h2>
      <div className="bg-gray-900 rounded-md p-6 shadow-lg">
        <form onSubmit={saveUser}>
          {msg && <p className="text-center text-red-500 mb-4">{msg}</p>}

          <div className="mb-4 flex gap-4">
            <div className="w-1/2">
              <label htmlFor="name" className="block text-white mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full p-2 rounded-md bg-gray-800 text-white border border-gray-700"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
              />
            </div>
            <div className="w-1/2">
              <label htmlFor="userPhone" className="block text-white mb-2">
                Phone
              </label>
              <input
                type="text"
                id="userPhone"
                className="w-full p-2 rounded-md bg-gray-800 text-white border border-gray-700"
                value={userPhone}
                onChange={(e) => setUserPhone(e.target.value)}
                placeholder="Phone"
              />
            </div>
            <div className="w-1/2">
              <label htmlFor="email" className="block text-white mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full p-2 rounded-md bg-gray-800 text-white border border-gray-700"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
              />
            </div>
          </div>

          <div className="mb-4 flex gap-4">
            <div className="w-1/2">
              <label htmlFor="password" className="block text-white mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full p-2 rounded-md bg-gray-800 text-white border border-gray-700"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
            </div>
            <div className="w-1/2">
              <label
                htmlFor="confirmPassword"
                className="block text-white mb-2"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="w-full p-2 rounded-md bg-gray-800 text-white border border-gray-700"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
              />
            </div>
            <div className="w-1/2">
              <label htmlFor="permissions" className="block text-white mb-2">
                Permission
              </label>
              <select
                id="permissions"
                className="w-full p-2 rounded-md bg-gray-800 text-white border border-gray-700"
                value={selectedPermission}
                onChange={(e) => setSelectedPermission(e.target.value)}
              >
                <option value="" disabled>
                  Select Permission
                </option>
                {permissions.map((permission) => (
                  <option key={permission.id} value={permission.permissions}>
                    {permission.permissions}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 text-white p-2 rounded-md hover:bg-green-600"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormAddUser;
