import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import link from "../assets/link.json";

function UserInfo() {
  const [userData, setUserData] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);
  const { username } = useParams();

  useEffect(() => {
    const findUser = async () => {
      const token = localStorage.getItem("jwtToken");
      try {
        if (!token) {
          setErr("Login to perform this action");
          return;
        }
        const user = await axios.get(`${link.url}/${username}/userInfo`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(user.data);
      } catch (error) {
        setErr("Failed to fetch user data: " + error.message);
      } finally {
        setLoading(false);
      }
    };
    findUser();
  }, [username]);

  const handleMake = async () => {
    try {
      await axios.put(`${link.url}/${username}/make-admin`);
      setUserData((prev) => ({ ...prev, isAdmin: true }));
    } catch (error) {
      setErr("Failed to update user role: " + error.message);
    }
  };

  const handleRemove = async () => {
    try {
      await axios.put(`${link.url}/${username}/remove-admin`);
      setUserData((prev) => ({ ...prev, isAdmin: false }));
    } catch (error) {
      setErr("Failed to update user role: " + error.message);
    }
  };

  if (loading) {
    return <div className="text-center text-xl">Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-12">
      {err && <div className="text-red-700 font-bold mb-4 text-center">{err}</div>}
      {userData ? (
        <div className="bg-sky-400 w-full max-w-md p-6 rounded-xl text-center text-lg sm:text-xl lg:text-2xl">
          <h2 className="font-semibold">{userData.username}</h2>
          <h2 className="text-base sm:text-lg lg:text-xl">{userData.email}</h2>
          <h2 className="text-base sm:text-lg lg:text-xl">
            {userData.isAdmin
              ? `${userData.username} is an admin`
              : `${userData.username} is not an admin`}
          </h2>
          {!userData.isAdmin ? (
            <button
              onClick={handleMake}
              className="bg-blue-800 text-white px-4 py-2 rounded-2xl hover:bg-cyan-300 hover:text-black transition-all mt-4 text-base sm:text-lg lg:text-xl"
            >
              Make Admin
            </button>
          ) : (
            <button
              onClick={handleRemove}
              className="bg-blue-800 text-white px-4 py-2 rounded-2xl hover:bg-cyan-300 hover:text-black transition-all mt-4 text-base sm:text-lg lg:text-xl"
            >
              Remove as Admin
            </button>
          )}
        </div>
      ) : (
        <div className="text-center text-lg sm:text-xl lg:text-2xl">No user data found</div>
      )}
    </div>
  );
}

export default UserInfo;
