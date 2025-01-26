import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../features/authSlice";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const dispatch = useDispatch();
  const { user, isLoading, isError } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      dispatch(getUser());
    }
  }, [dispatch, user]);

  if (isLoading) return <p>Loading...</p>;

  if (isError || !user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
