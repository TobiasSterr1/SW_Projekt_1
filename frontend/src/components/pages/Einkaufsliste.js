/**
*Der gegebene Code implementiert die Einkaufsliste-Komponente einer React-Anwendung. 
*Diese Komponente ermöglicht es Benutzern, Lebensmitteleinträge zwischen ihrer 
*Einkaufsliste und ihrem Kühlschrank zu verwalten.
   */
import React, { useEffect, useState } from 'react'
import NavBar from '../NavBar'
import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material'
import LebensmittelEintragForm from '../Kuehlschrank/LebensmittelEintragForm'
import LebensmittelEintragEntry from '../Kuehlschrank/LebensmittelEintragEntry'
import { useParams } from 'react-router-dom'
import FoodAPI from '../../api/FoodAPI'
import HaushaltDeleteDialog from '../Haushalt/HaushaltDeleteDialog'
import LebensmitteleintragBO from '../../api/LebensmitteleintragBO'
import { get } from 'firebase/database'

const Einkaufsliste = ({user}) => {
    const { id, name } = useParams();
  // Zustände für Daten und Steuerung
  const [einkaufsliste, setEinkaufsliste] = useState(null)
  const [kuehlschrank, setKuehlschrank] = useState(null)
  const [lebensmitteleintragList, setLebensmitteleintragList] = useState([])
  const [openLebensmittelForm, setOpenLebensmittelForm] = useState(false)
  const [einkaufsWagenChecked, setEinkaufsWagenChecked] = React.useState(false)
  const [einkaufswagenLebensmitteleintragTobeAddedList, setEinkaufswagenLebensmitteleintragTobeAddedList] = React.useState([])
  const [einkaufswagenAddClicked, setEinkaufswagenAddClicked] = React.useState(false)
  const [einkaufswagenAddSuccess, setEinkaufswagenAddSuccess] = React.useState(false)
  const [einkaufslisteMeldung, setEinkaufslisteMeldung] = React.useState("")
    

    // API-Aufrufe zum Laden der Daten
    const getEinkaufslisteByHaushaltId = (haushaltId) => {
        FoodAPI.getAPI().getEinkaufslisteByHaushaltId(haushaltId).then((einkaufsliste)=>{
            setEinkaufsliste(einkaufsliste[0])
            getLebensmitteleintragList(einkaufsliste[0])
        })
    }

    const getLebensmitteleintragList = (einkaufsliste) => {
        FoodAPI.getAPI().getLebensmitteleintragByAufbewahrOrt("Einkaufsliste", einkaufsliste.id).then((lebensmitteleintragList)=>{
            setLebensmitteleintragList(lebensmitteleintragList)
        })
    }

    const addLebensmittelEintragToParent = (lebensmitteleintrag) => {
        let newLebensmitteleintragList = [...lebensmitteleintragList, lebensmitteleintrag]
        setLebensmitteleintragList(newLebensmitteleintragList)
        handleLebensmittelFormClosed()
    }

    const removeLebensmittelEintrag = (lebensmitteleintrag) => {
        let newLebensmitteleintragList = lebensmitteleintragList.filter((l) => l.id !== lebensmitteleintrag.id)
        setLebensmitteleintragList(newLebensmitteleintragList)
    }

    const handleLebensmittelAddClicked = () => {
        setOpenLebensmittelForm(true)
    }

    const handleLebensmittelFormClosed = () => {
        setOpenLebensmittelForm(false)
    }

    const handleEinkaufsWagenChecked = (e) => {
        console.log("einkaufswagenLebensmitteleintragTobeAddedList", einkaufswagenLebensmitteleintragTobeAddedList)
      let einkaufswageLebensmitteleintragTobeAdded = lebensmitteleintragList.find((lebensmitteleintrag) => lebensmitteleintrag.id === parseInt(e.target.id))
      if(e.target.checked){
        setEinkaufswagenLebensmitteleintragTobeAddedList([...einkaufswagenLebensmitteleintragTobeAddedList, einkaufswageLebensmitteleintragTobeAdded])
      }
      else{
        setEinkaufswagenLebensmitteleintragTobeAddedList(einkaufswagenLebensmitteleintragTobeAddedList.filter((lebensmitteleintrag) => lebensmitteleintrag.id !== parseInt(e.target.id)))
      }
      setEinkaufsWagenChecked(e.target.checked)
    }

    const addToEinkaufswagenBtnClicked = () => {
      if(einkaufswagenLebensmitteleintragTobeAddedList.length > 0){
        setEinkaufswagenAddClicked(true)
      }
      else{
        setEinkaufswagenAddSuccess(true)
        setEinkaufslisteMeldung("Keine Lebensmittel ausgewählt")
      }
    }
    const addToEinkaufsliste = async () => {
      einkaufswagenLebensmitteleintragTobeAddedList.forEach((lebensmitteleintrag) => {
        let newLebensmitteleintrag = new LebensmitteleintragBO(kuehlschrank.id, "Kuehlschrank", lebensmitteleintrag.lebensmittel_id, lebensmitteleintrag.menge_id)
          FoodAPI.getAPI().createLebensmitteleintrag(newLebensmitteleintrag).then((leintrag)=>{
            FoodAPI.getAPI().deleteLebensmitteleintrag(lebensmitteleintrag.id, true).then((l)=>{
                setLebensmitteleintragList(lebensmitteleintragList.filter((l) => l.id !== lebensmitteleintrag.id))
            })
          })
        })
        setEinkaufswagenLebensmitteleintragTobeAddedList([])
        setEinkaufslisteMeldung("Der Kuehlschrank wurde erfolgreich erweitert")
        setEinkaufswagenAddSuccess(true)
        setEinkaufswagenAddClicked(false)
    }

    const getKuehlschrankByHaushaltId = (haushaltId) => {
        FoodAPI.getAPI().getKuehlschrankById(haushaltId).then((kuehlschrank)=>{
            setKuehlschrank(kuehlschrank[0])
        })
    }

  useEffect(() => {
    getEinkaufslisteByHaushaltId(id)
    getKuehlschrankByHaushaltId(id)
  }, [user])
  return (
    <>
    <NavBar user={user} haushaltId={id} haushaltName={name}/>
<Box sx={{display:"flex", justifyContent:"center", alignItems:"center", flexDirection:"column", mt:"2rem" }}>
  <Box sx={{display:"flex", justifyContent:"center", alignItems:"center", flexDirection:"row", gap:"1rem", flexWrap:"wrap" }}>
<Typography variant='h4'>
  {name} Einkaufsliste
</Typography>
<Button variant='contained' onClick={handleLebensmittelAddClicked}>+ Lebensmittel hinzufügen</Button>
<Button variant="contained" onClick={addToEinkaufswagenBtnClicked}>zum Kuehlschrank hinzufügen</Button>
<LebensmittelEintragForm addLebensmittelEintragToParent={addLebensmittelEintragToParent} 
open={openLebensmittelForm} close={handleLebensmittelFormClosed} 
user={user} aufbewahrId={einkaufsliste && einkaufsliste.id} aufbewahrOrt={"Einkaufsliste"}/>
  </Box>
  <Box sx={{display:"flex", justifyContent:"center", alignItems:"center", flexDirection:"row", gap:".5rem", flexWrap:"wrap", mt:"2rem", width:"45%" }}>
    {lebensmitteleintragList.length > 0 ? lebensmitteleintragList.map((lebensmitteleintrag)=>
    <Box sx={{display:"flex", flexDirection:"row", gap:".5rem", width:"100%"}}>
     <LebensmittelEintragEntry key={lebensmitteleintrag.id} lebensmitteleintrag={lebensmitteleintrag} 
     user={user} removeLebensmittelEintrag={removeLebensmittelEintrag}/>
     <Checkbox  value={einkaufsWagenChecked} id={lebensmitteleintrag.id} onChange={handleEinkaufsWagenChecked}  />
     </Box>
    ): <div>Noch keine Lebensmittel</div>}
            <HaushaltDeleteDialog btnTitle="JA" deleteFunction={addToEinkaufsliste} close={() => setEinkaufswagenAddClicked(false)} 
            open={einkaufswagenAddClicked} dialogTitle="Einkaufsliste hinzufügen" dialogDesc="Bist du sicher, dass du diese Lebensmittel zu deiner Kuehlschrank hinzufügen möchtest?"/>
            <Dialog  open={einkaufswagenAddSuccess} onClose={() => setEinkaufswagenAddSuccess(false)}>
        <DialogTitle>Einkaufsliste</DialogTitle>
        <DialogContent>
            <Typography>{einkaufslisteMeldung}</Typography>
        </DialogContent>
        <DialogActions>
            <Button onClick={() => setEinkaufswagenAddSuccess(false)}>Schließen</Button>
        </DialogActions>
      </Dialog>
  </Box>
</Box>
     </>
  )
}

export default Einkaufsliste