// import React, { useCallback, useEffect, useState } from "react";
// import {
//   Paper,
//   TextField,
//   FormControlLabel,
//   Button,
//   FormControl,
//   // FormLabel,
//   Typography,
//   IconButton,
//   Grid,
//   Checkbox,
//   FormGroup,
// } from "@mui/material";
// import CampHeader from "../header/CampHeader";
// import CloseIcon from "@mui/icons-material/Close";
// import { CheckBox } from "@mui/icons-material";
// import axios from "axios";

// export default function RendReqConfig({
//   campaignName,
//   selectedRows,
//   setSelectedRows,
//   authHeader,
//   tacticForm,
//   backTact,
//   rendition,
//   handleCollabs,
// }) {
//   const [placementID, setPlacementID] = useState();
//   const [description, setDescription] = useState("");
//   const [localizationChecked, setLocalizationChecked] = useState(false);
//   const [translationsChecked, setTranslationsChecked] = useState(false);
//   const [placementData, setPlacementData] = useState([]);

//   const handleLocalizationChange = () =>
//     setLocalizationChecked(!localizationChecked);
//   const handleTranslationsChange = () =>
//     setTranslationsChecked(!translationsChecked);

//   const handleSetPlacementType = (event) => {
//     setPlacementID(event.target.value);
//   };

//   const handleDesc = (event) => {
//     setDescription(event.target.value);
//   };

//   const getPlacementTypes = useCallback(async () => {
//     try {
//       const tacticsIds = selectedRows.map((tactic) => tactic.id);
//       const url = `${process.env.REACT_APP_API_BASE_URL}/api/mihp/get-placement-types/`;
//       const body = JSON.stringify({
//         tactics: tacticsIds,
//       });
//       const res = await axios.post(url, body, authHeader);
//       const data = res?.data;
//       data && setPlacementData(data);
//     } catch (e) {
//       console.log("error while getting placement types: ", e);
//     }
//   }, [selectedRows, authHeader]);

//   useEffect(() => {
//     getPlacementTypes();
//   }, [getPlacementTypes]);

//   const sendForm = async () => {
//     const tacticsIds = selectedRows.map((tactic) => tactic.id);
//     const url = `${process.env.REACT_APP_API_BASE_URL}/api/mihp/rendition-request/`;
//     const body = JSON.stringify({
//       tactics: tacticsIds,
//       placement_type: 3,
//       localization: localizationChecked,
//       translation: translationsChecked,
//       rendition_description: description,
//     });
//     const res = await axios.post(url, body, authHeader);
//     const data = res?.data;
//     data && handleCollabs(data);
//   };

//   const handleRemoveTactic = (tactic) => {
//     const filteredTactics = selectedRows.filter((t) => t !== tactic);
//     setSelectedRows(filteredTactics);
//   };

//   const [next, setNext] = useState(false);
//   const handleNext = () => {
//     setNext(true);
//   };

//   return (
//     <div>
//       <div>
//         <Grid container justifyContent="center">
//           <Grid item>
//             <CampHeader
//               campaignName={campaignName}
//               tacticForm={tacticForm}
//               backTact={backTact}
//               rendition={rendition}
//             />
//           </Grid>
//         </Grid>
//       </div>
//       <Grid
//         container
//         spacing={2}
//         //   justifyContent="center"
//         style={{ padding: 20, paddingTop: "25px" }}
//       >
//         {!next ? (
//           <div>
//             <Grid item>
//               <Paper sx={{ padding: 2, minHeight: "150px", width: "400px" }}>
//                 <Typography variant="h6" gutterBottom>
//                   Selected Tactics
//                 </Typography>
//                 {selectedRows.map((tactic) => (
//                   <Grid
//                     container
//                     key={tactic.id}
//                     alignItems="center"
//                     spacing={1}
//                   >
//                     <Grid item xs>
//                       <Typography>{tactic.tactName}</Typography>
//                     </Grid>
//                     <Grid item>
//                       <IconButton
//                         onClick={() => handleRemoveTactic(tactic)}
//                         size="small"
//                       >
//                         <CloseIcon />
//                       </IconButton>
//                     </Grid>
//                   </Grid>
//                 ))}
//               </Paper>
//             </Grid>

