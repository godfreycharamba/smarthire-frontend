import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import LandingPage from './pages/public/LandingPage';
import SignIn from './pages/public/SignIn';
import SignUp from './pages/job_seeker/SignUp';
import JobSeekerDashboard from './pages/job_seeker/JobSeekerDashboard';
import EmployerLayout from './pages/employer/EmployerLayout';


function App() {


  return (
    <>
     <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
       
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/job-seeker-dashboard" element={<JobSeekerDashboard />} />
        <Route path='/employer-dashboard' element={<EmployerLayout/>}/>
      </Routes>
    </Router>
     
    </>
  )
}

export default App
