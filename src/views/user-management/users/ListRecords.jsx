/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState, useRef, useMemo } from 'react';

import {
  getAllUsers,
  getUserById,
  getApproverRoles,
  createUser,
  updateUser,
  deleteUserById,
  getAssignableRoles
} from '../../../services/auth/user-service';
import EditRecord from './EditRecord';
import CreateRecord from './CreateRecord';

import moment from 'moment';
import { Link } from 'react-router-dom';
import ServerSideMuiTable from '../../../components/general_components/ServerSideMuiTable';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import UserDetailsModal from './UserDetailsModal';
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

function ListRecords() {
  const { user: loggedInUserData, logoutMutation, logoutMutationIsLoading } = useAuthContext();
  console.log('🚀 ~ ListRecords ~ loggedInUserData:', loggedInUserData);

  const queryClient = useQueryClient();
  const [selectedItem, setSelectedItem] = useState({ id: null });
  const [tableQueryObject, setTableQueryObject] = useState();
  console.log('🚀 ~ ListRecords ~ tableQueryObject:', tableQueryObject);

  const [showUserForm, setShowUserForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userDetailShowModal, setUserDetailShowModal] = useState(false);
  const [userDetail, setUserDetail] = useState();

  const handleOpenuserDetailModal = (rowData) => {
    setUserDetail(rowData);
    setUserDetailShowModal(true);
  };

  const handleCloseuserDetailModal = () => {
    setUserDetailShowModal(false);
  };

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

  const getListOfUsersRef = useRef();

  const getListOfUsers = useQuery({
    queryKey: ['users', pageSize, pageParam, search, orderBy],
    queryFn: () => getAllUsers({ per_page: pageSize, page: pageParam, search: search, orderBy: orderBy, orderDirection: orderDirection })
  });

  console.log(
    'is dfdasdsfs loading : ' + getListOfUsers?.isLoading + ' is fetching : ' + getListOfUsers?.isFetching + ' data is : ',
    getListOfUsers?.data?.data?.data
  );

  getListOfUsersRef.current = getListOfUsers;

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

  console.log('🚀 ~ ListRecords ~ getListOfUsers.status:', getListOfUsers.status);

  useEffect(() => {
    if (getListOfUsers?.isError) {
      console.log('Error fetching List of Users :', getListOfUsers?.error);
      getListOfUsers?.error?.response?.data?.message
        ? toast.error(getListOfUsers?.error?.response?.data?.message)
        : !getListOfUsers?.error?.response
          ? toast.warning('Check Your Internet Connection Please')
          : toast.error('An Error Occured Please Contact Admin');
    }
  }, [getListOfUsers?.isError]);
  console.log('users list : ', getListOfUsers?.data?.data);

  const [deleteUserMutationIsLoading, setDeleteUserMutationIsLoading] = useState(false);
  console.log('🚀 ~ ListRecords ~ deleteUserMutationIsLoading:', deleteUserMutationIsLoading);
  const deleteUserMutation = useMutation({
    mutationFn: deleteUserById,
    onSuccess: (data) => {
      queryClient.resetQueries(['users']);
      setLoading(false);
      setDeleteUserMutationIsLoading(false);
      console.log('deleted user succesfully ooooo: ');
    },
    onError: (err) => {
      console.log('The error is : ', err);
      toast.error('An error occurred!');
      setLoading(false);
      setDeleteUserMutationIsLoading(false);
    }
  });

  // const handleDelete = async (event, id) => {
  //     console.log("users is xxxxx : ", id);
  //     var result = window.confirm("Are you sure you want to delete? ");
  //     if (result === true) {
  //         setLoading(true);
  //         deleteUserMutation.mutate(id);
  //     }
  // };

  const handleCloseUserDetailModal = () => setUserDetailShowModal(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);

  const handleDelete = (event, id) => {
    setDeleteUserId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deleteUserId !== null) {
      setDeleteUserMutationIsLoading(true);
      deleteUserMutation.mutate(deleteUserId);
      setDeleteDialogOpen(false);
      setDeleteUserId(null);
    }
  };

  const cancelDelete = () => {
    setDeleteUserMutationIsLoading(false);
    setDeleteDialogOpen(false);
    setDeleteUserId(null);
  };

  let tableId = 0;

  const columns = [
    {
      title: '#',
      width: '5%',
      field: 'name',
      sorting: false,
      customFilterAndSearch: (term, rowData) => term == rowData.name.length,
      render: (rowData) => {
        tableId = rowData.tableData.id;
        tableId++;
        return <div>{rowData.tableData.id}</div>;
      }
    },
    {
      title: 'Name',
      field: 'name',
      sorting: false,
      render: (rowData) => (
        <span style={{ color: 'blue', cursor: 'pointer' }} onClick={() => handleOpenuserDetailModal(rowData)}>
          {rowData?.name}
        </span>
      )
    },
    { title: 'Email', field: 'email', sorting: false },
    { title: 'Role', field: 'role', sorting: false },

    // { title: 'Vendor', field: 'vendors.vendor.name', render: (rowData) => rowData?.vendors?.vendor?.name || 'N/A' },
    {
      title: 'Status',
      field: 'status',
      sorting: false,
      render: (rowData) => <Typography color={rowData.status === 'active' ? 'success' : 'error'}>{rowData.status}</Typography>
    },
    { title: 'Last Login', field: 'lastlogin' },
    {
      title: 'Photo',
      field: 'photo_url',
      sorting: false,
      render: (rowData) =>
        rowData.photo_url ? (
          <img src={`${import.meta.env.VITE_APP_API_BASE_URL}${rowData.photo_url}`} alt={rowData.name} width="100" />
        ) : (
          'No Image'
        )
    }
  ];

  return (
    <Box sx={{ width: '100%' }}>
      <Grid container>
        <Grid item xs={12}>
          <Box sx={{ height: '3rem', m: 1, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            {loggedInUserData?.permissions?.includes('create') && (
              <Button onClick={handleShowUserForm} variant="contained" color="primary">
                Add user
              </Button>
            )}
          </Box>
          <ServerSideMuiTable
            tableTitle="Users"
            tableData={getListOfUsers?.data?.data ?? []}
            tableColumns={columns}
            handleShowEditForm={handleShowEditForm}
            handleDelete={(e, item_id) => handleDelete(e, item_id)}
            showEdit={loggedInUserData?.permissions?.includes('update')}
            showDelete={loggedInUserData?.permissions?.includes('delete')}
            loading={getListOfUsers.isLoading || getListOfUsers.status === 'loading' || deleteUserMutationIsLoading}
            current_page={getListOfUsers?.data?.data?.current_page}
            totalCount={getListOfUsers?.data?.data?.total}
            setTableQueryObject={setTableQueryObject}
            handleMaterialTableQueryPromise={handleMaterialTableQueryPromise}
          />
          <UserDetailsModal user={userDetail} showModal={userDetailShowModal} handleCloseModal={handleCloseUserDetailModal} />
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
