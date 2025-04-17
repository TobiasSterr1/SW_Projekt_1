import React, { useEffect, useState } from 'react'
import FoodAPI from '../../api/FoodAPI' // Import der FoodAPI aus der API
import { Avatar, IconButton, ListItem, ListItemAvatar, ListItemButton, ListItemText, Typography } from '@mui/material'
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt'; // Import des Icons für das Hinzufügen einer Person
import HaushaltsmitgliedBO from '../../api/HaushaltsmitgliedBO'; // Import der HaushaltsmitgliedBO aus der API
import PersonRemoveIcon from '@mui/icons-material/PersonRemove'; // Import des Icons für das Entfernen einer Person

// Komponente zur Darstellung einer Person in einem Haushaltseintrag
const PersonEntry = ({personId, ownerId, haushalt, addMitglied, removeMitglied, mitglied, loggedInUser}) => {
  const [person, setPerson] = useState(null) // State-Hook zur Verwaltung der Personendaten


  // Funktion zum Abrufen der Person anhand der ID
  const getPersonById = () => {
    FoodAPI.getAPI().getPersonById(personId).then((person)=>{
      setPerson(person[0]) // Setzen der Personendaten im State
    })
  }
  
  // Funktion zum Entfernen einer Person aus dem Haushalt
  const removePerson = () => {
    FoodAPI.getAPI().deleteHaushaltsmitglied(mitglied.id).then((h)=>{
      removeMitglied(mitglied) // Aufrufen der Funktion zum Entfernen des Mitglieds aus der Liste
    })
  }

  // Funktion zum Hinzufügen einer Person zum Haushalt
  const addPerson = () => {
    let newMitglied = new HaushaltsmitgliedBO( personId, haushalt.id) // Erstellen eines neuen Haushaltsmitglieds-Objekts
    FoodAPI.getAPI().createHaushaltsmitglied(newMitglied).then((haushaltsmitglied)=>{
      addMitglied(haushaltsmitglied) // Aufrufen der Funktion zum Hinzufügen des Mitglieds zur Liste
    })
  }

  // Effekt-Hook zum Abrufen der Personendaten bei Änderung der ID
  useEffect(() => {
      if(personId){
      getPersonById() // Aufrufen der Funktion zum Abrufen der Personendaten
    }
  }, [personId])
  
  // Rückgabekonstrukt der ListItem-Komponente für die Darstellung der Person
  return (
    <ListItem
    sx={{ display: 'flex', alignItems: 'center', backgroundColor:"#F1F6FF", py:"0.5rem", px:"1rem" , width:"100%", borderRadius:"8px" }}
    secondaryAction={
       loggedInUser && loggedInUser.id === ownerId &&
       ownerId !== personId ?
       mitglied ?
      <IconButton edge="end" onClick={removePerson}>
        <PersonRemoveIcon/>
      </IconButton>
        :
      <IconButton edge="end" onClick={addPerson}>
        <PersonAddAltIcon/>
      </IconButton>: null
    }
>
        <ListItemAvatar>
            <Avatar alt="Remy Sharp" src="" />
        </ListItemAvatar>
        <Typography sx={{width:"70%", textOverflow:"ellipsis"  }}>{person && person.benutzername}</Typography>
        {ownerId === personId ? <Typography sx={{textOverflow:"ellipsis", color:"green"  }}>Admin</Typography> : null}
    </ListItem>
  )
}

export default PersonEntry