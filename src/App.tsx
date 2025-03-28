import React, { useState, useEffect } from 'react';
import { Moon, Sun, Plus, Pencil, Trash2, Check, X, ChevronDown, Search } from 'lucide-react';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

type FilterType = 'all' | 'pending' | 'completed';

function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('todos');
    return saved ? JSON.parse(saved) : [];
  });
  const [newTodo, setNewTodo] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark';
  });

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  const addTodo = (text: string) => {
    if (text.trim()) {
      setTodos([...todos, { id: crypto.randomUUID(), text, completed: false }]);
    }
    setNewTodo('');
    setIsModalOpen(false);
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const editTodo = (todo: Todo) => {
    setEditingTodo(todo);
    setNewTodo(todo.text);
    setIsModalOpen(true);
  };

  const updateTodo = () => {
    if (editingTodo && newTodo.trim()) {
      setTodos(todos.map(todo =>
        todo.id === editingTodo.id ? { ...todo, text: newTodo } : todo
      ));
    }
    setEditingTodo(null);
    setNewTodo('');
    setIsModalOpen(false);
  };

  const filteredTodos = todos.filter(todo => {
    const matchesFilter = 
      filter === 'all' ? true :
      filter === 'completed' ? todo.completed :
      !todo.completed;
    
    const matchesSearch = todo.text.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  return (
    <div className={`app ${isDark ? 'dark' : ''}`}>
      <div className="container">
        <div className="todo-card">
          <div className="header">
            <h1 className="title">TODO LIST</h1>
            <button
              onClick={() => setIsDark(!isDark)}
              className="theme-toggle"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>

          <div className="controls">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <Search className="search-icon" size={20} />
            </div>

            <div className="search-container">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as FilterType)}
                className="filter-select"
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
              <ChevronDown className="select-icon" size={20} />
            </div>
          </div>

          {filteredTodos.length === 0 ? (
            <div className="empty-state">
              <img 
                src="https://images.unsplash.com/photo-1496262967815-132206202600?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80" 
                alt="Empty todo list"
                className="empty-image"
              />
              <p className="empty-text">
                No todos found. Start by adding one!
              </p>
            </div>
          ) : (
            <ul className="todo-list">
              {filteredTodos.map(todo => (
                <li key={todo.id} className="todo-item">
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className={`checkbox ${todo.completed ? 'checked' : ''}`}
                  >
                    {todo.completed && <Check size={14} className="text-white" />}
                  </button>
                  <span className={`todo-text ${todo.completed ? 'completed' : ''}`}>
                    {todo.text}
                  </span>
                  <div className="todo-actions">
                    <button
                      onClick={() => editTodo(todo)}
                      className="action-button"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="action-button"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <button
            onClick={() => {
              setEditingTodo(null);
              setNewTodo('');
              setIsModalOpen(true);
            }}
            className="add-button"
          >
            <Plus size={24} />
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2 className="modal-title">
              {editingTodo ? 'Edit Todo' : 'New Todo'}
            </h2>
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Enter your todo..."
              className="modal-input"
              autoFocus
            />
            <div className="modal-actions">
              <button
                onClick={() => setIsModalOpen(false)}
                className="modal-button cancel-button"
              >
                Cancel
              </button>
              <button
                onClick={() => editingTodo ? updateTodo() : addTodo(newTodo)}
                className="modal-button submit-button"
              >
                {editingTodo ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;