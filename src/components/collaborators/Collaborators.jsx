import React, { 
  useEffect, 
  useState, 
  // useMemo 
} from "react";
import {
  Paper,
  Button,
  Typography,
  Grid,
  Autocomplete,
  TextField,
} from "@mui/material";
import CampHeader from "../header/CampHeader";
//import { Value } from 'sass';
// import axios from "axios";
// import { DataGridPro } from "@mui/x-data-grid-pro";

export default function Collaborators({
  campaignName,
  auth,
  tacticForm,
  backTact,
  rendition,
  renditionDetails,
}) {
  // const [collaboratorRenditions, setCollaboratorRenditions] = useState([]);

  // const authHeader = useMemo(
  //   () => ({
  //     headers: {
  //       Authorization: `Bearer ${auth}`,
  //       "Content-Type": "application/json",
  //     },
  //   }),
  //   [auth]
  // );

  const [users, setUsers] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [selectedAttribute, setSelectedAttribute] = useState()
  const handleSetAttribute = (event, value) => {
   
    if (value) {
      setSelectedAttribute(value.id); 
    } else {
      setSelectedAttribute(null);
    }
    console.log("Selected Attribute:", selectedAttribute);
  }
  console.log(selectedAttribute)
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
        setUsers(data.collaborators);

        // const allAttributes = data.collaborators.flatMap(collab => collab.attribute_values);
        // setAttributes(allAttributes);
      });
  }, [auth]);

  // const [addedAttributes, setAddedAttributes] = useState();
  // const handleAddedAttributes = (event, value) => {
  //   const ids = value.map((item) => item.id);
  //   setAddedAttributes(ids);
  // };
  // console.log(addedAttributes);

  // const [collaboratorSelected, setCollaboratorSelected] = useState([])
  const [selectedUserId, setSelectedUserId] = useState();

  const handleCollaboratorSelected = (user) => {
    // setCollaboratorRenditions([])
    // const ids = user;
    // setCollaboratorSelected(ids);
    setSelectedUserId(user.id);
  };

  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState();
  const handleSetTable = (event, value) => {
    setSelectedTable(value ? value.id : null);
  };

  console.log(selectedTable);
  useEffect(() => {
    fetch(
      `https://campaign-app-api-staging.azurewebsites.net/api/mihp/collaborator-attribute-tables/${selectedUserId}/`,
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
        setTables(data["attribute_tables"]);
      });
  }, [selectedUserId, auth]);


  const [flags, setFlags] = useState([])
  const [selectedFlag, setSelectedFlag] = useState()
  console.log(selectedFlag)
  const handleSetFlag = (event, value) => {
    setSelectedFlag(value ? value.id : null);
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://campaign-app-api-staging.azurewebsites.net/api/mihp/collaborator-attributes-flow/collaborator-${selectedUserId}/table-${selectedTable}/`,
          {
            headers: {
              Authorization: `Bearer ${auth}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        console.log(data)
        setAttributes(data['attributes']); // Assuming data is the array as shown
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [selectedTable, auth, selectedUserId]); 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://campaign-app-api-staging.azurewebsites.net/api/mihp/collaborator-attributes-flow/collaborator-${selectedUserId}/table-${selectedTable}/attribute-${selectedAttribute}/`,
          {
            headers: {
              Authorization: `Bearer ${auth}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        console.log(data)
        setFlags(data['attribute_flags'])
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [selectedAttribute, selectedUserId, auth, selectedTable]); 

  useEffect(() => {
    fetch(`https://campaign-app-api-staging.azurewebsites.net/api/mihp/collaborator-attributes-flow/collaborator-${selectedUserId}/table-${selectedTable}/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${auth}`,
        "Content-Type": "application/json",
      },
      redirect: "follow",
    })
    .then((response) => response.json())
    .then((data) => {

     console.log(data)
    });
  }, [selectedTable, auth, selectedUserId]);

  // let REACT_APP_API_BASE_URL = "https://campaign-app-api-staging.azurewebsites.net/";
    // const getRenditionsByUser = async () => {
    //   const userId = collaboratorSelected?.id
    //   const url = REACT_APP_API_BASE_URL + `/api/mihp/collaborator-renditions/${userId}/`

    //   const res = await axios.get(url, authHeader)
    //   setCollaboratorRenditions(res?.data?.collaborator_renditions)
    // }

  const sendForm = () => {
    fetch(
      "https://campaign-app-api-staging.azurewebsites.net/api/mihp/rendition-collaborator/",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${auth}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rendition_request: renditionDetails.rendition_request_log.id,
          collaborator: selectedUserId,
          attribute_values: [selectedAttribute]
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    // getRenditionsByUser()
  };

  // const handleRemoveUser = (user) => {
  //   const filteredUsers = user.filter((t) => t !== user);
  //   setUsers(filteredUsers);
  // };

  // const renditionRows = collaboratorRenditions?.map((rendition) => ({
  //   id: rendition.id,
  //   tactics: rendition?.tactics?.map((tact) => tact?.id),
  //   placementType: rendition?.placement_type?.placement_type_name,
  //   localization: rendition?.localization,
  //   translation: rendition?.translation,
  //   renditionDescription: rendition?.rendition_description,
  // }));

  // const renditionColumns = [
  //   {
  //     field: "id",
  //     headerName: "ID",
  //     width: 100,
  //   },
  //   {
  //     field: "tactics",
  //     headerName: "Tactics",
  //     width: 300,
  //   },
  //   {
  //     field: "placementType",
  //     headerName: "Placement Type",
  //     width: 200,
  //   },
  //   { field: "localization", headerName: "Localization", width: 300 },
  //   { field: "translation", headerName: "Translation", width: 300 },
  //   {
  //     field: "renditionDescription",
  //     headerName: "Rendition Description",
  //     width: 300,
  //   },
  // ];

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
        <Grid item>
          <Paper sx={{ padding: 2, minHeight: "150px", width: "400px" }}>
            <Typography variant="h6" gutterBottom>
              Select Collaborators
            </Typography>
            {users?.map((user, index) => (
              <Grid
                container
                key={user.id + index}
                alignItems="center"
                spacing={1}
              >
                <Grid item xs>
                  <Button
                    onClick={() => handleCollaboratorSelected(user)}
                    variant="link"
                    sx={{
                      backgroundColor:
                        selectedUserId === user.user.id ? "grey" : "inherit", // Conditionally apply color
                      "&:hover": {
                        backgroundColor: "lightgrey", // Hover effect
                      },
                    }}
                  >
                    {user.user.first_name} {user.user.last_name}
                  </Button>
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

        <Grid item>
          <Paper sx={{ padding: 2, minHeight: "150px", width: "400px" }}>
            <Autocomplete
              id="tags-standard"
              onChange={handleSetTable}
              options={tables}
              getOptionLabel={(table) => `${table.name}`}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  label="Select Tables"
                  placeholder=""
                />
              )}
            />
          </Paper>
        </Grid>
        <Grid item>
          <Paper sx={{ padding: 2, minHeight: "150px", width: "400px" }}>
            <Autocomplete
             
              id="tags-standard"
              options={attributes}
              getOptionLabel={(option) => option.name}
              onChange={handleSetAttribute}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  label="Select Attributes"
                  placeholder="Select..."
                />
              )}
            />
            
          </Paper>
        </Grid>
        <Grid item>
          <Paper sx={{ padding: 2, minHeight: "150px", width: "400px" }}>
            <Autocomplete
          
              id="tags-standard"
              options={flags}
              getOptionLabel={(flag) => flag.name}
              onChange={handleSetFlag}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  label="Select Flags"
                  placeholder="Select..."
                />
              )}
            />
            
          </Paper>
        </Grid>
        
      </Grid>

      <Grid
        container
        justifyContent="center"
        style={{ marginTop: 20, marginBottom: 20, paddingRight: "155px" }}
      >
        <Button
          variant="contained"
          sx={{ backgroundColor: "#FF7F50" }}
          onClick={sendForm}
        >
          Submit Rendition Request
        </Button>
      </Grid>
      {/* {collaboratorRenditions?.length > 0 && (
        <DataGridPro rows={renditionRows} columns={renditionColumns} />
      )} */}
    </div>
  );
}
