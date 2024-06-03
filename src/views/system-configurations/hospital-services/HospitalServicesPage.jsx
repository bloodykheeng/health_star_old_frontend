import React from 'react';

// material-ui
import Typography from '@mui/material/Typography';

// project import
import MainCard from 'components/MainCard';
import ListRecords from './ListRecords';

function HospitalServicesPage() {
  return (
    <MainCard title="Hospitals Services">
      <ListRecords />
    </MainCard>
  );
}

export default HospitalServicesPage;
