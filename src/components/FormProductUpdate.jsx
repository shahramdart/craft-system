import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const UpdateProducts = () => {
  const [name, setName] = useState("");
  const [color, setColor] = useState("");
  const [price, setPrice] = useState("");
  const [qty, setQty] = useState("");
  const [qrcode, setQrcode] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [msg, setMsg] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const { id } = location.state || {}; // Get the product ID from state passed via the Link

  // Fetch categories data when the component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesResponse = await axios.get(
          "http://localhost:4000/api/categories"
        );
        setCategories(categoriesResponse.data);
      } catch (error) {
        setMsg("Error fetching categories");
      }
    };

    const fetchProduct = async () => {
      if (id) {
        try {
          const productResponse = await axios.get(
            `http://localhost:4000/api/product/${id}`
          );
          const product = productResponse.data;
          setName(product.product_name);
          setColor(product.product_color);
          setPrice(product.product_price);
          setQty(product.product_qty);
          setQrcode(product.product_qrcode);
          setCategoryId(product.category_id);
        } catch (error) {
          setMsg("Error fetching product data");
        }
      }
    };

    fetchCategories();
    fetchProduct();
  }, [id]);

  // Update product
  const updateProduct = async (e) => {
    e.preventDefault();
    const productData = {
      product_name: name,
      product_color: color,
      product_price: price,
      product_qty: qty,
      product_qrcode: qrcode,
      category_id: categoryId,
    };

    try {
      const response = await axios.put(
        `http://localhost:4000/api/product/${id}`,
        productData
      );
      console.log("Product updated successfully:", response);
      navigate("/products");
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      } else {
        setMsg("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="p-6 min-h-screen overflow-hidden bg-gray-100">
      <h2 className="text-3xl font-bold text-gray-800 mt-4 mb-6 text-center">
        زیادکردنی کاڵا
      </h2>
      <div className="bg-white rounded-md p-6 shadow-lg max-w-4xl mx-auto">
        <form onSubmit={updateProduct}>
          {msg && <p className="text-center text-red-500 mb-4">{msg}</p>}

          {/* Input Fields */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-black mb-2">
                ناوی کاڵا
              </label>
              <input
                type="text"
                id="name"
                className="w-full p-3 rounded-md bg-white shadow-md border border-gray-300"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ناوی کاڵا"
              />
            </div>

            <div>
              <label htmlFor="color" className="block text-black mb-2">
                ڕەنگی کاڵا
              </label>
              <input
                type="text"
                id="color"
                className="w-full p-3 rounded-md bg-white shadow-md border border-gray-300"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="ڕەنگی کاڵا"
              />
            </div>

            <div>
              <label htmlFor="price" className="block text-black mb-2">
                نرخی کاڵا
              </label>
              <input
                type="text"
                id="price"
                className="w-full p-3 rounded-md bg-white shadow-md border border-gray-300"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="نرخی کاڵا"
              />
            </div>

            <div>
              <label htmlFor="qty" className="block text-black mb-2">
                عەدەدی کاڵا
              </label>
              <input
                type="number"
                id="qty"
                className="w-full p-3 rounded-md bg-white shadow-md border border-gray-300"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                placeholder="عەدەدی کاڵا"
              />
            </div>

            <div>
              <label htmlFor="qrcode" className="block text-black mb-2">
                باڕکۆدی کاڵا
              </label>
              <input
                type="text"
                id="qrcode"
                className="w-full p-3 rounded-md bg-white shadow-md border border-gray-300"
                value={qrcode}
                onChange={(e) => setQrcode(e.target.value)}
                placeholder="باڕکۆدی کاڵا"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-black mb-2">
                جۆر
              </label>
              <select
                id="category"
                className="w-full p-3 rounded-md bg-white shadow-md border border-gray-300"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                <option value="">جۆر هەڵبژێرە</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.category_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 text-white p-3 rounded-md hover:bg-green-600 transition-all"
          >
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProducts;
