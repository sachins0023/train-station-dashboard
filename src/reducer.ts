import {
  SET_PLATFORM_DATA,
  UPDATE_TRAIN_STATUS,
  UPDATE_CLOCK,
} from "./constants";
import type { Train, TrainAction, TrainState } from "./types";

const initialState: TrainState = {
  platformData: {},
  clockTime: "10:00",
};

export const trainReducer = (
  state: TrainState = initialState,
  action: TrainAction
): TrainState => {
  switch (action.type) {
    case SET_PLATFORM_DATA:
      return {
        ...state,
        platformData: action.payload,
      };
    case UPDATE_TRAIN_STATUS: {
      const updatesMap = new Map(
        action.payload.map((u) => [
          `${u.trainNumber}-${u.platformId}`,
          u.status,
        ])
      );
      const updatedPlatformData = Object.entries(state.platformData).reduce(
        (acc, [platformId, trains]) => {
          acc[platformId] = trains.map((train) =>
            updatesMap.has(`${train.trainNumber}-${platformId}`)
              ? {
                  ...train,
                  status: updatesMap.get(`${train.trainNumber}-${platformId}`)!,
                }
              : train
          );
          return acc;
        },
        {} as Record<string, Train[]>
      );
      return {
        ...state,
        platformData: updatedPlatformData,
      };
    }
    case UPDATE_CLOCK:
      return {
        ...state,
        clockTime: action.payload,
      };
    default:
      return state;
  }
};
