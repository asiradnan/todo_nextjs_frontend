'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import TodoItem from '@/components/TodoItem';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DatePicker from '@/components/DatePicker.js';
import { toast } from 'sonner';
import TimePickerDemo from '@/components/TimePicker.js';
import { PlusCircle } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = 'https://tasksbackend.asiradnan.com/api/tasks/';

function getCookie(name) {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  if (match) return match[2];
  return null;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  config.headers['X-CSRFToken'] = getCookie("csrftoken");
  return config;
});

const getDueTime = (t) => {
  if (t.date != null && t.time != null) return t.date + t.time;
  if (t.date != null) return t.date;
  if (t.time != null) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today.getTime() + t.time;
  }
  return Infinity;
};

export default function TodoList() {
  const [newTodo, setNewTodo] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [isInputError, setIsInputError] = useState(false);

  useEffect(() => {
    setLoading(true)
    fetchTodos();
  }, []);

  const [showNotification, setShowNotification] = useState(false);
  const [currentNotification, setCurrentNotification] = useState(null);
  const notificationSound = useRef(typeof window !== 'undefined' ? new Audio('/notification.mp3') : null);
  // Add this function inside TodoList component
  const checkDueTasks = useCallback(() => {
    const now = new Date();
    todos.forEach(todo => {

      if (todo.completed) return;
      if (todo.date != null && todo.time != null) {
        const dueDateTimeMs = todo.date + todo.time;
        if (Math.abs(dueDateTimeMs - now.getTime()) < 1000) { // Within 1 second of due time
          notificationSound.current?.play();
          setCurrentNotification(todo);
          setShowNotification(true);
          console.log(`Notification for ${todo.name} due at ${new Date(dueDateTimeMs).toLocaleString()}`);
        }
      }
    });
  }, [todos]);

  // Add this useEffect after the existing useEffect
  useEffect(() => {
    const interval = setInterval(checkDueTasks, 1000);
    return () => clearInterval(interval);
  }, [checkDueTasks]);

  function handleError(error) {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      const currentUrl = encodeURIComponent(window.location.href);
      window.location.href = `https://accounts.asiradnan.com/users/login?next=${currentUrl}`;
    } else {
      toast.error("Failed to perform action");
    }
  }

  const fetchTodos = async () => {
    try {
      const response = await api.get();
      setTodos(response.data);
    } catch (error) {
      handleError(error)
    } finally {
      setLoading(false);
    }
  };

  const activeTodos = useMemo(() => {
    return todos
      .filter(todo => !todo.completed)
      .sort((a, b) => getDueTime(a) - getDueTime(b));
  }, [todos]);

  const completedTodos = useMemo(() => {
    return todos
      .filter(todo => todo.completed)
      .sort((a, b) => getDueTime(a) - getDueTime(b));
  }, [todos]);


  const deleteAllCompletedTasks = async () => {
    if (actionLoading || !completedTodos.length) return;

    setActionLoading(true);
    try {
      await axios.delete(`${API_BASE_URL}/delete_all_completed`, { withCredentials: true })
      fetchTodos();
      toast.success('All completed tasks deleted successfully');
    } catch (error) {
      handleError(error)
    } finally {
      setActionLoading(false);
    }
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim() || actionLoading) {
      setIsInputError(true);
      toast.warning('Please enter a task name');
      return;
    }
    setIsInputError(false);
    setActionLoading(true);
    try {

      let dateMs = null;
      let timeMs = null;

      if (dueDate) {
        const d = new Date(dueDate);
        d.setHours(0, 0, 0, 0);
        dateMs = d.getTime();
      }
      if (dueTime) {
        const [h, m] = dueTime.split(':');
        timeMs = parseInt(h, 10) * 3600000 + parseInt(m, 10) * 60000;
      }

      await api.post('', { name: newTodo, date: dateMs, time: timeMs });
      fetchTodos();
      setNewTodo('');
      setDueDate('');
      setDueTime('');
      toast.success('Task added successfully');
    } catch (error) {
      handleError(error)
    } finally {
      setActionLoading(false);
    }
  };


  const toggleTodo = async (todo, completed) => {
    setActionLoading(true);
    try {
      await api.put('', { ...todo, completed: completed });
      fetchTodos();
      toast.success('Task updated successfully');
    } catch (error) {
      handleError(error)
    } finally {
      setActionLoading(false);
    }
  };

  const deleteTodo = async (uuid) => {
    setActionLoading(true);
    try {
      await api.delete(`${uuid}/`);
      setTodos(todos.filter(todo => todo.uuid !== uuid));
      toast.success('Task deleted successfully');
    } catch (error) {
      handleError(error)
    } finally {
      setActionLoading(false);
    }
  };

  const editTodo = async (uuid, updates) => {
    setActionLoading(true);
    try {
      if (updates.date === '') {
        updates.date = null;
      }
      if (updates.time === '') {
        updates.time = null;
      }

      await api.put(`${uuid}/`, updates);
      fetchTodos();
      toast.success('Task updated successfully');
    } catch (error) {
      handleError(error)
    } finally {
      setActionLoading(false);
    }
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto p-2 sm:p-4 pb-8 sm:mt-0 mt-4">

      <form onSubmit={addTodo} className="flex flex-col gap-2 mb-6">
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            type="text"
            value={newTodo}
            onChange={(e) => {
              setIsInputError(false);
              setNewTodo(e.target.value);

            }}
            placeholder="Add a new task..."
            className={`flex-1 ${isInputError ? 'ring-red-500 ring-1' : ''}`}
            disabled={actionLoading}
          />
          <div className="flex gap-2">
            <DatePicker
              value={dueDate}
              onChange={setDueDate}
              className="flex-1 sm:w-32"
              disabled={actionLoading}
            />
            <TimePickerDemo
              value={dueTime}
              onChange={setDueTime}
              width='25'
            />
          </div>
          <Button type="submit" disabled={actionLoading} className="w-full sm:w-auto">
            <PlusCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            Add Task
          </Button>
        </div>
      </form>



      <Tabs
        defaultValue="active"
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 mb-3">
          <TabsTrigger value="active">
            Active ({activeTodos.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedTodos.length})
          </TabsTrigger>
        </TabsList>
        {
          // {currentTab === 'completed' && completedTodos.length > 0 && (
          //   <div className="flex justify-end items-center m-2">
          //     <Button
          //       onClick={deleteAllCompletedTasks}
          //       disabled={actionLoading || !completedTodos.length}
          //       variant="outline"
          //       className="w-full sm:w-auto text-destructive hover:bg-destructive hover:text-destructive-foreground"
          //     >
          //       <Trash2 className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
          //       Delete All Completed Tasks
          //     </Button>
          //   </div>
          // )}
        }
        <TabsContent value="active" className="space-y-4">
          {activeTodos.length === 0 ? (
            <p className="text-center text-muted-foreground">No active tasks</p>
          ) : (
            activeTodos.map(todo => (
              <TodoItem
                key={todo.uuid}
                todo={todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
                onEdit={editTodo}
              />
            ))
          )}
        </TabsContent>
        <TabsContent value="completed" className="space-y-4">
          {completedTodos.length === 0 ? (
            <p className="text-center text-muted-foreground">No completed tasks</p>
          ) : (
            completedTodos.map(todo => (
              <TodoItem
                key={todo.uuid}
                todo={todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
                onEdit={editTodo}
              />
            ))
          )}
        </TabsContent>
      </Tabs>
      <Dialog open={showNotification} onOpenChange={setShowNotification}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center text-xl">Task Due Now!</DialogTitle>
          </DialogHeader>
          <div className="p-6">
            <p className="text-lg text-center">{currentNotification?.name}</p>
            <div className="mt-4 flex justify-center">
              <Button onClick={() => setShowNotification(false)}>
                Dismiss
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}