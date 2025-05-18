import type { Status as StatusType, Train } from "@/types";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { TABLE_HEADERS_KEY_MAP, TRAIN_TABLE_HEADERS } from "@/constants";
import { cn } from "@/lib/utils";
import { isLate } from "@/utils";
import Status from "./Status";

const StyledTableCell = ({
  train,
  header,
}: {
  train: Train;
  header: string;
}) => {
  const key = TABLE_HEADERS_KEY_MAP[
    header as keyof typeof TABLE_HEADERS_KEY_MAP
  ] as keyof Train;
  const value = train[key] || "N/A";
  const isArrivingLate = isLate(train.scheduledArrival, train.actualArrival);
  const isDepartingLate = isLate(
    train.scheduledDeparture,
    train.actualDeparture
  );
  const arrivalColor =
    key === "actualArrival"
      ? isArrivingLate
        ? "bg-red-50"
        : "bg-green-50"
      : "";
  const departureColor =
    key === "actualDeparture"
      ? isDepartingLate
        ? "bg-red-50"
        : "bg-green-50"
      : "";
  return (
    <TableCell
      className={cn("text-center border", arrivalColor, departureColor)}
    >
      {key === "status" ? (
        <Status
          status={value as StatusType}
          isLate={isArrivingLate || isDepartingLate}
        />
      ) : (
        value
      )}
    </TableCell>
  );
};

const EmptyTrainList = () => {
  return (
    <TableRow>
      <TableCell colSpan={TRAIN_TABLE_HEADERS.length} className="h-24 border">
        <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
          No trains
        </div>
      </TableCell>
    </TableRow>
  );
};

const TrainTable = ({ trains }: { trains: Train[] }) => {
  return (
    <Table>
      <TableHeader>
        <TableHead className="text-center border w-10">S.No</TableHead>
        {TRAIN_TABLE_HEADERS.map((header) => (
          <TableHead key={header} className="text-center border">
            {header}
          </TableHead>
        ))}
      </TableHeader>
      <TableBody className="w-full h-full">
        {trains.length ? (
          trains.map((train, index) => (
            <TableRow key={train.trainNumber}>
              <TableCell className="text-center border w-10">
                {index + 1}
              </TableCell>
              {TRAIN_TABLE_HEADERS.map((header) => (
                <StyledTableCell key={header} header={header} train={train} />
              ))}
            </TableRow>
          ))
        ) : (
          <EmptyTrainList />
        )}
      </TableBody>
    </Table>
  );
};

export default TrainTable;
