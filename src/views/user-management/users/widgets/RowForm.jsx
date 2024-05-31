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
      email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
      password: !!initialData ? Yup.string().notRequired() : Yup.string().max(255).required('Password is required'),
      phone: Yup.string()
        .matches(/^\+[1-9]\d{1,14}$/, 'Phone number is not valid')
        .required('Phone number is required'),
      dateOfBirth: Yup.date().required('Date of Birth is required'),
      // dateOfBirth: Yup.date()
      //   .max(moment().subtract(18, 'years'), 'You must be at least 18 years old')
      //   .required('Year of Birth is required'),
      role: Yup.string().required('Role is required'),
      status: Yup.string().required('Status is required'),
      healthFacility: Yup.string().when('role', {
        is: 'Health Facility Manager',
        then: Yup.string().required('Health Facility is required')
      }),
      photo: !!initialData ? Yup.string().notRequired() : Yup.mixed().required('Photo is required')
    });

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <>
          <Formik
            initialValues={{
              name: initialData?.name,
              email: initialData?.email,
              password: initialData?.password,
              phone: initialData?.phone,
              dateOfBirth: initialData?.dateOfBirth,
              role: initialData?.role ?? 'Patient',
              healthFacility: initialData?.healthFacility,
              status: initialData?.status,
              agree: false,
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

                  <Grid item xs={12} md={6}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="email-signup">Email Address*</InputLabel>
                      <OutlinedInput
                        fullWidth
                        error={Boolean(touched.email && errors.email)}
                        id="email-login"
                        type="email"
                        value={values.email}
                        name="email"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="Enter Your email"
                        inputProps={{}}
                      />
                    </Stack>
                    {touched.email && errors.email && (
                      <FormHelperText error id="helper-text-email-signup">
                        {errors.email}
                      </FormHelperText>
                    )}
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
                    <Field name="role">
                      {({ field, form, meta }) => (
                        <Stack spacing={1}>
                          <InputLabel htmlFor="role-signup">Role*</InputLabel>
                          <Select
                            id="role-signup"
                            value={field.value}
                            // onChange={(e) => {
                            //   setSelectedRole(e.target.value);
                            //   form.setFieldValue(field.name, e.target.value);
                            // }}
                            onChange={(e) => {
                              const value = e.target.value;
                              setSelectedRole(value);
                              form.setFieldValue(field.name, value);
                              if (value !== 'Health Facility Manager') {
                                form.setFieldValue('healthFacility', '');
                              }
                            }}
                            displayEmpty
                            fullWidth
                            error={Boolean(meta.touched && meta.error)}
                          >
                            <MenuItem value="" disabled>
                              Select a Role
                            </MenuItem>
                            <MenuItem value="Patient">Patient</MenuItem>
                            <MenuItem value="Health Facility Manager">Health Facility Manager</MenuItem>
                            <MenuItem value="Admin">Admin</MenuItem>
                          </Select>
                          {meta.touched && meta.error && <FormHelperText error>{meta.error}</FormHelperText>}
                        </Stack>
                      )}
                    </Field>
                  </Grid>

                  {selectedRole === 'Health Facility Manager' && (
                    <Grid item xs={12} md={6}>
                      <Field name="healthFacility">
                        {({ field, form, meta }) => (
                          <Stack spacing={1}>
                            <InputLabel htmlFor="healthFacility-signup">Health Facility*</InputLabel>
                            <Select
                              id="healthFacility-signup"
                              value={field.value}
                              onChange={(e) => {
                                form.setFieldValue(field.name, e.target.value);
                              }}
                              displayEmpty
                              fullWidth
                              error={Boolean(meta.touched && meta.error)}
                            >
                              <MenuItem value="" disabled>
                                Select a Health Facility
                              </MenuItem>
                              <MenuItem value="Case Clinic">Case Clinic</MenuItem>
                              <MenuItem value="Mulago">Mulago</MenuItem>
                              <MenuItem value="Mengo">Mengo</MenuItem>
                              {/* Add more facilities as needed */}
                            </Select>
                            {meta.touched && meta.error && <FormHelperText error>{meta.error}</FormHelperText>}
                          </Stack>
                        )}
                      </Field>
                    </Grid>
                  )}
                  <Grid item xs={12} md={6}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="phone-signup">Phone Number*</InputLabel>
                      <OutlinedInput
                        fullWidth
                        error={Boolean(touched.phone && errors.phone)}
                        id="phone-signup"
                        type="text"
                        value={values.phone}
                        name="phone"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="Enter Your Phone Number"
                      />
                    </Stack>
                    {touched.phone && errors.phone && (
                      <FormHelperText error id="helper-text-phone-signup">
                        {errors.phone}
                      </FormHelperText>
                    )}
                  </Grid>
                  {/* <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="dateOfBirth-signup">Date of Birth*</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.dateOfBirth && errors.dateOfBirth)}
                    id="dateOfBirth-signup"
                    type="date"
                    value={values.dateOfBirth}
                    name="dateOfBirth"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    inputProps={{
                      max: moment().subtract(18, 'years').format('YYYY-MM-DD')
                    }}
                  />
                </Stack>
                {touched.dateOfBirth && errors.dateOfBirth && (
                  <FormHelperText error id="helper-text-dateOfBirth-signup">
                    {errors.dateOfBirth}
                  </FormHelperText>
                )}
              </Grid> */}

                  <Grid item xs={12} md={6}>
                    <Field name="dateOfBirth">
                      {({ field, meta }) => (
                        <Stack spacing={1}>
                          <InputLabel htmlFor="dateOfBirth">Date of Birth*</InputLabel>
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              views={['year', 'month', 'day']}
                              // value={field.value}
                              value={field.value ? moment(field.value) : null}
                              // onChange={(value) => field.onChange({ target: { value, name: field.name } })}
                              onChange={(value) => {
                                const formattedValue = value ? moment(value).format('YYYY-MM-DD') : '';
                                field.onChange({ target: { value: formattedValue, name: field.name } });
                              }}
                              renderInput={(params) => <OutlinedInput {...params} fullWidth error={Boolean(meta.touched && meta.error)} />}
                            />
                          </LocalizationProvider>
                          {meta.touched && meta.error && <FormHelperText error>{meta.error}</FormHelperText>}
                        </Stack>
                      )}
                    </Field>
                  </Grid>

                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="password-signup">Password</InputLabel>
                      <OutlinedInput
                        fullWidth
                        error={Boolean(touched.password && errors.password)}
                        id="password-signup"
                        type={showPassword ? 'text' : 'password'}
                        value={values.password}
                        disabled={!!initialData}
                        name="password"
                        onBlur={handleBlur}
                        onChange={(e) => {
                          handleChange(e);
                          changePassword(e.target.value);
                        }}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                              color="secondary"
                            >
                              {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                            </IconButton>
                          </InputAdornment>
                        }
                        placeholder="Enter Your Password"
                        inputProps={{}}
                      />
                    </Stack>
                    {touched.password && errors.password && (
                      <FormHelperText error id="helper-text-password-signup">
                        {errors.password}
                      </FormHelperText>
                    )}
                    <FormControl fullWidth sx={{ mt: 2 }}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item>
                          <Box sx={{ bgcolor: level?.color, width: 85, height: 8, borderRadius: '7px' }} />
                        </Grid>
                        <Grid item>
                          <Typography variant="subtitle1" fontSize="0.75rem">
                            {level?.label}
                          </Typography>
                        </Grid>
                      </Grid>
                    </FormControl>
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
