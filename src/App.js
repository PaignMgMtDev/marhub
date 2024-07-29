import { useCallback, useState, useMemo  } from "react"
import "./App.css"
import SignIn from "./components/SignIn";
import DashLanding from "./components/dashlanding/DashLanding"
import { Routes, Route, useNavigate, useLocation } from "react-router-dom"
import CampTactics from "./components/camptactics/CampTactics"
import EditTactics from "./components/edittactics/EditTactics"
import RendReqConfig from "./components/rendreqconfig/RendReqConfig"
import Rendition from "./components/rendition/Rendition"
import Collaborators from "./components/collaborators/Collaborators"
import RenditionTactics from "./components/renditiontactics/RenditionTactics"
import Header from "./components/header/Header"
import { ProtectedRoute } from "./routes/ProtectedRoute"
import { useAuth } from "./hooks/useAuth"
import axios from "axios"

function App() {
  const location = useLocation();
  const { auth, login } = useAuth()
  
  const searchParams = new URLSearchParams(location.search)
  const redirectUrl = searchParams.get('redirect_url')
  const redirectUrl2 = searchParams.get('redirect_path')

  const authHeader = useMemo(
    () => ({
      headers: {
        Authorization: `Bearer ${auth}`,
        "Content-Type": "application/json",
      },
    }),
    [auth]
  );

  const getAccessToken = useCallback(async (e, email, password) => {
    e.preventDefault();
    const url = `${process.env.REACT_APP_API_BASE_URL}/api/users/token/obtain/`
    const body = JSON.stringify({
      email,
      password,
    })
    const res = await axios.post(url, body, authHeader)
    const data = res?.data 
    if(data?.access){
      const authToken = data?.access
      redirectUrl ? 
        login(authToken, redirectUrl) : 
      redirectUrl2 ?
        login(authToken, redirectUrl2) : 
      login(authToken, "/dashlanding")
    }
  }, [authHeader, login, redirectUrl, redirectUrl2])

  const [campaignName, setCampaignName] = useState("");
  const [campaignID, setCampaignID] = useState("");
  const [campaignData, setCampaignData] = useState([]);
  const [tacticData, setTacticData] = useState([]);
  const [lastProofedTreatment, setLastProofedTreatment] = useState("");

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

  const tacticRows = tacticData?.map((tactic) => ({
    id: tactic.id,
    tactName: tactic.name,
    status: tactic.current_status.toUpperCase(),
    startdate: tactic.planned_start_dt,
    enddate: tactic.planned_end_dt,
    language: tactic.language,
    description: tactic.description
  }));
  const [selectedRows, setSelectedRows] = useState([]);

  const handleSelectionChange = (selectionModel) => {
    const selectedTactics = selectionModel
      .map((id) => {
        const row = tacticRows.find((row) => row.id === id);
        return row ? { id: row.id, tactName: row.tactName, startdate: row.startdate, enddate: row.enddate } : null;
      })
      .filter((tactic) => tactic !== null);
    
    setSelectedRows(selectedTactics);
  };

  let navigate = useNavigate();

  const [renditionRequestID,setRenditionRequestID] = useState("");

  const handleRenditionRequestID = (value) =>{
    setRenditionRequestID(value);
  }

  return (
    <div className="App">
      <Header />
        <Routes>
          <Route 
            path="/"
            element={
              <SignIn getAccessToken={getAccessToken} />
            }/>
          <Route
            path="/dashlanding"
            element={
              <ProtectedRoute>
                <DashLanding
                  authHeader={authHeader}
                  handleAddNewContent={handleAddNewContent}
                  campaignData={campaignData}
                  setCampaignData={setCampaignData}
                  handleCampaignID={handleCampaignID}
                  handleCreateRendition={handleCreateRendition}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/camptactics"
            element={
              <ProtectedRoute>
                <CampTactics
                  authHeader={authHeader}
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
              </ProtectedRoute>
            }
          />
          <Route
            path="/edittactics"
            element={
              <ProtectedRoute>
                <EditTactics
                  authHeader={authHeader}
                  campaignName={campaignName}
                  selectedRows={selectedRows}
                  setSelectedRows={setSelectedRows}
                  tacticForm={tacticForm}
                  backTact={backTact}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rendreqconfig"
            element={
              <ProtectedRoute>
                <RendReqConfig
                  campaignName={campaignName}
                  selectedRows={selectedRows}
                  setSelectedRows={setSelectedRows}
                  authHeader={authHeader}
                  backTact={backTact}
                  tacticForm={tacticForm}
                  rendition={rendition}
                  handleCollabs={handleCollabs}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/collaborators"
            element={
              <ProtectedRoute>
                <Collaborators
                  authHeader={authHeader}
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
              </ProtectedRoute>
            }
          />
          <Route
            path="/renditions/:tactic"
            element={
              <ProtectedRoute>
                <Rendition 
                  auth={auth}
                  renditionRequestID={renditionRequestID}
                  setLastProofedTreatment={setLastProofedTreatment}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rendition-request/:rendition"
            element={
              <ProtectedRoute>
                <RenditionTactics 
                  authHeader={authHeader} 
                  handleRenditionRequestID={handleRenditionRequestID}
                />
              </ProtectedRoute>
            }
          />
        </Routes>
    </div>
  );
}

export default App;