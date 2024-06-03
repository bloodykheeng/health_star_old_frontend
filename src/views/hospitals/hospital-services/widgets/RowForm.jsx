import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Autocomplete, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, FormHelperText } from '@mui/material';
import {
  getAllHospitalServices,
  getHospitalServiceById,
  postHospitalService,
  updateHospitalService,
  deleteHospitalServiceById
} from '../../../../services/system-configurations/hospital-services-service.js';

import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';

const hospitalServices = [
  { id: 1, name: 'Emergency Room' },
  { id: 2, name: 'Cardiology' },
  { id: 3, name: 'Neurology' },
  { id: 4, name: 'Pediatrics' },
  { id: 5, name: 'Radiology' }
];

const validationSchema = Yup.object({
  services: Yup.array().min(1, 'At least one service is required')
});

function RowForm({ handleSubmittingFormData, isSubmittingFormData, setIsSubmittingFormData }) {
  //
  const getListOfHospitalServices = useQuery({
    queryKey: ['hospital-services'],
    queryFn: () => getAllHospitalServices()
  });

  const [isDialogOpen, setDialogOpen] = useState(false);
  const [formValues, setFormValues] = useState([]);

  const handleOpenDialog = (values) => {
    setFormValues(values);
    setDialogOpen(true);
  };

  const handleCloseDialog = (confirm) => {
    setDialogOpen(false);
    if (confirm) {
      handleSubmittingFormData(formValues.services);
    }
  };

  return (
    <Formik
      initialValues={{ services: [] }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        handleOpenDialog(values);
      }}
    >
      {({ values, setFieldValue, touched, errors }) => (
        <Form>
          <Field name="services">
            {({ field }) => (
              <>
                <Autocomplete
                  multiple
                  options={getListOfHospitalServices?.data?.data?.data ?? []}
                  getOptionLabel={(option) => option.name}
                  value={values.services}
                  onChange={(event, newValue) => {
                    setFieldValue('services', newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Services"
                      placeholder="Select services"
                      error={Boolean(touched.services && errors.services)}
                      disabled={getListOfHospitalServices?.isLoading || isSubmittingFormData}
                    />
                  )}
                />
                {getListOfHospitalServices?.isLoading && <p>Loading...</p>}
                {touched.services && errors.services && <FormHelperText error>{errors.services}</FormHelperText>}
              </>
            )}
          </Field>
          <div style={{ marginTop: 20 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={getListOfHospitalServices?.isLoading || isSubmittingFormData}
            >
              Submit
            </Button>
          </div>

          <Dialog open={isDialogOpen} onClose={() => handleCloseDialog(false)}>
            <DialogTitle>Confirm Action</DialogTitle>
            <DialogContent>
              <div>Are you sure you want to attach the selected hospital services?</div>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => handleCloseDialog(false)} color="primary">
                Cancel
              </Button>
              <Button onClick={() => handleCloseDialog(true)} color="primary">
                Confirm
              </Button>
            </DialogActions>
          </Dialog>
        </Form>
      )}
    </Formik>
  );
}

RowForm.propTypes = {
  handleSubmittingFormData: PropTypes.func.isRequired,
  isSubmittingFormData: PropTypes.bool.isRequired,
  setIsSubmittingFormData: PropTypes.func.isRequired
};

export default RowForm;
