import type { Train } from "@/types";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { TRAIN_TABLE_HEADERS } from "@/constants";

const StyledTableCell = ({ children }: { children: React.ReactNode }) => {
  return <TableCell className="text-center">{children}</TableCell>;
};

const EmptyTrainList = () => {
  return (
    <TableRow>
      <TableCell colSpan={TRAIN_TABLE_HEADERS.length} className="h-24">
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
        {TRAIN_TABLE_HEADERS.map((header) => (
          <TableHead key={header}>{header}</TableHead>
        ))}
      </TableHeader>
      <TableBody className="w-full h-full">
        {trains.length ? (
          trains.map((train) => (
            <TableRow key={train.trainNumber}>
              <StyledTableCell>{train.trainNumber}</StyledTableCell>
              <StyledTableCell>{train.scheduledArrival}</StyledTableCell>
              <StyledTableCell>{train.actualArrival}</StyledTableCell>
              <StyledTableCell>{train.scheduledDeparture}</StyledTableCell>
              <StyledTableCell>{train.actualDeparture}</StyledTableCell>
              <StyledTableCell>{train.platformId}</StyledTableCell>
              <StyledTableCell>{train.status}</StyledTableCell>
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
