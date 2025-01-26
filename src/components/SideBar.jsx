import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { HiMenuAlt3 } from "react-icons/hi";
import { MdCategory } from "react-icons/md";
import { FaList } from "react-icons/fa6";
import { AiOutlineUser } from "react-icons/ai";
import { IoLogOut, IoHome } from "react-icons/io5";
import { FaCartShopping } from "react-icons/fa6";
import { FaClipboardList } from "react-icons/fa6";
import { CgPlayList } from "react-icons/cg";
import { TbChecklist } from "react-icons/tb";
import { MdBrandingWatermark } from "react-icons/md";
import { HiClipboardList } from "react-icons/hi";
import { FaFileInvoiceDollar } from "react-icons/fa6";
import { RiPlayList2Line } from "react-icons/ri";
import { MdOutlineMoneyOff } from "react-icons/md";

import { LogOut, reset } from "../features/authSlice";

function SideBar({ children }) {
  // Logout functionality
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const logout = () => {
    dispatch(LogOut());
    dispatch(reset());
    navigate("/"); // Redirect to the login page after logout
  };

  // Sidebar open/close state
  const [open, setOpen] = useState(true);

  // Common menus
  const menus = [
    { name: "سەرەکی", link: "/dashboard", icon: IoHome },
    { name: "فرۆشتن", link: "/sale", icon: FaCartShopping },
    {
      name: "براندەکان",
      link: "/brands",
      icon: MdBrandingWatermark,
      margin: true,
    },
    { name: "جۆرەکان", link: "/category", icon: MdCategory },
    { name: "کاڵاکان", link: "/products", icon: FaList },
    {
      name: "پسوولە",
      link: "/invoice",
      icon: FaFileInvoiceDollar,
      margin: true,
    },
    {
      name: "لیستی فرۆشتن",
      link: "/allSale",
      icon: RiPlayList2Line,
    },

    {
      name: "لیستی کڕین",
      link: "/expenses",
      icon: FaClipboardList,
    },
    {
      name: "لیستی قەرزەکان",
      link: "/dept",
      icon: MdOutlineMoneyOff,
    },

    { name: "بەکارهێنەران", link: "/users", icon: AiOutlineUser },
  ];

  // Filter menus based on user's permission
  const filteredMenus =
    user?.permission_id !== 1
      ? menus.filter(
          (menu) =>
            menu.name !== "بەکارهێنەران" &&
            menu.name !== "جۆرەکان" &&
            menu.name !== "ڕێکخستن" &&
            menu.name !== "کۆی فرۆشتن" &&
            menu.name !== "کۆی کڕین" &&
            menu.name !== "پسوولە"
        )
      : menus;

  return (
    <section className="flex">
      <div
        className={`bg-gray-900 min-h-screen h-full ${
          open ? "w-48" : "w-16"
        } duration-500 text-gray-300 px-4`}
      >
        {/* Sidebar Toggle */}
        <div className="py-3 flex justify-end">
          <HiMenuAlt3
            size={26}
            className="cursor-pointer mt-5"
            onClick={() => setOpen(!open)}
          />
        </div>

        {/* Sidebar Menu Items */}
        <div className="mt-4 flex flex-col gap-4 relative">
          {filteredMenus.map((menu, index) => (
            <Link
              to={menu.link || "#"}
              key={index}
              className={`${
                menu.margin && "mt-5"
              } flex items-center text-lg gap-3.5 font-primaryRegular p-2 hover:bg-gray-800 rounded-md`}
            >
              <div>{React.createElement(menu.icon, { size: "20" })}</div>
              <h2
                style={{
                  transitionDelay: `${index + 3}00ms`,
                }}
                className={`whitespace-pre duration-500 ${
                  !open && "opacity-0 translate-x-28 overflow-hidden"
                }`}
              >
                {menu?.name}
              </h2>
            </Link>
          ))}

          {/* Logout Button for everyone */}
          <button
            onClick={logout}
            className="flex items-center text-base gap-3.5 font-medium p-2 hover:bg-gray-800 rounded-md mt-5"
          >
            <IoLogOut size={20} />
            <h2
              className={`whitespace-pre duration-500 ${
                !open && "opacity-0 translate-x-28 overflow-hidden"
              }`}
            >
              چوونەدەرەوە
            </h2>
          </button>
        </div>
      </div>
    </section>
  );
}

export default SideBar;
