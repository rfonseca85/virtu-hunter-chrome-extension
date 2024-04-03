import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HeaderNavbar from './components/HeaderNavbar';
import Home from './pages/Home';
import Footer from './components/Footer';

function App() {
  return (
    <div className="lg:container mx-4 lg:mx-auto">
      <Router>
        <HeaderNavbar />
        <Routes>
          <Route path="/*" element={<Home />} />
          <Route path="/home" element={<Home />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
