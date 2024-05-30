import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { CircularProgress, Button, Typography, Box, Stack, Card, CardMedia, List, ListItem, ListItemButton, ListItemText, Dialog, DialogContent, DialogContentText, DialogActions, useMediaQuery } from "@mui/material";
import { KeyboardBackspace, Close } from '@mui/icons-material';
import { useParams, useNavigate } from "react-router-dom";
import RenditionVersion from "./RenditionVersion";
import LoadingAnim from "./LoadingAnim";
import { apiBaseUrl } from "../../api";
import axios from 'axios';
import "./styles/rendition.scss";
import marriottLogo from './img/mi_button_logo.png'

export default function Rendition({ auth, renditionRequestID }) {
  const [treatment, setTreatment] = useState(null);
  const [selectedModule, setSelectedModule] = useState({});
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [step, setStep] = useState(0);
  const [renditionList, setRenditionList] = useState([]);
  const [detailValues, setDetailValues] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [highlightedModule, setHighlightedModule] = useState('');
  const [groupedModules, setGroupedModules] = useState({});
  const [renditionsLoaded, setRenditionsLoaded] = useState(false);
  const [detailsLoaded, setDetailsLoaded] = useState(false);
  const { tactic } = useParams();
  const isWideScreen = useMediaQuery('(min-width:1200px)');

  const navigate = useNavigate();
  renditionRequestID = 5;

  const renditionRef = useRef(null);

  const authHeader = useMemo(() => ({
    headers: {
      Authorization: `Bearer ${auth}`,
      "Content-Type": "application/json",
    },
  }), [auth]);

  const loadTreatment = useCallback(async () => {
    try {
      let endpoint = `${apiBaseUrl}/api/contentframework/treatment-by-tactic/${tactic}`;
      if (renditionRequestID) endpoint = `${apiBaseUrl}/api/contentframework/treatment-by-tactic/${tactic}/${renditionRequestID}`;
      let response = await axios.get(endpoint, authHeader);
      console.log(response.data);
      setTreatment(response.data);
      setStep(1);
    } catch (err) {
      console.log(err.message, err.code);
      setStep(-1);
    }
  }, [tactic, authHeader, renditionRequestID]);

  const loadRenditions = useCallback(async (placement_version_id) => {
    try {
      let response = await axios.get(`${apiBaseUrl}/api/mihp/rendition-version/${placement_version_id}/${renditionRequestID}/`, authHeader);
      console.log('Renditions loaded:', response.data);
      setRenditionList(response.data);
      setRenditionsLoaded(true);
      setStep(2);
    } catch (err) {
      console.log(err.message, err.code);
    }
  }, [authHeader, renditionRequestID]);

  const selectVersion = (versionId, versionName, versionNumber, originalVersion) => {
    setSelectedVersion({ versionId, versionName, versionNumber, originalVersion });
    setStep(3);
    setDetailsLoaded(false);
  };

  useEffect(() => {
    if (step === 0) {
      loadTreatment();
    }
  }, [step, tactic, loadTreatment]);

  useEffect(() => {
    console.log(detailValues);
  }, [detailValues]);

  useEffect(() => {
    console.log(selectedVersion);
  }, [selectedVersion]);

  const selectModule = (module) => {
    setSelectedModule(module);
    loadRenditions(module.placement_version_id);
  };

  // Group modules by their row value
  const groupModulesByRow = (modules) => {
    const moduleEntries = Object.entries(modules).map(([key, value]) => {
      const [row, column] = key.split('-').map(Number);
      return { row, column, module: value };
    });

    moduleEntries.sort((a, b) => a.row - b.row || a.column - b.column);

    return moduleEntries.reduce((acc, { row, module }) => {
      if (!acc[row]) acc[row] = [];
      acc[row].push(module);
      return acc;
    }, {});
  };

  const navigateBack = () => {
    setSelectedModule({});
    setStep(1);
    const url = `/rendition-request/${renditionRequestID}`;
    navigate(url);
  };

  useEffect(() => {
    if (treatment) {
      const grouped = groupModulesByRow(treatment.vehicle_shells[0].module_coordinates);
      setGroupedModules(grouped);
    }
  }, [treatment]);

  useEffect(() => {
    if (Object.keys(detailValues).length > 0) {
      for (const placementVersionId in detailValues) {
        const elements = document.querySelectorAll(`.versions__preview`);
  
        elements.forEach((element) => {
          const values = detailValues[placementVersionId][selectedVersion.versionNumber];
  
          for (const detailId in values) {
            const detailValue = values[detailId];
            let textElement = null;
  
            // Convert detail_name to lower case for consistent matching
            const detailNameLower = detailValue.detail_name.toLowerCase();
  
            // Dynamically select the element based on detail_name
            if (detailNameLower.includes("headline") || detailNameLower.includes("bodytxt")) {
              textElement = element.querySelector(`.${detailValue.detail_name}`);
            } else {
              textElement = element.querySelector(`.${detailValue.detail_name}`);
            }
  
            // Update the element content if the textElement is found
            if (textElement) {
              textElement.textContent = detailValue.text;
            }
          }
        });
      }
    }
  }, [detailValues, selectedVersion]);

  if (!treatment) {
    return <LoadingAnim />;
  }

  return (
    <Box ref={renditionRef} className="rendition" component="main">
      <Dialog className="popup" onClose={() => setDialogOpen(false)} open={dialogOpen}>
        <DialogContent className="popup__content">
          <DialogActions className="popup__actions">
            <Button className="popup__button" onClick={() => setDialogOpen(false)}>
              <Close className="popup__close-icon" />
            </Button>
          </DialogActions>
          <DialogContentText className="popup__text">
            Please create a rendition to submit.
          </DialogContentText>
        </DialogContent>
      </Dialog>
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
            <Stack direction="row" className="title-bar">
              <Button className="title-bar__back" onClick={navigateBack}>
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
                    {Object.keys(groupedModules).map((row, rowIndex) => (
                      <Stack className="treatment__module-row" key={`row-${rowIndex}`} direction="row" spacing={2}>
                        {groupedModules[row].map((module, i) => {
                          const moduleClass = `module module_${module.placement_version_id}`

                          return (
                            <Box className={moduleClass} key={`${row}-${i}`} onMouseEnter={() => setHighlightedModule(module.placement_version_id)} onMouseLeave={() => setHighlightedModule('')} onClick={() => selectModule(module)}>
                              {(module.placement_version_id !== selectedModule.placement_version_id && isWideScreen && highlightedModule !== '' && module.placement_version_id !== highlightedModule) && <Box className="module__dimmer"></Box>}
                              <Typography className="module__name">{module.placement_version_name}</Typography>
                              {module.render_entity ? (
                                <Box className="module__html" dangerouslySetInnerHTML={{ __html: module.render_entity }} />
                              ) : (
                                <CardMedia
                                  className="module__image"
                                  component="img"
                                  height={'100px'}
                                  image={module.image}
                                  alt=""
                                />
                              )}
                            </Box>
                          )
                        })}
                      </Stack>
                    ))}
                  </Stack>
                </Card>
              }
              {(step === 2 || (isWideScreen && step > 1)) &&
                <Card className="versions">
                  {!renditionsLoaded && <CircularProgress />}
                  {renditionsLoaded &&
                    <>
                      <Typography className="versions__heading">{selectedModule.placement_version_name}</Typography>
                      {selectedModule.render_entity ? (
                        <Box className="versions__preview versions__preview_html" dangerouslySetInnerHTML={{ __html: selectedModule.render_entity }} />
                      ) : (
                        <CardMedia
                          className="versions__preview versions__preview_image"
                          component="img"
                          height={'100px'}
                          image={selectedModule.image}
                          alt=""
                        />
                      )}
                      <List className="versions__list">
                        {renditionList.map((renditionVersion, i) => {
                          const itemClass = selectedVersion === i + 1 ? "versions__item versions__item_selected" : "versions__item";

                          return (
                            <ListItem key={`${selectedModule.placement_version_id}--${i}`} className={itemClass} disablePadding>
                              <ListItemButton onClick={() => selectVersion(renditionVersion?.id, renditionVersion?.name, i + 1, selectedModule?.placement_version_id)} className="versions__version-button">
                                <ListItemText className="versions__text" primary={renditionVersion?.name} />
                              </ListItemButton>
                            </ListItem>
                          );
                        })}
                      </List>
                      <Stack className="versions__button-row" direction="row">
                        <Button className="versions__add" variant="text" onClick={() => setStep(1)}>Unselect</Button>
                        <Button className="versions__add" variant="text" onClick={() => selectVersion(selectedModule?.placement_version_id, selectedModule?.placement_version_name, renditionList.length + 1, selectedModule?.placement_version_id)}>Add Rendition</Button>
                      </Stack>                     
                    </>
                  }
                </Card>
              }
              {step === 3 &&
                <Card className="edit" component="section">
                  <RenditionVersion renditionRef={renditionRef} apiBaseUrl={apiBaseUrl} authHeader={authHeader} selectedVersion={selectedVersion} renditionList={renditionList} setStep={setStep} detailValues={detailValues} setDetailValues={setDetailValues} renditionRequestId={renditionRequestID} loadRenditions={loadRenditions} detailsLoaded={detailsLoaded} setDetailsLoaded={setDetailsLoaded}/>
                </Card>
              }
            </Box>
          </Card>
        </Box>
      }
    </Box>
  );
}