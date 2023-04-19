import * as React from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { urlBase64ToUint8Array, defaultNotification } from './shared/pushHelpers';
import useAxios from 'axios-hooks';
import { configure } from 'axios-hooks';
import Axios from 'axios';
import { toast } from 'react-toastify';
import ReactGA from 'react-ga4';
import { useDispatch, useSelector } from 'react-redux';
import {
  setIsFeatureAvailable,
  setPushSubscription,
  setSubscriptionId,
  selectIsFeatureAvailable,
  selectPushSubscription,
  selectSubscriptionId,
} from '../store/subscriptionSlice';
import { useFormik } from 'formik';
import * as yup from 'yup';

const saveSubscriptionValidationSchema = yup.object({
  tag: yup
    .string('Enter the tag for the subscription')
    .max(20, 'Tag should be of maximum 20 characters length'),
});

const notificationValidationSchema = yup.object({
  title: yup
    .string('Enter notification title')
    .max(256, 'Title should be of maximum 256 characters length')
    .required('Title is required'),
  body: yup
    .string('Enter notification body text')
    .max(512, 'Body text should be of maximum 512 characters length')
    .required('Body text is required'),
  image: yup
    .string('Enter notification image url')
    .url('This should be a valid url'),
});

const sendNotificationValidationSchema = yup.object({
  subscriptionIds: yup
    .string('Enter comma-separated subscription IDs')
    .email('Enter a valid email')
    .required('Email is required'),
  tag: yup
    .string('Enter the tag for the subscription')
    .max(20, 'Tag should be of maximum 20 characters length')
    .required('Tag is required'),
});

const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

configure({
  axios,
  defaultOptions: {
    manual: true,
    useCache: false,
    ssr: false,
    autoCancel: true,
  },
});

