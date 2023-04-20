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
  defaultNotification,
} from './shared/pushHelpers';
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
import ProTip from '../src/ProTip';

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
  icon: yup
    .string('Enter notification icon url')
    .url('This should be a valid url'),
});

const sendNotificationValidationSchema = yup.object({
  subscriptionIds: yup.string('Enter comma-separated subscription IDs'),
  tag: yup.string('Enter the tag for the subscription'),
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

  const [notificationModeState, setNotificationModeState] = useState(null);

  const [sendTabValue, setSendTabValue] = React.useState(0);

  const handleSendTabValueChange = (event, newValue) => {
    setSendTabValue(newValue);
  };

  const handleNotificationModeState = (mode) => {
    setNotificationModeState(mode);
  };

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
      icon: 'https://push.foo/images/logo.jpg',
    },
    validationSchema: notificationValidationSchema,
    onSubmit: (values) => {
      if (notificationModeState === 'quick') {
        sendQuickNotification(values);
      }
      if (notificationModeState === 'multi') {
        sendNotificationFormik.handleSubmit();
      }
    },
  });

  const sendNotificationFormik = useFormik({
    initialValues: {
      tag: '',
    },
    validationSchema: sendNotificationValidationSchema,
    onSubmit: (values) => {
      sendNotification(values);
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
    notification.icon = values.icon;

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

  const sendNotification = (values) => {
    let notification = defaultNotification;
    notification.title = notificationFormik.values.title;
    notification.body = notificationFormik.values.body;
    notification.image = notificationFormik.values.image;
    notification.icon = notificationFormik.values.icon;

    executeSendNotification({
      data: {
        tag: values.tag,
        subscriptionIds: values.subscriptionIds?.replace(/\s+/g, '').split(','),
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
      
      <Typography variant="h4" gutterBottom>
        Instant push notification
      </Typography>

      <Typography variant="body1" gutterBottom color="text.secondary">
        Test how the Web Push notification looks like on this device
      </Typography>

      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          {isFeatureAvailable ? (
            <>
              <Button
                variant="contained"
                onClick={subscribe}
                disabled={pushSubscription ? true : false}
                fullWidth
              >
                1. Subscribe this device{' '}
                {pushSubscription ? '(subscribed)' : ''}
              </Button>
              <Typography variant="caption" display="block" sx={{ mb: 2 }}>
                Have a look at the icon in the address bar - you might need to
                allow notifications there
              </Typography>

              <Button
                form="notificationForm"
                variant="contained"
                fullWidth
                type="submit"
                disabled={!pushSubscription ? true : false}
                onClick={() => handleNotificationModeState('quick')}
              >
                2. Send notification here
              </Button>
              <Typography variant="caption" display="block" sx={{ mb: 2 }}>
                You can change some parameters of the notification in the form
                below
              </Typography>

              <Button
                fullWidth
                variant="outlined"
                onClick={unsubscribe}
                disabled={!pushSubscription ? true : false}
              >
                3. (Optional) Unsubscribe
              </Button>
            </>
          ) : (
            <Typography variant="body1" gutterBottom color="error.main">
              Web Push API is not available in your browser. On iOS 16.4+
              devices, you have to "Add to Home Screen" first (in "Share" icon
              menu).
            </Typography>
          )}
        </CardContent>
      </Card>

      <ProTip />

      <Typography variant="h4" gutterBottom sx={{ mt: 3 }}>
        Multi-device/browser push notification
      </Typography>

      <Typography variant="body1" gutterBottom color="text.secondary">
        Register multiple devices and/or browsers and send notifications there
      </Typography>

      <Card variant="outlined" sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Send notifications to previously registered devices
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
              form="notificationForm"
              variant="contained"
              fullWidth
              type="submit"
              onClick={() => handleNotificationModeState('multi')}
            >
              Send notifications
            </Button>
            <Typography variant="caption" display="block" sx={{ mb: 2 }}>
              You can change some parameters of the notification in the form
              below. Only notifications for your maximum 10 latest device
              registrations will be sent.
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

          <Divider variant="middle" />

          <Typography variant="h4" gutterBottom sx={{ mt: 3 }}>
            Notification properties
          </Typography>

          <Typography variant="body1" color="text.secondary">
            These properties are in use by both instant and multi-device options
            above
          </Typography>

          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <form
                onSubmit={notificationFormik.handleSubmit}
                id="notificationForm"
              >
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
                  label="Body. Main text of the notification."
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
                  label="Image. Main image, part of the content."
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
                <TextField
                  disabled={!pushSubscription ? true : false}
                  fullWidth
                  id="icon"
                  name="icon"
                  label="Icon. Secondary image of notification."
                  type="text"
                  value={notificationFormik.values.icon}
                  onChange={notificationFormik.handleChange}
                  error={
                    notificationFormik.touched.icon &&
                    Boolean(notificationFormik.errors.icon)
                  }
                  helperText={
                    notificationFormik.touched.icon &&
                    notificationFormik.errors.icon
                  }
                  size="small"
                  sx={{ mb: 2 }}
                />
              </form>
            </CardContent>
          </Card>
        </>
      ) : (
        <>You can not register this device for multi-device notifications.</>
      )}
    </>
  );
}
