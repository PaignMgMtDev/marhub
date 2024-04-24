import { Button, Typography } from '@mui/material'
import React from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from "react-router-dom";

export default function CampHeader({
    campaignName
}) {

    let navigate = useNavigate();

    const backDash = () => {
        navigate("/dashlanding");
    }

  return (
    <div className="box">
        <div className="top-nav">
        <div className="label">
        <Button onClick={backDash} variant='link'><div className="text-wrapper"><ArrowBackIcon/>{campaignName}</div></Button>
        <br/>
        <Typography variant='caption'>Campaign</Typography>
    </div>
        </div>
      </div>
  )
}
