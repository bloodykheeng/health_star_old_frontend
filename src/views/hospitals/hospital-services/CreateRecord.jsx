import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress } from '@mui/material';
import RowForm from './widgets/RowForm';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import {
  getAllHospitalServices,
  getHospitalServiceById,
  postHospitalService,
  updateHospitalService,
  deleteHospitalServiceById
} from '../../../services/hospital/hospital-services-service';

function CreateRecord({ hospitalData, show, onHide, onClose }) {
  const [isSubmittingFormData, setIsSubmittingFormData] = useState(false);
  const [createMutationIsLoading, setCreateMutationIsLoading] = useState(false);

  const queryClient = useQueryClient();

  const creactMutation = useMutation({
    // mutationFn: (data) => new Promise((resolve) => setTimeout(() => resolve(data), 2000)), // Replace with your actual mutation function
    mutationFn: (data) => postHospitalService(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['hospitals-services', 'by-hospital-id', hospitalData?.id]);
      toast.success('Services attached successfully');
      setCreateMutationIsLoading(false);
      setIsSubmittingFormData(false);
      onClose();
    },
    onError: (error) => {
      setCreateMutationIsLoading(false);
      setIsSubmittingFormData(false);
      toast.error('An error occurred, please try again');
      console.log('Error:', error);
    }
  });

  const handleSubmit = async (data) => {
    setCreateMutationIsLoading(true);
    setIsSubmittingFormData(true);
    let finalData = { hospital_id: hospitalData?.id, services: data };
    console.log('Selected services:', finalData);
    creactMutation.mutate(finalData);
  };

  return (
    <Dialog open={show} onClose={onHide} maxWidth="sm" fullWidth>
      <DialogTitle>Attach Hospital Services</DialogTitle>
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
      </DialogActions>
    </Dialog>
  );
}

CreateRecord.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};

export default CreateRecord;
