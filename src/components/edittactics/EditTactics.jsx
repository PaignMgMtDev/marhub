import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import CampHeader from "../header/CampHeader";
import CloseIcon from "@mui/icons-material/Close";

export default function EditTactics({
  campaignName,
  selectedRows,
  setSelectedRows,
  auth,
  tacticForm,
  backTact
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

  async function fetchPlacementTypes() {
    const url =
      "https://campaign-app-api-staging.azurewebsites.net/api/contentframework/get-placement-types/";
    const headers = new Headers({
      Authorization:
        "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzE2NjQ5MzgzLCJpYXQiOjE3MTQwNTczODMsImp0aSI6IjljN2Y3YjEwMDUwNjRhYzQ5YjJlOTQwNGI0YWUwOGI3IiwidXNlcl9pZCI6MTN9.NCTkmKTYQzpIl8xqtcxYWrK7gpt3cYBFiykoM7hkMRw",
      "Content-Type": "application/json",
    });

    const requestOptions = {
      method: "GET",
      headers: headers,
      redirect: "follow",
    };

    try {
      const response = await fetch(url, requestOptions);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json(); // Assuming the response is JSON
      console.log(result);
      return result;
    } catch (error) {
      console.error("Error fetching placement types:", error);
    }
  }

  useEffect(() => {
    fetchPlacementTypes().then((data) => {
      if (data) {
        setPlacementData(data);
      }
    });
  }, []);

  const sendForm = () => {
    const tacticsIds = selectedRows.map((tactic) => tactic.id);
    const placementIdNumber = Number(placementID);
    fetch(
      "https://campaign-app-api-staging.azurewebsites.net/api/mihp/data-log/",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${auth}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tactics: tacticsIds,
          placement_type: placementIdNumber,
          placement_start_dt: startDate,
          placement_end_dt: endDate,
          placement_description: description,
          audience: audience,
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setScrapeID(data["mihp_data_log"]["scrape_log_id"]);
        handleConfirmClick();
      })

      .catch((error) => {
        console.error("Error:", error);
      });
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
      <center>
        <CampHeader 
        campaignName={campaignName} 
        tacticForm={tacticForm}
        backTact={backTact}
        />
      </center>

      <div className="content-container" style={{ padding: "20px" }}>
        <Paper style={{ padding: "20px", marginBottom: "20px" }}>
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

        <Paper style={{ padding: "20px", marginBottom: "20px" }}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Select a Placement Type</FormLabel>

            <RadioGroup value={placementID} onChange={handleSetPlacementType}>
              {placementData.map((placement) => (
                <FormControlLabel
                  key={placement.id}
                  value={placement.id}
                  control={<Radio />}
                  label={placement.placement_type_name}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </Paper>

        <Paper style={{ padding: "20px", marginBottom: "20px" }}>
          <div className="placement-details">
            <h3>Add Placement Details</h3>

            <TextField
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
              id="description"
              label="Description"
              multiline
              rows={4}
              onChange={handleDesc}
              value={description}
            />
          </div>
        </Paper>

        <Paper style={{ padding: "20px", marginBottom: "20px" }}>
          <div className="audience-definition">
            <h3>Define the Audience</h3>
            <TextField
              onChange={handleAudience}
              value={audience}
              id="audience-details"
              label="Audience details"
              multiline
              rows={4}
            />
          </div>
        </Paper>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
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
        </div>
      </div>
    </div>
  );
}
