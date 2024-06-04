/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState, useRef, useMemo } from 'react';

import { getAllVisits, getVisitById, postVisit, updateVisit, deleteVisitById } from '../../../../../services/visits/visits-service';
import EditRecord from './EditRecord';
import CreateRecord from './CreateRecord';

import moment from 'moment';
import { Link, useNavigate } from 'react-router-dom';
import ServerSideMuiTable from '../../../../../components/general_components/ServerSideMuiTable';
import ClientSideMuiTable from '../../../../../components/general_components/ClientSideMuiTable';
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
import useAuthContext from '../../../../../context/AuthContext';

function ListRecords({ userProfileData, hospitalData }) {
  const { user: loggedInUserData, logoutMutation, logoutMutationIsLoading } = useAuthContext();
  console.log('🚀 ~ ListRecords ~ loggedInUserData:', loggedInUserData);

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedItem, setSelectedItem] = useState({ id: null });
  const [tableQueryObject, setTableQueryObject] = useState();
  console.log('🚀 ~ ListRecords ~ tableQueryObject:', tableQueryObject);

  const [showUserForm, setShowUserForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [userDetail, setUserDetail] = useState();

  const handleShowEditForm = (item) => {
    setSelectedItem(item);
    setShowEditForm(true);
  };
  const handleCloseEditForm = () => {
    setSelectedItem({ id: null });
    setShowEditForm(false);
  };

  const handleShowUserForm = () => {
    setShowUserForm(true);
  };
  const handleCloseUserForm = () => {
    setShowUserForm(false);
  };

  const getListOfUserVisits = useQuery({
    queryKey: ['visits', userProfileData?.id, hospitalData?.id],
    queryFn: () => getAllVisits({ user_id: userProfileData?.id, hospital_id: hospitalData?.id })
  });

  // //=================== handle table server side rendering ==================
  // const [pageParam, setPageParam] = useState(1);
  // const [search, setSearch] = useState();
  // const [pageSize, setpageSize] = useState();
  // const [orderBy, setOrderBy] = useState();
  // const [orderDirection, setOrderDirection] = useState();
  // console.log('🚀 ~ ListRecords ~ orderDirection:', orderDirection);

  // const getListOfUserVisitsRef = useRef();

  // const getListOfUserVisits = useQuery({
  //   queryKey: ['hospitals', pageSize, pageParam, search, orderBy],
  //   queryFn: () =>
  //     getAllHospitals({ per_page: pageSize, page: pageParam, search: search, orderBy: orderBy, orderDirection: orderDirection })
  // });

  // const handleMaterialTableQueryPromise = async (query) => {
  //   console.log('🚀 ~ handleMaterialTableQueryPromise ~ query:', query);

  //   setPageParam(query.page + 1); // MaterialTable uses 0-indexed pages
  //   setpageSize(query.pageSize);
  //   // eslint-disable-next-line no-extra-boolean-cast
  //   setSearch(query.search);
  //   setOrderBy(query?.orderBy?.field);
  //   setOrderDirection(query?.orderDirection);

  //   return;
  // };

  // //===================end handle table server side rendering ==================

  useEffect(() => {
    if (getListOfUserVisits?.isError) {
      console.log('Error fetching List of User points :', getListOfUserVisits?.error);
      getListOfUserVisits?.error?.response?.data?.message
        ? toast.error(getListOfUserVisits?.error?.response?.data?.message)
        : !getListOfUserVisits?.error?.response
          ? toast.warning('Check Your Internet Connection Please')
          : toast.error('An Error Occured Please Contact Admin');
    }
  }, [getListOfUserVisits?.isError]);
  console.log('User getListOfUserVisits Points list : ', getListOfUserVisits?.data?.data);

  const [deleteItemMutationIsLoading, setDeleteItemMutationIsLoading] = useState(false);

  const deleteSelectedItemMutation = useMutation({
    mutationFn: deleteVisitById,
    onSuccess: (data) => {
      queryClient.resetQueries(['visits']);
      setLoading(false);
      setDeleteItemMutationIsLoading(false);
      console.log('deleted visit succesfully ooooo: ');
    },
    onError: (err) => {
      console.log('The error is : ', err);
      toast.error('An error occurred!');
      setLoading(false);
      setDeleteItemMutationIsLoading(false);
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

  let tableId = 0;

  const columns = [
    {
      title: '#',
      width: '5%',
      field: 'id',
      sorting: true,
      render: (rowData) => {
        return <div>{rowData.tableData.id + 1}</div>;
      }
    },
    {
      title: 'User',
      field: 'user.name',
      sorting: true
    },
    {
      title: 'Hospital',
      field: 'hospital.name',
      sorting: true
    },
    {
      title: 'Start Date',
      field: 'start_date',
      sorting: true,
      render: (rowData) => moment(rowData.start_date).format('MM/DD/YYYY h:mm:ss A')
    },
    {
      title: 'End Date',
      field: 'end_date',
      sorting: true,
      render: (rowData) => moment(rowData.end_date).format('MM/DD/YYYY h:mm:ss A')
    },
    {
      title: 'Purpose',
      field: 'purpose',
      sorting: true
    },
    {
      title: 'Doctor Name',
      field: 'doctor_name',
      sorting: true
    },
    {
      title: 'Details',
      field: 'details',
      sorting: true,
      render: (rowData) => (
        <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 200 }}>{rowData.details}</div>
      )
    },
    {
      title: 'Status',
      field: 'status',
      sorting: true
    },
    {
      title: 'Created By',
      field: 'created_by.email',
      sorting: true
    },
    {
      title: 'Updated By',
      field: 'updated_by.email',
      sorting: true,
      hidden: true
    }
  ];

  return (
    <Box sx={{ width: '100%' }}>
      <Grid container>
        <Grid item xs={12}>
          <Box sx={{ height: '3rem', m: 1, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            {loggedInUserData?.permissions?.includes('create') && (
              <Button onClick={handleShowUserForm} variant="contained" color="primary">
                Add User Visits
              </Button>
            )}
          </Box>
          {/* <ServerSideMuiTable
            tableTitle="Hospitals"
            tableData={getListOfUserVisits?.data?.data ?? []}
            tableColumns={columns}
            handleShowEditForm={handleShowEditForm}
            handleDelete={(e, item_id) => handleDelete(e, item_id)}
            showEdit={loggedInUserData?.permissions?.includes('update')}
            showDelete={loggedInUserData?.permissions?.includes('delete')}
            loading={getListOfUserVisits.isLoading || getListOfUserVisits.status === 'loading' || deleteItemMutationIsLoading}
            current_page={getListOfUserVisits?.data?.data?.current_page}
            totalCount={getListOfUserVisits?.data?.data?.total}
            setTableQueryObject={setTableQueryObject}
            handleMaterialTableQueryPromise={handleMaterialTableQueryPromise}
          /> */}

          <ClientSideMuiTable
            tableTitle="User Visits"
            tableData={getListOfUserVisits?.data?.data?.data ?? []}
            tableColumns={columns}
            handleShowEditForm={handleShowEditForm}
            handleDelete={(e, item_id) => handleDelete(e, item_id)}
            showEdit={['Admin'].includes(loggedInUserData?.role) && loggedInUserData?.permissions.includes('update')}
            showDelete={['Admin'].includes(loggedInUserData?.role) && loggedInUserData?.permissions.includes('delete')}
            loading={getListOfUserVisits?.isLoading || getListOfUserVisits?.status === 'loading' || deleteItemMutationIsLoading}
            //
            // handleViewPage={(rowData) => {
            //   navigate('hospital-service', { state: { hospitalData: rowData } });
            // }}
            showViewPage={false}
            hideRowViewPage={false}
          />

          <EditRecord
            rowData={selectedItem}
            show={showEditForm}
            onHide={handleCloseEditForm}
            onClose={handleCloseEditForm}
            loggedInUserData={loggedInUserData}
            userProfileData={userProfileData}
            hospitalData={hospitalData}
          />
          <CreateRecord
            show={showUserForm}
            onHide={handleCloseUserForm}
            onClose={handleCloseUserForm}
            loggedInUserData={loggedInUserData}
            userProfileData={userProfileData}
            hospitalData={hospitalData}
          />
        </Grid>
      </Grid>

      <Dialog open={deleteDialogOpen} onClose={cancelDelete}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>Are you sure you want to delete this Record?</DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="secondary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ListRecords;
