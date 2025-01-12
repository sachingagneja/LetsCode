import axios from "axios";
import Input from "./Input";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import link from "../assets/link.json";

function AcceptQuestion() {
  const params = useParams();
  
  const [err, setErr] = useState("");
  const [quesName, setQuesName] = useState("");
  const [quesDesc, setQuesDesc] = useState("");
  const [quesDiff, setQuesDiff] = useState("");
  const [testcases, setTestCases] = useState([]);
  const [testInput, setTestInput] = useState("");
  const [testOutput, setTestOutput] = useState("");
  const [con, setCon] = useState("");
  const [constraints, setConstraints] = useState([]);
  const [quesData, setQuesData] = useState([]);

  useEffect(() => {
    const fetchQuestion = async () => {
      const token = localStorage.getItem("jwtToken");
      try {
        if (!token) {
          setErr("Login to access this data");
          return;
        }
        const qid = params.qId;
        const { data } = await axios.get(`${link.url}/${qid}/approve-question`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setQuesData(data.ques);
        setQuesName(data.ques.quesName);
        setQuesDesc(data.ques.description);
      } catch (error) {
        setErr("Error fetching data");
      }
    };
    fetchQuestion();
  }, [params.qId]);

  const handleNameChange = (e) => setQuesName(e.currentTarget.value);
  const handleDescChange = (e) => setQuesDesc(e.currentTarget.value);
  const handleDiffChange = (e) => setQuesDiff(e.target.value);

  const handleConstraints = () => {
    if (con.trim() !== "") {
      setConstraints((prev) => [...prev, con.trim()]);
      setCon("");
    }
  };

  const handleAddTestCase = () => {
    if (testInput.trim() === "" || testOutput.trim() === "") {
      setErr("All fields are required");
    } else {
      setTestCases((prev) => [
        { input: testInput.trim(), output: testOutput.trim() },
        ...prev,
      ]);
      setTestInput("");
      setTestOutput("");
    }
  };

  const handleApprove = async () => {
    const username = params.username;
    const qId = params.qId;
    const token = localStorage.getItem("jwtToken");

    try {
      if (!token) {
        setErr("Login to perform this action");
        return;
      }
      await axios.post(
        `${link.url}/${username}/addQues`,
        {
          quesName,
          difficulty: quesDiff,
          description: quesDesc,
          constraints,
          testcases,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await axios.put(`${link.url}/${qId}/added`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Question Added successfully");
    } catch (error) {
      setErr("Error approving question");
    }
  };

  return (
    <div className="flex flex-col items-center w-full px-4 py-2 md:px-10">
      <div className="w-full max-w-4xl px-4 py-4 bg-blue-200 rounded-xl border-2 mt-4">
        {err && <p className="text-red-500 text-center mb-4">{err}</p>}
        {quesData && (
          <div className="flex flex-col items-center w-full gap-4">
            <Input
              label="Question Name"
              value={quesName}
              onChange={handleNameChange}
              className="w-full rounded-2xl p-3 md:p-5 text-base md:text-xl"
            />
            <h1 className="text-lg md:text-xl">Question Description</h1>
            <textarea
              value={quesDesc}
              rows={8}
              onChange={handleDescChange}
              className="w-full rounded-2xl p-3 md:p-5 text-base md:text-xl"
            />
            <select
              onChange={handleDiffChange}
              className="w-full md:w-auto mt-4 rounded-xl px-6 py-2 text-base md:text-xl text-center bg-sky-100"
            >
              <option value="">Difficulty</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>

            <h1 className="text-lg md:text-xl mt-4">Constraints</h1>
            <Input
              value={con}
              onChange={(e) => setCon(e.currentTarget.value)}
              className="w-full rounded-xl p-2 md:p-3 text-base md:text-xl"
            />
            <button
              onClick={handleConstraints}
              className="px-6 py-2 bg-blue-800 text-white hover:bg-blue-500 rounded-xl text-base md:text-lg mt-4 transition-all"
            >
              Add Constraint
            </button>

            <h3 className="text-lg md:text-xl mt-4">Added Constraints</h3>
            {constraints.length > 0 ? (
              <ul className="list-disc pl-5">
                {constraints.map((c, ind) => (
                  <li key={ind} className="text-base md:text-lg">{c}</li>
                ))}
              </ul>
            ) : (
              <p className="text-base md:text-lg">No constraints added</p>
            )}

            <h2 className="text-xl md:text-2xl mt-8">Test Cases</h2>
            <Input
              label="Input"
              value={testInput}
              onChange={(e) => setTestInput(e.currentTarget.value)}
              className="w-full rounded-xl p-3 md:p-5 text-base md:text-xl"
            />
            <Input
              label="Output"
              value={testOutput}
              onChange={(e) => setTestOutput(e.currentTarget.value)}
              className="w-full rounded-xl p-3 md:p-5 text-base md:text-xl"
            />
            <button
              onClick={handleAddTestCase}
              className="px-6 py-2 bg-blue-800 text-white hover:bg-blue-500 rounded-xl text-base md:text-lg mt-4 transition-all"
            >
              Add Test Case
            </button>

            <div className="mt-4">
              {testcases.length > 0 ? (
                <ul className="list-disc pl-5">
                  {testcases.map((val, ind) => (
                    <li key={ind} className="text-base md:text-lg">
                      Input: {val.input} -- Output: {val.output}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-base md:text-lg">No test cases added</p>
              )}
            </div>

            <button
              onClick={handleApprove}
              className="px-6 py-3 bg-blue-800 text-white hover:bg-blue-500 rounded-xl text-lg md:text-xl mt-7 transition-all"
            >
              Approve
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AcceptQuestion;
