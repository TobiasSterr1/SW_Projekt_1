/**
 * Die Kuehlschrank-Komponente ist verantwortlich für die Darstellung und Verwaltung
 * der Inhalte eines Kühlschranks für einen spezifischen Haushalt. Sie ermöglicht es
 * Benutzern, Lebensmitteleinträge hinzuzufügen, zu entfernen und anzuzeigen. */

import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import FoodAPI from '../../api/FoodAPI';
import { Box, Button, Typography } from '@mui/material';
import LebensmittelEintragForm from '../Kuehlschrank/LebensmittelEintragForm';
import LebensmittelEintragEntry from '../Kuehlschrank/LebensmittelEintragEntry';
import NavBar from '../NavBar';

const Kuehlschrank = ({user}) => {
  const { id, name } = useParams();
  const [kuehlschrank, setKuehlschrank] = useState(null)
  const [lebensmitteleintragList, setLebensmitteleintragList] = useState([])
  const [openLebensmittelForm, setOpenLebensmittelForm] = useState(false)

  const getKuehlschrankById = (id) => {
    FoodAPI.getAPI().getKuehlschrankById(id).then((k)=>{
      setKuehlschrank(k[0])
      getLebensmitteleintragList(k[0])
    })
  }

   const handleLebensmittelAddClicked = () => {
    setOpenLebensmittelForm(true)
  }

  const handleLebensmittelFormClosed = () => {
    setOpenLebensmittelForm(false)
  }

  const removeLebensmittelEintrag = (lebensmitteleintrag) => {
    let newLebensmitteleintragList = lebensmitteleintragList.filter((l) => l.id !== lebensmitteleintrag.id)
    setLebensmitteleintragList(newLebensmitteleintragList)
  }

  const getLebensmitteleintragList = (kuehlschrank) => {
    FoodAPI.getAPI().getLebensmitteleintragByAufbewahrOrt("Kuehlschrank", kuehlschrank.id).then((lebensmitteleintragList)=>{
      setLebensmitteleintragList(lebensmitteleintragList)
    })
  }

  const addLebensmittelEintragToParent = (lebensmitteleintrag) => {
    let newLebensmitteleintragList = [...lebensmitteleintragList, lebensmitteleintrag]
    setLebensmitteleintragList(newLebensmitteleintragList)
    handleLebensmittelFormClosed()
  }
  useEffect(() => {
    if(id){
      getKuehlschrankById(id)
    }
  }, [id])
  
  return (
    <>
        <NavBar user={user} haushaltId={id} haushaltName={name}/>
    <Box sx={{display:"flex", justifyContent:"center", alignItems:"center", flexDirection:"column", mt:"2rem" }}>
      <Box sx={{display:"flex", justifyContent:"center", alignItems:"center", flexDirection:"row", gap:"1rem", flexWrap:"wrap" }}>
    <Typography variant='h4'>
      {name} Kuehlschrank
    </Typography>
    <Button variant='contained' onClick={handleLebensmittelAddClicked}>+ Lebensmittel hinzufügen</Button>
    <LebensmittelEintragForm addLebensmittelEintragToParent={addLebensmittelEintragToParent} 
    open={openLebensmittelForm} close={handleLebensmittelFormClosed} 
    user={user} aufbewahrId={kuehlschrank && kuehlschrank.id} aufbewahrOrt={"Kuehlschrank"}/>
      </Box>
      <Box sx={{display:"flex", justifyContent:"center", alignItems:"center", flexDirection:"row", gap:".5rem", flexWrap:"wrap", mt:"2rem", width:"45%" }}>
        {lebensmitteleintragList.length > 0 ? lebensmitteleintragList.map((lebensmitteleintrag)=>
         <LebensmittelEintragEntry key={lebensmitteleintrag.id} lebensmitteleintrag={lebensmitteleintrag} 
         user={user} removeLebensmittelEintrag={removeLebensmittelEintrag}/>
        ): <div>Noch keine Lebensmittel</div>}
      </Box>
    </Box>
         </>
  )
}

export default Kuehlschrank