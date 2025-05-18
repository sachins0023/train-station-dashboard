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
  platformId: string;
}

export interface Platform {
  platformId: string;
  nextAvailable: Date;
  queue: Train[];
}

export type TrainAction =
  | { type: "SET_PLATFORM_DATA"; payload: Record<string, Train[]> }
  | {
      type: "UPDATE_TRAIN_STATUS";
      payload: { trainNumber: string; status: Status; platformId: string }[];
    };
