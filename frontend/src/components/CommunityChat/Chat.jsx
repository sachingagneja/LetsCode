import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import Input from "../Input";
import link from "../../assets/link.json";
function Chat() {
  const username = localStorage.getItem("username");
  const [welcome, setWelcome] = useState("");
  const [showWelcome, setShowWelcome] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [displayMsg, setDisplayMsg] = useState([]);
  const navigate = useNavigate();
  const socket = useMemo(() => io(`${link.url}`), []);
  const token = localStorage.getItem("jwtToken");
  const [err, setErr] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    try {
      if (!token) {
        navigate("/login");
      }

      const welcomeSocket = (msg) => {
        setShowWelcome(true);
        setWelcome(msg);
        setTimeout(() => {
          setWelcome("");
          setShowWelcome(false);
        }, 3000);
      };

      socket.emit("join", username);

      const recMsg = ({ username, message }) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { name: username, msg: message },
        ]);
      };

      socket.on("join-greet", welcomeSocket);
      socket.on("rec-msg", recMsg);

      return () => {
        socket.off("join-greet", welcomeSocket);
        socket.off("rec-msg", recMsg);
      };
    } catch (error) {
      setErr(error.message);
    }
  }, [navigate, username, socket]);

  const handleSend = async () => {
    try {
      if (message !== "") {
        socket.emit("send-msg", { username, message });

        const check = async () => {
          const isProfane = await axios.post(
            `https://profanity-filter-seven.vercel.app/bad-word`,
            {
              message: message,
            },
          );
          console.log(isProfane);
          if (isProfane.data === true) {
            alert(
              `Don't swear otherwise will be reported and your account will be suspended`,
            );
            await axios.patch(`${link.url}/${username}/updateReportCount`);
            const del = await axios.delete(
              `${link.url}/${username}/deleteUser`,
            );

            if (del.status === 200) {
              localStorage.removeItem("jwtToken");
              localStorage.removeItem("username");
              localStorage.removeItem("isAdmin");
              navigate(`/login`);
            }
          }
        };
        check();

        await axios.post(`${link.url}/${username}/chat-room`, {
          message: message,
        });
        setMessage("");
      } else {
        setErr("Enter some value");
      }
    } catch (error) {
      setErr(error.message);
    }
  };

  useEffect(() => {
    const mess = async () => {
      const response = await axios.get(`${link.url}/display-messages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDisplayMsg(response.data.mess);
    };
    mess();
  }, [messages, displayMsg, token]);
  return (
    <div className="chat-container flex flex-col items-center h-screen">
      <h1 className="text-center font-bold text-2xl py-5">Chat</h1>
      {showWelcome && <h3>{welcome}</h3>}
      {err && <h1 className="text-red-700 text-xl font-bold">{err}</h1>}
      <div className="max-h-[75vh] overflow-y-auto flex-grow bg-gray-300 w-full px-4 py-2 scroll-smooth">
        {displayMsg.map((msg, index) => (
          <div key={index} className="message bg-white p-2 rounded-lg mb-2">
            <span className="font-semibold">{msg.username}: </span>
            {msg.message}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center bg-white w-full py-2 px-4 fixed bottom-0 left-0">
        <Input
          placeholder="Message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-grow py-2 px-4 bg-gray-200 rounded-lg border border-gray-400 mr-2"
        />
        <button
          className="border border-blue-500 bg-blue-500 text-white py-2 px-6 rounded-lg"
          onClick={handleSend}
        >
          SEND
        </button>
      </div>
    </div>
  );
}

export default Chat;
