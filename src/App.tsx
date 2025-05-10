import { useState } from "react";
import { Chat } from "./components/Chat";
import "./App.css";

function App() {
  const [sessionId] = useState(() => crypto.randomUUID());

  return (
    <div className="h-screen flex flex-col">
      <header className="p-8 border-b border-gray-200 flex justify-center items-center bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50 shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 via-transparent to-blue-50/30 animate-gradient-x"></div>
        <h1 className="m-0 text-6xl font-black tracking-tight font-sans group relative z-10">
          <span className="inline-block transform transition-all duration-700 hover:scale-105 hover:rotate-1 hover:translate-y-[-2px] cursor-default select-none">
            <span className="relative">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 drop-shadow-lg animate-gradient-x">
                Empath
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-blue-500/20 to-blue-600/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
            </span>
            <span className="relative">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 drop-shadow-lg animate-gradient-x">
                IQ
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-blue-500/20 to-blue-600/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
            </span>
          </span>
          <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-gray-300 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-x-0 group-hover:scale-x-100 origin-center"></span>
          <span className="absolute -top-2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-gray-300 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-x-0 group-hover:scale-x-100 origin-center"></span>
          <span className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></span>
        </h1>
      </header>
      <main className="flex-1 overflow-hidden">
        <Chat sessionId={sessionId} />
      </main>
    </div>
  );
}

export default App;
