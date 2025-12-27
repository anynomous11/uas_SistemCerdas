import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import InputData from './pages/InputData';
import EvaluationResult from './pages/EvaluationResult';
import History from './pages/History';

function App() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/input" element={<InputData />} />
          <Route path="/evaluasi" element={<EvaluationResult />} />
          <Route path="/riwayat" element={<History />} />
        </Routes>
      </main>
      <footer style={{ textAlign: 'center', padding: '1.5rem', borderTop: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
        &copy; {new Date().getFullYear()} Sistem Cerdas Evaluasi Produktivitas.
      </footer>
    </div>
  );
}

export default App;
