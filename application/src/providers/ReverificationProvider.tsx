import { ReverificationDialog } from "@/components/function/reverification-dialog";
import { useReverification } from "@clerk/clerk-react";
import {
  createContext,
  MutableRefObject,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

interface ReverificationContextType {
  isReverificationNeeded: boolean;
  changeIsReverificationNeeded?: (val: boolean) => void;
  completeReverification?: MutableRefObject<() => void>;
  cancelReverification?: MutableRefObject<() => void>;
}
const ReverificationContext = createContext<ReverificationContextType>({
  isReverificationNeeded: false,
});

export const ReverificationProvider = ({ children }: PropsWithChildren) => {
  const [isReverificationNeeded, setIsReverificatonNeeded] = useState(false);
  const completeReverification = useRef<() => void>(() => {});
  const cancelReverification = useRef<() => void>(() => {});

  const changeIsReverificationNeeded = useCallback(
    (val: boolean) => setIsReverificatonNeeded(val),
    [],
  );

  const value = useMemo(
    () => ({
      isReverificationNeeded,
      changeIsReverificationNeeded,
      completeReverification,
      cancelReverification,
    }),
    [isReverificationNeeded, changeIsReverificationNeeded],
  );

  return (
    <ReverificationContext.Provider value={value}>
      {children}
      <ReverificationDialog
        open={isReverificationNeeded}
        onComplete={completeReverification.current}
        onCancel={cancelReverification.current}
      />
    </ReverificationContext.Provider>
  );
};

type Callback = (...params: any[]) => Promise<any> | undefined;

export const useHandleReverification = (callback: Callback) => {
  const context = useContext(ReverificationContext);
  if (!context) {
    throw new Error(
      "useHandleReverification must be used within a ReverificationProvider",
    );
  }

  const func = useReverification(callback, {
    onNeedsReverification: (calls) => {
      context.changeIsReverificationNeeded?.(true);
      if (context.completeReverification?.current) {
        context.completeReverification.current = () => {
          context.changeIsReverificationNeeded?.(false);
          calls.complete();
        };
      }
      if (context.cancelReverification?.current) {
        context.cancelReverification.current = () => {
          context.changeIsReverificationNeeded?.(false);
          calls.cancel();
        };
      }
    },
  });

  return {
    isReverificationNeeded: context.isReverificationNeeded,
    func,
  };
};
