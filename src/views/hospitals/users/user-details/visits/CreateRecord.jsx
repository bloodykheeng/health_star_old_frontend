import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { getAllVisits, getVisitById, postVisit, updateVisit, deleteVisitById } from '../../../../../services/visits/visits-service';
import { CircularProgress } from '@mui/material';
import RowForm from './widgets/RowForm';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

function CreateRecord({ show, onHide, onClose, userProfileData, hospitalData }) {
  const [isSubmittingFormData, setIsSubmittingFormData] = useState(false);
  const [createMutationIsLoading, setCreateMutationIsLoading] = useState(false);

  const queryClient = useQueryClient();

  const creactMutation = useMutation({
    mutationFn: postVisit,
    onSuccess: () => {
      queryClient.invalidateQueries(['visits']);
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

    let finalData = { ...data, user_id: data?.user?.id, hospital_id: data?.hospital?.id };
    console.log('data we are submitting while creating a visit : ', finalData);
    // creactMutation.mutate(finalData);
  };

  return (
    <Dialog open={show} onClose={onHide} maxWidth="sm" fullWidth>
      <DialogTitle>Add Visit</DialogTitle>
      <DialogContent dividers>
        <RowForm
          handleSubmittingFormData={handleSubmit}
          isSubmittingFormData={isSubmittingFormData}
          setIsSubmittingFormData={setIsSubmittingFormData}
          userProfileData={userProfileData}
          hospitalData={hospitalData}
        />
        {/* {createMutationIsLoading && (
          <center>
            <CircularProgress size={24} />
          </center>
        )} */}
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
