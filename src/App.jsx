import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './components/AuthProvider';
import Login from './components/Login';

function App() {
  const { isLoggedIn, logout } = useAuth();

  if (!isLoggedIn) return <Login />;

  return <TaskBoard onLogout={logout} />;
}

function TaskBoard({ onLogout }) {
  // All state
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Design Login Page', description: 'Beautiful UI with gradients', priority: 'high', dueDate: '2026-02-28', tags: ['UI', 'Design'], column: 'todo', createdAt: new Date().toDateString() },
    { id: 2, title: 'Task Form', description: 'Add/Edit task modal', priority: 'medium', dueDate: '2026-02-25', tags: ['Form'], column: 'todo', createdAt: new Date().toDateString() },
    { id: 3, title: 'Drag & Drop', description: 'Implement column movement', priority: 'high', dueDate: '2026-02-20', tags: ['Feature'], column: 'doing', createdAt: new Date().toDateString() },
    { id: 4, title: 'Setup Project', description: 'Clean React structure', priority: 'low', dueDate: '', tags: ['Setup'], column: 'done', createdAt: new Date().toDateString() }
  ]);

  const [activityLog, setActivityLog] = useState([' Welcome to TaskBoard Pro!']);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [sortByDueDate, setSortByDueDate] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [resetConfirm, setResetConfirm] = useState(false);

  // Persistence
  useEffect(() => {
    const saved = localStorage.getItem('taskboard_data');
    if (saved) setTasks(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('taskboard_data', JSON.stringify(tasks));
  }, [tasks]);

  // Filtered & Sorted Tasks
  const filteredTasks = tasks
    .filter(task => 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterPriority === 'all' || task.priority === filterPriority)
    )
    .sort((a, b) => {
      if (!sortByDueDate) return 0;
      const dateA = a.dueDate ? new Date(a.dueDate) : new Date('9999-12-31');
      const dateB = b.dueDate ? new Date(b.dueDate) : new Date('9999-12-31');
      return dateA - dateB;
    });

  const columns = [
    { id: 'todo', name: 'TODO', color: '#3b82f6', count: filteredTasks.filter(t => t.column === 'todo').length },
    { id: 'doing', name: 'DOING', color: '#f59e0b', count: filteredTasks.filter(t => t.column === 'doing').length },
    { id: 'done', name: 'DONE', color: '#10b981', count: filteredTasks.filter(t => t.column === 'done').length }
  ];

  // Drag & Drop
  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDrop = (e, columnId) => {
    e.preventDefault();
    const taskId = parseInt(e.dataTransfer.getData('taskId'));
    const task = tasks.find(t => t.id === taskId);
    if (task && task.column !== columnId) {
      setTasks(tasks.map(t => t.id === taskId ? { ...t, column: columnId } : t));
      setActivityLog([` "${task.title}" moved to ${columnId.toUpperCase()}`, ...activityLog.slice(0, 9)]);
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  // Task Operations
  const addTask = (taskData) => {
    const newTask = { ...taskData, id: Date.now(), createdAt: new Date().toDateString() };
    setTasks([...tasks, newTask]);
    setActivityLog([`➕ "${newTask.title}" created`, ...activityLog.slice(0, 9)]);
    setShowAddModal(false);
  };

  const updateTask = (updatedTask) => {
    setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
    setActivityLog([`✏️ "${updatedTask.title}" updated`, ...activityLog.slice(0, 9)]);
    setEditingTask(null);
  };

  const deleteTask = (id) => {
    const task = tasks.find(t => t.id === id);
    setTasks(tasks.filter(t => t.id !== id));
    setActivityLog([` "${task.title}" deleted`, ...activityLog.slice(0, 9)]);
  };

  const resetBoard = () => {
    setTasks([]);
    setActivityLog([' Board reset!']);
    setResetConfirm(false);
  };

  // Task Modal Form
  const TaskModal = ({ onClose, onSave, task }) => {
    const [formData, setFormData] = useState(task || { title: '', description: '', priority: 'medium', dueDate: '', tags: '', column: 'todo' });

    const handleSubmit = () => {
      if (!formData.title.trim()) return;
      onSave({ ...formData, tags: formData.tags.split(',').map(t => t.trim()) });
    };

    return (
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
      }}>
        <div style={{
          background: 'white', padding: '32px', borderRadius: '20px', width: '100%', maxWidth: '500px',
          boxShadow: '0 25px 50px rgba(0,0,0,0.25)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{task ? 'Edit Task' : 'Add Task'}</h3>
            <button onClick={onClose} style={{ fontSize: '24px', cursor: 'pointer' }}>×</button>
          </div>
          
          <input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})}
            placeholder="Task title *" style={{ width: '100%', padding: '12px', marginBottom: '16px', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
          
          <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder="Description" style={{ width: '100%', padding: '12px', marginBottom: '16px', border: '1px solid #e2e8f0', borderRadius: '8px', height: '80px' }} />
          
          <select value={formData.priority} onChange={(e) => setFormData({...formData, priority: e.target.value})} style={{ width: '100%', padding: '12px', marginBottom: '16px', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          
          <input value={formData.dueDate} onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
            type="date" style={{ width: '100%', padding: '12px', marginBottom: '16px', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
          
          <input value={formData.tags} onChange={(e) => setFormData({...formData, tags: e.target.value})}
            placeholder="Tags (comma separated)" style={{ width: '100%', padding: '12px', marginBottom: '24px', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={onClose} style={{ flex: 1, padding: '12px', background: '#f3f4f6', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
              Cancel
            </button>
            <button onClick={handleSubmit} disabled={!formData.title.trim()} style={{
              flex: 1, padding: '12px', background: formData.title.trim() ? '#3b82f6' : '#9ca3af',
              color: 'white', border: 'none', borderRadius: '8px', cursor: formData.title.trim() ? 'pointer' : 'not-allowed'
            }}>
              {task ? 'Update' : 'Add'} Task
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%)', padding: '20px', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ background: 'white', padding: '20px', borderRadius: '16px', marginBottom: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1e293b' }}>TaskBoard Pro </h1>
            <p style={{ color: '#64748b' }}>Frontend Internship Assignment</p>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div style={{ background: '#dbeafe', color: '#1e40af', padding: '8px 16px', borderRadius: '12px', fontWeight: 'bold' }}>
              {tasks.length} tasks
            </div>
            <button onClick={() => setResetConfirm(true)} style={{ padding: '12px 20px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer' }}>
              Reset Board
            </button>
            <button onClick={onLogout} style={{ padding: '12px 24px', background: '#6b7280', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer' }}>
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ background: 'white', padding: '24px', borderRadius: '20px', marginBottom: '24px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
          <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search tasks..."
            style={{ width: '100%', padding: '12px 16px 12px 48px', border: '2px solid #e2e8f0', borderRadius: '12px' }} />
          <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>🔍</span>
        </div>
        
        <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} style={{ padding: '12px 16px', border: '2px solid #e2e8f0', borderRadius: '12px' }}>
          <option value="all">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <input type="checkbox" checked={sortByDueDate} onChange={(e) => setSortByDueDate(e.target.checked)} />
          <span style={{ fontSize: '14px' }}>Sort by Due Date</span>
        </label>
        
        <button onClick={() => setShowAddModal(true)} style={{
          padding: '12px 24px', background: '#10b981', color: 'white', border: 'none',
          borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', whiteSpace: 'nowrap'
        }}>
          ➕ Create Task
        </button>
      </div>

      {/* Columns */}
      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        {columns.map(column => (
          <div key={column.id} style={{ 
            flex: '1', minWidth: '350px', background: 'white', padding: '24px', 
            borderRadius: '20px', minHeight: '600px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
          }}
            onDrop={(e) => handleDrop(e, column.id)}
            onDragOver={handleDragOver}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '6px', height: '40px', background: column.color, borderRadius: '3px' }}></div>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>
                    {column.name}
                  </h2>
                  <span style={{ background: column.color + '20', color: column.color, padding: '4px 12px', 
                    borderRadius: '20px', fontSize: '14px', fontWeight: 'bold' }}>
                    {column.count} tasks
                  </span>
                </div>
              </div>
              <button onClick={() => setShowAddModal(true)} style={{
                padding: '12px 20px', background: column.color, color: 'white', border: 'none',
                borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer'
              }}>
                ➕ Add
              </button>
            </div>

            <div style={{ minHeight: '450px' }}>
              {filteredTasks.filter(task => task.column === column.id).map(task => (
                <div key={task.id} 
                  draggable 
                  onDragStart={(e) => handleDragStart(e, task.id)}
                  style={{
                    background: 'white', padding: '20px', borderRadius: '12px', marginBottom: '16px',
                    borderLeft: `4px solid ${column.color}`, boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    cursor: 'grab', position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1e293b', margin: '0 0 8px 0' }}>
                        {task.title}
                      </h3>
                      <div style={{
                        background: task.priority === 'high' ? '#fee2e2' : task.priority === 'medium' ? '#fef3c7' : '#d1fae5',
                        color: task.priority === 'high' ? '#dc2626' : task.priority === 'medium' ? '#d97706' : '#059669',
                        padding: '2px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', display: 'inline-block'
                      }}>
                        {task.priority.toUpperCase()}
                      </div>
                      {task.dueDate && (
                        <p style={{ margin: '8px 0 0 0', color: '#64748b', fontSize: '14px' }}>
                          📅 {task.dueDate}
                        </p>
                      )}
                    </div>
                    <div style={{ color: '#94a3b8', fontSize: '12px', minWidth: '60px', textAlign: 'right' }}>
                      {task.createdAt}
                    </div>
                  </div>
                  <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'none', border: 'none', 
                    color: '#ef4444', cursor: 'pointer', padding: '4px', borderRadius: '4px', fontSize: '18px' }}
                    onClick={() => deleteTask(task.id)}
                  >
                    🗑️
                  </div>
                  <button onClick={() => setEditingTask(task)} style={{
                    position: 'absolute', bottom: '12px', right: '12px', background: '#3b82f6', 
                    color: 'white', border: 'none', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer'
                  }}>
                    ✏️ Edit
                  </button>
                </div>
              ))}
              {filteredTasks.filter(task => task.column === column.id).length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8' }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                    {column.id === 'todo' ? '📝' : column.id === 'doing' ? '⚡' : '✅'}
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: '500' }}>No tasks</div>
                  <div style={{ fontSize: '14px' }}>Drag tasks here or create new ones</div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Activity Log */}
      <div style={{ marginTop: '24px', background: 'white', padding: '24px', borderRadius: '20px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '16px' }}> Activity Log</h3>
        <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
          {activityLog.map((log, index) => (
            <div key={index} style={{ padding: '12px', borderBottom: '1px solid #f1f5f9', fontSize: '14px', color: '#64748b' }}>
              {log}
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      {showAddModal && <TaskModal onClose={() => setShowAddModal(false)} onSave={addTask} />}
      {editingTask && <TaskModal onClose={() => setEditingTask(null)} onSave={updateTask} task={editingTask} />}
      
      {resetConfirm && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{ background: 'white', padding: '32px', borderRadius: '20px', textAlign: 'center', maxWidth: '400px' }}>
            <h3 style={{ color: '#ef4444', marginBottom: '16px' }}>Reset Board?</h3>
            <p style={{ color: '#64748b', marginBottom: '24px' }}>This will delete all tasks permanently.</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setResetConfirm(false)} style={{ flex: 1, padding: '12px', background: '#f3f4f6', border: 'none', borderRadius: '8px' }}>
                Cancel
              </button>
              <button onClick={resetBoard} style={{ flex: 1, padding: '12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px' }}>
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
