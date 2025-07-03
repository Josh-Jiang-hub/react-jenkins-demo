import React from 'react';

const About: React.FC = () => {
  return (
    <div className="page">
      <h1>關於我們</h1>
      <p>這是一個使用 React + TypeScript + Vite 構建的現代化應用。</p>
      <div className="content">
        <h2>技術棧</h2>
        <ul>
          <li>React 19</li>
          <li>TypeScript</li>
          <li>Vite</li>
          <li>React Router</li>
        </ul>
      </div>
    </div>
  );
};

export default About;
