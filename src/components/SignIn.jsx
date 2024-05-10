import * as React from "react";
import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
// import FormControlLabel from "@mui/material/FormControlLabel";
// import Checkbox from "@mui/material/Checkbox";
// import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function SignIn({  getAccessToken }) {
  
  const [email, setEmail] = useState(null)
  const [emailError, setEmailError] = useState(null)

  const [password, setPassword] = useState(null)
  // const [passwordError, setPasswordError] = useState(null)

  const handleEmailChange = (e) => {
    const input = e?.target?.value
    const emailRegex = /^[^\s@]+@[^\s@]+\.(?:com|org|net)$/i;
    if(emailRegex.test(input)){
      setEmailError(false)
      setEmail(input)
    }else{
      setEmailError(true)
    }
  }

  const handlePasswordChange = (e) => {
    const input = e?.target?.value
    setPassword(input)
    // const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{8,}$/;
    // if(passwordRegex.test(input)){
    //   setPasswordError(false)
    //   setPassword(input)
    // }else{
    //   setPasswordError(true)
    // }
  }

  const emailErrorMessage = "Please input a valid email."
  const passwordErrorMessage = "Please input a valid password."

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={(e) => getAccessToken(e, email, password)}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={(e) => handleEmailChange(e)}
              error={emailError}
              helperText={emailError && emailErrorMessage}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={(e) => handlePasswordChange(e)}
              // error={passwordError}
              // helperText={passwordError && passwordErrorMessage}
            />
            {/* <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            /> */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={email && password ? false : true}
              // onSubmit={(e) => getAccessToken(e, email, password)}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                {/* <Link href="#" variant="body2">
                  Forgot password?
                </Link> */}
              </Grid>
              <Grid item>
                {/* <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link> */}
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
