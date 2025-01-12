import axios from "axios";
import Input from "./Input";
import React, { useEffect, useState } from "react";
import LinkBtn from "./Header/LinkBtn";
import link from "../assets/link.json";

function DisplayUsers() {
  const [user, setUser] = useState([]);
  const [searchedUser, setSearchedUser] = useState([]);
  const [search, setSearch] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("jwtToken");
      try {
        const response = await axios.get(`${link.url}/display-users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (error) {
        setErr(error.message);
      }
    };
    fetchUsers();
  }, []);

  const handleSearch = () => {
    if (search.trim() !== "") {
      const searched = user.filter(
        (u) => u.username.toLowerCase() === search.toLowerCase()
      );
      setSearchedUser(searched);
    } else {
      setSearchedUser([]);
    }
  };

  return (
    <div className="min-h-screen bg-sky-100 p-4 sm:p-6 lg:p-8">
      {err && <p className="text-red-500 text-center mb-4">{err}</p>}
      <div className="flex flex-col items-center mb-6 space-y-4 sm:space-y-0 sm:flex-row sm:space-x-4">
        <Input
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          placeholder="Search User"
          className="w-full sm:w-1/2 lg:w-1/3 p-4 rounded-xl border border-gray-300"
        />
        <button
          onClick={handleSearch}
          className="bg-sky-800 text-white hover:bg-blue-800 hover:text-lime-300 px-6 py-3 rounded-xl transition-all"
        >
          Search
        </button>
      </div>
      <div className="flex flex-wrap justify-center gap-6">
        {(searchedUser.length > 0 ? searchedUser : user).map((u, index) => (
          <div
            key={u._id}
            className="bg-sky-300 p-6 rounded-xl flex flex-col items-center w-full sm:w-80 md:w-96 lg:w-1/4"
          >
            <h3 className="text-lg font-semibold">{u.username}</h3>
            <p className="text-gray-700">{u.email}</p>
            <p className="text-gray-700">
              {u.isAdmin
                ? `${u.username} is an admin`
                : `${u.username} is not an admin`}
            </p>
            <LinkBtn
              text="Info"
              to={`/admin/${u.username}/userInfo`}
              className="bg-cyan-800 text-white px-4 py-2 rounded-xl hover:bg-blue-800 hover:text-lime-300 transition-all mt-4"
            />
          </div>
        ))}
        {searchedUser.length === 0 && user.length === 0 && (
          <p className="text-xl text-gray-500">No users found</p>
        )}
      </div>
    </div>
  );
}

export default DisplayUsers;
