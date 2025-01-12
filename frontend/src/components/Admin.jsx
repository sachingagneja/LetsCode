import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import LinkBtn from "./Header/LinkBtn";
import link from "../assets/link.json";

function Admin() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const [userData, setUserData] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${link.url}/${username}/userInfo`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(response.data);
      } catch (error) {
        setError("Failed to fetch user data");
        console.error(error);
      }
    };
    fetchUserData();
  }, [username]);

  return (
    <div className="flex flex-col items-center min-h-screen p-6 bg-gray-100">
      <div className="flex flex-wrap justify-center gap-6 mt-6 mb-12">
        <LinkBtn
          to="displayQueries"
          text="Display Query"
          className="rounded-xl px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white transition-all shadow-md hover:shadow-lg"
        />
        <LinkBtn
          to="displayQuestions"
          text="Display Question"
          className="rounded-xl px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white transition-all shadow-md hover:shadow-lg"
        />
        <LinkBtn
          to="addQues"
          text="Add Questions"
          className="rounded-xl px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white transition-all shadow-md hover:shadow-lg"
        />
        <LinkBtn
          to="displayUsers"
          text="Display Users"
          className="rounded-xl px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white transition-all shadow-md hover:shadow-lg"
        />
      </div>
      <div className="flex flex-col items-center justify-center min-h-[50vh] mt-8">
        <div className="w-full max-w-md p-6 bg-blue-500 text-white rounded-lg shadow-lg flex flex-col gap-6">
          {error && <div className="text-red-300 text-center">{error}</div>}
          <h1 className="text-xl font-semibold text-center">
            Username: <span className="text-sky-200">{userData.username || "Loading..."}</span>
          </h1>
          <h1 className="text-xl font-semibold text-center">
            Email: <span className="text-sky-200">{userData.email || "Loading..."}</span>
          </h1>
          <h1 className="text-xl font-semibold text-center">
            Total Questions Solved: <span className="text-sky-200">{userData.quesSolved ? userData.quesSolved.length - 1 : "Loading..."}</span>
          </h1>
          <button
            className="transition-all px-6 py-3 rounded-lg bg-blue-700 text-lime-300 hover:text-cyan-400 hover:bg-blue-600 shadow-md hover:shadow-lg"
            onClick={() => navigate(`/profile/${username}`)}
          >
            Continue to Profile
          </button>
        </div>
      </div>
    </div>
  );
}

export default Admin;
