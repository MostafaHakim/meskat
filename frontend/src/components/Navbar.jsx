import React from "react";
import Image from "../assets/meskat.jpg";
const Navbar = () => {
  return (
    <div className="flex flex-col items-center justify-center py-2 bg-[#042F1C] w-full">
      <img className="w-72 h-10" src={Image} alt="" />
    </div>
  );
};

export default Navbar;
