 import React from 'react'
 import { DataGridPro } from "@mui/x-data-grid-pro";
import { Button } from '@mui/material';
 
 export default function CampTactics() {

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
        <DataGridPro checkboxSelection disableRowSelectionOnClick rows={rows} columns={columns} />
        <br/>
        <Button 
        variant="contained"
        color="primary">Configure Content Request</Button>
        </div>
     
   )
 }
 