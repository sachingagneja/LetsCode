import axios from "axios";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";
import link from "../assets/link.json";

function RejectQuestion() {
  const { qId } = useParams();
  const [reason, setReason] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("jwtToken");
    const username = localStorage.getItem("username");

    if (!token) {
      setErr("Login required.");
      return;
    }

    try {
      const response = await axios.delete(`${link.url}/${qId}/reject`, {
        data: { msg: reason },
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 201) {
        navigate(`/${username}/admin/displayQuestions`);
      } else {
        setErr("Failed to reject the question.");
      }
    } catch (error) {
      setErr("An error occurred: " + error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-semibold mb-4">Reason for Rejecting the Question</h1>
      <textarea
        rows={6}
        value={reason}
        onChange={(e) => setReason(e.currentTarget.value)}
        className="rounded-lg border-gray-300 border p-4 text-lg w-full max-w-md"
        placeholder="Enter reason here"
      />
      <button
        type="button"
        onClick={handleSubmit}
        className="bg-blue-900 text-white hover:bg-cyan-600 hover:text-black px-6 py-2 transition-all rounded-lg"
      >
        Send
      </button>
      {err && <h3 className="text-red-700 font-semibold mt-4">{err}</h3>}
    </div>
  );
}

export default RejectQuestion;
