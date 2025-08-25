import React, { useState } from 'react';
import { ClockCircleOutlined, ToolOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import CountDown from './components/count-down';
import DynamicList from './components/dynamic-list';
import TestRecorder from './components/test-recorder';
import Modal from './components/modal';
import { InnerContextProvider } from '@/super-control-modal';
import ScreenShot from './components/screen-shot';

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
  {
    key: 'animation-effect',
    label: '场景',
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
      {
        key: 'testRecord',
        label: '测试录音',
      },
      {
        key: 'modal',
        label: '弹窗',
      },
      {
        key: 'screenShot',
        label: '截图',
      },
    ],
  },
  {
    key: 'b-tool',
    label: 'B端-工具',
    icon: <ToolOutlined />,
    children: [
      {
        key: 'three-demo',
        label: 'three-demo',
      },
    ],
  },
];

const contentNode = {
  countdown: <CountDown />,
  dynamicList: <DynamicList />,
  testRecord: <TestRecorder />,
  modal: <Modal />,
  screenShot: <ScreenShot />,
};

const App: React.FC = () => {
  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e);
    setCurrent(e.key);
  };
  const [current, setCurrent] = useState('countdown');
  return (
    <InnerContextProvider>
      <div className="min-h-[100vh] flex">
        <Menu
          onClick={onClick}
          style={{ width: 256 }}
          className="min-h-[100vh]"
          selectedKeys={[current]}
          mode="inline"
          items={items}
        />
        <div className="flex p-[30px] justify-center w-full h-[100vh] overflow-auto">
          {contentNode[current]}
        </div>
      </div>
    </InnerContextProvider>
  );
};

export default App;
