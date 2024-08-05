import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Button, Stack, TextField, Dialog, DialogActions, DialogTitle, Typography, CircularProgress } from "@mui/material";
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
  const [submitting, setSubmitting] = useState(false);
  const [originalValues, setOriginalValues] = useState(null);
  const [filteredPlacementVersions, setFilteredPlacementVersions] = useState([]);
  const [openProofDialog, setOpenProofDialog] = useState(false);

  const excludedKeywords = useMemo(() => [
    "imgwidth", "imgheight", "contentstartdate", "contentenddate", 
    "tactic_id", "product", "module", "section", "cntblkdesturl",
    "linkid", "linkname", "logoimg", "terms"
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
        text: detailName === "CBLOCK" ? destinationUrl : textContent,
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
      const filteredContents = response.data.content_details.filter(detailValue => 
        detailValue?.text !== "" && 
        !excludedKeywords.some(keyword => detailValue?.detail_name?.toLowerCase().includes(keyword))
      );
      
      // Sort content details to ensure SUBJECTLINE, PREHEADER, and CBLOCK come first
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
      }
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
      const response = await axios.post(`${apiBaseUrl}/api/mihp/rendition-version/${selectedVersion.versionId}/${renditionRequestId}/`, detailValues, authHeader);
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
            text: prevValues[selectedVersion.versionId]?.[selectedVersion.versionNumber]?.[detailId]?.detail_name === "CBLOCK" ? prevValues[selectedVersion.versionId]?.[selectedVersion.versionNumber]?.[detailId]?.text : value,
            destination_url: prevValues[selectedVersion.versionId]?.[selectedVersion.versionNumber]?.[detailId]?.detail_name === "CBLOCK" ? value : prevValues[selectedVersion.versionId]?.[selectedVersion.versionNumber]?.[detailId]?.destination_url,
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
            {placementVersion.content_details.map((detail) => {
              const detailId = detail.detail_id;
              const detailValue = detailValues[selectedVersion.versionId]?.[selectedVersion.versionNumber]?.[detailId];

              return (
                <TextField
                  className="edit-form__text-input"
                  label={detail.detail_name === "CBLOCK" ? "CNTBLKDESTURL" : detail.detail_name}
                  value={detail.detail_name === "CBLOCK" ? detailValue?.destination_url || "" : detailValue?.text || ""}
                  onChange={(event) => handleInputChange(event, detailId)}
                />
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