import type { Train } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { isLate } from "@/utils";
import Status from "./Status";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { useTrainContext } from "@/context/TrainContext";
import { differenceInMinutes, parseTime } from "@/utils";

const TrainSideView = ({
  trainNumber,
  isLate,
}: {
  trainNumber: string;
  isLate: boolean;
}) => {
  return (
    <div className="flex flex-col">
      <div className="flex items-center">
        <div
          className={cn(
            "rounded-md rounded-r-none px-4",
            isLate ? "bg-red-200" : "bg-blue-200"
          )}
        >
          {trainNumber}
        </div>
        <img
          src="train-side-view.svg"
          alt={trainNumber}
          className="w-10 h-10"
        />
      </div>
    </div>
  );
};

const Platform = ({
  platformId,
  trains,
}: {
  platformId: string;
  trains: Train[];
}) => {
  const { state } = useTrainContext();
  const currentTime = state?.clockTime;

  const currentTrains = trains.filter((train) => train.status === "arrived");
  const upcomingTrains = trains.filter((train) => train.status === "scheduled");

  const delayedTrains = upcomingTrains.filter((train) =>
    isLate(train.scheduledArrival, currentTime)
  );

  const currentTrainVariants = {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 50, transition: { duration: 1 } },
  };

  const delayedTrainVariants = {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, y: -50, transition: { duration: 1 } },
  };

  const allTrains = [...currentTrains, ...delayedTrains];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Platform {platformId}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <AnimatePresence mode="popLayout">
            {currentTrains.map((train) => {
              const isTrainLate = isLate(
                train.scheduledArrival,
                train.actualArrival
              );
              const remainingTime = differenceInMinutes(
                parseTime(currentTime),
                parseTime(train.actualDeparture)
              );
              return (
                <motion.div
                  key={train.trainNumber}
                  variants={currentTrainVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 1 }}
                  className="flex flex-col gap-2"
                >
                  <div className="flex items-center gap-2">
                    <TrainSideView
                      trainNumber={train.trainNumber}
                      isLate={isTrainLate}
                    />
                    <Status status={train.status} isLate={isTrainLate} />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Leaving in {remainingTime} mins
                  </p>
                </motion.div>
              );
            })}
          </AnimatePresence>
          {delayedTrains.length > 0 && (
            <p className="text-sm text-red-500 font-bold">Delayed Trains</p>
          )}
          <AnimatePresence mode="popLayout">
            {delayedTrains.map((train) => {
              const remainingTime = differenceInMinutes(
                parseTime(currentTime),
                parseTime(train.actualDeparture)
              );
              return (
                <motion.div
                  key={train.trainNumber}
                  variants={delayedTrainVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 1 }}
                  className="flex flex-col"
                >
                  <div className="flex items-center gap-2">
                    <TrainSideView trainNumber={train.trainNumber} isLate />
                    <Status status={train.status} isLate={true} />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Leaving in {remainingTime} mins
                  </p>
                </motion.div>
              );
            })}
          </AnimatePresence>
          {!allTrains.length && (
            <p className="text-sm text-muted-foreground">
              No trains on platform
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Platform;
