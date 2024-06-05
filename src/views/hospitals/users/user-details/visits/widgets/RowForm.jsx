/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable no-extra-boolean-cast */
import React, { useMemo } from 'react';

import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

// material-ui
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';

// ============== date ============
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
// import AdapterMoment from '@date-io/moment';
// import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

// third party
import * as Yup from 'yup';
import { Formik, Field, Form } from 'formik';

import {
  Select,
  TextField,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Autocomplete
} from '@mui/material';

import { TextareaAutosize as BaseTextareaAutosize } from '@mui/base/TextareaAutosize';
import { styled } from '@mui/system';

// project import
import AnimateButton from 'components/@extended/AnimateButton';
import { strengthColor, strengthIndicator } from 'utils/password-strength';

// assets
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';

//============= register imports ==================
import { useNavigate } from 'react-router-dom';

import { toast } from 'react-toastify';

import moment from 'moment';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import AddIcon from '@mui/icons-material/Add';
import { Fab } from '@mui/material';

import {
  getAllHospitals,
  getHospitalById,
  postHospital,
  updateHospital,
  deleteHospitalById
} from '../../../../../../services/hospital/hospital-service';
import { debounce } from 'lodash';

import {
  getAllUsers,
  getUserById,
  getApproverRoles,
  createUser,
  updateUser,
  deleteUserById,
  getAssignableRoles
} from '../../../../../../services/auth/user-service';

import {
  getAllHospitalServices,
  getHospitalServiceById,
  postHospitalService,
  updateHospitalService,
  deleteHospitalServiceById
} from '../../../../../../services/hospital/hospital-services-service';

