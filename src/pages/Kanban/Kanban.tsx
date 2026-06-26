import React, { useState, useEffect } from 'react';
import { useAppDispatch } from '../../store';
import { addNotification } from '../../store/slices/uiSlice';
import Modal from '../../components/UI/Modal';
import { 
  FiPlus, 
  FiTrash2, 
  FiCalendar, 
  FiChevronLeft, 
  FiChevronRight, 
  FiCheckSquare,
  FiBookOpen,
  FiLoader,
  FiCheckCircle
} from 'react-icons/fi';
import './Kanban.scss';

interface Task {
  id: string;
  title: string;
  column: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'Low' | 'Medium' | 'High';
  date: string;
}

const COLUMNS = [
  { id: 'todo', label: 'To Do', icon: <FiBookOpen style={{ color: 'var(--color-accent-blue)' }} /> },
  { id: 'in_progress', label: 'In Progress', icon: <FiLoader style={{ color: 'var(--color-warning)' }} /> },
  { id: 'review', label: 'In Review', icon: <FiCalendar style={{ color: 'var(--color-info)' }} /> },
  { id: 'done', label: 'Completed', icon: <FiCheckCircle style={{ color: 'var(--color-success)' }} /> }
] as const;

const INITIAL_TASKS: Task[] = [
  { id: 't-1', title: 'Implement global Redux authentication slice', column: 'done', priority: 'High', date: '2026-06-25' },
  { id: 't-2', title: 'Configure client routing with ProtectedRoute templates', column: 'done', priority: 'Medium', date: '2026-06-25' },
  { id: 't-3', title: 'Integrate React Query caching and invalidation mutations', column: 'in_progress', priority: 'High', date: '2026-06-26' },
  { id: 't-4', title: 'Add dynamic dark/light CSS variables style adaptions', column: 'todo', priority: 'Low', date: '2026-06-27' },
  { id: 't-5', title: 'Complete Kanban board with drag-and-drop support', column: 'in_progress', priority: 'Medium', date: '2026-06-26' }
];

