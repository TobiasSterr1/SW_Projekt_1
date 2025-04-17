/**
 * Die SignInPage-Komponente stellt eine Anmeldeseite dar, die es Benutzern ermöglicht,
 * sich über Google anzumelden, um den Foodmanager zu nutzen.*/

import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Box, Button, Card, CardActions, CardContent, CardHeader, Typography } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';

export class SignInPage extends Component {

    handleSignIn = () =>{
        this.props.handleSignInFunction()
    }
  render() {
    return (
                  <Box sx={{display:"flex", width:"100vw", height:"100vh", justifyContent:"center", alignItems:"center"}}>
        <Box sx={{display:"flex", p:"2rem", justifyContent:"center", alignItems:"center", flexDirection:"column", gap:"2rem", border:"1px solid black", borderRadius:"8px", borderColor:"dark-gray" }}>
                <Typography variant="h3">
                    🍔 Foodmanager 🍕
                </Typography>
                <Typography variant="p" textAlign="center">Ganz einfach mit Google anmelden und alle  Vorteile <br/> unseres Foodmanagers genießen</Typography>
                <Button  variant="contained" onClick={this.handleSignIn} startIcon={<LoginIcon/>}>Anmelden</Button>
        </Box>
      </Box>
    )
  }
}
/** PropTypes */
SignInPage.propTypes = {
    handleSignInFunction: PropTypes.func.isRequired,
}
export default SignInPage