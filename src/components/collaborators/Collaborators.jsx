import React, { useEffect, useState, useMemo } from 'react';
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
import axios from 'axios'
import { DataGridPro } from "@mui/x-data-grid-pro";

export default function Collaborators({
  campaignName,
  auth,
  tacticForm,
  backTact,
  rendition,
  renditionDetails
}) {

  const [collaboratorRenditions, setCollaboratorRenditions] = useState([])

  const authHeader = useMemo(() => ({
    headers: {
      Authorization: `Bearer ${auth}`,
      "Content-Type": "application/json",
    },
  }), [auth]);


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
    setCollaboratorRenditions([])
    const ids = user;
    setCollaboratorSelected(ids);
    setSelectedUserId(user.user.id);
    setAttributes(user.attribute_values)
}


let REACT_APP_API_BASE_URL = "https://campaign-app-api-staging.azurewebsites.net/";
  const getRenditionsByUser = async () => {
    const userId = collaboratorSelected?.id
    const url = REACT_APP_API_BASE_URL + `/api/mihp/collaborator-renditions/${userId}/`

    const res = await axios.get(url, authHeader)
    setCollaboratorRenditions(res?.data?.collaborator_renditions)
  }

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
        setAttributes(attributes)
      })
      .catch((error) => {
        console.error("Error:", error);
      });

      getRenditionsByUser()
  };

  // const handleRemoveUser = (user) => {
  //   const filteredUsers = user.filter((t) => t !== user);
  //   setUsers(filteredUsers);
  // };

  const renditionRows = collaboratorRenditions?.map((rendition) => ({
    id: rendition.id,
    tactics: rendition?.tactics?.map((tact => tact?.id)),
    placementType: rendition?.placement_type?.placement_type_name,
    localization: rendition?.localization,
    translation: rendition?.translation,
    renditionDescription: rendition?.rendition_description,
  }))

const renditionColumns = [
    {
      field: "id",
      headerName: "ID",
      width: 100,
    },
    {
      field: "tactics",
      headerName: "Tactics",
      width: 300,
    },
    {
      field: "placementType",
      headerName: "Placement Type",
      width: 200,
    },
    { field: "localization", headerName: "Localization", width: 300 },
    { field: "translation", headerName: "Translation", width: 300 },
    { field: "renditionDescription", headerName: "Rendition Description", width: 300 },
  ];

  return (
    <div>
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
      {users?.map((user, index) => (
        <Grid container key={user.user.id + index} alignItems="center" spacing={1}>
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

      <Grid container justifyContent="center" style={{ marginTop: 20, marginBottom: 20, paddingRight: "155px" }}>
        <Button variant="contained" sx={{ backgroundColor: "#FF7F50" }} onClick={sendForm}>Submit Rendition Request</Button>
      </Grid>
      {collaboratorRenditions?.length > 0 &&
          <DataGridPro
              rows={renditionRows}
              columns={renditionColumns}
          />}
    </div>
  );
}
