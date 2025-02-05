'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Clock } from 'lucide-react';



const TimePickerDemo = ({ value, onChange, width }) => {
    const [hours, setHours] = useState(() => {
      if (!value) return 12;
      const time = new Date(`1970-01-01T${value}`);
      return time.getHours() % 12 || 12;
    });
  
    const [minutes, setMinutes] = useState(() => {
      if (!value) return 0;
      return new Date(`1970-01-01T${value}`).getMinutes();
    });
  
    const [period, setPeriod] = useState(() => {
      if (!value) return 'AM';
      return new Date(`1970-01-01T${value}`).getHours() >= 12 ? 'PM' : 'AM';
    });
  
    const [view, setView] = useState('hours'); // 'hours' or 'minutes'
  
    useEffect(() => {
      const formattedHours = period === 'PM' && hours !== 12
        ? hours + 12
        : (period === 'AM' && hours === 12 ? 0 : hours);
      const timeString = `${formattedHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      onChange(timeString);
    }, [hours, minutes, period]);
  
    const renderClockFace = () => {
      if (view === 'hours') {
        const numbers = [];
        const radius = 80;
        const centerX = 100;
        const centerY = 100;
  
        for (let i = 1; i <= 12; i++) {
          const angle = (i * 30 - 90) * (Math.PI / 180);
          const x = centerX + radius * Math.cos(angle);
          const y = centerY + radius * Math.sin(angle);
  
          numbers.push(
            <button
              key={i}
              className={`absolute w-8 h-8 rounded-full flex items-center justify-center 
                ${hours === i ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}
              style={{
                left: `${x - 16}px`,
                top: `${y - 16}px`,
              }}
              onClick={() => {
                setHours(i);
                setView('minutes');
              }}
            >
              {i}
            </button>
          );
        }
        return numbers;
      } else {
        const markers = [];
        const radius = 80;
        const centerX = 100;
        const centerY = 100;
  
        for (let i = 0; i < 12; i++) {
          const minuteValue = i * 5;
          const angle = (i * 30 - 90) * (Math.PI / 180);
          const x = centerX + radius * Math.cos(angle);
          const y = centerY + radius * Math.sin(angle);
  
          markers.push(
            <button
              key={i}
              className={`absolute w-8 h-8 rounded-full flex items-center justify-center
                ${minutes === minuteValue ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}
              style={{
                left: `${x - 16}px`,
                top: `${y - 16}px`,
              }}
              onClick={() => setMinutes(minuteValue)}
            >
              {minuteValue.toString().padStart(2, '0')}
            </button>
          );
        }
        return markers;
      }
    };
  
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className={`w-${width} justify-start text-left font-normal`}>
            <Clock className="mr-1 h-4 w-4" />
            {value ?
              new Date(`1970-01-01T${value}`).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
              })
              :
              <span>Pick time</span>
            }
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[280px] p-0">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => setView('hours')}
                className={`text-2xl font-semibold ${view === 'hours' ? 'text-primary' : 'text-muted-foreground'}`}
              >
                {hours.toString().padStart(2, '0')}
              </button>
              <span className="text-2xl font-semibold">:</span>
              <button
                onClick={() => setView('minutes')}
                className={`text-2xl font-semibold ${view === 'minutes' ? 'text-primary' : 'text-muted-foreground'}`}
              >
                {minutes.toString().padStart(2, '0')}
              </button>
              <div className="space-x-2 ml-4">
                <Button
                  variant={period === 'AM' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPeriod('AM')}
                >
                  AM
                </Button>
                <Button
                  variant={period === 'PM' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPeriod('PM')}
                >
                  PM
                </Button>
              </div>
            </div>
            <div className="relative w-[200px] h-[200px]">
              {renderClockFace()}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    );
  };

  export default TimePickerDemo;
  