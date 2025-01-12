import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import link from "../assets/link.json";

function Profile() {
  const [data, setData] = useState({});
  const [err, setErr] = useState("");
  const params = useParams();
  const username = params.username;

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    const fetchUserData = async () => {
      try {
        if (!token) return setErr("Login to see your data");
        const response = await axios.get(`${link.url}/${username}/userInfo`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(response.data);
      } catch (error) {
        setErr(error.message);
      }
    };
    fetchUserData();
  }, [username]);

  return (
    <div className="p-5">
      {err && <div className="text-red-500 text-xl text-center mb-5">{err}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {data && (
          <div className="flex flex-col bg-sky-400 p-5 rounded-xl shadow-lg">
            <div className="flex flex-col mb-5">
              <h1 className="text-2xl font-semibold">Username: {data.username}</h1>
              <h1 className="text-xl">Email: {data.email}</h1>
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-semibold">
                Total Questions Solved: {data.quesSolved ? data.quesSolved.length - 1 : 0}
              </h1>
              <h2 className="text-lg">Easy: {data.quesSolvedNum?.easy || 0}</h2>
              <h2 className="text-lg">Medium: {data.quesSolvedNum?.medium || 0}</h2>
              <h3 className="text-lg">Hard: {data.quesSolvedNum?.hard || 0}</h3>
            </div>
          </div>
        )}
        <div className="bg-blue-600 p-5 rounded-xl shadow-lg">
          <h2 className="text-center text-2xl font-semibold text-white mb-4">Questions Solved</h2>
          {data.quesSolved &&
            data.quesSolved.map((ques, ind) => (
              <div
                className="px-4 py-3 text-center text-lg text-white border-b border-blue-500"
                key={ind}
              >
                {ques.name}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Profile;
