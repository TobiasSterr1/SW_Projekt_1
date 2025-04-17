import React from 'react';
import { Container, Typography, Box, Avatar, Grid, Card, CardContent, IconButton } from '@mui/material';
import NavBar from '../NavBar';
import GitHubIcon from '@mui/icons-material/GitHub';
import LaunchIcon from '@mui/icons-material/Launch';
// Beispielbilder, die Sie durch Ihre eigenen ersetzen können
const teamMembers = [
  { name: 'SvyatoslavKitayev', url: 'https://github.com/SvyatoslavKitayev', image: 'https://via.placeholder.com/150' },
  { name: 'NadjibullahMobinzadaJosofzai', url: 'https://github.com/NadjibullahMobinzadaJosofzai', image: 'https://via.placeholder.com/150' },
  { name: 'TobiasSterr1', url: 'https://github.com/TobiasSterr1', image: 'https://via.placeholder.com/150' },
  { name: 'WilliKoljada', url: 'https://github.com/WilliKoljada', image: 'https://via.placeholder.com/150' },
  { name: 'Emirhan-Bozkurt', url: 'https://github.com/Emirhan-Bozkurt', image: 'https://via.placeholder.com/150' },
  { name: 'IsmailEkinci', url: 'https://github.com/IsmailEkinci', image: 'https://via.placeholder.com/150' },
];

const AboutUs = ({user}) => {

  return (
    <>
    <NavBar user={user} />
    <Container sx={{ marginTop: '2rem', textAlign: 'center' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        About Us
      </Typography>
      <Typography variant="body1" paragraph>
      Unsere Webapplikation ermöglicht es Ihnen, schnell und einfach passende Rezepte für die Lebensmittel in Ihrem Kühlschrank zu finden. Unser Ziel ist es, Ihnen dabei zu helfen, nachhaltiger zu kochen und Lebensmittelverschwendung zu reduzieren.
      </Typography>
      <Box mt={4}>
        <Grid container spacing={4} >
          {teamMembers.map((member) => (
            <Grid item xs={12} sm={6} md={4} key={member.name}>
              <Card sx={[{ maxWidth: 345, margin: 'auto', position:"relative", cursor:"pointer" }, {'&:hover': {backgroundColor:"#E5EBFF"}}]} onClick={() => window.open(member.url, "_blank")}>
                <LaunchIcon sx={{position:"absolute", right:"1rem", top:"1rem"}} />
                <CardContent>
                    <GitHubIcon sx={{width:"10rem", height:"10rem"}} />
                  <Typography variant="h6" component="h2">
                    {member.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {member.role}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
          </>
  );
};

export default AboutUs;