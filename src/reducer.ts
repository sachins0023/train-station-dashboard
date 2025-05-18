import { SET_PLATFORM_DATA, UPDATE_TRAIN_STATUS } from "./constants";
import type { Train, TrainAction } from "./types";

export const trainReducer = (
  state: Record<string, Train[]>,
  action: TrainAction
): Record<string, Train[]> => {
  switch (action.type) {
    case SET_PLATFORM_DATA:
      return action.payload;
    case UPDATE_TRAIN_STATUS: {
      const updatesMap = new Map(
        action.payload.map((u) => [
          `${u.trainNumber}-${u.platformId}`,
          u.status,
        ])
      );
      return Object.entries(state).reduce((acc, [platformId, trains]) => {
        acc[platformId] = trains.map((train) =>
          updatesMap.has(`${train.trainNumber}-${platformId}`)
            ? {
                ...train,
                status: updatesMap.get(`${train.trainNumber}-${platformId}`)!,
              }
            : train
        );
        return acc;
      }, {} as Record<string, Train[]>);
    }
    default:
      return state;
  }
};
