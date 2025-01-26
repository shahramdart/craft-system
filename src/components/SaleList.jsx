import axios from "axios";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function SaleList() {
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState("");
  const [salesRecords, setSalesRecords] = useState([]);
  const [product_qrcode, setProductQrCode] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [items, setItems] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [quantity, setQuantity] = useState(1); // Initializing quantity state
  const [price, setPrice] = useState(0); // Initializing price state
  const [description, setDescription] = useState(""); // Initializing description state

  // ? for datepicker
  const [selectedDate, setSelectedDate] = useState(null); // Initialize the date state

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/product");
      setProducts(response.data);
    } catch (err) {
      setError("Error fetching products");
      console.error(err);
    }
  };

  const handleQrCodeChange = async (e) => {
    const enteredQrcode = e.target.value.trim(); // Remove extra spaces
    setProductQrCode(enteredQrcode);

    if (enteredQrcode === "") {
      setSelectedProduct(null);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:4000/api/product/qrcode/${enteredQrcode}`
      );

      const fetchedProduct = response.data;

      // Check if the product is already in salesRecords
      const isAlreadyAdded = salesRecords.some(
        (record) => record.productQrcode === fetchedProduct.product_qrcode
      );

      if (isAlreadyAdded) {
        alert("This product is already added.");
      } else {
        // Add fetched product to the salesRecords array with default values
        const newSale = {
          productName: fetchedProduct.product_name,
          categoryName: fetchedProduct.category?.category_name,
          brandName: fetchedProduct.brands?.brand_name,
          quantity: 1, // Default quantity
          price: 0, // Default price
          totalPrice: 0, // Calculated based on quantity and price
          discount: 0,
          productQrcode: fetchedProduct.product_qrcode,
        };
        setSalesRecords((prevRecords) => [...prevRecords, newSale]);
      }

      setSelectedProduct(fetchedProduct);
      setError(null);
    } catch (err) {
      setError("Product not found");
      setSelectedProduct(null);
    } finally {
      setLoading(false);
    }
  };

  // Update quantity or price dynamically
  const handleInputChange = (index, field, value) => {
    const updatedRecords = [...salesRecords];

    // Handle updating the field (including description which can be null)
    if (field === "description") {
      updatedRecords[index][field] = value === "" ? null : value; // Set null if value is empty string
    } else {
      updatedRecords[index][field] = value;
    }

    // Update total price when quantity or price changes
    if (field === "quantity" || field === "price") {
      const quantity = parseFloat(updatedRecords[index].quantity) || 0;
      const price = parseFloat(updatedRecords[index].price) || 0;
      updatedRecords[index].totalPrice = quantity * price;
    }

    setSalesRecords(updatedRecords);
  };

  // ? salling items
  const handleInsertSalesData = async () => {
    if (!selectedDate) {
      alert("Please select a date.");
      return;
    }

    const formattedDate = selectedDate.toISOString().split("T")[0]; // Convert to 'YYYY-MM-DD'

    const salesData = salesRecords.map((record) => ({
      salling_date: formattedDate,
      salling_quantity: record.quantity,
      salling_price: record.price,
      salling_discount: record.discount || 0,
      salling_description: record.description || null,
      salling_status: record.status || "Sale",
      product_id: record.productId,
      brand_id: record.brandId,
      invoice_customer: record.customer || "Walk-in",
    }));

    try {
      const response = await fetch("http://localhost:4000/api/salling", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sales: salesData }),
      });

      const result = await response.json();

      if (response.ok) {
        console.log("Sales data inserted successfully:", result);
        setSalesRecords([]); // Clear sales records
      } else {
        console.error("Error inserting sales data:", result);
        alert(result.msg || "Error inserting sales data.");
      }
    } catch (error) {
      console.error("Error inserting sales data:", error);
      alert("An error occurred while inserting sales data.");
    }
  };

  // Function to update the price and calculate the total with discount
  const handleDiscountChange = (e, index) => {
    const discountValue = parseFloat(e.target.value) || 0;

    const updatedRecords = salesRecords.map((record, idx) => {
      if (idx === index) {
        const discountedPrice = record.price * (1 - discountValue / 100);
        return {
          ...record,
          discount: discountValue,
          totalPrice: discountedPrice * record.quantity,
        };
      }
      return record;
    });

    setSalesRecords(updatedRecords);
  };

  const calculateTotal = (price, quantity, discount, index) => {
    if (isNaN(price) || isNaN(quantity) || price < 0 || quantity <= 0) {
      setTotalPrice(0); // Reset if invalid
      return;
    }

    const priceInCents = Math.round(price * 100);
    const discountAmountInCents = Math.round(priceInCents * (discount / 100));
    const discountedPriceInCents = priceInCents - discountAmountInCents;
    const totalInCents = discountedPriceInCents * quantity;

    const total = totalInCents / 100;

    // Check if the total price is below the purchase price
    if (
      selectedProduct &&
      totalInCents < selectedProduct.purchase_price * quantity * 100
    ) {
      alert(
        "Discount not allowed: Total sale price is less than the purchase price."
      );
      setDiscount(0); // Reset discount
      setTotalPrice(price * quantity); // Reset total price to without discount
      return;
    }

    // Update the specific item's total in the items array
    const updatedItems = [...items];
    updatedItems[index] = total;
    setItems(updatedItems);

    // Recalculate the grand total
    const newGrandTotal = updatedItems.reduce((sum, item) => sum + item, 0);
    setGrandTotal(newGrandTotal);

    setTotalPrice(total); // Set the calculated total price
  };

  const totalQuantity = salesRecords.reduce(
    (sum, record) => sum + (parseFloat(record.quantity) || 0),
    0
  );

  const grandTotals = salesRecords.reduce(
    (sum, record) => sum + (parseFloat(record.totalPrice) || 0),
    0
  );

  // ? add more record tbody in table
  const handleAddSale = () => {
    if (!productId) {
      alert("Please select a product first.");
      return;
    }

    // Find the selected product based on its `id`
    const selectedProduct = products.find(
      (product) => product.id === productId
    );

    if (!selectedProduct) {
      alert("Selected product is not found in the available list.");
      return;
    }

    // Check if the product is already in salesRecords
    const isAlreadyAdded = salesRecords.some(
      (record) => record.productId === selectedProduct.id
    );

    if (isAlreadyAdded) {
      alert("This product is already added.");
      return;
    }

    // Add selected product to the salesRecords array
    const newSale = {
      productName: selectedProduct.product_name,
      categoryName: selectedProduct.category?.category_name || "N/A",
      brandName: selectedProduct.brands?.brand_name || "N/A",
      quantity: 1, // Default quantity
      price: selectedProduct.price || 0, // Default price
      totalPrice: selectedProduct.price || 0, // Default total
      productId: selectedProduct.id,
    };

    setSalesRecords((prevRecords) => [...prevRecords, newSale]);
    setProductId(""); // Reset selection
  };

  const totalAmount = salesRecords.reduce((acc, record) => {
    // Ensure totalPrice is a number before adding
    return acc + (record.totalPrice || 0);
  }, 0);

  return (
    <div className="realtive px-6 py-8">
      <h2 className="text-2xl text-gray-900 mb-6 font-primaryRegular">
        بەشی فرۆشتن
      </h2>
      {/* // ? Flex container for datepicker and table */}
      <div className="flex flex-row items-start justify-start gap-16">
        {/* // ? rows for table and datepicker */}
        <div className="flex flex-col">
          {/* // ? Datepicker section */}
          <div className="relative max-w-[213px]">
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              className="peer w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-8 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow rtl:text-right"
              dateFormat="yyyy-MM-dd"
              placeholderText="Select date"
            />
            {/* // ? Calendar Icon */}
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <svg
                className="absolute left-1 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
              </svg>
            </div>
          </div>
          {/* // ? Discount section */}
          <div className="max-w-[212px] mt-10">
            <div className="relative group">
              {/* SVG Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-6 h-6 pointer-events-none"
              >
                <path
                  fillRule="evenodd"
                  d="M7.875 1.5C6.839 1.5 6 2.34 6 3.375v2.99c-.426.053-.851.11-1.274.174-1.454.218-2.476 1.483-2.476 2.917v6.294a3 3 0 0 0 3 3h.27l-.155 1.705A1.875 1.875 0 0 0 7.232 22.5h9.536a1.875 1.875 0 0 0 1.867-2.045l-.155-1.705h.27a3 3 0 0 0 3-3V9.456c0-1.434-1.022-2.7-2.476-2.917A48.716 48.716 0 0 0 18 6.366V3.375c0-1.036-.84-1.875-1.875-1.875h-8.25ZM16.5 6.205v-2.83A.375.375 0 0 0 16.125 3h-8.25a.375.375 0 0 0-.375.375v2.83a49.353 49.353 0 0 1 9 0Zm-.217 8.265c.178.018.317.16.333.337l.526 5.784a.375.375 0 0 1-.374.409H7.232a.375.375 0 0 1-.374-.409l.526-5.784a.373.373 0 0 1 .333-.337 41.741 41.741 0 0 1 8.566 0Zm.967-3.97a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H18a.75.75 0 0 1-.75-.75V10.5ZM15 9.75a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75V10.5a.75.75 0 0 0-.75-.75H15Z"
                  clipRule="evenodd"
                />
              </svg>
              {/* Button */}
              <button
                onClick={handleInsertSalesData}
                className="w-full bg-transparent text-start placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-6 py-4 transition duration-300 ease-in-out focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow hover:bg-gray-50 active:bg-gray-100 active:scale-95"
              >
                چاپکردن
              </button>
            </div>
          </div>
        </div>

        <div className="">
          <div className="flex flex-row items-start justify-start gap-10">
            {/* // ? qrcode input */}
            <div className="max-w-sm w-64">
              <div className="relative">
                {/* // ? <!-- SVG Icon --> */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 6.75h.75v.75h-.75v-.75ZM6.75 16.5h.75v.75h-.75v-.75ZM16.5 6.75h.75v.75h-.75v-.75ZM13.5 13.5h.75v.75h-.75v-.75ZM13.5 19.5h.75v.75h-.75v-.75ZM19.5 13.5h.75v.75h-.75v-.75ZM19.5 19.5h.75v.75h-.75v-.75ZM16.5 16.5h.75v.75h-.75v-.75Z"
                  />
                </svg>

                {/* // ? <!-- Input Field --> */}
                <input
                  className="peer w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-4 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow rtl:text-right"
                  value={product_qrcode}
                  onChange={handleQrCodeChange} // Handle barcode input change
                />
                {/* // ? <!-- Label --> */}
                <label className="absolute font-primaryRegular cursor-text bg-white px-1 right-2.5 top-3.5 text-slate-400 text-sm transition-all transform origin-right peer-focus:-top-2 peer-focus:right-2.5 peer-focus:text-xs peer-focus:text-slate-400 peer-focus:scale-90">
                  باڕکۆد
                </label>
              </div>
            </div>

            {/* // ? Category Selection (Select Dropdown) */}
            {/* Category Selection */}
            <div className="max-w-sm w-64">
              <div className="relative">
                <select
                  className="peer font-primaryRegular text-sm w-full bg-transparent placeholder:text-slate-400 text-slate-400 border border-slate-200 rounded-md py-[18px] transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow rtl:text-right"
                  value={productId}
                  onChange={(e) => setProductId(Number(e.target.value))} // Ensure it's stored as a number
                >
                  <option value="">هەموو کاڵاکان</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.product_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Add New Sale Button */}
            <button
              className="flex font-primaryRegular flex-row justify-center w-36 items-center rounded-md bg-slate-800 py-3 px-4 border border-transparent text-center text-lg text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
              type="button"
              onClick={handleAddSale}
              disabled={!productId} // Disable button if no product is selected
            >
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
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              زیادکردن
            </button>
          </div>

          {/* // ? Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto mt-12">
              <thead>
                <tr className="text-slate-500">
                  <th className="px-8 py-2 text-right font-primaryRegular">
                    جۆری کاڵا
                  </th>
                  <th className="px-8 py-2 text-right font-primaryRegular">
                    براند
                  </th>
                  <th className="px-8 py-2 text-right font-primaryRegular">
                    ناو
                  </th>
                  <th className="px-8 py-2 text-right font-primaryRegular">
                    عەدەد
                  </th>
                  <th className="px-8 py-2 text-right font-primaryRegular">
                    نرخ
                  </th>
                  <th className="px-8 py-2 text-right font-primaryRegular">
                    مجموع
                  </th>
                  <th className="px-8 py-2 text-right font-primaryRegular">
                    تێبینی
                  </th>
                </tr>
                <tr>
                  <td colSpan="7">
                    <hr className="h-0.25 bg-gray-700" />
                  </td>
                </tr>
              </thead>
              <tbody>
                {salesRecords.map((sale, index) => (
                  <tr key={index} className="text-gray-900">
                    <td className="px-8 py-2 text-sm text-right">
                      {sale.categoryName}
                    </td>
                    <td className="px-8 py-2 text-sm text-right">
                      {sale.brandName}
                    </td>
                    <td className="px-8 py-2 text-sm text-right">
                      {sale.productName}
                    </td>
                    <td className="px-8 py-2 text-sm text-right">
                      <input
                        value={sale.quantity}
                        onChange={(e) =>
                          handleInputChange(index, "quantity", e.target.value)
                        }
                        className="w-24 bg-white text-slate-700 text-sm py-3 border-b-2 border-slate-200 focus:border-slate-500 focus:outline-none transition duration-300 ease rtl:text-right"
                      />
                    </td>
                    <td className="py-2 text-sm text-right">
                      <div className="flex flex-row items-center max-w-sm w-48">
                        <div className="relative flex items-center">
                          <input
                            value={sale.price}
                            onChange={(e) =>
                              handleInputChange(index, "price", e.target.value)
                            }
                            className="w-24 bg-white text-slate-700 text-sm py-3 border-b-2 border-slate-200 focus:border-slate-500 focus:outline-none transition duration-300 ease rtl:text-right"
                          />
                          $
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-2 text-sm text-right">
                      ${sale.totalPrice}
                    </td>
                    <td className="py-2 text-sm text-right">
                      <div className="flex flex-row items-center max-w-sm w-64">
                        <div className="relative flex items-center">
                          <input
                            value={salesRecords[index]?.description || ""}
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                "description",
                                e.target.value
                              )
                            }
                            className="w-64 bg-white text-slate-700 text-sm py-3 border-b-2 border-slate-200 focus:border-slate-500 focus:outline-none transition duration-300 ease rtl:text-right"
                          />
                        </div>
                      </div>
                    </td>
                    <td>
                      <button
                        onClick={() =>
                          setSalesRecords((prevRecords) =>
                            prevRecords.filter((_, i) => i !== index)
                          )
                        }
                        className="text-gray-400 px-2 py-1 ml-2 rounded hover:text-red-600 transition"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="size-6"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              {/* total invoice */}
            </table>
            {/* total qty and price after */}
            <div className="h-8 bg-gray-100 w-full pr-2 rounded-b-sm flex items-center justify-between">
              <span className="h-8 w-[50%] text-start font-primaryRegular">
                کۆی گشتی پسوولە
              </span>
              <span className="h-8 w-[25%] pr-2 text-start font-primaryRegular bg-white">
                {totalQuantity} عدد
              </span>
              <span className="h-8 w-[25%] pr-2 text-start font-primaryRegular bg-white">
                ${totalAmount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* // ? detail about products */}
      <div className="absolute bg-white border-t-4 border-r-4 border-gray-200 rounded-tr-xl shadow-2xl min-w-[350px] min-h-[250px] p-6 bottom-0 left-0 flex flex-col justify-start items-start">
        {selectedProduct && (
          <>
            <div className="mb-10">
              <h2 className="text-lg font-normal">
                {selectedProduct?.brands?.brand_name} -{" "}
                {selectedProduct.product_name}
              </h2>
              <h2 className="">{selectedProduct.product_qty} عدد ماوە</h2>
            </div>
            <div className="">
              <h3 className="text-gray-500">
                نرخی کڕینی: {selectedProduct.product_price}$
              </h3>
              <span className="text-sm text-gray-500">
                جۆری کاڵا - {selectedProduct?.category?.category_name}{" "}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default SaleList;
