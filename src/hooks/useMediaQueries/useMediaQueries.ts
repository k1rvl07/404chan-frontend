import { BREAKPOINTS } from "@constants";
import { useMediaQuery } from "react-responsive";

export const useMediaQueries = () => {
  const isDesktop = useMediaQuery({ minWidth: BREAKPOINTS.isDesktop.minWidth });
  return {
    isDesktop,
  };
};
