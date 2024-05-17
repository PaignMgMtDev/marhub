import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Button, Typography, Box, Stack, Card, CardMedia, List, ListItem, ListItemButton, ListItemText, Dialog, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import { KeyboardBackspace, Close } from '@mui/icons-material';
import { useParams } from "react-router-dom";
import RenditionVersion from "./RenditionVersion";
import LoadingAnim from "./LoadingAnim";
// import { apiBaseUrl } from "../../api";
import axios from 'axios';
// import Header from "../header/Header";
import "./styles/rendition.scss";

export default function Rendition({ auth, renditionRequestID }) {
  const [treatment, setTreatment] = useState({});
  const [selectedModule, setSelectedModule] = useState({});
  const [selectedVersion, setSelectedVersion] = useState(null); // Single object to hold version details
  const [step, setStep] = useState(0);
  // const [tempUpdates, setTempUpdates] = useState(false);
  const [renditionList, setRenditionList] = useState([]);
  const [detailValues, setDetailValues] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const { tactic } = useParams();

  const apiBaseUrl = 'https://campaign-app-api-staging.azurewebsites.net';

  const authHeader = useMemo(() => ({
    headers: {
      Authorization: `Bearer ${auth}`,
      "Content-Type": "application/json",
    },
  }), [auth]);

  const loadTreatment = useCallback(async () => {
    console.log('loading treatment...');
    try {
      let endpoint = `${apiBaseUrl}/api/contentframework/treatment-by-tactic/${tactic}`
      if(renditionRequestID) endpoint = `${apiBaseUrl}/api/contentframework/treatment-by-tactic/${tactic}/${renditionRequestID}`
      let response = await axios.get(endpoint, authHeader);
      console.log(`${apiBaseUrl}/api/contentframework/treatment-by-tactic/${tactic}`);
      console.log(response.data);
      setTreatment(response.data);
      setStep(1);
    } catch (err) {
      console.log(err.message, err.code);
      setStep(-1);
    }
  }, [apiBaseUrl, tactic, authHeader, renditionRequestID]);

  const loadRenditions = useCallback(async () => {
    console.log('loading renditions...')
    try {
      const tempRequestId = 3;
      console.log(selectedModule.placement_version_id)
      let response = await axios.get(`${apiBaseUrl}/api/mihp/rendition-version/${selectedModule.placement_version_id}/${tempRequestId}/`, authHeader)
      console.log(response.data)
      setRenditionList(response.data)
    } catch (err) {
      console.log(err.message, err.code)
    }
  }, [apiBaseUrl, authHeader, selectedModule.placement_version_id]);

  const selectVersion = (versionId, versionName, versionNumber, dbVersion) => {
    setSelectedVersion({ versionId, versionName, versionNumber, dbVersion }); // Update selectedVersion
    setStep(3);
  }

  useEffect(() => {
    if (step === 0) {
      loadTreatment();
    }
  }, [step, tactic, loadTreatment]);

  useEffect(() => {
    if (step === 2) {
      loadRenditions();
    }
  }, [step, selectedModule.placementVersionId, loadRenditions]);

  // useEffect(() => {
  //   if (step === 1) {
  //     setTempUpdates(false);
  //   }
  // }, [step]);

  // useEffect(() => {
  //   console.log(tempUpdates)
  // }, [tempUpdates]);

  // useEffect(() => {
  //   if (step=== 2 && !tempUpdates && Object.keys(detailValues).length > 0) {
  //     const selectedModuleId = selectedModule?.placement_version_id;
  //     const matchingKeys = Object.keys(detailValues).filter(key => key === selectedModuleId.toString());
      
  //     if (matchingKeys.length > 0) {
  //       const topLevelKey = matchingKeys[0]; // Assuming there's only one matching key
  //       const subKeys = Object.keys(detailValues[topLevelKey]);
  
  //       const extendedRenditionVersions = subKeys.map(key => ({
  //         placement_version_name: `${selectedModule.placement_version_name} - Rendition ${key}`,
  //       }));
  
  //       // Update rendition_versions with the extended array
  //       setSelectedModule(prevState => ({
  //         ...prevState,
  //         rendition_versions: prevState.rendition_versions.concat(extendedRenditionVersions),
  //       }));
  //     }
  //     setTempUpdates(true)
  //   }
    
  // }, [selectedModule, detailValues, step, tempUpdates]);

  return (
    <Box className="rendition" component="main">
      <Dialog className="popup" onClose={()=>setDialogOpen(false)} open={dialogOpen}>
        <DialogContent className="popup__content">
          <DialogActions className="popup__actions">
            <Button className="popup__button" onClick={()=>setDialogOpen(false)}>
              <Close className="popup__close-icon" />
            </Button>
          </DialogActions>
            <DialogContentText className="popup__text">
              Please create a rendition to submit.
            </DialogContentText>
          </DialogContent>
      </Dialog>
      {step === 0 &&
        <LoadingAnim />
      }
      {step > 0 && 
        <Box className="rendition__display">
          <Stack className="title-bar" direction="row" component="section">
            <Button className="title-bar__back" onClick={() => { setSelectedModule({}); setStep(1); }}>
              <KeyboardBackspace className="title-bar__back-icon" />
            </Button>
            <Typography className="title-bar__title" variant="h6">{treatment.vehicle_shells[0].vehicle_shell_name}</Typography>
            <Button className="title-bar__submit" variant="text">Submit</Button>
          </Stack>
          {step === 1 &&
            <Card className="treatment" component="section">
              <Stack className="treatment__display">
                {Object.keys(treatment.vehicle_shells[0].module_coordinates).map((coordinate) => {
                  const vehicleShell = treatment.vehicle_shells[0];
                  const module = vehicleShell.module_coordinates[coordinate];
                  return (
                    <Box className="module" key={module.module_id} onClick={() => { setSelectedModule(module); setStep(2); }}>
                      <Typography className="module__name">{module.placement_version_name}</Typography>
                      <CardMedia
                        className="module__image"
                        component="img"
                        image={module.image}
                        alt=""
                      />
                    </Box>
                  );
                })}
              </Stack>
            </Card>
          }
          {step === 2 &&
            <Card className="versions">
              <Typography className="versions__heading">{selectedModule.placement_version_name}</Typography>
              <List className="versions__list">
                {selectedModule.rendition_versions.map((renditionVersion, i) => (
                  <ListItem key={`${selectedModule.placement_version_id}--${i}`} className="versions__item" disablePadding>
                    <ListItemButton onClick={()=>selectVersion((renditionVersion?.placement_version_id || selectedModule?.placement_version_id), renditionVersion?.placement_version_name, i+1, renditionVersion?.placement_version_id)} className="versions__version-button">
                      <ListItemText className="versions__text" primary={renditionVersion?.placement_version_name} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
              <Stack className="versions__button-row" direction="row">
                <Button className="versions__add" variant="text" onClick={()=>selectVersion(selectedModule?.placement_version_id, selectedModule?.placement_version_name, selectedModule.rendition_versions.length+1, selectedModule?.placement_version_id)}>Add Rendition</Button>
              </Stack>
            </Card>
          }
          {step === 3 && <RenditionVersion apiBaseUrl={apiBaseUrl} authHeader={authHeader} selectedVersion={selectedVersion} setStep={setStep} detailValues={detailValues} setDetailValues={setDetailValues} />}
        </Box>
      }
    </Box>
  );
}