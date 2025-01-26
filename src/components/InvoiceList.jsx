import React, { useRef, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Logo from "../assets/Logo.png";
import axios from "axios";

const InvoiceLists = () => {
  const location = useLocation();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const invoiceId = location.state?.id; // Accessing the invoice ID passed in the state

  useEffect(() => {
    if (invoiceId) {
      // Fetch the invoice details using the invoice ID
      getInvoiceDetails(invoiceId);
    }
  }, [invoiceId]);

  const getInvoiceDetails = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `http://localhost:4000/api/invoice/${id}`
      );
      setInvoice(response.data);
    } catch (err) {
      setError("Error fetching invoice details");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const printRef = useRef();
  const handlePrint = () => {
    // Backup original title
    const originalTitle = document.title;

    // Set new title for the print preview
    document.title = "Code Crafted";
    const now = new Date();
    const formattedDate = now.toLocaleDateString(); // e.g., "1/17/2025"
    const formattedTime = now.toLocaleTimeString(); // e.g., "10:34 AM"

    // Open print preview with right-aligned content
    const printContents = `
      <div style="text-align: right; direction: rtl; margin: 20px;">
        <header style="text-align: center; font-size: 15px; margin-bottom: 20px;">
          <strong>Code Crafted</strong>
        </header>
          <div style="text-align: end; margin-bottom: 10px; font-size: 10px">
        <span>${formattedDate}  ${formattedTime}</span>
      </div>
        ${printRef.current.innerHTML}
      </div>
    `;

    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();

    // Restore original content and title
    document.body.innerHTML = originalContents;
    document.title = originalTitle;

    window.location.reload(); // Reload to restore original content
  };

  return (
    <div className="div w-[50%] mt-8 p-4">
      {/* Invoice Content */}
      <div
        ref={printRef}
        className="flex flex-col justify-start items-start border border-gray-400 rounded-md"
      >
        <img src={Logo} alt="Logo" className="h-80" />
        {/* Invoice Details */}
        {invoice ? (
          <table className="min-w-full table-auto">
            <thead>
              <tr className="text-black bg-gray-200 border-solid border-b-2 border-gray-400">
                <th className="px-4 py-2 text-right font-primaryRegular">#</th>
                <th className="px-4 py-2 text-right font-primaryRegular">
                  مواد
                </th>
                <th className="px-4 py-2 text-right font-primaryRegular">
                  بەردوار
                </th>
                <th className="px-4 py-2 text-right font-primaryRegular">
                  عدد
                </th>
                <th className="px-4 py-2 text-right font-primaryRegular">
                  سعر
                </th>
                <th className="px-4 py-2 text-right font-primaryRegular">
                  مجموح
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-gray-500 bg-white">
                <td className="px-4 py-2 w-16">1</td>
                <td className="px-4 py-2  w-80">
                  {invoice.products.category.category_name} -{" "}
                  {invoice.products.brands.brand_name} -{" "}
                  {invoice.products.product_name}
                </td>
                <td className="px-4 py-2">
                  {invoice.invoice_date
                    ? new Date(invoice.invoice_date).toLocaleDateString("en-CA")
                    : "N/A"}
                </td>
                <td className="px-4 py-2">{invoice.invoice_quantity} عدد</td>
                <td className="px-4 py-2">${invoice.invoice_pirce}</td>
                <td className="px-4 py-2">${invoice.invoice_total_pirce}</td>
              </tr>
            </tbody>

            {/* Invoice Totals */}
            <tbody className="bg-gray-200 border-t-2 border-gray-400">
              <tr className="">
                <td className="px-4 py-2 text-md font-primaryRegular">
                  کۆی گشتی پسوولە
                </td>
                <td className="px-4 py-2"></td>
                <td className="px-4 py-2 font-medium w-36">
                  {invoice.invoice_quantity} عدد
                </td>
                <td className="px-4 py-2"></td>
                <td className="px-4 py-2 font-medium">
                  ${invoice.invoice_total_pirce}
                </td>
                <td className="px-4 py-2"></td>
              </tr>
            </tbody>

            {/* adding some space between invoice total and Invoice Totals after discount  */}

            <tbody className="h-10 bg-white ">
              <tr className="">
                <td className="px-4 py-2 text-md font-primaryRegular"></td>
                <td className="px-4 py-2"></td>
                <td className="px-4 py-2 font-medium"></td>
                <td className="px-4 py-2"></td>
                <td className="px-4 py-2 font-medium"></td>
              </tr>
            </tbody>

            {/* Invoice Totals after discount */}
            <tbody className="h-8 bg-gray-200 mt-10 pt-2 border-b-2 border-gray-400">
              <tr className="">
                <td className="px-4 py-2 text-md w-64 font-primaryRegular">
                  کۆی گشتی دوای داشکاندن (0.00%)
                </td>
                <td className="px-4 py-2"></td>
                <td className="px-4 py-2 font-medium"></td>
                <td className="px-4 py-2"></td>
                <td className="px-4 py-2">${invoice.invoice_total_pirce}</td>
                <td className="px-4 py-2 font-medium"></td>
              </tr>
            </tbody>

            <tbody className="h-8 bg-gray-200 mt-10 pt-2">
              <tr className="">
                <td className="px-4 py-2 text-md font-primaryRegular">
                  نرخی کۆتایی
                </td>
                <td className="px-4 py-2"></td>
                <td className="px-4 py-2 font-medium"></td>
                <td className="px-4 py-2"></td>
                <td className="px-4 py-2 text-center">
                  ${invoice.invoice_total_pirce}
                </td>
                <td className="px-4 py-2 font-medium"></td>
              </tr>
            </tbody>
          </table>
        ) : (
          <p>No invoice found</p>
        )}
      </div>

      {/* Print Button */}
      <button
        onClick={handlePrint}
        className="flex  items-center font-primaryRegular text-lg mt-10 bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-900"
      >
        چاپکردن{" "}
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
  );
};

export default InvoiceLists;
