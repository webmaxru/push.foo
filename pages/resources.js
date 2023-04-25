import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from '../src/Link';

export default function About() {
  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Learning resources
        </Typography>

        <ul>
          <li>
            Specifications
            <ul>
              <li>
                Voluntary Application Server Identification (VAPID) for Web Push
                https://www.rfc-editor.org/rfc/rfc8292
              </li>

              <li>Web Push and Notifications https://web.dev/notifications/</li>

              <li>
                Re-engage users with badges, notifications, and push messages
                https://learn.microsoft.com/en-us/microsoft-edge/progressive-web-apps-chromium/how-to/notifications-badges
              </li>

              <li>
                Notifying your users of updates
                https://microsoft.github.io/win-student-devs/#/30DaysOfPWA/advanced-capabilities/07
              </li>
            </ul>
          </li>
        </ul>
        <Button variant="contained" component={Link} noLinkStyle href="/">
          Go to the main page
        </Button>
      </Box>
    </Container>
  );
}
