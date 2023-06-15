import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import { Button, Card, CardContent, CardMedia, Slider } from "@mui/material";
import Stack from "@mui/material/Stack";

import { WalkDisplay } from "@component/components/walkDisplay";
import { FilterDialog } from "@component/components/filterDialog";
import { RadarChartDisplay } from "@component/components/radarChartDisplay";
import { UmapDisplay } from "@component/components/umapDisplay";
import RegressionScatterplot from "@component/components/regressionScatterplot";
import Copyright from "@component/components/copyright";
import { useRouter } from "next/router";
import { LineChartDisplay } from "@component/components/lineChartDisplay";
import { useEffect } from "react";
import useWalks from "../stores/walks";

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

export default function PaperPage() {

  const direction = useWalks(state=>state.direction);
  const selectedWalks = useWalks(state=>state.selectedWalks);

  const router = useRouter();


  let walk = 1;
  if (selectedWalks.length>0) {
    walk = selectedWalks[0];
  }
  const path = `/walks/${direction}/${walk}.jpg`;

  const walks = useWalks(state => state.walks);

  const setSpace = useWalks(state=>state.setSpace);
  const setSpaceAndDirection = useWalks(state=>state.setSpaceAndDirection);

  const space = useWalks(state=>state.space);
  const loading = useWalks(state=>state.loading);
  const error = useWalks(state=>state.error);
  const errorMessage = useWalks(state=>state.errorMessage);


  const handleSpaceChange = (event) => {
    setSpace(event.target.value);
  };

  useEffect(() => {
    // You can replace 'spaceValue' and 'directionValue' with the actual values you want to use
    setSpaceAndDirection(space, direction);
  }, []);

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
            <Grid item xs={12} sm={12} md={12}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardMedia component="img" image={path} alt="walk" />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Stack direction={'row'} justifyContent={'space-between'}>
                    <FilterDialog/>
                    <FormControl>
                      <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="row-radio-buttons-group"
                        defaultValue={'z'}
                        value={space}
                        onChange={handleSpaceChange}
                      >
                        <FormControlLabel value="z" control={<Radio />} label="latent space (z)" />
                        <FormControlLabel value="w" control={<Radio />} label="style space (w)" />
                      </RadioGroup>
                    </FormControl>
                    <Button variant="contained" onClick={() => { router.push(`${space}/${direction}/${walk}`) }}>Explore Single Walk</Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <UmapDisplay />
                </Grid>
                <Grid item xs={12}>
                  <RegressionScatterplot />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
                <LineChartDisplay />
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
