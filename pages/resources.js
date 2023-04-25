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
                <a href="https://www.rfc-editor.org/rfc/rfc8292">
                  Voluntary Application Server Identification (VAPID) for Web
                  Push
                </a>
              </li>
              <li>
                <a href="https://notifications.spec.whatwg.org/">
                  Notifications API
                </a>{' '}
                - WHATWG
              </li>

              <li>
                <a href="https://www.w3.org/TR/push-api/">Push API</a> - W3C
              </li>
            </ul>
          </li>
          <li>
            API References
            <ul>
              <li>
                <a href="https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API">
                  Notifications API
                </a>{' '}
                - MDN
              </li>

              <li>
                <a href="https://developer.mozilla.org/en-US/docs/web/api/push_api">
                  Push API
                </a>{' '}
                - MDN
              </li>
            </ul>
          </li>
          <li>
            Guides
            <ul>
              <li>
                <a href="https://web.dev/notifications/">
                  Web Push and Notifications
                </a>{' '}
                - web.dev
              </li>

              <li>
                <a href="https://learn.microsoft.com/en-us/microsoft-edge/progressive-web-apps-chromium/how-to/notifications-badges">
                  Re-engage users with badges, notifications, and push messages
                </a>{' '}
                - Microsoft Learn
              </li>

              <li>
                <a href="https://microsoft.github.io/win-student-devs/#/30DaysOfPWA/advanced-capabilities/07">
                  Notifying your users of updates
                </a>{' '}
                - #30DaysOfPWA
              </li>
            </ul>
          </li>
          <li>
            Libraries
            <ul>
              <li>
                <a href="https://www.npmjs.com/package/web-push">web-push</a> -
                npm
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
