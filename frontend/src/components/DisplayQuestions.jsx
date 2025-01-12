import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import LinkBtn from "./Header/LinkBtn";
import link from "../assets/link.json";

function DisplayQuestions() {
  const [err, setErr] = useState("");
  const [ques, setQues] = useState([]);
  const params = useParams();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
          throw new Error("Login to display questions");
        } else {
          const { username } = params;
          const response = await axios.get(
            `${link.url}/${username}/display-contributed`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const pendingQues = response.data.filter(
            (q) => q.isApproved !== true
          );
          setQues(pendingQues);
        }
      } catch (error) {
        setErr(error.message);
      }
    };
    fetchQuestions();
  }, [params]);

  return (
    <div className="min-h-screen bg-sky-100 py-8 px-4 sm:px-6 lg:px-8">
      {err && <p className="text-red-500 text-center mb-4">{err}</p>}
      <h1 className="text-center text-3xl mb-6">Pending Questions</h1>
      <div className="flex flex-col items-center gap-6">
        {ques.length > 0 ? (
          ques.map((q) => (
            <div
              key={q._id}
              className="bg-cyan-600 w-full max-w-4xl p-4 rounded-2xl shadow-lg flex flex-col md:flex-row md:justify-between gap-4"
            >
              <div className="text-lg text-white flex flex-col gap-2">
                <h1 className="font-bold">Contributed by: <span className="font-thin">{q.contributedBy}</span></h1>
                <h1 className="font-bold">Question Name: <span className="font-thin">{q.quesName}</span></h1>
                <h1 className="font-bold">Question Description: <span className="font-thin">{q.description}</span></h1>
              </div>
              <div className="flex flex-col gap-2 md:flex-row md:gap-4">
                <LinkBtn
                  className="border-2 bg-lime-500 px-5 py-2 hover:bg-green-700 hover:text-white transition-all rounded-xl hover:shadow-2xl shadow-xl"
                  to={`/${params.username}/${q._id}/accept`}
                  text="Accept"
                />
                <LinkBtn
                  className="border-2 bg-red-600 px-5 py-2 hover:bg-red-800 hover:text-white transition-all rounded-xl hover:shadow-2xl shadow-xl"
                  to={`/${params.username}/${q._id}/reject`}
                  text="Reject"
                />
              </div>
            </div>
          ))
        ) : (
          <p className="text-xl text-gray-500">No questions</p>
        )}
      </div>
    </div>
  );
}

export default DisplayQuestions;
