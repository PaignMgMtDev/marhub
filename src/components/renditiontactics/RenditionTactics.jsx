import React, { useEffect, useState, useCallback } from 'react'
import { Button, Typography, Box, Modal } from "@mui/material" //Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Paper,
import { useParams, useNavigate } from "react-router-dom";
import { formatDate } from '../../utils/utils';
import { DataGridPro } from "@mui/x-data-grid-pro";
import axios from "axios"

export default function RenditionTactics({authHeader, handleRenditionRequestID}){
    const { rendition } = useParams()
    const navigate = useNavigate()
    const [renditionTactics, setRenditionTactics] = useState([])
    // const [approvedTacticId, setApprovedTacticId] = useState(null)
    const [openModal, setOpenModal] = useState(false)
    

    const toggleModal = () => {
        setOpenModal(!openModal)
    }

    // const REACT_APP_API_BASE_URL = "https://campaign-app-api-staging.azurewebsites.net"

    const getTactics = useCallback(async () => {
        try{
            const url = `${process.env.REACT_APP_API_BASE_URL}/api/mihp/rendition-request/v2/${rendition}/`
            const res = await axios.get(url, authHeader)
            const data = res?.data
            data && setRenditionTactics(data.rendition_tactics)
        }catch(e){
            console.log('error while getting tactics by rendition: ', e)
        }
    }, [authHeader, rendition])

    useEffect(() => {
        getTactics()
    }, [getTactics])

    const editTactic = (tacticId) => {
        const url = `/renditions/${tacticId}`
        navigate(url)
        handleRenditionRequestID(rendition)
    }

    const modalBoxtyles = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
      };

      const statusStyles = {
        PLANNED: { color: 'primary.light' },
        APPROVED: { color: 'primary.dark' },
        IN_MARKET: { color: 'primary.main' },
        ON_HOLD: { color: 'primary.light' },
        COMPLETED: { color: 'secondary.main' },
      };

    const tacticRows = renditionTactics?.map((tactic) => ({
        id: tactic.id,
        tactName: tactic.name,
        status: tactic.current_status.toUpperCase(),
        startdate: formatDate(tactic.planned_start_dt),
        enddate: formatDate(tactic.planned_end_dt),
        language: tactic.language,
        actions: tactic?.id
      }));
    
    const columns = [
    {
        field: "id",
        headerName: "ID",
        width: 100,
    },
    {
        field: "tactName",
        headerName: "Tactic Name",
        width: 500,
        renderCell: (params) => (
          <div>{params.value.replace(/_/g, ' ')}</div>
        ),
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
    { field: "startdate", headerName: "Start Date", width: 200 },
    { field: "enddate", headerName: "End Date", width: 200 },
    // { field: "language", headerName: "Language", width: 300 },
    {
        width: 300,
        renderCell: (params) => (
          <>
            <Button
              variant="contained"
              disabled="true"
              sx={{ marginRight: 1 }} 
              onClick={() => { 
                toggleModal(); 
                // setApprovedTacticId(params.value) 
              }}
            >
              Approve Tactic
            </Button>
            <Button
              
              variant="contained"
              onClick={() => editTactic(params.id)}
            >
              Edit Tactic
            </Button>
          </>
        )
      }
      
    ];
    
    return(
        <Box className="rendition" component="main">
          
            {renditionTactics &&
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
                    rows={tacticRows}
                    columns={columns}
                    hideFooterRowCount={true}
                />
                </div>
                }
                
            {openModal &&
                <Modal
                    open={openModal}
                    onClose={toggleModal}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={modalBoxtyles}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Are you sure you want to approve?
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        The following tactic will be approved and will no longer be editable: Tactic ID 
                        {/* {approvedTacticId} */}
                    </Typography>
                    </Box>
                </Modal>}
        </Box>
    )

}