function RowForm({
  handleSubmittingFormData,
  isSubmittingFormData = false,
  setIsSubmittingFormData,
  initialData,
  userProfileData,
  hospitalData
}) {
  const queryClient = useQueryClient();
  const [level, setLevel] = useState();
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const [showTerms, setShowTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingThirdPartySignUp, setIsLoadingThirdPartySignUp] = useState(false);

  const [selectedRole, setSelectedRole] = useState('');

  const [photoPreview, setPhotoPreview] = useState(null);

  //================ services ======================
  //
  const getListOfHospitalServices = useQuery({
    queryKey: ['hospital-services', 'by-hospital-id', hospitalData?.id],
    queryFn: () => getAllHospitalServices({ hospital_id: hospitalData?.id })
  });
  console.log('🚀 ~ getListOfHospitalServices:', getListOfHospitalServices);

  useEffect(() => {
    if (getListOfHospitalServices?.isError) {
      console.log('Error fetching List of User points :', getListOfHospitalServices?.error);
      getListOfHospitalServices?.error?.response?.data?.message
        ? toast.error(getListOfHospitalServices?.error?.response?.data?.message)
        : !getListOfHospitalServices?.error?.response
          ? toast.warning('Check Your Internet Connection Please')
          : toast.error('An Error Occured Please Contact Admin');
    }
  }, [getListOfHospitalServices?.isError]);
  console.log('getListOfHospitalServices list : ', getListOfHospitalServices?.data?.data);

  //==================== get hospitals ===========================
  //
  const [hospitalSelectSearch, setHospitalSelectSearch] = useState('');
  console.log('🚀 ~ RowForm ~ search:', hospitalSelectSearch);
  const getListOfHospitals = useQuery({
    queryKey: ['hospitals', hospitalSelectSearch],
    queryFn: () => getAllHospitals({ search: hospitalSelectSearch })
  });

  const debouncedSetSearch = debounce((value) => {
    setHospitalSelectSearch(value);
  }, 300);

  useEffect(() => {
    return () => {
      debouncedSetSearch.cancel();
    };
  }, []);

  //================= get users =======================
  const getListOfUsers = useQuery({
    queryKey: ['users', 'by-hospital-id', hospitalData?.id],
    queryFn: () => getAllUsers({ hospital_id: hospitalData?.id })
  });

  // =========================== confirm submit =========================
  const [openConfirmDiaglog, setOpenConfirmDiaglog] = useState(false);
  const [formValues, setFormValues] = useState(null);

  const handleConfirmOpen = (values) => {
    console.log('🚀 ~ handleConfirmOpen ~ values:', values);

    setFormValues(values);
    setOpenConfirmDiaglog(true);
  };

  const handleConfirmClose = () => {
    setOpenConfirmDiaglog(false);
    setIsSubmittingFormData(false);
  };

  const handleConfirmSubmit = () => {
    console.log('🚀 ~ AuthRegister ~ formValues:', formValues);

    handleSubmittingFormData(formValues);
    // creactMutation.mutate({ ...formValues, status: 'active' });
    // handle form submission
    setOpenConfirmDiaglog(false);
    // setIsSubmittingFormData(false);
  };

  //========================================= confirm submit end ======================

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const changePassword = (value) => {
    const temp = strengthIndicator(value);
    setLevel(strengthColor(temp));
  };

  useEffect(() => {
    changePassword('');
  }, []);

  //=========================================
  const showWarningToast = (errors = {}) => {
    for (const key in errors) {
      // eslint-disable-next-line no-prototype-builtins
      if (errors.hasOwnProperty(key)) {
        toast.warn(errors[key]);
      }
    }
  };

  // const schema = validationSchema(initialData);
  const validationSchema = (initialData) =>
    Yup.object().shape({
      user: Yup.object()
        .shape({
          id: Yup.string().required('User is required'),
          name: Yup.string().required('User name is required')
        })
        .required('User is required'),
      hospital: Yup.object()
        .shape({
          id: Yup.string().nullable(),
          name: Yup.string().nullable()
        })
        .nullable(),
      start_date: Yup.date().required('Start date is required'),
      end_date: Yup.date().nullable().min(Yup.ref('start_date'), 'End date cannot be before start date'),

      details: Yup.string().nullable(),
      status: Yup.string().required('Status is required')
    });

  // Memoized function to calculate total points based on selected services
  const calculateTotalPoints = useMemo(() => {
    return (services) => {
      let total = 0;
      services.forEach((service) => {
        if (service.no_of_points) {
          total += parseFloat(service.no_of_points);
        }
      });
      return total;
    };
  }, []); // Empty dependency array means it will only compute once

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <>
          <Formik
            initialValues={{
              user: initialData?.user || userProfileData || null,
              hospital: initialData?.hospital || hospitalData || null,
              start_date: initialData?.start_date || '',
              end_date: initialData?.end_date || '',

              details: initialData?.details || '',
              status: initialData?.status || '',
              visit_services: initialData?.hospital_services || [],
              totalPoints: calculateTotalPoints(initialData?.hospital_services || []),
              submit: null
            }}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting, setErrors, validateForm }) => {
              console.log('🚀 ~ RowForm ~ values:', values);
              // console.log('🚀 ~ AuthRegister ~ values:', values);

              // validateForm().then((errors) => {
              //   if (Object.keys(errors).length === 0) {
              //     setIsSubmitting(true);
              //     handleConfirmOpen(values);
              //   } else {
              //     showWarningToast(errors);
              //     setSubmitting(false);
              //   }
              // });

              // handle form submission
              setIsSubmittingFormData(true);
              handleConfirmOpen(values);
            }}
          >
            {({ errors, handleBlur, handleChange, handleSubmit, setFieldValue, isSubmitting, touched, values }) => (
              <form noValidate onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="user">User*</InputLabel>
                      <Field name="user">
                        {({ field }) => (
                          <>
                            <Autocomplete
                              isOptionEqualToValue={(option, value) => option.id === value.id}
                              options={getListOfUsers?.data?.data?.data ?? []}
                              getOptionLabel={(option) => option.name}
                              value={values.user}
                              onChange={(event, newValue) => {
                                setFieldValue('user', newValue);
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  variant="outlined"
                                  label="Select a User"
                                  placeholder="Search for user"
                                  error={Boolean(touched.user && errors.user)}
                                  disabled={getListOfUsers?.isLoading || isSubmitting}
                                  InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                      <>
                                        {getListOfUsers?.isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                        {params.InputProps.endAdornment}
                                      </>
                                    )
                                  }}
                                />
                              )}
                            />
                            {getListOfUsers?.isLoading && <p>Loading...</p>}
                            {touched.user && errors.user && <FormHelperText error>{errors.user}</FormHelperText>}
                          </>
                        )}
                      </Field>
                    </Stack>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="hospital">Hospital</InputLabel>
                      <Field name="hospital">
                        {({ field }) => (
                          <>
                            <Autocomplete
                              //isOptionEqualToValue helps to define how comparison is gonna be made
                              isOptionEqualToValue={(option, value) => option.id === value.id}
                              options={getListOfHospitals?.data?.data?.data ?? []}
                              getOptionLabel={(option) => option.name}
                              value={values.hospital}
                              onChange={(event, newValue) => {
                                console.log('🚀 ~ newValue:', newValue);
                                setFieldValue('hospital', newValue);
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  variant="outlined"
                                  label="Select a Hospital"
                                  placeholder="Search for hospital"
                                  error={Boolean(touched.hospital && errors.hospital)}
                                  disabled={getListOfHospitals?.isLoading || isSubmitting}
                                  InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                      <>
                                        {getListOfHospitals?.isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                        {params.InputProps.endAdornment}
                                      </>
                                    )
                                  }}
                                />
                              )}
                            />
                            {getListOfHospitals?.isLoading && <p>Loading...</p>}
                            {touched.hospital && errors.hospital && <FormHelperText error>{errors.hospital}</FormHelperText>}
                          </>
                        )}
                      </Field>
                    </Stack>
                  </Grid>

                  {/* Start Date Field */}
                  <Grid item xs={12} md={6}>
                    <Field name="start_date">
                      {({ field, form }) => (
                        <Stack spacing={1}>
                          <InputLabel htmlFor="start_date">Start Date*</InputLabel>
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DateTimePicker
                              value={field.value ? moment(field.value) : null}
                              onChange={(value) => {
                                const formattedValue = value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : '';
                                form.setFieldValue(field.name, formattedValue);
                              }}
                              renderInput={(params) => (
                                <OutlinedInput {...params} fullWidth error={Boolean(touched.start_date && errors.start_date)} />
                              )}
                            />
                          </LocalizationProvider>
                          {touched.start_date && errors.start_date && <FormHelperText error>{errors.start_date}</FormHelperText>}
                        </Stack>
                      )}
                    </Field>
                  </Grid>

                  {/* End Date Field */}
                  <Grid item xs={12} md={6}>
                    <Field name="end_date">
                      {({ field, form }) => (
                        <Stack spacing={1}>
                          <InputLabel htmlFor="end_date">End Date</InputLabel>
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DateTimePicker
                              value={field.value ? moment(field.value) : null}
                              onChange={(value) => {
                                const formattedValue = value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : '';
                                form.setFieldValue(field.name, formattedValue);
                              }}
                              renderInput={(params) => (
                                <OutlinedInput {...params} fullWidth error={Boolean(touched.end_date && errors.end_date)} />
                              )}
                            />
                          </LocalizationProvider>
                          {touched.end_date && errors.end_date && <FormHelperText error>{errors.end_date}</FormHelperText>}
                        </Stack>
                      )}
                    </Field>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="status">Status*</InputLabel>
                      <FormControl fullWidth error={Boolean(touched.status && errors.status)}>
                        <Field name="status">
                          {({ field }) => (
                            <Select
                              id="status"
                              name="status"
                              value={values.status}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              displayEmpty
                            >
                              <MenuItem value="" disabled>
                                Select Visit Status
                              </MenuItem>

                              {[
                                { value: 'Ongoing', label: 'Ongoing' },
                                { value: 'Scheduled', label: 'Scheduled' },
                                { value: 'Completed', label: 'Completed' }
                                // Add more options as needed
                              ].map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                  {option.label}
                                </MenuItem>
                              ))}
                            </Select>
                          )}
                        </Field>
                        {touched.status && errors.status && (
                          <FormHelperText error id="helper-text-status">
                            {errors.status}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Stack>
                  </Grid>

                  {/* <Textarea aria-label="minimum height" minRows={3} placeholder="Minimum 3 rows" /> */}

                  {/* <Grid item xs={12} md={6}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="description">Description</InputLabel>
                      <Textarea
                        id="description"
                        label="Description"
                        minRows={3}
                        value={values.description}
                        name="description"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="Enter description"
                        error={Boolean(touched.description && errors.description)}
                        style={{ resize: 'both' }} // Add resize style
                      />
                      {touched.description && errors.description && <FormHelperText error>{errors.description}</FormHelperText>}
                    </Stack>
                  </Grid> */}

                  <Grid item xs={12} md={6}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="details">Details</InputLabel>
                      <TextField
                        id="details"
                        label="details"
                        multiline
                        rows={4}
                        value={values.details}
                        name="details"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="Enter details"
                        error={Boolean(touched.details && errors.details)}
                        style={{ resize: 'both' }} // Add resize style
                      />
                      {touched.details && errors.details && <FormHelperText error>{errors.details}</FormHelperText>}
                    </Stack>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Field name="visit_services">
                      {({ field }) => (
                        <>
                          <Autocomplete
                            //isOptionEqualToValue helps to define how comparison is gonna be made
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            multiple
                            options={getListOfHospitalServices?.data?.data?.data ?? []}
                            getOptionLabel={(option) => option.service.name}
                            value={values.visit_services}
                            onChange={(event, newValue) => {
                              setFieldValue('visit_services', newValue);
                              setFieldValue('totalPoints', calculateTotalPoints(newValue));
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                variant="outlined"
                                label="Services"
                                placeholder="Select services"
                                error={Boolean(touched.visit_services && errors.visit_services)}
                                disabled={getListOfHospitalServices?.isLoading || isSubmittingFormData}
                              />
                            )}
                          />
                          {getListOfHospitalServices?.isLoading && <p>Loading...</p>}
                          {touched.visit_services && errors.visit_services && (
                            <FormHelperText error>{errors.visit_services}</FormHelperText>
                          )}
                        </>
                      )}
                    </Field>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      name="totalPoints"
                      label="Total Points"
                      variant="outlined"
                      value={values?.totalPoints?.toLocaleString()} // Format points with commas
                      InputProps={{
                        readOnly: true
                      }}
                    />
                  </Grid>

                  {errors.submit && (
                    <Grid item xs={12}>
                      <FormHelperText error>{errors.submit}</FormHelperText>
                    </Grid>
                  )}
                  <Grid item xs={12}>
                    <AnimateButton>
                      <Button
                        disableElevation
                        disabled={isSubmittingFormData}
                        fullWidth
                        size="large"
                        type="submit"
                        variant="contained"
                        color="primary"
                      >
                        {isSubmittingFormData ? <CircularProgress size={24} /> : !!initialData ? 'Update Visit' : 'Create Visit'}
                      </Button>
                    </AnimateButton>
                  </Grid>
                </Grid>
              </form>
            )}
          </Formik>

          <Dialog
            open={openConfirmDiaglog}
            onClose={handleConfirmClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{'Confirm Submission'}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">Are you sure you want to submit this form?</DialogContentText>
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
      </Grid>
    </Grid>
  );
}

export default RowForm;
