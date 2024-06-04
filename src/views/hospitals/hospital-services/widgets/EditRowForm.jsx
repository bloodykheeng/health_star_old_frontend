import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import OutlinedInput from '@mui/material/OutlinedInput';
import { Grid, Autocomplete, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, FormHelperText } from '@mui/material';
import {
  getAllHospitalServices,
  getHospitalServiceById,
  postHospitalService,
  updateHospitalService,
  deleteHospitalServiceById
} from '../../../../services/system-configurations/hospital-services-service.js';

import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { Stack, InputLabel, Select, MenuItem, Checkbox, FormControlLabel, DialogContentText, CircularProgress } from '@mui/material';

const hospitalServices = [
  { id: 1, name: 'Emergency Room' },
  { id: 2, name: 'Cardiology' },
  { id: 3, name: 'Neurology' },
  { id: 4, name: 'Pediatrics' },
  { id: 5, name: 'Radiology' }
];

const validationSchema = Yup.object({
  services: Yup.object()
    .shape({
      id: Yup.string().required('Service id is required'),
      name: Yup.string().required('Service name is required')
    })
    .required('service is required'),
  no_of_points: Yup.number().required('Number of points is required')
});

function EditRowForm({ initialData, handleSubmittingFormData, isSubmittingFormData, setIsSubmittingFormData, hospitalData }) {
  console.log('🚀 ~ EditRowForm ~ initialData:', initialData);
  //
  const getListOfHospitalServices = useQuery({
    queryKey: ['hospital-services', 'by-hospital-id', hospitalData?.id],
    queryFn: () => getAllHospitalServices({ hospital_id: hospitalData?.id })
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
      handleSubmittingFormData(formValues);
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <>
          <Formik
            initialValues={{
              no_of_points: initialData?.no_of_points || '',
              services: initialData?.service,
              submit: null
            }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              handleOpenDialog(values);
            }}
          >
            {({ errors, handleBlur, handleChange, handleSubmit, setFieldValue, isSubmitting, touched, values }) => (
              <form noValidate onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={12}>
                    <Stack spacing={1}>
                      <Field name="services">
                        {({ field }) => (
                          <>
                            <InputLabel htmlFor="services">Services</InputLabel>
                            <Autocomplete
                              // multiple
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
                    </Stack>
                  </Grid>

                  <Grid item xs={12} md={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="no_of_points">Number of points</InputLabel>
                      <OutlinedInput
                        id="no_of_points"
                        type="number"
                        value={values.no_of_points}
                        name="no_of_points"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="Enter Number of points"
                        fullWidth
                        error={Boolean(touched.no_of_points && errors.no_of_points)}
                      />
                      {touched.no_of_points && errors.no_of_points && (
                        <FormHelperText error id="helper-text-no_of_points">
                          {errors.no_of_points}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Stack spacing={1}>
                      <div style={{ marginTop: 20 }}>
                        <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                          disabled={getListOfHospitalServices?.isLoading || isSubmittingFormData}
                        >
                          {isSubmittingFormData ? <CircularProgress size={24} /> : 'Submit'}
                        </Button>
                      </div>
                    </Stack>
                  </Grid>

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
                </Grid>
              </form>
            )}
          </Formik>
        </>
      </Grid>
    </Grid>
  );
}

EditRowForm.propTypes = {
  handleSubmittingFormData: PropTypes.func.isRequired,
  isSubmittingFormData: PropTypes.bool.isRequired,
  setIsSubmittingFormData: PropTypes.func.isRequired
};

export default EditRowForm;
