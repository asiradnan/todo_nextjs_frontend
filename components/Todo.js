'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import TodoItem from '@/components/TodoItem';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from "@/components/ui/calendar";
import { toast } from 'sonner';
import { format } from "date-fns";
import TimePickerDemo  from '@/components/TimePicker.js';  
import { PlusCircle, LogOut, CalendarIcon, UserRound } from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const API_BASE_URL = 'https://todofastapi.asiradnan.com';

export default function TodoList({ onLogout }) {
  const [newTodo, setNewTodo] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');

  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const getAuthHeader = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access_token')}`
    }
  });

  const handleApiError = async (error) => {
    if (error.response?.status === 401) {
      const response = await axios.post("https://todofastapi.asiradnan.com/refresh_token",
        { refresh_token: localStorage.getItem('refresh_token') });
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('refresh_token', response.data.refresh_token);
    }
    toast.error(error.response?.data?.detail || 'An error occurred');
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/get_tasks`, getAuthHeader());
      setTodos(response.data);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim() || actionLoading) return;

    setActionLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/add_task`,
        { description: newTodo, due_date: dueDate || null, due_time: dueTime || null },
        getAuthHeader()
      );
      fetchTodos();
      setNewTodo('');
      setDueDate('');
      setDueTime('');
      toast.success('Task added successfully');
    } catch (error) {
      handleApiError(error);
    } finally {
      setActionLoading(false);
    }
  };

  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  const toggleTodo = async (id, completed) => {
    setActionLoading(true);
    try {
      await axios.put(
        `${API_BASE_URL}/edit_task/${id}`,
        { completed },
        getAuthHeader()
      );
      setTodos(todos.map(todo =>
        todo.id === id ? { ...todo, completed } : todo
      ));
      toast.success('Task updated successfully');
    } catch (error) {
      handleApiError(error);
    } finally {
      setActionLoading(false);
    }
  };

  const deleteTodo = async (id) => {
    setActionLoading(true);
    try {
      await axios.delete(`${API_BASE_URL}/delete/${id}`, getAuthHeader());
      setTodos(todos.filter(todo => todo.id !== id));
      toast.success('Task deleted successfully');
    } catch (error) {
      handleApiError(error);
    } finally {
      setActionLoading(false);
    }
  };
  const editTodo = async (id, updates) => {
    setActionLoading(true);
    try {
      console.log(updates)
      const response = await axios.put(
        `${API_BASE_URL}/edit_task/${id}`,
        updates,
        getAuthHeader()
      );
      console.log(response.data);
      fetchTodos();
      toast.success('Task updated successfully');
    } catch (error) {
      handleApiError(error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    onLogout();
  };
  const router = useRouter();
  const handleProfileClick = () => {
    
    router.push('/profile');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto p-4 pb-8">
      <div className="flex justify-between mb-2">
  <Button variant="ghost" onClick={handleProfileClick}>
    Profile
    <UserRound className="h-5 w-5 ml-2" />
  </Button>
  <Button variant="ghost" onClick={handleLogout}>
    <LogOut className="h-5 w-5 mr-2" />
    Logout
  </Button>
</div>

      <form onSubmit={addTodo} className="flex flex-col gap-2 mb-6">
        <div className="flex gap-2">
          <Input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1"
            disabled={actionLoading}
            required
          />
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`w-32 justify-start text-left font-normal ${!dueDate && "text-muted-foreground"}`}
                disabled={actionLoading}
              >
                <CalendarIcon className="mr-1 h-4 w-4" />
                {dueDate ? new Date(dueDate).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric'
                }) : <span>Pick date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dueDate ? new Date(dueDate) : undefined}
                onSelect={(date) => setDueDate(date ? format(date, "yyyy-MM-dd") : "")}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <TimePickerDemo
            value={dueTime}
            onChange={setDueTime}
            width='25'
          />
          <Button type="submit" disabled={actionLoading}>
            <PlusCircle className="h-5 w-5 mr-2" />
            Add Task
          </Button>
        </div>
      </form>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="active">
            Active ({activeTodos.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedTodos.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="space-y-4">
          {activeTodos.length === 0 ? (
            <p className="text-center text-muted-foreground">No active tasks</p>
          ) : (
            activeTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
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
  key={todo.id}
  todo={todo}
  onToggle={toggleTodo}
  onDelete={deleteTodo}
  onEdit={editTodo}
/>
            ))
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
}