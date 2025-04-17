import {
  Autocomplete,
  Box,
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import FoodAPI from '../../api/FoodAPI';
import AddIcon from '@mui/icons-material/Add';
import LebensmittelForm from './LebensmittelForm';
import MasseinheitForm from './MasseinheitForm';
import LebensmitteleintragBO from '../../api/LebensmitteleintragBO';
import MengeBO from '../../api/MengeBO';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import HaushaltDeleteDialog from '../Haushalt/HaushaltDeleteDialog';

const LebensmittelEintragForm = ({
  open,
  close,
  lebensmitteleintrag,
  lebensmittelProp,
  mengeProp,
  masseinheitProp,
  user,
  aufbewahrId,
  aufbewahrOrt,
  addLebensmittelEintragToParent,
  updateMengeInParent,
  updateLebensmitteleintragInParent,
}) => {
  const [lebensmittel, setLebensmittel] = useState(null); // State für das ausgewählte Lebensmittel
  const [inputLebensmittel, setInputLebensmittel] = useState(""); // State für den Eingabewert des Lebensmittels
  const [masseinheit, setMasseinheit] = useState(null); // State für die ausgewählte Maßeinheit
  const [menge, setMenge] = useState(0); // State für die Menge
  const [inputMasseinheit, setInputMasseinheit] = useState(""); // State für den Eingabewert der Maßeinheit
  const [lebensmittelList, setLebensmittelList] = useState([]);  // State für die Liste der Lebensmittel
  const [masseinheitList, setMasseinheitList] = useState([]); // State für die Liste der Maßeinheiten
  const [openAddMasseinheitDialog, setOpenAddMasseinheitDialog] = useState(false); // State für die Anzeige des Dialogs zum Hinzufügen einer Maßeinheit
  const [openAddLebensmittelDialog, setOpenAddLebensmittelDialog] = useState(false); // State für die Anzeige des Dialogs zum Hinzufügen eines Lebensmittels
  const [mengenObject, setMengenObject] = useState(null);  // State für das Objekt der Menge
  const [formValid, setFormValid] = useState(false); // State für die Validierung des Formulars
  const [openEditLebensmittelDialog, setOpenEditLebensmittelDialog] = useState(false); // State für die Anzeige des Dialogs zum Bearbeiten eines Lebensmittels
  const [openDeleteLebensmittelDialog, setOpenDeleteLebensmittelDialog] = useState(false); // State für die Anzeige des Dialogs zum Löschen eines Lebensmittels
  const [openEditMasseinheitDialog, setOpenEditMasseinheitDialog] = useState(false); // State für die Anzeige des Dialogs zum Bearbeiten einer Maßeinheit
  const [openDeleteMasseinheitDialog, setOpenDeleteMasseinheitDialog] = useState(false); // State für die Anzeige des Dialogs zum Löschen einer Maßeinheit
  const [lebensmittelToDelete, setLebensmittelToDelete] = useState(null); // State für das Lebensmittel, das gelöscht werden soll
  const [masseinheitToDelete, setMasseinheitToDelete] = useState(null); // State für die Maßeinheit, die gelöscht werden soll
  const [lebensmittelToEdit, setLebensmittelToEdit] = useState(null); // State für das Lebensmittel, das bearbeitet werden soll
  const [masseinheitToEdit, setMasseinheitToEdit] = useState(null); // State für die Maßeinheit, die bearbeitet werden soll

  // Funktion zum Abrufen der Liste aller Lebensmittel
  const getLebensmittelList = () => {
    FoodAPI.getAPI().getAllLebensmittel().then((lebensmittelList) => {
      setLebensmittelList(lebensmittelList);
    });
  };

  // Funktion zum Abrufen der Liste aller Maßeinheiten
  const getMasseinheitList = () => {
    FoodAPI.getAPI().getAllMasseinheit().then((masseinheitList) => {
      setMasseinheitList(masseinheitList);
    });
  };

  // Handler zum Öffnen des Dialogs zum Hinzufügen eines Lebensmittels
  const handleAddLebensmittelDialog = () => {
    setOpenAddLebensmittelDialog(true);
  };

  // Handler zum Öffnen des Dialogs zum Hinzufügen einer Maßeinheit
  const handleAddMasseinheitDialog = () => {
    setOpenAddMasseinheitDialog(true);
  };

  // Handler zum Schließen des Dialogs zum Hinzufügen eines Lebensmittels
  const handleCloseAddLebensmittelDialog = () => {
    setOpenAddLebensmittelDialog(false);
  };

  // Handler zum Schließen des Dialogs zum Hinzufügen einer Maßeinheit
  const handleCloseAddMasseinheitDialog = () => {
    setOpenAddMasseinheitDialog(false);
  };

  // Funktion zum Hinzufügen eines neuen Lebensmittels zur Liste der Lebensmittel
  const addLebensmittelToParent = (lebensmittel) => {
    let newLebensmittelList = [...lebensmittelList, lebensmittel];
    setLebensmittelList(newLebensmittelList); // Aktualisieren der Liste der Lebensmittel im State
    handleCloseAddLebensmittelDialog(); // Schließen des Dialogs zum Hinzufügen eines Lebensmittels
  };

  // Funktion zum Hinzufügen einer neuen Maßeinheit zur Liste der Maßeinheiten
  const addMasseinheitToParent = (masseinheit) => {
    let newMasseinheitList = [...masseinheitList, masseinheit];
    setMasseinheitList(newMasseinheitList); // Aktualisieren der Liste der Maßeinheiten im State
    handleCloseAddMasseinheitDialog(); // Schließen des Dialogs zum Hinzufügen einer Maßeinheit
  };

  // Handler zum Speichern des Lebensmitteleintrags
  const handleSaveLebensmittelEintrag = () => {
    if (mengeProp && masseinheitProp && lebensmittelProp) {
      // Fall: Bearbeiten eines vorhandenen Eintrags
      let updatedMengenObject = Object.assign(new MengeBO, mengenObject); // Erstellen eines neuen Mengenobjekts
      updatedMengenObject.setMasseinheitId(masseinheit.id); // Setzen der Maßeinheits-ID im Mengenobjekt
      updatedMengenObject.setMengenAnzahl(parseInt(menge)); // Setzen der Mengenanzahl im Mengenobjekt
      FoodAPI.getAPI().updateMenge(updatedMengenObject).then((m) => {
        let updatedLebensmitteleintrag = Object.assign(new LebensmitteleintragBO, lebensmitteleintrag); // Erstellen eines neuen Lebensmitteleintrags
        updatedLebensmitteleintrag.setLebensmittelId(lebensmittel.id); //Setzen der Lebensmittel-ID im Lebensmitteleintrag
        updatedLebensmitteleintrag.setMengeId(m.id); // Setzen der Mengen-ID im Lebensmitteleintrag
        FoodAPI.getAPI().updateLebensmitteleintrag(updatedLebensmitteleintrag).then((lebensmitteleintrag) => {
          updateLebensmitteleintragInParent(lebensmitteleintrag); // Aufrufen der Funktion in der übergeordneten Komponente
          close(); // Schließen des Dialogs
        });
      });
    } else {
      // Fall: Hinzufügen eines neuen Eintrags
      let newMengeObject = new MengeBO(menge, masseinheit.id);  // Erstellen eines neuen Mengenobjekts
      FoodAPI.getAPI().createMenge(newMengeObject).then((mengeObject) => {
        // Erstellen der Menge über die API
        let newLebensmitteleintrag = new LebensmitteleintragBO(aufbewahrId, aufbewahrOrt, lebensmittel.id, mengeObject.id); // Erstellen eines neuen Lebensmitteleintrags
        FoodAPI.getAPI().createLebensmitteleintrag(newLebensmitteleintrag).then((lebensmitteleintrag) => {
          // Erstellen des Lebensmitteleintrags über die API
          addLebensmittelEintragToParent(lebensmitteleintrag); // Aufrufen der Funktion in der übergeordneten Komponente
        });
      });
    }
  };

  // Effekt-Hook zum Laden der Liste der Lebensmittel und Maßeinheiten beim Start der Komponente oder bei Änderung der Props
  useEffect(() => {
    getLebensmittelList(); // Laden der Liste der Lebensmittel
    getMasseinheitList(); // Laden der Liste der Maßeinheiten
    // Initialisieren der Zustände mit den übergebenen Props (falls vorhanden)
    if (mengeProp && masseinheitProp && lebensmittelProp) {
      setLebensmittel(lebensmittelProp);
      setMasseinheit(masseinheitProp);
      setMenge(mengeProp.mengenanzahl);
      setMengenObject(mengeProp);
    }
  }, [mengeProp, masseinheitProp, lebensmittelProp]);

  const handleEditLebensmittelClicked = (lebensmittel) => {
    setOpenEditLebensmittelDialog(true)
    setLebensmittelToEdit(lebensmittel)
  }

  const handleDeleteLebensmittelClicked = (lebensmittel) => {
    setOpenDeleteLebensmittelDialog(true)
    setLebensmittelToDelete(lebensmittel)
  }

  const handleEditMasseinheitClicked = (masseinheit) => {
    setOpenEditMasseinheitDialog(true)
    setMasseinheitToEdit(masseinheit)
  }

  const handleDeleteMasseinheitClicked = (masseinheit) => {
    setOpenDeleteMasseinheitDialog(true)
    setMasseinheitToDelete(masseinheit)
  }

  const updateLebensmittelInParent = (lebensmittel) => {
    let newLebensmittelList = lebensmittelList.map((l) => l.id === lebensmittel.id ? lebensmittel : l)
    setLebensmittelList(newLebensmittelList)
    setOpenEditLebensmittelDialog(false)
  }

  const updateMasseinheitInParent = (masseinheit) => {
    let newMasseinheitList = masseinheitList.map((m) => m.id === masseinheit.id ? masseinheit : m)
    setMasseinheitList(newMasseinheitList)
    setOpenEditMasseinheitDialog(false)
  }

  const deleteMasseinheit = () => {
    FoodAPI.getAPI().deleteMasseinheit(masseinheitToDelete.id).then((m)=>{
      setMasseinheitList(masseinheitList.filter((m) => m.id !== masseinheitToDelete.id))
      setOpenDeleteMasseinheitDialog(false)
    })
  }

  const deleteLebensmittel = () => {
    FoodAPI.getAPI().deleteLebensmittel(lebensmittelToDelete.id).then((l)=>{
      setLebensmittelList(lebensmittelList.filter((l) => l.id !== lebensmittelToDelete.id))
      setOpenDeleteLebensmittelDialog(false)
    })
  }

  // Effekt-Hook zur Validierung des Formulars basierend auf den Eingaben
  useEffect(() => {
    if (lebensmittel && masseinheit && menge > 0) {
      setFormValid(true); // Formular ist gültig, wenn Lebensmittel, Maßeinheit und Menge vorhanden sind
    } else {
      setFormValid(false); // Andernfalls ist das Formular ungültig
    }
  }, [lebensmittel, masseinheit, menge]);

  return (
    <Dialog open={open} onClose={() => close()}>
      <DialogTitle>Lebensmittel hinzufügen</DialogTitle>
      <DialogContent sx={{ p: '1rem' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Autocomplete
            disablePortal
            value={lebensmittel}
            onChange={(event, newValue) => {
              setLebensmittel(newValue);
            }}
            inputValue={inputLebensmittel}
            onInputChange={(event, newInputValue) => {
              setInputLebensmittel(newInputValue);
            }}
            id="combo-box-demo"
            options={lebensmittelList}
            getOptionLabel={(option) => option.bezeichnung}
            renderOption={(props, option) => 
              <Box  key={option.id} sx={{display:"flex", flexDirection:"row", alignItems:"center", justifyContent:"space-between", borderBottom:"1px solid #E5EBFF", py:".5rem", px:"1rem"}}>
              <Typography {...props}>{console.log( "TEST",option, user.id)}
                {option.bezeichnung}
              </Typography>
              {option.ersteller_id === user.id &&
              <ButtonGroup sx={{display:"flex", flexDirection:"row", alignItems:"center", gap:".25rem"}}>
              <IconButton sx={{backgroundColor:"#F1F6FF", p:".5rem",}} onClick={(event) => {
                        event.stopPropagation(); // Prevent triggering the onChange of Autocomplete
                        handleEditLebensmittelClicked(option)
                      }}>  
                <EditIcon />
              </IconButton>
              <IconButton sx={{backgroundColor:"#F1F6FF", p:".5rem",}}      onClick={(event) => {
                        event.stopPropagation(); // Prevent triggering the onChange of Autocomplete
                        handleDeleteLebensmittelClicked(option)
                      }}>
                <DeleteIcon />
              </IconButton>
              </ButtonGroup>
              }
              </Box>
            }
            sx={{ width: 300, mt: '1rem' }}
            renderInput={(params) => <TextField {...params} label="Lebensmittel" />}
          />
          <IconButton
            sx={{ backgroundColor: '#F1F6FF', p: '.5rem', mt: '1rem', ml: '1rem' }}
            onClick={handleAddLebensmittelDialog}
          >
            <AddIcon />
          </IconButton>
          <LebensmittelForm
            open={openAddLebensmittelDialog}
            handleClose={handleCloseAddLebensmittelDialog}
            user={user}
            addLebensmittelToParent={addLebensmittelToParent}
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Autocomplete
            value={masseinheit}
            onChange={(event, newValue) => {
              setMasseinheit(newValue);
            }}
            inputValue={inputMasseinheit}
            onInputChange={(event, newInputValue) => {
              setInputMasseinheit(newInputValue);
            }}
            id="combo-box-demo"
            options={masseinheitList}
            getOptionLabel={(option) => option.bezeichnung}
            renderOption={(props, option) => (
              <Box key={option.id} sx={{display:"flex", flexDirection:"row", alignItems:"center", justifyContent:"space-between", borderBottom:"1px solid #E5EBFF", py:".5rem", px:"1rem"}}>
              <Typography {...props}>
                {option.bezeichnung} ({option.umrechnungs_wert} {option.ist_volumen ? 'ml' : 'g'})
              </Typography>
              {option.eigentuemer_id === user.id &&
              <ButtonGroup sx={{display:"flex", flexDirection:"row", alignItems:"center", gap:".25rem"}}>
              <IconButton sx={{backgroundColor:"#F1F6FF", p:".5rem",}}  onClick={(event) => {
                        event.stopPropagation(); // Prevent triggering the onChange of Autocomplete
                        handleEditMasseinheitClicked(option)
                      }}>
                <EditIcon />
              </IconButton>
              <IconButton sx={{backgroundColor:"#F1F6FF", p:".5rem",}}    onClick={(event) => {
                        event.stopPropagation(); // Prevent triggering the onChange of Autocomplete
                        handleDeleteMasseinheitClicked(option);
                      }}>
                <DeleteIcon />
              </IconButton>
              </ButtonGroup>
              }
              </Box>
            )}
            sx={{ width: 300, mt: '1rem' }}
            renderInput={(params) => <TextField {...params} label="Masseinheit" />}
          />
          <IconButton
            sx={{ backgroundColor: '#F1F6FF', p: '.5rem', mt: '1rem', ml: '1rem' }}
            onClick={handleAddMasseinheitDialog}
          >
            <AddIcon />
          </IconButton>
          <MasseinheitForm
            open={openAddMasseinheitDialog}
            handleClose={handleCloseAddMasseinheitDialog}
            user={user}
            addMasseinheitToParent={addMasseinheitToParent}
          />
        </Box>
        <TextField
          id="menge"
          label="Menge"
          variant="standard"
          value={menge}
          sx={{ maxWidth: 300, mt: '2rem', ml: '.5rem' }}
          type="number"
          onChange={(e) => setMenge(e.target.value)}
        />
        <Box sx={{ pl: '.5rem' }}>
          {masseinheit && menge && `Gesamtmenge: ${menge * masseinheit.umrechnungs_wert} ${masseinheit.ist_volumen ? 'ml' : 'g'}`}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={handleSaveLebensmittelEintrag} disabled={!formValid}>
          Speichern
        </Button>
        <Button variant="contained" onClick={() => close()}>
          Abbrechen
        </Button>
      </DialogActions>
      {openEditLebensmittelDialog &&
      <LebensmittelForm updateLebensmittelInParent={updateLebensmittelInParent} handleClose={() => {setOpenEditLebensmittelDialog(false)}} 
      open={openEditLebensmittelDialog} user={user} lebensmittelProp={lebensmittelToEdit}/>
      }
      {openDeleteLebensmittelDialog &&
      <HaushaltDeleteDialog open={openDeleteLebensmittelDialog} close={() => {setOpenDeleteLebensmittelDialog(false)}} 
      deleteFunction={deleteLebensmittel} dialogTitle="Lebensmittel löschen" dialogDesc="Möchten Sie dieses Lebensmittel wirklich löschen?" 
      btnTitle="Löschen" user={user} />
      }
      {openEditMasseinheitDialog &&
      <MasseinheitForm updateMasseinheitInParent={updateMasseinheitInParent} handleClose={() => {setOpenEditMasseinheitDialog(false)}} 
      open={openEditMasseinheitDialog} user={user} masseinheitProp={masseinheitToEdit}/>
      }
      {openDeleteMasseinheitDialog &&
      <HaushaltDeleteDialog open={openDeleteMasseinheitDialog} close={() => {setOpenDeleteMasseinheitDialog(false)}} 
      deleteFunction={deleteMasseinheit} dialogTitle="Maßeinheit löschen" dialogDesc="Möchten Sie diese Maßeinheit wirklich löschen?" 
      btnTitle="Löschen" user={user} />
      }
    </Dialog>
  );
};

export default LebensmittelEintragForm;