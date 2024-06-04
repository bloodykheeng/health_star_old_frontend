import React from 'react';

// material-ui
import Typography from '@mui/material/Typography';

// project import
import MainCard from 'components/MainCard';
import ListRecords from './ListRecords';

function UsersPage({ hospitalData }) {
  return (
    <MainCard title="users">
      <ListRecords hospitalData={hospitalData} />
    </MainCard>
  );
}

export default UsersPage;
