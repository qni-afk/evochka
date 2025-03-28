import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="nav-container">
        <ul className="nav-list">
          <li className={location.pathname === '/eva' ? 'active' : ''}>
            <Link to="/eva">Eva</Link>
          </li>
          <li className={location.pathname === '/' ? 'active' : ''}>
            <Link to="/">About us</Link>
          </li>
          <li className={location.pathname === '/gallery' ? 'active' : ''}>
            <Link to="/gallery">Gallery</Link>
          </li>
          <li className={location.pathname === '/games' ? 'active' : ''}>
            <Link to="/games">Games</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;