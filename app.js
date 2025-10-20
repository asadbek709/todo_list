const KEY = 'my_todos_v1';
const newTodoInput = document.getElementById('newTodo');
const addBtn = document.getElementById('addBtn');
const todoListEl = document.getElementById('todoList');
const counterEl = document.getElementById('counter');
const clearAllBtn = document.getElementById('clearAll');

let todos = [];

function save() {
  localStorage.setItem(KEY, JSON.stringify(todos));
}

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    todos = raw ? JSON.parse(raw) : [];
  } catch (e) {
    todos = [];
  }
}

function render() {
  todoListEl.innerHTML = '';
  if (todos.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'empty';
    empty.textContent = 'No todos yet — add one above!';
    todoListEl.appendChild(empty);
  } else {
    todos.forEach(todo => {
      const li = document.createElement('li');
      li.className = 'todo-item' + (todo.done ? ' done' : '');

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = !!todo.done;
      checkbox.addEventListener('change', () => toggleDone(todo.id));

      const span = document.createElement('div');
      span.className = 'text';
      span.textContent = todo.text;

      const del = document.createElement('button');
      del.className = 'delete';
      del.textContent = '🗑';
      del.addEventListener('click', () => removeTodo(todo.id));

      li.appendChild(checkbox);
      li.appendChild(span);
      li.appendChild(del);
      todoListEl.appendChild(li);
    });
  }
  updateCounter();
}

function updateCounter() {
  const pending = todos.filter(t => !t.done).length;
  counterEl.textContent = `You have ${pending} pending tasks`;
}

function addTodo(text) {
  const trimmed = text.trim();
  if (!trimmed) return;
  const todo = { id: Date.now().toString(), text: trimmed, done: false };
  todos.unshift(todo);
  save();
  render();
}

function removeTodo(id) {
  todos = todos.filter(t => t.id !== id);
  save();
  render();
}

function toggleDone(id) {
  todos = todos.map(t => t.id === id ? { ...t, done: !t.done } : t);
  save();
  render();
}

function clearAll() {
  if (!confirm('Clear all todos?')) return;
  todos = [];
  save();
  render();
}

addBtn.addEventListener('click', () => {
  addTodo(newTodoInput.value);
  newTodoInput.value = '';
  newTodoInput.focus();
});

newTodoInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    addTodo(newTodoInput.value);
    newTodoInput.value = '';
  }
});

clearAllBtn.addEventListener('click', clearAll);

load();
render();
