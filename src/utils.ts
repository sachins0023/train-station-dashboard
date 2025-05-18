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

export const parseTime = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return new Date(2000, 0, 1, h, m);
};

export const assignTrainsWithMinHeap = (
  trains: Train[],
  platformCount: number
): Record<number, Train[]> => {
  const priorityMap = { P1: 1, P2: 2, P3: 3 };

  const formatTime = (date: Date) => date.toTimeString().slice(0, 5); // returns "HH:MM"

  const sortedTrains = [...trains]
    .map((train, index) => ({ train, index }))
    .sort((a, b) => {
      const pa = priorityMap[a.train.priority];
      const pb = priorityMap[b.train.priority];
      if (pa !== pb) return pa - pb;
      return a.index - b.index;
    })
    .map(({ train }) => train);

  const heap = new MinHeap<Platform>(
    (a, b) => a.nextAvailable.getTime() - b.nextAvailable.getTime()
  );
  const allPlatforms: Platform[] = [];

  // Initialize platforms
  for (let i = 1; i <= platformCount; i++) {
    const platform: Platform = {
      platformId: i.toString(),
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
  const result: Record<string, Train[]> = {};
  for (const p of allPlatforms) {
    result[p.platformId] = p.queue;
  }

  return result;
};

export const isLate = (scheduled: string, actual: string): boolean => {
  // Convert HH:MM to minutes since midnight for easier comparison
  const [scheduledHours, scheduledMinutes] = scheduled.split(":").map(Number);
  const [actualHours, actualMinutes] = actual.split(":").map(Number);

  const scheduledTotalMinutes = scheduledHours * 60 + scheduledMinutes;
  const actualTotalMinutes = actualHours * 60 + actualMinutes;

  const diff = actualTotalMinutes - scheduledTotalMinutes; // Changed order of subtraction
  return diff > 0;
};

export const differenceInMinutes = (date1: Date, date2: Date): number => {
  return Math.round((date2.getTime() - date1.getTime()) / 60000);
};
