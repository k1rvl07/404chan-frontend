import { useEffect, useRef } from "react";

export const useUnmount = (fn: () => void | Promise<void>) => {
  const fnRef = useRef(fn);

  fnRef.current = fn;

  useEffect(
    () => () => {
      fnRef.current();
    },
    [],
  );
};
