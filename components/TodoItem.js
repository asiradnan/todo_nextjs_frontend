'use client'
import React, { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import TimePickerDemo from '@/components/TimePicker.js';

const TodoItem = ({ todo, onToggle, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState(todo.description);
  const [editedDueDate, setEditedDueDate] = useState(todo.due_date || null);
  const [editedDueTime, setEditedDueTime] = useState(todo.due_time || null);

  const handleSave = () => {
    onEdit(todo.id, {
      description: editedDescription,
      due_date: editedDueDate,
      due_time: editedDueTime,
      delete_date: false,
      delete_time: false
    });
    setIsEditing(false);
  };

  return (
    <Popover open={isEditing} onOpenChange={setIsEditing}>
      <PopoverTrigger asChild>
        <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
          <div className="flex items-center gap-3 w-full">
            <Checkbox
              checked={todo.completed}
              onCheckedChange={(checked) => {
                onToggle(todo.id, checked);
                setIsEditing(false);
              }}
              onClick={(e) => e.stopPropagation()}
            />
            <div className="flex justify-between items-center w-full">
              <span className={`${todo.completed ? 'line-through text-muted-foreground' : ''}`}>
                {todo.description}
              </span>
              <span className="text-sm text-muted-foreground text-right">
                {(() => {
                  if (todo.due_date && todo.due_time) {
                    return new Date(todo.due_date).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    }) + " at " +
                      new Date('1970-01-01T' + todo.due_time).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      });
                  } else if (todo.due_date) {
                    return new Date(todo.due_date).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    });
                  } else if (todo.due_time) {
                    return new Date('1970-01-01T' + todo.due_time).toLocaleTimeString('en-US', {
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
        value={editedDescription}
        onChange={(e) => setEditedDescription(e.target.value)}
        placeholder="Task description"
        className="transition-all focus:ring-2 focus:ring-primary/20"
      />
    </div>
    <div className="flex gap-3">
  <Popover>
    <PopoverTrigger asChild>
      <Button
        variant="outline"
        className={`w-[50%] justify-start text-left font-normal hover:border-primary/50 transition-colors ${!editedDueDate && "text-muted-foreground"}`}
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        {editedDueDate ? format(new Date(editedDueDate), "MMM d") : "Pick date"}
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-auto p-0 shadow-xl" align="start">
      <Calendar
        mode="single"
        selected={editedDueDate ? new Date(editedDueDate) : undefined}
        onSelect={(date) => setEditedDueDate(date ? format(date, "yyyy-MM-dd") : "")}
        initialFocus
        className="rounded-lg border-none"
      />
    </PopoverContent>
  </Popover>
  <TimePickerDemo
    value={editedDueTime}
    onChange={setEditedDueTime}
    width={"[50%]"}
    className="w-[50%]"
  />
</div>
    <div className="flex justify-between pt-2 border-t">
      <Button
        variant="destructive"
        size="sm"
        onClick={() => {
          onDelete(todo.id);
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
          disabled={!editedDescription.trim()}
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