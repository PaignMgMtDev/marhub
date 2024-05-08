import React, { useState } from 'react';
import {
  Paper,
//   TextField,
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

export default function Collaborators({
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
//   const [description, setDescription] = useState("");
//   const [localizationChecked, setLocalizationChecked] = useState(false);
//   const [translationsChecked, setTranslationsChecked] = useState(false);

//   const handleLocalizationChange = () =>
//     setLocalizationChecked(!localizationChecked);
//   const handleTranslationsChange = () =>
//     setTranslationsChecked(!translationsChecked);

  const handleSetPlacementType = (event) => {
    setPlacementID(event.target.value);
  };

//   const handleDesc = (event) => {
//     setDescription(event.target.value);
//   };

  const [users, setUsers] = useState([
    {
        "id": 1,
        "user": "User 1"
    },
    {
        "id": 2,
        "user": "User 2"
    },
    {
        "id": 3,
        "user": "User 3"
    }
]);

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
        // placement_description: description,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        handleCollabs()
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleRemoveUser = (user) => {
    const filteredUsers = user.filter((t) => t !== user);
    setUsers(filteredUsers);
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
        Select Collaborators
      </Typography>
      {users.map((user) => (
        <Grid container key={user.id} alignItems="center" spacing={1}>
          <Grid item xs>
            <Typography>{user.user}</Typography>
          </Grid>
          <Grid item>
            <IconButton
              onClick={() => handleRemoveUser(user)}
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

  
</Grid>

      <Grid container justifyContent="flex-end" style={{ marginTop: 20, paddingRight: "155px" }}>
        <Button variant="contained" sx={{ backgroundColor: "#FF7F50" }} onClick={sendForm}>Select Collaborators</Button>
      </Grid>
    </div>
  );
}
