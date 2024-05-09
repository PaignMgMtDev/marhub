import React, { useEffect, useState } from "react";
import { Button, Typography, Box, Stack, CircularProgress, Backdrop, Card, CardMedia, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { KeyboardBackspace, Link } from '@mui/icons-material';
import { useParams } from "react-router-dom";
// import { apiBaseUrl } from "../../api";
import axios from 'axios';
import Header from "../header/Header";
import "./styles/rendition.scss";

export default function Rendition({ auth }) {

  const [dataLoaded, setDataLoaded] = useState('');
  const [rendition, setRendition] = useState({});
  const [selectedModule, setSelectedModule] = useState({});
  const [detailValues, setDetailValues] = useState({});
  const [linkEdit, setLinkEdit] = useState('');
  const [originalDestinationUrl, setOriginalDestinationUrl] = useState('');
  const { tactic } = useParams();
  

  const apiBaseUrl = 'https://campaign-app-api-staging.azurewebsites.net';

  const authHeader = {
    headers: {
      Authorization: `Bearer ${auth}`,
      "Content-Type": "application/json",
    },
  };

  const loadRendition = async () => {
    console.log('loading rendition...')
    try {
      let response = await axios.get(`${apiBaseUrl}/api/contentframework/mihp/rendition-request/${tactic}`, authHeader)
      console.log(`${apiBaseUrl}/api/contentframework/mihp/rendition-request/${tactic}`)
      console.log(response.data)
      setRendition(response.data)
      setDataLoaded('success')
    } catch (err) {
      console.log(err.message, err.code)
      setDataLoaded('error')
    }
  };

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
      loadRendition()
    }
  }, [dataLoaded, tactic])

  useEffect(() => {
    if (selectedModule.module_id) {
      const newDetailValues = {};
      selectedModule.content_details.forEach(detail => {
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
  }, [selectedModule]);

  useEffect(() => {
    console.log(detailValues)
  }, [detailValues])


  return (
    <Box className="rendition" component="main">
      {!rendition?.vehicle_shells &&
        <Backdrop className="rendition__backdrop" open={true} >
          <CircularProgress size="40vw" color="primary" className="rendition__loading" />
        </Backdrop>
      }
      {rendition?.vehicle_shells &&
        <Box className="rendition__display">
          <Stack className="title-bar" direction="row" component="section">
            <Button className="title-bar__back" onClick={()=>setSelectedModule({})}>
              <KeyboardBackspace className="title-bar__back-icon" />
            </Button>
            <Typography className="title-bar__title" variant="h6">{rendition.vehicle_shells[0].vehicle_shell_name}</Typography>
            <Button className="title-bar__submit" variant="text">Submit</Button>
          </Stack>
          {!selectedModule?.module_id &&
            <Card className="treatment" component="section">
              <Stack className="treatment__display">
                {Object.keys(rendition.vehicle_shells[0].module_coordinates).map((coordinate) => {
                  const vehicleShell = rendition.vehicle_shells[0];
                  const module = vehicleShell.module_coordinates[coordinate];

                  return (
                    <Box className="module" key={module.module_id} onClick={() => setSelectedModule(module)}>
                      <Typography className="module__name">{module.name}</Typography>
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
          {selectedModule?.module_id &&
            <Card className="edit" component="section">
              <Stack className="edit__display">
                <CardMedia
                  className="module__image"
                  component="img"
                  image={selectedModule.image}
                  alt=""
                />
              </Stack>
              <Stack className="edit-form" component="form" noValidate autoComplete="off">
                {selectedModule.content_details.map((detail) => {

                  return(
                    <Stack className="edit-form__input-row" direction="row" key={detail.detail_id}>
                      <TextField
                        className="edit-form__text-input"
                        label={detail.detail_name}
                        value={detailValues[detail.detail_id]?.text || ""}
                        onChange={(event) => handleInputChange(event, detail.detail_id)}
                      />
                      <Button className="edit-form__link-button" onClick={()=>{setLinkEdit(detail.detail_id);setOriginalDestinationUrl(detailValues[detail.detail_id].destinationUrl)}}>
                        <Link className="edit-form__link-icon" />
                      </Button>
                      <Dialog
                        className="link-popup"
                        open={linkEdit === detail.detail_id}
                        onClose={()=>setLinkEdit('')}
                        PaperProps={{
                          component: 'form',
                        }}
                      >
                        <DialogTitle className="link-popup__title">{detail.detail_name} Destination URL</DialogTitle>
                        <DialogContent className="link-popup__content">
                          <TextField
                            className="link-popup__input"
                            autoFocus
                            required
                            margin="dense"
                            id="destination-url"
                            name="destination-url"
                            label="Destination URL"
                            fullWidth
                            variant="standard"
                            value={detailValues[detail.detail_id]?.destinationUrl || ""}
                            onChange={(event) => handleUrlChange(event, detail.detail_id)}
                          />
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={()=> {
                            setLinkEdit('');
                            setDetailValues((prevValues) => ({
                              ...prevValues,
                              [detail.detail_id]: {
                                ...prevValues[detail.detail_id],
                                destinationUrl: originalDestinationUrl, // Revert to the original value
                              },
                            }));
                          }} color="primary">
                            Cancel
                          </Button>
                          <Button onClick={() => {
                            setLinkEdit('');
                            // Save the changes
                          }} color="primary">
                            Save
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </Stack>
                  );
                })}
              </Stack>
            </Card>
          }

        </Box>
      }
    </Box>
  );
}