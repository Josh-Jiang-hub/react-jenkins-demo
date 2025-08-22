import React, { useState } from 'react';
import { ClockCircleOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import CountDown from './components/count-down';

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
  {
    key: 'animation-effect',
    label: '动画效果',
    icon: <ClockCircleOutlined />,
    children: [
      {
        key: 'countdown',
        label: '倒计时',
      },
    ],
  },
];

const contentNode = {
  countdown: <CountDown />,
};

const App: React.FC = () => {
  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e);
    setCurrent(e.key);
  };
  const [current, setCurrent] = useState('countdown');
  return (
    <div className="min-h-[100vh] flex">
      <Menu
        onClick={onClick}
        style={{ width: 256 }}
        className="min-h-[100vh]"
        defaultSelectedKeys={['1']}
        selectedKeys={[current]}
        openKeys={['animation-effect']}
        mode="inline"
        items={items}
      />
      <div>{contentNode[current]}</div>
    </div>
  );
};

export default App;
