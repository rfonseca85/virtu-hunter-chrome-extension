import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HeaderNavbar from './components/HeaderNavbar';
import Home from './pages/Home';
import Footer from './components/Footer';
import Profile from './pages/Profile';
import JobBoard from './pages/JobBoard';

function App() {
  return (
    <div className='lg:container mx-4 lg:mx-auto'>
      <Router>
        <HeaderNavbar />
        <Routes>
          <Route path='/*' element={<Home />} />
          <Route path='/home' element={<Home />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/board' element={<JobBoard />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
