// ==========================================
// COMPONENT: Main Application View
// Fetches data, handles form state, and communicates with backend
// ==========================================

import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Backend base URL (matches express server port)
const API_URL = 'http://localhost:5000/api/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch all tasks when the component mounts
  useEffect(() => {
    fetchTasks();
  }, []);

  // Function to get tasks from backend API
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

  // Function to handle adding a new task
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const response = await axios.post(API_URL, { title });
      // Update local state instantly with the newly returned task object
      setTasks([response.data, ...tasks]);
      setTitle(''); // Clear input field
    } catch (err) {
      console.error('Error adding task:', err);
    }
  };

  // Function to handle deleting a task
  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      // Filter out the deleted task from local state
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  return (
    <div style={styles.container}>
      <h2>MERN Task Manager</h2>

      {/* Task Creation Form */}
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

      {/* Loading state indicator */}
      {loading && <p>Loading tasks...</p>}

      {/* Task List Display */}
      <ul style={styles.list}>
        {tasks.length === 0 && !loading ? (
          <p style={styles.emptyText}>No tasks found. Add one above!</p>
        ) : (
          tasks.map((task) => (
            <li key={task._id} style={styles.listItem}>
              <span>{task.title}</span>
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

// Basic inline styling objects for clean presentation
const styles = {
  container: { maxWidth: '450px', margin: '40px auto', fontFamily: 'Arial, sans-serif', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
  form: { display: 'flex', gap: '10px', marginBottom: '20px' },
  input: { flex: 1, padding: '10px', fontSize: '14px', borderRadius: '4px', border: '1px solid #ccc' },
  addButton: { padding: '10px 15px', backgroundColor: '#007BFF', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  list: { listStyle: 'none', padding: 0, margin: 0 },
  listItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #eee' },
  deleteButton: { backgroundColor: '#dc3545', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' },
  emptyText: { color: '#666', textAlign: 'center' }
};

export default App;
