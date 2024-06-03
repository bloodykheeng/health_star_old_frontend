import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import CreateRecord from './CreateRecord';

import {
  getAllHospitalServices,
  getHospitalServiceById,
  postHospitalService,
  updateHospitalService,
  deleteHospitalServiceById
} from '../../../services/hospital/hospital-services-service';

import moment from 'moment';
import { Link, useNavigate } from 'react-router-dom';
import ServerSideMuiTable from '../../../components/general_components/ServerSideMuiTable';
import ClientSideMuiTable from '../../../components/general_components/ClientSideMuiTable';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { Grid, Button, CircularProgress, Stack, Box } from '@mui/material';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';

//============ get Auth Context ===============
import useAuthContext from '../../../context/AuthContext';

const hospitalServices = [
  { id: 1, name: 'Emergency Room' },
  { id: 2, name: 'Cardiology' },
  { id: 3, name: 'Neurology' },
  { id: 4, name: 'Pediatrics' },
  { id: 5, name: 'Radiology' }
];

function ListRecords({ hospitalData }) {
  const { user: loggedInUserData, logoutMutation, logoutMutationIsLoading } = useAuthContext();
  console.log('🚀 ~ ListRecords ~ loggedInUserData:', loggedInUserData);

  const queryClient = useQueryClient();

  const [isModalOpen, setModalOpen] = useState(false);

  const handleAttachServices = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const getListOfHospitalServices = useQuery({
    queryKey: ['hospitals-services', 'by-hospital-id', hospitalData?.id],
    queryFn: () => getAllHospitalServices({ hospital_id: hospitalData?.id })
  });

  //   //=================== handle table server side rendering ==================
  //   const [pageParam, setPageParam] = useState(1);
  //   const [search, setSearch] = useState();
  //   const [pageSize, setpageSize] = useState();
  //   const [orderBy, setOrderBy] = useState();
  //   const [orderDirection, setOrderDirection] = useState();
  //   console.log('🚀 ~ ListRecords ~ orderDirection:', orderDirection);

  //   const getListOfHospitalServicesRef = useRef();

  //   const getListOfHospitalServices = useQuery({
  //     queryKey: ['hospitals', pageSize, pageParam, search, orderBy],
  //     queryFn: () =>
  //       getAllHospitals({ per_page: pageSize, page: pageParam, search: search, orderBy: orderBy, orderDirection: orderDirection })
  //   });

  //   const handleMaterialTableQueryPromise = async (query) => {
  //     console.log('🚀 ~ handleMaterialTableQueryPromise ~ query:', query);

  //     setPageParam(query.page + 1); // MaterialTable uses 0-indexed pages
  //     setpageSize(query.pageSize);
  //     // eslint-disable-next-line no-extra-boolean-cast
  //     setSearch(query.search);
  //     setOrderBy(query?.orderBy?.field);
  //     setOrderDirection(query?.orderDirection);

  //     return;
  //   };

  //   //===================end handle table server side rendering ==================

  useEffect(() => {
    if (getListOfHospitalServices?.isError) {
      console.log('Error fetching List of Hospitals :', getListOfHospitalServices?.error);
      getListOfHospitalServices?.error?.response?.data?.message
        ? toast.error(getListOfHospitalServices?.error?.response?.data?.message)
        : !getListOfHospitalServices?.error?.response
          ? toast.warning('Check Your Internet Connection Please')
          : toast.error('An Error Occured Please Contact Admin');
    }
  }, [getListOfHospitalServices?.isError]);
  console.log('getListOfHospitalServices list : ', getListOfHospitalServices?.data?.data);

  const [deleteItemMutationIsLoading, setDeleteItemMutationIsLoading] = useState(false);

  const deleteSelectedItemMutation = useMutation({
    mutationFn: deleteHospitalServiceById,
    onSuccess: (data) => {
      toast.success('Service detached successfully');
      queryClient.invalidateQueries(['hospitals']);
      setDeleteItemMutationIsLoading(false);
      console.log('deleted user succesfully ooooo: ');
    },
    onError: (error) => {
      setDeleteItemMutationIsLoading(false);
      console.log('The error is : ', error);
      error?.response?.data?.message
        ? toast.error(error?.response?.data?.message)
        : !error?.response
          ? toast.warning('Check Your Internet Connection Please')
          : toast.error('An Error Occured Please Contact Admin');
    }
  });

  // const handleDelete = async (event, id) => {
  //     console.log("Hospitals is xxxxx : ", id);
  //     var result = window.confirm("Are you sure you want to delete? ");
  //     if (result === true) {
  //         setLoading(true);
  //         deleteUserMutation.mutate(id);
  //     }
  // };

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDeleteId, setItemToDeleteId] = useState(null);

  const handleDelete = (event, id) => {
    setItemToDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDeleteId !== null) {
      setDeleteItemMutationIsLoading(true);
      deleteSelectedItemMutation.mutate(itemToDeleteId);
      setDeleteDialogOpen(false);
      setItemToDeleteId(null);
    }
  };

  const cancelDelete = () => {
    setDeleteItemMutationIsLoading(false);
    setDeleteDialogOpen(false);
    setItemToDeleteId(null);
  };

  const columns = [
    {
      title: '#',
      width: '5%',
      field: 'id',
      sorting: false,
      render: (rowData) => {
        return <div>{rowData.tableData.id + 1}</div>;
      }
    },
    {
      title: 'Name',
      field: 'service.name',
      sorting: false
    }
  ];

  return (
    <div>
      <Box sx={{ width: '100%' }}>
        <Grid container>
          <Grid item xs={12}>
            <Box sx={{ height: '3rem', m: 1, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              {loggedInUserData?.permissions?.includes('create') && (
                <Button variant="contained" color="primary" onClick={handleAttachServices}>
                  Attach Hospital Services
                </Button>
              )}
            </Box>
            {/* <h1>Hospital Services</h1>
            <ul>
              {hospitalServices.map((service) => (
                <li key={service.id}>{service.name}</li>
              ))}
            </ul> */}

            {/* <ServerSideMuiTable
            tableTitle="Hospitals"
            tableData={getListOfHospitalServices?.data?.data ?? []}
            tableColumns={columns}
            handleShowEditForm={handleShowEditForm}
            handleDelete={(e, item_id) => handleDelete(e, item_id)}
            showEdit={loggedInUserData?.permissions?.includes('update')}
            showDelete={loggedInUserData?.permissions?.includes('delete')}
            loading={getListOfHospitalServices.isLoading || getListOfHospitalServices.status === 'loading' || deleteItemMutationIsLoading}
            current_page={getListOfHospitalServices?.data?.data?.current_page}
            totalCount={getListOfHospitalServices?.data?.data?.total}
            setTableQueryObject={setTableQueryObject}
            handleMaterialTableQueryPromise={handleMaterialTableQueryPromise}
          /> */}

            <ClientSideMuiTable
              tableTitle="Hospital Services"
              tableData={getListOfHospitalServices?.data?.data ?? []}
              tableColumns={columns}
              showEdit={false}
              //   handleShowEditForm={handleShowEditForm}
              showDelete={['Admin'].includes(loggedInUserData?.role) && loggedInUserData?.permissions.includes('delete')}
              handleDelete={(e, item_id) => handleDelete(e, item_id)}
              loading={
                getListOfHospitalServices?.isLoading || getListOfHospitalServices?.status === 'loading' || deleteItemMutationIsLoading
              }
              //
              // handleViewPage={(rowData) => {
              //   navigate('hospital', { state: { hospitalData: rowData } });
              // }}
              showViewPage={false}
              hideRowViewPage={false}
            />

            <CreateRecord hospitalData={hospitalData} show={isModalOpen} onHide={handleCloseModal} onClose={handleCloseModal} />
          </Grid>
        </Grid>
      </Box>

      <Dialog open={deleteDialogOpen} onClose={cancelDelete}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>Are you sure you want to detach this service ?</DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="secondary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ListRecords;
