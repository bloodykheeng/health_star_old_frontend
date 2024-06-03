import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Box, Typography, Paper } from '@mui/material';
import TabPanel from './widgets/TabPanel';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';

import moment from 'moment';

import {
  getAllHospitals,
  getHospitalById,
  postHospital,
  updateHospital,
  deleteHospitalById
} from '../../services/hospital/hospital-service';

import HospitalServicesPage from './hospital-services/HospitalServicesPage';

function HospitalViewPage() {
  const queryClient = useQueryClient();

  //
  let { state } = useLocation();
  let parentDataFormState = state?.hospitalData ? state?.hospitalData : null;

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
      {fetchParentById?.isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <CircularProgress /> {/* Loading indicator */}
        </div>
      ) : (
        <Paper elevation={3}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label="hospital details tabs">
              <Tab label="Details" />
              <Tab label="Services" />
              <Tab label="Patients" />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            <Box sx={{ p: 3 }}>
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
              <Typography variant="body1">
                <strong>Photo:</strong>{' '}
                {hospitalData.photo_url ? (
                  <img src={`${import.meta.env.VITE_APP_API_BASE_URL}${hospitalData.photo_url}`} alt={hospitalData.name} width="100" />
                ) : (
                  'No Image'
                )}
              </Typography>
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
                <strong>Website:</strong>{' '}
                <a href={hospitalData.website} target="_blank" rel="noopener noreferrer">
                  {hospitalData.website}
                </a>
              </Typography>
              <Typography variant="body1">
                <strong>Capacity:</strong> {hospitalData.capacity || 'N/A'}
              </Typography>
              <Typography variant="body1">
                <strong>Status:</strong>{' '}
                <span style={{ color: hospitalData.status === 'active' ? 'green' : 'red' }}>{hospitalData.status}</span>
              </Typography>
              <Typography variant="body1">
                <strong>Created By:</strong> {hospitalData.created_by || 'N/A'}
              </Typography>
              <Typography variant="body1">
                <strong>Updated By:</strong> {hospitalData.updated_by || 'N/A'}
              </Typography>
              <Typography variant="body1">
                <strong>Created At:</strong> {moment(hospitalData.created_at).format('MMMM Do YYYY, h:mm:ss a')}
              </Typography>
              <Typography variant="body1">
                <strong>Updated At:</strong> {moment(hospitalData.updated_at).format('MMMM Do YYYY, h:mm:ss a')}
              </Typography>
            </Box>
          </TabPanel>
          <TabPanel value={value} index={1}>
            {/* <Typography variant="body1">Services content goes here...</Typography> */}
            <HospitalServicesPage hospitalData={hospitalData} />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <Typography variant="body1">Patients content goes here...</Typography>
          </TabPanel>
        </Paper>
      )}
    </>
  );
}

export default HospitalViewPage;
