import { useState } from "react";
import { Chat } from "./components/Chat";
import "./App.css";

function App() {
  const [sessionId] = useState(() => crypto.randomUUID());

  return (
    <div className="h-screen flex flex-col">
      <header className="p-4 border-b border-gray-200">
        <h1 className="m-0">EmpathIQ</h1>
      </header>
      <main className="flex-1 overflow-hidden">
        <Chat sessionId={sessionId} />
      </main>
    </div>
  );
}

export default App;
