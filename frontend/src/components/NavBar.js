/*
  Das NavBar-Komponentenbeispiel, das du bereitgestellt hast, ist eine umfassende Navigationsleiste,
  die Material-UI Komponenten und React verwendet. Es umfasst Funktionen wie:

  - Navigationslinks: Links zu verschiedenen Abschnitten der Anwendung basierend auf haushaltId und haushaltName.
  - Benutzermenü: Dropdown-Menü, das Benutzerinformationen und Aktionen anzeigt.
  - Benutzerprofil bearbeiten: Ermöglicht es Benutzern, ihren Vornamen, Nachnamen und Benutzernamen mit
    Echtzeit-Updates und Speicherfunktionalität zu bearbeiten.
  - Ladeanzeige: Zeigt einen Ladeindikator während des Speicherns von Benutzerprofilinformationen an.
  - Abmelden und Profil löschen: Schaltflächen zum Abmelden und Löschen des Benutzerprofils.
  - Responsive Design: Passt das Layout je nach Bildschirmgröße an (xs für mobile Geräte, md für Desktops).
*/

import * as React from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { getAuth, signOut } from 'firebase/auth';
import { CircularProgress, TextField } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import PersonBO from '../api/PersonBO';
import FoodAPI from '../api/FoodAPI';

function NavBar({ user, haushaltId, haushaltName }) {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [benutzername, setBenutzername] = React.useState('');
  const [firstname, setFirstname] = React.useState('');
  const [lastname, setLastname] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [pages, setPages] = React.useState([]);

  // Funktionen für das Navigationsmenü
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  // Funktionen für das Benutzermenü
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  // Funktion zum Abmelden des Benutzers
  const handleSignOut = () => {
    const auth = getAuth();
    signOut(auth);
    window.location.reload();
  };

  // Funktion zum Löschen des Benutzerprofils
  const handleProfileDelete = () => {
    FoodAPI.getAPI().deletePerson(user.id).then((person) => {
      handleSignOut();
      window.location.reload();
    });
  };

  // Funktion zum Speichern des Benutzernamens
  const saveBenutzername = () => {
    setLoading(true); // Ladeindikator anzeigen
    
    // Neues PersonBO-Objekt erstellen und Eigenschaften aus dem bestehenden Benutzerobjekt kopieren
    let newUser = Object.assign(new PersonBO(), user);
    // Benutzername, Vorname und Nachname im newUser-Objekt aktualisieren
    newUser.setBenutzername(benutzername);
    newUser.setFirstname(firstname);
    newUser.setLastname(lastname);
    // API aufrufen, um die Person mit den neuen Informationen zu aktualisieren
    FoodAPI.getAPI().updatePerson(newUser).then((person) => {
      setLoading(false); // Ladeindikator ausblenden, wenn der API-Aufruf erfolgreich war
    });
  };

  // Effekt zum Setzen von Benutzerinformationen basierend auf den Prop-Werten
  React.useEffect(() => {
    if (user){
      // Benutzername, Vorname und Nachname basierend auf dem Benutzerobjekt setzen
      setBenutzername(user.benutzername);
      setFirstname(user.firstname);
      setLastname(user.lastname);
    }
    
    if ( user && haushaltId && haushaltName) {
      // Benutzername, Vorname und Nachname setzen, wenn Benutzerobjekt, haushaltId und haushaltName verfügbar sind
      setBenutzername(user.benutzername);
      setFirstname(user.firstname);
      setLastname(user.lastname);

      // Seitenlinks mit entsprechenden URLs setzen
      setPages([
        // Set the pages array with the appropriate URLs
        { name: "Kuehlschrank", url: `/Haushalt/${haushaltId}/${haushaltName}/Kuehlschrank` },
        { name: "Rezepte", url: `/Haushalt/${haushaltId}/${haushaltName}/Rezepte` },
        { name: "Einkaufsliste", url: `/Haushalt/${haushaltId}/${haushaltName}/Einkaufsliste` }
      ]);
    }
  }, [user, haushaltId, haushaltName]);

  return (
    user &&
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo oder Titel der Anwendung anzeigen */}
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/Haushalt"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
                        {haushaltName ? haushaltName  : "Foodmanager"}
          </Typography>

          {/* Navigationsmenü für mobile Geräte anzeigen */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            {/* Dropdown-Menü für mobile Ansicht */}
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
                {/* Navigationslinks im Dropdown-Menü anzeigen */}
                <MenuItem  onClick={handleCloseNavMenu}>
                  <Link to="/Haushalt" style={{ textDecoration: "none", color: 'inherit' }}>
                    Haushälter
                  </Link>
                </MenuItem>
              {pages.length > 0 && pages.map((page) => (
                <MenuItem key={page.url} onClick={handleCloseNavMenu}>
                  <Link to={page.url} style={{ textDecoration: "none", color: 'inherit' }}>
                    {page.name}
                  </Link>
                </MenuItem>
              ))}
                <MenuItem  onClick={handleCloseNavMenu}>
                  <Link to="/AboutUs" style={{ textDecoration: "none", color: 'inherit' }}>
                    AboutUs
                  </Link>
                </MenuItem>
            </Menu>
          </Box>
          
          {/* Titel der Anwendung oder Haushaltsnamen für mobile Ansicht */}
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            {haushaltName && haushaltName}
          </Typography>

          {/* Navigationsmenü für Desktop-Ansicht */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              <Button
              component={Link}
              to="/Haushalt"
              onClick={handleCloseNavMenu}
              sx={{ my: 2, color: 'white', display: 'block' }}
              >
                Haushälter
              </Button>
            {haushaltId && haushaltName && 
            pages.map((page) => (
              <Button
              key={page.url}
              component={Link}
              to={page.url}
              onClick={handleCloseNavMenu}
              sx={{ my: 2, color: 'white', display: 'block' }}
              >
              {page.name}
              </Button>
            ))
          }
              <Button
              component={Link}
              to="/AboutUs"
              onClick={handleCloseNavMenu}
              sx={{ my: 2, color: 'white', display: 'block' }}
              >
                About Us
              </Button>
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt={benutzername}>
                  {benutzername && benutzername.charAt(0)}
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem>
                <TextField
                  id="firstname"
                  label="Firstname"
                  variant="standard"
                  onKeyDown={e=>{ e.stopPropagation()}}
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                />
                  </MenuItem>
              <MenuItem>
                <TextField
                  id="lastname"
                  label="Lastname"
                  variant="standard"
                  value={lastname}
                  onKeyDown={e=>{ e.stopPropagation()}}
                  onChange={(e) => 
                    setLastname(e.target.value)}
                  />
                  </MenuItem>
              <MenuItem>
                <TextField
                  id="benutzername"
                  label="Benutzername"
                  variant="standard"
                  onKeyDown={e=>{ e.stopPropagation()}}
                  value={benutzername}
                  onChange={(e) => setBenutzername(e.target.value)}
                  />
                  </MenuItem>
                  <MenuItem sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                {loading &&
                  <IconButton>
                    <CircularProgress size={25} />
                  </IconButton>
                }
                {!loading &&
                  <IconButton onClick={saveBenutzername}>
                    <SaveIcon />
                  </IconButton>
                }
                </MenuItem>
              <MenuItem onClick={handleCloseUserMenu}>
                <Typography textAlign="center">{user.email}</Typography>
              </MenuItem>
              <Box onClick={handleCloseUserMenu} sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: ".5rem", p: ".5rem" }}>
                <Button variant="contained" onClick={handleSignOut}>Abmelden</Button>
                <Button variant="contained" onClick={handleProfileDelete}>Profil Löschen</Button>
              </Box>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default NavBar;