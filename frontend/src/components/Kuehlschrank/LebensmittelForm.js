import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField } from '@mui/material'
import React, { useEffect } from 'react'
import LebensmittelBO from '../../api/LebensmittelBO' // Import der Business Object Klasse für Lebensmittel
import FoodAPI from '../../api/FoodAPI' // Import der FoodAPI

const LebensmittelForm = ({open, handleClose, user, addLebensmittelToParent, lebensmittelProp, updateLebensmittelInParent}) => {
    const [bezeichnung, setBezeichnung] = React.useState('') // State für die Bezeichnung des Lebensmittels

    // Handler zum Speichern des neuen Lebensmittels
    const handleLebensmittelSave = () => {
        if(lebensmittelProp){
            let updatedLebensmittel = Object.assign(new LebensmittelBO(), lebensmittelProp)
            updatedLebensmittel.setBezeichnung(bezeichnung)
            FoodAPI.getAPI().updateLebensmittel(updatedLebensmittel).then((lebensmittel)=>{ // Aufrufen der API-Methode zum Aktualisieren des Lebensmittels
                updateLebensmittelInParent(updatedLebensmittel) // Hinzufügen des neuen Lebensmittels zum übergeordneten Zustand
            })
        }
        else{
            let newLebensmittel = new LebensmittelBO(bezeichnung, user.id) // Erstellen eines neuen Lebensmittel-Objekts
            FoodAPI.getAPI().createLebensmittel(newLebensmittel).then((lebensmittel)=>{ // Aufrufen der API-Methode zum Erstellen eines Lebensmittels
                addLebensmittelToParent(lebensmittel) // Hinzufügen des neuen Lebensmittels zum übergeordneten Zustand
            })
        }
    }

    // Handler zum Schließen des Dialogs
    const closeDialog = () => {
        handleClose()
    }

    useEffect(() => {
      if(lebensmittelProp){
          setBezeichnung(lebensmittelProp.bezeichnung)
      }
    }, [lebensmittelProp])

  return (
    <Dialog open={open} onClose={closeDialog}>
        <DialogTitle>Lebensmittel erstellen</DialogTitle>
        <DialogContent>
    {/* Textfeld für die Eingabe der Bezeichnung des Lebensmittels */}
        <TextField
        id="bezeichnung"
        label="Bezeichnung"
        variant="filled"
        value={bezeichnung}
        onChange={(e) => setBezeichnung(e.target.value)} // Handler für die Änderung der Bezeichnung
        />
        </DialogContent>
        <DialogActions>
            {/* Button zum Speichern des Lebensmittels */}
            <Button onClick={handleLebensmittelSave}  variant="contained">
                Speichern
            </Button>
            {/* Button zum Abbrechen und Schließen des Dialogs */}
            <Button variant="contained" onClick={closeDialog}>Abbrechen</Button>
        </DialogActions>
    </Dialog>
  )
}

export default LebensmittelForm