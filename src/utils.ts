import { toast } from "sonner";
import type { Platform, Train } from "./types";
import { MinHeap } from "./dataStructures/minHeap";

export const formatTime = (date: Date) =>
  date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

export const toastMessage = ({
  message,
  description,
  action,
}: {
  message: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}) => toast(message, { description, action });

export const successMessage = (
  message: string,
  action?: { label: string; onClick: () => void }
) => toast.success(message, { action });

export const errorMessage = (
  message: string,
  action?: { label: string; onClick: () => void }
) => toast.error(message, { action });

export const warningMessage = (
  message: string,
  action?: { label: string; onClick: () => void }
) => toast.warning(message, { action });

export const infoMessage = (
  message: string,
  action?: { label: string; onClick: () => void }
) => toast.info(message, { action });

export const assignTrainsWithMinHeap = (
  trains: Train[],
  platformCount: number
): Record<number, Train[]> => {
  const priorityMap = { P1: 1, P2: 2, P3: 3 };

  const parseTime = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return new Date(2000, 0, 1, h, m);
  };

  const formatTime = (date: Date) => date.toTimeString().slice(0, 5); // returns "HH:MM"

  const sortedTrains = [...trains].sort((a, b) => {
    const pa = priorityMap[a.priority];
    const pb = priorityMap[b.priority];
    return pa !== pb ? pa - pb : 0;
  });

  const heap = new MinHeap<Platform>(
    (a, b) => a.nextAvailable.getTime() - b.nextAvailable.getTime()
  );
  const allPlatforms: Platform[] = [];

  // Initialize platforms
  for (let i = 1; i <= platformCount; i++) {
    const platform = {
      platformId: i,
      nextAvailable: new Date(2000, 0, 1, 0, 0),
      queue: [],
    };
    heap.push(platform);
    allPlatforms.push(platform);
  }

  for (const train of sortedTrains) {
    const scheduledArrival = parseTime(train.scheduledArrival);
    const scheduledDeparture = parseTime(train.scheduledDeparture);

    const platform = heap.pop();

    const isAvailable =
      platform?.nextAvailable && platform.nextAvailable <= scheduledArrival;

    const actualArrival = isAvailable
      ? scheduledArrival
      : platform?.nextAvailable;

    // Delay duration
    const delayMs = actualArrival
      ? actualArrival.getTime() - scheduledArrival.getTime()
      : 0;
    const actualDeparture = new Date(scheduledDeparture.getTime() + delayMs);

    // Store actual times in train
    const updatedTrain = {
      ...train,
      actualArrival: formatTime(actualArrival || scheduledArrival),
      actualDeparture: formatTime(actualDeparture),
    };

    platform?.queue.push(updatedTrain);
    if (platform) platform.nextAvailable = actualDeparture;

    if (platform) heap.push(platform);
  }

  // Format result
  const result: Record<number, Train[]> = {};
  for (const p of allPlatforms) {
    result[p.platformId] = p.queue;
  }

  return result;
};
