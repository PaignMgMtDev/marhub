import React, { useEffect } from "react";
import { DataGridPro } from "@mui/x-data-grid-pro";
import { Button } from "@mui/material";
import CampHeader from "../header/CampHeader";

export default function CampTactics({
  campaignName,
  editTactics,
  handleSelectionChange,
  selectedRows,
  tacticRows,
  campaignID,
  auth,
  setTacticData,
  newContent,
  rendition,
  backDash,
  handleReqConfig,
  
}) {
  useEffect(() => {
    fetch(
      `https://campaign-app-api-staging.azurewebsites.net/api/v2/default/mihp/campaign-${campaignID}/tactics/`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${auth}`,
          "Content-Type": "application/json",
        },
        redirect: "follow",
      }
    )
      .then((response) => response.json())
      .then((data) => {
        const filteredTactics = data["tactics"].filter(
          (tactic) =>
            !["cancelled", "completed", "expired"].includes(tactic.current_status)
        );
        setTacticData(filteredTactics);
        console.log(data["tactics"]);
      });
  }, [auth, campaignID, setTacticData]);
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
    },
    {
      field: "status",
      headerName: "Status",
      width: 200,
      renderCell: (params) => (
        <strong className={getStatusClass(params.value)}>{params.value}</strong>
      ),
    },
    { field: "startdate", headerName: "Start Date", width: 300 },
    { field: "enddate", headerName: "End Date", width: 300 },
    { field: "language", headerName: "Language", width: 300 },
  ];

  return (
    <div>
    <div>
      <center>
        <CampHeader 
        campaignName={campaignName} 
        backDash={backDash}
        rendition={rendition}
        newContent={newContent}
        />
      </center>
      <div style={{ height: "auto", width: "auto", paddingLeft:"3%", paddingRight:"3%"}}>
      <DataGridPro
        checkboxSelection
        rows={tacticRows}
        columns={columns}
        onRowSelectionModelChange={handleSelectionChange}
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
