import { ThreadMetaItem } from "./threadsTypes";

export interface FormControlProps<T> {
  value: T;
  onChange: (value: T) => void;
  disabled?: boolean;
}

export interface PropsWithId {
  id: number;
}

export interface PropsWithThread {
  thread: ThreadMetaItem;
}
