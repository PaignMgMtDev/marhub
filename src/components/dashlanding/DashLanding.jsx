import React, { useCallback, useEffect } from "react";
import { DataGridPro } from "@mui/x-data-grid-pro";
import { Button } from "@mui/material";
import axios from "axios"

export default function DashLanding({
  authHeader,
  handleAddNewContent,
  campaignData,
  setCampaignData,
  handleCampaignID,
  handleCreateRendition
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

  const getCampaigns = useCallback(async () => {
    try{
      const url = `${process.env.REACT_APP_API_BASE_URL}/api/v2/default/mihp/campaigns/`
      const res = await axios.get(url, authHeader)
      const data = res?.data 
      data && setCampaignData(data?.campaigns)
    }catch(e){
      console.log('error while getting campaigns: ', e)
    }
  }, [authHeader, setCampaignData])

  useEffect(() => {
    getCampaigns()
  }, [getCampaigns]);
  

 

  const rows = campaignData.map((campaign) => ({
    id: campaign.id,
    campName: campaign.name,
    status: campaign.current_status.toUpperCase(),
    // owner: owner,
    newcontent: "Add New Content",
    createrendition: "Create Rendition"
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
          onClick={() => {handleAddNewContent(params.row.campName); handleCampaignID(params.row.id)}}
        >
          {params.value}
        </Button>
      ),
    },
    {
      field: "createrendition",
      headerName: "",
      width: 300,
      renderCell: (params) => (
        <Button
          variant="link"
          color="primary"
          onClick={() => {handleCreateRendition(params.row.campName); handleCampaignID(params.row.id)}}
        >
          {params.value}
        </Button>
      ),
    },
  ];

  return (
    <div>
      <div style={{ height: "auto", width: "auto", paddingLeft:"3%", paddingRight:"3%"}}>
        <DataGridPro rows={rows} columns={columns} />
      </div>
    </div>
  );
}
