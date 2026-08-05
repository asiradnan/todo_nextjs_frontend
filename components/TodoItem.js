'use client';

import React, { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import TimePickerDemo from '@/components/TimePicker.js';
import DatePicker from '@/components/DatePicker.js';

const TodoItem = ({ todo, onToggle, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(todo.name);
  const [editedDate, setEditedDate] = useState(todo.date ? format(new Date(todo.date), "yyyy-MM-dd") : null);
  const [editedTime, setEditedTime] = useState(todo.time != null ? (() => {
    const h = Math.floor(todo.time / 3600000);
    const m = Math.floor((todo.time % 3600000) / 60000);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  })() : null);

  const handleSave = () => {
    let dateMs = null;
    let timeMs = null;

    if (editedDate) {
      const d = new Date(editedDate);
      d.setHours(0, 0, 0, 0);
      dateMs = d.getTime();
    }

    if (editedTime) {
      const [h, m] = editedTime.split(':');
      timeMs = parseInt(h, 10) * 3600000 + parseInt(m, 10) * 60000;
    }

    onEdit(todo.uuid, {
      name: editedName,
      date: dateMs,
      time: timeMs
    });
    setIsEditing(false);
  };


  return (
    <Popover open={isEditing} onOpenChange={setIsEditing}>
      <PopoverTrigger asChild>
        <div className={`flex items-center justify-between p-2 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer`}>
          <div className="flex items-center gap-3 w-full">
            <Checkbox
              checked={todo.completed}
              onCheckedChange={(checked) => {
                onToggle(todo, checked);
                setIsEditing(false);
              }}
              onClick={(e) => e.stopPropagation()}
              className="h-4 w-4"
            />
            <div className="flex justify-between items-center w-full">
              <span className={todo.completed ? 'line-through text-muted-foreground' : ''}>
                {todo.name}
              </span>
              <span className="text-sm text-muted-foreground text-right">
                {(() => {
                  if (todo.date != null && todo.time != null) {
                    const d = new Date(todo.date);
                    const h = Math.floor(todo.time / 3600000);
                    const m = Math.floor((todo.time % 3600000) / 60000);
                    const timeDate = new Date(1970, 0, 1, h, m);
                    return (
                      <span>
                        {d.toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        }) + " at " +
                          timeDate.toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true
                          })}
                      </span>
                    );
                  } else if (todo.date != null) {
                    return (
                      <span>
                        {new Date(todo.date).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    );
                  } else if (todo.time != null) {
                    const h = Math.floor(todo.time / 3600000);
                    const m = Math.floor((todo.time % 3600000) / 60000);
                    const timeDate = new Date(1970, 0, 1, h, m);
                    return timeDate.toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true
                    });
                  }
                  return '';
                })()}
              </span>

            </div>
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-5 shadow-lg rounded-xl">
        <div className="space-y-5">
          <div className="space-y-3">
            <h3 className="font-medium text-sm">Edit Task</h3>
            <Input
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              placeholder="Task name"
              className="transition-all focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="flex gap-3">
            <DatePicker
              value={editedDate}
              onChange={setEditedDate}
              className="w-[50%] hover:border-primary/50 transition-colors"
              placeholder="Pick date"
            />
            <TimePickerDemo
              value={editedTime}
              onChange={setEditedTime}
              width={"[50%]"}
              className="w-[50%]"
            />
          </div>
          <div className="flex justify-between pt-2 border-t">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                onDelete(todo.uuid);
                setIsEditing(false);
              }}
              className="hover:opacity-90 transition-opacity"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
            <div className="space-x-3">

              <Button
                size="sm"
                onClick={handleSave}
                disabled={!editedName}
                className="hover:opacity-90 transition-opacity"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>

    </Popover>
  );
};

export default TodoItem;