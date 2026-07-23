import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import './App.css'
import LandingPage from './pages/public/LandingPage';
import SignIn from './pages/public/SignIn';
import SignUp from './pages/public/SignUp';
import JobSeekerDashboard from './pages/job_seeker/JobSeekerDashboard';
import EmployerLayout from './pages/employer/EmployerLayout';
import ToasterProvider from './components/ToasterProvider';


function App() {


  return (
    <>
    <AuthProvider>
     <Router>
      <ToasterProvider /> 
      <Routes>
        <Route path="/" element={<LandingPage />} />
       
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/job-seeker-dashboard" element={<JobSeekerDashboard />} />
        <Route path='/employer-dashboard' element={<EmployerLayout/>}/>
      </Routes>
    </Router>
    
    </AuthProvider>
     
    </>
  )
}

export default App
