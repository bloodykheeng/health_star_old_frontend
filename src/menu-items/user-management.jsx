// assets
import { DashboardOutlined, UserOutlined, KeyOutlined } from '@ant-design/icons';

// icons
const icons = {
  DashboardOutlined,
  UserOutlined,
  KeyOutlined
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const userManagement = {
  id: 'user-management',
  title: 'User Managememt',
  type: 'group',
  children: [
    {
      id: 'users',
      title: 'Users',
      type: 'item',
      url: '/users',
      icon: icons.UserOutlined, // Use the UserOutlined icon for the users route
      breadcrumbs: false
    },
    {
      id: 'roles',
      title: 'Roles',
      type: 'item',
      url: '/roles',
      icon: icons.KeyOutlined, // Use the KeyOutlined icon for the roles route
      breadcrumbs: false
    },
    {
      id: 'permissions',
      title: 'Permissions',
      type: 'item',
      url: '/permissions',
      icon: icons.KeyOutlined, // Use the KeyOutlined icon for the permissions route
      breadcrumbs: false
    }
  ]
};

export default userManagement;
