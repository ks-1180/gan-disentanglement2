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


export default function PaperPage() {

  const [direction, setDirection] = useState({ label: 'Eyeglasses', value: 'Eyeglasses' });
  const [walk, setWalk] = useState(0);
  const router = useRouter();

  const path = `/walks/${direction.value}/${walk}.jpg`;

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
                <CardMedia component="img" image={path} alt="s" />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Stack direction={'row'} justifyContent={'space-between'}>
                    <FilterDialog direction={direction} setDirection={setDirection} />
                    <Button variant="contained" onClick={()=>{router.push(`paper/${direction.value}/${walk}`)}}>Explore Single Walk</Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <UmapDisplay direction={direction} walk={walk} setWalk={setWalk} />
                </Grid>
                <Grid item xs={12}>
                  <RegressionScatterplot direction={direction} walk={walk} setWalk={setWalk} />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
                <LineChartDisplay direction={direction} />
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
