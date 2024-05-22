import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Paper, Button, Typography, Grid, Autocomplete, TextField } from "@mui/material";
import CampHeader from "../header/CampHeader";
import axios from "axios";
import { DataGridPro } from "@mui/x-data-grid-pro";

export default function Collaborators({
  campaignName,
  auth,
  tacticForm,
  backTact,
  rendition,
  renditionDetails,
}){
  const REACT_APP_API_BASE_URL = "https://campaign-app-api-staging.azurewebsites.net/"
  const [collaborators, setCollaborators] = useState([])
  const [selectedUserId, setSelectedUserId] = useState(null)

  const [tables, setTables] = useState([])
  const [selectedTable, setSelectedTable] = useState(null)

  const [attributes, setAttributes] = useState([])
  const [selectedAttribute, setSelectedAttribute] = useState(null)

  const [flags, setFlags] = useState([])
  const [selectedFlags, setSelectedFlags] = useState([])

  const [collaboratorRenditions, setCollaboratorRenditions] = useState([])

  const authHeader = useMemo(
    () => ({
      headers: {
        Authorization: `Bearer ${auth}`,
        "Content-Type": "application/json",
      },
    }),
    [auth]
  );

  const getCollaborators = useCallback(async () => {
    try{
      const url = REACT_APP_API_BASE_URL + `/api/mihp/collaborators/`
      const res = await axios.get(url, authHeader)
      const data = res?.data 
      data && setCollaborators(data?.collaborators)
    }catch(e){
      console.log('error while getting collaborators: ', e)
    }
  }, [authHeader])

  useEffect(() => {
    getCollaborators()
  }, [getCollaborators]);

  const handleSetFlag = (event, values) => {
    setSelectedFlags(values.map(flag => flag.id));
  }

  const getAttributeTableValues = useCallback(async (userId) => {
    try{
      const url = REACT_APP_API_BASE_URL + `/api/mihp/collaborator-attribute-tables/${userId}/`
      const res = await axios.get(url, authHeader)
      const data = res?.data
      data && setTables(data?.attribute_tables)
    }catch(e){
      console.log('error while getting attribute table values: ', e)
    }
  }, [authHeader])

  const getAttributesValues = useCallback(async(table) => {
    try{
      const url = REACT_APP_API_BASE_URL + `/api/mihp/collaborator-attributes-flow/collaborator-${selectedUserId}/table-${table?.id}/`
      const res = await axios.get(url, authHeader)
      const data = res?.data
      data && setAttributes(data?.attributes)
    }catch(e){
      console.log('error while getting attribute values: ', e)
    }
  }, [authHeader, selectedUserId])

  const getAttributeFlags = useCallback(async (attributeSelected) => {
    try{
      const url = REACT_APP_API_BASE_URL + `/api/mihp/collaborator-attributes-flow/collaborator-${selectedUserId}/table-${selectedTable?.id}/attribute-${attributeSelected}/`
      const res = await axios.get(url, authHeader)
      const data = res?.data 
      data && setFlags(data?.attribute_flags)
    }catch(e){
      console.log('error while getting attribute flags: ', e)
    }
  }, [authHeader, selectedUserId, selectedTable])

  const handleSetTable = (event, value) => {
    value && getAttributesValues(value)
    value && setSelectedTable(value);
  };

  const handleSetAttribute = (event, value) => {
    value && setSelectedAttribute(value?.id)
    value && getAttributeFlags(value?.id)
  }


  const getRenditionsByUser = useCallback(async (userId) => {
    try{
      const renditionId = renditionDetails?.rendition_request_log?.id
      const url = REACT_APP_API_BASE_URL + `/api/mihp/collaborator-rendition-requests/${renditionId}/${userId}/`
  
      const res = await axios.get(url, authHeader)
      setCollaboratorRenditions(res?.data)
    }catch(e){
      console.log('error while getting renditions by collaborator: ', e)
    }
  }, [authHeader, renditionDetails])

  const handleCollaboratorSelected = (user) => {
    //reset rendering values on click on new collaborator
    setSelectedTable(null)
    setSelectedAttribute(null)
    setSelectedFlags([])
    setTables([])
    setAttributes([])
    setFlags([])
    //end rendering values

    setSelectedUserId(user?.id);
    getRenditionsByUser(user?.id)
    getAttributeTableValues(user?.id)
  }

  const sendForm = async () => {
    try{
      const url = REACT_APP_API_BASE_URL + `/api/mihp/rendition-collaborator/`
      const body = JSON.stringify({
        rendition_request: renditionDetails.rendition_request_log.id,
        collaborator: selectedUserId,
        attribute_values: selectedFlags
      })
      const res = await axios.post(url, body, authHeader)
      const data = res?.data 
      data && console.log(data)
    }catch(e){
      console.log('error while sending the form: ', e)
    }
  };

  const renditionRows = collaboratorRenditions?.map((rendition) => ({
    id: rendition.id,
    tactics: rendition?.tactics?.map((tact) => tact?.id),
    placementType: rendition?.placement_type?.placement_type_name,
    localization: rendition?.localization,
    translation: rendition?.translation,
    renditionDescription: rendition?.rendition_description,
  }));

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
    {
      field: "renditionDescription",
      headerName: "Rendition Description",
      width: 300,
    },
  ];

  const buttonDisabled = selectedTable === null || selectedAttribute === null || selectedFlags?.length === 0 ? true : false

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
        style={{ padding: 20, paddingTop: "25px" }}>
        <Grid item>
          <Paper sx={{ padding: 2, minHeight: "150px", width: "400px" }}>
            <Typography variant="h6" gutterBottom>
              Select Collaborators
            </Typography>
            {collaborators?.map((collaborator, index) => {
              if(collaborator?.user?.first_name?.length === 0) return null 
              return(
                <Grid
                  container
                  key={collaborator?.id + index}
                  alignItems="center"
                  spacing={1}
                  >
                    <Grid item xs>
                      <Button
                        onClick={() => handleCollaboratorSelected(collaborator)}
                        variant="link"
                        sx={{
                          backgroundColor:
                            selectedUserId === collaborator?.id ? "grey" : "inherit", // Conditionally apply color
                          "&:hover": {
                            backgroundColor: "lightgrey", // Hover effect
                          },
                        }}
                      >
                        {collaborator?.user?.first_name} {collaborator?.user?.last_name}
                      </Button>
                    </Grid>
                  </Grid>
                )
            })}
          </Paper>
        </Grid>
        {tables?.length > 0 &&
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
        </Grid>}
        {attributes?.length > 0 &&
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
        </Grid>}
        {flags?.length > 0 &&
        <Grid item>
          <Paper sx={{ padding: 2, minHeight: "150px", width: "400px" }}>
            <Autocomplete
              multiple
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
        </Grid>} 
      </Grid>
      <Grid
        container
        justifyContent="center"
        style={{ marginTop: 20, marginBottom: 20, paddingRight: "155px" }}>
        <Button
          variant="contained"
          sx={{ backgroundColor: "#FF7F50" }}
          onClick={sendForm}
          disabled={buttonDisabled}>
          Submit Rendition Request
        </Button>
      </Grid>
      {collaboratorRenditions?.length > 0 && (
        <DataGridPro rows={renditionRows} columns={renditionColumns} />
      )}
    </div>
  );
}
