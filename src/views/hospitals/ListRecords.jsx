/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState, useRef, useMemo } from 'react';

import {
  getAllHospitals,
  getHospitalById,
  postHospital,
  updateHospital,
  deleteHospitalById
} from '../../services/hospital/hospital-service';
import EditRecord from './EditRecord';
import CreateRecord from './CreateRecord';

import moment from 'moment';
import { Link, useNavigate } from 'react-router-dom';
import ServerSideMuiTable from '../../components/general_components/ServerSideMuiTable';
import ClientSideMuiTable from '../../components/general_components/ClientSideMuiTable';
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
import useAuthContext from '../../context/AuthContext';

function ListRecords() {
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

  //=================== handle table server side rendering ==================
  const [pageParam, setPageParam] = useState(1);
  const [search, setSearch] = useState();
  const [pageSize, setpageSize] = useState();
  const [orderBy, setOrderBy] = useState();
  const [orderDirection, setOrderDirection] = useState();
  console.log('🚀 ~ ListRecords ~ orderDirection:', orderDirection);

  const getListOfHospitalsRef = useRef();

  const getListOfHospitals = useQuery({
    queryKey: ['hospitals', pageSize, pageParam, search, orderBy],
    queryFn: () =>
      getAllHospitals({ per_page: pageSize, page: pageParam, search: search, orderBy: orderBy, orderDirection: orderDirection })
  });

  const handleMaterialTableQueryPromise = async (query) => {
    console.log('🚀 ~ handleMaterialTableQueryPromise ~ query:', query);

    setPageParam(query.page + 1); // MaterialTable uses 0-indexed pages
    setpageSize(query.pageSize);
    // eslint-disable-next-line no-extra-boolean-cast
    setSearch(query.search);
    setOrderBy(query?.orderBy?.field);
    setOrderDirection(query?.orderDirection);

    return;
  };

  //===================end handle table server side rendering ==================

  useEffect(() => {
    if (getListOfHospitals?.isError) {
      console.log('Error fetching List of Hospitals :', getListOfHospitals?.error);
      getListOfHospitals?.error?.response?.data?.message
        ? toast.error(getListOfHospitals?.error?.response?.data?.message)
        : !getListOfHospitals?.error?.response
          ? toast.warning('Check Your Internet Connection Please')
          : toast.error('An Error Occured Please Contact Admin');
    }
  }, [getListOfHospitals?.isError]);
  console.log('Hospitals list : ', getListOfHospitals?.data?.data);

  const [deleteItemMutationIsLoading, setDeleteItemMutationIsLoading] = useState(false);

  const deleteSelectedItemMutation = useMutation({
    mutationFn: deleteHospitalById,
    onSuccess: (data) => {
      queryClient.resetQueries(['Hospitals']);
      setLoading(false);
      setDeleteItemMutationIsLoading(false);
      console.log('deleted user succesfully ooooo: ');
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
      title: 'Name',
      field: 'name',
      sorting: true
      // render: (rowData) => <span style={{ color: 'blue', cursor: 'pointer' }}>{rowData?.name}</span>
    },
    {
      title: 'Address',
      field: 'address',
      sorting: true
    },
    {
      title: 'City',
      field: 'city',
      sorting: true
    },
    {
      title: 'State',
      field: 'state',
      sorting: true
    },
    {
      title: 'Photo',
      field: 'photo_url',
      sorting: true,
      render: (rowData) =>
        rowData.photo_url ? (
          <img src={`${import.meta.env.VITE_APP_API_BASE_URL}${rowData.photo_url}`} alt={rowData.name} width="100" />
        ) : (
          'No Image'
        )
    },
    {
      title: 'Country',
      field: 'country',
      sorting: true
    },
    {
      title: 'Zip Code',
      field: 'zip_code',
      sorting: true
    },
    {
      title: 'Phone Number',
      field: 'phone_number',
      sorting: true
    },
    {
      title: 'Slug',
      field: 'slug',
      sorting: true,
      hidden: true
    },
    {
      title: 'Email',
      field: 'email',
      sorting: true
    },
    {
      title: 'Website',
      field: 'website',
      sorting: true,
      render: (rowData) => (
        <a href={rowData.website} target="_blank" rel="noopener noreferrer">
          {rowData.website}
        </a>
      )
    },
    {
      title: 'Capacity',
      field: 'capacity',
      sorting: true
    },
    {
      title: 'Status',
      field: 'status',
      sorting: true,
      render: (rowData) => <span style={{ color: rowData.status === 'active' ? 'green' : 'red' }}>{rowData.status}</span>
    }
  ];

  return (
    <Box sx={{ width: '100%' }}>
      <Grid container>
        <Grid item xs={12}>
          <Box sx={{ height: '3rem', m: 1, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            {loggedInUserData?.permissions?.includes('create') && (
              <Button onClick={handleShowUserForm} variant="contained" color="primary">
                Add Hospital
              </Button>
            )}
          </Box>
          {/* <ServerSideMuiTable
            tableTitle="Hospitals"
            tableData={getListOfHospitals?.data?.data ?? []}
            tableColumns={columns}
            handleShowEditForm={handleShowEditForm}
            handleDelete={(e, item_id) => handleDelete(e, item_id)}
            showEdit={loggedInUserData?.permissions?.includes('update')}
            showDelete={loggedInUserData?.permissions?.includes('delete')}
            loading={getListOfHospitals.isLoading || getListOfHospitals.status === 'loading' || deleteItemMutationIsLoading}
            current_page={getListOfHospitals?.data?.data?.current_page}
            totalCount={getListOfHospitals?.data?.data?.total}
            setTableQueryObject={setTableQueryObject}
            handleMaterialTableQueryPromise={handleMaterialTableQueryPromise}
          /> */}

          <ClientSideMuiTable
            tableTitle="Hospitals"
            tableData={getListOfHospitals?.data?.data ?? []}
            tableColumns={columns}
            handleShowEditForm={handleShowEditForm}
            handleDelete={(e, item_id) => handleDelete(e, item_id)}
            showEdit={['Admin'].includes(loggedInUserData?.role) && loggedInUserData?.permissions.includes('update')}
            showDelete={['Admin'].includes(loggedInUserData?.role) && loggedInUserData?.permissions.includes('delete')}
            loading={getListOfHospitals?.isLoading || getListOfHospitals?.status === 'loading' || deleteItemMutationIsLoading}
            //
            handleViewPage={(rowData) => {
              navigate('hospital', { state: { hospitalData: rowData } });
            }}
            showViewPage={true}
            hideRowViewPage={false}
          />

          <EditRecord
            rowData={selectedItem}
            show={showEditForm}
            onHide={handleCloseEditForm}
            onClose={handleCloseEditForm}
            loggedInUserData={loggedInUserData}
          />
          <CreateRecord
            show={showUserForm}
            onHide={handleCloseUserForm}
            onClose={handleCloseUserForm}
            loggedInUserData={loggedInUserData}
          />
        </Grid>
      </Grid>

      <Dialog open={deleteDialogOpen} onClose={cancelDelete}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>Are you sure you want to delete this user?</DialogContent>
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
