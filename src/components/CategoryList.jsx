import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const CategoryList = () => {
  const [categorys, setCategory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getCategory();
  }, []);

  const getCategory = async () => {
    setLoading(true);
    setError();
    try {
      const response = await axios.get("http://localhost:4000/api/categories");
      setCategory(response.data);
    } catch (err) {
      setError("Error fetching categories");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id) => {
    try {
      setCategory((prevCategories) =>
        prevCategories.filter((cat) => cat.id !== id)
      );
      await axios.delete(`http://localhost:4000/api/categories/${id}`);
      getCategory();
    } catch (err) {
      getCategory();
      setError("Error deleting category");
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center mt-10">
      <div className="w-10/12">
        <h2 className="text-2xl text-gray-900 mb-6 font-primaryRegular">
          لیستی جۆرەکان
        </h2>
        <div className="mb-4 flex items-center space-x-2">
          <Link
            to={`/brand/add`}
            className="flex items-center bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-900"
          >
            <span className="ml-4 font-primaryRegular text-lg">
              زیادکردنی جۆر
            </span>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 ml-2"
            >
              <path
                fillRule="evenodd"
                d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>

        {loading && <p className="text-gray-500 text-center">Loading...</p>}
        {error && (
          <p className="text-red-500 text-center">کێشەیەکی تەکنیکی هەیە</p>
        )}
        <table className="w-full table-auto">
          <thead>
            <tr className="text-black">
              <th className="px-4 py-2 text-right font-primaryRegular">
                ناوی جۆر
              </th>
              <th className="pl-24 py-2 text-right font-primaryRegular">
                کردارەکان
              </th>
            </tr>
            <tr>
              <td colSpan="8">
                <hr className="h-0.25 w-[900px] bg-gray-700" />
              </td>
            </tr>
          </thead>
          <tbody>
            {categorys.map((category, index) => (
              <>
                <tr key={category.id} className=" text-gray-900">
                  <td className="px-4 py-2">{category.category_name}</td>
                  <td className="pl-6 py-2 flex justify-start space-x-2">
                    <Link
                      to="/koga"
                      state={{ id: category.id }}
                      className="text-gray-400 px-2 py-1 ml-2 rounded hover:text-gray-900 transition"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="size-6"
                      >
                        <path d="M5.625 3.75a2.625 2.625 0 1 0 0 5.25h12.75a2.625 2.625 0 0 0 0-5.25H5.625ZM3.75 11.25a.75.75 0 0 0 0 1.5h16.5a.75.75 0 0 0 0-1.5H3.75ZM3 15.75a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75ZM3.75 18.75a.75.75 0 0 0 0 1.5h16.5a.75.75 0 0 0 0-1.5H3.75Z" />
                      </svg>
                    </Link>
                    <Link
                      to="/category/update"
                      state={{ id: category.id }}
                      className="text-gray-400 px-2 py-1 ml-2 rounded hover:text-gray-900 transition"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="size-6"
                      >
                        <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
                        <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
                      </svg>
                    </Link>
                    <button
                      onClick={() => deleteCategory(category.id)}
                      className="text-gray-400 px-2 py-1 ml-2 rounded hover:text-red-600 transition"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        class="size-6"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
                {index < categorys.length - 1 && (
                  <tr>
                    <td colSpan="8">
                      <hr className="h-0.25 w-[900px] bg-gray-700 my-2" />
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryList;
