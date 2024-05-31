import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import {
  getAllUsers,
  getUserById,
  getApproverRoles,
  createUser,
  updateUser,
  deleteUserById,
  getAssignableRoles
} from '../../../services/auth/user-service';
import { CircularProgress } from '@mui/material';
import RowForm from './widgets/RowForm';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

function CreateRecord({ show, onHide, onClose }) {
  const [isSubmittingFormData, setIsSubmittingFormData] = useState(false);
  const [createMutationIsLoading, setCreateMutationIsLoading] = useState(false);

  const queryClient = useQueryClient();

  const creactMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      toast.success('created Successfully');
      setCreateMutationIsLoading(false);
      setIsSubmittingFormData(false);
      onClose();
    },
    onError: (error) => {
      setCreateMutationIsLoading(false);
      setIsSubmittingFormData(false);
      // onClose();

      error?.response?.data?.message
        ? toast.error(error?.response?.data?.message)
        : !error?.response
          ? toast.warning('Check Your Internet Connection Please')
          : toast.error('An Error Occured Please Contact Admin');
      console.log('create users error : ', error);
    }
  });

  const handleSubmit = async (data) => {
    setCreateMutationIsLoading(true);
    // event.preventDefault();
    console.log('data we are submitting while creating a user : ', data);
    creactMutation.mutate(data);
  };

  return (
    <Dialog open={show} onClose={onHide} maxWidth="sm" fullWidth>
      <DialogTitle>Add User</DialogTitle>
      <DialogContent dividers>
        <RowForm
          handleSubmittingFormData={handleSubmit}
          isSubmittingFormData={isSubmittingFormData}
          setIsSubmittingFormData={setIsSubmittingFormData}
        />
        {createMutationIsLoading && (
          <center>
            <CircularProgress size={24} />
          </center>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onHide} color="primary">
          Cancel
        </Button>
        {/* <Button onClick={formik.handleSubmit} color="primary">
          Save
        </Button> */}
      </DialogActions>
    </Dialog>
  );
}

CreateRecord.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  loggedInUserData: PropTypes.object
};

export default CreateRecord;
