import React, { useEffect, useState, useCallback } from "react";
import { Button, Stack, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Typography, CircularProgress } from "@mui/material";
import { Link } from '@mui/icons-material';
// import { apiBaseUrl } from "../../api";
import axios from 'axios';
// import Header from "../header/Header";
import "./styles/rendition.scss";

export default function RenditionVersion({ renditionRef, apiBaseUrl, authHeader, selectedVersion, renditionList, setStep, detailValues, setDetailValues, renditionRequestId }) {

  const [placementVersion, setPlacementVersion] = useState({});
  const [linkEdit, setLinkEdit] = useState('');
  const [originalDestinationUrl, setOriginalDestinationUrl] = useState('');
  const [dataLoaded, setDataLoaded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [originalValues, setOriginalValues] = useState(null);

  const excludedKeywords = ["imgwidth", "imgheight", "cntblk", "contentstartdate", "contentenddate", "tactic_id", "product", "module", "cblock", "section"];

  const loadVersion = useCallback(async () => {
    try {
      let response = await axios.get(`${apiBaseUrl}/api/contentframework/placement-version-content/${selectedVersion.versionId}/`, authHeader)
      console.log(response.data)
      setPlacementVersion(response.data);
      setDataLoaded(true);
    } catch (err) {
      console.log(err.message, err.code)
      setDataLoaded(false);
    }
  }, [apiBaseUrl, selectedVersion, authHeader]);

  const submitRenditionVersion = async () => {
    setSubmitting(true)
    try {
      // const tempRequestId = 5;

      // Scroll to the top of the .rendition element
      if (renditionRef.current) {
        renditionRef.current.scrollIntoView({ behavior: 'smooth' });
      }

      let response = await axios.post(`${apiBaseUrl}/api/mihp/rendition-version/${selectedVersion.versionId}/${renditionRequestId}/`, detailValues, authHeader)
      console.log(response.data)
      setStep(2)
      setSubmitting(false)
    } catch (err) {
      console.log(err.message, err.code)
      setSubmitting(false)
    }
  }

  useEffect(() => {
    if (!dataLoaded) {
      loadVersion();
    }
  }, [dataLoaded, loadVersion]);

  useEffect(() => {
    if (placementVersion.content_details && !detailValues[selectedVersion.versionId]?.[selectedVersion.versionNumber]) {
      const newDetailValues = {};
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
          clickable: detail.clickable,
        };

        // Save original values when component first loads
        if (!originalValuesCopy) {
          originalValuesCopy[detail.detail_id] = {
            text: textContent,
            destination_url: destinationUrl,
            detail_type: detailType,
            detail_name: detailName,
            clickable: detail.clickable,
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
    setStep(2);
    
    // Scroll to the top of the .rendition element
    if (renditionRef.current) {
      renditionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {submitting && <Typography className="edit__uploading">Uploading rendition...</Typography>}
      {(!dataLoaded || submitting) && <CircularProgress />}
      {(dataLoaded && !submitting) && (
        <Stack className="edit__display">
          <Typography className="edit__heading">{selectedVersion.versionName}</Typography>
          <Typography className="edit__subheading">{selectedVersion.versionNumber > renditionList.length ? `Create Rendition ${selectedVersion.versionNumber}` : `Edit Rendition ${selectedVersion.versionNumber}`}</Typography>
          <Stack className="edit-form" component="form" noValidate autoComplete="off">
            {placementVersion.content_details.map((detail) => {
              const detailId = detail.detail_id;
              const detailValue = detailValues[selectedVersion.versionId]?.[selectedVersion.versionNumber]?.[detailId];

              if (detailValue?.text && !excludedKeywords.some(keyword => detailValue?.detail_name?.toLowerCase().includes(keyword))) {
                return (
                  <Stack className="edit-form__input-row" direction="row" key={detailId}>
                    <TextField
                      className="edit-form__text-input"
                      label={detail.detail_name}
                      value={detailValue?.text || ""}
                      onChange={(event) => handleInputChange(event, detailId)}
                    />
                    {detailValue.clickable && (
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
              }
              else return null;
              
            })}
            <Stack className="edit-form__button-row" direction="row">
              <Button className="edit-form__button edit-form__button_cancel" onClick={resetToOriginalValues}>Cancel</Button>
              <Button className="edit-form__button edit-form__button_confirm" onClick={submitRenditionVersion}>Submit</Button>
            </Stack>
          </Stack>
        </Stack>
      )}
    </>
  );
}