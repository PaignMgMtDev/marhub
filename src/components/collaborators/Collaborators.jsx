import React, { useEffect, useState } from 'react';
import {
  Paper,
  Button,
  Typography,
  Grid,
  Autocomplete,
  TextField,
} from '@mui/material';
import CampHeader from '../header/CampHeader';
//import { Value } from 'sass';
import Header from "../header/Header";

export default function Collaborators({
  campaignName,
  auth,
  tacticForm,
  backTact,
  rendition,
  renditionDetails
}) {


  console.log(renditionDetails);
  const [users, setUsers] = useState([]);
  const [attributes, setAttributes] = useState([]);
  useEffect(() => {
    fetch("https://campaign-app-api-staging.azurewebsites.net/api/mihp/collaborators/", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${auth}`,
        "Content-Type": "application/json",
      },
      redirect: "follow",
    })
    .then((response) => response.json())
    .then((data) => {
      setUsers(data.collaborators);
      
      const allAttributes = data.collaborators.flatMap(collab => collab.attribute_values);
      setAttributes(allAttributes);
    });
  }, [auth]);
  
const [addedAttributes, setAddedAttributes] = useState([])
const handleAddedAttributes = (event, value) => {
    const ids = value.map(item => item.id);
setAddedAttributes(ids)
}
console.log(addedAttributes)

const [collaboratorSelected, setCollaboratorSelected] = useState([])
const [selectedUserId, setSelectedUserId] = useState(null);

const handleCollaboratorSelected = (user) => {
    const ids = user;
    setCollaboratorSelected(ids);
    setSelectedUserId(user.user.id);
    setAttributes(user.attribute_values)
}





// console.log(collaboratorSelected);

// console.log(JSON.stringify({
//   "rendition_request": renditionDetails.rendition_request_log.id,
//   "attribute_values": addedAttributes,
//   "collaborator": collaboratorSelected.id
// }));


  const sendForm = () => {
    
    fetch("https://campaign-app-api-staging.azurewebsites.net/api/mihp/rendition-collaborator/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "rendition_request": renditionDetails.rendition_request_log.id,
        "attribute_values": addedAttributes,
        "collaborator": collaboratorSelected.id
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setAttributes(attributes)
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  // const handleRemoveUser = (user) => {
  //   const filteredUsers = user.filter((t) => t !== user);
  //   setUsers(filteredUsers);
  // };

  return (
    <div>
    <div>
    <center>
      <Header />
    </center>
    </div>
    <div>
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
      </div>
      </div>
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
        <Grid container key={user.user.id} alignItems="center" spacing={1}>
          <Grid item xs>
          <Button onClick={() => handleCollaboratorSelected(user)} variant='link'
          sx={{
            backgroundColor: selectedUserId === user.user.id ? 'grey' : 'inherit', // Conditionally apply color
            '&:hover': {
              backgroundColor: 'lightgrey', // Hover effect
            }
          }}
          >{user.user.first_name} {user.user.last_name}</Button>
          </Grid>
          <Grid item>
            {/* <IconButton
              onClick={() => handleRemoveUser(user)}
              size="small"
            >
              <CloseIcon />
            </IconButton> */}
          </Grid>
        </Grid>
      ))}
    </Paper>
  </Grid>

  <Grid item >
    <Paper sx={{ padding: 2, minHeight: "150px", width: "400px" }}>
    <Autocomplete
        multiple
        id="tags-standard"
        onChange={handleAddedAttributes}
        options={attributes}
        getOptionLabel={(attribute) => `${attribute.id} - Count: ${attribute.count}`}    
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            label="Select Attributes"
            placeholder=""
          />
        )}
      />
    </Paper>
  </Grid>

  
</Grid>

      <Grid container justifyContent="center" style={{ marginTop: 20, paddingRight: "155px" }}>
        <Button variant="contained" sx={{ backgroundColor: "#FF7F50" }} onClick={sendForm}>Submit Rendition Request</Button>
      </Grid>
    </div>
  );
}
