import { useState, useEffect, useRef } from "react";
import { getWeather } from "../services/weatherApi";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastCity, setLastCity] = useState(null); // ✅ memory
  const chatEndRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userText = input;

    const userMessage = {
      role: "user",
      content: userText,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // ✅ If user didn’t mention city, reuse last city
      const looksLikeQuestion =
        userText.toLowerCase().includes("?") ||
        userText.toLowerCase().startsWith("what") ||
        userText.toLowerCase().startsWith("is") ||
        userText.toLowerCase().startsWith("should") ||
        userText.toLowerCase().startsWith("do i");

      let query = userText;

      // reuse last city ONLY for follow-up questions
      if (lastCity && looksLikeQuestion) {
        query = `${userText} in ${lastCity}`;
      }

      const data = await getWeather(query);

      // ✅ remember city for follow-ups
      if (data.city) {
        setLastCity(data.city);
      }

      const agentMessage = {
  role: "agent",
  content: 
`🌍 City: ${data.city}
🌡️ Temperature: ${data.temperature}°C
💧 Humidity: ${data.humidity}%
☁️ Condition: ${data.condition}

🤖 Advice:
${data.aiAdvice}`,
  timestamp: new Date().toLocaleTimeString(),
};


      setMessages((prev) => [...prev, agentMessage]);
    } catch (err) {
      const errorMessage = {
        role: "agent",
        content:
          err.response?.data?.message ||
          err.message ||
          "Sorry, I couldn't fetch the weather.",
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">🌦️ Weather Agent</div>

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
