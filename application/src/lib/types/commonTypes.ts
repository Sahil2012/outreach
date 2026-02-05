import { ThreadMetaItem } from "./threadsTypes";

export interface PropsWithValueOnChange<T> {
  value: T;
  onChange: (value: T) => void;
}

export interface PropsWithId {
  id: number;
}

export interface PropsWithThread {
  thread: ThreadMetaItem;
}