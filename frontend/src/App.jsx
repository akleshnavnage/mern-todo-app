
// ==========================================
// COMPONENT: Main Application View (with Update/Toggle)
// ==========================================
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/tasks';
function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      setTasks(response.data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const response = await axios.post(API_URL, { title });
      setTasks([response.data, ...tasks]);
      setTitle('');
    } catch (err) {
      console.error('Error adding task:', err);
    }
  };

  // NEW: Function to toggle task completion status
  const handleToggleTask = async (id, currentStatus) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, {
        completed: !currentStatus
      });
      // Update task in local state
      setTasks(tasks.map((task) => (task._id === id ? response.data : task)));
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  return (
    <div style={styles.container}>
      <h2>MERN Task Manager (Full CRUD)</h2>

      <form onSubmit={handleAddTask} style={styles.form}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          style={styles.input}
        />
        <button type="submit" style={styles.addButton}>Add Task</button>
      </form>

      {loading && <p>Loading tasks...</p>}

      <ul style={styles.list}>
        {tasks.length === 0 && !loading ? (
          <p style={styles.emptyText}>No tasks found. Add one above!</p>
        ) : (
          tasks.map((task) => (
            <li key={task._id} style={styles.listItem}>
              <div style={styles.taskLeft}>
                {/* Checkbox triggers update route */}
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggleTask(task._id, task.completed)}
                  style={styles.checkbox}
                />
                <span style={{ 
                  textDecoration: task.completed ? 'line-through' : 'none',
                  color: task.completed ? '#888' : '#000'
                }}>
                  {task.title}
                </span>
              </div>
              <button 
                onClick={() => handleDeleteTask(task._id)} 
                style={styles.deleteButton}
              >
                Delete
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

const styles = {
  container: { maxWidth: '450px', margin: '40px auto', fontFamily: 'Arial, sans-serif', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
  form: { display: 'flex', gap: '10px', marginBottom: '20px' },
  input: { flex: 1, padding: '10px', fontSize: '14px', borderRadius: '4px', border: '1px solid #ccc' },
  addButton: { padding: '10px 15px', backgroundColor: '#007BFF', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  list: { listStyle: 'none', padding: 0, margin: 0 },
  listItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #eee' },
  taskLeft: { display: 'flex', alignItems: 'center', gap: '10px' },
  checkbox: { cursor: 'pointer', width: '18px', height: '18px' },
  deleteButton: { backgroundColor: '#dc3545', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' },
  emptyText: { color: '#666', textAlign: 'center' }
};

export default App;
