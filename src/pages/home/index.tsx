import React from 'react';
import { Link } from 'react-router-dom';

const items = [
  {
    title: 'three.js 编辑器',
    route: '/three-editor',
  },
  {
    title: '简历',
    route: '/resume',
  },
  {
    title: '工具',
    route: '/tools',
  },
  {
    title: 'CSS',
    route: '/css',
  },
  {
    title: '面试',
    route: '/other',
  },
  {
    title: '其他',
    route: '/other',
  },
  {
    title: '录音',
    route: '/recorder',
  },
];

const colors = [
  '#F57C00',
  '#E91E63',
  '#FFD700',
  '#ff7875',
  '#0EA5E9',
  '#FFA500',
];

const Home: React.FC = () => {
  return (
    <div className="max-w-screen-lg mx-auto">
      <div className="w-full mb-[200px] text-center ">
        <h1 className="text-4xl font-bold text-center">
          魔法世界的大门已经打开
        </h1>
      </div>
      <div className="flex w-full flex-wrap gap-[10px] justify-center">
        {items.map((item, index) => (
          <div
            className={`flex-[0_0_45%] xxl:flex-[0_0_30%] h-[100px] mb-[10px] cursor-pointer flex items-center justify-center text-white`}
            style={{
              backgroundColor: colors[index % colors.length],
            }}
            key={item.route}
          >
            <Link to={item.route}>{item.title}</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
