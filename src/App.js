import { useState } from "react";
import "./App.css";
import SignIn from "./components/SignIn";
import DashLanding from "./components/dashlanding/DashLanding";

function App() {
  const [auth, setAuth] = useState(false);
  const handleSetAuth = () => {
    setAuth(true);
  };

  return <div className="App">
    {!auth ? 
    <SignIn 
    handleSetAuth={handleSetAuth}
    /> 
    : <DashLanding />}
    </div>;
}

export default App;
