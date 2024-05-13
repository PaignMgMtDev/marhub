import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Button, Typography, Box, Stack, CircularProgress, Backdrop, Card, CardMedia, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { KeyboardBackspace, Link } from '@mui/icons-material';
import { useParams } from "react-router-dom";
import RenditionVersion from "./RenditionVersion";
// import { apiBaseUrl } from "../../api";
import axios from 'axios';
// import Header from "../header/Header";
import "./styles/rendition.scss";

export default function Rendition({ auth }) {

  const [dataLoaded, setDataLoaded] = useState('');
  const [treatment, setTreatment] = useState({});
  const [selectedPlacementVersion, setSelectedPlacementVersion] = useState({});
  const [detailValues, setDetailValues] = useState({});
  const [linkEdit, setLinkEdit] = useState('');
  const [originalDestinationUrl, setOriginalDestinationUrl] = useState('');
  const { tactic } = useParams();
  

  const apiBaseUrl = 'https://campaign-app-api-staging.azurewebsites.net';

  const authHeader = useMemo(() => ({
    headers: {
      Authorization: `Bearer ${auth}`,
      "Content-Type": "application/json",
    },
  }), [auth]);

  const submitRendition = async () => {
    console.log('submitting rendition...')
    try {
      let response = await axios.post(`${apiBaseUrl}/api/contentframework/mihp/rendition-request/${tactic}`, authHeader)
      console.log(`${apiBaseUrl}/api/contentframework/mihp/rendition-request/${tactic}`)
      console.log(response.data)
      setTreatment(response.data)
      setDataLoaded('success')
    } catch (err) {
      console.log(err.message, err.code)
      setDataLoaded('error')
    }
  }

  const loadTreatment = useCallback(async () => {
    console.log('loading treatment...')
    try {
      let response = await axios.get(`${apiBaseUrl}/api/contentframework/treatment-by-tactic/${tactic}`, authHeader)
      console.log(`${apiBaseUrl}/api/contentframework/treatment-by-tactic/${tactic}`)
      console.log(response.data)
      setTreatment(response.data)
      setDataLoaded('success')
    } catch (err) {
      console.log(err.message, err.code)
      setDataLoaded('error')
    }
  }, [apiBaseUrl, tactic, authHeader]);

  const handleInputChange = (event, detailId) => {
    const { value } = event.target;
    setDetailValues((prevValues) => {
      const existingDetail = prevValues[detailId];
      if (existingDetail) {
        return {
          ...prevValues,
          [detailId]: {
            ...existingDetail,
            text: value,
          },
        };
      } else {
        return {
          ...prevValues,
          [detailId]: {
            text: value,
            destinationUrl: "",
          },
        };
      }
    });
  };

  const handleUrlChange = (event, detailId) => {
    const { value } = event.target;
    setDetailValues((prevValues) => ({
      ...prevValues,
      [detailId]: {
        ...prevValues[detailId],
        destinationUrl: value,
      },
    }));
  };

  useEffect(() => {
    if (!dataLoaded) {
      loadTreatment()
    }
  }, [dataLoaded, tactic, loadTreatment])

  useEffect(() => {
    if (selectedPlacementVersion.module_id) {
      const newDetailValues = {};
      selectedPlacementVersion.content_details.forEach(detail => {
        const destinationUrlKey = Object.keys(detail).find(key => key.includes("destination_url"));
        const destinationUrl = destinationUrlKey ? detail[destinationUrlKey] : "";
        const textKey = Object.keys(detail).find(key => (key.includes("text") && key !== "context"));
        const textContent = textKey ? detail[textKey] : "";
        newDetailValues[detail.detail_id] = {
          text: textContent,
          destinationUrl: destinationUrl,
        };
      });
      setDetailValues(newDetailValues);
    }
  }, [selectedPlacementVersion]);

  useEffect(() => {
    console.log(detailValues)
  }, [detailValues])


  return (
    <Box className="rendition" component="main">
      {!treatment?.vehicle_shells &&
        <Backdrop className="rendition__backdrop" open={true} >
          <CircularProgress size="40vw" color="primary" className="rendition__loading" />
        </Backdrop>
      }
      {treatment?.vehicle_shells &&
        <Box className="rendition__display">
          <Stack className="title-bar" direction="row" component="section">
            <Button className="title-bar__back" onClick={()=>setSelectedPlacementVersion({})}>
              <KeyboardBackspace className="title-bar__back-icon" />
            </Button>
            <Typography className="title-bar__title" variant="h6">{treatment.vehicle_shells[0].vehicle_shell_name}</Typography>
            <Button className="title-bar__submit" variant="text">Submit</Button>
          </Stack>
          {!selectedPlacementVersion?.module_id &&
            <Card className="treatment" component="section">
              <Stack className="treatment__display">
                {Object.keys(treatment.vehicle_shells[0].module_coordinates).map((coordinate) => {
                  const vehicleShell = treatment.vehicle_shells[0];
                  const module = vehicleShell.module_coordinates[coordinate];

                  return (
                    <Box className="module" key={module.module_id} onClick={() => setSelectedPlacementVersion(module)}>
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
          {selectedPlacementVersion?.module_id &&
            <RenditionVersion authHeader={authHeader} placementVersion={selectedPlacementVersion} apiBaseUrl={apiBaseUrl} />
          }

        </Box>
      }
    </Box>
  );
}