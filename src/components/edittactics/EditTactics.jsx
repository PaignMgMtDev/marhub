import React, { useState } from "react";
import {
  Paper,
  TextField,
  RadioGroup,
  Radio,
  FormControlLabel,
  Button,
  FormControl,
  FormLabel,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  Typography,
  IconButton
} from "@mui/material";
import CampHeader from "../header/CampHeader";
import CloseIcon from "@mui/icons-material/Close";

export default function EditTactics({ campaignName, selectedRows, setSelectedRows }) {

    const [openModal, setOpenModal] = useState(false);

    const handleConfirmClick = () => {
    
      setOpenModal(true);
    };
  
    const handleCloseModal = () => {
      
      setOpenModal(false);
    };

    const handleRemoveTactic = (tactic) => {
        
        const filteredTactics = selectedRows.filter(t => t !== tactic);
        setSelectedRows(filteredTactics);
      };
  return (
    <div>
      <center>
        <CampHeader campaignName={campaignName} />
      </center>
     
      <div className="content-container" style={{ padding: "20px" }}>
       
        <Paper style={{ padding: "20px", marginBottom: "20px" }}>
          <div className="tactic-selection">
            <h3>Selected Tactics</h3>
            {selectedRows.map((tactic) => (
              <div key={tactic} style={{ display: 'flex', alignItems: 'center' }}>
                <Typography style={{ marginRight: '8px' }}>{tactic}</Typography>
                <IconButton onClick={() => handleRemoveTactic(tactic)} size="small">
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              </div>
            ))}
          </div>
        </Paper>

       
        <Paper style={{ padding: "20px", marginBottom: "20px" }}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Select a Placement Type</FormLabel>
            <RadioGroup>
              <FormControlLabel
                value="primary"
                control={<Radio />}
                label="Primary"
              />
              <FormControlLabel
                value="secondary"
                control={<Radio />}
                label="Secondary"
              />
              <FormControlLabel
                value="coBrand"
                control={<Radio />}
                label="Co Brand"
              />
            </RadioGroup>
          </FormControl>
        </Paper>

       
        <Paper style={{ padding: "20px", marginBottom: "20px" }}>
          <div className="placement-details">
            <h3>Add Placement Details</h3>
            <TextField
              id="start-date"
              label="Start"
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
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
            />
          </div>
        </Paper>

       
        <Paper style={{ padding: "20px", marginBottom: "20px" }}>
          <div className="audience-definition">
            <h3>Define the Audience</h3>
            <TextField
              id="audience-details"
              label="Audience details"
              multiline
              rows={4}
            />
          </div>
        </Paper>

     
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button variant="contained" sx={{backgroundColor: "#FF7F50"}} onClick={handleConfirmClick}>
            Confirm
          </Button>
          <Dialog
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Your Request Has Been Received"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Scrape ID: xyz
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
