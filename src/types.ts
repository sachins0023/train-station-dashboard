export type Priority = "P1" | "P2" | "P3";

export type Status = "arrived" | "departed" | "waiting" | "scheduled";

export interface TrainCSV {
  trainNumber: string;
  scheduledArrival: string;
  scheduledDeparture: string;
  priority: Priority;
}

export interface Train extends TrainCSV {
  actualArrival: string;
  actualDeparture: string;
  status: Status;
  platformId: number;
}

export interface Platform {
  platformId: number;
  nextAvailable: Date;
  queue: Train[];
}

export type TrainAction =
  | { type: "SET_TRAINS"; payload: Train[] }
  | {
      type: "UPDATE_TRAIN_STATUS";
      payload: { trainNumber: string; status: Status }[];
    };
