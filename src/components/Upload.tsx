import type { TrainCSV } from "@/types";
import { Input } from "./ui/input";

const Upload = ({ onUpload }: { onUpload: (data: TrainCSV[]) => void }) => {
  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      const text = event.target?.result as string;
      const [headerLine, ...lines] = text.split("\n");
      const headers = headerLine.trim().split(",");

      const data = lines.map((line) => {
        const values = line.trim().split(",");
        return headers.reduce((obj, header, i) => {
          obj[header.trim()] = values[i]?.trim();
          return obj;
        }, {} as Record<string, string>);
      });

      const trainData = data.map((train) => ({
        trainNumber: train["Train Number"],
        scheduledArrival: train["Arrival Time"],
        scheduledDeparture: train["Departure Time"],
        priority: train["Priority"],
      }));

      onUpload(trainData as unknown as TrainCSV[]);
    };

    reader.readAsText(file);
  };
  return (
    <Input
      type="file"
      accept=".csv"
      onChange={handleCSVUpload}
      className=" focus-visible:ring-0"
    />
  );
};

export default Upload;
