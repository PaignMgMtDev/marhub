// import { createTheme } from '@mui/material/styles';

// const theme = createTheme({
//   palette: {
//     primary: {
//       main: '#FF9662', // Using Coral as the main primary color
//       light: '#FFB995', // Using Medium Coral as light
//       dark: '#1C1C1C', // Using Convoy Black as dark
//       contrastText: '#FFFFFF', // Text color on primary
//     },
//     secondary: {
//       main: '#CEDCDF', // Using Blue as the main secondary color
//       light: '#CFE0D2', // Using Green as light
//       dark: '#61646A', // Using Medium Gray as dark
//       contrastText: '#F9F6F4', // Text color on secondary, using Bonvoy White
//     },
//     error: {
//       main: '#FFDAA0', // Using Yellow for error states
//     },
//     background: {
//       default: '#F9F6F4', // Background color using Bonvoy White
//       paper: '#FFFFFF', // Background for components using White
//     },
//   },
//   typography: {
//     // You can also customize typography along with colors
//     fontFamily: 'Arial, sans-serif',
//   },
//   // Other theme settings
// });

// export default theme;

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FF9662', // Using Coral as the main primary color
      light: '#FFB995', // Using Medium Coral as light
      dark: '#1C1C1C', // Using Convoy Black as dark
      contrastText: '#FFFFFF', // Text color on primary
    },
    secondary: {
      main: '#CEDCDF', // Using Blue as the main secondary color
      light: '#CFE0D2', // Using Green as light
      dark: '#61646A', // Using Medium Gray as dark
      contrastText: '#F9F6F4', // Text color on secondary, using Bonvoy White
    },
    error: {
      main: '#FFDAA0', // Using Yellow for error states
    },
    background: {
      default: '#F9F6F4', // Background color using Bonvoy White
      paper: '#FFFFFF', // Background for components using White
    },
  },
  typography: {
    fontFamily: 'Arial, sans-serif',
  },
  components: {
    MuiCheckbox: {
      styleOverrides: {
        root: {
          '& .MuiSvgIcon-root': { // Targeting the SVG icon within the checkbox
            fontSize: '1.5rem', // Making the icon larger
            fontWeight: 'bolder' // Making the icon bolder
          }
        }
      }
    }
  }
});

export default theme;
