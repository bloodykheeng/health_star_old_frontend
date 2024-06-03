import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import {
  getAllHospitals,
  getHospitalById,
  postHospital,
  updateHospital,
  deleteHospitalById
} from '../../services/hospital/hospital-service';
import { CircularProgress } from '@mui/material';
import RowForm from './widgets/RowForm';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

function EditRecord({ show, onHide, onClose, rowData }) {
  const [isSubmittingFormData, setIsSubmittingFormData] = useState(false);
  const [editMutationIsLoading, setEditMutationIsLoading] = useState(false);

  const queryClient = useQueryClient();

  const editMutation = useMutation({
    mutationFn: (variables) => updateHospital(rowData?.id, variables),
    onSuccess: () => {
      onClose();
      toast.success('Edited Successfully');
      queryClient.invalidateQueries(['hospitals']);
      setEditMutationIsLoading(false);
      setIsSubmittingFormData(false);
    },
    onError: (error) => {
      // onClose();
      error?.response?.data?.message
        ? toast.error(error?.response?.data?.message)
        : !error?.response
          ? toast.warning('Check Your Internet Connection Please')
          : toast.error('An Error Occured Please Contact Admin');
      console.log('create users error : ', error);
      setEditMutationIsLoading(false);
      setIsSubmittingFormData(false);
    }
  });

  const handleSubmit = async (data) => {
    const formData = new FormData();
    formData.append('_method', 'PUT');
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('status', data.status);
    formData.append('phone_number', data.phone_number);
    formData.append('address', data.address);
    formData.append('city', data.city);
    formData.append('state', data.state);
    formData.append('country', data.country);
    formData.append('zip_code', data.zip_code);
    formData.append('website', data.website);
    formData.append('capacity', data.capacity);

    // Assuming 'photo' is a file field; it should be handled by the onFileUpload function
    if (data.photo) {
      formData.append('photo', data.photo);
    }

    // Log formData keys and values for debugging
    // formData.forEach((value, key) => {
    //     console.log(`${key}: ${value}`);
    // });

    setEditMutationIsLoading(true);
    // event.preventDefault();
    console.log('data we are submitting while creating a Hospital : ', data);
    editMutation.mutate(formData);
  };

  return (
    <Dialog open={show} onClose={onHide} maxWidth="sm" fullWidth>
      <DialogTitle>Add Hospital</DialogTitle>
      <DialogContent dividers>
        <RowForm
          handleSubmittingFormData={handleSubmit}
          isSubmittingFormData={isSubmittingFormData}
          setIsSubmittingFormData={setIsSubmittingFormData}
          initialData={rowData}
        />
        {editMutationIsLoading && (
          <center>
            <CircularProgress size={24} />
          </center>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setIsSubmittingFormData(false);
            onHide();
          }}
          color="primary"
        >
          Cancel
        </Button>
        {/* <Button onClick={formik.handleSubmit} color="primary">
          Save
        </Button> */}
      </DialogActions>
    </Dialog>
  );
}

EditRecord.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  loggedInUserData: PropTypes.object
};

export default EditRecord;
