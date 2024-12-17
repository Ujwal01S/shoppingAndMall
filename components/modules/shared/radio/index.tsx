import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface TimeRadioProps {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}

const TimeRadio = ({ setValue, value }: TimeRadioProps) => {
  return (
    <div className="flex gap-10">
      <RadioGroup
        defaultValue="everyDay"
        className="flex"
        value={value}
        onValueChange={setValue}
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="everyDay" id="r1" className="text-blue-700" />
          <Label htmlFor="r1">Every Day</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem
            value="manualTiming"
            id="r2"
            className="text-blue-700"
          />
          <Label htmlFor="r2">Manual Timing</Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default TimeRadio;
