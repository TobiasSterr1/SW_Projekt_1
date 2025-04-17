import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from '@mui/material';
import React, { useState, useEffect } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import HaushaltBO from '../../api/HaushaltBO';
import FoodAPI from '../../api/FoodAPI';
import HaushaltsmitgliedBO from '../../api/HaushaltsmitgliedBO';

const CreateHaushaltDialog = ({ open, close, user, updateHaushalt }) => {
  // Zustände für den Haushaltsnamen, Ladezustand und Formularvalidierung
  const [haushaltname, setHaushaltname] = useState('');
  const [loading, setLoading] = useState(false);
  const [formValid, setFormValid] = useState(false);
    
  // Funktion zum Speichern eines neuen Haushalts
  const saveHaushalt = () => {
    setLoading(true);
    let h = new HaushaltBO();
    h.setName(haushaltname);
    h.setOwnerId(user.id);
    FoodAPI.getAPI()
      .createHaushalt(h)
      .then((haushalt) => {
        addHaushaltMitglied(haushalt);
      });
  };

  // Funktion zum Hinzufügen eines Haushaltsmitglieds nach Erstellung des Haushalts
  const addHaushaltMitglied = (haushalt) => {
    let m = new HaushaltsmitgliedBO(user.id, haushalt.id);
    FoodAPI.getAPI()
      .createHaushaltsmitglied(m)
      .then((haushaltsmitglied) => {
        setLoading(false);
        updateHaushalt(haushaltsmitglied);
      });
  };

  // Effekt zur Überprüfung der Formularvalidität basierend auf dem Haushaltsnamen
  useEffect(() => {
    if (haushaltname.trim()) {
      setFormValid(true);
    } else {
      setFormValid(false);
    }
  }, [haushaltname]);

  return (
    // Dialog-Komponente, die nur bei geöffnetem Zustand sichtbar ist
    open && (
      <Dialog open={open} onClose={() => close()}>
        <DialogTitle>
          Haushalt erstellen
          <IconButton onClick={() => close()} sx={{ position: 'absolute', right: '1rem' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', alignItems: 'flex-end', my: '1rem' }}>
            <TextField
              id="haushaltname"
              label="Haushaltname"
              value={haushaltname}
              onChange={(e) => setHaushaltname(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            onClick={saveHaushalt}
            disabled={loading || !formValid}
            startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
          >
            Speichern
          </Button>
        </DialogActions>
      </Dialog>
    )
  );
};

export default CreateHaushaltDialog;