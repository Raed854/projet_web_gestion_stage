import './App.css';
import Login from './composant/Login/Login';
import { Route, Routes } from "react-router-dom";
import ForgotPassword from './composant/Login/forgetpassword/password';
import SignUp from './composant/Login/signup/signup';
import AdminDashboard from './composant/adminDashboard/adminDashboard';
import Etudient from './composant/etudient/etudient';
import Encadrant from './composant/encadrant/encadrant';
import Bilanrapide from './composant/adminDashboard/Bilanrapide/Bilanrapide';
import Gérercomptes from './composant/adminDashboard/gérercomptes/gérercomptes';
import Rapport from './composant/adminDashboard/rapport/rapport';
import Create from './composant/stage/create/create';
import Stage from './composant/stage/create/stage';
import Rendu from './composant/stage/compt rendu/rendu';
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' Component={Login} />
        <Route path="/password" element={<ForgotPassword />} />  
        <Route path="/signup" element={<SignUp />} /> 
        <Route path="/AdminDashboard" element={< AdminDashboard />} /> 
        <Route path="/etudient" element= {< Etudient />} />
        <Route path="/encadrant" element= {< Encadrant />} />
        <Route path="/Bilan" element= {< Bilanrapide />} />    
        <Route path="/compte" element= {< Gérercomptes />} /> 
        <Route path="/rapport" element= {< Rapport />} /> 
        <Route path="/create" element= {< Create />} />
        <Route path="/stage" element= {< Stage />} /> 
        <Route path="/rendu" element= {< Rendu />} /> 
      </Routes>
    </div>
  );
}

export default App;
