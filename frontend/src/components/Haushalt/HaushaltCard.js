import React, { useEffect, useState } from 'react'
import FoodAPI from '../../api/FoodAPI'
import { Box, Button, CardActions, CardContent, Typography } from '@mui/material'
import HouseIcon from '@mui/icons-material/House';
import HaushaltDialog from './HaushaltDialog';
import HaushaltBO from '../../api/HaushaltBO';
import { useNavigate } from 'react-router-dom';

const HaushaltCard = ({haushaltId, user, removeHaushalt}) => {
  // Zustände für den Haushalt, den Dialogstatus und die Navigation
    const [haushalt, setHaushalt] = useState(null)
    const [openDialog, setOpenDialog] = useState(false)
    const navigate = useNavigate();
    
    // Öffnet den Dialog
    const handleOpenDialog = () => {
        setOpenDialog(true)
    }

    // Schließt den Dialog
    const handleCloseDialog = () => {
        setOpenDialog(false)
    }
    
    // Holt den Haushalt anhand der ID vom Server
    const getHaushaltById = (id) => {
        FoodAPI.getAPI().getHaushaltById(id).then((h)=>{
            setHaushalt(h[0])
        })
      }
      
      // Funktion zum Entfernen eines Haushaltsmitgliedschaftsobjekts
      const removeHaus = (haushaltmitgliedschaft) => {
        removeHaushalt(haushaltmitgliedschaft)
      }

      // Funktion zum Aktualisieren des Haushalts im Zustand
      const updateHaushalt = (h) => {
        setHaushalt(h)
      }

      // Navigiert zu einer spezifischen Haushaltsseit
      const handleSelect = () => {
        navigate(`/Haushalt/${haushaltId}/${haushalt.name}/Kuehlschrank`); 
    }

    // Effekt zum Laden des Haushalts bei Änderung der Haushalts-ID
    useEffect(() => {
      if(haushaltId){
          getHaushaltById(haushaltId)
      }
    }, [haushaltId])

  return (
    <Box sx={{borderRadius:"8px", borderColor:"dark-gray", borderWidth:"1px", borderStyle:"solid", minWidth:"150px", py:".5rem", px:"1rem", backgroundColor: "#D3DAFF" }}>
    <CardContent sx={{display:"flex", flexDirection:"row", alignItems:"center", gap:".5rem"}}>
        <HouseIcon/>
      <Typography variant="h5" component="div">
        {haushalt && haushalt.name}
      </Typography>
    </CardContent>
    <CardActions>
      <Button size="small" variant="contained" onClick={handleSelect}>Auswählen</Button>
      <Button size="small" variant="contained" onClick={handleOpenDialog}>Mehr Infos</Button>
      <HaushaltDialog open={openDialog} handleCloseDialog={handleCloseDialog} haushalt={haushalt} user={user} updateHaushalt={updateHaushalt} removeHaushalt={removeHaus}/>
    </CardActions>
  </Box>
  )
}

export default HaushaltCard