import { useEffect, useState } from "react";
import Button from "./Button";
import Input from "./Input";
import { useNavigate, useParams } from "react-router";
import axios from "axios";
import link from "../assets/link.json";

function AddQuery() {
  const [email, setEmail] = useState("");
  const [query, setQuery] = useState("");
  const [err, setErr] = useState("");
  const params = useParams();
  const token = localStorage.getItem("jwtToken");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setErr("Login to perform this action");
      return;
    }
    if (!email || !query) {
      setErr("Every field is required");
      return;
    }

    try {
      await axios.post(
        `${link.url}/${params.username}/query`,
        { email, query },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Query Received");
      setEmail("");
      setQuery("");
      setErr("");
    } catch (error) {
      setErr("Internal Server Error");
    }
  };

  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      <div className="flex flex-col items-center w-full max-w-lg p-6 bg-indigo-900 text-white rounded-3xl shadow-lg">
        <h1 className="text-2xl font-semibold mb-4">Submit Your Query</h1>
        <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <label htmlFor="email" className="text-xl mb-2">Email:</label>
            <Input
              id="email"
              placeholder="Enter email"
              onChange={(e) => setEmail(e.currentTarget.value)}
              value={email}
              className="px-3 py-2 text-xl rounded-xl border-2 border-black text-black"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="query" className="text-xl mb-2">Query:</label>
            <textarea
              id="query"
              rows={6}
              placeholder="Enter your Query"
              onChange={(e) => setQuery(e.currentTarget.value)}
              value={query}
              className="border-2 border-black rounded-2xl text-black p-3 w-full resize-none"
            />
          </div>
          <Button
            children="Submit"
            type="submit"
            className="border-2 border-black px-5 py-2 bg-sky-300 hover:bg-blue-600 hover:text-white rounded-2xl transition-all w-full"
          />
          {err && <div className="text-red-500 mt-4">{err}</div>}
        </form>
      </div>
    </div>
  );
}

export default AddQuery;
