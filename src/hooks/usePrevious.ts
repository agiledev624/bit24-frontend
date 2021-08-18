import { useEffect, useRef } from "react";

/**
 * @usage
 *
 * const [count, setCount] = useState(initValue)
 * const previous = usePrevious(count);
 */
export function usePrevious(value) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}
