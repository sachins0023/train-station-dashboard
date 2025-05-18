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
  | {
      type: "SET_PLATFORM_DATA";
      payload: Record<string, Train[]>;
      minTime: string;
      maxTime: string;
    }
  | {
      type: "UPDATE_TRAIN_STATUS";
      payload: { trainNumber: string; status: Status; platformId: string }[];
    }
  | { type: "UPDATE_CLOCK"; payload: string }
  | { type: "RESET_STATE" };

export interface TrainState {
  platformData: Record<string, Train[]>;
  clockTime: string;
  minTime?: string;
  maxTime?: string;
}
