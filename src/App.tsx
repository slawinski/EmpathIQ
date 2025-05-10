import { useState } from "react";
import { Chat } from "./components/Chat";
import "./App.css";

function App() {
  const [sessionId] = useState(() => crypto.randomUUID());

  return (
    <div className="flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">EmpathIQ</h1>
        </div>
      </header>
      <main className="flex-1 overflow-hidden">
        <Chat sessionId={sessionId} />
      </main>
    </div>
  );
}

export default App;
