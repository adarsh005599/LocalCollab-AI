import React, { useContext, useState, useEffect, useRef } from 'react';
import './Main.css';
import { assets } from '../../assets/assets';
import { AppContext } from '../../Context/Context';
import { runGeminiPrompt } from "../../Config/cohere.js";
import logo from '../Main/logo.png';
import ReactMarkdown from 'react-markdown';
import { Mic, Send, Image as ImageIcon, Sparkles } from 'lucide-react';

export const Main = () => {
  const [prompt, setPrompt] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef(null);
  const { chatHistory, setChatHistory, saveSession } = useContext(AppContext);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSend = async () => {
    if (isTyping || !prompt.trim()) return;

    const newUserMsg = { role: 'user', prompt };
    const updatedHistory = [...chatHistory, newUserMsg];
    setChatHistory(updatedHistory);
    setIsTyping(true);

    const reply = await runGeminiPrompt(prompt);

    const newBotMsg = {
      role: 'assistant',
      response: reply || '⚠️ Our systems are currently busy. Please try again.',
    };

    const newChat = [...updatedHistory, newBotMsg];
    setChatHistory(newChat);
    setIsTyping(false);
    setPrompt('');
    saveSession(newChat);
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Browser doesn't support voice input.");
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.onresult = (e) => {
      setPrompt((prev) => prev + ' ' + e.results[0][0].transcript);
    };
    recognition.start();
  };

  return (
    <div className="Main">
      <nav className="nav">
        <div className="nav-brand">
          <Sparkles className="brand-icon" size={20} />
          <p>Colab</p>
        </div>
        <img src={logo} alt="user profile" className="user-avatar" />
      </nav>

      <div className="Main-container">
        {chatHistory.length === 0 && (
          <div className="greet">
            <p><span>Hey, User.</span></p>
            <p>How can I bridge your Bussiness gap today?</p>
          </div>
        )}

        <div className="chat-container" ref={chatContainerRef}>
          {chatHistory.map((msg, index) => (
            <div key={index} className={`chat-wrapper ${msg.role === 'user' ? 'user-wrapper' : 'ai-wrapper'}`}>
              <div className={`chat-bubble ${msg.role === 'user' ? 'user' : 'ai'}`}>
                {msg.role === 'user' ? (
                  msg.prompt
                ) : (
                  <div className="markdown-content">
                    <ReactMarkdown>{msg.response}</ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="chat-wrapper ai-wrapper">
              <div className="chat-bubble ai typing">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            </div>
          )}
        </div>

        <div className="main-bottom">
          <div className="search-box">
            <input
              type="text"
              placeholder="Ask anything about the ecosystem..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <div className="input-actions">
              
              
           
              
              <button className={`send-btn ${prompt.trim() ? 'active' : ''}`} onClick={handleSend}>
                <Send className='send-icon' size={18} />
              </button>
            </div>
          </div>
          <p className="bottom-info">
            LocalCollab AI is building opportunity beyond metros.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Main;