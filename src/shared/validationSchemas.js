import * as yup from 'yup';

export const saveSubscriptionValidationSchema = yup.object({
  tag: yup
    .string('Enter the tag for the subscription')
    .max(20, 'Tag should be of maximum 20 characters length'),
});

export const notificationValidationSchema = yup.object({
  title: yup
    .string('Enter notification title')
    .max(256, 'Title should be of maximum 256 characters length')
    .required('Title is required'),
  body: yup
    .string('Enter notification body text')
    .max(512, 'Body text should be of maximum 512 characters length'),
  image: yup
    .string('Enter notification image url')
    .url('This should be a valid url'),
  icon: yup
    .string('Enter notification icon url')
    .url('This should be a valid url'),
  updateInAppCounter: yup.bool(),
  updateIconBadgeCounter: yup.bool(),
});

export const sendNotificationValidationSchema = yup.object().shape(
  {
    subscriptionIds: yup.string().when('tag', {
      is: (tag) => !tag || tag.length === 0,
      then: () =>
        yup.string().required('Enter comma-separated subscription IDs'),
      otherwise: () => yup.string(),
    }),
    tag: yup.string().when('subscriptionIds', {
      is: (subscriptionIds) => !subscriptionIds || subscriptionIds.length === 0,
      then: () => yup.string().required('Enter the tag for the subscription'),
      otherwise: () => yup.string(),
    }),
  },
  [['subscriptionIds', 'tag']]
);

export default {
  saveSubscriptionValidationSchema,
  notificationValidationSchema,
  sendNotificationValidationSchema,
};
