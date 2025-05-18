import {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
  type Dispatch,
} from "react";
import { trainReducer } from "@/reducer";
import type { TrainState, TrainAction } from "@/types";
import { INITIAL_CLOCK_TIME } from "@/constants";

interface TrainContextType {
  state: TrainState;
  dispatch: Dispatch<TrainAction>;
}

const TrainContext = createContext<TrainContextType | undefined>(undefined);

const initialState: TrainState = {
  platformData: {},
  clockTime: INITIAL_CLOCK_TIME,
};

export function TrainProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(trainReducer, initialState);

  return (
    <TrainContext.Provider value={{ state, dispatch }}>
      {children}
    </TrainContext.Provider>
  );
}

export function useTrainContext() {
  const context = useContext(TrainContext);
  if (context === undefined) {
    throw new Error("useTrainContext must be used within a TrainProvider");
  }
  return context;
}
