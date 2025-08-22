import { Button, Card } from 'antd';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import FlipMove from 'react-flip-move';
import LoadMore from '../load-more';
import { v4 as uuid } from 'uuid';

const data = Array.from({ length: 100 }, (_, index) => ({
  id: uuid(),
  name: `Item ${index}`,
}));

export default function DynamicList() {
  const [list, setList] = useState(data);

  const handleDelete = (id: string) => {
    setList(list.filter((item) => item.id !== id));
  };

  return (
    <div className="flex flex-col gap-[10px] mx-auto w-full">
      <FlipMove enterAnimation="elevator" leaveAnimation="elevator">
        {list?.map((item) => (
          <div key={item.id}>
            <AnimatePresence key={item.id}>
              <motion.div
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                initial={{ opacity: 0, scale: 0 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              >
                <Card
                  type="inner"
                  title={item.name}
                  extra={
                    <Button
                      type="dashed"
                      danger
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </Button>
                  }
                >
                  Inner Card content
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>
        ))}
      </FlipMove>
      <LoadMore
        className="my-0 py-5"
        endless={list.length > 1000}
        endlessText="没有更多了~"
        loading={false}
        onVisible={() => {
          setList((list) => {
            const addList = Array.from({ length: 100 }, (_, index) => ({
              id: uuid(),
              name: `Item ${list.length + index}`,
            }));
            return [...list, ...addList];
          });
        }}
        threshold={window.innerHeight}
      />
    </div>
  );
}
