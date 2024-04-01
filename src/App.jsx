import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HeaderNavbar from './components/HeaderNavbar';
import HomePage from './pages/HomePage';
import FormPage from './pages/FormPage';
import Footer from './components/Footer';

function App() {
  return (
    <div className="lg:container mx-auto">
      <Router>
        <HeaderNavbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/form" element={<FormPage />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
