import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./components/Login";
import Users from "./pages/Users";
import AddUser from "./pages/AddUser";
import UpdateUser from "./pages/UpdateUser";
import AddProducts from "./pages/addProducts";
import AddCategory from "./pages/AddCategory";
import UpdateProducts from "./pages/UpdateProducts";
import Category from "./pages/category";
import Products from "./pages/Products";
import AllSales from "./pages/AllSales";
import Expenses from "./pages/Expenses";
import InvoiceSales from "./pages/InvoiceSale";
import Sale from "./pages/Sale";
import Brand from "./pages/Brand";
import AddBrand from "./pages/AddBrands";
import InvoiceList from "./pages/Invoice-list";

function App() {
  return (
    <div dir={"rtl"}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/users/add" element={<AddUser />} />
          <Route path="/users/update" element={<UpdateUser />} />
          <Route path="/category" element={<Category />} />
          <Route path="/category/add" element={<AddCategory />} />
          <Route path="/brands" element={<Brand />} />
          <Route path="/brand/add" element={<AddBrand />} />
          <Route path="/allSale" element={<AllSales />} />
          {/* <Route path="/allSale/view" element={<InvoiceList />} /> */}
          <Route path="/invoice/invoice-list" element={<InvoiceList />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/expenses/view" element={<Expenses />} />
          <Route path="/invoice" element={<InvoiceSales />} />
          <Route path="/sale" element={<Sale />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/add" element={<AddProducts />} />
          <Route path="/products/update" element={<UpdateProducts />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
