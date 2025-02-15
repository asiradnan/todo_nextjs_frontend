'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Clock, Trash2 } from 'lucide-react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimeClock } from '@mui/x-date-pickers/TimeClock';
import dayjs from 'dayjs';

const TimePickerDemo = ({ value, onChange, width }) => {
  const [open, setOpen] = useState(false);
  const [period, setPeriod] = useState(() => {
    if (!value) return 'AM';
    return dayjs(`1970-01-01T${value}`).format('A');
  });

  const getTimeValue = () => {
    if (!value) return null;
    return dayjs(`1970-01-01T${value}`);
  };

  const handleTimeChange = (newValue) => {
    if (!newValue) {
      onChange(null);
      return;
    }
    // Adjust time based on AM/PM selection
    let hours = newValue.hour();
    if (period === 'PM' && hours < 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    newValue = newValue.hour(hours);
    const timeString = newValue.format('HH:mm');
    onChange(timeString);
  };

  const togglePeriod = () => {
    const newPeriod = period === 'AM' ? 'PM' : 'AM';
    setPeriod(newPeriod);
    if (value) {
      const currentTime = dayjs(`1970-01-01T${value}`);
      let hours = currentTime.hour();
      if (newPeriod === 'PM' && hours < 12) hours += 12;
      if (newPeriod === 'AM' && hours >= 12) hours -= 12;
      const newTime = currentTime.hour(hours);
      onChange(newTime.format('HH:mm'));
    }
  };

  const handleClearTime = () => {
    onChange(null);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`w-${width} justify-start text-left font-normal`}
        >
          <Clock className="mr-1 h-4 w-4" />
          {value ?
            dayjs(`1970-01-01T${value}`).format('hh:mm A') :
            <span className='text-muted-foreground'>Pick time</span>
          }
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0">
        <div className="p-0">
          {/* AM/PM Toggle Buttons */}
          <div className="flex justify-end p-2 gap-1">
            <Button
              variant={period === 'AM' ? "default" : "outline"}
              size="sm"
              onClick={() => period === 'PM' && togglePeriod()}
              className="w-12"
            >
              AM
            </Button>
            <Button
              variant={period === 'PM' ? "default" : "outline"}
              size="sm"
              onClick={() => period === 'AM' && togglePeriod()}
              className="w-12"
            >
              PM
            </Button>
          </div>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimeClock
              value={getTimeValue()}
              onChange={handleTimeChange}
              ampm
              className="mx-auto"
              sx={{
                width: 240,
                '& .MuiClockPointer-root': {
                  backgroundColor: 'hsl(var(--primary))',
                },
                '& .MuiClockPointer-thumb': {
                  backgroundColor: 'hsl(var(--primary))',
                  borderColor: 'hsl(var(--primary))'
                },
                '& .MuiClockNumber-root.Mui-selected': {
                  backgroundColor: 'hsl(var(--primary))',
                  color: 'hsl(var(--primary-foreground))'
                },
                '& .MuiClock-pin': {
                  backgroundColor: 'hsl(var(--primary))'
                },
                '& .MuiClock-clock': {
                  backgroundColor: 'hsl(var(--background))'
                },
                '& .MuiClockNumber-root': {
                  color: 'hsl(var(--foreground))'
                }
              }}
            />
          </LocalizationProvider>
          <div className='flex justify-between h-10 m-3 mt-0'>
            {value && (
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-destructive/10"
                onClick={handleClearTime}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            )}
            <Button
              variant="default"
              size="sm"
              onClick={() => setOpen(false)}
              className="ml-auto"
            >
              OK
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default TimePickerDemo;