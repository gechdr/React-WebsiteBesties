import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.loggedData) {
      navigate("/home");
    }
  }, []);

  return (
    <>
      <Outlet></Outlet>
    </>
  );
}

export default App;
