import { useState, useEffect } from 'react';

export default function TaskBoard({ onLogout }) {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Design Login Page',
      description: 'Create beautiful login UI with remember me',
      priority: 'high',
      dueDate: '2026-02-28',
      tags: ['ui', 'design'],
      column: 'todo',
      createdAt: '2026-02-16'
    },
    {
      id: 2,
      title: 'Develop Task Form',
      priority: 'medium',
      dueDate: '2026-02-25',
      tags: ['form'],
      column: 'todo',
      createdAt: '2026-02-16'
    }
  ]);

  const [activityLog, setActivityLog] = useState([
    ' Welcome to TaskBoard Pro!',
    'Board loaded with sample tasks'
  ]);

  useEffect(() => {
    const saved = localStorage.getItem('taskboard_tasks');
    if (saved) {
      setTasks(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('taskboard_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (taskData) => {
    const newTask = {
      ...taskData,
      id: Date.now(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    setTasks([...tasks, newTask]);
    setActivityLog([`➕ "${newTask.title}" created`, ...activityLog.slice(0, 9)]);
  };

  const deleteTask = (id) => {
    const task = tasks.find(t => t.id === id);
    setTasks(tasks.filter(t => t.id !== id));
    setActivityLog([`🗑️ "${task.title}" deleted`, ...activityLog.slice(0, 9)]);
  };

  const columns = [
    { id: 'todo', name: 'TODO', color: '#3b82f6' },
    { id: 'doing', name: 'DOING', color: '#f59e0b' },
    { id: 'done', name: 'DONE', color: '#10b981' }
  ];

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%)',
      padding: '20px',
      fontFamily: 'system-ui, sans-serif'
    }}>
      {/* Header */}
      <div style={{ 
        background: 'white', padding: '20px', borderRadius: '16px', 
        marginBottom: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        position: 'sticky', top: 0, zIndex: 100
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1e293b' }}>
              TaskBoard Pro 
            </h1>
            <p style={{ color: '#64748b' }}>Frontend Internship Assignment</p>
          </div>
          <button onClick={onLogout} style={{
            padding: '12px 24px', background: '#ef4444', color: 'white',
            border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer'
          }}>
            Logout
          </button>
        </div>
      </div>

      {}
      {}

      <div style={{ textAlign: 'center', marginTop: '40px', color: '#64748b' }}>
         Full login with Remember Me implemented! 
        <br/>Refresh browser to test persistence.
      </div>
    </div>
  );
}
