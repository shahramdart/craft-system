import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const FormAddCategory = () => {
  const [category_name, setCategory_name] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const saveUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:4000/api/categories", {
        category_name: category_name,
      });
      navigate("/category");
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      } else {
        setMsg("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="container mx-auto mt-10 px-4">
      <h2 className="mb-6 text-2xl font-semibold text-white">جۆر زیادبکە</h2>
      <div className="bg-gray-800 shadow-lg rounded-lg p-6">
        <form onSubmit={saveUser}>
          {msg && <p className="text-center text-red-500 mb-4">{msg}</p>}
          <div className="mb-4">
            <label
              htmlFor="category_name"
              className="block text-white font-medium mb-2"
            >
              ناوی جۆر
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring focus:ring-blue-500"
              id="category_name"
              value={category_name}
              onChange={(e) => setCategory_name(e.target.value)}
              placeholder="ناوی جۆر بنوسە"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormAddCategory;
