import type { Train } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { isLate } from "@/utils";
import Status from "./Status";
import { motion, AnimatePresence } from "motion/react";
import { useTrainContext } from "@/context/TrainContext";

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

  const currentTrainDepartingTime =
    currentTrains[0]?.actualDeparture || currentTrains[0]?.scheduledDeparture;

  const delayedTrains = currentTrainDepartingTime
    ? upcomingTrains.filter(
        (train) =>
          isLate(train.scheduledArrival, currentTrainDepartingTime) &&
          currentTime > train.scheduledArrival
      )
    : [];

  const trainVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
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
            {currentTrains.map((train) => (
              <motion.div
                key={train.trainNumber}
                variants={trainVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.5 }}
                className="flex items-center gap-2"
              >
                {train.trainNumber}{" "}
                <Status status={train.status} isLate={false} />
              </motion.div>
            ))}
            {delayedTrains.length > 0 && (
              <p className="text-sm text-muted-foreground">Delayed</p>
            )}
            {delayedTrains.map((train) => (
              <motion.div
                key={train.trainNumber}
                variants={trainVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.5 }}
                className="flex items-center gap-2"
              >
                {train.trainNumber}{" "}
                <Status status={train.status} isLate={true} />
              </motion.div>
            ))}
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
