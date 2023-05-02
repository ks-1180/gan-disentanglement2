import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@component/styles/Home.module.css'
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import PersonSearchIcon from '@mui/icons-material/PersonSearch';

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
        <Box
          sx={{
            bgcolor: 'background.paper',
            pt: 8,
            pb: 6,
          }}
        >
          <Container maxWidth="sm">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="text.primary"
              gutterBottom
            >
              Hero Banner
            </Typography>
            <Typography variant="h5" align="center" color="text.secondary" paragraph>
              Something short and leading about the collection below—its contents,
              the creator, etc. Make it short and sweet, but not too short so folks
              don&apos;t simply skip over it entirely.
            </Typography>
            <Stack
              sx={{ pt: 4 }}
              direction="row"
              spacing={2}
              justifyContent="center"
            >
              <Button href='/demo' variant="outlined">Test visualization</Button>
            </Stack>
          </Container>
        </Box>
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
