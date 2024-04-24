 import React from 'react'
 import { DataGridPro } from "@mui/x-data-grid-pro";
import { Button } from '@mui/material';
import CampHeader from '../header/CampHeader';
 
 export default function CampTactics({
    campaignName
 }) {

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
        { id: 1, tactName: "Tactic 1", status: "ACTIVE", startdate: "1/1/2024", enddate: "12/31/2024", language: "English" },
        { id: 2, tactName: "Tactic 2", status: "DRAFT", startdate: "5/1/2024", enddate: "12/31/2024", language: "English" },
        { id: 3, tactName: "Tactic 3", status: "DRAFT", startdate: "5/1/2024", enddate: "12/31/2024", language: "English" },
      ];
    
      const columns = [
        
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
        <center>
        <CampHeader
        campaignName={campaignName}
        />
        </center>
        <DataGridPro checkboxSelection disableRowSelectionOnClick rows={rows} columns={columns} />
        <br/>
        <div className="button-container">
        <Button 
        variant="contained"
        sx={{backgroundColor: "#FF7F50"}}>Configure Content Request</Button>
        </div>
        </div>
     
   )
 }
 