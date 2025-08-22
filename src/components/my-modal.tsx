import { Modal } from 'antd';
import { create, useModal } from '@ebay/nice-modal-react';

const MyModal = create(({ children }: { children: React.ReactNode }) => {
  const modal = useModal();
  console.log(modal.visible);

  return (
    <Modal open={modal.visible} onCancel={modal.hide} onOk={modal.hide}>
      {children}
    </Modal>
  );
});

export default MyModal;
