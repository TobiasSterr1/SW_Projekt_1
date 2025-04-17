// Import der benötigten Komponenten und Icons aus dem Material-UI
import { Box, Dialog, DialogContent, DialogTitle, IconButton, List, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import FoodAPI from '../../api/FoodAPI'; // Import der FoodAPI aus der API
import HaushaltDetail from './HaushaltDetail'; // Import der HaushaltDetail-Komponente

// Dialog-Komponente zum Beitritt zu einem Haushalt
const JoinHaushaltDialog = ({open, close, user, addHaushalt}) => {
  // State-Hooks zur Verwaltung der Haushaltslisten, der gefilterten Haushaltsliste und der Suchanfrage  
  const [haushaltList, setHaushaltList] = useState([])
    const [filteredHaushaltList, setFilterefilteredHaushaltList] = useState([])
    const [searchQuery, setSearchQuery] = useState('');
    // Funktion zum Abrufen aller Haushalte eines Benutzers
    const getAllHaushalt = (userId) => {
      // API-Aufruf, um alle Haushalte anhand der Benutzer-ID zu erhalten
      FoodAPI.getAPI().getAllHaushalt(userId).then((haushaltList) =>{
        // Setzen der Haushaltsliste und der gefilterten Haushaltsliste mit den erhaltenen Daten
        setHaushaltList(haushaltList)
        setFilterefilteredHaushaltList(haushaltList)
    })
    }

    // Handler-Funktion für die Änderung der Suchanfrage
    const handleSearchChange = (event) => {
        let searchQuery = event.target.value;
        setSearchQuery(searchQuery);
        // Filtern der Haushaltsliste basierend auf der Suchanfrage
        setFilterefilteredHaushaltList(haushaltList.filter((haushalt) =>
            haushalt.name.toLowerCase().includes(searchQuery.toLowerCase())
          ));
      };
    // Funktion zum Entfernen eines Haushalts aus der Liste nach dem Beitritt
    const removeHaushalt = (haushalt, haushaltmitgliedschaft) => {
      // Entfernen des Haushalts aus der Haushaltsliste und der gefilterten Haushaltsliste
      console.log("haushaltList", haushalt, haushaltList)
      let newHaushaltList = haushaltList.filter((h) => h.id !== haushalt.id)
      let newFilteredHaushaltList = filteredHaushaltList.filter((h) => h.id !== haushalt.id)
      setHaushaltList(newHaushaltList)
      setFilterefilteredHaushaltList(newFilteredHaushaltList)
      // Aufrufen der Funktion zum Hinzufügen der Haushaltsmitgliedschaft
      addHaushalt(haushaltmitgliedschaft)
    }
  

    // Effekt-Hook zum Initialisieren der Komponente beim Laden des Benutzers
    useEffect(() => {
      if(user){
        // Aufruf der Funktion zum Abrufen aller Haushalte des Benutzers
        getAllHaushalt(user.id)
      }
    }, [user])
    

  // Rückgabekonstrukt der Dialog-Komponente für den Beitritt zu einem Haushalt
    return (
    open&&
    <Dialog open={open} onClose={() => close()}>
        <DialogTitle>Haushalt beitreten
            <IconButton onClick={() => close()} sx={{position:"absolute", right:"1rem"}}>
                <CloseIcon />
            </IconButton>
        </DialogTitle>
        <DialogContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-end', marginBottom: '1rem' }}>
        <SearchIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
        <TextField 
           id="haushalt-search"
           label="Haushaltname"
           variant="standard"
           value={searchQuery}
           onChange={handleSearchChange}
        />
      </Box>
      <Box>
          {filteredHaushaltList.length > 0 && filteredHaushaltList.map((haushalt) => (
            <List key={haushalt.name} dense sx={{ width: '100%', bgcolor: 'background.paper', maxHeight: "60vh", overflowY: "auto" }}>
                <HaushaltDetail haushalt={haushalt} user={user} removeHaushalt={removeHaushalt}/>
            </List>
          ))}
      </Box>
        </DialogContent>
    </Dialog>
  )
}

export default JoinHaushaltDialog