import * as React from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { urlBase64ToUint8Array } from './utility/pushHelpers';

export default function Subscription(props) {
  const swScope = './';
  const VAPID_PUBLIC_KEY = props.VAPID_PUBLIC_KEY;

  useEffect(() => {
    navigator['serviceWorker']
      .getRegistration(swScope)
      .then((registration) => {
        registration.pushManager.getSubscription().then((pushSubscription) => {
          console.log(`Existing subscription found:`);
          console.log(pushSubscription);
        });
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const subscribe = () => {
    let convertedVapidKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);

    navigator['serviceWorker']
      .getRegistration(swScope)
      .then((registration) => {
        registration.pushManager
          .subscribe({
            userVisibleOnly: true,
            applicationServerKey: convertedVapidKey,
          })
          .then((pushSubscription) => {
            console.log(`${pushSubscription.toJSON()}`);
          });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const unsubscribe = () => {
    navigator['serviceWorker']
      .getRegistration(swScope)
      .then((registration) => {
        registration.pushManager.getSubscription().then((pushSubscription) => {
          pushSubscription
            .unsubscribe()
            .then((success) => {
              console.log('[App] Unsubscription successful', success);
            })
            .catch((err) => {
              console.log('[App] Unsubscription failed', err);
            });
        });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <Typography sx={{ mt: 6, mb: 3 }} color="text.secondary">
      <Button variant="contained" onClick={subscribe}>
        Subscribe
      </Button>

      <Button variant="contained" onClick={unsubscribe}>
        Unsubscribe
      </Button>
    </Typography>
  );
}
