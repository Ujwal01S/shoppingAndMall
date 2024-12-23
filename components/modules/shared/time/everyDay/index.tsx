import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";

interface EveryDayTimeComponentProps {
  openTime: string | null;
  closeTime: string | null;
  handleOpenTime: (value: string | null) => void;
  handleCloseTime: (value: string | null) => void;
}

const EveryDayTimeComponent = ({
  closeTime,
  handleCloseTime,
  handleOpenTime,
  openTime,
}: EveryDayTimeComponentProps) => {
  return (
    <div className="flex gap-1 w-full">
      <div className="flex flex-col w-full">
        <label>Open Time:</label>
        <TimePicker
          className="w-1/2"
          value={openTime}
          onChange={handleOpenTime}
        />
      </div>

      <div className="flex flex-col  items-center w-full">
        <label>Close Time:</label>
        <TimePicker
          className="w-1/2"
          value={closeTime}
          onChange={handleCloseTime}
        />
      </div>
    </div>
  );
};

export default EveryDayTimeComponent;
