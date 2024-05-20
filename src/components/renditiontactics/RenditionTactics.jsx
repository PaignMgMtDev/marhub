import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { Button, Typography, Box, Modal } from "@mui/material" //Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Paper,
import { useParams, useNavigate } from "react-router-dom";
import { formatDate } from '../../utils/utils';
import { DataGridPro } from "@mui/x-data-grid-pro";
import axios from "axios"

export default function RenditionTactics({ auth ,handleRenditionRequestID}){
    const { rendition } = useParams()
    const navigate = useNavigate()
    const [renditionTactics, setRenditionTactics] = useState(null)
    const [approvedTacticId, setApprovedTacticId] = useState(null)
    const [openModal, setOpenModal] = useState(false)


    const toggleModal = () => {
        setOpenModal(!openModal)
    }

    const authHeader = useMemo(() => ({
        headers: {
          Authorization: `Bearer ${auth}`,
          "Content-Type": "application/json",
        },
      }), [auth]);

    const REACT_APP_API_BASE_URL = "https://campaign-app-api-staging.azurewebsites.net"

    const getTactics = useCallback(async () => {
        const url = REACT_APP_API_BASE_URL + `/api/mihp/rendition-request/v2/${rendition}/`
        try{
            const res = await axios.get(url, authHeader)
            res?.data && setRenditionTactics(res?.data['rendition_tactics'])
        }catch(e){
            throw Error("error while getting tactics by rendition")
        }
    }, [authHeader, rendition])

    useEffect(() => {
        if(auth)
            getTactics()
    }, [auth, getTactics])

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
        width: 200,
    },
    {
        field: "status",
        headerName: "Status",
        width: 100,
        renderCell: (params) => (
        <strong className={getStatusClass(params.value)}>{params.value}</strong>
        ),
    },
    { field: "startdate", headerName: "Start Date", width: 300 },
    { field: "enddate", headerName: "End Date", width: 300 },
    { field: "language", headerName: "Language", width: 300 },
    { 
        field: "actions", 
        width: 300,
        renderCell: (params) => (
            <>
            <Button onClick={() => {toggleModal(); setApprovedTacticId(params.value)}}>Approve Tactic</Button>
            <Button onClick={() => editTactic(params.value)}>Edit Tactic</Button>
            </>
        )
    }
    ];
    
    return(
        <Box className="rendition" component="main">
                {renditionTactics &&
                <DataGridPro
                    rows={tacticRows}
                    columns={columns}
                />}
            {/* <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                        <TableRow sx={{borderBottom: 'none'}}>
                            <TableCell>Tactic Name**</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Start Date</TableCell>
                            <TableCell>End Date</TableCell>
                            <TableCell>Language</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {renditionTactics && renditionTactics?.map((tactic, index) => {
                            const tacticId = tactic?.id
                            const elementKey = `tactic-${tacticId}-index${index}`
                            const name = tactic?.name 
                            const status = tactic?.current_status
                            const startDate = formatDate(tactic?.actual_start_dt)
                            const endDate = formatDate(tactic?.actual_end_dt)
                            const languages = tactic?.future_language !== null ? tactic?.future_language?.languages?.map(lang => lang.language_name) : []
                            const language = languages?.join(', ')
                            return(
                                <TableRow sx={{background: 'lightgray'}} key={elementKey}>
                                    <TableCell>{name}</TableCell>
                                    <TableCell>
                                        <Paper sx={{background: 'blue', padding: 1}}>
                                            <Typography textAlign='center' variant='body1' sx={{color: 'white'}}>
                                                {status}
                                            </Typography>
                                        </Paper>
                                    </TableCell>
                                    <TableCell>{startDate}</TableCell>
                                    <TableCell>{endDate}</TableCell>
                                    <TableCell>{language}</TableCell>
                                    <TableCell>
                                        <Button onClick={() => {toggleModal(); setApprovedTacticId(tacticId)}}>Approve Tactic</Button>
                                    </TableCell>
                                    <TableCell>
                                        <Button onClick={() => editTactic(tacticId)}>Edit Tactic</Button>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer> */}
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
                        The following tactic will be approved and will no longer be editable: Tactic ID {approvedTacticId}
                    </Typography>
                    </Box>
                </Modal>}
        </Box>
    )

}