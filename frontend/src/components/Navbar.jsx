import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">
          <h1>🦟 DBD Analytics</h1>
        </Link>
      </div>
      <ul className="navbar-menu">
        <li className={isActive('/Service-Big-Data/')}>
          <Link to="/Service-Big-Data/">Dashboard</Link>
        </li>
        <li className={isActive('/Service-Big-Data/monthly')}>
          <Link to="/Service-Big-Data/monthly">Data Bulanan</Link>
        </li>
        <li className={isActive('/Service-Big-Data/visualizations')}>
          <Link to="/Service-Big-Data/visualizations">Visualisasi</Link>
        </li>
        <li className={isActive('/Service-Big-Data/regional')}>
          <Link to="/Service-Big-Data/regional">Data Regional</Link>
        </li>
        <li className={isActive('/Service-Big-Data/model')}>
          <Link to="/Service-Big-Data/model">Info Model</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
