import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";

import { WalkDisplay } from "@component/components/walkDisplay";
import { FilterDialog } from "@component/components/filterDialog";
import { RadarChartDisplay } from "@component/components/radarChartDisplay";
import { UmapDisplay } from "@component/components/umapDisplay";
import RegressionScatterplot from "@component/components/regressionScatterplot";

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {"Copyright © Kathi & Christian "}
      {/* <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "} */}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

// TODO: discuss why this is named Album
export default function Album() {

  const [direction, setDirection] = useState({label: 'Eyeglasses', value: 'Eyeglasses'});
  console.log(direction)
  const [walk, setWalk] = useState(0)

  return (
    <>
      <AppBar position="relative">
        <Toolbar>
          <PersonSearchIcon sx={{ mr: 2 }} />
          <Typography variant="h6" color="inherit" noWrap>
            VISUALIZATION
          </Typography>
        </Toolbar>
      </AppBar>
      <main>
        <Container sx={{ py: 4 }} maxWidth="lg">
          <Grid container spacing={2}>
            <Grid item>
              <FilterDialog direction={direction} setDirection={setDirection} />
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <WalkDisplay direction={direction} walk={walk}/>
            </Grid>
            {
            /*
            <Grid item xs={12} sm={12} md={12}>
              <RadarChartDisplay />
            </Grid>
            */}
            <Grid item xs={12} sm={12} md={6}>
              <Grid container>
                <Grid item xs={12}>
                  <UmapDisplay direction={direction} walk={walk} setWalk={setWalk}/>
                </Grid>
                <Grid item xs={12}>
                  <RegressionScatterplot direction={direction} walk={walk} setWalk={setWalk}/>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <RadarChartDisplay direction={direction} walk={walk}/>
            </Grid>
          </Grid>
        </Container>
      </main>
      {/* Footer */}
      <Box sx={{ bgcolor: "background.paper", p: 6 }} component="footer">
        <Typography variant="h6" align="center" gutterBottom>
          Footer
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          component="p"
        >
          Visualization 2 - Implementation of "Interactively Assessing Disentanglement in GANs"
        </Typography>
        <Copyright />
      </Box>
      {/* End footer */}
    </>
  );
}
