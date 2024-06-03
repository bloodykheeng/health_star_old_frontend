import React, { useState } from 'react';
import { Formik, FieldArray, Field } from 'formik';
import { Grid, FormControlLabel, Checkbox, Typography, Button, Tabs, Tab, Box } from '@mui/material';

import { getAllRolesAndModifiedPermissionsService, syncPermissionToRoleService } from '../../../../services/roles/roles-service';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { CircularProgress } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { Select, MenuItem, DialogContentText } from '@mui/material';

const RowForm = ({ rolesAndModifiedPermissionData }) => {
  const initialData = [
    {
      role: 'Admin',
      permissions: [
        { name: 'add', value: true },
        { name: 'edit', value: false },
        { name: 'delete', value: true }
      ]
    },
    {
      role: 'User',
      permissions: [
        { name: 'add', value: false },
        { name: 'edit', value: true },
        { name: 'delete', value: false }
      ]
    }
  ];

  const [selectedTab, setSelectedTab] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const [createMutationIsLoading, setCreateMutationIsLoading] = useState(false);

  const queryClient = useQueryClient();

  const creactMutation = useMutation({
    mutationFn: syncPermissionToRoleService,
    onSuccess: () => {
      queryClient.invalidateQueries(['roles-with-modified-permissions']);
      toast.success('Roles and Permissions Synced Successfully');
      setCreateMutationIsLoading(false);
    },
    onError: (error) => {
      setCreateMutationIsLoading(false);
      // onClose();

      error?.response?.data?.message
        ? toast.error(error?.response?.data?.message)
        : !error?.response
          ? toast.warning('Check Your Internet Connection Please')
          : toast.error('An Error Occured Please Contact Admin');
      console.log('create users error : ', error);
    }
  });

  const handleSubmit = async (data) => {
    console.log('🚀 ~ handleSubmit ~ data:', data);
    setCreateMutationIsLoading(true);
    // event.preventDefault();
    console.log('data we are submitting while creating a hospital : ', data);
    // creactMutation.mutate(data);
  };

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
    setCreateMutationIsLoading(false);
  };

  const handleConfirmSubmit = () => {
    event.preventDefault();
    console.log('🚀 ~ handleConfirmSubmit ~ formValues:', formValues);
    setCreateMutationIsLoading(true);

    creactMutation.mutate(formValues);

    setOpenConfirmDiaglog(false);
    // setIsSubmittingFormData(false);
  };

  //========================================= confirm submit end ======================

  return (
    <>
      <Formik
        initialValues={{ roles: rolesAndModifiedPermissionData }}
        onSubmit={(values, { setSubmitting, setErrors, validateForm }) => {
          handleConfirmOpen(values);
        }}
      >
        {({ values, handleSubmit, setFieldValue }) => (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <FieldArray name="roles">
                {({ push, remove }) => (
                  <>
                    {/* {values.roles.map((role, index) => (
                      <Grid item xs={12} key={index}>
                        <Typography variant="h6">{role.role}</Typography>
                        <FieldArray name={`roles.${index}.permissions`}>
                          {({ push, remove }) => (
                            <>
                              {role.permissions.map((permission, idx) => (
                                <Grid item xs={6} key={idx}>
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        checked={permission.value}
                                        onChange={(e) => setFieldValue(`roles.${index}.permissions.${idx}.value`, e.target.checked)}
                                      />
                                    }
                                    label={permission.name}
                                  />
                                </Grid>
                              ))}
                            </>
                          )}
                        </FieldArray>
                      </Grid>
                    ))} */}

                    <Tabs
                      value={selectedTab}
                      onChange={handleTabChange}
                      variant="scrollable"
                      scrollButtons="auto"
                      aria-label="scrollable auto tabs example"
                    >
                      {values.roles.map((role, index) => (
                        <Tab key={index} label={role.role} />
                      ))}
                    </Tabs>
                    {values.roles.map((role, index) => (
                      <TabPanel key={index} value={selectedTab} index={index}>
                        <Grid container spacing={2}>
                          <FieldArray name={`roles.${index}.permissions`}>
                            {() => (
                              <>
                                {role.permissions.map((permission, idx) => (
                                  <Grid item xs={6} key={idx}>
                                    <FormControlLabel
                                      control={
                                        <Checkbox
                                          checked={permission.value}
                                          onChange={(e) => setFieldValue(`roles.${index}.permissions.${idx}.value`, e.target.checked)}
                                        />
                                      }
                                      label={permission.name}
                                    />
                                  </Grid>
                                ))}
                              </>
                            )}
                          </FieldArray>
                        </Grid>
                      </TabPanel>
                    ))}
                  </>
                )}
              </FieldArray>
              <Grid item xs={12}>
                <Button
                  disableElevation
                  disabled={createMutationIsLoading}
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  {createMutationIsLoading ? <CircularProgress size={24} /> : 'Submit'}
                </Button>
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
          <DialogContentText id="alert-dialog-description">Are you sure you want to submit ?</DialogContentText>
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
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`} aria-labelledby={`tab-${index}`} {...other}>
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

export default RowForm;
