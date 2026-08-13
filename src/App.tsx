import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import './App.css'
import LandingPage from './pages/public/LandingPage';
import SignIn from './pages/public/SignIn';
import SignUp from './pages/public/SignUp';
import JobSeekerDashboard from './pages/job_seeker/JobSeekerDashboard';
import EmployerLayout from './pages/employer/EmployerLayout';
import ToasterProvider from './components/ToasterProvider';
import ProtectedRoute from './components/ProtectedRoutes';


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
        <Route path="/job-seeker-dashboard" element={
          <ProtectedRoute allowedRoles={['job_seeker']}>
            <JobSeekerDashboard />
          </ProtectedRoute>
        } />
        <Route path='/employer-dashboard' element={
          <ProtectedRoute allowedRoles={['employer']}>
             <EmployerLayout />
          </ProtectedRoute>
        }/>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
    
    </AuthProvider>
     
    </>
  )
}

export default App
