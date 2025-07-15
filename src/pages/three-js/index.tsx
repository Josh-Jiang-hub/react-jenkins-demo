import { Tabs } from 'antd-mobile';
import TestOne from './chapter/test-one';

export default function index() {
  return (
    <div>
      <Tabs defaultActiveKey="2">
        <Tabs.Tab destroyOnClose title="Espresso" key="1">
          <div style={{ width: '100%', height: '100vh' }}>
            <TestOne />
          </div>
        </Tabs.Tab>
      </Tabs>
    </div>
  );
}
