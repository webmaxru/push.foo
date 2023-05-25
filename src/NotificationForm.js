import * as React from 'react';
import Typography from '@mui/material/Typography';

import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Switch from '@mui/material/Switch';
import Link from '@mui/material/Link';

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
            <Typography variant="h5" gutterBottom>
              Standard properties
            </Typography>

            <Typography variant="body2" gutterBottom>
              A full list of the Notification API's{' '}
              <Link
                color="secondary"
                href="https://notifications.spec.whatwg.org/#object-members"
              >
                Notification object
              </Link>{' '}
              members
            </Typography>

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
            <TextField
              fullWidth
              id="badge"
              name="badge"
              label="Badge. Image to identify app (Android-only atm)"
              value={notificationFormik.values.badge}
              onChange={notificationFormik.handleChange}
              error={
                notificationFormik.touched.badge &&
                Boolean(notificationFormik.errors.badge)
              }
              helperText={
                notificationFormik.touched.badge &&
                notificationFormik.errors.badge
              }
              size="small"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              id="tag"
              name="tag"
              label="Tag"
              value={notificationFormik.values.tag}
              onChange={notificationFormik.handleChange}
              error={
                notificationFormik.touched.tag &&
                Boolean(notificationFormik.errors.tag)
              }
              helperText={
                notificationFormik.touched.tag && notificationFormik.errors.tag
              }
              size="small"
              sx={{ mb: 2 }}
            />
            <FormControl>
              <FormLabel id="dir-label">Dir</FormLabel>
              <RadioGroup
                aria-labelledby="dir-label"
                defaultValue="auto"
                name="dir"
                id="dir"
                value={notificationFormik.values.dir}
                onChange={notificationFormik.handleChange}
                error={
                  notificationFormik.touched.dir &&
                  Boolean(notificationFormik.errors.dir)
                }
                helperText={
                  notificationFormik.touched.dir &&
                  notificationFormik.errors.dir
                }
                size="small"
                sx={{ mb: 2 }}
              >
                <FormControlLabel
                  value="auto"
                  control={<Radio />}
                  label="auto"
                />
                <FormControlLabel value="ltr" control={<Radio />} label="ltr" />
                <FormControlLabel value="rtl" control={<Radio />} label="rtl" />
              </RadioGroup>
            </FormControl>

            <TextField
              fullWidth
              id="lang"
              name="lang"
              label="Lang (BCP 47 tag or empty)"
              value={notificationFormik.values.lang}
              onChange={notificationFormik.handleChange}
              error={
                notificationFormik.touched.lang &&
                Boolean(notificationFormik.errors.lang)
              }
              helperText={
                notificationFormik.touched.lang &&
                notificationFormik.errors.lang
              }
              size="small"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              id="timestamp"
              name="timestamp"
              label="Timestamp"
              value={notificationFormik.values.timestamp}
              onChange={notificationFormik.handleChange}
              error={
                notificationFormik.touched.timestamp &&
                Boolean(notificationFormik.errors.timestamp)
              }
              helperText={
                notificationFormik.touched.timestamp &&
                notificationFormik.errors.timestamp
              }
              size="small"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              id="vibrate"
              name="vibrate"
              label="Vibrate (vibration pattern, deprecated)"
              value={notificationFormik.values.vibrate}
              onChange={notificationFormik.handleChange}
              error={
                notificationFormik.touched.vibrate &&
                Boolean(notificationFormik.errors.vibrate)
              }
              helperText={
                notificationFormik.touched.vibrate &&
                notificationFormik.errors.vibrate
              }
              size="small"
              sx={{ mb: 2 }}
            />

            <FormControlLabel
              control={
                <Switch
                  name="requireInteraction"
                  checked={notificationFormik.values.requireInteraction}
                  onChange={notificationFormik.handleChange}
                />
              }
              label="Require interaction"
            />
            <br />
            <FormControlLabel
              control={
                <Switch
                  name="renotify"
                  checked={notificationFormik.values.renotify}
                  onChange={notificationFormik.handleChange}
                />
              }
              label="Renotify"
            />
            <br />
            <FormControlLabel
              control={
                <Switch
                  name="silent"
                  checked={notificationFormik.values.silent}
                  onChange={notificationFormik.handleChange}
                />
              }
              label="Silent"
            />

            <Typography variant="h5" gutterBottom>
              Custom built properties
            </Typography>

            <Typography variant="body2" gutterBottom color="text.secondary">
              These are not part of the Notification API specification but
              implemented as a part of the application logic.
            </Typography>

            <FormControlLabel
              control={
                <Switch
                  name="data.updateInAppCounter"
                  checked={notificationFormik.values.data.updateInAppCounter}
                  onChange={notificationFormik.handleChange}
                />
              }
              label="Update in-app counter"
            />
            <br />
            <FormControlLabel
              control={
                <Switch
                  name="data.updateIconBadgeCounter"
                  checked={
                    notificationFormik.values.data.updateIconBadgeCounter
                  }
                  onChange={notificationFormik.handleChange}
                />
              }
              label="Update icon badge counter"
            />
          </form>

          <hr />

          <Typography variant="body2" gutterBottom color="text.secondary">
            Customizing actions will be added in the next version of Push.Foo
          </Typography>
        </CardContent>
      </Card>
    </>
  );
}
