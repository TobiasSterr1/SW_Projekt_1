import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Navigate, Routes, useLocation } from 'react-router-dom';
import firebaseConfig from './firebaseconfig';
import { GoogleAuthProvider, getAuth, onAuthStateChanged, signInWithPopup, signInWithRedirect } from "firebase/auth";
import { initializeApp } from 'firebase/app';
import SignInPage from './components/pages/SignInPage';
import NavBar from './components/NavBar';
import FoodAPI from './api/FoodAPI';
import Haushalt from './components/pages/Haushalt';
import Rezepte from './components/pages/Rezept';
import Einkaufsliste from './components/pages/Einkaufsliste';
import Kuehlschrank from './components/pages/Kuehlschrank';
import AboutUs from './components/pages/AboutUs';

export class App extends Component {

  constructor(props) {
    super(props);
    // Initialisierung des Zustands der App mit Platzhaltern für Benutzerdaten, Ladezustand und Fehlermeldungen
    this.state = {
      user: undefined,
      firebaseUser: undefined,
      loading: false,
      error: null,
    }
  }

  // Methode zur Anmeldung mit Google
  handleSignIn = () => {
		this.setState({
			authLoading: true
		});

		// Initialisiert die Firebase-App mit der Konfiguration
    const app = initializeApp(firebaseConfig);
		const auth = getAuth(app);
		const provider = new GoogleAuthProvider();

		auth.languageCode = 'en';
    // Öffnet ein Popup-Fenster zur Anmeldung mit Google
    signInWithPopup(auth, provider);
	}

  // Funktion zum Abrufen der Benutzerdaten anhand einer GUID
  getPerson = (guid) => {
    // Ruft über die API die Benutzerdaten anhand der GUID ab   
    FoodAPI.getAPI().getPersonByGuid(guid).then((person) =>{
      // Bei erfolgreicher API-Antwort werden die Benutzerdaten im Zustand aktualisiert
      this.setState({
        user: person[0],
        error: null,
        loading: false
      });
    })
    .catch((error) => {
      // Bei einem API-Fehler wird der Fehler im Zustand gespeichert
      this.setState({
        error: error,
        loading: false
      })
    })
    this.setState({
      loading: true
    })
  }

// Lifecycle-Methode, die beim Mounten der Komponente aufgerufen wird
  componentDidMount(){
  // Initialisiert die Firebase-App mit der Konfiguration
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  auth.languageCode = 'en';

  // Überwacht den Authentifizierungsstatus des Benutzers
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // Setzt den Ladezustand auf true, um den Ladevorgang anzuzeigen
      this.setState({
        loading: true
      });
      // Der Benutzer ist angemeldet
      user.getIdToken().then(token => {
        // Fügt das Token den Browser-Cookies hinzu, um es serverseitig zu verifizieren
        document.cookie = `token=${token};path=/`;

        // Setzt den Firebase-Benutzer und ruft die Benutzerdaten ab
        this.setState({
          firebaseUser: user,
          error: null,
          loading: false
        }); this.getPerson(user.uid); // Ruft die Benutzerdaten ab
      }).catch(e => {
        // Bei einem Fehler wird der Fehler im Zustand gespeichert
        this.setState({
          error: e,
          loading: false
        });
      });
    } else {
      // Der Benutzer hat sich abgemeldet, daher wird das ID-Token gelöscht
      document.cookie = 'token=;path=/';

      // Setzt den Firebase-Benutzer auf null
      this.setState({
        firebaseUser: null,
        loading: false
      });
    }
  });
}

// Rendert die App-Komponente
render() {
    return (
      <Router>
      <Routes>
      <Route path={process.env.PUBLIC_URL + '/'} element={
									// For some special cases we need to handle the root route
									// Redirect if the user is signed in
									this.state.firebaseUser ?
										<Navigate replace to={process.env.PUBLIC_URL + '/Haushalt'} />
										:
                    <SignInPage handleSignInFunction={this.handleSignIn}>SIGN IN</SignInPage>
								} />
      <Route path={process.env.PUBLIC_URL + '/*'} element={
									// For some special cases we need to handle the root route
									// Redirect if the user is signed in
									this.state.firebaseUser ?
										<Navigate replace to={process.env.PUBLIC_URL + '/Haushalt'} />
										:
										<SignInPage handleSignInFunction={this.handleSignIn}>SIGN IN</SignInPage>
								} />
      {this.state.user &&<Route path={process.env.PUBLIC_URL + '/Haushalt'} element={<Secured user={this.state.firebaseUser}><Haushalt user={this.state.user}/></Secured>} />}
      {this.state.user &&<Route path={process.env.PUBLIC_URL + '/AboutUs'} element={<Secured user={this.state.firebaseUser}><AboutUs user={this.state.user}/></Secured>} />}
      {this.state.user &&<Route path={process.env.PUBLIC_URL + '/Haushalt/:id/:name/Rezepte'} element={<Secured user={this.state.firebaseUser}><Rezepte user={this.state.user}/></Secured>} />}
      {this.state.user &&<Route path={process.env.PUBLIC_URL + '/Haushalt/:id/:name/Kuehlschrank'} element={<Secured user={this.state.firebaseUser}><Kuehlschrank user={this.state.user}/></Secured>} />}
      {this.state.user &&<Route path={process.env.PUBLIC_URL + '/Haushalt/:id/:name/Einkaufsliste'} element={<Secured user={this.state.firebaseUser}><Einkaufsliste user={this.state.user}/></Secured>} />}
      </Routes>
     </Router>
    );
  }
}

export default App

// Funktionale Komponente, die prüft, ob der Benutzer authentifiziert ist und entsprechend handelt
function Secured(props) {
	let location = useLocation();

	if (!props.user) {
		// Falls der Benutzer nicht authentifiziert ist, wird er zur Anmeldeseite umgeleitet
    // Die aktuelle Route wird gespeichert, um nach der Anmeldung dorthin zurückzukehren
		return <Navigate to={process.env.PUBLIC_URL + '/'} state={{ from: location }} replace />;
	}

	return props.children; // Renderung der geschützten Inhalte, wenn der Benutzer authentifiziert ist
}