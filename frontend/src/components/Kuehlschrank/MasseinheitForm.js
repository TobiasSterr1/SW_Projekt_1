import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, IconButton, Switch, TextField } from '@mui/material'
import React, { useEffect } from 'react'
import MasseinheitBO from '../../api/MasseinheitBO'
import FoodAPI from '../../api/FoodAPI'

// Handler zum Speichern der neuen Maßeinheit
const MasseinheitForm = ({open, handleClose, user, addMasseinheitToParent, masseinheitProp, updateMasseinheitInParent}) => {
    const [bezeichnung, setBezeichnung] = React.useState('')
    const [umrechnungswert, setUmrechnungswert] = React.useState(0)
    const [istVolumen, setIstVolumen] = React.useState(false)

    const handleMasseinheitSave = () => {
        if(masseinheitProp){
            let updatedMasseinheit = Object.assign(new MasseinheitBO(), masseinheitProp)
            updatedMasseinheit.setBezeichnung(bezeichnung)
            updatedMasseinheit.setUmrechnungsWert(umrechnungswert)
            updatedMasseinheit.setIstVolumen(istVolumen ? 1 : 0) 
            console.log("updatedMasseinheit", updatedMasseinheit)
            FoodAPI.getAPI().updateMasseinheit(updatedMasseinheit).then((masseinheit)=>{ // Aufrufen der API-Methode zum Aktualisieren des Lebensmittels
                updateMasseinheitInParent(updatedMasseinheit) // Hinzufügen des neuen Lebensmittels zum übergeordneten Zustand
            })
        }
        else{
            let newMasseinheit = new MasseinheitBO(bezeichnung, umrechnungswert, istVolumen, user.id)
            FoodAPI.getAPI().createMasseinheit(newMasseinheit).then((masseinheit)=>{
                addMasseinheitToParent(masseinheit) 
            })
        }
    }

    // Handler zum Schließen des Dialogs
    const closeDialog = () => {
        handleClose()
    }

    useEffect(() => {
      if(masseinheitProp){
          setBezeichnung(masseinheitProp.bezeichnung)
          setUmrechnungswert(parseFloat(masseinheitProp.umrechnungs_wert))
          setIstVolumen(masseinheitProp.ist_volumen)
      }
    }, [masseinheitProp])
  return (
    <Dialog open={open} onClose={closeDialog}>
        <DialogTitle>Masseinheit erstellen</DialogTitle>
        <DialogContent>
        {/* Box für die Eingabe der Bezeichnung, des Umrechnungswerts und des Typs der Maßeinheit */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap:"1rem", flexWrap:"wrap" }}>
        <TextField
        id="bezeichnung"
        label="Bezeichnung"
        variant="filled"
        value={bezeichnung}
        onChange={(e) => setBezeichnung(e.target.value)} // Handler für die Änderung der Bezeichnung
        />
        {/* Textfeld für die Eingabe des Umrechnungswerts der Maßeinheit */}
        <TextField
        id="umrechnungswert"
        label={`Wert in ${istVolumen ? "Mililiter" : "Gramm"}`}
        variant="filled"
        value={umrechnungswert}
        type="number"
        onChange={(e) => setUmrechnungswert(e.target.value)}
        />
        {/* Schalter für die Auswahl des Typs der Maßeinheit (Volumen oder Gewicht) */}
         <FormControlLabel control={ <Switch
      checked={istVolumen}
      onChange={(e) => setIstVolumen(e.target.checked)} // Handler für die Änderung des Typs der Maßeinheit
      inputProps={{ 'aria-label': 'controlled' }}
    />} label={istVolumen ? 'Flüssig' : 'Fest'} /> 
         
        </Box>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleMasseinheitSave}  variant="contained">
                Speichern
            </Button>
            {/* Button zum Abbrechen und Schließen des Dialogs */}
            <Button variant="contained" onClick={closeDialog}>Abbrechen</Button>
        </DialogActions>
    </Dialog>
  )
}

export default MasseinheitForm