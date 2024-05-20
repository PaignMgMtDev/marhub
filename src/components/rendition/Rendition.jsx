import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Button, Typography, Box, Stack, Card, CardMedia, List, ListItem, ListItemButton, ListItemText, Dialog, DialogContent, DialogContentText, DialogActions, useMediaQuery } from "@mui/material";
import { KeyboardBackspace, Close } from '@mui/icons-material';
import { useParams } from "react-router-dom";
import RenditionVersion from "./RenditionVersion";
import LoadingAnim from "./LoadingAnim";
// import { apiBaseUrl } from "../../api";
import axios from 'axios';
import "./styles/rendition.scss";
import marriottLogo from './img/mi_button_logo.png'

export default function Rendition({ auth, renditionRequestID }) {
  const [treatment, setTreatment] = useState({});
  const [selectedModule, setSelectedModule] = useState({});
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [step, setStep] = useState(0);
  const [renditionList, setRenditionList] = useState([]);
  const [detailValues, setDetailValues] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [highlightedModule, setHighlightedModule] = useState('');
  const { tactic } = useParams();
  const isWideScreen = useMediaQuery('(min-width:1200px)');

  const apiBaseUrl = 'https://campaign-app-api-staging.azurewebsites.net';

  const authHeader = useMemo(() => ({
    headers: {
      Authorization: `Bearer ${auth}`,
      "Content-Type": "application/json",
    },
  }), [auth]);

  const loadTreatment = useCallback(async () => {
    try {
      let endpoint = `${apiBaseUrl}/api/contentframework/treatment-by-tactic/${tactic}`
      if(renditionRequestID) endpoint = `${apiBaseUrl}/api/contentframework/treatment-by-tactic/${tactic}/${renditionRequestID}`
      let response = await axios.get(endpoint, authHeader);
      console.log(response.data)
      setTreatment(response.data);
      setStep(1);
    } catch (err) {
      console.log(err.message, err.code);
      setStep(-1);
    }
  }, [apiBaseUrl, tactic, authHeader, renditionRequestID]);

  useEffect(() => {
    console.log(selectedVersion)
  }, [selectedVersion]);

  const loadRenditions = useCallback(async () => {
    try {
      // const tempRequestId = 5;
      let response = await axios.get(`${apiBaseUrl}/api/mihp/rendition-version/${selectedModule.placement_version_id}/${renditionRequestID}/`, authHeader)
      setRenditionList(response.data)
    } catch (err) {
      console.log(err.message, err.code)
    }
  }, [apiBaseUrl, authHeader, selectedModule.placement_version_id, renditionRequestID]);

  const selectVersion = (versionId, versionName, versionNumber, originalVersion) => {
    setSelectedVersion({ versionId, versionName, versionNumber, originalVersion }); // Update selectedVersion
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

  const selectModule = (module) => {
    setSelectedModule(module);
    setStep(2);
  };

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
          <Card className="sidebar" component="section">
            <CardMedia
                className="sidebar__logo"
                component="img"
                height={'50px'}
                image={marriottLogo}
                alt="marriott logo"
            />
          </Card>
          <Card className="main-display" component="section">
            <Stack direction="row" className="title-bar" >
              <Button className="title-bar__back" onClick={() => { setSelectedModule({}); setStep(1); }}>
                <KeyboardBackspace className="title-bar__back-icon" />
              </Button>
              <Typography className="title-bar__title" variant="h6">{treatment.vehicle_shells[0].tactic_name}</Typography>
              <Button className="title-bar__submit" variant="text">Request Proof</Button>
            </Stack>
            <Box className="main-display__panels">
              {(isWideScreen || step === 1) &&
                <Card className="treatment" component="section">
                  <Stack className="treatment__display">
                    <Typography className="treatment__name" variant="h6">{treatment.vehicle_shells[0].vehicle_shell_name}</Typography>
                    {Object.keys(treatment.vehicle_shells[0].module_coordinates).map((coordinate) => {
                      const vehicleShell = treatment.vehicle_shells[0];
                      const module = vehicleShell.module_coordinates[coordinate];
              
                      return (
                        <Box className="module" key={module.module_id} onMouseEnter={()=>setHighlightedModule(module.module_id)} onMouseLeave={()=>setHighlightedModule('')} onClick={(event) => selectModule(module)}>
                          {(module.module_id !== selectedModule.module_id && isWideScreen && highlightedModule !== '' && module.module_id !== highlightedModule) && <Box className="module__dimmer"></Box>}
                          <Typography className="module__name">{module.placement_version_name}</Typography>
                          {module.placement_type_id === 2?
                          <CardMedia
                            className="module__image"
                            component="img"
                            height={'100px'}
                            image={module.image}
                            alt=""
                          />
                          :
                          <CardMedia
                            className="module__image"
                            component="img"
                            image={module.image}
                            alt=""
                          />
                          }
                        </Box>
                      );
                    })}
                  </Stack>
                </Card>
              }
              {(step === 2 || (isWideScreen && step > 1)) &&
                <Card className="versions">
                  <Typography className="versions__heading">{selectedModule.placement_version_name}</Typography>
                  <List className="versions__list">
                    {renditionList.map((renditionVersion, i) => {
                      const itemClass = selectedVersion === i+1 ? "versions__item versions__item_selected" : "versions__item"

                      return(
                        <ListItem key={`${selectedModule.placement_version_id}--${i}`} className={itemClass} disablePadding>
                          <ListItemButton onClick={()=>selectVersion(renditionVersion?.id, renditionVersion?.name, i+1, selectedModule?.placement_version_id)} className="versions__version-button">
                            <ListItemText className="versions__text" primary={renditionVersion?.name} />
                          </ListItemButton>
                        </ListItem>
                      )
                    })}
                  </List>
                  <Stack className="versions__button-row" direction="row">
                    <Button className="versions__add" variant="text" onClick={()=>selectVersion(selectedModule?.placement_version_id, selectedModule?.placement_version_name, renditionList.length+1, selectedModule?.placement_version_id)}>Add Rendition</Button>
                  </Stack>
                </Card>
              }
              {step === 3 && 
                <Card className="edit" component="section">
                  <RenditionVersion apiBaseUrl={apiBaseUrl} authHeader={authHeader} selectedVersion={selectedVersion} renditionList={renditionList} setStep={setStep} detailValues={detailValues} setDetailValues={setDetailValues} renditionRequestId={renditionRequestID} />
                </Card>
              }
            </Box>
            
          </Card>
          
        </Box>
      }
    </Box>
  );
}