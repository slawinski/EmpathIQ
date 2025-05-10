import { useState } from "react";
import { Chat } from "./components/Chat";
import { Header } from "./components/Header";
import "./App.css";

function App() {
  const [sessionId] = useState(() => crypto.randomUUID());

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <main className="flex-1 overflow-hidden">
        <Chat sessionId={sessionId} />
      </main>
    </div>
  );
}

export default App;
