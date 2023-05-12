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
                <Link href="https://www.rfc-editor.org/rfc/rfc8292">
                  Voluntary Application Server Identification (VAPID) for Web
                  Push
                </Link>
              </li>
              <li>
                <Link href="https://notifications.spec.whatwg.org/">
                  Notifications API
                </Link>{' '}
                - WHATWG
              </li>

              <li>
                <Link href="https://www.w3.org/TR/push-api/">Push API</Link> - W3C
              </li>
            </ul>
          </li>
          <li>
            API References
            <ul>
              <li>
                <Link href="https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API">
                  Notifications API
                </Link>{' '}
                - MDN
              </li>

              <li>
                <Link href="https://developer.mozilla.org/en-US/docs/web/api/push_api">
                  Push API
                </Link>{' '}
                - MDN
              </li>
            </ul>
          </li>
          <li>
            Guides
            <ul>
              <li>
                <Link href="https://web.dev/notifications/">
                  Web Push and Notifications
                </Link>{' '}
                - web.dev
              </li>

              <li>
                <Link href="https://learn.microsoft.com/en-us/microsoft-edge/progressive-web-apps-chromium/how-to/notifications-badges">
                  Re-engage users with badges, notifications, and push messages
                </Link>{' '}
                - Microsoft Learn
              </li>

              <li>
                <Link href="https://microsoft.github.io/win-student-devs/#/30DaysOfPWA/advanced-capabilities/07">
                  Notifying your users of updates
                </Link>{' '}
                - #30DaysOfPWA
              </li>
            </ul>
          </li>
          <li>
            Libraries
            <ul>
              <li>
                <Link href="https://www.npmjs.com/package/web-push">web-push</Link> -
                npm
              </li>
            </ul>
          </li>
          <li>
            Presentations
            <ul>
              <li>
              Web Push Notifications Done Right <Link href="https://www.slideshare.net/webmaxru/web-push-notifications-done-right">Slides</Link> - <Link href="https://youtu.be/yAKV8J9HrQI">Video</Link>
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
