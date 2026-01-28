import { useState, useEffect, useRef } from "react";
import { getWeather } from "../services/weatherApi";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastCity, setLastCity] = useState(null);
  const chatEndRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // 🔹 Core function (used by input + quick buttons)
  const sendMessageWithText = async (text) => {
    if (!text.trim() || loading) return;

    const userMessage = {
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setInput("");

    try {
      // Detect follow-up questions
      const looksLikeQuestion =
        text.toLowerCase().includes("?") ||
        text.toLowerCase().startsWith("what") ||
        text.toLowerCase().startsWith("is") ||
        text.toLowerCase().startsWith("should") ||
        text.toLowerCase().startsWith("do i");

      let query = text;

      // Reuse last city for follow-ups
      if (lastCity && looksLikeQuestion) {
        query = lastCity; // only city goes to backend
      }


      const data = await getWeather(query);

      if (data.city) {
        setLastCity(data.city);
      }

      const agentMessage = {
        role: "agent",
        content:
          `🌍 City: ${data.city}\n` +
          `🌡️ Temperature: ${data.temperature}°C\n` +
          `💧 Humidity: ${data.humidity}%\n` +
          `☁️ Condition: ${data.condition}\n\n` +
          `🤖 Advice:\n${data.aiAdvice}`,
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, agentMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "agent",
          content:
            err.response?.data?.message ||
            "Sorry, I couldn't fetch the weather.",
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Input send
  const sendMessage = () => sendMessageWithText(input);

  // 🔹 Quick button handler
  const handleQuickQuery = (text) => {
    if (loading) return;
    sendMessageWithText(text);
  };

  return (
    <div className="chat-container">
      <div className="chat-header">🌦️ Weather AI Agent</div>

      <div className="chat-body">
        {messages.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.role}`}>
            <div className="bubble">
              <pre>{msg.content}</pre>
              <span className="time">{msg.timestamp}</span>
            </div>
          </div>
        ))}

        {loading && (
          <div className="chat-message agent">
            <div className="bubble">Fetching weather insights…</div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Quick Action Buttons */}
      <div className="quick-actions">
        <button onClick={() => handleQuickQuery("Pune")}>Pune</button>
        <button onClick={() => handleQuickQuery("Mumbai")}>Mumbai</button>
        <button onClick={() => handleQuickQuery("Delhi")}>Delhi</button>
        <button onClick={() => handleQuickQuery("Chennai")}>Chennai</button>
      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder="Ask about weather (e.g. Mumbai or Tell me about Delhi weather)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          disabled={loading}
        />
        <button onClick={sendMessage} disabled={loading}>
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;
