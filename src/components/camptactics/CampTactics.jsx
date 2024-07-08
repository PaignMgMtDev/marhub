import React, { useCallback, useEffect } from "react"
import { DataGridPro } from "@mui/x-data-grid-pro"
import { Button } from "@mui/material"
import CampHeader from "../header/CampHeader"
import axios from "axios"
import { DateTime } from 'luxon';

export default function CampTactics({
  authHeader,
  campaignName,
  editTactics,
  handleSelectionChange,
  selectedRows,
  tacticRows,
  campaignID,
  setTacticData,
  newContent,
  rendition,
  backDash,
  handleReqConfig,  
}){

  const getTactics = useCallback(async () => {
    try{
      const url = `${process.env.REACT_APP_API_BASE_URL}/api/v2/default/mihp/campaign-${campaignID}/tactics/`
      const res = await axios.get(url, authHeader)
      const data = res?.data 
      const tactics = data && data?.tactics?.filter((tactic) => ["approved", "planned", "in_market"].includes(tactic.current_status))
      setTacticData(tactics)
    }catch(e){
      console.log('error while getting tactics: ', e)
    }
  }, [authHeader, campaignID, setTacticData])

  useEffect(() => {
    getTactics()
  }, [getTactics]);

  const getStatusClass = (status) => {
    switch (status) {
      case "PLANNED":
        return "status-planned";
      case "ACTIVE":
        return "status-active";
      case "DRAFT":
        return "status-draft";
      default:
        return "status-default";
    }
  };

  

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 300,
      
    },
    {
      field: "tactName",
      headerName: "Tactic Name",
      width: 300,
      renderCell: (params) => (
        <div>{params.value.replace(/_/g, ' ')}</div>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 200,
      renderCell: (params) => (
        <strong className={getStatusClass(params.value)}>{params.value}</strong>
      ),
    },
    {
      field: "startdate",
      headerName: "Start Date",
      width: 300,
      renderCell: (params) => formatDate(params.value),
    },
    {
      field: "enddate",
      headerName: "End Date",
      width: 300,
      renderCell: (params) => formatDate(params.value),
    },
  ];

  const formatDate = (dateString) => {
    console.log("Date string received:", dateString);
    try {
      const date = DateTime.fromISO(dateString);
      if (date.isValid) {
        return date.toLocaleString(DateTime.DATE_MED);
      } else {
        console.error('Invalid date:', dateString); // Log the problematic date string
        return 'Invalid date'; // Provide a default/fallback message
      }
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Error formatting date'; // Handle unexpected errors gracefully
    }
  };
  
  
  

  return (
    <div>
    <div>
      <div>
        <CampHeader 
        campaignName={campaignName} 
        backDash={backDash}
        rendition={rendition}
        newContent={newContent}
        />
      </div>
      <div style={{ height: "auto", width: "auto", paddingLeft:"3%", paddingRight:"3%"}}>
      <DataGridPro
        checkboxSelection
        rows={tacticRows}
        columns={columns}
        onRowSelectionModelChange={handleSelectionChange}
        hideFooterRowCount={true}
      />
      </div>
      </div>
      <br />
      <div style={{ display: "flex", justifyContent: "flex-end" ,paddingRight:"10%" }}>
        {newContent ? (
          <Button
            variant="contained"
            onClick={editTactics}
            disabled={selectedRows.length === 0}
            sx={{ backgroundColor: "#FF7F50" }}
          >
            Configure Content Request
          </Button>
        ) : null}

        {rendition ? (
        <Button
        variant="contained"
            onClick={handleReqConfig}
            disabled={selectedRows.length === 0}
            sx={{ backgroundColor: "#FF7F50"}}
        >Configure Rendition Request</Button>
        ) : null}
      </div>
    </div>
  );
}
