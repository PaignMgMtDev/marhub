import React, { useEffect } from "react";
import { DataGridPro } from "@mui/x-data-grid-pro";
import { Button } from "@mui/material";
import Header from "../header/Header";

export default function DashLanding({
  handleCampaignClick,
  campaignData,
  owner,
  setCampaignData,
  auth,
  handleCampaignID
}) {
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

  useEffect(() => {
    fetch(
      "https://campaign-app-api-staging.azurewebsites.net/api/v2/default/mihp/campaigns/",
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
        setCampaignData(data["campaigns"]);
      });
  }, [auth, setCampaignData]);
  

 

  const rows = campaignData.map((campaign) => ({
    id: campaign.id,
    campName: campaign.name,
    status: campaign.current_status.toUpperCase(),
    // owner: owner,
    newcontent: "Add New Content",
  }));

  const columns = [
    { field: "id", headerName: "ID", width: 150 },
    {
      field: "campName",
      headerName: "Campaign Name",
      width: 300,
    },
    {
      field: "status",
      headerName: "Status",
      width: 200,
      renderCell: (params) => (
        <span className={getStatusClass(params.value)}>{params.value}</span>
      ),
    },
    // { field: "owner", headerName: "Owner", width: 300 },
    {
      field: "newcontent",
      headerName: "",
      width: 300,
      renderCell: (params) => (
        <Button
          variant="link"
          color="primary"
          onClick={() => {handleCampaignClick(params.row.campName); handleCampaignID(params.row.id)}}
        >
          {params.value}
        </Button>
      ),
    },
  ];

  return (
    <div>
      <center>
        <Header />
      </center>
      <div style={{ height: 400, width: "100%" }}>
        <DataGridPro rows={rows} columns={columns} />
      </div>
    </div>
  );
}
