import * as React from 'react';
import Typography from '@mui/material/Typography';

import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Switch from '@mui/material/Switch';
export default function NotificationForm(props) {
  const notificationFormik = props.notificationFormik;

  return (
    <>
      <Typography variant="h4" gutterBottom sx={{ mt: 3 }} id="notification">
        Notification properties
      </Typography>

      <Typography variant="body1" color="text.secondary">
        These properties are in use both by instant and multi-device options
        above
      </Typography>

      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <form
            onSubmit={notificationFormik.handleSubmit}
            id="notificationForm"
          >
            <TextField
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
              fullWidth
              id="image"
              name="image"
              label="Image. Main illustration."
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
              fullWidth
              id="icon"
              name="icon"
              label="Icon. Image to be placed near text."
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
            <FormControlLabel
              control={
                <Switch
                  name="updateInAppCounter"
                  checked={notificationFormik.values.data.updateInAppCounter}
                  onChange={notificationFormik.handleChange}
                />
              }
              label="Update in-app counter"
            />
            <FormControlLabel
              control={
                <Switch
                  name="updateIconBadgeCounter"
                  checked={notificationFormik.values.data.updateIconBadgeCounter}
                  onChange={notificationFormik.handleChange}
                />
              }
              label="Update icon badge counter"
            />
          </form>

          <Typography variant="body1" gutterBottom>
            There are many more properties you can customize including custom
            actions. This will be added in the next version of Push.Foo
          </Typography>
        </CardContent>
      </Card>
    </>
  );
}
