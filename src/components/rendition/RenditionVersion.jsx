import React, { useEffect, useState, useCallback } from "react";
import { Button, Typography, Box, Stack, CircularProgress, Backdrop, Card, CardMedia, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { KeyboardBackspace, Link } from '@mui/icons-material';
// import { apiBaseUrl } from "../../api";
import axios from 'axios';
// import Header from "../header/Header";
import "./styles/rendition.scss";

export default function RenditionVersion({ placementVersion, authHeader, apiBaseUrl }) {

  const [dataLoaded, setDataLoaded] = useState('');
  const [detailValues, setDetailValues] = useState({});
  const [linkEdit, setLinkEdit] = useState('');
  const [originalDestinationUrl, setOriginalDestinationUrl] = useState('');

  const submitRendition = async () => {
    console.log('submitting rendition...')
    try {
      // let response = await axios.post(`${apiBaseUrl}/api/contentframework/mihp/rendition-request/${tactic}`, authHeader)
      // console.log(`${apiBaseUrl}/api/contentframework/mihp/rendition-request/${tactic}`)
      // console.log(response.data)
      // setTreatment(response.data)
      setDataLoaded('success')
    } catch (err) {
      console.log(err.message, err.code)
      setDataLoaded('error')
    }
  }

  const loadVersion = useCallback(async () => {
    console.log('loading treatment...')
    try {
      // let response = await axios.get(`${apiBaseUrl}/api/contentframework/treatment-by-tactic/${tactic}`, authHeader)
      // console.log(`${apiBaseUrl}/api/contentframework/treatment-by-tactic/${tactic}`)
      // console.log(response.data)
      setDataLoaded('success')
    } catch (err) {
      console.log(err.message, err.code)
      setDataLoaded('error')
    }
  }, [apiBaseUrl, placementVersion, authHeader]);

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
      loadVersion()
    }
  }, [dataLoaded, loadVersion])

  useEffect(() => {
    if (placementVersion.content_details) {
      const newDetailValues = {};
      placementVersion.content_details.forEach(detail => {
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
  }, [placementVersion]);

  useEffect(() => {
    console.log(detailValues)
  }, [detailValues])


  return (
    <Card className="edit" component="section">
      <Stack className="edit__display">
        <CardMedia
          className="module__image"
          component="img"
          image={placementVersion.image}
          alt=""
        />
      </Stack>
      <Stack className="edit-form" component="form" noValidate autoComplete="off">
        {placementVersion.content_details.map((detail) => {
          
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
                <DialogActions className="link-popup__button-row">
                  <Button 
                    className="link-popup__button link-popup__button_cancel"
                    onClick={()=> {
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
                  <Button
                    className="link-popup__button link-popup__button_save"
                    onClick={() => {
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
        <Stack className="edit-form__button-row" direction="row">
          <Button className="edit-form__button edit-form__button_cancel">Cancel</Button>
          <Button className="edit-form__button edit-form__button_confirm" onClick={submitRendition}>Confirm</Button>
        </Stack>
      </Stack>
    </Card>
  );
}