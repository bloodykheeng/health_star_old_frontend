import React from 'react';
import ListRecords from './ListRecords';
function HospitalServicesPage({ hospitalData }) {
  return (
    <div>
      <ListRecords hospitalData={hospitalData} />
    </div>
  );
}

export default HospitalServicesPage;
