import { useState, useEffect, useRef } from "react";
import { getWeather } from "../services/weatherApi";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastCity, setLastCity] = useState(null);
  const chatEndRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // 🔹 Core function (used by input + quick buttons)
  const sendMessageWithText = async (text) => {
    if (!text.trim() || loading) return;

    const userText = text.trim();

    const userMessage = {
      role: "user",
      content: userText,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    // ✅ STEP 1: Detect forecast-style queries
    const isForecastQuery = /tomorrow|next week|forecast|rain tomorrow/i.test(
      userText.toLowerCase()
    );

    if (isForecastQuery) {
      setMessages((prev) => [
        ...prev,
        {
          role: "agent",
          content:
            "🌦️ Forecast support coming soon!\n\n" +
            "I currently provide real-time weather updates like temperature, " +
            "humidity, and current conditions.\n\n" +
            "Forecast-based queries (e.g. rain tomorrow) will be supported in a future update 🚀",
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
      setLoading(false);
      return; // ⛔ do NOT hit backend
    }

    try {
      // ✅ STEP 2: Detect follow-up questions
      const looksLikeQuestion =
        userText.toLowerCase().includes("?") ||
        userText.toLowerCase().startsWith("what") ||
        userText.toLowerCase().startsWith("should") ||
        userText.toLowerCase().startsWith("do i");

      let query = userText;

      // Reuse last city ONLY for follow-ups
      if (lastCity && looksLikeQuestion) {
        query = lastCity;
      }

      const data = await getWeather(query);

      // Remember city
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

  // Input send
  const sendMessage = () => sendMessageWithText(input);

  // Quick buttons
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

      {/* ✅ Quick Action Buttons (reviewer friendly) */}
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
