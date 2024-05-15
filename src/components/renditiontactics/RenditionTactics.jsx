import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { Button, Typography, Box, Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Paper, Modal } from "@mui/material"
import axios from 'axios';
import { useParams, useNavigate } from "react-router-dom";
import { formatDate } from '../../utils/utils';

export default function RenditionTactics({ auth }){
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

    
    const getTactics = useCallback(async () => {
        const url = process.env.REACT_APP_API_BASE_URL + `/api/mihp/rendition-request/${rendition}/`
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
    
    return(
        <Box className="rendition" component="main">
            <TableContainer component={Paper}>
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
            </TableContainer>
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