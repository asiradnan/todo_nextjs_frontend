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
import TimePickerDemo from '@/components/TimePicker.js';  
import { PlusCircle, LogOut, CalendarIcon, UserRound, Trash2 } from 'lucide-react';
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
  const [currentTab, setCurrentTab] = useState('active');

  const getAuthHeader = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access_token')}`
    }
  });

  const handleApiError = async (error) => {
    if (error.response?.status === 401) {
      const response = await axios.post(`${API_BASE_URL}/refresh_token`,
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

  const deleteAllCompletedTasks = async () => {
    if (actionLoading || !completedTodos.length) return;
    
    setActionLoading(true);
    try {
      axios.delete(`${API_BASE_URL}/delete_all_completed`,getAuthHeader())
      await fetchTodos();
      toast.success('All completed tasks deleted successfully');
    } catch (error) {
      handleApiError(error);
    } finally {
      setActionLoading(false);
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
      await axios.put(
        `${API_BASE_URL}/edit_task/${id}`,
        updates,
        getAuthHeader()
      );
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
    <Card className="w-full max-w-2xl mx-auto p-2 sm:p-4 pb-8">
      <div className="flex justify-between mb-2 flex-wrap gap-2">
        <Button variant="ghost" onClick={handleProfileClick} className="text-sm sm:text-base">
          Profile
          <UserRound className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
        </Button>
        <Button variant="ghost" onClick={handleLogout} className="text-sm sm:text-base">
          <LogOut className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
          Logout
        </Button>
      </div>

      <form onSubmit={addTodo} className="flex flex-col gap-2 mb-6">
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1"
            disabled={actionLoading}
            required
          />
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`flex-1 sm:w-32 justify-start text-left font-normal ${!dueDate && "text-muted-foreground"}`}
                  disabled={actionLoading}
                >
                  <CalendarIcon className="mr-1 h-4 w-4" />
                  {dueDate ? new Date(dueDate).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric'
                  }) : <span>Date</span>}
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
        onValueChange={setCurrentTab}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="active">
            Active ({activeTodos.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedTodos.length})
          </TabsTrigger>
        </TabsList>
        {currentTab === 'completed' && completedTodos.length > 0 && (
          <div className="flex justify-end items-center m-2">
          <Button 
            onClick={deleteAllCompletedTasks} 
            disabled={actionLoading || !completedTodos.length}
            variant="outline"
            className="w-full sm:w-auto text-destructive hover:bg-destructive hover:text-destructive-foreground"
          >
            <Trash2 className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            Delete All Completed Tasks
          </Button>
        </div>
        )}
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