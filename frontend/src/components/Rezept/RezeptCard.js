/**
 * Die RecipeCard-Komponente repräsentiert eine Karte für ein Rezept. Sie zeigt Informationen über das Rezept an,
 * ermöglicht das Bearbeiten und Löschen des Rezepts sowie das Hinzufügen von Lebensmitteleinträgen. Außerdem
 * können Benutzer das Rezept kochen und die Zubereitungsanleitung anzeigen lassen.
 */

import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import FoodAPI from '../../api/FoodAPI';
import LebensmittelEintragEntry from '../Kuehlschrank/LebensmittelEintragEntry';
import HaushaltDeleteDialog from '../Haushalt/HaushaltDeleteDialog';
import { Box, Button } from '@mui/material';
import LebensmittelEintragForm from '../Kuehlschrank/LebensmittelEintragForm';
import RezeptForm from './RezeptForm';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import CookingDialog from './CookingDialog';
import { useParams } from 'react-router-dom';

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function RecipeCard({rezept, user, deleteRezeptInParent, updateRezeptInParent, reloadRezepte}) {
  const { id, name } = useParams();
  const [expanded, setExpanded] = React.useState(false);
  const [eigentuemer, setEigentuemer] = React.useState(null);
  const [kuehlschrank, setKuehlschrank] = React.useState(null);
  const [lebensmitteleintragList, setLebensmitteleintragList] = React.useState([]);
  const [lebensmitteleintragListKuehlschrank, setLebensmitteleintragListKuehlschrank] = React.useState([]);
  const [missingLebensmitteleintragList, setMissingLebensmitteleintragList] = React.useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [openLebensmittelAddDialog, setOpenLebensmittelAddDialog] = React.useState(false);
  const [openRezeptEditDialog, setOpenRezeptEditDialog] = React.useState(false);
  const [cookingDialogOpen, setCookingDialogOpen] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const getEigentuemerById = () => {
    FoodAPI.getAPI().getPersonById(rezept.eigentuemer_id).then((res) => {
      setEigentuemer(res[0])
    })
  }
  const getLebensmitteleintragList = (rezept) => {
    FoodAPI.getAPI().getLebensmitteleintragByAufbewahrOrt("Rezept", rezept.id).then((lebensmitteleintragList)=>{
      setLebensmitteleintragList(lebensmitteleintragList)
      getKuehlschrankLebensmitteleintragList(lebensmitteleintragList)
    })
  }
  const getKuehlschrankLebensmitteleintragList = (lebensmitteleintragList) => {
    FoodAPI.getAPI().getKuehlschrankById(id).then((kuehlschrank) => {
        setKuehlschrank(kuehlschrank[0])
        FoodAPI.getAPI().getLebensmitteleintragByAufbewahrOrt("Kuehlschrank", kuehlschrank[0].id).then((lEintragListKuehlschrank)=>{
            setLebensmitteleintragListKuehlschrank(lEintragListKuehlschrank)
            compareLebensmitteleintragList(lEintragListKuehlschrank, lebensmitteleintragList)
        })
    })
  }

  const compareLebensmitteleintragList = async (kuehlschrankLebensmitteleintragList, rezeptLebensmitteleintragList) => {
    const missingEntries = await Promise.all(rezeptLebensmitteleintragList.map(async (rezeptEintrag) => {
      const matchingEintrag = kuehlschrankLebensmitteleintragList.find(
        kuehlschrankEintrag => kuehlschrankEintrag.lebensmittel_id === rezeptEintrag.lebensmittel_id
      );
      
      const rezeptMengeObj = await getMengeById(rezeptEintrag.menge_id);
      const rezeptMasseinheitObj = await getMasseinheitById(rezeptMengeObj.masseinheit_id);
      const rezeptMenge = rezeptMengeObj.mengenanzahl * rezeptMasseinheitObj.umrechnungs_wert;
      
      let kuehlschrankMenge = 0;
      if (matchingEintrag) {
        const kuehlschrankMengeObj = await getMengeById(matchingEintrag.menge_id);
        const kuehlschrankMasseinheitObj = await getMasseinheitById(kuehlschrankMengeObj.masseinheit_id);
        kuehlschrankMenge = kuehlschrankMengeObj.mengenanzahl * kuehlschrankMasseinheitObj.umrechnungs_wert;
      }
      
      const fehlendeMenge = rezeptMenge - kuehlschrankMenge;
      if (fehlendeMenge > 0) {
        return { ...rezeptEintrag, fehlendeMenge };
      }
      
      // Return null for entries where fehlendeMenge <= 0 to filter them out
      return null;
    })).then(entries => entries.filter(entry => entry !== null)); // Filter out null entries
  
    setMissingLebensmitteleintragList(missingEntries);
  };
  
  
  const getMengeById = async (mengeId) => {
    const menge = await FoodAPI.getAPI().getMengeById(mengeId);
    return menge[0];
  };
  
  const getMasseinheitById = async (masseinheitId) => {
    const masseinheit = await FoodAPI.getAPI().getMasseinheitById(masseinheitId);
    return masseinheit[0];
  };
  


  const removeLebensmittelEintrag = (lebensmitteleintrag) => {
    let newLebensmitteleintragList = lebensmitteleintragList.filter((l) => l.id !== lebensmitteleintrag.id)
    setLebensmitteleintragList(newLebensmitteleintragList)
  }

  const deleteRecipe = () => {
    FoodAPI.getAPI().deleteRezept(rezept.id).then(() => {
      setDeleteDialogOpen(false)
      deleteRezeptInParent(rezept)
    })
  }

  const addLebensmittelEintragToParent = (lebensmitteleintrag) => {
    let newLebensmitteleintragList = [...lebensmitteleintragList, lebensmitteleintrag]
    setLebensmitteleintragList(newLebensmitteleintragList)
    setOpenLebensmittelAddDialog(false)
  }

  const updateRezept = (rezept) => {
    updateRezeptInParent(rezept)
  }

  React.useEffect(() => {
    if(rezept){
        getEigentuemerById(rezept.eigentuemer_id)
        getLebensmitteleintragList(rezept)
    }
    }, [rezept])
  

  return (
    <Card sx={{ maxWidth: 345, minWidth: 300 }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            {eigentuemer && eigentuemer.benutzername.charAt(0)}
          </Avatar>
        }
        action={
          <Typography sx={{mt:"1rem", fontSize:".75rem"}}>Für {rezept && rezept.anzahl_personen} Person(en)</Typography>
        }
        title={rezept && rezept.name}
        subheader={`von ${eigentuemer && eigentuemer.benutzername}`} 
      />
      <CardContent sx={{display:"flex", flexDirection:"column", gap:".5rem", height:"200px", overflow:"auto"}}>
        <Button variant="outlined" onClick={() => setOpenLebensmittelAddDialog(true)}>Lebensmittel hinzufügen</Button>
        <LebensmittelEintragForm   user={user} aufbewahrId={rezept.id} aufbewahrOrt="Rezept" 
        addLebensmittelEintragToParent={addLebensmittelEintragToParent} close={() => setOpenLebensmittelAddDialog(false)} open={openLebensmittelAddDialog}/>
      {lebensmitteleintragList.length > 0 ? lebensmitteleintragList.map((lebensmitteleintrag)=>
         <LebensmittelEintragEntry key={lebensmitteleintrag.id} lebensmitteleintrag={lebensmitteleintrag} 
         user={user} removeLebensmittelEintrag={removeLebensmittelEintrag}/>
        ): <div>Noch keine Lebensmittel</div>}
      </CardContent>
      <CardActions disableSpacing>
        <Box sx={{display:"flex", flexDirection:"row", gap:".25rem"}}>
        <IconButton aria-label="edit" onClick={() => setOpenRezeptEditDialog(true)} sx={{backgroundColor: "#DFEFFF"}}>
          <DriveFileRenameOutlineIcon />
        </IconButton>
        <RezeptForm open={openRezeptEditDialog} rezept={rezept} close={() => setOpenRezeptEditDialog(false)} user={user} updateRezeptInParent={updateRezept} 
       rezeptProp={rezept && rezept}/>
        <IconButton aria-label="delete" onClick={() => setDeleteDialogOpen(true)} sx={{backgroundColor: "#DFEFFF"}}>
          <DeleteSweepIcon />
        </IconButton>
        <IconButton aria-label="delete" onClick={() => setCookingDialogOpen(true)} sx={{backgroundColor: "#DFEFFF"}}>
          <RestaurantIcon />
        </IconButton>
       </Box>
        <CookingDialog open={cookingDialogOpen} reloadRezepte={reloadRezepte} kuehlschrank={kuehlschrank} close={() => setCookingDialogOpen(false)} rezept={rezept} 
        missingLebensmitteleintragList={missingLebensmitteleintragList} user={user}/>
        <HaushaltDeleteDialog close={() => setDeleteDialogOpen(false)} btnTitle="Löschen" deleteFunction={deleteRecipe} dialogDesc="Möchten Sie dieses Rezept wirklich löschen?" 
        dialogTitle={`Löschen von ${rezept && rezept.name}`} open={deleteDialogOpen}/>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>Zubereitung:</Typography>
          <Typography paragraph>
            {rezept && rezept.zubereitung}
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
}
