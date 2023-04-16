// https://dev.to/hajhosein/nextjs-mui-v5-tutorial-2k35
// https://github.com/mui/material-ui/tree/master/examples/nextjs
// https://github.com/mui/material-ui/tree/master/docs/data/material/getting-started/templates/dashboard

import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Subscription from '../src/Subscription';
import Link from '../src/Link';

export default function Index(props) {

  console.log('Component props', props)
  
  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Instant push example
        </Typography>
        <Subscription VAPID_PUBLIC_KEY="BDweuGCGNzjleeyQYPvtFLEbMG4BX9rc_M9Abtx16NvaR_Jpo5i08WAJUll2Hn6ZiErbSjkzxWdpKjus_qO2cMw" />
        <Link href="/about" color="secondary">
          About the project
        </Link>
      </Box>
    </Container>
  );
}
