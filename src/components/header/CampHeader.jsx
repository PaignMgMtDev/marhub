import React from 'react';
import { Button, Box, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

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
            <Button
                onClick={tacticForm ? backTact : backDash}
                sx={{ color: 'black', textTransform: 'none', fontSize: '1rem',  }}
                startIcon={<ArrowBackIcon />}
            >
                {campaignName}
            </Button>

            <Typography variant="caption" sx={{ opacity: 0.7, paddingLeft: '35px' }}>
                Create Rendition Request
            </Typography>
        </Box>
    );
}

// import React from 'react';
// import { Button, Box, Typography } from '@mui/material';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// export default function CampHeader({
//     campaignName,
//     backDash,
//     tacticForm,
//     backTact
// }) {
//     return (
//         <Box 
       
//         sx={{
//             display: 'flex',
//             alignItems: 'center',
//             minWidth: '1850px',
//             height: '75px',
//             justifyContent: 'flex-start',
//             padding: '8px 16px',
//             borderBottom: '1px solid #ddd', // Adjust color as needed
//             boxShadow: '0 2px 4px rgba(0,0,0,0.1)', // Optional shadow for styling
//             backgroundColor: '#fff' // Match the background to your theme
//         }}>
//             <Button 
//                 onClick={tacticForm ? backTact : backDash} 
//                 sx={{ color: 'black', textTransform: 'none', fontSize: '1rem' }}
//                 startIcon={<ArrowBackIcon />}
//             >
//                 <Typography paragraph variant="h6" sx={{ display: 'inline', fontWeight: 'normal', paddingTop: '15px' }}>
//                     {campaignName}
//                 </Typography>
//             </Button>
         
//             <Typography variant="caption" sx={{  opacity: 0.7 }}>
//                 Create Rendition Request
//             </Typography>
//         </Box>
//     );
// }



