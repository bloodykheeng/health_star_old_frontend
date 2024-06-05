/* eslint-disable no-undef */
/* eslint-disable react/no-unknown-property */
/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Box, Typography, Paper } from '@mui/material';
import TabPanel from './widgets/TabPanel';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useLocation, Link } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';

import BreadcrumbNav from '../../components/general_components/BreadcrumbNav';
import { Card, Avatar, Dialog, Button, Divider } from '@mui/material';
import Edit from '@mui/icons-material/Edit';

import moment from 'moment';

import {
  getAllHospitals,
  getHospitalById,
  postHospital,
  updateHospital,
  deleteHospitalById
} from '../../services/hospital/hospital-service';

import EditForm from './EditRecord';
import { css } from '@emotion/react';

import HospitalServicesPage from './hospital-services/HospitalServicesPage';
import UsersPage from './users/UsersPage';

//============ get Auth Context ===============
import useAuthContext from '../../context/AuthContext';

function HospitalViewPage() {
  const queryClient = useQueryClient();

  const { user: loggedInUserData, logoutMutation, logoutMutationIsLoading } = useAuthContext();
  console.log('🚀 ~ ListRecords ~ loggedInUserData:', loggedInUserData);

  const [showEditForm, setShowEditForm] = useState(false);
  const [profilePhotoVisible, setProfilePhotoVisible] = useState(false);

  const handleCloseEditForm = () => {
    setShowEditForm(false);
  };

  //
  let { state } = useLocation();
  let parentDataFormState = state?.hospitalData ? state?.hospitalData : null;
  console.log('🚀 ~ HospitalViewPage ~ parentDataFormState:', parentDataFormState);

  //===================== getDepartmentById by id =================
  const fetchParentById = useQuery({
    queryKey: ['hospitals', 'getById', parentDataFormState?.id],
    queryFn: () => getHospitalById(parentDataFormState?.id)
  });

  useEffect(() => {
    if (fetchParentById?.isError) {
      console.log('Error fetching List of Hospitals :', fetchParentById?.error);
      fetchParentById?.error?.response?.data?.message
        ? toast.error(fetchParentById?.error?.response?.data?.message)
        : !fetchParentById?.error?.response
          ? toast.warning('Check Your Internet Connection Please')
          : toast.error('An Error Occured Please Contact Admin');
    }
  }, [fetchParentById?.isError]);

  console.log('fetchParentById list : ', fetchParentById?.data?.data);

  let hospitalData = fetchParentById?.data?.data;

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  let colums = [];
  return (
    <>
      <BreadcrumbNav />
      {fetchParentById?.isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <CircularProgress /> {/* Loading indicator */}
        </div>
      ) : (
        <Paper elevation={3}>
          <div
            css={css`
              @media (max-width: 767px) {
                width: 100%;
                flex-grow: 0 !important;
              }
            `}
            className="text-center flex-grow-1"
            style={{
              background: 'linear-gradient(to right bottom, #0074D9, #00A5F8)',
              padding: '1rem',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-around',
              alignItems: 'center',
              color: 'white'
            }}
          >
            <Avatar
              src={`${import.meta.env.VITE_APP_API_BASE_URL}${hospitalData?.photo_url}`}
              alt="Profile Picture"
              sx={{ width: 128, height: 128, cursor: 'pointer', my: 2 }}
              onClick={() => setProfilePhotoVisible(true)}
            />
            <h2>{hospitalData?.name}</h2>

            {loggedInUserData?.permissions?.includes('edit hospitals') && (
              <Button startIcon={<Edit />} className="m-2" variant="contained" color="primary" onClick={() => setShowEditForm(true)}>
                Edit Profile
              </Button>
            )}
            {/* <Button
                  startIcon={<FaShoppingBag />}
                  className="m-2"
                  variant="contained"
                  color="primary"
                  onClick={() => navigate('products', { state: { user_detail: profileData } })}
                >
                  View Product Catalogue
                </Button> */}
          </div>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label="hospital details tabs">
              <Tab label="Details" />
              <Tab label="Services" />
              <Tab label="Users" />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            <Box sx={{ p: 3, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {/* Group 1 */}
              <Box sx={{ flex: '1 1 300px' }}>
                <Typography variant="body1">
                  <strong>ID:</strong> {hospitalData.id}
                </Typography>
                <Typography variant="body1">
                  <strong>Name:</strong> {hospitalData.name}
                </Typography>
                <Typography variant="body1">
                  <strong>Address:</strong> {hospitalData.address || 'N/A'}
                </Typography>
                <Typography variant="body1">
                  <strong>City:</strong> {hospitalData.city || 'N/A'}
                </Typography>
                <Typography variant="body1">
                  <strong>State:</strong> {hospitalData.state || 'N/A'}
                </Typography>
              </Box>

              {/* Group 2 */}
              <Box sx={{ flex: '1 1 300px' }}>
                <Typography variant="body1">
                  <strong>Country:</strong> {hospitalData.country || 'N/A'}
                </Typography>
                <Typography variant="body1">
                  <strong>Zip Code:</strong> {hospitalData.zip_code || 'N/A'}
                </Typography>
                <Typography variant="body1">
                  <strong>Phone Number:</strong> {hospitalData.phone_number || 'N/A'}
                </Typography>
                <Typography variant="body1">
                  <strong>Email:</strong> {hospitalData.email || 'N/A'}
                </Typography>
                <Typography variant="body1">
                  <strong>Website:</strong>
                  {/* <Link href={hospitalData.website} target="_blank" rel="noopener noreferrer">
                    {hospitalData.website}
                  </Link> */}
                  <a href={hospitalData.website} target="_blank" rel="noopener noreferrer">
                    {hospitalData.website}
                  </a>
                </Typography>
              </Box>

              {/* Group 3 */}
              <Box sx={{ flex: '1 1 300px' }}>
                <Typography variant="body1">
                  <strong>Capacity:</strong> {hospitalData.capacity ? parseInt(hospitalData.capacity).toLocaleString() : 'N/A'}
                </Typography>
                <Typography variant="body1">
                  <strong>Status:</strong>
                  <span style={{ color: hospitalData.status === 'active' ? 'green' : 'red' }}>{hospitalData.status}</span>
                </Typography>
                <Typography variant="body1">
                  <strong>Created By:</strong> {hospitalData?.created_by?.email || 'N/A'}
                </Typography>
                <Typography variant="body1">
                  <strong>Updated By:</strong> {hospitalData?.updated_by?.email || 'N/A'}
                </Typography>
                <Typography variant="body1">
                  <strong>Created At:</strong> {moment(hospitalData.created_at).format('MMMM Do YYYY, h:mm:ss a')}
                </Typography>
                <Typography variant="body1">
                  <strong>Updated At:</strong> {moment(hospitalData.updated_at).format('MMMM Do YYYY, h:mm:ss a')}
                </Typography>
              </Box>
            </Box>
          </TabPanel>
          <TabPanel value={value} index={1}>
            {/* <Typography variant="body1">Services content goes here...</Typography> */}
            <HospitalServicesPage hospitalData={hospitalData} />
          </TabPanel>
          <TabPanel value={value} index={2}>
            {/* <Typography variant="body1">Patients content goes here...</Typography> */}
            <UsersPage hospitalData={hospitalData} />
          </TabPanel>
          <Dialog open={profilePhotoVisible} onClose={() => setProfilePhotoVisible(false)} maxWidth="md" fullWidth>
            <center>
              <div className="flex align-items-center justify-content-center">
                <img
                  src={`${import.meta.env.VITE_APP_API_BASE_URL}${hospitalData?.photo_url}`}
                  alt="Profile"
                  style={{ width: 'auto', maxHeight: '90vh' }}
                />
              </div>
            </center>
          </Dialog>

          <EditForm
            rowData={hospitalData}
            show={showEditForm}
            onHide={handleCloseEditForm}
            onClose={handleCloseEditForm}
            loggedInUserData={loggedInUserData}
          />
        </Paper>
      )}
    </>
  );
}

export default HospitalViewPage;
