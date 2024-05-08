import { useState } from "react";
import "./App.css";
import SignIn from "./components/SignIn";
import DashLanding from "./components/dashlanding/DashLanding";
import { Routes, Route, useNavigate } from "react-router-dom";
import CampTactics from "./components/camptactics/CampTactics";
import EditTactics from "./components/edittactics/EditTactics";
import RendReqConfig from "./components/rendreqconfig/RendReqConfig";
import Rendition from "./components/rendition/Rendition";

function App() {
  const [owner, setOwner] = useState("");
  const [auth, setAuth] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    setAuth(
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzE3Nzc0NTUzLCJpYXQiOjE3MTUxODI1NTMsImp0aSI6IjFjNWVhMjAyMGM1MTQ0NzJiMjY4N2I0ZDJiYmYwMmIzIiwidXNlcl9pZCI6MX0.VTDf2K6LcM7TRUqMkLadu38vSPImG1eTr-wD0ZAvgIY"
    );
    setOwner(data.get("email"));
    // handleSetDash();
  };

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
    console.log(selectedTactics);
    setSelectedRows(selectedTactics);
  };

  // const handleSelectionChange = (selectionModel) => {
  //   const selectedTacticNames = selectionModel.map(
  //     (id) => tacticRows.find((row) => row.id === id)?.tactName
  //   );
  //   setSelectedRows(selectedTacticNames);
  // };

  let navigate = useNavigate();

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
      {!auth ? <SignIn handleSubmit={handleSubmit} /> : null}
    </div>
  );
}

export default App;