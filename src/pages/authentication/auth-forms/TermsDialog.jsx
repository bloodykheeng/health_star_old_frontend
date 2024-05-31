import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/system';

const StyledDialog = styled(Dialog)({
  '& .MuiDialog-paper': {
    width: '80%',
    maxHeight: '90vh'
  }
});

const TermsDialog = ({ open, handleClose }) => (
  <StyledDialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
    <DialogTitle>
      Terms and Conditions
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500]
        }}
      >
        <CloseIcon />
      </IconButton>
    </DialogTitle>
    <DialogContent dividers>
      {/* Add your terms and conditions content here */}
      <p>Here are the terms and conditions...</p>
    </DialogContent>
    <DialogActions>
      <Button onClick={handleClose} color="primary">
        Agree
      </Button>
    </DialogActions>
  </StyledDialog>
);

export default TermsDialog;
