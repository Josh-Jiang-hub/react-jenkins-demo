import { Tabs } from 'antd-mobile';
import TestOne from './chapter/test-one';

export default function index() {
  return (
    <div>
      <Tabs defaultActiveKey="1">
        <Tabs.Tab destroyOnClose title="Espresso" key="1">
          <div style={{ width: '100%', height: '100vh' }}>
            <TestOne />
          </div>
        </Tabs.Tab>
        <Tabs.Tab destroyOnClose title="Coffee Latte" key="2">
          3
        </Tabs.Tab>
        <Tabs.Tab destroyOnClose title="Cappuccino" key="3">
          3
        </Tabs.Tab>
        <Tabs.Tab destroyOnClose title="Americano" key="4">
          4
        </Tabs.Tab>
        <Tabs.Tab destroyOnClose title="Flat White" key="5">
          5
        </Tabs.Tab>
        <Tabs.Tab destroyOnClose title="Caramel Macchiato" key="6">
          6
        </Tabs.Tab>
        <Tabs.Tab destroyOnClose title="Cafe Mocha" key="7">
          7
        </Tabs.Tab>
      </Tabs>
    </div>
  );
}
