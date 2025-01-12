import React, { useEffect, useState } from "react";
import axios from "axios";
import Button from "./Button";
import { useNavigate } from "react-router";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import link from "../assets/link.json";

function Questions() {
  const [ques, setQues] = useState([]);
  const [err, setErr] = useState("");
  const [date, setDate] = useState(new Date());
  const [userSolved, setUserSolved] = useState({});
  const [easy, setEasy] = useState(0);
  const [medium, setMedium] = useState(0);
  const [hard, setHard] = useState(0);
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const token = localStorage.getItem("jwtToken");

  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${link.url}/${username}/userInfo`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserSolved(response.data.quesSolvedNum);
      } catch (error) {
        setErr("Failed to fetch user data");
      }
    };
    fetchUserData();
  }, [username, token]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(`${link.url}/display-ques`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setQues(response.data);
        const difficultyCount = { easy: 0, medium: 0, hard: 0 };
        response.data.forEach((q) => {
          if (q.difficulty === "easy") difficultyCount.easy++;
          else if (q.difficulty === "medium") difficultyCount.medium++;
          else difficultyCount.hard++;
        });
        setEasy(difficultyCount.easy);
        setMedium(difficultyCount.medium);
        setHard(difficultyCount.hard);
      } catch (error) {
        setErr("Failed to fetch questions");
      }
    };
    fetchQuestions();
  }, [token]);

  const handleClick = (qId) => navigate(`/${qId}/${username}/code`);

  const isToday = (dateToCheck) => {
    const today = new Date();
    return (
      dateToCheck.getDate() === today.getDate() &&
      dateToCheck.getMonth() === today.getMonth() &&
      dateToCheck.getFullYear() === today.getFullYear()
    );
  };

  const tileClassName = ({ date }) => {
    if (isToday(date)) {
      return "today";
    }
    return null;
  };

  const onChange = (date) => {
    setDate(date);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-200";
      case "medium":
        return "bg-yellow-200";
      case "hard":
        return "bg-red-200";
      default:
        return "";
    }
  };

  return (
    <div className="p-6 md:p-8">
      {err && <div className="text-red-600 text-xl text-center mb-6">{err}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-6">
          {ques.map((q, index) => (
            <div
              key={index}
              className={`grid grid-cols-3 gap-4 p-5 text-gray-800 ${getDifficultyColor(q.difficulty)} rounded-lg shadow-lg transition-transform transform hover:scale-105`}
              style={{ gridTemplateColumns: "2fr 1fr 0.5fr" }}
            >
              <p className="truncate text-lg font-medium">{q.quesName}</p>
              <p className={`font-semibold ${getDifficultyColor(q.difficulty)}`}>{q.difficulty}</p>
              <Button
                children="Solve"
                onClick={() => handleClick(q._id)}
                className="w-fit px-6 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-white"
              />
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-6">
          <Calendar
            onChange={onChange}
            value={date}
            navigationType="none"
            tileClassName={tileClassName}
            className="shadow-lg rounded-lg border border-gray-300"
          />
          <div className="bg-cyan-700 text-white text-xl p-6 rounded-lg shadow-lg">
            <h1 className="text-3xl text-center mb-4 font-semibold">Username: {username}</h1>
            <div className="flex flex-col gap-3">
              <h1 className="text-green-400">
                Easy: {userSolved.easy}
                <span className="text-gray-200 text-lg">/{easy}</span>
              </h1>
              <h1 className="text-yellow-400">
                Medium: {userSolved.medium}
                <span className="text-gray-200 text-lg">/{medium}</span>
              </h1>
              <h1 className="text-red-600">
                Hard: {userSolved.hard}
                <span className="text-gray-200 text-lg">/{hard}</span>
              </h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Questions;
