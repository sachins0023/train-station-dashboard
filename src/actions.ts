import {
  SET_PLATFORM_DATA,
  UPDATE_CLOCK,
  UPDATE_TRAIN_STATUS,
} from "./constants";
import type { Status, Train, TrainAction } from "./types";
import { assignTrainsWithMinHeap } from "./utils";

export const setPlatformData = (
  trains: Train[],
  platformCount: number
): TrainAction => {
  const platformData = assignTrainsWithMinHeap(trains, platformCount);
  // Convert platform numbers to strings
  const stringPlatformData = Object.entries(platformData).reduce(
    (acc, [platformId, trains]) => {
      acc[platformId] = trains.map((train) => ({
        ...train,
        platformId: platformId,
      }));
      return acc;
    },
    {} as Record<string, Train[]>
  );
  return {
    type: SET_PLATFORM_DATA,
    payload: stringPlatformData,
  };
};

export const updateTrainStatus = (
  events: {
    train: Train;
    type: Status;
    platformId: string;
  }[]
): TrainAction => ({
  type: UPDATE_TRAIN_STATUS,
  payload: events.map((event) => ({
    trainNumber: event.train.trainNumber,
    status: event.type,
    platformId: event.platformId,
  })),
});

export const updateClock = (time: string): TrainAction => ({
  type: UPDATE_CLOCK,
  payload: time,
});
