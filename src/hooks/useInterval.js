import { useEffect, useRef } from 'react';

/*
	Thanks Dan Abramov for this workaround:
	https://overreacted.io/making-setinterval-declarative-with-react-hooks/
*/

function useInterval(callback, delay) {
    const savedCallback = useRef();
  
    // Remember the latest callback.
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);
  
    // Set up the interval.
    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  }

export default useInterval;