export interface PropsWithValueOnChange<T> {
  value: T;
  onChange: (value: T) => void;
}

export interface PropsWithId {
  id: number;
}
