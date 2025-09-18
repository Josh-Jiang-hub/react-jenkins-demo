import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoadingSpinner from './components/LoadingSpinner';
import './App.css';
import ThreeEditor from './pages/three-js-editor';
import Recorder from './pages/recorder';
import Animation from './pages/animation';
import Chat from './pages/chat';

// 懶加載頁面組件
const Home = React.lazy(() => import('./pages/home'));
const About = React.lazy(() => import('./pages/about'));
const Css = React.lazy(() => import('./pages/css'));

function App() {
  return (
    <Router>
      <div className="app">
        <main className="main-content">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/css" element={<Css />} />
              <Route path="/three-editor" element={<ThreeEditor />} />
              <Route path="/recorder" element={<Recorder />} />
              <Route path="/animation" element={<Animation />} />
              <Route path="/chat" element={<Chat />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </Router>
  );
}

export default App;
