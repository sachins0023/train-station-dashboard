import type { TrainCSV } from "@/types";
import { Input } from "./ui/input";
import { TABLE_KEY_HEADERS_MAP } from "@/constants";

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

      const trainData = data
        .map((train) =>
          Object.entries(TABLE_KEY_HEADERS_MAP).reduce((acc, [key, value]) => {
            acc[key] = train[value];

            return acc;
          }, {} as Record<string, string>)
        )
        .filter((train) => !!train.trainNumber);

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
