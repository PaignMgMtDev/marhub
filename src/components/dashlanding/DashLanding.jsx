import React, { useCallback, useEffect } from "react";
import { DataGridPro } from "@mui/x-data-grid-pro";
import { Button, Typography } from "@mui/material";
import axios from "axios"


export default function DashLanding({
  authHeader,
  handleAddNewContent,
  campaignData,
  setCampaignData,
  handleCampaignID,
  handleCreateRendition
}) {
  console.log(campaignData)
  const statusStyles = {
    PLANNED: { color: 'primary.light' },
    APPROVED: { color: 'primary.dark' },
    IN_MARKET: { color: 'primary.main' },
    ON_HOLD: { color: 'primary.light' },
    COMPLETED: { color: 'secondary.main' },
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
      renderCell: (params) => {
        const formattedValue = params.value.replace(/_/g, ' ');
        const style = statusStyles[params.value]; // Get the style for the current status
        return (
          <Typography sx={{ textAlign: "left", paddingTop: "12px", ...style }}>
            {formattedValue}
          </Typography>
        );
      },
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
        
        params.row.status === "APPROVED" || params.row.status === "IN_MARKET" || params.row.status === "PLANNED" ?
        <Button
          variant='contained'
          sx={{ 
            ':hover': {
              backgroundColor: 'primary.light'
            },
            backgroundColor: 'secondary.light', color: 'primary.dark' }}
          onClick={() => {handleCreateRendition(params.row.campName); handleCampaignID(params.row.id)}}
        >
          {params.value}
        </Button>
          :null
      ),
    },
  ];

  return (
    <div>
      <div style={{ height: "auto", width: "auto", paddingLeft:"3%", paddingRight:"3%", paddingTop: "10px"}}>
        <DataGridPro rows={rows} columns={columns} hideFooterRowCount={true} />
      </div>
    </div>
  );
}
