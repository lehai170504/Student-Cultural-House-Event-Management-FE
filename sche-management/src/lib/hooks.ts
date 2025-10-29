import { useDispatch, useSelector, useStore } from "react-redux";
import type { RootState, AppDispatch } from "./store";

export const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>();

export const useAppSelector = <T>(selector: (state: RootState) => T): T =>
  useSelector<RootState, T>(selector);

export const useAppStore = () => useStore();
