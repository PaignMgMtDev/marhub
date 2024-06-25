import React, { useCallback, useEffect, useState } from "react";
import {
  Paper,
  TextField,
  FormControlLabel,
  Button,
  FormControl,
  // FormLabel,
  Typography,
  IconButton,
  Grid,
  Checkbox,
  FormGroup
} from "@mui/material";
import CampHeader from "../header/CampHeader";
import CloseIcon from "@mui/icons-material/Close";
import { CheckBox } from "@mui/icons-material";
import axios from "axios"

export default function RendReqConfig({
  campaignName,
  selectedRows,
  setSelectedRows,
  authHeader,
  tacticForm,
  backTact,
  rendition,
  handleCollabs,
}) {
  const [placementID, setPlacementID] = useState();
  const [description, setDescription] = useState("");
  const [localizationChecked, setLocalizationChecked] = useState(false);
  const [translationsChecked, setTranslationsChecked] = useState(false);
  const [placementData, setPlacementData] = useState([]);

  const handleLocalizationChange = () =>
    setLocalizationChecked(!localizationChecked);
  const handleTranslationsChange = () =>
    setTranslationsChecked(!translationsChecked);

  const handleSetPlacementType = (event) => {
    setPlacementID(event.target.value);
  };

  const handleDesc = (event) => {
    setDescription(event.target.value);
  };

  const getPlacementTypes = useCallback(async () => {
    try{
      const tacticsIds = selectedRows.map((tactic) => tactic.id)
      const url = `${process.env.REACT_APP_API_BASE_URL}/api/mihp/get-placement-types/`
      const body = JSON.stringify({
        tactics: tacticsIds,
      })
      const res = await axios.post(url, body, authHeader)
      const data = res?.data 
      data && setPlacementData(data)
    }catch(e){
      console.log('error while getting placement types: ', e)
    }
  }, [selectedRows, authHeader])

  useEffect(() => {
    getPlacementTypes()
  }, [getPlacementTypes]);

  const sendForm = async () => {
    const tacticsIds = selectedRows.map((tactic) => tactic.id);
    const url = `${process.env.REACT_APP_API_BASE_URL}/api/mihp/rendition-request/`
    const body = JSON.stringify({
      tactics: tacticsIds,
      placement_type: 3,
      localization: localizationChecked,
      translation: translationsChecked,
      rendition_description: description,
    })
    const res = await axios.post(url, body, authHeader)
    const data = res?.data 
    data && handleCollabs(data)
  };

  const handleRemoveTactic = (tactic) => {
    const filteredTactics = selectedRows.filter((t) => t !== tactic);
    setSelectedRows(filteredTactics);
  };

  return (
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
      <Grid
        container
        spacing={2}
        //   justifyContent="center"
        style={{ padding: 20, paddingTop: "25px" }}
      >
        <Grid item>
          <Paper sx={{ padding: 2, minHeight: "150px", width: "400px" }}>
            <Typography variant="h6" gutterBottom>
              Selected Tactics
            </Typography>
            {selectedRows.map((tactic) => (
              <Grid container key={tactic.id} alignItems="center" spacing={1}>
                <Grid item xs>
                  <Typography>{tactic.tactName}</Typography>
                </Grid>
                <Grid item>
                  <IconButton
                    onClick={() => handleRemoveTactic(tactic)}
                    size="small"
                  >
                    <CloseIcon />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
          </Paper>
        </Grid>

        <Grid item>
          <Paper sx={{ padding: 2, minHeight: "150px", width: "400px" }}>
            <FormControl component="fieldset">
              <Typography variant="h6" gutterBottom>Select Placements for Rendition</Typography>
              <FormGroup value={placementID} onChange={handleSetPlacementType}>
                {placementData
                  .reduce((unique, item) => {
                    // Check if the unique array already contains an item with this id
                    if (
                      !unique.some(
                        (obj) =>
                          obj.placement_type.id === item.placement_type.id
                      )
                    ) {
                      unique.push(item);
                    }
                    return unique;
                  }, []) 
                  .map((item) => (
                    <FormControlLabel
                    disabled={true}
                      key={item.placement_type.id}
                      value={item.placement_type.id}
                      control={<CheckBox defaultChecked />}
                      label={item.placement_type.placement_type_name}
                    />
                  ))}
                {/* {placementData.map((item) => (
                  <FormControlLabel
                    key={item.placement_type.id} 
                    value={item.placement_type.id} 
                    control={<CheckBox defaultChecked />}
                    label={item.placement_type.placement_type_name} 
                  />
                ))} */}
              </FormGroup>
            </FormControl>
          </Paper>
        </Grid>

        <Grid item>
          <Paper sx={{ padding: 2, width: "800px" }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="h6" gutterBottom>
                  Select Rendition Type
                </Typography>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={localizationChecked}
                      onChange={handleLocalizationChange}
                    />
                  }
                  label="Localization"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={translationsChecked}
                      onChange={handleTranslationsChange}
                    />
                  }
                  label="Translations"
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6" gutterBottom>
                  Rendition Description
                </Typography>
                <TextField
                  label="Description"
                  multiline
                  rows={4}
                  fullWidth
                  margin="normal"
                  value={description}
                  onChange={handleDesc}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
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
          Select Collaborators
        </Button>
      </Grid>
    </div>
  );
}
