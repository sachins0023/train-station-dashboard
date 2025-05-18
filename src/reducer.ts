import {
  SET_PLATFORM_DATA,
  UPDATE_TRAIN_STATUS,
  UPDATE_CLOCK,
  RESET_STATE,
  INITIAL_CLOCK_TIME,
} from "./constants";
import type { Train, TrainAction, TrainState } from "./types";

const initialState: TrainState = {
  platformData: {},
  clockTime: INITIAL_CLOCK_TIME,
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
        minTime: action.minTime,
        maxTime: action.maxTime,
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
    case RESET_STATE:
      return initialState;
    default:
      return state;
  }
};
