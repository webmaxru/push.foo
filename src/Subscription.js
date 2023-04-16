import * as React from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { urlBase64ToUint8Array } from './shared/pushHelpers';
import useAxios from 'axios-hooks';
import { configure } from 'axios-hooks';
import Axios from 'axios';
import { toast } from 'react-toastify';

const axios = Axios.create({
  baseURL: 'http://localhost:7071/api/',
});

configure({
  axios,
  defaultOptions: {
    manual: false,
    useCache: false,
    ssr: false,
    autoCancel: true,
  },
});

export default function Subscription(props) {
  const swScope = './';

  const [pushSubscription, setPushSubscription] = useState();

  const [
    {
      data: getVapidPublicKeyData,
      loading: getVapidPublicKeyLoading,
      error: getVapidPublicKeyError,
    },
    getVapidPublicKey,
  ] = useAxios('/vapid-public-key');

  useEffect(() => {
    toast.success('Success reading VAPID public key');
  }, [getVapidPublicKeyData]);

  const [
    {
      data: saveSubscriptionData,
      loading: saveSubscriptionLoading,
      error: saveSubscriptionError,
    },
    executeSaveSubscription,
  ] = useAxios(
    {
      url: 'subscription',
      method: 'POST',
    },
    { manual: true }
  );

  useEffect(() => {
    toast.success('Success saving subscription on server');
  }, [saveSubscriptionData]);

  const [
    {
      data: sendNotificationData,
      loading: sendNotificationLoading,
      error: sendNotificationError,
    },
    executeSendNotification,
  ] = useAxios(
    {
      url: 'notification',
      method: 'POST',
    },
    { manual: true }
  );

  useEffect(() => {
    toast.success('Success sending notification');
  }, [sendNotificationData]);

  useEffect(() => {
    getExistingSubscription();
  }, []);

  const subscribe = () => {
    let convertedVapidKey = urlBase64ToUint8Array(
      getVapidPublicKeyData['vapid-public-key']
    );

    navigator['serviceWorker']
      .getRegistration(swScope)
      .then((registration) => {
        registration.pushManager
          .subscribe({
            userVisibleOnly: true,
            applicationServerKey: convertedVapidKey,
          })
          .then((pushSubscription) => {
            console.log(
              `${pushSubscription ? pushSubscription.toJSON() : null}`
            );
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

  const getExistingSubscription = () => {
    navigator['serviceWorker']
      .getRegistration(swScope)
      .then((registration) => {
        registration.pushManager.getSubscription().then((pushSubscription) => {
          console.log(`Existing subscription found:`);
          console.log(pushSubscription);
          setPushSubscription(pushSubscription);

          return pushSubscription;
        });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const saveSubscription = () => {
    executeSaveSubscription({
      data: { pushSubscription: pushSubscription },
    });
  };

  const sendNotification = () => {
    executeSendNotification({
      data: {
        pushSubscription: pushSubscription,
        notification: {
          title: 'Custom title from app',
          actions: [
            {
              action: 'action_custom',
              title: 'Custom action',
            },
          ],
          body: 'Custom text',
          dir: 'auto',
          icon: 'https://push.foo/images/icons/android-chrome-192x192.png',
          badge: 'https://push.foo/images/icons/android-chrome-192x192.png',
          lang: 'en-US',
          renotify: 'true',
          requireInteraction: 'true',
          tag: 'tag',
          vibrate: [300, 100, 400],
        },
      },
    });
  };

  return (
    <Typography sx={{ mt: 6, mb: 3 }} color="text.secondary">
      VAPID Public Key{' '}
      {getVapidPublicKeyLoading
        ? 'Loading...'
        : getVapidPublicKeyData?.['vapid-public-key']}
      <Button variant="contained" onClick={subscribe}>
        Subscribe
      </Button>
      &nbsp;
      <Button variant="contained" onClick={unsubscribe} disabled={!pushSubscription}>
        Unsubscribe
      </Button>
      <Button variant="contained" onClick={sendNotification} disabled={!pushSubscription}>
        Send notification
      </Button>
      &nbsp;
      <br />
      <br />
      <Button variant="contained" onClick={getVapidPublicKey}>
        Re-read VAPID public key
      </Button>
      <br />
      <br />
      <Button variant="contained" onClick={saveSubscription}>
        Save subscription in the backend
      </Button>
      {saveSubscriptionData ? <h4>{saveSubscriptionData?.id}</h4> : null}
    </Typography>
  );
}
