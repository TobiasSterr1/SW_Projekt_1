// Import der benötigten Komponenten und Icons aus dem Material-UI
import { Avatar, Box, Button, ButtonGroup, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, TextField, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import FoodAPI from '../../api/FoodAPI'; // Import der FoodAPI aus der API
import SaveIcon from '@mui/icons-material/Save';
import PersonEntry from './PersonEntry';
import HaushaltBO from '../../api/HaushaltBO'; // Import des HaushaltBO aus der API
import HaushaltDeleteDialog from './HaushaltDeleteDialog';
import AddMitgliedDialog from './AddMitgliedDialog';

// Dialog-Komponente für die Haushaltsdetails und -bearbeitung
const HaushaltDialog = ({open, handleCloseDialog, haushalt, updateHaushalt, user, removeHaushalt}) => {
    // State-Hooks zur Verwaltung der Haushaltsmitglieder, des Haushaltsnamens, des Ladezustands und der Dialogzustände
    const [haushaltMitglieder, setHaushaltMitglieder] = useState([])
    const [haushaltname, setHaushaltname] = useState('')
    const [loading, setLoading] = useState(false)
    const [openLeave, setOpenLeave] = useState(false)
    const [openDelete, setOpenDelete] = useState(false)
    const [openAddMitglieder, setOpenAddMitglieder] = useState(false)
    const childRef = useRef();
    // Funktion zum Abrufen aller Haushaltsmitglieder
    const getAllHaushaltMitglieder = () => {
        // API-Aufruf, um Haushaltsmitglieder anhand der Haushalts-ID zu erhalten
        FoodAPI.getAPI().getHaushaltsmitgliedByHaushaltId(haushalt.id).then((haushaltMitglieder)=>{
            // Aktualisieren des State mit den erhaltenen Haushaltsmitgliedern
            setHaushaltMitglieder(haushaltMitglieder)
        })
    }

    // Funktion zum Speichern eines Haushalts
    const saveHaushalt = () => {
        // Setzen des Ladezustands auf true, um den Speichervorgang anzuzeigen
        setLoading(true)
        // Erstellen eines neuen HaushaltBO-Objekts und Kopieren der Eigenschaften des aktuellen Haushalts
        let h = Object.assign(new HaushaltBO, haushalt)
        // Setzen des Namens des Haushalts auf den Wert von haushaltname
        h.setName(haushaltname)
        // API-Aufruf zum Aktualisieren der Haushaltsinformationen
        FoodAPI.getAPI().updateHaushalt(h).then((haushalt)=>{
            // Setzen des Ladezustands auf false, um den Speichervorgang abzuschließen
            setLoading(false)
            // Aktualisieren des Haushaltsstates mit den neuen Haushaltsinformationen
            updateHaushalt(h)
        })
    }

    // Funktionen zur Steuerung der Dialoge für Verlassen und Löschen eines Haushalts
    const handleLeave = () => {
        setOpenLeave(true)
    }
    const handleDelete = () => {
        setOpenDelete(true)
    }
    const closeLeave = () => {
        setOpenLeave(false)
    }
    const closeDelete = () => {
        setOpenDelete(false)
    }

    // Funktion zur Steuerung des Dialogs zum Hinzufügen von Haushaltsmitgliedern
    const handleAddMitglieder = () => {
        setOpenAddMitglieder(true)
    }
    const closeAddMitglieder = () => {
        setOpenAddMitglieder(false)
    }

    // Funktion für einen Benutzer, um einen Haushalt zu verlassen
    const leaveHaushalt = () => {
        // Finden des Haushaltsmitgliedsobjekts für den aktuellen Benutzer
        let mitglied = haushaltMitglieder.find((h) => h.person_id === user.id)
        // API-Aufruf zum Löschen des Haushaltsmitglieds
        FoodAPI.getAPI().deleteHaushaltsmitglied(mitglied.id).then((h)=>{
            // Entfernen des Haushaltsmitglieds aus dem State
            removeHaushalt(mitglied)
            // Schließen des Dialogs zum Verlassen des Haushalts
            setOpenLeave(false)
            // Handling zusätzlicher Schließoperationen des Dialogs
            handleCloseDialog()
        })
    }

    // Funktion zum Hinzufügen eines neuen Haushaltsmitglieds
    const addHaushaltMitglied = (haushaltMitglied) => {
        // Erstellen eines neuen Arrays von Haushaltsmitgliedern einschließlich des neuen Mitglieds
        let newMitglieder = [...haushaltMitglieder, haushaltMitglied]
        // Aktualisieren des States mit der neuen Liste von Haushaltsmitgliedern
        setHaushaltMitglieder(newMitglieder)
    }

    // Funktion zum Entfernen eines Haushaltsmitglieds
    const removeHaushaltMitglied = (haushaltMitglied) => {
        // Erstellen eines neuen Arrays von Haushaltsmitgliedern ohne das angegebene Mitglied
        let newMitglieder = haushaltMitglieder.filter((h) => h.id !== haushaltMitglied.id)
        // Aktualisieren des States mit der neuen Liste von Haushaltsmitgliedern
        setHaushaltMitglieder(newMitglieder)
        if (childRef.current) {
            childRef.current.updateMitglieder(haushaltMitglied);
          }
    }

    // Funktion zum Löschen des gesamten Haushalts
    const deleteHaushalt = () => {
        // Finden des Haushaltsmitgliedsobjekts für den aktuellen Benutzer
        let mitglied = haushaltMitglieder.find((h) => h.person_id === user.id)

        // API-Aufruf zum Löschen des Haushalts
        FoodAPI.getAPI().deleteHaushalt(haushalt.id).then((h)=>{

            // Entfernen des Haushaltsmitglieds aus dem State
            removeHaushalt(mitglied)
            // Schließen des Dialogs zum Löschen des Haushalts
            setOpenDelete(false)
            // Handling zusätzlicher Schließoperationen des Dialogs
            handleCloseDialog()

        })
    }

    // Effekt-Hook zum Initialisieren der Komponente beim Laden des Haushalts
    useEffect(() => {
        if(haushalt){
            // Aufruf der Funktion zum Abrufen aller Haushaltsmitglieder und Setzen des Haushaltsnamens
            getAllHaushaltMitglieder()
            setHaushaltname(haushalt.name)
        }
        
    }, [haushalt])
    

    // Rückgabekonstrukt der Dialog-Komponente für Haushaltsdetails und -bearbeitung
    return (
    open&&
    <Dialog open={open} onClose={() => handleCloseDialog()}>
        <DialogTitle sx={{width:"230px", display:"flex", justifyContent:"flex-start"}} >
            {loading &&
                <IconButton  >
                <CircularProgress />
            </IconButton>
            }
            {!loading &&
               <IconButton  onClick={saveHaushalt} >
               <SaveIcon />
           </IconButton>
            }
            <TextField
                id="haushaltname"
                variant="standard"
                value={haushaltname}
                sx={{width:"150px"}}
                onChange={(e) => setHaushaltname(e.target.value)}
                />
            <IconButton onClick={() => handleCloseDialog()} sx={{position:"absolute", right:3, top:3}}>
                <CloseIcon />
            </IconButton>
        </DialogTitle>
        <DialogContent>
        <Box sx={{ display: 'flex', marginBottom: '1rem', flexDirection:"column", gap:".5rem" }}>
        {user && user.id === haushalt.owner_id && 
        <Button variant="contained" onClick={handleAddMitglieder} sx={{display:"flex", justifyContent:"center", alignItems:"center", textWrap:"wrap"}}>
            Mitglieder hinzufügen
        </Button>
        }
        <Typography>Mitglieder:        
        </Typography>
      </Box>
      <Box>
          {haushaltMitglieder.length > 0 && haushaltMitglieder.map((haushaltMitglied) => (
          <List  dense sx={{ width: '100%', bgcolor: 'background.paper', maxHeight: "50%", overflowY: "auto" }}>
            <PersonEntry loggedInUser={user} key={haushaltMitglied.person_id} 
            personId={haushaltMitglied.person_id} mitglied={haushaltMitglied} removeMitglied={removeHaushaltMitglied} ownerId={haushalt.owner_id}/> 
          </List>
          ))}
      </Box>
        </DialogContent>
        <DialogActions>
        <Button variant="contained" onClick={handleLeave}>
           {haushaltMitglieder.length === 1 ? 
           'Löschen':'Verlassen' 
           } 
        </Button>
        <HaushaltDeleteDialog open={openLeave} btnTitle="Verlassen" close={closeLeave} deleteFunction={leaveHaushalt} dialogTitle="Haushalt verlassen" 
        dialogDesc={`Bist du sicher, dass du diesen Haushalt verlassen möchtest? ${haushaltMitglieder.length === 1 ?
            "Als letztes Mitglied des Haushalts wird beim Verlassen das Haushalt automatisch gelöscht!": ""}`}/>
        <AddMitgliedDialog open={openAddMitglieder} close={closeAddMitglieder} haushalt={haushalt} saveMitglied={addHaushaltMitglied} user={user} ref={childRef}/>
       </DialogActions>
    </Dialog>
  )
}

export default HaushaltDialog