//             <Grid item>
//               <Paper sx={{ padding: 2, minHeight: "150px", width: "400px" }}>
//                 <FormControl component="fieldset">
//                   <Typography variant="h6" gutterBottom>
//                     Select Placements for Rendition
//                   </Typography>
//                   <FormGroup
//                     value={placementID}
//                     onChange={handleSetPlacementType}
//                   >
//                     {placementData
//                       .reduce((unique, item) => {
//                         // Check if the unique array already contains an item with this id
//                         if (
//                           !unique.some(
//                             (obj) =>
//                               obj.placement_type.id === item.placement_type.id
//                           )
//                         ) {
//                           unique.push(item);
//                         }
//                         return unique;
//                       }, [])
//                       .map((item) => (
//                         <FormControlLabel
//                           disabled={true}
//                           key={item.placement_type.id}
//                           value={item.placement_type.id}
//                           control={<CheckBox defaultChecked />}
//                           label={item.placement_type.placement_type_name}
//                         />
//                       ))}
//                     {/* {placementData.map((item) => (
//                   <FormControlLabel
//                     key={item.placement_type.id} 
//                     value={item.placement_type.id} 
//                     control={<CheckBox defaultChecked />}
//                     label={item.placement_type.placement_type_name} 
//                   />
//                 ))} */}
//                   </FormGroup>
//                 </FormControl>
//               </Paper>
//               <Grid
//                 container
//                 justifyContent="flex-end"
//                 sx={{ alignItems: "flex-end" }}
//               >
//                 <Grid item sx={{ marginTop: "20px" }}>
//                   <Button
//                     variant="contained"
//                     sx={{ backgroundColor: "primary.main" }}
//                     onClick={handleNext}
//                   >
//                     Next
//                   </Button>
//                 </Grid>
//               </Grid>
//             </Grid>
//           </div>
//         ) : null}
//         {next ? (
//           <div>
//             <Grid item >
//               <Paper sx={{ padding: 2, width: "800px" }}>
//                 <Grid container spacing={2}>
//                   <Grid item xs={6}>
//                     <Typography variant="h6" gutterBottom>
//                       Select Rendition Type
//                     </Typography>
//                     <FormControlLabel
//                       control={
//                         <Checkbox
//                           checked={localizationChecked}
//                           onChange={handleLocalizationChange}
//                         />
//                       }
//                       label="Localization"
//                     />
//                     <FormControlLabel
//                       control={
//                         <Checkbox
//                           checked={translationsChecked}
//                           onChange={handleTranslationsChange}
//                         />
//                       }
//                       label="Translations"
//                     />
//                   </Grid>
//                   <Grid item xs={6}>
//                     <Typography variant="h6" gutterBottom>
//                       Rendition Description
//                     </Typography>
//                     <TextField
//                       label="Description"
//                       multiline
//                       rows={4}
//                       fullWidth
//                       margin="normal"
//                       value={description}
//                       onChange={handleDesc}
//                     />
//                   </Grid>
//                 </Grid>
//               </Paper>
//               {translationsChecked === true || localizationChecked === true ? (
//                 <div>
//                   <Grid container alignItems="flex-end">
//                     <Grid item>
//                     <Button
//                       variant="contained"
//                       sx={{ backgroundColor: "primary.main" }}
//                       onClick={sendForm}
//                     >
//                       Select Collaborators
//                     </Button>
//                     </Grid>
//                   </Grid>
//                 </div>
//               ) : null}
//             </Grid>
//           </div>
//         ) : null}
//       </Grid>
//     </div>
//   );
// }
import React, { useCallback, useEffect, useState } from "react";
import {
  Paper,
  TextField,
  FormControlLabel,
  Button,
  FormControl,
  Typography,
  IconButton,
  Grid,
  Checkbox,
  FormGroup,
  Box
} from "@mui/material";
import CampHeader from "../header/CampHeader";
import CloseIcon from "@mui/icons-material/Close";
import CheckBox from "@mui/icons-material/CheckBox";
import axios from "axios";

