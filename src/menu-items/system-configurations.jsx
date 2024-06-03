// assets
import { DashboardOutlined, UserOutlined, KeyOutlined } from '@ant-design/icons';

// icons
const icons = {
  DashboardOutlined,
  UserOutlined,
  KeyOutlined
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const systemConfigurations = {
  id: 'system-configurations',
  title: 'System Configurations',
  type: 'group',
  children: [
    {
      id: 'services',
      title: 'Services',
      type: 'item',
      url: '/services',
      icon: icons.UserOutlined, // Use the UserOutlined icon for the users route
      breadcrumbs: false
    }
  ]
};

export default systemConfigurations;
