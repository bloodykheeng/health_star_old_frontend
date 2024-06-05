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
  MenuItem,
  Checkbox,
  FormControlLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress
} from '@mui/material';

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

function RowForm({ handleSubmittingFormData, isSubmittingFormData = false, setIsSubmittingFormData, initialData }) {
  const queryClient = useQueryClient();
  const [level, setLevel] = useState();
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const [showTerms, setShowTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingThirdPartySignUp, setIsLoadingThirdPartySignUp] = useState(false);

  const [selectedRole, setSelectedRole] = useState('');

  const [photoPreview, setPhotoPreview] = useState(null);

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
  const validationSchema = () =>
    Yup.object().shape({
      name: Yup.string().max(255).required('Name is required'),
      address: Yup.string().max(255).nullable(),
      city: Yup.string().max(255).nullable(),
      state: Yup.string().max(255).nullable(),
      points_percentage_value: Yup.number()
        .required('Points Conversion Percentage is required')
        .min(1, 'Points Conversion Percentage must be at least 1')
        .max(100, 'Points Conversion Percentage cannot exceed 100'),
      photo_url: Yup.mixed().nullable(),
      country: Yup.string().max(255).nullable(),
      zip_code: Yup.string().max(20).nullable(),
      phone_number: Yup.string()
        .matches(/^\+[1-9]\d{1,14}$/, 'Phone number is not valid')
        .nullable(),
      email: Yup.string().email('Must be a valid email').nullable(),
      website: Yup.string().url('Must be a valid URL').nullable(),
      capacity: Yup.number().integer().nullable(),
      status: Yup.string().required('Status is required'),
      photo: !!initialData ? Yup.string().notRequired() : Yup.mixed().required('Photo is required')
    });

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <>
          <Formik
            initialValues={{
              name: initialData?.name || '',
              address: initialData?.address || '',
              city: initialData?.city || '',
              state: initialData?.state || '',
              country: initialData?.country || '',
              zip_code: initialData?.zip_code || '',
              phone_number: initialData?.phone_number || '',
              email: initialData?.email || '',
              website: initialData?.website || '',
              capacity: initialData?.capacity || '',
              status: initialData?.status || 'active',
              photo: null,
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
                      <InputLabel htmlFor="name-signup">Name*</InputLabel>
                      <OutlinedInput
                        id="name-signup"
                        type="name"
                        value={values.name}
                        name="name"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="Enter your name"
                        fullWidth
                        error={Boolean(touched.name && errors.name)}
                      />
                    </Stack>
                    {touched.name && errors.name && (
                      <FormHelperText error id="helper-text-name-signup">
                        {errors.name}
                      </FormHelperText>
                    )}
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="address">Address</InputLabel>
                      <OutlinedInput
                        id="address"
                        type="text"
                        value={values.address}
                        name="address"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="Enter your address"
                        fullWidth
                        error={Boolean(touched.address && errors.address)}
                      />
                      {touched.address && errors.address && <FormHelperText error>{errors.address}</FormHelperText>}
                    </Stack>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="city">City</InputLabel>
                      <OutlinedInput
                        id="city"
                        type="text"
                        value={values.city}
                        name="city"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="Enter your city"
                        fullWidth
                        error={Boolean(touched.city && errors.city)}
                      />
                      {touched.city && errors.city && <FormHelperText error>{errors.city}</FormHelperText>}
                    </Stack>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="state">State</InputLabel>
                      <OutlinedInput
                        id="state"
                        type="text"
                        value={values.state}
                        name="state"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="Enter your state"
                        fullWidth
                        error={Boolean(touched.state && errors.state)}
                      />
                      {touched.state && errors.state && <FormHelperText error>{errors.state}</FormHelperText>}
                    </Stack>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="country">Country</InputLabel>
                      <OutlinedInput
                        id="country"
                        type="text"
                        value={values.country}
                        name="country"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="Enter your country"
                        fullWidth
                        error={Boolean(touched.country && errors.country)}
                      />
                      {touched.country && errors.country && <FormHelperText error>{errors.country}</FormHelperText>}
                    </Stack>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="zip_code">Zip Code</InputLabel>
                      <OutlinedInput
                        id="zip_code"
                        type="text"
                        value={values.zip_code}
                        name="zip_code"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="Enter your zip code"
                        fullWidth
                        error={Boolean(touched.zip_code && errors.zip_code)}
                      />
                      {touched.zip_code && errors.zip_code && <FormHelperText error>{errors.zip_code}</FormHelperText>}
                    </Stack>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="phone_number">Phone Number</InputLabel>
                      <OutlinedInput
                        id="phone_number"
                        type="text"
                        value={values.phone_number}
                        name="phone_number"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="Enter your phone number"
                        fullWidth
                        error={Boolean(touched.phone_number && errors.phone_number)}
                      />
                      {touched.phone_number && errors.phone_number && <FormHelperText error>{errors.phone_number}</FormHelperText>}
                    </Stack>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="email">Email</InputLabel>
                      <OutlinedInput
                        id="email"
                        type="email"
                        value={values.email}
                        name="email"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        fullWidth
                        error={Boolean(touched.email && errors.email)}
                      />
                      {touched.email && errors.email && <FormHelperText error>{errors.email}</FormHelperText>}
                    </Stack>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="website">Website</InputLabel>
                      <OutlinedInput
                        id="website"
                        type="url"
                        value={values.website}
                        name="website"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="Enter your website"
                        fullWidth
                        error={Boolean(touched.website && errors.website)}
                      />
                      {touched.website && errors.website && <FormHelperText error>{errors.website}</FormHelperText>}
                    </Stack>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <InputLabel htmlFor="points_percentage_value">Points Conversion Percentage*</InputLabel>
                    <Field
                      as={OutlinedInput}
                      id="points_percentage_value"
                      name="points_percentage_value"
                      type="number"
                      placeholder="Enter Points Conversion Percentage value"
                      fullWidth
                      error={Boolean(touched.points_percentage_value && errors.points_percentage_value)}
                      onBlur={handleBlur}
                      onChange={handleChange}
                    />
                    {touched.points_percentage_value && errors.points_percentage_value && (
                      <FormHelperText error>{errors.points_percentage_value}</FormHelperText>
                    )}
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="capacity">Capacity</InputLabel>
                      <OutlinedInput
                        id="capacity"
                        type="number"
                        value={values.capacity}
                        name="capacity"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="Enter capacity"
                        fullWidth
                        error={Boolean(touched.capacity && errors.capacity)}
                      />
                      {touched.capacity && errors.capacity && <FormHelperText error>{errors.capacity}</FormHelperText>}
                    </Stack>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="status-select">Status*</InputLabel>
                      <FormControl fullWidth error={Boolean(touched.status && errors.status)}>
                        <Select
                          id="status-select"
                          name="status"
                          value={values.status}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          displayEmpty
                        >
                          <MenuItem value="" disabled>
                            Select Status
                          </MenuItem>
                          <MenuItem value="active">Active</MenuItem>
                          <MenuItem value="deactive">Deactive</MenuItem>
                        </Select>
                        {touched.status && errors.status && (
                          <FormHelperText error id="helper-text-status-select">
                            {errors.status}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Stack>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="photo-upload">Photo*</InputLabel>
                      <input
                        id="photo-upload"
                        name="photo"
                        type="file"
                        onChange={(event) => {
                          const file = event.currentTarget.files[0];
                          setFieldValue('photo', file);

                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setPhotoPreview(reader.result);
                          };
                          if (file) {
                            reader.readAsDataURL(file);
                          } else {
                            setPhotoPreview(null);
                          }
                        }}
                        onBlur={handleBlur}
                      />
                      {photoPreview && (
                        <Box mt={2}>
                          <img src={photoPreview} alt="Photo Preview" style={{ height: '100px', objectFit: 'cover' }} />
                        </Box>
                      )}
                      {touched.photo && errors.photo && (
                        <FormHelperText error id="helper-text-photo-upload">
                          {errors.photo}
                        </FormHelperText>
                      )}
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
                        {isSubmittingFormData ? <CircularProgress size={24} /> : !!initialData ? 'Edit Account' : 'Create Account'}
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
