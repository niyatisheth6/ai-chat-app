import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";

function App() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isAiReady, setIsAiReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const menuRef = useRef(null);

  const addMessages = (meg, isUser) => {
    setMessages((prev) => [
      ...prev,
      { content: meg, isUser, id: Date.now() + Math.random() },
    ]);
  };

  const sendMessage = async () => {
    const message = inputMessage.trim();

    if (!message) return;

    if (!isAiReady) {
      addMessages("AI service is still loading. Please wait...", false);
      return;
    }

    addMessages(message, true);
    setInputMessage("");
    setIsLoading(true);

    try {
      const resaponse = await window.puter.ai.chat(message);
      const reply =
        typeof resaponse === "string"
          ? resaponse
          : resaponse.message?.content || "No reply received";
      addMessages(reply, false);
    } catch (err) {
      addMessages(`Error : ${err.message || "Something went wrong."}`, false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      setMessages();
    }
  };

  const scrollToBottom = () => {
    menuRef?.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const checkReady = setInterval(() => {
      if (
        window.puter &&
        window.puter.ai &&
        typeof window.puter.ai.chat === "function"
      ) {
        setIsAiReady(true);
        clearInterval(checkReady);
      }
    }, 300);
    return () => clearInterval(checkReady);
  }, []);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-sky-900 via-slate-950 to-emerald-900 flex flex-col items-center justify-center p-4 gap-8">
        <h1 className="text-6xl sm:text-7xl font-light bg-gradient-to-r from-emerald-400 via-sky-300 to-blue-500 bg-clip-text text-transparent text-center h-20">
          AI Chat APP
        </h1>
        <div
          className={`px-4 py-2 rounded-full text-sm ${
            isAiReady
              ? "bg-green-500/30 text-green-300 border border-gren-500/30"
              : "bg-yellow-500/20 text-yellow-300 border border-yellow-500/20"
          }`}
        >
          {isAiReady ? "AI Ready" : "Waiting for AI..."}
        </div>

        <div className="w-full max-w-3xl bg-gradient-to-r from-gray-800/90 to-gray-700/90 backdrop-blur-md border border-gray-600 rounded-3xl p-6 shadow-2xl">
          <div className="h-[37.5rem] overflow-y-auto border-b border-gray-600 mb-6 p-4 bg-gradient-to-b from-gray-900/50 to-gray-800/50 rounded-2xl">
            {messages?.length === 0 && (
              <div className="text-center text-gray-400 mt-20">
                Start the conversation by typing a message below.
              </div>
            )}
            {messages?.map((msg) => (
              <div
                key={msg.id}
                className={`p-3 m-2 rounded-2xl max-w-xs text-wrap ${
                  msg.isUser
                    ? "bg-gradient-to-r from-blue-600 to-emerald-500 text-white ml-auto text-right"
                    : "bg-gradient-to-r from-emerald-600 to-indigo-600 text-white"
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>
              </div>
            ))}
            {isLoading && (
              <div className="p-3 m-2 rounded-2xl max-w-xs bg-gradient-to-r from-emerald-600 to-indigo-600 text-white">
                <div className="flex items-center gap-2">
                  <div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full"></div>
                  Thinking...
                </div>
              </div>
            )}
            <div ref={menuRef}></div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={
                isAiReady
                  ? "Type your message..."
                  : "Waiting for AI to be ready..."
              }
              disabled={!isAiReady || isLoading}
              className="flex-1 px-4 py-3 bg-gra-700/80 border border-gray-600 rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:shadow-xl focus:shadow-sky-400/80 focus:ring-sky-500 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              onClick={sendMessage}
              disabled={!isAiReady || isLoading || !inputMessage.trim()}
              className="px-6 py-3 bg-gradient-to-r from-sky-400 to-emerald-400 hover:opacity-80 text-white font-semibold rounded-2xl transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full"></div>
                  Sending
                </div>
              ) : (
                "send"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
