import { Modal } from 'antd';
import { createModal, useModal } from '@/super-control-modal';

const MyModal = createModal(({ children }: { children: React.ReactNode }) => {
  const modal = useModal();
  console.log(modal.visible);

  return (
    <Modal open={modal.visible} onCancel={modal.hide} onOk={modal.hide}>
      {children}
    </Modal>
  );
});

export default MyModal;
