/**
 * Die Rezepte-Komponente verwaltet die Anzeige und Verwaltung von Rezepten für einen bestimmten Haushalt.
 */

import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';
import FoodAPI from '../../api/FoodAPI';
import NavBar from '../NavBar';
import { Box, Button, FormControlLabel, FormGroup, Switch } from '@mui/material';
import RezeptForm from '../Rezept/RezeptForm';
import RezeptCard from '../Rezept/RezeptCard';
import CachedIcon from '@mui/icons-material/Cached';
import { set } from 'firebase/database';

const Rezepte = ({user}) => {
    const { id, name } = useParams();
    const [rezepte, setRezepte] = React.useState([])
    const [openRezeptForm, setOpenRezeptForm] = React.useState(false)
    const [allRezepte, setAllRezepte] = React.useState(false)
    const [allRezepteList, setAllRezepteList] = React.useState(false)
  
    const getAllRezepte = () => {
      FoodAPI.getAPI().getAllRezepte(id).then((rezepte)=>{
        setRezepte(rezepte)
      })
    }
  
    const getAllRezepteHaushalt = () => {
      FoodAPI.getAPI().getAllRezepteHaushalt(id).then((rezepte)=>{
        setAllRezepteList(rezepte)
      })
    }
    const addRezept = (rezept) => {
      let newRezepte = [...rezepte, rezept]
      let newAllRezepteList = [...allRezepteList, rezept]
      setRezepte(newRezepte)
      setAllRezepteList(newAllRezepteList)
    }
  const deleteRezeptInParent = (rezept) => {
    let newRezepte = rezepte.filter((r) => r.id !== rezept.id)
    let newAllRezepteList = allRezepteList.filter((r) => r.id !== rezept.id)
    setAllRezepteList(newAllRezepteList)
    setRezepte(newRezepte)
  }

  const updateRezept = (rezept) => {
    let newRezepte = rezepte.map((r) => r.id === rezept.id ? rezept : r)
    let newAllRezepteList = allRezepteList.map((r) => r.id === rezept.id ? rezept : r)
    setAllRezepteList(newAllRezepteList)  
    setRezepte(newRezepte)
  }

  useEffect(() => {
    getAllRezepte()
    getAllRezepteHaushalt()
  }, [])

  return (
    <>
      <NavBar user={user} haushaltId={id} haushaltName={name}/>
      <Box sx={{display:"flex", justifyContent:"center", alignItems:"center", flexDirection:"column", mt:"2rem" }}>
        <Box sx={{display:"flex", justifyContent:"center", alignItems:"center", flexDirection:"row", gap:"1rem", flexWrap:"wrap" }}>
        <Button variant='contained' onClick={() => {setOpenRezeptForm(true)}}>+ Rezept hinzufügen</Button>
        <Button variant='contained' onClick={getAllRezepte} startIcon={<CachedIcon/>}>Rezepte neuladen</Button>
        <FormGroup>
      <FormControlLabel control={<Switch checked={allRezepte}
  onChange={() => {setAllRezepte(!allRezepte)}} />} label={allRezepte ? "Verfügbare Rezepte" : "Alle Rezepte anzeigen"} /> 
    </FormGroup>
        </Box>
        <RezeptForm open={openRezeptForm} 
        close={() => {setOpenRezeptForm(false)}} user={user} addRezeptToParent={addRezept} updateRezeptInParent={updateRezept} removeRezeptFromParent={1}/>
        <Box sx={{display:"flex", justifyContent:"center", alignItems:"center", flexDirection:"row", gap:"1rem", flexWrap:"wrap", mt:"2rem", width:"45%" }}>
          {allRezepte ? 
        rezepte.length > 0 ? rezepte.map((rezept)=>
          <RezeptCard key={rezept.id} reloadRezepte={getAllRezepte} rezept={rezept}  user={user} deleteRezeptInParent={deleteRezeptInParent} updateRezeptInParent={updateRezept}/>
        ): <div>Noch keine Rezepte</div>
      :  allRezepteList.length > 0 ? allRezepteList.map((rezept)=>
        <RezeptCard  reloadRezepte={getAllRezepte} rezept={rezept} key={rezept.id} user={user} deleteRezeptInParent={deleteRezeptInParent} updateRezeptInParent={updateRezept}/>
      ): <div>Noch keine Rezepte</div>}
        </Box>
      </Box>
    </>
  )
}

export default Rezepte