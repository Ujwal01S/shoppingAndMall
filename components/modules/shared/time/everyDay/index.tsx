import { useState } from "react";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";

const EveryDayTimeComponent = () => {
  const [openTime, setOpenTime] = useState<string | null>("");

  const [closeTime, setCloseTime] = useState<string | null>("");

  console.log(openTime);
  console.log(closeTime);

  const handleOpenTime = (value: string | null) => {
    setOpenTime(value);
  };

  const handleCloseTime = (value: string | null) => {
    setCloseTime(value);
  };
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
