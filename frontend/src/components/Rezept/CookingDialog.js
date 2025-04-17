/**
 * Die CookingDialog-Komponente ermöglicht es Benutzern, ein Rezept zu kochen, indem sie fehlende Zutaten auswählen
 * und sie ihrer Einkaufsliste hinzufügen. Hier ist eine Zusammenfassung des Codes:
 */
import { Box, Button, ButtonGroup, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import LebensmittelEintragEntry from '../Kuehlschrank/LebensmittelEintragEntry'
import FoodAPI from '../../api/FoodAPI'
import { useParams } from 'react-router-dom'
import LebensmitteleintragBO from '../../api/LebensmitteleintragBO'
import { set } from 'firebase/database'
import HaushaltDeleteDialog from '../Haushalt/HaushaltDeleteDialog'

const CookingDialog = ({open, close, rezept, user, missingLebensmitteleintragList,  reloadRezepte}) => {
    const {id, name} = useParams()
    const [einkaufswagen, setEinkaufswagen] = React.useState(null)
    const [einkaufsWagenChecked, setEinkaufsWagenChecked] = React.useState(false)
    const [einkaufswagenLebensmitteleintragTobeAddedList, setEinkaufswagenLebensmitteleintragTobeAddedList] = React.useState([])
    const [einkaufswagenAddClicked, setEinkaufswagenAddClicked] = React.useState(false)
    const [einkaufswagenAddSuccess, setEinkaufswagenAddSuccess] = React.useState(false)
    const [einkaufslisteMeldung, setEinkaufslisteMeldung] = React.useState("")
    const handleCookingProcess = () => {
     FoodAPI.getAPI().cookRezept(rezept.id, id).then((h)=>{
       reloadRezepte()
       close()
      })
    }
    const handleEinkaufsWagenChecked = (e) => {
      let einkaufswageLebensmitteleintragTobeAdded = missingLebensmitteleintragList.find((lebensmitteleintrag) => lebensmitteleintrag.id === parseInt(e.target.id))
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
        let newLebensmitteleintrag = new LebensmitteleintragBO(einkaufswagen.id, "Einkaufsliste", lebensmitteleintrag.lebensmittel_id, lebensmitteleintrag.menge_id)
          FoodAPI.getAPI().createLebensmitteleintrag(newLebensmitteleintrag).then((leintrag)=>{
          })
        })
        setEinkaufswagenLebensmitteleintragTobeAddedList([])
        setEinkaufslisteMeldung("Die Einkaufsliste wurde erfolgreich erweitert")
        setEinkaufswagenAddSuccess(true)
        setEinkaufswagenAddClicked(false)
    }

    const getEinkaufswagen = () => {
      FoodAPI.getAPI().getEinkaufslisteByHaushaltId(id).then((einkaufsliste)=>{
        setEinkaufswagen(einkaufsliste[0])
      })}

    useEffect(() => {
      getEinkaufswagen()
    }
    , [])
    
    return (
      <Dialog open={open} onClose={() => close()} > 
      <DialogTitle>Rezept kochen</DialogTitle>
      <DialogContent sx={{display: 'flex', flexDirection: 'column', gap: 1}}>
      {missingLebensmitteleintragList.length > 0 &&<p>Folgende Zutaten fehlen dir noch momentan:</p>}
        {missingLebensmitteleintragList.length > 0 ? missingLebensmitteleintragList.map((lebensmitteleintrag)=>
        <Box sx={{display:"flex", flexDirection:"row", gap:".5rem"}}>
          <LebensmittelEintragEntry missingMenge={lebensmitteleintrag && lebensmitteleintrag.fehlendeMenge} lebensmitteleintrag={lebensmitteleintrag} user={user} />
          <Checkbox  value={einkaufsWagenChecked} id={lebensmitteleintrag.id} onChange={handleEinkaufsWagenChecked}  />
        </Box>
        ): <p>Keine Fehlenden Lebensmittel</p>}
          {missingLebensmitteleintragList.length > 0 ?
          <Box>
            <Button variant="contained" onClick={addToEinkaufswagenBtnClicked}>zur Einkaufsliste hinzufügen</Button>
            <HaushaltDeleteDialog btnTitle="JA" deleteFunction={addToEinkaufsliste} close={() => setEinkaufswagenAddClicked(false)} 
            open={einkaufswagenAddClicked} dialogTitle="Einkaufsliste hinzufügen" dialogDesc="Bist du sicher, dass du diese Lebensmittel zu deiner Einkaufsliste hinzufügen möchtest?"/>
          <p>Sobald du alle fehlenden Zutaten besorgt hast, kannst du dein Rezept kochen!</p>
          </Box>
:<p>Mit dem Kochprozess werden automatisch alle nötigen Zutaten aus deinem Kuehlschrank verwertet</p>}
      </DialogContent>
      <DialogActions>
        {missingLebensmitteleintragList.length > 0 ?
        <Button onClick={() => close()}>Zurück</Button>
         :
        <Button onClick={handleCookingProcess}>Kochen</Button>}
      </DialogActions>
      <Dialog open={einkaufswagenAddSuccess} onClose={() => setEinkaufswagenAddSuccess(false)}>
        <DialogTitle>Einkaufsliste</DialogTitle>
        <DialogContent>
            <Typography>{einkaufslisteMeldung}</Typography>
        </DialogContent>
        <DialogActions>
            <Button onClick={() => setEinkaufswagenAddSuccess(false)}>Schließen</Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  )
}

export default CookingDialog