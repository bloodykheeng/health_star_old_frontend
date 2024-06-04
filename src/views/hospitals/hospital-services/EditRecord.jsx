import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import {
  getAllHospitalServices,
  getHospitalServiceById,
  postHospitalService,
  updateHospitalService,
  deleteHospitalServiceById
} from '../../../services/hospital/hospital-services-service';
import { CircularProgress } from '@mui/material';
import EditRowForm from './widgets/EditRowForm';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

function EditRecord({ show, onHide, onClose, rowData, hospitalData }) {
  const [isSubmittingFormData, setIsSubmittingFormData] = useState(false);
  const [editMutationIsLoading, setEditMutationIsLoading] = useState(false);

  const queryClient = useQueryClient();

  const editMutation = useMutation({
    mutationFn: (variables) => updateHospitalService(rowData?.id, variables),
    onSuccess: () => {
      onClose();
      toast.success('Edited Successfully');
      queryClient.invalidateQueries(['hospitals-services']);
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
    // event.preventDefault();
    setEditMutationIsLoading(true);

    let finalData = { no_of_points: data?.no_of_points, service_id: data?.services?.id, hospital_id: hospitalData?.id };

    console.log('data we are submitting while creating a Hospital services : ', data);
    // setEditMutationIsLoading(false);
    editMutation.mutate(finalData);
  };

  return (
    <Dialog open={show} onClose={onHide} maxWidth="sm" fullWidth>
      <DialogTitle>Add Hospital</DialogTitle>
      <DialogContent dividers>
        <EditRowForm
          handleSubmittingFormData={handleSubmit}
          isSubmittingFormData={editMutationIsLoading}
          setIsSubmittingFormData={setEditMutationIsLoading}
          initialData={rowData}
          hospitalData={hospitalData}
        />
        {/* {editMutationIsLoading && (
          <center>
            <CircularProgress size={24} />
          </center>
        )} */}
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
