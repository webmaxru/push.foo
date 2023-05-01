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
          What is Push.Foo?
        </Typography>
        Test your Web Push API experience in this sandbox that simulates the
        entire flow from requesting permission to sending the notification.
        <p align="center">
          <img src="/images/logo.png" width="200" />
        </p>
        This is a 3-in-1 project:
        <ol>
          <li>
            A real product for developers to help with understanding how Web
            Push API works.
          </li>
          <li>
            A real-world demo and a playground for [Web Push
            API](https://www.w3.org/TR/push-api/).
          </li>
          <li>
            Proof of concept for a Progressive Web App (PWA) driven by
            Workbox-powered service worker.
          </li>
        </ol>
        Your{' '}
        <Link href="https://github.com/webmaxru/push.foo/issues">
          comments, bug reports, and pull requests
        </Link>{' '}
        are very welcome!

      </Box>
    </Container>
  );
}
