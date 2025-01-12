import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import LinkBtn from "./Header/LinkBtn";
import link from "../assets/link.json";

function DisplayQueries() {
  const params = useParams();
  const [queries, setQueries] = useState([]);
  const [err, setErr] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchQueries = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        const username = params.username;
        setUsername(username);
        if (!token) {
          setErr("Not Authorized for this action");
          return;
        }
        const { data } = await axios.get(
          `${link.url}/${username}/display-queries`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const queryArr = data.queries.filter((q) => !q.isResolved);
        setQueries(queryArr);
      } catch (error) {
        setErr("Failed to fetch queries");
      }
    };
    fetchQueries();
  }, [params.username]);

  return (
    <div className="min-h-screen bg-sky-100 py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-center text-3xl mb-6">Unresolved Queries</h1>
      {err && <p className="text-red-500 text-center mb-4">{err}</p>}
      <div className="flex flex-col items-center gap-6">
        {queries.length > 0 ? (
          queries.map((q) => (
            <div
              key={q._id}
              className="bg-cyan-400 w-full max-w-4xl p-4 rounded-xl shadow-lg flex flex-col gap-4"
            >
              <div className="text-lg font-semibold">
                Query: <span className="font-normal">{q.query}</span>
              </div>
              <div className="text-lg font-semibold">
                Username: <span className="text-gray-600">{q.username}</span>
              </div>
              <LinkBtn
                to={`/${q._id}/show-query`}
                text="Resolve"
                className="text-lg px-4 py-2 bg-blue-900 text-lime-300 hover:bg-blue-800 hover:text-white transition-all rounded-lg shadow-md hover:shadow-lg"
              />
            </div>
          ))
        ) : (
          <h1 className="text-xl text-gray-500">No Queries</h1>
        )}
      </div>
    </div>
  );
}

export default DisplayQueries;
