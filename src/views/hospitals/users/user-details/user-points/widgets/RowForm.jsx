/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable no-extra-boolean-cast */
import React from 'react';

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
      no_of_points: Yup.number().required('Number of points is required'),
      price: Yup.number().required('Price is required'),
      payment_method: Yup.string().required('Payment Method is required'),
      details: Yup.string().nullable()
    });

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <>
          <Formik
            initialValues={{
              user: initialData?.user || userProfileData || null,
              hospital: initialData?.hospital || hospitalData || null,
              no_of_points: initialData?.no_of_points || '',
              price: initialData?.price || '',
              payment_method: initialData?.payment_method || '',
              details: initialData?.details || '',
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

                  <Grid item xs={12} md={6}>
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
                      <InputLabel htmlFor="price">Price*</InputLabel>
                      <OutlinedInput
                        id="price"
                        type="number"
                        value={values.price}
                        name="price"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="Enter Price"
                        fullWidth
                        error={Boolean(touched.price && errors.price)}
                      />
                      {touched.price && errors.price && (
                        <FormHelperText error id="helper-text-price">
                          {errors.price}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>

                  {/* <Grid item xs={12} md={6}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="payment_method">Payment Method*</InputLabel>
                      <OutlinedInput
                        id="payment_method"
                        type="text"
                        value={values.payment_method}
                        name="payment_method"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="Enter Payment Method"
                        fullWidth
                        error={Boolean(touched.payment_method && errors.payment_method)}
                      />
                      {touched.payment_method && errors.payment_method && (
                        <FormHelperText error id="helper-text-payment_method">
                          {errors.payment_method}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid> */}

                  <Grid item xs={12} md={6}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="payment_method">Payment Method*</InputLabel>
                      <FormControl fullWidth error={Boolean(touched.payment_method && errors.payment_method)}>
                        <Field name="payment_method">
                          {({ field }) => (
                            <Select
                              id="payment_method"
                              name="payment_method"
                              value={values.payment_method}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              displayEmpty
                            >
                              <MenuItem value="" disabled>
                                Select Payment Method
                              </MenuItem>

                              {[
                                { value: 'Cash', label: 'Cash' },
                                { value: 'Credit Card', label: 'Credit Card' },
                                { value: 'Bank Transfer', label: 'Bank Transfer' }
                                // Add more options as needed
                              ].map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                  {option.label}
                                </MenuItem>
                              ))}
                            </Select>
                          )}
                        </Field>
                        {touched.payment_method && errors.payment_method && (
                          <FormHelperText error id="helper-text-payment_method">
                            {errors.payment_method}
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
                        {isSubmittingFormData ? <CircularProgress size={24} /> : !!initialData ? 'Edit' : 'Create'}
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
