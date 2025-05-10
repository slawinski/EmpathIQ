import React from "react";

export const Header: React.FC = () => {
  return (
    <header className="p-8 border-b border-gray-200 flex justify-center items-center bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50 shadow-lg relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 via-transparent to-blue-50/30 animate-gradient-x"></div>
      <h1 className="m-0 text-5xl font-black tracking-tight font-sans relative z-10">
        <span className="inline-block">
          <span className="relative">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 drop-shadow-lg animate-gradient-x">
              Empath
            </span>
          </span>
          <span className="relative">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 drop-shadow-lg animate-gradient-x">
              IQ
            </span>
          </span>
        </span>
      </h1>
    </header>
  );
};
