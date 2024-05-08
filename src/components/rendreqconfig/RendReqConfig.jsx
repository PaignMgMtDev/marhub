// import React, {
//   // useEffect,
//   useState,
// } from "react";
// import {
//   Paper,
//   TextField,
//   //   RadioGroup,
//   //   Radio,
//   FormControlLabel,
//   Button,
//   FormControl,
//   FormLabel,
//   Typography,
//   IconButton,
//   Grid,
//   Checkbox,
//   FormGroup,
// } from "@mui/material";
// import CampHeader from "../header/CampHeader";
// import CloseIcon from "@mui/icons-material/Close";

// export default function RendReqConfig({
//   campaignName,
//   selectedRows,
//   setSelectedRows,
//   auth,
//   tacticForm,
//   backTact,
// }) {
//   const [placementID, setPlacementID] = useState();
//   const [description, setDescription] = useState("");
//   //   const [placementData, setPlacementData] = useState([]);
//   const [localizationChecked, setLocalizationChecked] = useState(true);
//   const [translationsChecked, setTranslationsChecked] = useState(true);

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

//   /* <RadioGroup value={placementID} onChange={handleSetPlacementType}>
//               {placementData.map((placement) => (
//                 <FormControlLabel
//                   key={placement.id}
//                   value={placement.id}
//                   control={<Radio />}
//                   label={placement.placement_type_name}
//                 />
//               ))}
//             </RadioGroup> */

//   //   async function fetchPlacementTypes() {
//   //     const url =
//   //       "https://campaign-app-api-staging.azurewebsites.net/api/contentframework/get-placement-types/";
//   //     const headers = new Headers({
//   //       Authorization:
//   //         "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzE2NjQ5MzgzLCJpYXQiOjE3MTQwNTczODMsImp0aSI6IjljN2Y3YjEwMDUwNjRhYzQ5YjJlOTQwNGI0YWUwOGI3IiwidXNlcl9pZCI6MTN9.NCTkmKTYQzpIl8xqtcxYWrK7gpt3cYBFiykoM7hkMRw",
//   //       "Content-Type": "application/json",
//   //     });

//   //     const requestOptions = {
//   //       method: "GET",
//   //       headers: headers,
//   //       redirect: "follow",
//   //     };

//   //     try {
//   //       const response = await fetch(url, requestOptions);
//   //       if (!response.ok) {
//   //         throw new Error(`HTTP error! Status: ${response.status}`);
//   //       }
//   //       const result = await response.json(); // Assuming the response is JSON
//   //       console.log(result);
//   //       return result;
//   //     } catch (error) {
//   //       console.error("Error fetching placement types:", error);
//   //     }
//   //   }

//   //   useEffect(() => {
//   //     fetchPlacementTypes().then((data) => {
//   //       if (data) {
//   //         setPlacementData(data);
//   //       }
//   //     });
//   //   }, []);

//   const sendForm = () => {
//     const tacticsIds = selectedRows.map((tactic) => tactic.id);
//     const placementIdNumber = Number(placementID);
//     fetch("", {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${auth}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         tactics: tacticsIds,
//         placement_type: placementIdNumber,
//         placement_description: description,
//       }),
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         console.log(data);
//       })

//       .catch((error) => {
//         console.error("Error:", error);
//       });
//   };

//   const handleRemoveTactic = (tactic) => {
//     const filteredTactics = selectedRows.filter((t) => t !== tactic);
//     setSelectedRows(filteredTactics);
//   };

//   return (
//     <div>
//       <Grid container justifyContent="center">
//         <Grid item>
//           <CampHeader
//             campaignName={campaignName}
//             tacticForm={tacticForm}
//             backTact={backTact}
//           />
//         </Grid>
//       </Grid>

//       <Grid
//         container
//         spacing={1}
//         justifyContent="center"
//         style={{ padding: 2, paddingTop: "25px" }}
//       >
//         <Grid item xs={12} md={4}>
//           <Paper sx={{ padding: 2, minHeight: "150px", width: "400px" }}>
//             <Typography variant="h6" gutterBottom>
//               Selected Tactics
//             </Typography>
//             {selectedRows.map((tactic) => (
//               <Grid container key={tactic.id} alignItems="center" spacing={1}>
//                 <Grid item xs>
//                   <Typography>{tactic.tactName}</Typography>
//                 </Grid>
//                 <Grid item>
//                   <IconButton
//                     onClick={() => handleRemoveTactic(tactic)}
//                     size="small"
//                   >
//                     <CloseIcon />
//                   </IconButton>
//                 </Grid>
//               </Grid>
//             ))}
//           </Paper>
//         </Grid>

//         <Grid item xs={12} md={4}>
//           <Paper sx={{padding: 2, minHeight: "150px", width: "400px"}}>
//             <FormControl component="fieldset">
//               <FormLabel component="legend">Select A Placement</FormLabel>

//               <FormGroup value={placementID} onChange={handleSetPlacementType}>
//                 <FormControlLabel
//                   value="1"
//                   control={<Checkbox />}
//                   label="Primary"
//                 />
//                 <FormControlLabel
//                   value="2"
//                   control={<Checkbox />}
//                   label="Secondary"
//                 />
//                 <FormControlLabel
//                   value="3"
//                   control={<Checkbox />}
//                   label="Co Brand"
//                 />
//               </FormGroup>
//             </FormControl>
//           </Paper>
//         </Grid>

