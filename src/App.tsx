import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoadingSpinner from './components/LoadingSpinner';
import './App.css';

// 懶加載頁面組件
const Home = React.lazy(() => import('./pages/home'));
const About = React.lazy(() => import('./pages/about'));

function App() {
  return (
    <Router>
      <div className="app">
        <main className="main-content">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </Router>
  );
}

export default App;
