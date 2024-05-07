// import React from 'react'

// export default function Header() {
//   return (
//     <div className="box">
//         <div className="top-nav">
//         <div className="label">
//       <div className="text-wrapper">My Dashboard</div>
//     </div>
//         </div>
//       </div>
//   )
// }

import React from 'react';
import { Box, Typography } from '@mui/material';


export default function CampHeader({
    campaignName,
    backDash,
    tacticForm,
    backTact
}) {
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'start', // Adjust to start to align items to the top of the container
                flexDirection: 'column', // Change direction to column to stack vertically
                minWidth: '1850px',
                height: 'auto', // Adjust height to auto to contain both elements comfortably
                padding: '8px 16px',
                borderBottom: '1px solid #ddd', // Adjust color as needed
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)', // Optional shadow for styling
                backgroundColor: '#fff' // Match the background to your theme
            }}
        >
           

            <Typography variant="h6" sx={{ opacity: 0.7, paddingLeft: '10px' }}>
                My Dashboard
            </Typography>
        </Box>
    );
}