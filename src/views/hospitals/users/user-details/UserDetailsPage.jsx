/* eslint-disable react/no-unknown-property */
/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from 'react';
import { Card, Avatar, Dialog, Button, Divider, Tab, Tabs, Typography, Box } from '@mui/material';

import DeleteOutline from '@mui/icons-material/DeleteOutline';
import Edit from '@mui/icons-material/Edit';
import { css } from '@emotion/react';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import EditForm from '../EditRecord';
import BreadcrumbNav from '../../../../components/general_components/BreadcrumbNav';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';

import {
  getAllUsers,
  getUserById,
  getApproverRoles,
  createUser,
  updateUser,
  deleteUserById,
  getAssignableRoles
} from '../../../../services/auth/user-service';

import UserPointsPage from './user-points/UserPointsPage';
import UserVisitsPage from './visits/UserVisitsPage';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`} aria-labelledby={`tab-${index}`} {...other}>
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function UserDetailsPage({ loggedInUserData }) {
  const queryClient = useQueryClient();

  //
  let { state } = useLocation();
  let parentDataFormState = state?.userData ? state?.userData : null;
  let hospitalData = state?.hospitalData ? state?.hospitalData : null;

  //===================== getDepartmentById by id =================
  const fetchParentById = useQuery({
    queryKey: ['users', 'getById', parentDataFormState?.id],
    queryFn: () => getUserById(parentDataFormState?.id)
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

  let userDetail = fetchParentById?.data?.data;
  console.log('🚀 ~ UserDetailsPage ~ userDetail:', userDetail);

  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(userDetail);
  const [showEditForm, setShowEditForm] = useState(false);
  const [profilePhotoVisible, setProfilePhotoVisible] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    setProfileData(userDetail);
  }, [userDetail]);

  const handleCloseEditForm = () => {
    setShowEditForm(false);
  };

  const getColorSeverity = (status) => {
    let color = 'primary';
    if (status === 'active') color = 'success';
    else if (status === 'deactive') color = 'danger';
    return color;
  };

  const handleChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <>
      <div className="justify-content-center align-items-center h-100">
        <BreadcrumbNav />

        {fetchParentById?.isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress /> {/* Loading indicator */}
          </div>
        ) : (
          <div className="col-12">
            <Card className="mb-3" style={{ borderRadius: '.5rem' }}>
              <div className="flex flex-wrap g-0">
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
                    src={`${import.meta.env.VITE_APP_API_BASE_URL}${profileData?.photo_url}`}
                    alt="Profile Picture"
                    sx={{ width: 128, height: 128, cursor: 'pointer', my: 2 }}
                    onClick={() => setProfilePhotoVisible(true)}
                  />
                  <h2>{profileData?.name}</h2>
                  <h2>ROLE: {profileData?.role}</h2>
                  <Button startIcon={<Edit />} className="m-2" variant="contained" color="primary" onClick={() => setShowEditForm(true)}>
                    Edit Profile
                  </Button>
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
                <div
                  css={css`
                    @media (max-width: 767px) {
                      width: 100%;
                      flex-grow: 0 !important;
                    }
                  `}
                  className="flex-grow-1"
                >
                  <div className="p-4">
                    <Tabs value={tabIndex} onChange={handleChange} aria-label="profile tabs">
                      <Tab label="User Details" />
                      <Tab label="User Points" />
                      <Tab label="Visits" />
                    </Tabs>
                    <TabPanel value={tabIndex} index={0}>
                      <h3>Information</h3>
                      <div>
                        <div
                          className="flex"
                          style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '1rem',
                            alignItems: 'center'
                          }}
                        >
                          <h3>Name: </h3>
                          <p className="text-muted">{profileData?.name}</p>
                        </div>
                        <div
                          className="flex"
                          style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '1rem',
                            alignItems: 'center'
                          }}
                        >
                          <h3>Role: </h3>
                          <p className="text-muted">{profileData?.role}</p>
                        </div>
                        <div
                          className="flex"
                          style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '1rem',
                            alignItems: 'center'
                          }}
                        >
                          <h3>Account Status: </h3>
                          <Typography color={getColorSeverity(profileData?.status)}>
                            {profileData?.status.charAt(0).toUpperCase() + profileData?.status.slice(1)}
                          </Typography>
                        </div>
                      </div>
                      <Divider />
                      <div>
                        <div
                          className="flex"
                          style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '1rem',
                            alignItems: 'center'
                          }}
                        >
                          <h3>Email: </h3>
                          <p className="text-muted">{profileData?.email}</p>
                        </div>
                        <div
                          className="flex"
                          style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '1rem',
                            alignItems: 'center'
                          }}
                        >
                          <h3>Date Joined: </h3>
                          <p className="text-muted">{moment(profileData?.date_joined).format('MMMM D, YYYY h:mm A')}</p>
                        </div>
                      </div>
                    </TabPanel>
                    <TabPanel value={tabIndex} index={1}>
                      {/* <h6>User Points</h6>
                      <p>Details about user points will go here.</p> */}
                      <UserPointsPage userProfileData={profileData} hospitalData={hospitalData} />
                    </TabPanel>
                    <TabPanel value={tabIndex} index={2}>
                      {/* <h6>Visits</h6>
                      <p>Details about user visits will go here.</p> */}

                      <UserVisitsPage userProfileData={profileData} hospitalData={hospitalData} />
                    </TabPanel>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

      <EditForm
        rowData={profileData}
        show={showEditForm}
        onHide={handleCloseEditForm}
        onClose={handleCloseEditForm}
        loggedInUserData={loggedInUserData}
      />

      <Dialog open={profilePhotoVisible} onClose={() => setProfilePhotoVisible(false)} maxWidth="md" fullWidth>
        <div className="flex align-items-center justify-content-center">
          <img
            src={`${import.meta.env.VITE_APP_API_BASE_URL}${profileData?.photo_url}`}
            alt="Profile"
            style={{ width: 'auto', maxHeight: '90vh' }}
          />
        </div>
      </Dialog>
    </>
  );
}

export default UserDetailsPage;
