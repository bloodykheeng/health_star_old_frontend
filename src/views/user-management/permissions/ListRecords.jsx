/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState, useRef, useMemo } from 'react';

import { getAllPermissionsService } from '../../../services/permissions/permissions-service';
import EditRecord from './EditRecord';
import CreateRecord from './CreateRecord';

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

  const getListOfPermissionServices = useQuery({
    queryKey: ['permissions'],
    queryFn: () => getAllPermissionsService()
  });

  // //=================== handle table server side rendering ==================
  // const [pageParam, setPageParam] = useState(1);
  // const [search, setSearch] = useState();
  // const [pageSize, setpageSize] = useState();
  // const [orderBy, setOrderBy] = useState();
  // const [orderDirection, setOrderDirection] = useState();
  // console.log('🚀 ~ ListRecords ~ orderDirection:', orderDirection);

  // const getListOfPermissionServicesRef = useRef();

  // const getListOfPermissionServices = useQuery({
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
    if (getListOfPermissionServices?.isError) {
      console.log('Error fetching List of Hospitals :', getListOfPermissionServices?.error);
      getListOfPermissionServices?.error?.response?.data?.message
        ? toast.error(getListOfPermissionServices?.error?.response?.data?.message)
        : !getListOfPermissionServices?.error?.response
          ? toast.warning('Check Your Internet Connection Please')
          : toast.error('An Error Occured Please Contact Admin');
    }
  }, [getListOfPermissionServices?.isError]);

  console.log('User Permissions list : ', getListOfPermissionServices?.data?.data);

  const [deleteItemMutationIsLoading, setDeleteItemMutationIsLoading] = useState(false);

  // const deleteSelectedItemMutation = useMutation({
  //   mutationFn: deleteHospitalServiceById,
  //   onSuccess: (data) => {
  //     queryClient.resetQueries(['hospital-servvices']);
  //     setLoading(false);
  //     setDeleteItemMutationIsLoading(false);
  //     console.log('deleted user succesfully ooooo: ');
  //   },
  //   onError: (err) => {
  //     console.log('The error is : ', err);
  //     toast.error('An error occurred!');
  //     setLoading(false);
  //     setDeleteItemMutationIsLoading(false);
  //   }
  // });

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
      // deleteSelectedItemMutation.mutate(itemToDeleteId);
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
      sorting: false,
      render: (rowData) => {
        return <div>{rowData.tableData.id}</div>;
      }
    },
    {
      title: 'Name',
      field: 'name',
      sorting: false
    },
    {
      title: 'Guard Name',
      field: 'guard_name',
      sorting: false
    }
  ];

  return (
    <Box sx={{ width: '100%' }}>
      <Grid container>
        <Grid item xs={12}>
          {/* <Box sx={{ height: '3rem', m: 1, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            {loggedInUserData?.permissions?.includes('create') && (
              <Button onClick={handleShowUserForm} variant="contained" color="primary">
                Add Hospital Service
              </Button>
            )}
          </Box> */}
          {/* <ServerSideMuiTable
            tableTitle="Hospitals"
            tableData={getListOfPermissionServices?.data?.data ?? []}
            tableColumns={columns}
            handleShowEditForm={handleShowEditForm}
            handleDelete={(e, item_id) => handleDelete(e, item_id)}
            showEdit={loggedInUserData?.permissions?.includes('update')}
            showDelete={loggedInUserData?.permissions?.includes('delete')}
            loading={getListOfPermissionServices.isLoading || getListOfPermissionServices.status === 'loading' || deleteItemMutationIsLoading}
            current_page={getListOfPermissionServices?.data?.data?.current_page}
            totalCount={getListOfPermissionServices?.data?.data?.total}
            setTableQueryObject={setTableQueryObject}
            handleMaterialTableQueryPromise={handleMaterialTableQueryPromise}
          /> */}

          <ClientSideMuiTable
            tableTitle="Permissions"
            tableData={getListOfPermissionServices?.data?.data ?? []}
            tableColumns={columns}
            handleShowEditForm={handleShowEditForm}
            handleDelete={(e, item_id) => handleDelete(e, item_id)}
            showEdit={false}
            showDelete={false}
            loading={
              getListOfPermissionServices?.isLoading || getListOfPermissionServices?.status === 'loading' || deleteItemMutationIsLoading
            }
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
