import React, { forwardRef, useEffect, useImperativeHandle } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import { Box, Dialog, DialogContent, DialogTitle, IconButton, List, TextField } from '@mui/material';
import FoodAPI from '../../api/FoodAPI';
import PersonEntry from './PersonEntry';

const AddMitgliedDialog = forwardRef(({open, close, haushalt, saveMitglied, user}, ref) => {
// Zustand für die Suchanfrage und die gefilterten Mitglieder
    const [searchQuery, setSearchQuery] = React.useState('')
    const [filteredMitglieder, setFilteredMitglieder] = React.useState([])
    const [potentialMitglieder, setPotentialMitglieder] = React.useState([])

    // Handler für die Änderung der Suchanfrage
    const handleSearchChange = (event) => {
        let searchQuery = event.target.value;
        setSearchQuery(searchQuery);
        // Filtert die potenziellen Mitglieder nach Benutzername
        setFilteredMitglieder(potentialMitglieder.filter((person) =>
            person.benutzername.toLowerCase().includes(searchQuery.toLowerCase())
          ));
    }

    // Holt potenzielle Mitglieder für den Haushalt aus der API
    const getPotentialMitglieder = () => {
        FoodAPI.getAPI().getAllPerson(haushalt.id).then((personBOs)=>{
            setPotentialMitglieder(personBOs)
            setFilteredMitglieder(personBOs)
        })
    }
    useImperativeHandle(ref, () => ({
        updateMitglieder(mitglied){
            getPotentialMitglieder()
        }
      }));

    const addMitglied = (mitglied) => {
        saveMitglied(mitglied)
        let newPotentialMitglieder = potentialMitglieder.filter((p) => p.id !== mitglied.person_id)
        setPotentialMitglieder(newPotentialMitglieder)
        let filteredMitglieder = potentialMitglieder.filter((p) => p.id !== mitglied.person_id)
        setFilteredMitglieder(filteredMitglieder)
        close()
    }
    // Effekt, der beim Laden des Haushalts die potenziellen Mitglieder lädt
    useEffect(() => {
        if(haushalt){
            getPotentialMitglieder()
        }
    }, [haushalt])
  return (
    // Dialog-Komponente, die nur bei geöffnetem Zustand sichtbar ist
    open&&
    <Dialog open={open} onClose={() => close()}>
        <DialogTitle>Mitglied hinzufügen
            <IconButton onClick={() => close()} sx={{position:"absolute", right:"1rem"}}>
                <CloseIcon />
            </IconButton>
        </DialogTitle>
        <DialogContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-end', marginBottom: '1rem' }}>
        <SearchIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
        <TextField
           id="person-search"
           label="Person"
           variant="standard"
           value={searchQuery}
           onChange={handleSearchChange}
        />
      </Box>
      {/* Liste der gefilterten Mitglieder */}
      <Box>
          {filteredMitglieder.length > 0 && filteredMitglieder.map((person) => (
              <List key={person.benutzername} dense sx={{ width: '100%', bgcolor: 'background.paper', maxHeight: "60vh", overflowY: "auto", display:"flex", flexDirection:"column", gap:".25rem" }}>
                <PersonEntry personId={person.id} ownerId={user.id} haushalt={haushalt} addMitglied={addMitglied} loggedInUser={user}/>
            </List>
          ))}
      </Box>
        </DialogContent>
    </Dialog>
  )
})

export default AddMitgliedDialog