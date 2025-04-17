import { Box, IconButton, ListItem,  ListItemButton,  Typography } from '@mui/material'
import React from 'react'
import HouseIcon from '@mui/icons-material/House';
import LockIcon from '@mui/icons-material/Lock';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import HaushaltsmitgliedBO from '../../api/HaushaltsmitgliedBO';
import FoodAPI from '../../api/FoodAPI';

const HaushaltDetail = ({haushalt, removeHaushalt, user}) => {

  // Funktion zum Beitritt zu einem Haushalt
  const joinHousehold = () => {
    // Erstellen einer neuen Haushaltsmitgliedschaft mit der aktuellen Benutzer-ID und der Haushalts-ID
    let newMitgliedschaft = new HaushaltsmitgliedBO(user.id, haushalt.id)
    // Aufruf der FoodAPI, um die Haushaltsmitgliedschaft zu erstellen
    FoodAPI.getAPI().createHaushaltsmitglied(newMitgliedschaft).then((haushaltsmitglied)=>{
      // Aufrufen der removeHaushalt-Funktion, um den Haushalt und das Haushaltsmitglied zu entfernen
      removeHaushalt(haushalt, haushaltsmitglied)
    })
  }

  return (
    haushalt?
    // Rendern der ListItem-Komponente für die Haushaltsdetails, falls ein Haushalt vorhanden ist
    <ListItem
            key={haushalt.name}
          >
            <ListItemButton sx={{ display: 'flex', alignItems: 'center', gap:"0.5rem", backgroundColor:"#F1F6FF", py:"0.5rem", px:"1rem" , width:"100%", minWidth:"250px", borderRadius:"8px" }}>
              <HouseIcon/>
              <Typography >{haushalt.name}</Typography>
              <IconButton sx={{position:"absolute", right:6, color:"gray"}} onClick={joinHousehold}>
              <AddBusinessIcon />
              </IconButton>
            </ListItemButton>
    </ListItem>
    // Anzeige während des Ladens, falls kein Haushalt vorhanden ist
    :<div>...loading</div>
  )
}

export default HaushaltDetail