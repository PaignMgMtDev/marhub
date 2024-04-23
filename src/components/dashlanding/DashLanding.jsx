import React, { useState } from 'react'
import { DataGridPro } from "@mui/x-data-grid-pro";
import { Button } from '@mui/material';
import CampTactics from '../camptactics/CampTactics';

export default function DashLanding() {

    const getStatusClass = (status) => {
        switch (status) {
          case "ACTIVE":
            return "status-active";
          case "DRAFT":
            return "status-draft";
          default:
            return "status-default";
        }
      };
    
    const rows = [
        { id: 1, campName: "100 Days", status: "ACTIVE", owner: "Sarah S", newcontent: "Add New Content" },
        { id: 2, campName: "101 Days", status: "DRAFT", owner: "Sarah S", newcontent: "Add New Content" },
        { id: 3, campName: "102 Days", status: "DRAFT", owner: "Sarah S", newcontent: "Add New Content" },
      ];
    
      const columns = [
        { field: "id", headerName: "ID", width: 150 },
        {
            field: "campName",
            headerName: "Campaign Name",
            width: 300,
            renderCell: (params) => (
              <Button
                variant="link"
                color="primary"
                onClick={() => handleCampaignClick(params.value)}
              >
                {params.value}
              </Button>
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
        { field: "owner", headerName: "Owner", width: 300 },
        { field: "newcontent", headerName: "", width: 300 },
        
      ];

      const [campaign, setCampaign] = useState(false)
const handleCampaignClick = () => {
setCampaign(true)
}

  return (
    <div style={{ height: 400, width: "100%" }}>
      {!campaign ? <DataGridPro rows={rows} columns={columns} /> : null}
      {campaign ? <CampTactics /> :null}
    </div>
  )
}
