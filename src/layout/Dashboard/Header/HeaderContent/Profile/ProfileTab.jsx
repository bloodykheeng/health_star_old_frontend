import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

// assets
import EditOutlined from '@ant-design/icons/EditOutlined';
import ProfileOutlined from '@ant-design/icons/ProfileOutlined';
import LogoutOutlined from '@ant-design/icons/LogoutOutlined';
import UserOutlined from '@ant-design/icons/UserOutlined';
import WalletOutlined from '@ant-design/icons/WalletOutlined';

import {
  Select,
  MenuItem,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress
} from '@mui/material';

//============ get Auth Context ===============
import useAuthContext from '../../../../../context/AuthContext';

// ==============================|| HEADER PROFILE - PROFILE TAB ||============================== //

export default function ProfileTab() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { user, logoutMutation, logoutMutationIsLoading } = useAuthContext();

  // =========================== confirm submit =========================
  const [openConfirmDiaglog, setOpenConfirmDiaglog] = useState(false);
  const [formValues, setFormValues] = useState(null);
  const [isSubmittingFormData, setIsSubmittingFormData] = useState(false);

  const handleConfirmOpen = (values) => {
    setFormValues(values);
    setOpenConfirmDiaglog(true);
  };

  const handleConfirmClose = () => {
    setOpenConfirmDiaglog(false);
    setIsSubmittingFormData(false);
  };

  const handleConfirmSubmit = () => {
    logoutMutation.mutate();
    // handle form submission
    setOpenConfirmDiaglog(false);
    // setIsSubmittingFormData(false);
  };

  //========================================= confirm submit end ======================

  const handleListItemClick = (index) => {
    setSelectedIndex(index);
  };

  return (
    <>
      <List component="nav" sx={{ p: 0, '& .MuiListItemIcon-root': { minWidth: 32 } }}>
        <ListItemButton selected={selectedIndex === 0} onClick={(event) => handleListItemClick(event, 0, '/apps/profiles/user/personal')}>
          <ListItemIcon>
            <EditOutlined />
          </ListItemIcon>
          <ListItemText primary="Edit Profile" />
        </ListItemButton>
        <ListItemButton selected={selectedIndex === 1} onClick={(event) => handleListItemClick(event, 1, '/apps/profiles/account/basic')}>
          <ListItemIcon>
            <UserOutlined />
          </ListItemIcon>
          <ListItemText primary="View Profile" />
        </ListItemButton>

        {/* <ListItemButton selected={selectedIndex === 3} onClick={(event) => handleListItemClick(event, 3, 'apps/profiles/account/personal')}>
          <ListItemIcon>
            <ProfileOutlined />
          </ListItemIcon>
          <ListItemText primary="Social Profile" />
        </ListItemButton> */}
        <ListItemButton selected={selectedIndex === 4} onClick={(event) => handleListItemClick(event, 4, '/apps/invoice/details/1')}>
          <ListItemIcon>
            <WalletOutlined />
          </ListItemIcon>
          <ListItemText primary="Transactions" />
        </ListItemButton>
        <ListItemButton selected={selectedIndex === 2} onClick={handleConfirmOpen} disabled={logoutMutationIsLoading}>
          <ListItemIcon>{logoutMutationIsLoading ? <CircularProgress size={24} /> : <LogoutOutlined />}</ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </List>
      <Dialog
        open={openConfirmDiaglog}
        onClose={handleConfirmClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Confirm Submission'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">Are you sure you want to LogOut?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmSubmit} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

ProfileTab.propTypes = { handleLogout: PropTypes.func };
