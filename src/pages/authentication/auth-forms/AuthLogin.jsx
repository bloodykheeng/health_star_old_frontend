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

//==== google
import { postThirdPartyRegisterAuth, postThirdPartyLoginAuth } from '../../../services/auth/auth-api.js';
import { GoogleLogin } from '@react-oauth/google';
import { useGoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';

// ============================|| JWT - LOGIN ||============================ //

export default function AuthLogin({ isDemo = false }) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [isSubmittingFormData, setIsSubmittingFormData] = useState(false);
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

  //======================== normal login
  const loginMutation = useMutation({
    mutationFn: (variables) => obtainToken(variables?.email, variables?.password),
    onSuccess: (data) => {
      console.log('successfull login : xxxxx data : ', data);
      setIsSubmittingFormData(false);
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
      setIsSubmittingFormData(false);

      console.log('login error : ', error);
    }
  });

  //======================= google login =========================
  const thirdPartyLoginAuthMutation = useMutation({
    mutationFn: (variables) => postThirdPartyLoginAuth(variables),
    onSuccess: (data) => {
      console.log('postThirdPartyAuth data : ', data);
      setIsLoadingThirdPartyLogin(false);
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
      setIsLoadingThirdPartyLogin(false);

      console.log('login error : ', error);
    }
  });

  const handleSubmitFormData = (formValues) => {
    loginMutation.mutate(formValues);
  };

  return (
    <>
      <Formik
        initialValues={{
          email: '',
          password: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
          password: Yup.string().max(255).required('Password is required')
        })}
        onSubmit={(values, { setSubmitting, setErrors, validateForm }) => {
          // handle form submission
          setIsSubmittingFormData(true);
          handleSubmitFormData(values);
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="email-login">Email Address</InputLabel>
                  <OutlinedInput
                    id="email-login"
                    type="email"
                    value={values.email}
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    fullWidth
                    error={Boolean(touched.email && errors.email)}
                  />
                </Stack>
                {touched.email && errors.email && (
                  <FormHelperText error id="standard-weight-helper-text-email-login">
                    {errors.email}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="password-login">Password</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.password && errors.password)}
                    id="-password-login"
                    type={showPassword ? 'text' : 'password'}
                    value={values.password}
                    name="password"
                    onBlur={handleBlur}
                    onChange={handleChange}
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
                    placeholder="Enter password"
                  />
                </Stack>
                {touched.password && errors.password && (
                  <FormHelperText error id="standard-weight-helper-text-password-login">
                    {errors.password}
                  </FormHelperText>
                )}
              </Grid>

              <Grid item xs={12} sx={{ mt: -1 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={checked}
                        onChange={(event) => setChecked(event.target.checked)}
                        name="checked"
                        color="primary"
                        size="small"
                      />
                    }
                    label={<Typography variant="h6">Keep me sign in</Typography>}
                  />
                  <Link variant="h6" to="/reset" component={RouterLink} color="text.primary">
                    Forgot Password?
                  </Link>
                </Stack>
              </Grid>
              {errors.submit && (
                <Grid item xs={12}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Grid>
              )}
              <Grid item xs={12}>
                <AnimateButton>
                  <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                    {isSubmittingFormData ? <CircularProgress size={24} /> : 'Login'}
                  </Button>
                </AnimateButton>
              </Grid>
              <Grid item xs={12}>
                <Divider>
                  <Typography variant="caption"> Login with</Typography>
                </Divider>
              </Grid>
              <Grid item xs={12}>
                <center>
                  {isLoadingThirdPartyLogin ? (
                    <CircularProgress size={24} />
                  ) : (
                    <GoogleLogin
                      // theme={theme === 'dark' ? 'filled_blue' : 'outline'}
                      onSuccess={async (response) => {
                        console.log(response);
                        let responseDecoded = jwtDecode(response?.credential);
                        console.log('🚀 ~ Login ~ responseDecoded:', responseDecoded);
                        let dataToPost = {
                          name: responseDecoded?.name,
                          picture: responseDecoded?.picture,
                          client_id: response?.clientId,
                          provider: 'google',
                          email: responseDecoded?.email
                        };
                        setIsLoadingThirdPartyLogin(true);
                        thirdPartyLoginAuthMutation.mutate(dataToPost);
                      }}
                      onError={() => {
                        console.log('Login Failed');
                      }}
                    />
                  )}
                </center>
                {/* <FirebaseSocial /> */}
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
}

AuthLogin.propTypes = { isDemo: PropTypes.bool };
