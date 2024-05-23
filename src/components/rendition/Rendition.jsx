import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { Button, Typography, Box, Stack, Card, CardMedia, List, ListItem, ListItemButton, ListItemText, Dialog, DialogContent, DialogContentText, DialogActions, useMediaQuery } from "@mui/material";
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

  const loadRenditions = useCallback(async () => {
    try {
      let response = await axios.get(`${apiBaseUrl}/api/mihp/rendition-version/${selectedModule.placement_version_id}/${renditionRequestID}/`, authHeader);
      setRenditionList(response.data);
    } catch (err) {
      console.log(err.message, err.code);
    }
  }, [authHeader, selectedModule.placement_version_id, renditionRequestID]);

  const selectVersion = (versionId, versionName, versionNumber, originalVersion) => {
    setSelectedVersion({ versionId, versionName, versionNumber, originalVersion });
    setStep(3);
  };

  useEffect(() => {
    if (step === 0) {
      loadTreatment();
    }
  }, [step, tactic, loadTreatment]);

  useEffect(() => {
    if (step === 2) {
      loadRenditions();
    }
  }, [step, selectedModule.placement_version_id, loadRenditions]);

  useEffect(() => {
    console.log(detailValues)
  }, [detailValues]);

  const selectModule = (module) => {
    setSelectedModule(module);
    setStep(2);

    // Scroll to the top of the .rendition element
    if (renditionRef.current) {
      renditionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Group modules by their row value
  const groupModulesByRow = (modules) => {
    return Object.values(modules).reduce((acc, module) => {
      const row = module.module_id.toString().split('-')[0];
      if (!acc[row]) {
        acc[row] = [];
      }
      acc[row].push(module);
      return acc;
    }, {});
  };

  const navigateBack = () => {
    setSelectedModule({}); 
    setStep(1);
    const url = `/rendition-request/${renditionRequestID}`;
    navigate(url);
  }

  const groupedModules = treatment ? groupModulesByRow(treatment.vehicle_shells[0].module_coordinates) : {};

  useEffect(() => {
    // Check if detailValues is not empty
    if (Object.keys(detailValues).length > 0) {
      // Iterate over the top-level keys of detailValues
      for (const placementVersionId in detailValues) {
        // Find the DOM elements with class names corresponding to the placement version id
        const elements = document.querySelectorAll(`.module.module_${placementVersionId}`);

        // Iterate over the found elements
        elements.forEach((element) => {
          // Get the detail values for the current placement version id
          const values = detailValues[placementVersionId][selectedVersion.versionNumber];

          // Iterate over the detail values
          for (const detailId in values) {
            // Get the detail value
            const detailValue = values[detailId];
            let textElement = null;

            // Update the element content based on detail name
            switch (detailValue.detail_name) {
              case 'MODULE':
              case 'CBLOCK':
              case 'SECTION':
              case 'HEADLINE1':
                // Find and log the child element within the current element
                textElement = element.querySelector(`.HEADLINE1`);
                textElement.textContent = detailValue.text
                break;
              case 'BODYTXT1':
                // Find and log the child element within the current element
                textElement = element.querySelector(`.BODYTXT1`);
                textElement.textContent = detailValue.text
                break;
              case 'BODYTXT2':
              case 'BODYTXT2LINKNAME':
              case 'BODYTXT2LINKID':
              case 'BODYTXT3':
              case 'CTATXT':
              case 'CNTBLKHEADLINELINKNAME':
              case 'CNTBLKCTALINKNAME':
              case 'CNTBLKIMGLINKNAME':
              case 'CNTBLKLINKID':
              case 'IMGURL':
              case 'PRODUCT':
              case 'TACTIC_ID':
                // Update the text content of the element
                // element.textContent = detailValue.text;
                break;
              // Add cases for other detail names if needed
              default:
                // Handle default case (if any)
                break;
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
                    {Object.keys(groupedModules).map((row) => (
                      <Stack direction="row" className="treatment__module-row" key={row}>
                        {groupedModules[row].map((module, i) => {
                          const moduleClass = `module module_${module.placement_version_id}`

                          return (
                            <Box className={moduleClass} key={`${module.module_id}--${i}`} onMouseEnter={() => setHighlightedModule(module.placement_version_id)} onMouseLeave={() => setHighlightedModule('')} onClick={() => selectModule(module)}>
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
                  <Typography className="versions__heading">{selectedModule.placement_version_name}</Typography>
                  <CardMedia
                    className="module__image"
                    component="img"
                    height={'100px'}
                    image={selectedModule.image}
                    alt=""
                  />
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
                </Card>
              }
              {step === 3 &&
                <Card className="edit" component="section">
                  <RenditionVersion renditionRef={renditionRef} apiBaseUrl={apiBaseUrl} authHeader={authHeader} selectedVersion={selectedVersion} renditionList={renditionList} setStep={setStep} detailValues={detailValues} setDetailValues={setDetailValues} renditionRequestId={renditionRequestID} />
                </Card>
              }
            </Box>
          </Card>
        </Box>
      }
    </Box>
  );
}