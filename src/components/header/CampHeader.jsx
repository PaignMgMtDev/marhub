import { Button } from '@mui/material'
import React from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


export default function CampHeader({
    campaignName,
    backDash,
    tacticForm,
    backTact
}) {

    

    

  return (
    <div className="box">
        <div className="top-nav">
        <div className="label">
        <Button onClick={tacticForm ? backTact : backDash} variant='link'><div className="text-wrapper"><ArrowBackIcon/>{campaignName}</div></Button>
        <br/>
        {/* <Typography variant='caption'>Campaign</Typography> */}
    </div>
        </div>
      </div>
  )
}
