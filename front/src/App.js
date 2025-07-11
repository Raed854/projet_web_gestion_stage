import './App.css';
import Login from './composant/Login/Login';
import { Route, Routes } from "react-router-dom";
import AdminDashboard from './composant/adminDashboard/adminDashboard';
import AdminStage from './composant/adminDashboard/stage/stage';
import Bilanrapide from './composant/adminDashboard/Bilanrapide/Bilanrapide';
import Layout from "./composant/encadrant/encadrant";
import Forbidden from './composant/Login/Forbidden';
import Encadrantstagiere from './composant/encadrant/etudiant/etudiant';
import StageList from './composant/encadrant/stage/StageList';
import StageDetail from './composant/encadrant/stage/StageDetails';
import EtudiantLayout from './composant/etudient/EtudiantLayout';
import MesTaches from './composant/etudient/MesTaches';
import MesCompteRendus from './composant/etudient/MesCompteRendus';
import CompteRenduEvaluation from './composant/encadrant/compteRendu/CompteRenduEvaluation';
import Chat from './composant/chat/Chat';
import ProtectedRoute from './composant/Login/ProtectedRoute';
import MesStages from './composant/etudient/MesStages';
import Profile from './composant/profile/Profile';

function App() {
  return (
    <div className="App">      <Routes>        
        {/* Public routes */}
        <Route path='/' Component={Login} />
        <Route path="/forbidden" element={<Forbidden />} />        {/* Admin routes */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Layout />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="stage" element={<AdminStage />} />
          <Route path="bilan" element={<Bilanrapide />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Encadrant routes */}
        <Route path="/encadrant" element={
          <ProtectedRoute allowedRoles={['encadrant']}>
            <Layout />
          </ProtectedRoute>
        }>
          <Route path="stagiere" element={<Encadrantstagiere />} />
          <Route path="stage" element={<StageList />} />
          <Route path="stages/:id" element={<StageDetail />} />
          <Route path="comptes-rendus" element={<CompteRenduEvaluation />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Etudiant routes */}
        <Route path="/etudiant" element={
          <ProtectedRoute allowedRoles={['etudiant']}>
            <EtudiantLayout />
          </ProtectedRoute>
        }>
          <Route path="taches" element={<MesTaches />} />
          <Route path="comptes-rendus" element={<MesCompteRendus />} />
          <Route path="stages" element={<MesStages />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Shared routes - accessible by all authenticated users */}
        <Route path="/chat" element={
          <ProtectedRoute allowedRoles={['admin', 'encadrant', 'etudiant']}>
            <Chat />
          </ProtectedRoute>
        } />

      </Routes>
    </div>
  );
}

export default App;
