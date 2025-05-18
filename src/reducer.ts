import { SET_TRAINS, UPDATE_TRAIN_STATUS } from "./constants";
import type { Train, TrainAction } from "./types";

export const trainReducer = (state: Train[], action: TrainAction): Train[] => {
  switch (action.type) {
    case SET_TRAINS:
      return action.payload;
    case UPDATE_TRAIN_STATUS: {
      const updatesMap = new Map(
        action.payload.map((u) => [u.trainNumber, u.status])
      );
      return state.map((train) =>
        updatesMap.has(train.trainNumber)
          ? { ...train, status: updatesMap.get(train.trainNumber)! }
          : train
      );
    }
    default:
      return state;
  }
};
