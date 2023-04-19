import * as React from 'react';
import Typography from '@mui/material/Typography';
import MuiLink from '@mui/material/Link';

export default function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      Made in 🇳🇴&nbsp; by&nbsp;
      <MuiLink color="inherit" href="https://twitter.com/webmaxru/">
        Maxim Salnikov
      </MuiLink>{' '}
      |&nbsp;
      <MuiLink color="inherit" href="https://github.com/webmaxru/push.foo">
        GitHub
      </MuiLink>
    </Typography>
  );
}
