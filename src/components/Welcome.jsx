import React from "react";
import { useSelector } from "react-redux";
import GridView from "./GridView";

const Welcome = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="py-4">
      <GridView />
    </div>
  );
};

export default Welcome;
