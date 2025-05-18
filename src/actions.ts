import { SET_TRAINS, UPDATE_TRAIN_STATUS } from "./constants";
import type { Status, Train, TrainAction } from "./types";

export const setTrains = (trains: Train[]): TrainAction => ({
  type: SET_TRAINS,
  payload: trains,
});

export const updateTrainStatus = (
  events: {
    train: Train;
    type: Status;
  }[]
): TrainAction => ({
  type: UPDATE_TRAIN_STATUS,
  payload: events.map((event) => ({
    trainNumber: event.train.trainNumber,
    status: event.type,
  })),
});
