import { useState, useEffect } from "react";
import "./App.css";
import SignIn from "./components/SignIn";
import DashLanding from "./components/dashlanding/DashLanding";
import { Routes, Route, useNavigate } from "react-router-dom";
import CampTactics from "./components/camptactics/CampTactics";
import EditTactics from "./components/edittactics/EditTactics";
import RendReqConfig from "./components/rendreqconfig/RendReqConfig";
import Rendition from "./components/rendition/Rendition";
import Collaborators from "./components/collaborators/Collaborators";
import Cookies from "js-cookie";

function App() {
  const API_BASE_URL = "https://campaign-app-api-staging.azurewebsites.net"
  const [owner, setOwner] = useState("");
  const [auth, setAuth] = useState("");


  const getAccessToken = (e, email, password) => {
    e.preventDefault();
    
    const apiOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
      redirect: "follow",
    }
    fetch(`${API_BASE_URL}/api/users/token/obtain/`, apiOptions)
    .then((res) => res.json())
    .then(data => {
      data && setAuth(data?.access)
    })
    .catch(e => console.log(e))
    setOwner(email)
    handleSetDash()
  }

  const handleSetDash = () => {
    navigate("/dashlanding");
  };

  const [campaignName, setCampaignName] = useState("");
  const [campaignID, setCampaignID] = useState("");
  const [campaignData, setCampaignData] = useState([]);
  const [tacticData, setTacticData] = useState([]);

  const handleCampaignID = (params) => {
    setCampaignID(params);
  };

  const [newContent, setNewContent] = useState(false);
  const handleAddNewContent = (params) => {
    setCampaignName(params);
    navigate("/camptactics");
    setNewContent(true);
  };

  const [rendition, setRendition] = useState(false);
  const handleCreateRendition = (params) => {
    setCampaignName(params);
    navigate("/camptactics");
    setRendition(true);
  };

  const [tacticForm, setTacticForm] = useState(false);
  const editTactics = () => {
    
    navigate("/edittactics");
    setTacticForm(true);
  };

  const backDash = () => {
    navigate("/dashlanding");
    setNewContent(false);
    setRendition(false);
    
  };
  const backTact = () => {
    navigate("/camptactics");
   
  };

  
  const handleReqConfig = () => {
    navigate("/rendreqconfig");
    setTacticForm(true);
   
  };


  const [renditionDetails, setRenditionDetails] = useState(false);
  const handleCollabs = (data) => {
    navigate("/collaborators")
    setRenditionDetails(data);
  }

  const tacticRows = tacticData.map((tactic) => ({
    id: tactic.id,
    tactName: tactic.name,
    status: tactic.current_status.toUpperCase(),
    startdate: tactic.planned_start_dt,
    enddate: tactic.planned_end_dt,
    language: tactic.language,
  }));
  const [selectedRows, setSelectedRows] = useState([]);

  const handleSelectionChange = (selectionModel) => {
    const selectedTactics = selectionModel
      .map((id) => {
        const row = tacticRows.find((row) => row.id === id);
        return row ? { id: row.id, tactName: row.tactName } : null;
      })
      .filter((tactic) => tactic !== null);
    
    setSelectedRows(selectedTactics);
  };


  let navigate = useNavigate();


  useEffect(() => {

    const token = Cookies.get("authentication");

    async function verifyToken(token) {
      try {
        const response = await fetch(`https://campaign-app-api-staging.azurewebsites.net/api/users/token/verify/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
          redirect: "follow",
        });

        const data = await response.json();

        if (data.detail) {
          Cookies.remove("authentication");
          setAuth("");
        } else {
          setAuth(token);
          handleSetDash();
          // getOrgs(token)
        }
      } catch (error) {
        console.log(error);
      }
    }

    if (token) {
      verifyToken(token);
    }
  }, [API_BASE_URL]);

  useEffect(() => {
    Cookies.set("authentication", auth);
  }, [auth]);

  return (
    <div className="App">
      {!auth ? null : (
        <Routes>
          <Route
            path="/dashlanding"
            element={
              <DashLanding
                handleAddNewContent={handleAddNewContent}
                campaignData={campaignData}
                owner={owner}
                auth={auth}
                setCampaignData={setCampaignData}
                handleCampaignID={handleCampaignID}
                handleCreateRendition={handleCreateRendition}
              />
            }
          />
          <Route
            path="/camptactics"
            element={
              <CampTactics
                campaignName={campaignName}
                editTactics={editTactics}
                selectedRows={selectedRows}
                handleSelectionChange={handleSelectionChange}
                tacticRows={tacticRows}
                campaignID={campaignID}
                setTacticData={setTacticData}
                tacticData={tacticData}
                auth={auth}
                rendition={rendition}
                newContent={newContent}
                backDash={backDash}
                handleReqConfig={handleReqConfig}
              />
            }
          />
          <Route
            path="/edittactics"
            element={
              <EditTactics
                campaignName={campaignName}
                selectedRows={selectedRows}
                setSelectedRows={setSelectedRows}
                auth={auth}
                tacticForm={tacticForm}
                backTact={backTact}
            
              />
            }
          />
          <Route
            path="/rendreqconfig"
            element={
              <RendReqConfig
                campaignName={campaignName}
                selectedRows={selectedRows}
                setSelectedRows={setSelectedRows}
                auth={auth}
                backTact={backTact}
                tacticForm={tacticForm}
                rendition={rendition}
                handleCollabs={handleCollabs}
              />
            }
          />
          <Route
            path="/collaborators"
            element={
              <Collaborators
                campaignName={campaignName}
                selectedRows={selectedRows}
                setSelectedRows={setSelectedRows}
                auth={auth}
                backTact={backTact}
                tacticForm={tacticForm}
                rendition={rendition}
                handleCollabs={handleCollabs}
                renditionDetails={renditionDetails}
              />
            }
          />
          <Route
            path="/renditions/:tactic"
            element={
              <Rendition auth={auth} />
            }
          />
        </Routes>
      )}
      {!auth ? <SignIn getAccessToken={getAccessToken} /> : null}
    </div>
  );
}

export default App;