import { useDispatch, useSelector } from 'react-redux';
import {
  selectNotificationCount,
  reset,
} from '../store/notificationCountSlice';

import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';

const NotificationCount = (props) => {
  const dispatch = useDispatch();
  const notificationCount = useSelector(selectNotificationCount);

  const resetNotificationCount = () => {
    dispatch(reset());
  };

  return (
    <IconButton color="inherit" onClick={resetNotificationCount} title="Click to reset notification count">
      <Badge badgeContent={notificationCount} color="secondary">
        <NotificationsIcon />
      </Badge>
    </IconButton>
  );
};

export default NotificationCount;
