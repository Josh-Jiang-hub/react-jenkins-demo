import Main from './components/main';
import Menu from './components/menu';
import Properties from './components/properties';

export default function ThreeEditor() {
  return (
    <div className="flex-col flex h-[100vh]">
      <Menu />
      <div className="flex-1 flex">
        <div className="flex-1 h-full border-r-2">
          <Main />
        </div>
        <div className="w-[200px] h-full">
          <Properties />
        </div>
      </div>
    </div>
  );
}
