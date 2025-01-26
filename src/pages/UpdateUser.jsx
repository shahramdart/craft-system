import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getUser } from "../features/authSlice";
import Layout from "./Layout";
import FormUserUpdate from "../components/FormUserUpdate";
const UpdateUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError, user } = useSelector((state) => state.auth);
  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      navigate("/");
    }
    if (user && user?.permission_id !== 1) {
      navigate("/dashboard");
    }
  }, [isError, user, navigate]);

  return (
    <Layout>
      <FormUserUpdate />
    </Layout>
  );
};

export default UpdateUser;
