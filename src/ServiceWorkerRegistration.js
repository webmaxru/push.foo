import { Workbox } from 'workbox-window';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import {
  incrementInAppCount,
  incrementIconBadgeCount,
  selectNotificationIconBadgeCount,
} from '../store/notificationCountSlice';

export default function ServiceWorkerRegistration(props) {
  const dispatch = useDispatch();
  const notificationIconBadgeCount = useSelector(
    selectNotificationIconBadgeCount
  );

  useEffect(() => {
    console.log('[App] notificationIconBadgeCount', notificationIconBadgeCount);

    if ('setAppBadge' in navigator) {
      navigator
        .setAppBadge(notificationIconBadgeCount)
        .then(() => {
          console.log('[App] The app badge was updated');
        })
        .catch((error) => {
          console.error('[App] Error updating the app badge', error);
        });
    }
  }, [notificationIconBadgeCount]);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      console.log('[App] Registering service worker');

      const wb = new Workbox(process.env.NEXT_PUBLIC_SW_PATH, {
        scope: process.env.NEXT_PUBLIC_SW_SCOPE,
      });

      const refreshPage = () => {
        wb.addEventListener('controlling', (event) => {
          window.location.reload();
        });

        wb.messageSkipWaiting();
      };

      const Msg = () => (
        <div>
          Updated app is available&nbsp;&nbsp;
          <button onClick={refreshPage}>Reload</button>
        </div>
      );

      const showSkipWaitingPrompt = (event) => {
        console.log('[App] Displaying SW update prompt');
        toast.info(<Msg />);
      };

      wb.addEventListener('waiting', showSkipWaitingPrompt);

      wb.addEventListener('message', (event) => {
        console.log('[App] Message received from the service worker');

        if (!event.data) {
          return;
        }
        if (event.data.type === 'REPLAY_COMPLETED') {
          toast.success(
            'Your API call was sent after the connection is restored'
          );
        }
        if (event.data.type === 'REQUEST_FAILED') {
          toast.warning(
            'Your API call will be sent after the connection is restored'
          );
        }
        if (event.data.type === 'NOTIFICATION_RECEIVED') {
          console.log('[App] Incrementing notification counters',event);
          if (event.data.data?.data?.updateInAppCounter) {
            console.log('[App] Incrementing in-app counter');
            dispatch(incrementInAppCount());
          }
          if (event.data.data?.data?.updateIconBadgeCounter) {
            console.log('[App] Incrementing icon badge counter');
            dispatch(incrementIconBadgeCount());
          }
        }
      });

      wb.register()
        .then((swRegistration) => {
          console.log('[App] Service worker register success', swRegistration);
        })
        .catch((error) => {
          console.error('[App] Service worker register error', error);
        });
    } else {
      toast.error(
        'Service workers (thus Web Push API) are not supported in this browser'
      );
    }
  }, []);

  return null;
}
