import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemText,
  Stack
} from '@mui/material';

function VisitDetailsModal({ selectedRecord, showModal, handleCloseModal }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Ongoing':
        return 'success'; // Green color for Ongoing status
      case 'Scheduled':
        return 'info'; // Blue color for Scheduled status
      case 'Completed':
        return 'primary'; // Primary color for Completed status
      default:
        return 'default'; // Default color for any other status
    }
  };

  return (
    <Dialog open={showModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
      <DialogTitle>Visit Details</DialogTitle>
      <DialogContent dividers>
        {selectedRecord ? (
          <Stack spacing={2}>
            <Typography variant="body1">Start Date: {moment(selectedRecord.start_date).format('MMM DD, YYYY')}</Typography>
            <Typography variant="body1">End Date: {moment(selectedRecord.end_date).format('MMM DD, YYYY')}</Typography>
            <Typography variant="body1">Purpose: {selectedRecord.purpose}</Typography>
            <Typography variant="body1">Doctor Name: {selectedRecord.doctor_name}</Typography>
            <Typography variant="body1">Details: {selectedRecord.details}</Typography>
            <Typography variant="body1">
              Status:
              <Chip label={selectedRecord.status} color={getStatusColor(selectedRecord.status)} />
            </Typography>
            <Typography variant="body1">Hospital: {selectedRecord.hospital.name}</Typography>

            {selectedRecord.hospital_services && selectedRecord.hospital_services.length > 0 && (
              <Typography variant="body1">
                Services:
                <List>
                  {selectedRecord.hospital_services.map((service, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={`${service.service.name} - ${service.no_of_points}`} />
                    </ListItem>
                  ))}
                </List>
              </Typography>
            )}

            <Typography variant="body1">Created By: {selectedRecord.created_by.name}</Typography>
            <Typography variant="body1">Updated At: {moment(selectedRecord.updated_at).format('MMM DD, YYYY, h:mm A')}</Typography>
          </Stack>
        ) : (
          <Typography variant="body1">No visit details available</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseModal} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

VisitDetailsModal.propTypes = {
  selectedRecord: PropTypes.shape({
    start_date: PropTypes.string,
    end_date: PropTypes.string,
    purpose: PropTypes.string,
    doctor_name: PropTypes.string,
    details: PropTypes.string,
    status: PropTypes.string,
    hospital: PropTypes.shape({
      name: PropTypes.string
    }),
    hospital_services: PropTypes.arrayOf(
      PropTypes.shape({
        service: PropTypes.shape({
          name: PropTypes.string
        }),
        no_of_points: PropTypes.string
      })
    ),
    created_by: PropTypes.shape({
      name: PropTypes.string
    }),
    updated_at: PropTypes.string
  }),
  showModal: PropTypes.bool.isRequired,
  handleCloseModal: PropTypes.func.isRequired
};

export default VisitDetailsModal;
