import React, { useCallback, useEffect, useState } from "react";
import {
  Paper,
  TextField,
  RadioGroup,
  Radio,
  FormControlLabel,
  Button,
  FormControl,
  FormLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  IconButton,
  Grid,
} from "@mui/material"
import CampHeader from "../header/CampHeader"
import CloseIcon from "@mui/icons-material/Close"
import axios from "axios"

export default function EditTactics({
  authHeader,
  campaignName,
  selectedRows,
  setSelectedRows,
  tacticForm,
  backTact,
  rendition,
}) {
  const [openModal, setOpenModal] = useState(false);
  const [scrapeID, setScrapeID] = useState("");
  const [placementID, setPlacementID] = React.useState();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [audience, setAudience] = useState("");
  const [placementData, setPlacementData] = useState([]);

  const handleSetPlacementType = (event) => {
    setPlacementID(event.target.value);
  };
  const handleStartDate = (event) => {
    setStartDate(event.target.value);
  };
  const handleEndDate = (event) => {
    setEndDate(event.target.value);
  };
  const handleDesc = (event) => {
    setDescription(event.target.value);
  };
  const handleAudience = (event) => {
    setAudience(event.target.value);
  };

  const getPlacementTypes = useCallback(async () => {
    try{
      const tacticIds = selectedRows?.map(tactic => tactic?.id)
      const url = `${process.env.REACT_APP_API_BASE_URL}/api/mihp/get-placement-types/`
      const body = JSON.stringify({
        tactics: tacticIds,
      })
      const res = await axios.post(url, body, authHeader)
      const data = res?.data 
      data && setPlacementData(data)
    }catch(e){
      console.log('error while getting placement types: ', e)
    }
  }, [authHeader, selectedRows, setPlacementData])
 
  useEffect(() => {
    getPlacementTypes()
  }, [getPlacementTypes]);

  const sendForm = async () => {
    try{
      const tacticsIds = selectedRows.map((tactic) => tactic.id);
      const placementIdNumber = Number(placementID);
      const url = `${process.env.REACT_APP_API_BASE_URL}/api/mihp/data-log/`
      const body = JSON.stringify({
        tactics: tacticsIds,
        placement_type: placementIdNumber,
        placement_start_dt: startDate,
        placement_end_dt: endDate,
        placement_description: description,
        audience: audience,
      })
      const res = await axios.post(url, body, authHeader)
      const data = res?.data
      if(data){
        setScrapeID(data?.mihp_data_log?.scrape_log_id)
        handleConfirmClick()
      }
    }catch(e){
      console.log('error while creating data log: ', e)
    }
  };

  const handleConfirmClick = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
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
        <Grid item>
          <Paper sx={{ padding: 2, minHeight: "150px", width: "400px" }}>
            <div className="tactic-selection">
              <h3>Selected Tactics</h3>
              {selectedRows.map((tactic) => (
                <div
                  key={tactic.id}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <Typography style={{ marginRight: "8px" }}>
                    {tactic.tactName}
                  </Typography>
                  <IconButton
                    onClick={() => handleRemoveTactic(tactic)}
                    size="small"
                  >
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                </div>
              ))}
            </div>
          </Paper>
        </Grid>

        <Grid item>
          <Paper sx={{ padding: 2, minHeight: "150px", width: "400px" }}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Select a Placement Type</FormLabel>

              <RadioGroup value={placementID} onChange={handleSetPlacementType}>
                {placementData.map((item) => (
                  <FormControlLabel
                    key={item.placement_type.id} 
                    value={item.placement_type.id} 
                    control={<Radio />}
                    label={item.placement_type.placement_type_name} // Access `placement_type_name` from `placement_type`
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Paper>
        </Grid>

        <Grid item>
          <Paper sx={{ padding: 2, minHeight: "150px", width: "400px" }}>
            <div className="placement-details">
              <h3>Add Placement Details</h3>

              <TextField
                sx={{ paddingRight: "35px" }}
                value={startDate}
                onChange={handleStartDate}
                id="start-date"
                label="Start"
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                value={endDate}
                onChange={handleEndDate}
                id="end-date"
                label="End"
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
              />

              <TextField
                sx={{ paddingTop: "20px", width: "360px" }}
                id="description"
                placeholder="Description"
                // multiline
                // rows={4}
                onChange={handleDesc}
                value={description}
              />
            </div>
          </Paper>
        </Grid>

        <Grid item>
          <Paper sx={{ padding: 2, minHeight: "150px", width: "400px" }}>
            <div className="audience-definition">
              <h3>Define the Audience</h3>
              <TextField
                sx={{ width: "360px" }}
                onChange={handleAudience}
                value={audience}
                id="audience-details"
                placeholder="Audience details"
                // multiline
                // rows={4}
              />
            </div>
          </Paper>
        </Grid>

        <Grid
          container
          justifyContent="flex-end"
          style={{ marginTop: 20, paddingRight: "155px" }}
        >
          <Button
            variant="contained"
            sx={{ backgroundColor: "#FF7F50" }}
            onClick={sendForm}
          >
            Confirm
          </Button>
          <Dialog
            open={openModal}
            onClose={handleCloseModal}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Your Request Has Been Received"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Scrape ID: {scrapeID}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseModal} color="primary" autoFocus>
                OK
              </Button>
            </DialogActions>
          </Dialog>
        </Grid>
      </Grid>
    </div>
  );
}
