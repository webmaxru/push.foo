import { useDispatch, useSelector } from 'react-redux';
import {
  resetInAppCount,
  resetIconBadgeCount,
  selectNotificationInAppCount,
} from '../store/notificationCountSlice';

import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';

const NotificationCount = (props) => {
  const dispatch = useDispatch();
  const notificationInAppCount = useSelector(selectNotificationInAppCount);

  const resetNotificationCount = () => {
    dispatch(resetInAppCount());
    dispatch(resetIconBadgeCount());

    if ('setAppBadge' in navigator) {
      navigator
        .clearAppBadge()
        .then(() => {
          console.log('[App] The app badge was removed');
        })
        .catch((error) => {
          console.error('[App] Error removing the app badge', error);
        });
    }
  };

  return (
    <IconButton
      color="inherit"
      onClick={resetNotificationCount}
      title="Click to reset notification count"
    >
      <Badge badgeContent={notificationInAppCount} color="secondary">
        <NotificationsIcon />
      </Badge>
    </IconButton>
  );
};

export default NotificationCount;
