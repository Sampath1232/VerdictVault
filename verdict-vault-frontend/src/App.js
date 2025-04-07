import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import VerdictUpload from './components/VerdictUpload';
import DecryptPage from './components/DecryptPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<VerdictUpload />} />
        <Route path="/decrypt" element={<DecryptPage />} />
      </Routes>
    </Router>
  );
}

export default App;
