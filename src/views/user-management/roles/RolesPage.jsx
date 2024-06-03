import React, { useEffect, useState } from 'react';

// material-ui
import Typography from '@mui/material/Typography';

// project import
import MainCard from 'components/MainCard';
import RowForm from './widgets/RowForm';
import { getAllRolesAndModifiedPermissionsService, syncPermissionToRoleService } from '../../../services/roles/roles-service';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import CircularProgress from '@mui/material/CircularProgress'; // Import CircularProgress

function RolesPage() {
  const getListOfRolesAndModifiedPermissionServices = useQuery({
    queryKey: ['roles-with-modified-permissions'],
    queryFn: () => getAllRolesAndModifiedPermissionsService()
  });

  useEffect(() => {
    if (getListOfRolesAndModifiedPermissionServices?.isError) {
      console.log('Error fetching List of Hospitals :', getListOfRolesAndModifiedPermissionServices?.error);
      getListOfRolesAndModifiedPermissionServices?.error?.response?.data?.message
        ? toast.error(getListOfRolesAndModifiedPermissionServices?.error?.response?.data?.message)
        : !getListOfRolesAndModifiedPermissionServices?.error?.response
          ? toast.warning('Check Your Internet Connection Please')
          : toast.error('An Error Occured Please Contact Admin');
    }
  }, [getListOfRolesAndModifiedPermissionServices?.isError]);

  console.log('getListOfRolesAndModifiedPermissionServices list : ', getListOfRolesAndModifiedPermissionServices?.data?.data);
  return (
    <MainCard title="Roles">
      <Typography variant="body2">Easily Manage Permissions under roles</Typography>
      <br />
      <div>
        {getListOfRolesAndModifiedPermissionServices?.isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress /> {/* Loading indicator */}
          </div>
        ) : (
          <RowForm rolesAndModifiedPermissionData={getListOfRolesAndModifiedPermissionServices?.data?.data} />
        )}
      </div>
    </MainCard>
  );
}

export default RolesPage;