//         <Grid item xs={12} md={4}>
//           <Paper sx={{ padding: 2, width: "800px" }}>
//             <Grid container spacing={2}>
//               <Grid item xs={12}>
//                 <Typography variant="h6" gutterBottom>
//                   Select Rendition Type
//                 </Typography>
//                 <FormControlLabel
//                   control={
//                     <Checkbox
//                       checked={localizationChecked}
//                       onChange={handleLocalizationChange}
//                     />
//                   }
//                   label="Localization"
//                 />
//                 <FormControlLabel
//                   control={
//                     <Checkbox
//                       checked={translationsChecked}
//                       onChange={handleTranslationsChange}
//                     />
//                   }
//                   label="Translations"
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <Typography variant="h6" gutterBottom>
//                   Rendition Description
//                 </Typography>
//                 <TextField
//                   label="Description"
//                   multiline
//                   rows={4}
//                   fullWidth
//                   margin="normal"
//                   value={description}
//                   onChange={handleDesc}
//                 />
//               </Grid>
//             </Grid>
//           </Paper>
//         </Grid>
//       </Grid>

//       <Grid container justifyContent="flex-end" style={{ marginTop: "20px" }}>
//         <Button
//           variant="contained"
//           sx={{ backgroundColor: "#FF7F50" }}
//           onClick={sendForm}
//         >
//           Select Collaborators
//         </Button>
//       </Grid>
//     </div>
//   );
// }


import React, { useState } from 'react';
import {
  Paper,
  TextField,
  FormControlLabel,
  Button,
  FormControl,
  FormLabel,
  Typography,
  IconButton,
  Grid,
  Checkbox,
  FormGroup,
} from '@mui/material';
import CampHeader from '../header/CampHeader';
import CloseIcon from '@mui/icons-material/Close';

export default function RendReqConfig({
  campaignName,
  selectedRows,
  setSelectedRows,
  auth,
  tacticForm,
  backTact,
  rendition,
  handleCollabs
}) {
  const [placementID, setPlacementID] = useState();
  const [description, setDescription] = useState("");
  const [localizationChecked, setLocalizationChecked] = useState(false);
  const [translationsChecked, setTranslationsChecked] = useState(false);

  const handleLocalizationChange = () =>
    setLocalizationChecked(!localizationChecked);
  const handleTranslationsChange = () =>
    setTranslationsChecked(!translationsChecked);

  const handleSetPlacementType = (event) => {
    setPlacementID(event.target.value);
  };

  const handleDesc = (event) => {
    setDescription(event.target.value);
  };

  const sendForm = () => {
    const tacticsIds = selectedRows.map((tactic) => tactic.id);
    const placementIdNumber = Number(placementID);
    fetch("", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tactics: tacticsIds,
        placement_type: placementIdNumber,
        placement_description: description,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleRemoveTactic = (tactic) => {
    const filteredTactics = selectedRows.filter((t) => t !== tactic);
    setSelectedRows(filteredTactics);
  };

  return (
    <div>
        <Grid container justifyContent="center">
         <Grid item>
           <CampHeader
            campaignName={campaignName}
            tacticForm={tacticForm}
            backTact={backTact}
            rendition={rendition}
          />
        </Grid>
      </Grid>
      
<Grid
  container
  spacing={2}  
//   justifyContent="center"
  style={{ padding: 20, paddingTop: "25px" }}
>
  <Grid item >
    <Paper sx={{ padding: 2, minHeight: "150px", width: "400px" }}>
      <Typography variant="h6" gutterBottom>
        Selected Tactics
      </Typography>
      {selectedRows.map((tactic) => (
        <Grid container key={tactic.id} alignItems="center" spacing={1}>
          <Grid item xs>
            <Typography>{tactic.tactName}</Typography>
          </Grid>
          <Grid item>
            <IconButton
              onClick={() => handleRemoveTactic(tactic)}
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>
      ))}
    </Paper>
  </Grid>

  <Grid item >
    <Paper sx={{ padding: 2, minHeight: "150px", width: "400px" }}>
      <FormControl component="fieldset">
        <FormLabel component="legend">Select A Placement</FormLabel>
        <FormGroup value={placementID} onChange={handleSetPlacementType}>
          <FormControlLabel value="1" control={<Checkbox />} label="Primary" />
          <FormControlLabel value="2" control={<Checkbox />} label="Secondary" />
          <FormControlLabel value="3" control={<Checkbox />} label="Co Brand" />
        </FormGroup>
      </FormControl>
    </Paper>
  </Grid>

  <Grid item >
    <Paper sx={{ padding: 2, width: "800px" }}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography variant="h6" gutterBottom>
            Select Rendition Type
          </Typography>
          <FormControlLabel
            control={<Checkbox checked={localizationChecked} onChange={handleLocalizationChange} />}
            label="Localization"
          />
          <FormControlLabel
            control={<Checkbox checked={translationsChecked} onChange={handleTranslationsChange} />}
            label="Translations"
          />
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h6" gutterBottom>
            Rendition Description
          </Typography>
          <TextField
            label="Description"
            multiline
            rows={4}
            fullWidth
            margin="normal"
            value={description}
            onChange={handleDesc}
          />
        </Grid>
      </Grid>
    </Paper>
  </Grid>
</Grid>

      <Grid container justifyContent="flex-end" style={{ marginTop: 20, paddingRight: "155px" }}>
        <Button variant="contained" sx={{ backgroundColor: "#FF7F50" }} onClick={handleCollabs}>Select Collaborators</Button>
      </Grid>
    </div>
  );
}
