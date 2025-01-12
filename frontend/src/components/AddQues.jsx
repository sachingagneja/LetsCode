import axios from "axios";
import Input from "./Input";
import { useState } from "react";
import { useParams } from "react-router";
import link from "../assets/link.json";

function AddQues() {
  const [quesName, setQuesName] = useState("");
  const [quesDesc, setQuesDesc] = useState("");
  const [quesDiff, setQuesDiff] = useState("");
  const [con, setCon] = useState("");
  const [constraints, setConstraints] = useState([]);
  const [testcases, setTestcases] = useState([]);
  const [testInput, setTestInput] = useState("");
  const [testOutput, setTestOutput] = useState("");
  const [err, setErr] = useState("");
  const params = useParams();

  const handleName = (e) => setQuesName(e.currentTarget.value);
  const handleDesc = (e) => setQuesDesc(e.currentTarget.value);
  const handleDiff = (e) => setQuesDiff(e.target.value);

  const handleAdd = () => {
    if (con.trim()) {
      setConstraints((prev) => [...prev, con]);
      setCon("");
    }
  };

  const handleAddTestCase = () => {
    if (testInput.trim() === "" || testOutput.trim() === "") {
      setErr("All fields are required");
    } else {
      setTestcases((prev) => [
        { input: testInput, output: testOutput },
        ...prev,
      ]);
      setTestInput("");
      setTestOutput("");
      setErr("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("jwtToken");
    const username = params.username;

    try {
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
      alert("Question Added Successfully");
      setQuesName("");
      setQuesDesc("");
      setQuesDiff("");
      setConstraints([]);
      setTestcases([]);
    } catch (error) {
      setErr("Failed to add question");
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      <div className="flex flex-col items-center w-full max-w-lg p-6 bg-white shadow-lg rounded-xl">
        {err && <div className="text-red-500 mb-4">{err}</div>}
        <form className="w-full" onSubmit={handleSubmit}>
          <Input
            label="Question Name"
            value={quesName}
            onChange={handleName}
            className="w-full p-3 text-lg rounded-xl border border-gray-300 mb-4"
            placeholder="Enter Question Name"
          />
          <label htmlFor="quesDesc" className="block text-xl mb-2">Question Description</label>
          <textarea
            id="quesDesc"
            value={quesDesc}
            onChange={handleDesc}
            rows={5}
            className="w-full p-3 text-lg rounded-xl border border-gray-300 mb-4"
            placeholder="Enter Question Description"
          />
          <select
            value={quesDiff}
            onChange={handleDiff}
            className="w-full p-3 bg-white text-lg border border-gray-300 rounded-xl mb-4"
          >
            <option value="">---DIFFICULTY---</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          <Input
            label="Constraints"
            value={con}
            onChange={(e) => setCon(e.currentTarget.value)}
            className="w-full p-3 text-lg rounded-xl border border-gray-300 mb-4"
            placeholder="Enter Constraints"
          />
          <button
            type="button"
            onClick={handleAdd}
            className="w-full p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-all mb-4"
          >
            Add Constraint
          </button>
          {constraints.length > 0 && (
            <div className="w-full mb-4">
              <h2 className="text-xl font-semibold">Constraints:</h2>
              <ul className="list-disc list-inside pl-5">
                {constraints.map((c, ind) => (
                  <li key={ind} className="font-mono text-lg">{c}</li>
                ))}
              </ul>
            </div>
          )}
          <label htmlFor="testInput" className="block text-xl mb-2">Test Cases</label>
          <Input
            label="Input"
            value={testInput}
            onChange={(e) => setTestInput(e.currentTarget.value)}
            className="w-full p-3 text-lg rounded-xl border border-gray-300 mb-4"
            placeholder="Input Value"
          />
          <Input
            label="Output"
            value={testOutput}
            onChange={(e) => setTestOutput(e.currentTarget.value)}
            className="w-full p-3 text-lg rounded-xl border border-gray-300 mb-4"
            placeholder="Output Value"
          />
          <button
            type="button"
            onClick={handleAddTestCase}
            className="w-full p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-all mb-4"
          >
            Add Test Case
          </button>
          {testcases.length > 0 && (
            <div className="w-full mb-4">
              <h2 className="text-xl font-semibold">Test Cases:</h2>
              <ul className="list-disc list-inside pl-5">
                {testcases.map((val, ind) => (
                  <li key={ind} className="font-mono text-lg">
                    Input: {val.input}, Output: {val.output}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <button
            type="submit"
            className="w-full p-3 bg-green-600 text-white text-lg rounded-xl hover:bg-green-500 transition-all"
          >
            Add Question
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddQues;
