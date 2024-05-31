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

import TermsDialog from './TermsDialog';

//============= register imports ==================
import { useNavigate } from 'react-router-dom';
import { signUp } from '../../../services/auth/auth-api.js';

import { postThirdPartyRegisterAuth } from '../../../services/auth/auth-api.js';

import { GoogleLogin } from '@react-oauth/google';
import { useGoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';

import moment from 'moment';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// ============================|| JWT - REGISTER ||============================ //

export default function AuthRegister() {
  const queryClient = useQueryClient();
  const [level, setLevel] = useState();
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const [showTerms, setShowTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingThirdPartySignUp, setIsLoadingThirdPartySignUp] = useState(false);

  const [selectedRole, setSelectedRole] = useState('');
  const [termsDialogOpen, setTermsDialogOpen] = useState(false);

  // =========================== confirm submit =========================
  const [openConfirmDiaglog, setOpenConfirmDiaglog] = useState(false);
  const [formValues, setFormValues] = useState(null);
  const [isSubmittingFormData, setIsSubmittingFormData] = useState(false);

  const handleConfirmOpen = (values) => {
    setFormValues(values);
    setOpenConfirmDiaglog(true);
  };

  const handleConfirmClose = () => {
    setOpenConfirmDiaglog(false);
    setIsSubmittingFormData(false);
  };

  const handleConfirmSubmit = () => {
    console.log('🚀 ~ AuthRegister ~ formValues:', formValues);
    creactMutation.mutate({ ...formValues, status: 'active' });
    // handle form submission
    setOpenConfirmDiaglog(false);
    // setIsSubmittingFormData(false);
  };

  //========================================= confirm submit end ======================

  const handleTermsDialogToggle = (e) => {
    e.preventDefault();
    setTermsDialogOpen(!termsDialogOpen);
  };

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

  //================== register ===================
  const creactMutation = useMutation({
    mutationFn: signUp,
    onSuccess: () => {
      setIsLoading(false);
      setIsSubmittingFormData(false);
      // queryClient.invalidateQueries(["spare-parts"]);
      toast.success('Account Created Successfully');
    },
    onError: (error) => {
      console.log('🚀 ~ AuthRegister ~ error:', error);
      setIsLoading(false);
      setIsSubmittingFormData(false);

      // props.onClose();
      error?.response?.data?.message
        ? toast.error(error?.response?.data?.message)
        : !error?.response
          ? toast.warning('Check Your Internet Connection Please')
          : toast.error('An Error Occured Please Contact Admin');
    }
  });

  //T============== hird party auth ==================

  const thirdPartyRegisterAuthMutation = useMutation({
    mutationFn: (variables) => postThirdPartyRegisterAuth(variables),
    onSuccess: (data) => {
      console.log('postThirdPartyAuth data : ', data);
      setIsLoadingThirdPartySignUp(false);
      queryClient.invalidateQueries([]);
      //   axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
      navigate('/');
      // window.location.reload();
    },
    onError: (error) => {
      error?.response?.data?.message
        ? toast.error(error?.response?.data?.message)
        : !error?.response
          ? toast.warning('Check Your Internet Connection Please')
          : toast.error('An Error Occured Please Contact Admin');
      setIsLoadingThirdPartySignUp(false);

      console.log('login error : ', error);
    }
  });

  //=========================================
  const showWarningToast = (errors = {}) => {
    for (const key in errors) {
      // eslint-disable-next-line no-prototype-builtins
      if (errors.hasOwnProperty(key)) {
        toast.warn(errors[key]);
      }
    }
  };

  return (
    <>
      <Formik
        initialValues={{
          name: '',
          email: '',
          password: '',
          phone: '',
          dateOfBirth: null,
          role: '',
          healthFacility: '',
          agree: false,
          submit: null
        }}
        validationSchema={Yup.object().shape({
          name: Yup.string().max(255).required('Name is required'),
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
          password: Yup.string().max(255).required('Password is required'),
          phone: Yup.string()
            .matches(/^\+[1-9]\d{1,14}$/, 'Phone number is not valid')
            .required('Phone number is required'),
          dateOfBirth: Yup.date().required('Date of Birth is required'),
          // dateOfBirth: Yup.date()
          //   .max(moment().subtract(18, 'years'), 'You must be at least 18 years old')
          //   .required('Year of Birth is required'),
          role: Yup.string().required('Role is required'),
          healthFacility: Yup.string().when('role', {
            is: 'Health Facility Manager',
            then: Yup.string().required('Health Facility is required')
          }),
          agree: Yup.boolean().oneOf([true], 'You must accept the terms and conditions')
        })}
        onSubmit={(values, { setSubmitting, setErrors, validateForm }) => {
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
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
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
                <Field name="agree" type="checkbox">
                  {({ field, meta }) => (
                    <Stack spacing={1}>
                      <FormControlLabel
                        control={<Checkbox {...field} checked={field.value} color="primary" />}
                        label={
                          <Typography variant="body2">
                            I agree to the{' '}
                            <Link component="button" onClick={handleTermsDialogToggle} style={{ cursor: 'pointer', color: 'tomato' }}>
                              Terms and Conditions
                            </Link>
                          </Typography>
                        }
                      />
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
              <Grid item xs={12}>
                <Typography variant="body2">
                  By Signing up, you agree to our &nbsp;
                  <Link variant="subtitle2" component={RouterLink} to="#">
                    Terms of Service
                  </Link>
                  &nbsp; and &nbsp;
                  <Link variant="subtitle2" component={RouterLink} to="#">
                    Privacy Policy
                  </Link>
                </Typography>
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
                    {isSubmittingFormData ? <CircularProgress size={24} /> : 'Create Account'}
                  </Button>
                </AnimateButton>
              </Grid>
              <Grid item xs={12}>
                <Divider>
                  <Typography variant="caption"> SignUp with</Typography>
                </Divider>
              </Grid>
              <Grid item xs={12}>
                <center>
                  {isLoadingThirdPartySignUp ? (
                    <CircularProgress size={24} />
                  ) : (
                    <GoogleLogin
                      // theme={theme === "dark" ? "filled_blue" : "outline"}
                      onSuccess={async (response) => {
                        console.log(response);
                        let responseDecoded = jwtDecode(response?.credential);
                        // console.log('🚀 ~ Login ~ responseDecoded:', responseDecoded);
                        let dataToPost = {
                          name: responseDecoded?.name,
                          picture: responseDecoded?.picture,
                          client_id: response?.clientId,
                          provider: 'google',
                          role: 'patient',
                          email: responseDecoded?.email
                        };
                        setIsLoadingThirdPartySignUp(true);
                        thirdPartyRegisterAuthMutation.mutate(dataToPost);
                      }}
                      onError={() => {
                        console.log('Login Failed');
                      }}
                    />
                  )}
                </center>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
      <TermsDialog open={termsDialogOpen} handleClose={handleTermsDialogToggle} />
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
  );
}
