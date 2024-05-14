import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Button, Typography, Box, Stack, Card, CardMedia, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { KeyboardBackspace } from '@mui/icons-material';
import { useParams } from "react-router-dom";
import RenditionVersion from "./RenditionVersion";
import LoadingAnim from "./LoadingAnim";
// import { apiBaseUrl } from "../../api";
import axios from 'axios';
// import Header from "../header/Header";
import "./styles/rendition.scss";

export default function Rendition({ auth, requestId }) {
  const [treatment, setTreatment] = useState({});
  const [selectedModule, setSelectedModule] = useState({});
  const [selectedVersion, setSelectedVersion] = useState(null); // Single object to hold version details
  const [step, setStep] = useState(0);
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
      let response = await axios.get(`${apiBaseUrl}/api/contentframework/treatment-by-tactic/${tactic}`, authHeader);
      console.log(`${apiBaseUrl}/api/contentframework/treatment-by-tactic/${tactic}`);
      console.log(response.data);
      setTreatment(response.data);
      setStep(1);
    } catch (err) {
      console.log(err.message, err.code);
      setStep(-1);
    }
  }, [apiBaseUrl, tactic, authHeader]);

  const selectVersion = (versionId, versionName, versionNumber) => {
    setSelectedVersion({ versionId, versionName, versionNumber }); // Update selectedVersion
    setStep(3);
  }

  useEffect(() => {
    if (step === 0) {
      loadTreatment();
    }
  }, [step, tactic, loadTreatment]);

  useEffect(() => {
    console.log(step)
  }, [step]);

  return (
    <Box className="rendition" component="main">
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
                  <ListItem key={renditionVersion.placement_version_id} className="versions__item" disablePadding>
                    <ListItemButton onClick={()=>selectVersion(renditionVersion?.placement_version_id, renditionVersion?.placement_version_name, i+1)} className="versions__version-button">
                      <ListItemText className="versions__text" primary={renditionVersion?.placement_version_name} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
              <Stack className="versions__button-row" direction="row">
                <Button className="versions__add" variant="text" onClick={()=>selectVersion(selectedModule?.placement_version_id, selectedModule?.placement_version_name, 1)}>Add Rendition</Button>
              </Stack>
            </Card>
          }
          {step === 3 && <RenditionVersion apiBaseUrl={apiBaseUrl} authHeader={authHeader} selectedVersion={selectedVersion} />}
        </Box>
      }
    </Box>
  );
}