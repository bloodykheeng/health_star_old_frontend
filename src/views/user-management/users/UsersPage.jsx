import React from 'react';

// material-ui
import Typography from '@mui/material/Typography';

// project import
import MainCard from 'components/MainCard';
import ListRecords from './ListRecords';

function UsersPage() {
  return (
    <MainCard title="Users">
      <ListRecords />
    </MainCard>
  );
}

export default UsersPage;
