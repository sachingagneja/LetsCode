import React, { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import { useParams } from "react-router";
import link from "../../assets/link.json";

function CodeEditor() {
  const [code, setCode] = useState("");
  const [compileResult, setCompileResult] = useState(null);
  const [err, setErr] = useState("");
  const [quesInfo, setQuesInfo] = useState({});
  const [loading, setLoading] = useState(false); // Add loading state
  const params = useParams();
  const { qId, username } = params;

  const solved = async () => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      setErr("Login to perform this action");
      return;
    }

    try {
      await axios.put(`${link.url}/${qId}/${username}/solved`);
    } catch (error) {
      setErr(error.message);
    }
  };

  useEffect(() => {
    const fetchQuesInfo = async () => {
      try {
        const { data } = await axios.get(`${link.url}/${qId}/ques-details`);
        setQuesInfo(data);
      } catch (error) {
        setErr(error.message);
      }
    };

    fetchQuesInfo();
  }, [qId]);

  const handleCompile = async () => {
    setLoading(true); // Set loading to true when the compilation starts
    try {
      const response = await axios.post(`${link.url}/${qId}/compile-cpp`, {
        code,
      });
      if (response.data.totalCount === response.data.passedCount) {
        await solved();
      }
      setCompileResult(response.data);
      setErr("");
    } catch (error) {
      console.log(error);
      setErr("Error compiling code");
      setCompileResult(null);
    } finally {
      setLoading(false); // Set loading to false once the compilation is complete
    }
  };

  return (
    <div className="px-5 py-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col space-y-4">
          {quesInfo && (
            <div>
              <h1 className="font-bold text-lg">Question Name</h1>
              <p>{quesInfo.quesName}</p>
              <h2 className="font-bold text-md">Description</h2>
              <p>{quesInfo.description}</p>
              <h3 className="font-bold text-md">Difficulty</h3>
              <p>{quesInfo.difficulty}</p>
              <h4 className="font-bold text-md">Constraints</h4>
              {quesInfo.constraints && (
                <ul className="list-disc list-inside pl-5 text-gray-500">
                  {quesInfo.constraints.map((constraint, index) => (
                    <li key={index}>{constraint}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <button
            onClick={handleCompile}
            disabled={loading} // Disable button when loading
            className={`border-black border-2 px-3 py-2 w-fit mb-2 ${
              loading ? "bg-gray-300" : "bg-white hover:bg-gray-100"
            }`}
          >
            {loading ? "Compiling..." : "Compile"} {/* Change button text based on loading state */}
          </button>

          <div className="bg-black p-4 text-white rounded-lg">
            <h1 className="text-2xl font-bold">Output:</h1>
            {err && <div className="text-red-500">{err}</div>}
            {compileResult && (
              <div
                className={`text-xl mt-4 ${
                  compileResult.passedCount === compileResult.totalCount
                    ? "text-green-400"
                    : "text-red-500"
                }`}
              >
                <pre>
                  <h3>
                    Total testcases: {compileResult.totalCount}
                  </h3>
                  <h3>
                    Passed testcases: {compileResult.passedCount}
                  </h3>
                  <h3>
                    Passed Percentage: {compileResult.passedPercentage}%
                  </h3>
                </pre>
              </div>
            )}
          </div>
        </div>

        <div className="w-full h-[80vh]">
          <Editor
            height="100%"
            width="100%"
            theme="vs-dark"
            language="cpp"
            onChange={(value) => setCode(value || "")}
            value={code}
            defaultValue={`#include<iostream>\nusing namespace std;\n\nint main(){\n\t\n\treturn 0;\n}`}
          />
        </div>
      </div>
    </div>
  );
}

export default CodeEditor;
