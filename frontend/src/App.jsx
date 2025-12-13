import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import MonthlyData from './pages/MonthlyData';
import Visualizations from './pages/Visualizations';
import RegionalData from './pages/RegionalData';
import ModelInfo from './pages/ModelInfo';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/Service-Big-Data/" element={<Dashboard />} />
            <Route path="/Service-Big-Data/monthly" element={<MonthlyData />} />
            <Route path="/Service-Big-Data/visualizations" element={<Visualizations />} />
            <Route path="/Service-Big-Data/regional" element={<RegionalData />} />
            <Route path="/Service-Big-Data/model" element={<ModelInfo />} />
          </Routes>
        </main>
        <footer className="footer">
          <p>© 2025 DBD Analytics - Proyek UAS Big Data Semester 5</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
