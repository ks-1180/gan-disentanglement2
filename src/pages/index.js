import Head from 'next/head'
import styles from '@component/styles/Home.module.css'
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';

import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import ButtonBases from '@component/components/complexButtons';

/**
 * Home component for documentation and explanation of the visualizations.
 * Renders the home page of the application.
 * @returns {JSX.Element} Home component.
 */
export default function Home() {
  return (
    <>
      <Head>
        <title>GAN Disentanglement</title>
        <meta name="description" content="Interactive visualization to asses disentanglement in GANs." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AppBar position="relative">
        <Toolbar>
          <PersonSearchIcon sx={{ mr: 2 }} />
          <Typography variant="h6" color="inherit" noWrap>
            VIS 2
          </Typography>
        </Toolbar>
      </AppBar>
      <main className={styles.main}>
        {/* Hero unit */}
        <Container maxWidth="md">
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <Typography
                component="h1"
                variant="h2"
                color="text.primary"
                gutterBottom
              >
                GAN Disentanglement: Unraveling the Complexities of Generative Networks
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <ButtonBases />
            </Grid>
            <Grid item>
              <Typography variant="h5" color="text.secondary" paragraph>
                Welcome to our project, an in-depth exploration of GAN disentanglement led by Katharina Scheucher and Christian Stippel. As part of the Visualization 2 university course, this web application aims to elucidate the intricate mechanics of Generative Adversarial Networks (GANs) and the fascinating realm of disentanglement.
              </Typography>
              <Typography variant="h5" color="text.secondary" paragraph>
                GANs, robust machine learning models, have gained significant attention for their ability to generate realistic synthetic data. While powerful, the understanding of the latent space that controls the output remains a complex challenge. This project focuses on this area of GANs, often referred to as 'disentanglement', which seeks to separate and independently control the various factors of variation within the model's output.
              </Typography>
              <Typography variant="h5" color="text.secondary" paragraph>
                This interactive web application boasts four main features. Firstly, it provides a reimplementation of the renowned paper 'Interactively Assessing Disentanglement in GANs', harnessing state-of-the-art frontend technologies such as React, Next.js, and MUI. Secondly, it introduces a powerful semantic editing tool that aids in understanding and manipulating the characteristics of generated samples. Thirdly, it offers a unique single walk visualization tool, complete with radar chart and videos, to track and understand the transformations within the latent space. Lastly, an editing visualization tree provides a comprehensive visual depiction of the complex changes in the data, aiding in grasping the underpinnings of GAN disentanglement.
              </Typography>
              <Typography variant="h5" color="text.secondary" paragraph>
                Join Katharina Scheucher, a dedicated AI researcher with a flair for creating intuitive visualizations, and Christian Stippel, a forward-thinking computer scientist passionate about untangling the intricacies of machine learning algorithms, on this enlightening journey through the layers of GANs.
              </Typography>
            </Grid>
          </Grid>
        </Container>
        <Grid container spacing={7}>
          <Grid item xs={12}>
            <Typography variant='h6' textAlign='center' paddingTop={0}>
              GAN Disentanglement
            </Typography>
          </Grid>
        </Grid>
      </main>
    </>
  )
}
