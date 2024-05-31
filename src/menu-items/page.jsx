// assets
import { LoginOutlined, ProfileOutlined, HomeOutlined } from '@ant-design/icons';

// icons
const icons = {
  LoginOutlined,
  ProfileOutlined,
  HomeOutlined
};

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const pages = {
  id: 'structures',
  title: 'Structures',
  type: 'group',
  children: [
    {
      id: 'hospitals',
      title: 'Hospitals',
      type: 'item',
      url: '/hospitals',
      icon: icons.HomeOutlined, // Use the HomeOutlined icon for the hospital route
      target: false
    }
    // {
    //   id: 'login1',
    //   title: 'Login',
    //   type: 'item',
    //   url: '/login',
    //   icon: icons.LoginOutlined,
    //   target: true
    // },
    // {
    //   id: 'register1',
    //   title: 'Register',
    //   type: 'item',
    //   url: '/register',
    //   icon: icons.ProfileOutlined,
    //   target: true
    // }
  ]
};

export default pages;
