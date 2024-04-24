import { useState } from "react";
import "./App.css";
import SignIn from "./components/SignIn";
import DashLanding from "./components/dashlanding/DashLanding";
import { Routes, Route, useNavigate } from "react-router-dom";
import CampTactics from "./components/camptactics/CampTactics";
import EditTactics from "./components/edittactics/EditTactics";

function App() {
  const [auth, setAuth] = useState(false);
  const handleSetAuth = () => {
    setAuth(true);
    navigate("/dashlanding");
  };

  const [campaignName, setCampaignName] = useState("");
  const handleCampaignClick = (params) => {
    setCampaignName(params);
    navigate("/camptactics");
  };

  const editTactics = () => {
    navigate("/edittactics");
  }

  let navigate = useNavigate();

  return (
    <div className="App">
      {!auth ? null :
      <Routes>
        <Route
          path="/dashlanding"
          element={<DashLanding handleCampaignClick={handleCampaignClick} />}
        />
        <Route
          path="/camptactics"
          element={<CampTactics 
            campaignName={campaignName} 
            editTactics={editTactics}
            />}
        />
        <Route
          path="/edittactics"
          element={<EditTactics
          campaignName={campaignName}  
            />}
        />
      </Routes>
}
      {!auth ? <SignIn handleSetAuth={handleSetAuth} /> : null}
    </div>
  );
}

export default App;
