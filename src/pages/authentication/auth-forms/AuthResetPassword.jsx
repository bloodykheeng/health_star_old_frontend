/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

// material-ui
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Select, MenuItem, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, CircularProgress } from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project import
import AnimateButton from 'components/@extended/AnimateButton';

// assets
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';
import FirebaseSocial from './FirebaseSocial';

//=========== login
import { useNavigate } from 'react-router-dom';
import { obtainToken, forgotPassword } from '../../../services/auth/auth-api.js';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { toast } from 'react-toastify';

// ============================|| JWT - LOGIN ||============================ //

export default function AuthResetPassword({ isDemo = false }) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [isLoadingThirdPartyLogin, setIsLoadingThirdPartyLogin] = useState(false);

  const [checked, setChecked] = React.useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [googleLoginIsLoading, setGoogleLoginIsLoading] = useState(false);

  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const forgotPasswordMutation = useMutation({
    mutationFn: forgotPassword,
    onSuccess: (data) => {
      setIsLoading(false);
      data?.data?.success ? toast.success(data?.data?.message) : toast.warning(data?.data?.message);
    },
    onError: (error) => {
      setIsLoading(false);
      // toast.error(error?.message ? error?.message : "An error Occured while processing your Email ! please Contact Administrator");
      error?.response?.data?.message
        ? toast.error(error?.response?.data?.message)
        : !error?.response
          ? toast.warning('Check Your Internet Connection Please')
          : toast.error('An Error Occured Please Contact Admin');
    }
  });

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
    forgotPasswordMutation.mutate({ ...formValues, status: 'active' });
    // handle form submission
    setOpenConfirmDiaglog(false);
    // setIsSubmittingFormData(false);
  };

  //========================================= confirm submit end ======================

  return (
    <>
      <Formik
        initialValues={{
          email: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required')
        })}
        onSubmit={(values, { setSubmitting, setErrors, validateForm }) => {
          // console.log('🚀 ~ AuthRegister ~ values:', values);

          // handle form submission
          setIsSubmittingFormData(true);
          handleConfirmOpen(values);
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="email-resetpwd">Email Address*</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.email && errors.email)}
                    id="email-resetpwd"
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

              <Grid item xs={12}>
                <AnimateButton>
                  <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                    {isSubmittingFormData ? <CircularProgress size={24} /> : 'Login'}
                  </Button>
                </AnimateButton>
              </Grid>
              <Grid item xs={12}>
                <Divider>
                  <Typography variant="caption"> Remembered your password?</Typography>
                  <p className="p-mt-2">
                    <span style={{ color: 'tomato', cursor: 'pointer' }} onClick={() => navigate('/login')}>
                      Login
                    </span>
                  </p>{' '}
                </Divider>
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
  );
}

AuthResetPassword.propTypes = { isDemo: PropTypes.bool };
