import { Button } from 'antd';
import MyModal from '@/components/my-modal';
import { show } from '@/super-control-modal';

export default function Modal() {
  return (
    <div>
      <Button
        onClick={() => {
          show(MyModal, { children: <div>Hello</div> });
        }}
      >
        Show Modal
      </Button>
    </div>
  );
}
