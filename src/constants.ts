export const TIME_MULTIPLIER = 100;
export const INITIAL_CLOCK_TIME = "08:00";

export const SET_PLATFORM_DATA = "SET_PLATFORM_DATA";
export const UPDATE_TRAIN_STATUS = "UPDATE_TRAIN_STATUS";
export const UPDATE_CLOCK = "UPDATE_CLOCK";

export const TRAIN_CSV_HEADERS = [
  "Train Number",
  "Scheduled Arrival",
  "Scheduled Departure",
  "Priority",
];

export const TRAIN_TABLE_HEADERS = [
  "Train Number",
  "Priority",
  "Scheduled Arrival",
  "Actual Arrival",
  "Scheduled Departure",
  "Actual Departure",
  "Platform",
  "Status",
];

export const TABLE_HEADERS_KEY_MAP = {
  "Train Number": "trainNumber",
  Priority: "priority",
  "Scheduled Arrival": "scheduledArrival",
  "Actual Arrival": "actualArrival",
  "Scheduled Departure": "scheduledDeparture",
  "Actual Departure": "actualDeparture",
  Platform: "platformId",
  Status: "status",
};
