import React from 'react';

// material-ui
import Typography from '@mui/material/Typography';

// project import
import MainCard from 'components/MainCard';
import ListRecords from './ListRecords';
import BreadcrumbNav from '../../../../../components/general_components/BreadcrumbNav';

function UserPointsPage({ userProfileData, hospitalData }) {
  return (
    <>
      <BreadcrumbNav />
      <MainCard title="User Points">
        <ListRecords userProfileData={userProfileData} hospitalData={hospitalData} />
      </MainCard>
    </>
  );
}

export default UserPointsPage;
