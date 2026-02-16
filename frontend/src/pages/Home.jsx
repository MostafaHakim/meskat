import React, { useEffect, useState } from "react";
import Image from "../assets/meskaticon.svg";
import { Link } from "react-router-dom";

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="relative w-full h-screen flex items-center justify-center bg-[#042F1C] overflow-hidden">
      {/* Animated particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-ping"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.2}s`,
              opacity: 0.3,
            }}
          />
        ))}
      </div>

      {/* Main content with fade-in animations */}
      <div
        className={`relative z-10 text-center transform transition-all duration-1000 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      >
        {/* Welcome text with animation */}
        <div
          className={`transform transition-all duration-700 delay-300 ${
            isVisible
              ? "translate-y-0 opacity-100"
              : "-translate-y-10 opacity-0"
          }`}
        >
          <h3 className="text-white/90 text-lg lg:text-3xl font-light mb-6">
            ✦ Welcome To Meskat ✦
          </h3>
        </div>

        {/* Logo with 3D effect */}
        <div
          className={`transform transition-all duration-700 delay-500 ${
            isVisible ? "scale-100 opacity-100" : "scale-50 opacity-0"
          }`}
        >
          <div className="relative">
            <img
              className="w-80 h-80 lg:w-[30rem] lg:h-[30rem] mx-auto relative z-10 animate-float"
              src={Image}
              alt="Meskat Logo"
            />
            {/* Shadow effect */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-64 h-8 bg-black/20 rounded-full filter blur-xl"></div>
          </div>
        </div>

        {/* Bottom text with animation */}
        <div
          className={`transform transition-all duration-700 delay-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <h3 className="text-white text-xl lg:text-4xl font-semibold mt-8 max-w-4xl mx-auto px-4 leading-relaxed">
            Shaping the Future as a Leading Brand
          </h3>
          <div className="mt-6">
            <Link
              to="/mosquitonet"
              className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full border border-white/20 backdrop-blur-sm transition-all duration-300 hover:scale-105"
            >
              Discover More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
