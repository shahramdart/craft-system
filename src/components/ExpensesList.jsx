import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const ExpensesList = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(""); // State for selected month

  // Fetch all expenses data
  useEffect(() => {
    getExpenses();
  }, []);

  const getExpenses = async () => {
    setLoading(true);
    setError(null); // Reset error state before making a request
    try {
      const response = await axios.get("http://localhost:4000/api/expenses");
      setExpenses(response.data);
    } catch (err) {
      setError("Error fetching expenses");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Filter Expenses by selected month
  const filteredExpenses = selectedMonth
    ? expenses.filter((expense) => {
        const expenseDate = new Date(expense.createdAt);
        return expenseDate.getMonth() === parseInt(selectedMonth) - 1; // Match the month (0-indexed)
      })
    : expenses;

  return (
    <div className="container mx-auto mt-8 p-4">
      <h2 className="text-2xl text-gray-900 mb-6">لیستی کڕینەکان</h2>

      {loading && <p className="text-white">Loading...</p>}

      {/* Month filter input */}
      <div className="mb-4 flex justify-between items-center">
        <select
          id="month"
          className="flex-2 font-primaryRegular px-4 py-3 rounded-md bg-white shadow-md border border-gray-300"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          <option value="">هەموو مانگەکان</option>
          {Array.from({ length: 12 }, (_, index) => (
            <option key={index} value={index + 1}>
              {new Date(0, index).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>
        <button
          className="text-gray-400 px-2 py-1 ml-2 rounded hover:text-gray-900 transition"
          onClick={() => console.log("Print work")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-6"
          >
            <path
              fillRule="evenodd"
              d="M7.875 1.5C6.839 1.5 6 2.34 6 3.375v2.99c-.426.053-.851.11-1.274.174-1.454.218-2.476 1.483-2.476 2.917v6.294a3 3 0 0 0 3 3h.27l-.155 1.705A1.875 1.875 0 0 0 7.232 22.5h9.536a1.875 1.875 0 0 0 1.867-2.045l-.155-1.705h.27a3 3 0 0 0 3-3V9.456c0-1.434-1.022-2.7-2.476-2.917A48.716 48.716 0 0 0 18 6.366V3.375c0-1.036-.84-1.875-1.875-1.875h-8.25ZM16.5 6.205v-2.83A.375.375 0 0 0 16.125 3h-8.25a.375.375 0 0 0-.375.375v2.83a49.353 49.353 0 0 1 9 0Zm-.217 8.265c.178.018.317.16.333.337l.526 5.784a.375.375 0 0 1-.374.409H7.232a.375.375 0 0 1-.374-.409l.526-5.784a.373.373 0 0 1 .333-.337 41.741 41.741 0 0 1 8.566 0Zm.967-3.97a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H18a.75.75 0 0 1-.75-.75V10.5ZM15 9.75a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75V10.5a.75.75 0 0 0-.75-.75H15Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      <div className="overflow-x-auto">
        {filteredExpenses.length === 0 ? (
          <p className="text-gray-500 text-center py-4 font-primaryRegular">
            هیچ کڕینێک نەدۆزراندن
          </p>
        ) : (
          <table className="min-w-full table-auto ">
            <thead>
              <tr className="text-black">
                <th className=" px-4 py-2 text-right font-primaryRegular">
                  جۆری کڕین
                </th>
                <th className=" px-4 py-2 text-right font-primaryRegular">
                  دانە
                </th>

                <th className=" px-4 py-2 text-right font-primaryRegular">
                  جۆر
                </th>
                <th className=" px-4 py-2 text-right font-primaryRegular">
                  بەروار
                </th>
                <th className=" px-4 py-2 text-right font-primaryRegular">
                  نرخ
                </th>
                <th className=" px-4 py-2 text-right font-primaryRegular">
                  کۆی گشتی
                </th>
                <th className=" px-4 py-2 text-right font-primaryRegular">
                  لەلایەن
                </th>
                <th className=" px-4 py-2 text-right font-primaryRegular">
                  بینین
                </th>
              </tr>
              <tr>
                <td colSpan="8">
                  <hr className="h-0.25 bg-gray-700 my-2" />
                </td>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((expenses, index) => (
                <>
                  {" "}
                  <tr
                    key={`${expenses.uuid}-${expenses.product_name}`}
                    className="text-gray-900"
                  >
                    <td className=" px-4 py-2">{expenses.product_name}</td>
                    <td className=" px-4 py-2">{expenses.quantity}</td>
                    <td className=" px-4 py-2">
                      {expenses.category_name || "N/A"}
                    </td>

                    <td className=" px-4 py-2">
                      {expenses.createdAt
                        ? new Date(expenses.createdAt).toLocaleDateString(
                            "en-CA"
                          )
                        : "N/A"}
                    </td>
                    <td className=" px-4 py-2">${expenses.purchase_price}</td>
                    <td className=" px-4 py-2">
                      {`$${expenses.total_purchase}`}
                    </td>
                    <td className=" px-4 py-2">
                      {expenses.user_name || "N/A"}
                    </td>
                    <td className=" px-4 py-2 flex justify-start space-x-2">
                      {expenses?.id && (
                        <Link
                          to="/expenses/view"
                          state={{ id: expenses.id }}
                          className="text-gray-400 px-2 py-1 ml-2 rounded hover:bg-gray-4900 transition"
                          aria-label={`View details of expenses ${expenses.id}`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="h-6 w-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                            />
                          </svg>
                        </Link>
                      )}
                    </td>
                  </tr>
                  {index < filteredExpenses.length - 1 && (
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
        )}
      </div>
    </div>
  );
};

export default ExpensesList;
