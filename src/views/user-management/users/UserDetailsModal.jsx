import React from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Avatar, Chip, Stack } from '@mui/material';
import { List, ListItem, ListItemText } from '@mui/material';

function UserDetailsModal({ user, showModal, handleCloseModal }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'deactive':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Dialog open={showModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
      <DialogTitle>User Details</DialogTitle>
      <DialogContent dividers>
        {user ? (
          <Stack spacing={2} justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={2} alignItems="center">
              {user.photo_url ? (
                <Avatar src={`${import.meta.env.VITE_APP_API_BASE_URL}${user.photo_url}`} alt={user.name} />
              ) : (
                <Avatar>{user.name.charAt(0)}</Avatar>
              )}
              <Typography variant="h6">{user.name}</Typography>
            </Stack>
            <Typography variant="body1">Email: {user.email}</Typography>
            <Typography variant="body1">Phone: {user.phone}</Typography>
            <Typography variant="body1">Role: {user.role}</Typography>
            <Typography variant="body1">Date of Birth: {user.dateOfBirth}</Typography>
            <Typography variant="body1">Last Login: {user.lastlogin}</Typography>
            <Stack direction="row" spacing={1}>
              {' '}
              <Chip label={user.status} color={getStatusColor(user.status)} />
            </Stack>

            <Typography variant="body1">
              <List>
                {user.permissions.map((permission, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={permission} />
                  </ListItem>
                ))}
              </List>
            </Typography>
          </Stack>
        ) : (
          <Typography variant="body1">No user details available</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseModal} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

UserDetailsModal.propTypes = {
  user: PropTypes.object,
  showModal: PropTypes.bool.isRequired,
  handleCloseModal: PropTypes.func.isRequired
};

export default UserDetailsModal;
