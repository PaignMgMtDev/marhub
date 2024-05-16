import React, { useEffect, useState, useCallback } from "react";
import { Button, Stack, Card, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Typography, CircularProgress } from "@mui/material";
import { Link } from '@mui/icons-material';
// import { apiBaseUrl } from "../../api";
import axios from 'axios';
// import Header from "../header/Header";
import "./styles/rendition.scss";

export default function RenditionVersion({ apiBaseUrl, authHeader, selectedVersion, setStep, detailValues, setDetailValues }) {

  const [placementVersion, setPlacementVersion] = useState({});
  const [linkEdit, setLinkEdit] = useState('');
  const [originalDestinationUrl, setOriginalDestinationUrl] = useState('');
  const [dataLoaded, setDataLoaded] = useState(false);
  const [originalValues, setOriginalValues] = useState(null);

  const loadVersion = useCallback(async () => {
    console.log("loading content...")
    if(selectedVersion?.dbVersion){
      console.log("loading content from db...")
      try {
        let response = await axios.get(`${apiBaseUrl}/api/contentframework/placement-version-content/${selectedVersion.versionId}/`, authHeader)
        console.log(`${apiBaseUrl}/api/contentframework/placement-version-content/${selectedVersion.versionId}/`)
        console.log(response.data)
        setPlacementVersion(response.data);
        console.log(response.data)
        setDataLoaded(true);
      } catch (err) {
        console.log(err.message, err.code)
        setDataLoaded(false);
      }
    }
    else{
      console.log("loading content from state...")
      const detailValuesObject = detailValues[selectedVersion.versionId][selectedVersion.versionNumber]
      const reformattedDetailValues = Object.keys(detailValuesObject).map(detailId => ({
        detail_id: parseInt(detailId), // Convert detailId to integer
        detail_name: detailValuesObject[detailId].detail_name,
        detail_type: detailValuesObject[detailId].detail_type,
        img_url: detailValuesObject[detailId].detail_type === "image" ? detailValuesObject[detailId].text : null,
        text: detailValuesObject[detailId].detail_type === "text" ? detailValuesObject[detailId].text : null,
        html_code: detailValuesObject[detailId].detail_type === "html" ? detailValuesObject[detailId].text : null,
        destination_url: detailValuesObject[detailId].destination_url,
      }));
      const reformattedData = { content_details: reformattedDetailValues };
      console.log(reformattedData)
      setPlacementVersion(reformattedData);
      setDataLoaded(true);
    }
  }, [apiBaseUrl, selectedVersion, authHeader, detailValues]);

  const submitRenditionVersion = async () => {
    console.log('submitting rendition...')
    try {
      const tempRequestId = 1;
      console.log(detailValues);
      let response = await axios.post(`${apiBaseUrl}/api/mihp/rendition-version/${selectedVersion.placementVersionId}/${tempRequestId}/`, detailValues, authHeader)
      console.log(response.data)

    } catch (err) {
      console.log(err.message, err.code)
    }
  }

  useEffect(() => {
    if (!dataLoaded) {
      loadVersion();
    }
  }, [dataLoaded, loadVersion]);

  useEffect(() => {
    console.log(selectedVersion)
  }, [selectedVersion]);

  useEffect(() => {
    if (placementVersion.content_details && !detailValues[selectedVersion.versionId]?.[selectedVersion.versionNumber]) {
      const newDetailValues = { ...detailValues };
      const versionId = selectedVersion.versionId;
      const versionNumber = selectedVersion.versionNumber;
      const originalValuesCopy = { ...originalValues };

      if (!newDetailValues[versionId]) {
        newDetailValues[versionId] = {};
      }

      if (!newDetailValues[versionId][versionNumber]) {
        newDetailValues[versionId][versionNumber] = {};
      }

      placementVersion.content_details.forEach(detail => {
        const destinationUrlKey = Object.keys(detail).find(key => key.includes("destination_url"));
        const destinationUrl = destinationUrlKey ? detail[destinationUrlKey] : "";
        const textKey = Object.keys(detail).find(key => {
          return (
            (key.includes("text") || key.includes("img_url") || key.includes("html_code")) &&
            key !== "context"
          );
        });
        const textContent = textKey ? detail[textKey] : "";
        const typeKey = Object.keys(detail).find(key => key.includes("type"));
        const detailType = typeKey ? detail[typeKey] : "";
        const nameKey = Object.keys(detail).find(key => key.includes("detail_name"));
        const detailName = nameKey ? detail[nameKey] : "";

        newDetailValues[versionId][versionNumber][detail.detail_id] = {
          text: textContent,
          destination_url: destinationUrl,
          detail_type: detailType,
          detail_name: detailName,
        };

        // Save original values when component first loads
        if (!originalValuesCopy) {
          originalValuesCopy[detail.detail_id] = {
            text: textContent,
            destination_url: destinationUrl,
            detail_type: detailType,
            detail_name: detailName,
          };
        }
      });

      setDetailValues(newDetailValues);
      if (!originalValues) {
        setOriginalValues(originalValuesCopy);
      }
    }
  }, [placementVersion, setDetailValues, detailValues, selectedVersion.versionId, selectedVersion.versionNumber, originalValues]);

  const handleInputChange = (event, detailId) => {
    const { value } = event.target;
    setDetailValues((prevValues) => {
      const versionId = selectedVersion.versionId;
      const versionNumber = selectedVersion.versionNumber;

      return {
        ...prevValues,
        [versionId]: {
          ...prevValues[versionId],
          [versionNumber]: {
            ...prevValues[versionId]?.[versionNumber],
            [detailId]: {
              ...prevValues[versionId]?.[versionNumber]?.[detailId],
              text: value,
            },
          },
        },
      };
    });
  };

  const handleUrlChange = (event, detailId) => {
    const { value } = event.target;
    setDetailValues((prevValues) => {
      const versionId = selectedVersion.versionId;
      const versionNumber = selectedVersion.versionNumber;

      return {
        ...prevValues,
        [versionId]: {
          ...prevValues[versionId],
          [versionNumber]: {
            ...prevValues[versionId]?.[versionNumber],
            [detailId]: {
              ...prevValues[versionId]?.[versionNumber]?.[detailId],
              destinationUrl: value,
            },
          },
        },
      };
    });
  };

  const resetToOriginalValues = () => {
    if (originalValues) {
      setDetailValues(originalValues);
    }
    setStep(1);
  };

  return (
    <Card className="edit" component="section">
      {!dataLoaded && <CircularProgress />}
      {dataLoaded && (
        <Stack className="edit__display">
          <Typography className="edit__heading">{selectedVersion.versionName}</Typography>
          <Stack className="edit-form" component="form" noValidate autoComplete="off">
            {placementVersion.content_details.map((detail) => {
              const detailId = detail.detail_id;
              const detailValue = detailValues[selectedVersion.versionId]?.[selectedVersion.versionNumber]?.[detailId];
              
              return (
                <Stack className="edit-form__input-row" direction="row" key={detailId}>
                  <TextField
                    className="edit-form__text-input"
                    label={detail.detail_name}
                    value={detailValue?.text || ""}
                    onChange={(event) => handleInputChange(event, detailId)}
                  />
                  {detailValue?.detailType !== "html" && (
                    <Button className="edit-form__link-button" onClick={() => {
                      setLinkEdit(detailId);
                      setOriginalDestinationUrl(detailValue?.destinationUrl || "");
                    }}>
                      <Link className="edit-form__link-icon" />
                    </Button>
                  )}
                  <Dialog
                    className="link-popup"
                    open={linkEdit === detailId}
                    onClose={() => setLinkEdit('')}
                    PaperProps={{ component: 'form' }}
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
                        value={detailValue?.destinationUrl || ""}
                        onChange={(event) => handleUrlChange(event, detailId)}
                      />
                    </DialogContent>
                    <DialogActions className="link-popup__button-row">
                      <Button
                        className="link-popup__button link-popup__button_cancel"
                        onClick={() => {
                          setLinkEdit('');
                          setDetailValues((prevValues) => ({
                            ...prevValues,
                            [selectedVersion.versionId]: {
                              ...prevValues[selectedVersion.versionId],
                              [selectedVersion.versionNumber]: {
                                ...prevValues[selectedVersion.versionId]?.[selectedVersion.versionNumber],
                                [detail.detail_id]: {
                                  ...prevValues[selectedVersion.versionId]?.[selectedVersion.versionNumber]?.[detail.detail_id],
                                  destinationUrl: originalDestinationUrl, // Revert to the original value
                                },
                              },
                            },
                          }));
                        }}
                        color="primary"
                      >
                        Cancel
                      </Button>
                      <Button
                        className="link-popup__button link-popup__button_save"
                        onClick={() => {
                          setLinkEdit('');
                          // Save the changes
                        }}
                        color="primary"
                      >
                        Save
                      </Button>
                    </DialogActions>
                  </Dialog>
                </Stack>
              );
            })}
            <Stack className="edit-form__button-row" direction="row">
              <Button className="edit-form__button edit-form__button_cancel" onClick={() => resetToOriginalValues()}>Cancel</Button>
              <Button className="edit-form__button edit-form__button_confirm" onClick={submitRenditionVersion}>Submit</Button>
            </Stack>
          </Stack>
        </Stack>
      )}
    </Card>
  );
}