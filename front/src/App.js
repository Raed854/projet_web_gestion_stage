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
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' Component={Login} />
        <Route path="/forbidden" element={<Forbidden />} />
        {/* admin */}
        <Route path="/users" element={< AdminDashboard />} /> 
        <Route path="/adminstage" element= {< AdminStage />} />
        <Route path="/Bilan" element= {< Bilanrapide />} />    
        {/* encadrant */}
        <Route path="/encadrant/" element={<Layout />}>
          <Route path="stagiere" element= {< Encadrantstagiere />} />  
          <Route path="stage" element={<StageList />} />
          <Route path="stages/:id" element={<StageDetail />} />  
        </Route>


      </Routes>
    </div>
  );
}

export default App;
