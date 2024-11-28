type DebounceFunction<T extends (...args: any[]) => void> = (
  func: T,
  wait: number
) => (...args: Parameters<T>) => void;

export const debounce: DebounceFunction<(...args: any[]) => void> = (
  func,
  wait
) => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<typeof func>) => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func(...args);
    }, wait);
  };
};
