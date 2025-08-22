import { useCallback, useEffect, useRef } from 'react';
import { cn } from '@/utils/cn';

interface LoadMoreProps {
  /** indicate page loading or not */
  loading?: boolean;
  /** indicate page endless or not. custom content by passing
   *  string | React.element. default: `null`
   */
  endless?: boolean;
  /** error msg when some bad happened */
  error?: React.ReactNode;
  /** emit event when component visible */
  onVisible?: () => void;
  loadingText?: React.ReactNode;
  loadedText?: React.ReactNode;
  endlessText?: React.ReactNode;
  className?: string;
  /** The pixel threshold to the bottom for the scrolling to load, default is 0 */
  threshold?: number;
}

const LoadMoreCore = (props: Partial<LoadMoreProps>) => {
  const {
    loading = false,
    endless = false,
    error,
    loadingText = 'Loading...',
    loadedText = 'Load more...',
    endlessText = 'No more items',
    threshold = 0,
    onVisible = () => {},
  } = props;

  const handleCallback = useCallback(
    (entries: Array<{ intersectionRatio: number }>) => {
      if (entries[0].intersectionRatio <= 0) {
        return;
      }

      if (!loading && typeof onVisible === 'function') {
        onVisible();
      }
    },
    [loading, onVisible]
  );

  const ref = useRef(null);

  useEffect(() => {
    if (
      !(
        (
          'IntersectionObserver' in window &&
          'IntersectionObserverEntry' in window
        )
        // ios12 兼容性问题 polyfill 原型上取不到这个值，不需要判断
        // && 'intersectionRatio' in window.IntersectionObserverEntry.prototype
      )
    ) {
      console.error(
        'IntersectionObserver 不支持当前的浏览器环境，请添加 IntersectionObserver 的 polyfill。例如使用 https://www.npmjs.com/package/intersection-observer '
      );

      return () => {};
    }

    const element = ref.current;
    if (!element) {
      return () => {};
    }

    const observer = new IntersectionObserver(handleCallback, {
      rootMargin: `0px 0px ${threshold}px 0px`,
      threshold: 0,
    });
    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [handleCallback, threshold]);

  if (error) {
    return (
      <div className="relative flex justify-center text-center text-red-500">
        {error}
      </div>
    );
  }
  if (endless) {
    return (
      <div className="relative flex justify-center text-center">
        {endlessText}
      </div>
    );
  }

  return (
    <div
      className={`flex cursor-pointer items-center justify-center overflow-hidden text-center ${
        loading ? 'opacity-50' : ''
      }`}
      ref={ref}
    >
      <div>{loading ? loadingText : loadedText}</div>
    </div>
  );
};

const LoadMore = (props: LoadMoreProps) => (
  <div
    className={cn(
      'mx-auto my-4 w-full touch-none text-center text-sm text-gray-400',
      props.className
    )}
  >
    <LoadMoreCore {...props} />
  </div>
);

export default LoadMore;
