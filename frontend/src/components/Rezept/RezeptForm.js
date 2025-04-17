/**Die RezeptForm-Komponente ermöglicht es Benutzern, ein neues 
 * Rezept zu erstellen oder ein vorhandenes Rezept zu bearbeiten. */

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import RezeptBO from '../../api/RezeptBO';
import FoodAPI from '../../api/FoodAPI';
import LebensmittelEintragForm from '../Kuehlschrank/LebensmittelEintragForm';
import LebensmittelEintragEntry from '../Kuehlschrank/LebensmittelEintragEntry';
import { useParams } from 'react-router-dom';

const RezeptForm = ({ open, close, user, addRezeptToParent, updateRezeptInParent, rezeptProp }) => {
  const [name, setName] = useState('');
  const [zubereitung, setZubereitung] = useState('');
  const [newRezept, setNewRezept] = useState(null);
  const [openAddLebensmittelEintragDialog, setOpenAddLebensmittelEintragDialog] = useState(false);
  const [anzahlPersonen, setAnzahlPersonen] = useState(0);
  const [lebensmittelEintragList, setLebensmittelEintragList] = useState([]);
  const [lebensmittelEintragForm, setLebensmittelEintragForm] = useState(false);
  const [formValid, setFormValid] = useState(false);
  const [lebensmittelFormValid, setLebensmittelFormValid] = useState(false);
  const { id } = useParams();


  const handleSaveRezept = () => {
    if (rezeptProp) {
      let updatedRezept = Object.assign(new RezeptBO(), rezeptProp);
      updatedRezept.setName(name);
      updatedRezept.setAnzahlPersonen(anzahlPersonen);
      updatedRezept.setZubereitung(zubereitung);
      FoodAPI.getAPI()
        .updateRezept(updatedRezept)
        .then((rezept) => {
          updateRezeptInParent(updatedRezept);
          close();
        });
    } else {
      let newRezept = new RezeptBO(user.id, name, anzahlPersonen, zubereitung, id);
      FoodAPI.getAPI()
        .createRezept(newRezept)
        .then((rezept) => {
          setNewRezept(rezept);
          setOpenAddLebensmittelEintragDialog(true);
          close();
        });
    }
  };

  const handleAddLebensmitteleintrag = (lebensmittelEintrag) => {
    let newLebensmittelEintragList = [...lebensmittelEintragList, lebensmittelEintrag];
    setLebensmittelEintragList(newLebensmittelEintragList);
    setLebensmittelEintragForm(false);
  };

  const handleCreateRezeptDone = () => {
    addRezeptToParent(newRezept);
    setOpenAddLebensmittelEintragDialog(false);
    setName('');
    setZubereitung('');
    setAnzahlPersonen(0);
    setLebensmittelEintragList([]);
  };

  const removeLebensmittelEintrag = (lebensmitteleintrag) => {
    let newLebensmittelEintragList = lebensmittelEintragList.filter((l) => l.id !== lebensmitteleintrag.id);
    setLebensmittelEintragList(newLebensmittelEintragList);
  };

  useEffect(() => {
    if (rezeptProp) {
      setName(rezeptProp.name);
      setAnzahlPersonen(rezeptProp.anzahl_personen);
      setZubereitung(rezeptProp.zubereitung);
    }
  }, [rezeptProp]);

  useEffect(() => {
    if (name.trim() && zubereitung.trim() && anzahlPersonen > 0) {
      setFormValid(true);
    } else {
      setFormValid(false);
    }
  }, [name, zubereitung, anzahlPersonen]);

  useEffect(() => {
    if (lebensmittelEintragList.length > 0) {
      setLebensmittelFormValid(true);
    } else {
      setLebensmittelFormValid(false);
    }
  }, [lebensmittelEintragList]);

  return (
    <>
      <Dialog open={open} onClose={() => close()}>
        <DialogTitle>Rezept erstellen</DialogTitle>
        <DialogContent sx={{ p: '1rem' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', gap: '1rem' }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
              <TextField
                variant="filled"
                id="name"
                label="Name"
                value={name}
                sx={{ maxWidth: 300, mt: '2rem', ml: '.5rem' }}
                onChange={(e) => setName(e.target.value)}
              />
              <TextField
                variant="filled"
                id="anzahlPersonen"
                label="Anzahl Personen"
                value={anzahlPersonen}
                sx={{ maxWidth: 300, mt: '2rem', ml: '.5rem' }}
                type="number"
                onChange={(e) => setAnzahlPersonen(e.target.value)}
              />
            </Box>
            <TextField
              variant="filled"
              id="zubereitung"
              label="Zubereitung"
              value={zubereitung}
              sx={{ width: '100%', mt: '2rem', ml: '.5rem' }}
              multiline
              onChange={(e) => setZubereitung(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleSaveRezept} disabled={!formValid}>
            Weiter
          </Button>
          <Button variant="contained" onClick={() => close()}>
            Abbrechen
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openAddLebensmittelEintragDialog} onClose={() => setOpenAddLebensmittelEintragDialog(false)}>
        <DialogTitle>Lebensmittel hinzufügen</DialogTitle>
        <DialogContent sx={{ p: '1rem' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', gap: '1rem' }}>
            <Button variant="contained" sx={{ ml: '.5rem' }} onClick={() => setLebensmittelEintragForm(true)}>
              Lebensmittel hinzufügen
            </Button>
            {lebensmittelEintragList.length > 0 ? (
              lebensmittelEintragList.map((lebensmittelEintrag) => (
                <LebensmittelEintragEntry
                  key={lebensmittelEintrag.id}
                  lebensmitteleintrag={lebensmittelEintrag}
                  removeLebensmittelEintrag={removeLebensmittelEintrag}
                  user={user}
                />
              ))
            ) : (
              <div>Noch keine Lebensmittel</div>
            )}
            <LebensmittelEintragForm
              open={lebensmittelEintragForm}
              close={() => setLebensmittelEintragForm(false)}
              user={user}
              addLebensmittelEintragToParent={handleAddLebensmitteleintrag}
              aufbewahrId={newRezept && newRezept.id}
              aufbewahrOrt="Rezept"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleCreateRezeptDone} disabled={!lebensmittelFormValid}>
            Fertig
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RezeptForm;