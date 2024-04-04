import * as React from "react";
import { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

interface TimeInputProps {
  label: string;
  value: Dayjs | null;
  onChange: (newValue: Dayjs | null) => void;
  disabled: boolean;
}

const TimeInput: React.FC<TimeInputProps> = ({ label, value, onChange, disabled }) => {
  const handleTimeChange = (newValue: Dayjs | null) => {
    onChange(newValue);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <TimePicker
        label={label}
        value={value}
        onChange={handleTimeChange}
        
        ampm={false}
        disabled={disabled}
        sx={{
          "& .MuiInputLabel-root": {
            display: "none", //hide label 'เวลา' of default style mui
          },
          
          "& .MuiOutlinedInput-root": {
            borderRadius: "9999px",
            height: "52px",
            width: "80%",
            maxWidth: "80%",
            fontSize: "1.15rem",
            fontWeight: 600,
            textAlign: "center",
            "& fieldset": {
              borderColor: "#E0E3E7"
            },
            "&:not(:hover) fieldset": {
              borderColor: "#E0E3E7",
            },
            "&:hover fieldset": {
              transition: "none",
              borderColor: "#E0E3E7",
            },
            "&:focus fieldset": {
              outline: "none", 
              borderColor: "#E0E3E7",
            },
            
          },
        }}
      />
    </LocalizationProvider>
  );
};

export default TimeInput;