export default function RendReqConfig({
  campaignName,
  selectedRows,
  setSelectedRows,
  authHeader,
  tacticForm,
  backTact,
  rendition,
  handleCollabs,
}) {
  const [placementID, setPlacementID] = useState();
  const [description, setDescription] = useState("");
  const [localizationChecked, setLocalizationChecked] = useState(false);
  const [translationsChecked, setTranslationsChecked] = useState(false);
  const [placementData, setPlacementData] = useState([]);

  const handleLocalizationChange = () => setLocalizationChecked(!localizationChecked);
  const handleTranslationsChange = () => setTranslationsChecked(!translationsChecked);

  const handleSetPlacementType = (event) => {
    setPlacementID(event.target.value);
  };

  const handleDesc = (event) => {
    setDescription(event.target.value);
  };

  const getPlacementTypes = useCallback(async () => {
    try {
      const tacticsIds = selectedRows.map((tactic) => tactic.id);
      const url = `${process.env.REACT_APP_API_BASE_URL}/api/mihp/get-placement-types/`;
      const body = JSON.stringify({ tactics: tacticsIds });
      const res = await axios.post(url, body, authHeader);
      const data = res?.data;
      data && setPlacementData(data);
    } catch (e) {
      console.log("error while getting placement types: ", e);
    }
  }, [selectedRows, authHeader]);

  useEffect(() => {
    getPlacementTypes();
  }, [getPlacementTypes]);

  const sendForm = async () => {
    const tacticsIds = selectedRows.map((tactic) => tactic.id);
    const url = `${process.env.REACT_APP_API_BASE_URL}/api/mihp/rendition-request/`;
    const body = JSON.stringify({
      tactics: tacticsIds,
      placement_type: 3,
      localization: localizationChecked,
      translation: translationsChecked,
      rendition_description: description,
    });
    const res = await axios.post(url, body, authHeader);
    const data = res?.data;
    data && handleCollabs(data);
  };

  const handleRemoveTactic = (tactic) => {
    const filteredTactics = selectedRows.filter((t) => t !== tactic);
    setSelectedRows(filteredTactics);
  };

  const [next, setNext] = useState(false);
  const handleNext = () => {
    setNext(true);
  };

  const handlePrev = () => {
    setNext(false);
  };

  return (
    <div>
      <Grid container justifyContent="center">
        <CampHeader
          campaignName={campaignName}
          tacticForm={tacticForm}
          backTact={backTact}
          rendition={rendition}
        />
      </Grid>
      <Grid container spacing={2} style={{ padding: 20, paddingTop: "25px" }} justifyContent="center">
        {!next ? (
          <>
            <Grid item xs={12} md={6}>
              <Paper sx={{ padding: 2 }}>
                <Typography variant="h6" gutterBottom>Selected Tactics</Typography>
                {selectedRows.map((tactic) => (
                  <Grid container key={tactic.id} alignItems="center" spacing={1}>
                    <Grid item xs>
                      <Typography>{tactic.tactName}</Typography>
                    </Grid>
                    <Grid item>
                      <IconButton onClick={() => handleRemoveTactic(tactic)} size="small">
                        <CloseIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                ))}
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ padding: 2 }}>
                <FormControl component="fieldset">
                  <Typography variant="h6" gutterBottom>Select Placements for Rendition</Typography>
                  <FormGroup>
                    {placementData.map((item) => (
                      <FormControlLabel
                        key={item.placement_type.id}
                        control={<CheckBox checked={placementID === item.placement_type.id} onChange={handleSetPlacementType} value={item.placement_type.id} />}
                        label={item.placement_type.placement_type_name}
                      />
                    ))}
                  </FormGroup>
                </FormControl>
                
              </Paper>
              <Box display="flex" justifyContent="flex-end"> 
                  <Button variant="contained" sx={{ marginTop: 2, backgroundColor: "primary.main" }} onClick={handleNext}>Next</Button>
                </Box>
            </Grid>
          </>
        ) : (
          <Grid item xs={12} md={8}>
            <Paper sx={{ padding: 2 }}>
              <Typography variant="h6" gutterBottom>Select Rendition Type</Typography>
              <FormControlLabel control={<Checkbox checked={localizationChecked} onChange={handleLocalizationChange} />} label="Localization" />
              <FormControlLabel control={<Checkbox checked={translationsChecked} onChange={handleTranslationsChange} />} label="Translations" />
              <Typography variant="h6" gutterBottom>Rendition Description</Typography>
              <TextField label="Description" multiline rows={4} fullWidth value={description} onChange={handleDesc} />
              
            </Paper>
            
<div>
  <Box sx={{ padding: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Button variant="contained" sx={{ marginTop: 2, backgroundColor: "primary.main"}} onClick={handlePrev}>Prev</Button>
              {(translationsChecked || localizationChecked) && (<Button variant="contained" sx={{ marginTop: 2, backgroundColor: "primary.main" }} onClick={sendForm}>Select Collaborators</Button>)}
                </Box>
                </div>
              
          </Grid>
        )}
      </Grid>
    </div>
  );
}
