import React, { useEffect, useState, useCallback } from "react";
import {
  Paper,
  Button,
  Typography,
  Grid,
  Autocomplete,
  TextField,
  Modal,
  Box,
  IconButton,
} from "@mui/material";
import CampHeader from "../header/CampHeader";
import axios from "axios";
import { DataGridPro } from "@mui/x-data-grid-pro";
import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";

export default function Collaborators({
  authHeader,
  campaignName,
  tacticForm,
  backTact,
  rendition,
  renditionDetails,
}) {
  const navigate = useNavigate();

  const [collaborators, setCollaborators] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUserName, setSelectedUserName] = useState("");

  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);

  const [attributes, setAttributes] = useState([]);
  const [selectedAttribute, setSelectedAttribute] = useState(null);

  const [flags, setFlags] = useState([]);
  const [selectedFlags, setSelectedFlags] = useState([]);

  const [collaboratorRenditions, setCollaboratorRenditions] = useState([]);

  const [collabRendition, setCollabRendition] = useState(null);

  const [toggleModal, setToggleModal] = useState(false);

  const [queuedCollaborators, setQueuedCollaborators] = useState([]);

  const handleAddToQueue = () => {
    const newEntry = {
      collaboratorName: selectedUserName, // Already formatted as First Name Last Name
      tableName: formatTableName(
        tables.find((table) => table.id === selectedTable.id)?.name
      ), // Format and store the table name
      attributeName: formatAttributeName(
        attributes.find((attribute) => attribute.id === selectedAttribute)?.name
      ), // Format and store the attribute name
      flagNames: selectedFlags
        .map((flagId) => flags.find((flag) => flag.id === flagId)?.name)
        .map(formatAttributeName), // Format and store each flag name
    };

    setQueuedCollaborators((prev) => [...prev, newEntry]);
    // Reset selections after adding to queue
    setSelectedUserId(null);
    setSelectedTable(null);
    setSelectedAttribute(null);
    setSelectedFlags([]);
  };

  const handleRemoveCollaborator = (index) => {
    setQueuedCollaborators((prev) => prev.filter((_, i) => i !== index));
  };

  const getCollaborators = useCallback(async () => {
    try {
      const url = `${process.env.REACT_APP_API_BASE_URL}/api/mihp/collaborators/`;
      const res = await axios.get(url, authHeader);
      const data = res?.data;
      data && setCollaborators(data?.collaborators);
    } catch (e) {
      console.log("error while getting collaborators: ", e);
    }
  }, [authHeader]);

  useEffect(() => {
    getCollaborators();
  }, [getCollaborators]);

  const handleSetFlag = (event, values) => {
    setSelectedFlags(values.map((flag) => flag.id));
  };

  const getAttributeTableValues = useCallback(
    async (userId) => {
      try {
        const url = `${process.env.REACT_APP_API_BASE_URL}/api/mihp/collaborator-attribute-tables/${userId}/`;
        const res = await axios.get(url, authHeader);
        const data = res?.data;
        data && setTables(data?.attribute_tables);
      } catch (e) {
        console.log("error while getting attribute table values: ", e);
      }
    },
    [authHeader]
  );

  const getAttributesValues = useCallback(
    async (table) => {
      try {
        const url = `${process.env.REACT_APP_API_BASE_URL}/api/mihp/collaborator-attributes-flow/collaborator-${selectedUserId}/table-${table?.id}/`;
        const res = await axios.get(url, authHeader);
        const data = res?.data;
        data && setAttributes(data?.attributes);
      } catch (e) {
        console.log("error while getting attribute values: ", e);
      }
    },
    [authHeader, selectedUserId]
  );

  const getAttributeFlags = useCallback(
    async (attributeSelected) => {
      try {
        const url = `${process.env.REACT_APP_API_BASE_URL}/api/mihp/collaborator-attributes-flow/collaborator-${selectedUserId}/table-${selectedTable?.id}/attribute-${attributeSelected}/`;
        const res = await axios.get(url, authHeader);
        const data = res?.data;
        data && setFlags(data?.attribute_flags);
      } catch (e) {
        console.log("error while getting attribute flags: ", e);
      }
    },
    [authHeader, selectedUserId, selectedTable]
  );

  const handleSetTable = (event, value) => {
    value && getAttributesValues(value);
    value && setSelectedTable(value);
  };

  const handleSetAttribute = (event, value) => {
    value && setSelectedAttribute(value?.id);
    value && getAttributeFlags(value?.id);
  };

  const getRenditionsByUser = useCallback(
    async (userId) => {
      try {
        const renditionId = renditionDetails?.rendition_request_log?.id;
        const url = `${process.env.REACT_APP_API_BASE_URL}/api/mihp/collaborator-rendition-requests/${renditionId}/${userId}/`;
        const res = await axios.get(url, authHeader);
        setCollaboratorRenditions(res?.data);
      } catch (e) {
        console.log("error while getting renditions by collaborator: ", e);
      }
    },
    [authHeader, renditionDetails]
  );

  const handleCollaboratorSelected = (user) => {
    //reset rendering values on click on new collaborator
    setSelectedTable(null);
    setSelectedAttribute(null);
    setSelectedFlags([]);
    setTables([]);
    setAttributes([]);
    setFlags([]);
    //end rendering values
    setSelectedUserId(user?.id);
    getRenditionsByUser(user?.id);
    getAttributeTableValues(user?.id);
    setSelectedUserName(`${user?.user?.first_name} ${user?.user?.last_name}`);
  };

  const sendForm = async () => {
    try {

      const url = `${process.env.REACT_APP_API_BASE_URL}/api/mihp/rendition-collaborators-v2/`;

     

      const body = JSON.stringify({
        rendition_request: renditionDetails.rendition_request_log.id,
        collaborators: queuedCollaborators,
      });

      const res = await axios.post(url, body, authHeader);
      const data = res?.data;
      if (data) {
        console.log(data);
        setToggleModal(true);
        setCollabRendition(true);
      }
    } catch (e) {
      console.log("error while sending the form: ", e);
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

  const formatTableName = (name) => {
    if (name.startsWith("MarD_")) {
      name = name.substring(5);
    }
    return name
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const formatAttributeName = (name) => {
    let result = name.replace("iglobal_", "").replace("_id", ""); // Remove prefix and suffix
    return result.charAt(0).toUpperCase() + result.slice(1).toLowerCase(); // Capitalize first letter
  };

  const buttonDisabled =
    selectedTable === null ||
    selectedAttribute === null ||
    selectedFlags?.length === 0
      ? true
      : false;

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
  };

  const handleClose = () => {
    setToggleModal(!toggleModal);
    navigate("/dashlanding");
  };

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
      <Grid sx={{ paddingTop: "20px" }} container justifyContent="center">
        <Paper
          sx={{
            height: "50px",
            width: "675px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 1,
            color: "secondary.dark",
          }}
        >
          <Typography variant="h5">
            Please Select the Recipients and Configure Their Assignment
          </Typography>
        </Paper>
      </Grid>
      <Grid container spacing={2} style={{ padding: 20, paddingTop: "25px" }}>
        <Grid item>
          <Paper sx={{ padding: 2, minHeight: "150px", width: "400px" }}>
            <Typography variant="h6" gutterBottom>
              Select Collaborators
            </Typography>
            {collaborators?.map((collaborator, index) => {
              if (collaborator?.user?.first_name?.length === 0) return null;
              return (
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
                          selectedUserId === collaborator?.id
                            ? "grey"
                            : "inherit", // Conditionally apply color
                        "&:hover": {
                          backgroundColor: "lightgrey", // Hover effect
                        },
                      }}
                    >
                      {collaborator?.user?.first_name}{" "}
                      {collaborator?.user?.last_name}
                    </Button>
                  </Grid>
                </Grid>
              );
            })}
          </Paper>
        </Grid>
        {tables?.length > 0 && (
          <Grid item>
            <Paper sx={{ padding: 2, minHeight: "150px", width: "400px" }}>
              <Autocomplete
                id="tags-standard"
                onChange={handleSetTable}
                options={tables}
                getOptionLabel={(option) => formatTableName(option.name)}
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
        )}
        {attributes?.length > 0 && (
          <Grid item>
            <Paper sx={{ padding: 2, minHeight: "150px", width: "400px" }}>
              <Autocomplete
                id="tags-standard"
                options={attributes}
                getOptionLabel={(option) => formatAttributeName(option.name)}
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
        )}
        {flags?.length > 0 && (
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
          </Grid>
        )}
      </Grid>
      <Grid
        container
        justifyContent="flex-end"
        style={{ marginTop: 20, marginBottom: 20, paddingRight: "155px" }}
      >
        <Button
          variant="contained"
          sx={{ backgroundColor: "#FF7F50", marginTop: 2 }}
          onClick={handleAddToQueue}
          disabled={buttonDisabled}
        >
          Add Collaborator to Queue
        </Button>
      </Grid>

      <Grid container spacing={2} style={{ padding: 20 }}>
        {queuedCollaborators.map((item, index) => (
          <Grid item key={index}>
            <Paper
              elevation={3}
              sx={{ padding: 2, minHeight: "150px", width: "300px" }}
            >
              <Typography variant="h6">
                Collaborator: {item.collaboratorName}
              </Typography>
              <Typography>Table: {item.tableName}</Typography>
              <Typography>Attribute: {item.attributeName}</Typography>
              <Typography>Flags: {item.flagNames.join(", ")}</Typography>
              <IconButton
                onClick={() => handleRemoveCollaborator(index)}
                sx={{ position: "absolute" }}
              >
                <CloseIcon />
              </IconButton>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid
        container
        justifyContent="flex-end"
        style={{ marginTop: 20, marginBottom: 20, paddingRight: "155px" }}
      >
        {queuedCollaborators?.length > 0 ? (
          <Button
            variant="contained"
            sx={{ backgroundColor: "#FF7F50" }}
            onClick={sendForm}
            // disabled={buttonDisabled}
          >
            Submit Rendition Request
          </Button>
        ) : null}
      </Grid>
      {collaboratorRenditions?.length > 0 && (
        <DataGridPro rows={renditionRows} columns={renditionColumns} />
      )}
      <Modal
        open={toggleModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography sx={{ p: 2 }}>
            You have created Rendition Request ID{" "}
            {collabRendition?.rendition_collaborator?.id} and a Workfront task
            has been delivered to the following users:{" "}
            {queuedCollaborators
              .map((collab) => collab.collaboratorName)
              .join(", ")}
          </Typography>
          <Button onClick={handleClose}>OKAY</Button>
        </Box>
      </Modal>
    </div>
  );
}
