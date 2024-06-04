import React from 'react';

// material-ui
import Typography from '@mui/material/Typography';
import BreadcrumbNav from '../../components/general_components/BreadcrumbNav';

// project import
import MainCard from 'components/MainCard';
import ListRecords from './ListRecords';

function HospitalsPage() {
  return (
    <>
      <BreadcrumbNav />

      <MainCard title="Hospitals">
        <ListRecords />
      </MainCard>
    </>
  );
}

export default HospitalsPage;
