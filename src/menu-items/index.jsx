// project import
import dashboard from './dashboard';
import pages from './page';
import utilities from './utilities';
import support from './support';
import userManagement from './user-management';
import systemConfigurations from './system-configurations';

// ==============================|| MENU ITEMS ||============================== //

const menuItems = {
  items: [
    dashboard,
    pages,
    systemConfigurations,
    userManagement
    //  utilities,
    //  support
  ]
};

export default menuItems;
