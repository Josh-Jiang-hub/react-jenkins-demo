import React, { useState } from 'react';
import { ClockCircleOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import CountDown from './components/count-down';
import DynamicList from './components/dynamic-list';

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
      {
        key: 'dynamicList',
        label: '动态列表',
      },
    ],
  },
];

const contentNode = {
  countdown: <CountDown />,
  dynamicList: <DynamicList />,
};

const App: React.FC = () => {
  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e);
    setCurrent(e.key);
  };
  const [current, setCurrent] = useState('dynamicList');
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
      <div className="flex p-[30px] justify-center w-full h-[100vh] overflow-auto">
        {contentNode[current]}
      </div>
    </div>
  );
};

export default App;
