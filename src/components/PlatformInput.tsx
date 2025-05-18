import { Input } from "./ui/input";

const PlatformInput = ({
  value,
  updateValue,
}: {
  value: string;
  updateValue: (value: string) => void;
}) => {
  const handlePlatformCountChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;

    // Allow empty input
    if (value === "") {
      updateValue("");
      return;
    }

    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const numValue = parseInt(value);
    // Only validate and set if there's a value
    if (numValue >= 2 && numValue <= 20) {
      updateValue(value);
    } else if (numValue < 2) {
      updateValue("2");
    } else if (numValue > 20) {
      updateValue("20");
    }
  };
  return (
    <Input
      type="number"
      min={2}
      max={20}
      value={value}
      onChange={handlePlatformCountChange}
      className=" focus-visible:ring-0"
      placeholder="2-20"
    />
  );
};

export default PlatformInput;
