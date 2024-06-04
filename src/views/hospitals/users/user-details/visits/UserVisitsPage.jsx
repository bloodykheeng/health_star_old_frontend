import React from 'react';

// material-ui
import Typography from '@mui/material/Typography';

// project import
import MainCard from 'components/MainCard';
import ListRecords from './ListRecords';
import BreadcrumbNav from '../../../../../components/general_components/BreadcrumbNav';

function UserVisitsPage({ userProfileData, hospitalData }) {
  return (
    <>
      {/* <BreadcrumbNav /> */}
      <MainCard title="User Visits">
        <ListRecords userProfileData={userProfileData} hospitalData={hospitalData} />
      </MainCard>
    </>
  );
}

export default UserVisitsPage;
