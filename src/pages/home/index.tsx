import React from 'react';

const Home: React.FC = () => {
  return (
    <div className="page">
      <h1>首頁</h1>
      <p>魔法世界的大门已经打开</p>
      <div className="content">
        <h2>功能特色</h2>
        <ul>
          <li>懶加載路由</li>
          <li>TypeScript 支持</li>
          <li className="text-red-500">現代化 UI 設計</li>
        </ul>
      </div>
    </div>
  );
};

export default Home;
