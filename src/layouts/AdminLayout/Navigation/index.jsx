import { useContext } from 'react';

// project imports
import NavContent from './NavContent';
import { ConfigContext } from 'contexts/ConfigContext';
import useWindowSize from 'hooks/useWindowSize';
import navigation from 'menu-items';
import navitemcollapse from 'menu-items-collapse';
import * as actionType from 'store/actions';
import { AuthContext } from '../../../contexts/AuthContext';

// assets
import avatar2 from 'assets/images/user/avatar-2.jpg';

// -----------------------|| NAVIGATION ||-----------------------//

const filterMenuByRole = (items, role) => {
  return items
    .map(group => ({
      ...group,
      children: group.children?.filter(item => {
        // menu tanpa roles → tampil untuk semua
        if (!item.roles) return true;

        // menu dengan roles → cek role
        return item.roles.includes(role);
      })
    }))
    .filter(group => group.children && group.children.length > 0);
};

export default function Navigation() {
  const configContext = useContext(ConfigContext);
  const { collapseMenu, collapseLayout } = configContext.state;
  const windowSize = useWindowSize();
  const { dispatch } = configContext;
  const { loading, userRole } = useContext(AuthContext);
  // const userRole = 'admin'; // ganti nanti dari API / context


  const navToggleHandler = () => {
    dispatch({ type: actionType.COLLAPSE_MENU });
  };

  let navClass = 'dark-sidebar';

  // let navContent = <NavContent navigation={collapseLayout ? navitemcollapse.items : navigation.items} />;
  const rawMenu = collapseLayout
  ? navitemcollapse.items
  : navigation.items;

const filteredMenu = filterMenuByRole(rawMenu, userRole);

let navContent = <NavContent navigation={filteredMenu} />;

  navClass = [...navClass, 'pc-sidebar'];
  if (windowSize.width <= 1024 && collapseMenu) {
    navClass = [...navClass, 'mob-sidebar-active'];
  } else if (collapseMenu) {
    navClass = [...navClass, 'navbar-collapsed'];
  }
  console.log('User Role : ', userRole);
  let navBarClass = ['navbar-wrapper'];

  let mobileOverlay = <></>;
  if (windowSize.width <= 1024 && collapseMenu) {
    mobileOverlay = <div className="pc-menu-overlay" onClick={navToggleHandler} aria-hidden="true" />;
  }

  let navContentDOM = <div className={navBarClass.join(' ')}>{navContent}</div>;

  return (
    <nav className={navClass.join(' ')}>
      {navContentDOM}
      {mobileOverlay}
    </nav>
  );
}
