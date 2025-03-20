import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="nav-container">
        <ul className="nav-list">
          <li>
            <Link to="/story">
              <button className={location.pathname === '/story' ? 'active' : ''}>Story</button>
            </Link>
          </li>
          <li>
            <Link to="/">
              <button className={location.pathname === '/' ? 'active' : ''}>About us</button>
            </Link>
          </li>
          <li>
            <Link to="/gallery">
              <button className={location.pathname === '/gallery' ? 'active' : ''}>Gallery</button>
            </Link>
          </li>
          <li>
            <Link to="/phrases">
              <button className={location.pathname === '/phrases' ? 'active' : ''}>Communication</button>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;