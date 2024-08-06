import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Button, Stack, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Typography, CircularProgress } from "@mui/material";
import { Link } from '@mui/icons-material';
import axios from 'axios';
import "./styles/rendition.scss";

export default function RenditionVersion({
  renditionRef,
  apiBaseUrl,
  authHeader,
  selectedVersion,
  renditionList,
  setStep,
  detailValues,
  setDetailValues,
  renditionRequestId,
  loadRenditions,
  detailsLoaded,
  setDetailsLoaded,
  placementVersionList,
  setPlacementVersionList,
  originalVersion,
  setLastProofedTreatment
}) {
  const [placementVersion, setPlacementVersion] = useState({content_details: []});
  const [linkEdit, setLinkEdit] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [originalValues, setOriginalValues] = useState(null);
  const [filteredPlacementVersions, setFilteredPlacementVersions] = useState([]);
  const [openProofDialog, setOpenProofDialog] = useState(false);
  const [cntblkdesturl, setCntblkdesturl] = useState("");

  const excludedKeywords = useMemo(() => [
    "imgwidth", "imgheight", "contentstartdate", "contentenddate", 
    "tactic_id", "product", "module", "section", "cntblkdesturl",
    "linkid", "linkname", "logoimg", "terms", "cblock"
  ], []);

  const updateDetailValues = useCallback((contentDetails) => {
    const newDetailValues = {};
    const versionId = selectedVersion.versionId;
    const versionNumber = selectedVersion.versionNumber;
    const originalValuesCopy = { ...originalValues };

    if (!newDetailValues[versionId]) newDetailValues[versionId] = {};
    if (!newDetailValues[versionId][versionNumber]) newDetailValues[versionId][versionNumber] = {};

    contentDetails.forEach((detail) => {
      const destinationUrlKey = Object.keys(detail).find(key => key.includes("destination_url"));
      const destinationUrl = destinationUrlKey ? detail[destinationUrlKey] : "";
      const textKey = Object.keys(detail).find(key => (
        (key.includes("text") || key.includes("img_url") || key.includes("html_code")) &&
        key !== "context"
      ));
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
        clickable: detail?.clickable,
      };

      if (!originalValuesCopy) {
        originalValuesCopy[detail.detail_id] = {
          text: textContent,
          destination_url: destinationUrl,
          detail_type: detailType,
          detail_name: detailName,
          clickable: detail?.clickable,
        };
      }
    });

    setDetailValues(newDetailValues);
    if (!originalValues) setOriginalValues(originalValuesCopy);
    setDetailsLoaded(true);
  }, [originalValues, selectedVersion, setDetailValues, setDetailsLoaded]);

  const loadAndInitializeVersion = useCallback(async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/api/contentframework/placement-version-content/${selectedVersion.versionId}/`, authHeader);
      
      // Set cntblkdesturl to the destination_url of the content detail with detail_name "CBLOCK"
      const cblockDetail = response.data.content_details.find(detail => detail.detail_name === "CBLOCK");
      if (cblockDetail) {
        const destinationUrlKey = Object.keys(cblockDetail).find(key => key.includes("destination_url"));
        const destinationUrl = destinationUrlKey ? cblockDetail[destinationUrlKey] : "";
        setCntblkdesturl(destinationUrl);
      }
      
      const filteredContents = response.data.content_details.filter(detailValue => 
        detailValue?.text !== "" && 
        !excludedKeywords.some(keyword => detailValue?.detail_name?.toLowerCase().includes(keyword))
      );
  
      // Sort content details to ensure SUBJECTLINE and PREHEADER come first
      const sortedContents = filteredContents.sort((a, b) => {
        const order = ["SUBJECTLINE", "PREHEADER"];
        const aIndex = order.indexOf(a.detail_name);
        const bIndex = order.indexOf(b.detail_name);
  
        if (aIndex === -1 && bIndex === -1) return 0;
        if (aIndex === -1) return 1;
        if (bIndex === -1) return -1;
  
        return aIndex - bIndex;
      });
  
      const filteredPV = {
        "content_details": sortedContents
      };
      setPlacementVersion(filteredPV);
      updateDetailValues(response.data.content_details);
    } catch (err) {
      console.log(err.message, err.code);
    }
  }, [apiBaseUrl, authHeader, updateDetailValues, selectedVersion.versionId, excludedKeywords]);

  const submitRenditionVersion = async () => {
    setSubmitting(true);
    try {
      if (renditionRef.current) {
        renditionRef.current.scrollIntoView({ behavior: 'smooth' });
      }
  
      // Deep copy of detailValues to avoid direct mutation of state
      const updatedDetailValues = JSON.parse(JSON.stringify(detailValues));
  
      // Iterate through detailValues and update destination_url
      Object.keys(updatedDetailValues).forEach(versionId => {
        Object.keys(updatedDetailValues[versionId]).forEach(versionNumber => {
          Object.keys(updatedDetailValues[versionId][versionNumber]).forEach(detailId => {
            const detail = updatedDetailValues[versionId][versionNumber][detailId];
            if (detail.destination_url) {
              detail.destination_url = cntblkdesturl;
            }
          });
        });
      });
  
      const response = await axios.post(
        `${apiBaseUrl}/api/mihp/rendition-version/${selectedVersion.versionId}/${renditionRequestId}/`,
        updatedDetailValues,
        authHeader
      );
  
      const allPlacementVersions = [...filteredPlacementVersions, response.data.placement_version_id];
      setPlacementVersionList(allPlacementVersions);
      setSubmitting(false);
      setOpenProofDialog(true);
    } catch (err) {
      console.log(err.message, err.code);
      setSubmitting(false);
    }
  };

  const sendProof = async () => {
    try {
      const requestBody = {
        all_placement_versions: placementVersionList,
        rendition_request_id: renditionRequestId,
      };
  
      const response = await axios.post(`${apiBaseUrl}/api/mihp/rendition-proof/`, requestBody, authHeader);
      setLastProofedTreatment(response.data);
    } catch (err) {
      console.log(err.message, err.code);
    }
  };

  useEffect(() => {
    if (!detailsLoaded) loadAndInitializeVersion();
  }, [detailsLoaded, loadAndInitializeVersion]);

  useEffect(() => {
    const filteredVersions = placementVersionList.filter(versionId => versionId !== originalVersion);
    setFilteredPlacementVersions(filteredVersions);
  }, [placementVersionList, originalVersion]);

  const handleInputChange = (event, detailId) => {
    const { value } = event.target;
    setDetailValues((prevValues) => ({
      ...prevValues,
      [selectedVersion.versionId]: {
        ...prevValues[selectedVersion.versionId],
        [selectedVersion.versionNumber]: {
          ...prevValues[selectedVersion.versionId]?.[selectedVersion.versionNumber],
          [detailId]: {
            ...prevValues[selectedVersion.versionId]?.[selectedVersion.versionNumber]?.[detailId],
            text: value,
          },
        },
      },
    }));
  };

  const resetToOriginalValues = () => {
    if (originalValues) setDetailValues(originalValues);
    setStep(2);

    if (renditionRef.current) {
      renditionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <>
      {submitting && <Typography className="edit__uploading">Uploading rendition...</Typography>}
      {(!detailsLoaded || submitting) && <CircularProgress />}
      {(detailsLoaded && !submitting) && (
        <Stack className="edit__display">
          <Typography className="edit__heading">{selectedVersion.versionName}</Typography>
          <Typography className="edit__subheading">{selectedVersion.versionNumber > renditionList?.length ? `Create Rendition ${selectedVersion.versionNumber}` : `Edit Rendition ${selectedVersion.versionNumber}`}</Typography>
          <Stack className="edit-form" component="form" noValidate autoComplete="off">
            <Stack className="edit-form__input-row" direction="row">
              <TextField
                className="edit-form__text-input"
                label="CNTBLKDESTURL"
                value={cntblkdesturl}
                onChange={(e) => setCntblkdesturl(e.target.value)}
              />
              <Button className="edit-form__link-button" 
                sx={{
                  opacity: 0,
                  pointerEvents: 'none'
                }}
              >
                <Link className="edit-form__link-icon" />
              </Button>
            </Stack>
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
                  <Button className="edit-form__link-button" 
                    sx={{
                      opacity: detailValue?.clickable || detailValue?.destination_url !== '' ? 1 : 0,
                        pointerEvents: detailValue?.clickable || detailValue?.destination_url !== '' ? 'auto' : 'none'
                      
                    }}
                    onClick={() => {
                      setLinkEdit(detailId);
                    }}
                  >
                    <Link className="edit-form__link-icon" />
                  </Button>
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
                        value={cntblkdesturl}
                      />
                    </DialogContent>
                    <DialogActions className="link-popup__button-row">
                      <Button
                        className="link-popup__button link-popup__button_save"
                        onClick={() => {
                          setLinkEdit('');
                        }}
                        color="primary"
                      >
                        Close
                      </Button>
                    </DialogActions>
                  </Dialog>
                </Stack>
              );
            })}
            <Stack className="edit-form__button-row" direction="row">
              <Button className="edit-form__button edit-form__button_cancel" onClick={resetToOriginalValues}>Cancel</Button>
              <Button className="edit-form__button edit-form__button_confirm" onClick={submitRenditionVersion}>Submit</Button>
            </Stack>
          </Stack>
        </Stack>
      )}

      <Dialog
        open={openProofDialog}
        onClose={() => setOpenProofDialog(false)}
      >
        <DialogTitle sx={{paddingBottom:'0'}}>Request Email Proof for {selectedVersion.versionName}?</DialogTitle>
        <DialogActions sx={{justifyContent:'space-between', padding: '1rem'}}>
          <Button sx={{textTransform:'unset', fontSize: '1rem'}} onClick={() => {
            setOpenProofDialog(false);
            loadRenditions(originalVersion);
          }}>Skip Proofing</Button>
          <Button sx={{textTransform:'unset', fontSize: '1rem'}} onClick={() => {
            setOpenProofDialog(false);
            sendProof();
            loadRenditions(originalVersion);
          }} color="primary">
            Request Proof
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}