import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material'
import React from 'react'

const HaushaltDeleteDialog = ({open, close, deleteFunction, dialogTitle, dialogDesc, btnTitle}) => {
  // Die Komponente rendert einen Dialog für das Löschen eines Haushalts
  return (
    <Dialog open={open} onClose={() => close()}>
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent>
            <Typography>{dialogDesc}</Typography>
        </DialogContent>
        <DialogActions>
            <Button onClick={() => close()}>Abbrechen</Button>
            <Button onClick={() => deleteFunction()}>{btnTitle}</Button>
        </DialogActions>
    </Dialog>
  )
}

export default HaushaltDeleteDialog