export default function Subscription(props) {
  const dispatch = useDispatch();
  const isFeatureAvailable = useSelector(selectIsFeatureAvailable);
  const pushSubscription = useSelector(selectPushSubscription);
  const subscriptionId = useSelector(selectSubscriptionId);

  const saveSubscriptionFormik = useFormik({
    initialValues: {
      tag: '',
    },
    validationSchema: saveSubscriptionValidationSchema,
    onSubmit: (values) => {
      saveSubscription(values.tag);
    },
  });

  const notificationFormik = useFormik({
    initialValues: {
      title: 'Hello from Push.Foo',
      body: 'This is a test notification',
      image: 'https://push.foo/images/social.png',
    },
    validationSchema: notificationValidationSchema,
    onSubmit: (values) => {
      sendQuickNotification(values);
    },
  });

  const [
    {
      data: getVapidPublicKeyData,
      loading: getVapidPublicKeyLoading,
      error: getVapidPublicKeyError,
    },
    getVapidPublicKey,
  ] = useAxios('/vapid-public-key');

  const [
    {
      data: saveSubscriptionData,
      loading: saveSubscriptionLoading,
      error: saveSubscriptionError,
    },
    executeSaveSubscription,
  ] = useAxios({
    url: 'subscription',
    method: 'POST',
  });

  useEffect(() => {
    dispatch(setSubscriptionId(saveSubscriptionData?.subscriptionId));
  }, [saveSubscriptionData]);

  const [
    {
      data: deleteSubscriptionData,
      loading: deleteSubscriptionLoading,
      error: deleteSubscriptionError,
    },
    executeDeleteSubscription,
  ] = useAxios({
    url: 'subscription',
    method: 'DELETE',
  });

  useEffect(() => {
    dispatch(setSubscriptionId(null));
  }, [deleteSubscriptionData]);

  const [
    {
      data: sendQuickNotificationData,
      loading: sendQuickNotificationLoading,
      error: sendQuickNotificationError,
    },
    executeSendQuickNotification,
  ] = useAxios({
    url: 'quick-notification',
    method: 'POST',
  });

  useEffect(() => {
    if ('PushManager' in window) {
      dispatch(setIsFeatureAvailable(true));
      getVapidPublicKey();
      getExistingSubscription();
    } else {
      dispatch(setIsFeatureAvailable(false));
    }
  }, []);

  const subscribe = () => {
    ReactGA.event('subscribe', {});

    let convertedVapidKey = urlBase64ToUint8Array(
      getVapidPublicKeyData['vapid-public-key']
    );

    navigator.serviceWorker
      .getRegistration(process.env.NEXT_PUBLIC_SW_SCOPE)
      .then((registration) => {
        registration.pushManager
          .subscribe({
            userVisibleOnly: true,
            applicationServerKey: convertedVapidKey,
          })
          .then((pushSubscription) => {
            dispatch(setPushSubscription(pushSubscription.toJSON()));
            console.log(
              '[App] Push subscription successful:',
              pushSubscription.toJSON()
            );
          });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const unsubscribe = () => {
    navigator.serviceWorker
      .getRegistration(process.env.NEXT_PUBLIC_SW_SCOPE)
      .then((registration) => {
        registration.pushManager.getSubscription().then((pushSubscription) => {
          pushSubscription
            .unsubscribe()
            .then((success) => {
              dispatch(setPushSubscription(null));
              console.log('[App] Unsubscription successful', success);
            })
            .catch((error) => {
              console.log('[App] Unsubscription failed', error);
            });
        });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const getExistingSubscription = () => {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.pushManager.getSubscription().then((pushSubscription) => {
          console.log('[App] Existing subscription found:', pushSubscription);
          dispatch(setPushSubscription(pushSubscription?.toJSON()));

          return pushSubscription;
        });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const saveSubscription = (tag) => {
    executeSaveSubscription({
      data: { pushSubscription: pushSubscription, tags: [tag] },
    })
      .then(() => {
        toast.success('Success saving subscription on backend');
      })
      .catch(() => {
        toast.error('Error saving subscription on backend');
      });
  };

  const deleteSubscription = () => {
    executeDeleteSubscription({
      params: { subscriptionId: saveSubscriptionData?.subscriptionId },
    })
      .then(() => {
        toast.success('Success deleting subscription from backend');
      })
      .catch(() => {
        toast.error('Error deleting subscription from backend');
      });
  };

  const sendQuickNotification = (values) => {
    let notification = defaultNotification;
    notification.title = values.title;
    notification.body = values.body;
    notification.image = values.image;

    executeSendQuickNotification({
      data: {
        pushSubscription: pushSubscription,
        notification: notification,
      },
    })
      .then(() => {
        toast.success('Success sending notification');
      })
      .catch(() => {
        toast.error('Error sending notification');
      });
  };


  return (
    <>
      {isFeatureAvailable ? (
        <>
          <Typography variant="h4" gutterBottom>
            Instant push notification
          </Typography>

          <Typography variant="body1" gutterBottom color="text.secondary">
            Test how the Web Push notification looks like on this device
          </Typography>

          <Button
            variant="contained"
            onClick={subscribe}
            disabled={pushSubscription ? true : false}
            fullWidth
            sx={{ mb: 3 }}
          >
            1. Subscribe this device {pushSubscription ? '(subscribed)' : ''}
          </Button>

          <form onSubmit={notificationFormik.handleSubmit}>
            <TextField
              disabled={!pushSubscription ? true : false}
              fullWidth
              id="title"
              name="title"
              label="Notification title"
              type="text"
              value={notificationFormik.values.title}
              onChange={notificationFormik.handleChange}
              error={
                notificationFormik.touched.title &&
                Boolean(notificationFormik.errors.title)
              }
              helperText={
                notificationFormik.touched.title &&
                notificationFormik.errors.title
              }
              size="small"
              sx={{ mb: 2 }}
            />
            <TextField
              disabled={!pushSubscription ? true : false}
              fullWidth
              id="body"
              name="body"
              label="Notification body text"
              type="text"
              value={notificationFormik.values.body}
              onChange={notificationFormik.handleChange}
              error={
                notificationFormik.touched.body &&
                Boolean(notificationFormik.errors.body)
              }
              helperText={
                notificationFormik.touched.body &&
                notificationFormik.errors.body
              }
              size="small"
              sx={{ mb: 2 }}
            />
            <TextField
              disabled={!pushSubscription ? true : false}
              fullWidth
              id="image"
              name="image"
              label="Notification image"
              type="text"
              value={notificationFormik.values.image}
              onChange={notificationFormik.handleChange}
              error={
                notificationFormik.touched.image &&
                Boolean(notificationFormik.errors.image)
              }
              helperText={
                notificationFormik.touched.image &&
                notificationFormik.errors.image
              }
              size="small"
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              fullWidth
              type="submit"
              disabled={!pushSubscription ? true : false}
              sx={{ mb: 3 }}
            >
              2. Send notification here
            </Button>
          </form>

          <Button
            fullWidth
            variant="outlined"
            onClick={unsubscribe}
            disabled={!pushSubscription ? true : false}
          >
            3. (Optional) Unsubscribe
          </Button>
          <br />
          <br />
          <form onSubmit={saveSubscriptionFormik.handleSubmit}>
            <TextField
              disabled={!pushSubscription ? true : false}
              fullWidth
              id="tag"
              name="tag"
              label="Tag (optional). For example, you can use your email here"
              type="text"
              value={saveSubscriptionFormik.values.tag}
              onChange={saveSubscriptionFormik.handleChange}
              error={
                saveSubscriptionFormik.touched.tag &&
                Boolean(saveSubscriptionFormik.errors.tag)
              }
              helperText={
                saveSubscriptionFormik.touched.tag &&
                saveSubscriptionFormik.errors.tag
              }
              title="You can send notifications to multiple devices by the subscription IDs or this tag"
            />
            <Button
              variant="contained"
              fullWidth
              type="submit"
              disabled={!pushSubscription ? true : false}
            >
              {saveSubscriptionData
                ? 'Update subscription on the backend'
                : 'Save subscription to the backend'}
            </Button>
          </form>
          <br />
          <br />
          <Button
            variant="contained"
            onClick={deleteSubscription}
            disabled={!subscriptionId ? true : false}
          >
            Delete subscription from the backend
          </Button>
          {saveSubscriptionData ? (
            <h4>Subscription ID:{subscriptionId}</h4>
          ) : null}
        </>
      ) : (
        <>Web Push API is not available in your browser</>
      )}
    </>
  );
}
