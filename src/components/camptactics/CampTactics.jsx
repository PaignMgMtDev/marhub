import React, { useCallback, useEffect } from "react";
import { DataGridPro } from "@mui/x-data-grid-pro";
import { Button, Paper, Typography } from "@mui/material";
import CampHeader from "../header/CampHeader";
import axios from "axios";
import { DateTime } from "luxon";

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
}) {
  const statusStyles = {
    PLANNED: { color: "primary.light" },
    APPROVED: { color: "primary.dark" },
    IN_MARKET: { color: "primary.main" },
    ON_HOLD: { color: "primary.light" },
    COMPLETED: { color: "secondary.main" },
  };

  const getTactics = useCallback(async () => {
    try {
      const url = `${process.env.REACT_APP_API_BASE_URL}/api/v2/default/mihp/campaign-${campaignID}/tactics/`;
      const res = await axios.get(url, authHeader);
      const data = res?.data;
      const tactics =
        data &&
        data?.tactics?.filter((tactic) =>
          ["approved", "planned", "in_market"].includes(tactic.current_status)
        );
      setTacticData(tactics);
    } catch (e) {
      console.log("error while getting tactics: ", e);
    }
  }, [authHeader, campaignID, setTacticData]);

  useEffect(() => {
    getTactics();
  }, [getTactics]);

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 100,
      renderCell: (params) => (
        <div style={{ fontWeight: "bold" }}>{params.value}</div>
      ),
    },
    {
      field: "tactName",
      headerName: "Tactic Name",
      width: 500,
      renderCell: (params) => (
        <div style={{ fontWeight: "bold" }}>
          {params.value.replace(/_/g, " ")}
        </div>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 200,
      renderCell: (params) => {
        const formattedValue = params.value.replace(/_/g, " ");
        const style = statusStyles[params.value];
        return (
          <Typography sx={{ textAlign: "left", paddingTop: "12px", ...style }}>
            {formattedValue}
          </Typography>
        );
      },
    },
    {
      field: "startdate",
      headerName: "Start Date",
      width: 200,
      renderCell: (params) => formatDate(params.value),
    },
    {
      field: "enddate",
      headerName: "End Date",
      width: 200,
      renderCell: (params) => formatDate(params.value),
    },
  ];

  const formatDate = (dateString) => {
    try {
      const date = DateTime.fromISO(dateString);
      if (date.isValid) {
        return date.toFormat("MM/dd/yyyy");
      } else {
        console.error("Invalid date:", dateString);
        return "Invalid date";
      }
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Error formatting date";
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
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            paddingTop: "10px",
          }}
        >
          <Paper sx={{ width: "400px", padding: "15px" }}>
            <Typography fontWeight="bold" variant="subtitle1">
              Please select the tactics to{" "}
              {newContent ? "add new content to" : "create a rendtion for"}.
              <br />
              Select one or more.
            </Typography>
          </Paper>
        </div>
        <div
          style={{
            height: "500px",
            width: "auto",
            paddingLeft: "3%",
            paddingRight: "3%",
            paddingTop: "10px",
          }}
        >
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
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          paddingRight: "3%",
        }}
      >
        {newContent ? (
          <Button
            variant="contained"
            onClick={editTactics}
            disabled={selectedRows.length === 0}
            sx={{ backgroundColor: "primary.main" }}
          >
            Configure Content Request
          </Button>
        ) : null}

        {rendition ? (
          <Button
            variant="contained"
            onClick={handleReqConfig}
            disabled={selectedRows.length === 0}
            sx={{ backgroundColor: "primary.main" }}
          >
            Configure Rendition Request
          </Button>
        ) : null}
      </div>
    </div>
  );
}
