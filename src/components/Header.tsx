import { Link, NavLink } from 'react-router-dom';

interface HeaderProps {}

const Header = ({}: HeaderProps) => {
  return (
    <header>
      <nav className="navbar navbar-light">
        <div className="container">
          <Link className="navbar-brand" to="/">
            conduit
          </Link>
          <ul className="nav navbar-nav pull-xs-right">
            <li className="nav-item">
              {/* Add "active" className when you're on that page"  */}
              <NavLink className="nav-link " to="/" end>
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/login">
                Sign in
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/register">
                Sign up
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;

// 로그인 됐을 때
// <nav className="navbar navbar-light">
//   <div className="container">
//     <a className="navbar-brand" href="/">conduit</a>
//     <ul className="nav navbar-nav pull-xs-right">
//       <li className="nav-item">
//         <!-- Add "active" className when you're on that page" -->
//         <a className="nav-link active" href="/">Home</a>
//       </li>
//       <li className="nav-item">
//         <a className="nav-link" href="/editor"> <i className="ion-compose"></i>&nbsp;New Article </a>
//       </li>
//       <li className="nav-item">
//         <a className="nav-link" href="/settings"> <i className="ion-gear-a"></i>&nbsp;Settings </a>
//       </li>
//       <li className="nav-item">
//         <a className="nav-link" href="/profile/eric-simons">
//           <img src="" className="user-pic" />
//           Eric Simons
//         </a>
//       </li>
//     </ul>
//   </div>
// </nav>
