import React from "react";
import StateCard from "./StateCard";

function GridView() {
  return (
    <div className="px-4 grid gap-3 grid-cols-12">
      <StateCard />
    </div>
  );
}

export default GridView;
