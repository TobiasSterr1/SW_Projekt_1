import React, { useEffect } from 'react'
import FoodAPI from '../../api/FoodAPI' // Import der FoodAPI aus der API
import { Box, IconButton, ListItem, Typography } from '@mui/material' // Import der benötigten Komponenten aus dem Material-UI
import DeleteIcon from '@mui/icons-material/Delete'; // Import des Icons für das Löschen
import EditIcon from '@mui/icons-material/Edit'; // Import des Icons für das Bearbeiten
import LebensmittelEintragForm from './LebensmittelEintragForm'; // Import der LebensmittelEintragForm

// Komponente zur Darstellung eines Eintrags für Lebensmitteleinträge
const LebensmittelEintragEntry = ({lebensmitteleintrag, user, removeLebensmittelEintrag, missingMenge}) => {
    const [lebensmittel, setLebensmittel] = React.useState(null) // State-Hook zur Verwaltung der Lebensmittelinformationen
    const [menge, setMenge] = React.useState(null) // State-Hook zur Verwaltung der Menge
    const [masseinheit, setMasseinheit] = React.useState(null) // State-Hook zur Verwaltung der Maßeinheit
    const [openEditLebensmittelDialog, setOpenEditLebensmittelDialog] = React.useState(false) // State-Hook für die Anzeige des Dialogs zum Bearbeiten
    
    // Funktion zum Abrufen der Menge anhand der Menge-ID
    const getMenge = (mengeId) => {
        FoodAPI.getAPI().getMengeById(mengeId).then((menge)=>{
            setMenge(menge[0]) // Setzen der Menge im State
            // Abrufen und Setzen der Maßeinheit anhand der Maßeinheits-ID
            FoodAPI.getAPI().getMasseinheitById(menge[0].masseinheit_id).then((masseinheit)=>{
                setMasseinheit(masseinheit[0]) // Setzen der Maßeinheit im State
            })
        })
    }
    
    // Funktion zum Abrufen des Lebensmittels anhand der Lebensmittel-ID
    const getLebensmittel = (lebensmittelId) => {
        FoodAPI.getAPI().getLebensmittelById(lebensmittelId).then((lebensmittel)=>{
            setLebensmittel(lebensmittel[0]) // Setzen der Lebensmittelinformationen im State
        })
    }
    
    // Handler für das Öffnen des Dialogs zum Bearbeiten eines Lebensmitteleintrags
    const handleEditBtnClicked  = () => {
        setOpenEditLebensmittelDialog(true) // Setzen des State auf true, um den Dialog zu öffnen
    }
    // Handler für das Schließen des Dialogs zum Bearbeiten eines Lebensmitteleintrags
    const handleCloseEditLebensmittelDialog = () => {    
        setOpenEditLebensmittelDialog(false) // Setzen des State auf false, um den Dialog zu schließen
    }
    // Handler für das Klicken auf den Löschen-Button eines Lebensmitteleintrags
    const handleDeleteBtnClicked  = () => {
        FoodAPI.getAPI().deleteLebensmitteleintrag(lebensmitteleintrag.id, false).then((h)=>{
            removeLebensmittelEintrag(lebensmitteleintrag) // Aufrufen der Funktion zum Entfernen des Lebensmitteleintrags
        })
    }

    // Funktion zum Aktualisieren des Lebensmitteleintrags im übergeordneten Element
    const updateLebensmitteleintragInParent = (le) => {
        getLebensmittel(le.lebensmittel_id) // Aktualisieren der Lebensmittelinformationen
        getMenge(le.menge_id) // Aktualisieren der Menge
    }

    // Effekt-Hook zum Abrufen der Daten beim Laden der Komponente oder bei Änderung des Lebensmitteleintrags
    useEffect(() => {
        if(lebensmitteleintrag){
            getLebensmittel(lebensmitteleintrag.lebensmittel_id) // Abrufen der Lebensmittelinformationen
            getMenge(lebensmitteleintrag.menge_id) // Abrufen der Menge
        }
    }, [lebensmitteleintrag])
   // Rückgabekonstrukt der ListItem-Komponente für die Darstellung des Lebensmitteleintrags
    return (
    <ListItem
    sx={{ display: 'flex', alignItems: 'center', backgroundColor:"#F1F6FF", py:"0.5rem", px:"1rem" , width:"100%", minWidth:"300px", borderRadius:"8px", flexWrap:"wrap" }}
    secondaryAction={
        !missingMenge &&
     <Box sx={{display:"flex", justifyContent:"center", alignItems:"center", gap:".5rem", flexWrap:"wrap" }}>
     <IconButton edge="end" onClick={handleDeleteBtnClicked}>
       <DeleteIcon />
      </IconButton>
      <IconButton edge="end" onClick={handleEditBtnClicked}>
       <EditIcon />
      </IconButton>
     </Box>
    }>
        {lebensmittel &&
        <LebensmittelEintragForm open={openEditLebensmittelDialog} 
        close={handleCloseEditLebensmittelDialog} 
        lebensmitteleintrag={lebensmitteleintrag} 
        lebensmittelProp={lebensmittel} 
        masseinheitProp={masseinheit} 
        mengeProp={menge} 
        user={user} 
        aufbewahrId={lebensmitteleintrag && lebensmitteleintrag.aufbewahr_id} 
        aufbewahrOrt={"Kuehlschrank"}
        updateLebensmitteleintragInParent={updateLebensmitteleintragInParent}/>
        }
        <Typography sx={{width:"70%", textOverflow:"ellipsis",  }}>{lebensmittel && lebensmittel.bezeichnung} {missingMenge ? masseinheit && (missingMenge  / masseinheit.umrechnungs_wert)  : menge && menge.mengenanzahl}&nbsp; 
        {masseinheit && masseinheit.bezeichnung}&nbsp;</Typography>
        <Typography sx={{width:"70%", textOverflow:"ellipsis", color:"gray", fontSize:".8rem"  }}>
        (Menge in  {masseinheit && masseinheit.ist_volumen ? "milliliter" : "gramm"}: {!missingMenge  ? menge && masseinheit && menge.mengenanzahl * masseinheit.umrechnungs_wert : masseinheit && missingMenge })</Typography>
        </ListItem>
  )
}

export default LebensmittelEintragEntry