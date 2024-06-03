import React from 'react';

// material-ui
import Typography from '@mui/material/Typography';

// project import
import MainCard from 'components/MainCard';
import ListRecords from './ListRecords';

function PermissionsPage() {
  return (
    <MainCard title="Permissions">
      <Typography variant="body2">List Of all Permissions</Typography>

      <ListRecords />
    </MainCard>
  );
}

export default PermissionsPage;
