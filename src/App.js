import { useState } from "react";
import "./App.css";
import SignIn from "./components/SignIn";
import DashLanding from "./components/dashlanding/DashLanding";
import { Routes, Route, useNavigate } from "react-router-dom";
import CampTactics from "./components/camptactics/CampTactics";
import EditTactics from "./components/edittactics/EditTactics";

function App() {
  const [owner, setOwner] = useState("");
  const [auth, setAuth] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    setAuth(
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzE2NjQ5MzgzLCJpYXQiOjE3MTQwNTczODMsImp0aSI6IjljN2Y3YjEwMDUwNjRhYzQ5YjJlOTQwNGI0YWUwOGI3IiwidXNlcl9pZCI6MTN9.NCTkmKTYQzpIl8xqtcxYWrK7gpt3cYBFiykoM7hkMRw"
    );
    setOwner(data.get("email"));
    handleSetDash();
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

  const editTactics = () => {
    navigate("/edittactics");
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
              />
            }
          />
        </Routes>
      )}
      {!auth ? <SignIn handleSubmit={handleSubmit} /> : null}
    </div>
  );
}

export default App;
