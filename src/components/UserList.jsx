import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch users when the component mounts
  useEffect(() => {
    getUser();
  }, []);

  // Function to fetch users from the API
  const getUser = async () => {
    setLoading(true);
    setError(null); // Reset error state before making a request
    try {
      const response = await axios.get("http://localhost:4000/api/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Error fetching users");
    } finally {
      setLoading(false);
    }
  };

  // Function to delete a user
  const deleteUser = async (id) => {
    try {
      console.log("Deleting user with ID:", id); // Check the ID being passed
      await axios.delete(`http://localhost:4000/api/users/${id}`);
      getUser(); // Refresh the user list
    } catch (error) {
      console.error("Error deleting user:", error); // Log the full error object
    }
  };

  return (
    <div className="container mx-auto px-4 py-4">
      <h2 className="text-2xl mt-8 text-gray-900 mb-6 font-primaryRegular">
        لیستی بەکارهێنەران
      </h2>
      <Link
        to={`/users/add`}
        className="inline-block font-primaryRegular text-lg bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-900"
      >
        زیادکردن
      </Link>
      {loading && <p>Loading...</p>}
      {error && <p className="has-text-danger">{error}</p>}
      <div className="overflow-x-auto">
        <table className="min-w-full mx-auto table-auto ">
          <thead>
            <tr className="text-white">
              <th className="text-black text-right font-primaryRegular">#</th>
              <th className="text-black text-right font-primaryRegular">ناو</th>
              <th className="text-black text-right font-primaryRegular">
                ئیمەیڵ
              </th>
              <th className="text-black text-right font-primaryRegular">
                دەسەڵات
              </th>
              <th className="text-black text-right font-primaryRegular">
                کردارەکان
              </th>
            </tr>
            <tr>
              <td colSpan="8">
                <hr className="h-0.25 bg-gray-700" />
              </td>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <>
                <tr className="text-gray-900" key={user.id}>
                  <td className="text-black text-right px-4 py-2">
                    {index + 1}
                  </td>
                  <td className="text-black text-right px-4 py-2">
                    {user.name}
                  </td>
                  <td className="text-black text-right px-4 py-2">
                    {user.email}
                  </td>
                  <td className="text-black text-right px-4 py-2">
                    {user.permission.permissions}
                  </td>
                  <td>
                    <Link to={`/users/update`} state={{ id: user.id }}>
                      <button className="text-gray-400 ml-2 mr-2 px-2 py-1 rounded hover:text-gray-900 transition">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                          />
                        </svg>
                      </button>
                    </Link>

                    <button
                      onClick={() => deleteUser(user.id)}
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
                {index < users.length - 1 && (
                  <tr>
                    <td colSpan="8">
                      <hr className="h-0.25 bg-gray-700 my-2" />
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

export default UserList;
