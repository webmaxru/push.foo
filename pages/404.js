import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from '../src/Link';

export default function Error404() {
  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Error 404
        </Typography>
        Page not found
        <br />
        <br />
        <Button variant="contained" component={Link} noLinkStyle href="/">
          Go to the main page
        </Button>
      </Box>
    </Container>
  );
}
