import React from "react";
import chat from "../../assets/chat-removebg-preview.png";
import { useNavigate, useLocation } from "react-router-dom";

function CommunityChatOption() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleChat = () => {
    navigate("/chat-room");
  };

  const isChatPage = location.pathname === "/chat-room";
  const isLoginPage = location.pathname === "/login";
  const isRegisterPage = location.pathname === "/register";
  if (isChatPage) return null;
  if (isLoginPage) return null;
  if (isRegisterPage) return null;

  return (
    <div className="chat-option fixed bottom-4 right-4 cursor-pointer">
      <div
        className="bg-blue-500 flex flex-row items-center justify-center rounded-full p-3 gap-2 hover:bg-blue-800 hover:text-white"
        onClick={handleChat}
      >
        <img src={chat} height={40} width={40} alt="Chat Icon" />
        <h1>Chat</h1>
      </div>
    </div>
  );
}

export default CommunityChatOption;
