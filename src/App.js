import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import DateRange from './components/reports/DateRange/Combined';
import InputStatus from './components/reports/InputStatus/Combined';
import MonthRange from './components/reports/MonthRange/Combined';
import Login from './components/auth/Login'; // Import your Login component
import Signup from './components/auth/Signup'; // Import your Signup component

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light" style={{ backgroundColor: '#007BFF' }}>
      <div className="container">
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link to="/InputStatus" className="nav-link btn btn-outline-light">
                Input Data
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/DateRange" className="nav-link btn btn-outline-light">
                View Within Date Range
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/MonthRange" className="nav-link btn btn-outline-light">
              View Within Month Range
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/login" className="nav-link btn btn-outline-light">
                Login
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/signup" className="nav-link btn btn-outline-light">
                Signup
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/signup" element={<Signup />} /> {/* Add the signup route */}
          <Route path="/" element={<Login />} />
          <Route path="/DateRange" element={<DateRange />} />
          <Route path="/InputStatus" element={<InputStatus />} />
          <Route path="/MonthRange" element={<MonthRange />} />
          <Route path="/login" element={<Login />} /> {/* Add the login route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;