const Kanban: React.FC = () => {
  const dispatch = useAppDispatch();
  
  // Load tasks from storage
  const [tasks, setTasks] = useState<Task[]>(() => {
    const stored = localStorage.getItem('admin_tasks');
    return stored ? JSON.parse(stored) : INITIAL_TASKS;
  });

  // Track which column is currently being dragged over
  const [draggedOverColumn, setDraggedOverColumn] = useState<string | null>(null);

  // Form states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Low');
  const [column, setColumn] = useState<Task['column']>('todo');

  useEffect(() => {
    localStorage.setItem('admin_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const moveTask = (taskId: string, targetCol: Task['column']) => {
    setTasks((prev) => 
      prev.map((t) => (t.id === taskId ? { ...t, column: targetCol } : t))
    );
  };

  // Drag operations
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, colId: string) => {
    e.preventDefault();
    setDraggedOverColumn(colId);
  };

  const handleDragLeave = () => {
    setDraggedOverColumn(null);
  };

  const handleDrop = (e: React.DragEvent, colId: Task['column']) => {
    e.preventDefault();
    setDraggedOverColumn(null);
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      moveTask(taskId, colId);
      dispatch(addNotification({
        type: 'info',
        message: `Task migrated to column: ${colId.replace('_', ' ').toUpperCase()}`
      }));
    }
  };

  // Mobile arrow movement controls
  const shiftTaskColumn = (taskId: string, direction: 'left' | 'right') => {
    const cols: Task['column'][] = ['todo', 'in_progress', 'review', 'done'];
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const currIdx = cols.indexOf(task.column);
    let nextIdx = currIdx + (direction === 'right' ? 1 : -1);
    
    if (nextIdx >= 0 && nextIdx < cols.length) {
      moveTask(taskId, cols[nextIdx]);
    }
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask: Task = {
      id: `t-${Math.random().toString(36).substring(2, 9)}`,
      title: title.trim(),
      column,
      priority,
      date: new Date().toISOString().split('T')[0]
    };

    setTasks(prev => [...prev, newTask]);
    dispatch(addNotification({
      type: 'success',
      message: `New task added: "${newTask.title.substring(0, 15)}..."`
    }));
    setIsAddOpen(false);
    setTitle('');
  };

  const handleDeleteTask = (id: string, taskTitle: string) => {
    if (window.confirm(`Delete task "${taskTitle}"?`)) {
      setTasks(prev => prev.filter(t => t.id !== id));
      dispatch(addNotification({
        type: 'warning',
        message: 'Task removed from Kanban board.'
      }));
    }
  };

  return (
    <div className="kanban-page animate-fade-in">
      <div className="page-header-row">
        <div>
          <h1>Task Board (Kanban)</h1>
          <p>Organize workflow columns. Drag cards or use triggers to progress tasks.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsAddOpen(true)}>
          <FiPlus /> Create Card
        </button>
      </div>

      {/* Columns Workspace */}
      <div className="kanban-board">
        {COLUMNS.map((col) => {
          const columnTasks = tasks.filter((t) => t.column === col.id);
          const isDraggingOver = draggedOverColumn === col.id;

          return (
            <div 
              key={col.id} 
              className={`kanban-column ${isDraggingOver ? 'dragging-over' : ''}`}
              onDragOver={(e) => handleDragOver(e, col.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, col.id)}
            >
              <div className="column-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {col.icon}
                  <h3>{col.label}</h3>
                </div>
                <span className="task-count">{columnTasks.length}</span>
              </div>

              <div className="tasks-list">
                {columnTasks.length === 0 ? (
                  <div className="empty-column-placeholder">
                    Drop cards here
                  </div>
                ) : (
                  columnTasks.map((t) => (
                    <div 
                      key={t.id} 
                      className="task-card"
                      draggable
                      onDragStart={(e) => handleDragStart(e, t.id)}
                    >
                      <div className="task-card-header">
                        <span className={`priority-tag ${t.priority.toLowerCase()}`}>
                          {t.priority}
                        </span>
                        <button 
                          className="delete-task-btn" 
                          onClick={() => handleDeleteTask(t.id, t.title)}
                          aria-label="Delete task"
                        >
                          <FiTrash2 />
                        </button>
                      </div>

                      <p className="task-title">{t.title}</p>

                      <div className="task-card-footer">
                        <div className="task-date">
                          <FiCalendar />
                          <span>{t.date}</span>
                        </div>
                        
                        {/* Mobile column switch utility buttons */}
                        <div className="mobile-move-controls">
                          <button 
                            onClick={() => shiftTaskColumn(t.id, 'left')} 
                            disabled={t.column === 'todo'}
                            aria-label="Move left"
                          >
                            <FiChevronLeft />
                          </button>
                          <button 
                            onClick={() => shiftTaskColumn(t.id, 'right')} 
                            disabled={t.column === 'done'}
                            aria-label="Move right"
                          >
                            <FiChevronRight />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* --- ADD KANBAN CARD MODAL --- */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Create New Task Card"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsAddOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleAddTask}>Create Task</button>
          </>
        }
      >
        <form onSubmit={handleAddTask} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div className="form-group" style={{ marginBottom: '14px' }}>
            <label htmlFor="task-title-input">Task Title *</label>
            <div className="input-wrapper">
              <FiCheckSquare />
              <input
                id="task-title-input"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Design Settings layouts"
                required
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <div className="form-group" style={{ flex: 1, marginBottom: '0' }}>
              <label htmlFor="task-priority">Task Priority</label>
              <div className="input-wrapper">
                <select 
                  id="task-priority" 
                  value={priority} 
                  onChange={(e) => setPriority(e.target.value as any)}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>

            <div className="form-group" style={{ flex: 1, marginBottom: '0' }}>
              <label htmlFor="task-col">Board Column</label>
              <div className="input-wrapper">
                <select 
                  id="task-col" 
                  value={column} 
                  onChange={(e) => setColumn(e.target.value as any)}
                >
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="review">In Review</option>
                  <option value="done">Completed</option>
                </select>
              </div>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Kanban;
