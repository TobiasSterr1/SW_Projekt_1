/**Der gezeigte Code implementiert die Haushalt-Komponente einer React-Anwendung, die Benutzern ermöglicht, 
 * ihre Haushaltsmitgliedschaften zu verwalten. Hier ist eine kurze Übersicht über den Code und seine Funktionen: */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Typography } from '@mui/material';
import FoodAPI from '../../api/FoodAPI';
import JoinHaushaltDialog from '../Haushalt/JoinHaushaltDialog';
import CreateHaushaltDialog from '../Haushalt/CreateHaushaltDialog';
import HaushaltCard from '../Haushalt/HaushaltCard';
import NavBar from '../NavBar';

class Haushalt extends Component {

    constructor(props) {
        super(props);
        this.state = {
            memberships: [],
            openCreateHaushaltDialog: false,
            openJoinHaushaltDialog: false,
            error: null,
            loading: false
        }
    }

 getMembershipsByPerson = () => {
    FoodAPI.getAPI().getHaushaltsmitgliedByPersonId(this.props.user.id).then((memberships)=>{
        this.setState({
            memberships:memberships,
            loading:false
        })
    })
    .catch((error)=>{this.setState({error:error, loading: false})})
    this.setState({loading:true})
}

    openCreateHaushaltDialog = () => {
        this.setState({
            openCreateHaushaltDialog: true
        })
    }

    openJoinHaushaltDialog = () => {
        this.setState({
            openJoinHaushaltDialog: true
        })
    }

    closeCreateHaushaltDialog = () => {
        this.setState({
            openCreateHaushaltDialog: false,
        })
    }
    updateHaushalt = (haushaltsmitglied) => {
        let newMemberships = [...this.state.memberships, haushaltsmitglied]
        this.setState({
            openCreateHaushaltDialog: false,
            memberships: newMemberships,
            
        })
    }

    removeHaushalt = ( haushaltmitgliedschaft) => {
        let newMemberships = this.state.memberships.filter((h) => h.id !== haushaltmitgliedschaft.id)
        this.setState({
            memberships: newMemberships,
        })
    }

    addHaushalt = (haushaltmitgliedschaft) => {
        let newMemberships = [...this.state.memberships, haushaltmitgliedschaft]
        this.setState({
            memberships: newMemberships,
         })
    }
    closeJoinHaushaltDialog = () => {
        this.setState({
            openJoinHaushaltDialog: false
        })
    }

    componentDidMount(){
        if(this.props.user){
            this.getMembershipsByPerson()
        }
    }
    render() {
        return (
        <>
        <NavBar user={this.props.user}/>
            <Box sx={{display:"flex", justifyContent:"center", alignItems:"center", marginTop:"2rem", flexDirection:"column", gap:"4rem"}}>
                    <Box sx={{display:"flex", justifyContent:"center", alignItems:"center", gap:"2rem", flexWrap:"wrap" }}>
                        <Button variant="contained" onClick={this.openCreateHaushaltDialog}>Haushalt erstellen</Button>
                        <Button variant="contained" onClick={this.openJoinHaushaltDialog}>Haushalt beitreten</Button>
                        <CreateHaushaltDialog open={this.state.openCreateHaushaltDialog} close={this.closeCreateHaushaltDialog} updateHaushalt={this.updateHaushalt} user={this.props.user}/>
                        <JoinHaushaltDialog open={this.state.openJoinHaushaltDialog} close={this.closeJoinHaushaltDialog} user={this.props.user} addHaushalt={this.addHaushalt}/>
                    </Box>
                    <Box sx={{display:"flex", justifyContent:"center", alignItems:"center", flexDirection:"row", gap:"1rem", flexWrap:"wrap" }}>
                {this.state.memberships ? 
                this.state.memberships.map((h)=>
                    <HaushaltCard key={h.id} haushaltId={h.haushalt_id} user={this.props.user} removeHaushalt={this.removeHaushalt}/>):
                <Box sx={{display:"flex", justifyContent:"center", alignItems:"center", flexDirection:"column", gap:"1rem" }}>
                    <Typography variant="p">
                        Du hast noch kein Haushalt
                    </Typography>
                    </Box>
                }
                </Box>
            </Box>
                </>
        );
    }
}

Haushalt.propTypes = {

};

export default Haushalt;