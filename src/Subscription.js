import * as React from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import {
  urlBase64ToUint8Array,
  subscribe,
  unsubscribe,
  getExistingSubscription,
  defaultNotification,
  buildNotification,
} from './shared/pushHelpers';
import {
  saveSubscriptionValidationSchema,
  notificationValidationSchema,
  sendNotificationValidationSchema,
} from './shared/validationSchemas';
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
import {
  setNotification,
  selectNotification,
} from '../store/notificationSlice';
import { useFormik } from 'formik';

import ProTip from '../src/ProTip';
import NotificationForm from '../src/NotificationForm';

import { isIOS } from 'react-device-detect';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

configure({
  axios,
  defaultOptions: {
    manual: true,
    useCache: false,
    ssr: false,
    autoCancel: false,
  },
});

export default function Subscription(props) {
  const dispatch = useDispatch();
  const isFeatureAvailable = useSelector(selectIsFeatureAvailable);
  const pushSubscription = useSelector(selectPushSubscription);
  const subscriptionId = useSelector(selectSubscriptionId);

  const [sendTabValue, setSendTabValue] = React.useState(0);

  const handleSendTabValueChange = (event, newValue) => {
    setSendTabValue(newValue);
  };

  const saveSubscriptionFormik = useFormik({
    initialValues: {
      tag: '',
    },
    validationSchema: saveSubscriptionValidationSchema,
    onSubmit: (values, { setSubmitting }) => {
      saveSubscription(values.tag);
      setSubmitting(false);
    },
  });

  const notificationFormik = useFormik({
    initialValues: defaultNotification,
    validationSchema: notificationValidationSchema,
    onSubmit: (values, { setSubmitting }) => {
      dispatch(setNotification(values));
      setSubmitting(false);
    },
  });

  const sendNotificationFormik = useFormik({
    initialValues: {
      tag: '',
      subscriptionIds: '',
    },
    validationSchema: sendNotificationValidationSchema,
    onSubmit: (values, { setSubmitting }) => {
      sendNotification(values);
      setSubmitting(false);
    },
  });

  const getVapidPublicKey = async () => {
    console.log('[App] Getting VAPID public key');
    try {
      await executeGetVapidPublicKey();
    } catch (error) {
      toast.error('Error getting VAPID public key');
      console.error('[App] Error getting VAPID public key', error);
    }
  };

  const [
    {
      data: getVapidPublicKeyData,
      loading: getVapidPublicKeyLoading,
      error: getVapidPublicKeyError,
    },
    executeGetVapidPublicKey,
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

  const [
    {
      data: sendNotificationData,
      loading: sendNotificationLoading,
      error: sendNotificationError,
    },
    executeSendNotification,
  ] = useAxios({
    url: 'notification',
    method: 'POST',
  });

  let initialized = false;

  useEffect(() => {
    if (!initialized) {
      initialized = true;

      if ('PushManager' in window) {
        dispatch(setIsFeatureAvailable(true));
        getVapidPublicKey();
        handleGetExistingSubscription();
      } else {
        dispatch(setIsFeatureAvailable(false));
      }
    }
  }, []);

  const handleSubscribe = () => {
    ReactGA.event('subscribe', {});

    let convertedVapidKey = urlBase64ToUint8Array(
      getVapidPublicKeyData['vapid-public-key']
    );

    subscribe(convertedVapidKey, process.env.NEXT_PUBLIC_SW_SCOPE)
      .then((pushSubscription) => {
        dispatch(setPushSubscription(pushSubscription.toJSON()));
        console.log(
          '[App] Push subscription successful:',
          pushSubscription.toJSON()
        );
        return pushSubscription;
      })
      .catch((error) => {
        console.log('[App] Subscription failed', error);
        toast.error(
          'Cannot subscribe this browser. Check notification permission.'
        );
      });
  };

  const handleUnsubscribe = () => {
    ReactGA.event('unsubscribe', {});

    unsubscribe(process.env.NEXT_PUBLIC_SW_SCOPE)
      .then((success) => {
        dispatch(setPushSubscription(null));
        console.log('[App] Unsubscription successful', success);
      })
      .catch((error) => {
        console.log('[App] Unsubscription failed', error);
        toast.error(err);
      });
  };

  const handleGetExistingSubscription = () => {
    getExistingSubscription()
      .then((pushSubscription) => {
        console.log('[App] Existing subscription found:', pushSubscription);
        dispatch(setPushSubscription(pushSubscription?.toJSON()));

        return pushSubscription;
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const saveSubscription = (tag) => {
    ReactGA.event('save_subscription', { pushSubscription: pushSubscription });

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
    ReactGA.event('delete_subscription', {
      subscriptionId: saveSubscriptionData?.subscriptionId,
    });

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

  const handleSendQuickNotification = () => {
    notificationFormik.handleSubmit();
    notificationFormik.validateForm().then((errors) => {
      if (Object.keys(errors).length === 0) {
        sendQuickNotification(notificationFormik.values);
      } else {
        toast.error('Error validating notification form');
      }
    });
  };

  const sendQuickNotification = (values) => {
    let notification = buildNotification(values);
    console.log('[App] Sending notification', notification);

    ReactGA.event('send_quick_notification', { notification: notification });

    executeSendQuickNotification({
      data: {
        pushSubscription: pushSubscription,
        notification: notification,
      },
    })
      .then(() => {
        toast.success(
          'Success sending push (this is NOT notification itself!)'
        );
      })
      .catch(() => {
        toast.error('Error sending notification');
      });
  };

  const handleSendNotification = () => {
    notificationFormik.handleSubmit();
    notificationFormik.validateForm().then((errors) => {
      if (Object.keys(errors).length === 0) {
        sendNotificationFormik.handleSubmit();
      } else {
        toast.error('Error validating notification form');
      }
    });
  };

  const sendNotification = (values) => {
    let notification = buildNotification(notificationFormik.values);
    console.log('[App] Sending notification', notification);

    let subscriptionIds = values.subscriptionIds
      ?.replace(/\s+/g, '')
      .split(',');

    ReactGA.event('send_notification', {
      notification: notification,
      tag: values.tag,
      subscriptionIds: subscriptionIds,
    });

    executeSendNotification({
      data: {
        tag: values.tag,
        subscriptionIds: subscriptionIds,
        notification: notification,
      },
    })
      .then(() => {
        toast.success(
          'Success sending push (this is NOT notification itself!)'
        );
      })
      .catch(() => {
        toast.error('Error sending notification');
      });
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Instant push notification
      </Typography>

      <Typography variant="body1" gutterBottom color="text.secondary">
        Test how does the Web Push notification look like on this device
      </Typography>

      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          {isFeatureAvailable ? (
            <>
              <Button
                variant="contained"
                onClick={handleSubscribe}
                disabled={pushSubscription ? true : false}
                fullWidth
              >
                1. Subscribe this device{' '}
                {pushSubscription ? '(subscribed)' : ''}
              </Button>
              <Typography
                variant="caption"
                display="block"
                sx={{ mb: 2 }}
                color="warning.main"
              >
                If nothing happens, click again and/or look at the icon in the
                address bar - you might need to allow notifications there
              </Typography>

              <Button
                variant="contained"
                fullWidth
                type="submit"
                disabled={!pushSubscription ? true : false}
                onClick={() => handleSendQuickNotification()}
              >
                2. Send notification here
              </Button>
              <Typography variant="caption" display="block" sx={{ mb: 2 }}>
                You can change some parameters of the notification in the{' '}
                <Link color="secondary" href="#notification">
                  form below
                </Link>
              </Typography>

              <Button
                fullWidth
                variant="outlined"
                onClick={handleUnsubscribe}
                disabled={!pushSubscription ? true : false}
              >
                3. (Optional) Unsubscribe
              </Button>
            </>
          ) : (
            <Typography variant="body1" gutterBottom color="error.main">
              {isIOS
                ? 'To enable Web Push on iOS 16.4+ devices, you have to "Add to Home Screen" first (in "Share" icon menu) and then open the app from the home screen.'
                : 'Oh, it looks like Web Push is not available in your browser.'}
            </Typography>
          )}
        </CardContent>
      </Card>

      <ProTip />

      <Typography variant="h4" gutterBottom sx={{ mt: 3 }}>
        Multi-device push notifications
      </Typography>

      <Typography variant="body1" gutterBottom color="text.secondary">
        Register multiple devices and/or browsers on this device and send
        notifications there
      </Typography>

      <Card variant="outlined" sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Send notifications to the previously registered devices
          </Typography>

          <form>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={sendTabValue} onChange={handleSendTabValueChange}>
                <Tab label="By subscription ID" />
                <Tab label="By tag" />
              </Tabs>
            </Box>
            <TabPanel value={sendTabValue} index={0}>
              <TextField
                fullWidth
                id="subscriptionIds"
                name="subscriptionIds"
                label="Subscription IDs"
                type="text"
                value={sendNotificationFormik.values.subscriptionIds}
                onChange={sendNotificationFormik.handleChange}
                error={
                  sendNotificationFormik.touched.subscriptionIds &&
                  Boolean(sendNotificationFormik.errors.subscriptionIds)
                }
                helperText={
                  sendNotificationFormik.touched.subscriptionIds &&
                  sendNotificationFormik.errors.subscriptionIds
                }
                size="small"
              />
              <Typography variant="caption" display="block">
                Comma separated list of subscription IDs you got after
                registering the devices
              </Typography>
            </TabPanel>
            <TabPanel value={sendTabValue} index={1}>
              <TextField
                fullWidth
                id="tag"
                name="tag"
                label="Tag"
                type="text"
                value={sendNotificationFormik.values.tag}
                onChange={sendNotificationFormik.handleChange}
                error={
                  sendNotificationFormik.touched.tag &&
                  Boolean(sendNotificationFormik.errors.tag)
                }
                helperText={
                  sendNotificationFormik.touched.tag &&
                  sendNotificationFormik.errors.tag
                }
                size="small"
              />
              <Typography variant="caption" display="block">
                Tag you used (optionally) when registered the device
              </Typography>
            </TabPanel>

            <Button
              variant="contained"
              fullWidth
              type="button"
              onClick={() => handleSendNotification()}
            >
              Send notifications
            </Button>
            <Typography variant="caption" display="block" sx={{ mb: 2 }}>
              You can change some parameters of the notification in the form
              below. Only notifications for your 10 latest device registrations
              will be sent.
            </Typography>
          </form>
        </CardContent>
      </Card>

      {isFeatureAvailable ? (
        <>
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Register this device (optional)
              </Typography>
              <Typography variant="body1" gutterBottom color="text.secondary">
                You must subscribe this device first using the instant
                notification form above
              </Typography>

              <form onSubmit={saveSubscriptionFormik.handleSubmit}>
                <TextField
                  disabled={!pushSubscription ? true : false}
                  fullWidth
                  id="tag"
                  name="tag"
                  label="Tag (optional)"
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
                  size="small"
                />
                <Typography variant="caption" display="block" sx={{ mb: 2 }}>
                  Come up with "your own" tag, so no other users can send you
                  notifications. For example, you can use your email.
                </Typography>
                <Button
                  variant="contained"
                  fullWidth
                  type="submit"
                  disabled={!pushSubscription ? true : false}
                  sx={{ mb: 3 }}
                >
                  {subscriptionId
                    ? 'Update subscription on the backend'
                    : 'Save subscription to the backend'}
                </Button>
              </form>

              {subscriptionId ? (
                <Typography variant="body1" color="success.main" sx={{ mb: 3 }}>
                  You can send notifications to this device by the subscription
                  ID <strong>{subscriptionId}</strong> and/or tag above (if you
                  entered it before saving)
                </Typography>
              ) : null}

              <Button
                variant="outlined"
                onClick={deleteSubscription}
                disabled={!subscriptionId ? true : false}
                fullWidth
              >
                Delete subscription from the backend
              </Button>
            </CardContent>
          </Card>
        </>
      ) : (
        <Typography variant="body1" gutterBottom>
          You can not register this device/browser for receiving notifications.
          But you can send notifications to your other registered
          devices/browsers from here.
        </Typography>
      )}

      <Divider variant="middle" />

      <NotificationForm
        notificationFormik={notificationFormik}
      ></NotificationForm>
    </>
  );
}
