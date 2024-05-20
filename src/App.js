import { useState  } from "react";
import "./App.css";
import SignIn from "./components/SignIn";
import DashLanding from "./components/dashlanding/DashLanding";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import CampTactics from "./components/camptactics/CampTactics";
import EditTactics from "./components/edittactics/EditTactics";
import RendReqConfig from "./components/rendreqconfig/RendReqConfig";
import Rendition from "./components/rendition/Rendition";
import Collaborators from "./components/collaborators/Collaborators";
import RenditionTactics from "./components/renditiontactics/RenditionTactics";
import Header from "./components/header/Header";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { useAuth } from "./hooks/useAuth";
// import Cookies from 'js-cookie';

function App() {
  const API_BASE_URL = "https://campaign-app-api-staging.azurewebsites.net"
  const [owner, setOwner] = useState("");
  // const [auth, setAuth] = useState("");
  const location = useLocation();
  const { auth, login } = useAuth()
  
  const searchParams = new URLSearchParams(location.search);
  const redirectUrl = searchParams.get('redirect_url');
  const redirectUrl2 = searchParams.get('redirect_path');

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
      // data?.access && login(data?.access)
      if(data?.access){
        const authToken = data?.access
        redirectUrl ? 
          login(authToken, redirectUrl) : 
        redirectUrl2 ?
          login(authToken, redirectUrl2) : 
        login(authToken, "/dashlanding")
      }
    })
    .catch(e => console.log(e))
    setOwner(email)
  }

  const handleSetLanding = (value) => {
    navigate(value);
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

  const [renditionRequestID,setRenditionRequestID] = useState("");

  const handleRenditionRequestID = (value) =>{
    setRenditionRequestID(value);
  }

  // useEffect(() => {
  //   if (auth) {
  //     navigate(location.pathname);
  //   }
  // }, [auth,navigate,location]);

  //////////
//   useEffect(() => {
//     if (auth) {
//       Cookies.set("authentication", auth);
//     }
//   }, [auth]);

//   useEffect(() => {
//     const token = Cookies.get("authentication");

//     if (token) {
//         verifyToken(token);
//     } else {
//         // Handle non-authenticated case or initial login attempt
//     }

//     async function verifyToken(token) {
//         try {
//             const response = await fetch(`https://campaign-app-api-staging.azurewebsites.net/api/users/token/verify/`, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ token }),
//             });

//             const data = await response.json();

//             if (data.isValid) {
//                 // On successful authentication, navigate to stored URL or default
//                 const savedPath = sessionStorage.getItem('preAuthRoute') || '/defaultPath';
//                 navigate(savedPath, { replace: true });
//                 sessionStorage.removeItem('preAuthRoute'); // Clear the stored path
//             } else {
//                 // Handle failed token verification
//                 Cookies.remove("authentication");
//                 // Optionally redirect to login or error page
//             }
//         } catch (error) {
//             console.error('Error verifying token:', error);
//             // Error handling
//         }
//     }
// }, [navigate]);




  // useEffect(() => {
//   const token = Cookies.get("authentication");

//   if (token) {
//     verifyToken(token);
//   }

//   async function verifyToken(token) {
//     try {
//       const response = await fetch(`https://campaign-app-api-staging.azurewebsites.net/api/users/token/verify/`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ token }),
//         redirect: "follow",
//       });

//       const data = await response.json();
//       if (data.detail) {
//         Cookies.remove("authentication");
//         // Directly navigate to login if token is invalid
//         navigate("/login");
//       } else {
//         // Navigate to the stored URL or default to '/dashlanding'
//         const initialUrl = sessionStorage.getItem('preAuthRoute') || '/dashlanding';
//         navigate(initialUrl, { replace: true });
//         sessionStorage.removeItem('preAuthRoute'); // Clean up after navigating
//       }
//     } catch (error) {
//       console.log("Failed to verify token:", error);
//       navigate("/login");
//     }
//   }
// }, [API_BASE_URL]); // Removed dependencies to prevent re-running unless component re-mounts

// useEffect(() => {
//   if (auth) {
//     Cookies.set("authentication", auth);
//   }
// }, [auth]);
///////

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
                  handleAddNewContent={handleAddNewContent}
                  campaignData={campaignData}
                  owner={owner}
                  auth={auth}
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
                  campaignName={campaignName}
                  selectedRows={selectedRows}
                  setSelectedRows={setSelectedRows}
                  auth={auth}
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
                  auth={auth}
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
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rendition-request/:rendition"
            element={
              <ProtectedRoute>
                <RenditionTactics 
                  auth={auth} 
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