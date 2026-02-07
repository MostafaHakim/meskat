import React from "react";
import Image from "../assets/meskat.jpg";
const Navbar = () => {
  return (
    <div className="flex flex-col items-center justify-center py-2 bg-[#042F1C]">
      <img className="w-1/2" src={Image} alt="" />
    </div>
  );
};

export default Navbar;
