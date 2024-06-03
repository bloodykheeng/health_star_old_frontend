import React from 'react';

// material-ui
import Typography from '@mui/material/Typography';

// project import
import MainCard from 'components/MainCard';
import ListRecords from './ListRecords';

function HospitalsPage() {
  return (
    <MainCard title="Hospitals">
      <ListRecords />
    </MainCard>
  );
}

export default HospitalsPage;
