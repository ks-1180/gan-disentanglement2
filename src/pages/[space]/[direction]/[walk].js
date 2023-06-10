import { useRouter } from 'next/router'
import React from "react";
import AppBar from "@mui/material/AppBar";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import Copyright from '@component/components/copyright';

import { Card, CardContent, CardMedia, Slider } from "@mui/material";
import { WalkDisplay } from "@component/components/walkDisplay";
import { RadarChartDisplay } from "@component/components/radarChartDisplay";
import VideoCard from '@component/components/video';


export async function getStaticPaths() {
    // Here you would fetch all walk IDs and their directions you want to pre-render.
    // For the sake of example, let's assume that you can get them from an API.


    // const paths = walks.map((walk) => ({
    //     params: { walkId: walk.id.toString(), direction: walk.direction },
    // }))

    return { paths: [], fallback: true }
}

export async function getStaticProps({ params }) {
    // Fetch necessary data for the walk using params.walkId and params.direction
    console.log(params);

    return { props: { direction: params.direction, walk: params.walk, space: params.space } }
}


const Walk = ({ space, direction, walk }) => {
    const router = useRouter()

    if (router.isFallback) {
        // This will be displayed while waiting for getStaticProps to finish
        return <div>Loading...</div>
    }
    console.log(space, direction, walk);

    const path = `/walks/${direction}/${walk}.jpg`;
    return (
        <>
            <AppBar position="relative">
                <Toolbar>
                    <PersonSearchIcon sx={{ mr: 2 }} />
                    <Typography variant="h6" color="inherit" noWrap>
                        VISUALIZATION - WALK
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
                                <CardContent>
                                    <Slider
                                        aria-label="Temperature"
                                        defaultValue={10}
                                        valueLabelDisplay="auto"
                                        step={1}
                                        marks
                                        min={0}
                                        max={10}
                                    />
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={12} md={6}>
                            <VideoCard />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6}>
                            <VideoCard />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6}>
                            <RadarChartDisplay direction={{ value: direction }} walk={walk} />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6}>
                            <RadarChartDisplay direction={{ value: direction }} walk={walk} />
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
        </>
    );
}

export default Walk
