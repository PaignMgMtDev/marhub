import React, { useEffect, useState } from 'react';
import {
  Paper,
  Button,
  Typography,
  IconButton,
  Grid,
  Autocomplete,
  TextField,
} from '@mui/material';
import CampHeader from '../header/CampHeader';
import CloseIcon from '@mui/icons-material/Close';

export default function Collaborators({
  campaignName,
  auth,
  tacticForm,
  backTact,
  rendition,
}) {


  const [users, setUsers] = useState([]);
  useEffect(() => {
    fetch(
      "https://campaign-app-api-staging.azurewebsites.net/api/mihp/collaborators/",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${auth}`,
          "Content-Type": "application/json",
        },
        redirect: "follow",
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setUsers(data["users"]);
      });
  }, [auth]);
  
const [attributes, setAttributes] = useState([    
    {
        "id": 1,
        "attribute": "Attribute 1"
    },
    {
        "id": 2,
        "attribute": "Attribute 2"
    },
    {
        "id": 3,
        "attribute": "Attribute 3"
    }
]);

const [addedAttributes, setAddedAttributes] = useState([])
const handleAddedAttributes = (event, value) => {
    const ids = value.map(item => item.id);
setAddedAttributes(ids)
}
console.log(addedAttributes)


  const sendForm = () => {
    
    fetch("", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        
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
    <Autocomplete
        multiple
        id="tags-standard"
        onChange={handleAddedAttributes}
        options={attributes}
        getOptionLabel={(attributes) => attributes.attribute}    
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
