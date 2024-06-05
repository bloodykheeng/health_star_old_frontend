// material-ui
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project import
import NavGroup from './NavGroup';
import { AdminMenuItems, healthManagerMenuItems, PatientMenuItems } from 'menu-items';

//============ get Auth Context ===============
import useAuthContext from '../../../../../context/AuthContext';

// ==============================|| DRAWER CONTENT - NAVIGATION ||============================== //

export default function Navigation() {
  const { user: loggedInUserData, logoutMutation, logoutMutationIsLoading } = useAuthContext();
  console.log('🚀 ~ MenuItems ~ loggedInUserData:', loggedInUserData);

  // Determine which menu items to use based on logged-in user's role
  let itemsToRender = [];

  switch (loggedInUserData?.role) {
    case 'Admin':
      itemsToRender = AdminMenuItems.items;
      break;
    case 'Health Facility Manager':
      itemsToRender = healthManagerMenuItems.items;
      break;
    case 'Patient':
      itemsToRender = PatientMenuItems.items;
      break;
    default:
      itemsToRender = [];
      // Handle default case or unauthorized user scenario
      break;
  }

  const navGroups = itemsToRender.map((item) => {
    switch (item.type) {
      case 'group':
        return <NavGroup key={item.id} item={item} />;
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Fix - Navigation Group
          </Typography>
        );
    }
  });

  return <Box sx={{ pt: 2 }}>{navGroups}</Box>;
}
