import React from 'react';
import PropTypes from 'prop-types';
import { CacheProvider } from '@emotion/react';

import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SchoolIcon from '@mui/icons-material/School';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import AssignmentIcon from '@mui/icons-material/Assignment';
import Copyright from '../src/Copyright';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NotificationCount from '../src/NotificationCount';
import NextLink from 'next/link';
import createEmotionCache from '../utility/createEmotionCache';
import lightTheme from '../styles/themes/lightTheme';
import '../styles/globals.css';

import { Provider } from 'react-redux';
import { wrapper } from '../store/store';

import { useEffect } from 'react';

import ReactGA from 'react-ga4';

import ServiceWorkerRegistration from '../src/ServiceWorkerRegistration';

import Head from 'next/head';

ReactGA.initialize('G-PDX2BC4971');
ReactGA.send('pageview');

const clientSideEmotionCache = createEmotionCache();

const drawerWidth = 200;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  '& .MuiDrawer-paper': {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: 'border-box',
    ...(!open && {
      overflowX: 'hidden',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(0),
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

const MyApp = (props) => {
  //const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  const { Component, ...rest } = props;
  const {
    emotionCache = clientSideEmotionCache,
    pageProps,
    store,
  } = wrapper.useWrappedStore(rest);

  const [open, setOpen] = React.useState(false);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  useEffect(() => {}, []);

  return (
    <Provider store={store}>
      <CacheProvider value={emotionCache}>
        <ThemeProvider theme={lightTheme}>
          <Head>
            <meta charSet="utf-8" />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
            <title>Push.Foo - Web Push API Playground</title>
            <meta
              name="description"
              content="Test your Web Push API experience in this sandbox that simulates the entire flow from requesting permission to sending the notification"
            />
            <link
              rel="apple-touch-icon"
              sizes="180x180"
              href="/images/icons/apple-touch-icon.png"
            />
            <link
              rel="icon"
              type="image/png"
              sizes="32x32"
              href="/images/icons/favicon-32x32.png"
            />
            <link
              rel="icon"
              type="image/png"
              sizes="16x16"
              href="/images/icons/favicon-16x16.png"
            />
            <link rel="manifest" href="/app.webmanifest" />
            <meta name="msapplication-TileColor" content="#b00318" />
            <meta
              name="msapplication-TileImage"
              content="/images/icons/mstile-150x150.png"
            />
            <meta property="og:url" content="https://push.foo" />
            <meta property="og:type" content="website" />
            <meta
              property="og:title"
              content="Push.Foo - Web Push API Playground"
            />
            <meta
              property="og:description"
              content="Test your Web Push API experience in this sandbox that simulates the entire flow from requesting permission to sending the notification"
            />
            <meta
              property="og:image"
              content="https://push.foo/images/social.png"
            />

            <meta name="twitter:card" content="summary_large_image" />
            <meta property="twitter:domain" content="push.foo" />
            <meta property="twitter:url" content="https://push.foo" />
            <meta
              name="twitter:title"
              content="Push.Foo - Web Push API Playground"
            />
            <meta
              name="twitter:description"
              content="Test your Web Push API experience in this sandbox that simulates the entire flow from requesting permission to sending the notification"
            />
            <meta
              name="twitter:image"
              content="https://push.foo/images/social.png"
            />
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link
              rel="preconnect"
              href="https://fonts.gstatic.com"
              crossOrigin="true"
            />
          </Head>
          <CssBaseline />

          <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="absolute" open={open}>
              <Toolbar
                sx={{
                  pr: '24px', // keep right padding when drawer closed
                }}
              >
                <IconButton
                  edge="start"
                  color="inherit"
                  aria-label="open drawer"
                  onClick={toggleDrawer}
                  sx={{
                    marginRight: '36px',
                    ...(open && { display: 'none' }),
                  }}
                >
                  <MenuIcon />
                </IconButton>
                <Box
                  component="img"
                  sx={{
                    height: 60,
                  }}
                  alt="Push.Foo - Web Push Playground"
                  src="/images/logo-mask.png"
                />
                <Typography
                  component="h1"
                  variant="h6"
                  color="inherit"
                  noWrap
                  sx={{ flexGrow: 1 }}
                >
                  Web Push Playground
                </Typography>
                <NotificationCount />
              </Toolbar>
            </AppBar>
            <Drawer variant="permanent" open={open}>
              <Toolbar
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  px: [1],
                }}
              >
                <IconButton onClick={toggleDrawer}>
                  <ChevronLeftIcon />
                </IconButton>
              </Toolbar>
              <Divider />
              <List component="nav" suppressHydrationWarning={true}>
                  <ListItemButton component={NextLink} href="/">
                    <ListItemIcon>
                      <NotificationsIcon />
                    </ListItemIcon>
                    <ListItemText primary="Notifications" />
                  </ListItemButton>
                  <ListItemButton component={NextLink} href="/resources">
                    <ListItemIcon>
                      <SchoolIcon />
                    </ListItemIcon>
                    <ListItemText primary="Learn Push API" />
                  </ListItemButton>
                  <ListItemButton component={NextLink} href="/about">
                    <ListItemIcon>
                      <HelpCenterIcon />
                    </ListItemIcon>
                    <ListItemText primary="About" />
                  </ListItemButton>
              </List>
            </Drawer>
            <Box
              component="main"
              sx={{
                backgroundColor: (theme) =>
                  theme.palette.mode === 'light'
                    ? theme.palette.grey[100]
                    : theme.palette.grey[900],
                flexGrow: 1,
                height: '100vh',
                overflow: 'auto',
              }}
            >
              <Toolbar />
              <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Component {...pageProps} />
                <Copyright sx={{ pt: 4 }} />
              </Container>
            </Box>
          </Box>
          <ToastContainer position={toast.POSITION.BOTTOM_RIGHT} />
          <ServiceWorkerRegistration />
        </ThemeProvider>
      </CacheProvider>
    </Provider>
  );
};

export default MyApp;

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
};
