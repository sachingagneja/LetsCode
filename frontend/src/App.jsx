import { Outlet } from "react-router";
import Header from "./components/Header/Header.jsx";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { login } from "./Store/authSlice.js";
import CommunityChatOption from "./components/CommunityChat/CommunityChatOption.jsx";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    const authStatus = localStorage.getItem("authStatus");
    if (authStatus) {
      const auth = JSON.parse(authStatus);
      dispatch(login(auth));
    }
  }, [dispatch]);

  return (
    <>
      <div className="min-h-screen bg-sky-100">
        <Header isAdmin={localStorage.getItem("isAdmin")} />
        <Outlet />
        <CommunityChatOption />
      </div>
    </>
  );
}

export default App;
