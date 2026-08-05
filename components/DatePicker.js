'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

const DatePicker = ({ value, onChange, disabled, className, placeholder = "Date" }) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`justify-start text-left font-normal ${!value && "text-muted-foreground"} ${className || ""}`}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(new Date(value), "MMM d") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 shadow-xl" align="start">
        <Calendar
          mode="single"
          selected={value ? new Date(value) : undefined}
          onSelect={(date) => {
            onChange(date ? format(date, "yyyy-MM-dd") : "");
            // Optionally close on select, but keeping it open lets them change their mind
          }}
          initialFocus
          className="rounded-lg border-none"
        />
        <div className="flex justify-between items-center p-3 pt-0 mt-2">
           {value ? (
             <Button
               variant="ghost"
               size="icon"
               className="hover:bg-destructive/10 text-destructive hover:text-destructive"
               onClick={() => {
                 onChange("");
                 setOpen(false);
               }}
             >
               <Trash2 className="h-4 w-4" />
             </Button>
           ) : <div />}
           <Button
             variant="default"
             size="sm"
             onClick={() => setOpen(false)}
           >
             OK
           </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
