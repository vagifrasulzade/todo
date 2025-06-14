let todos = []
let nextId = 1

const todoForm = document.querySelector(".todo-form")
const todoInput = document.querySelector(".todo-input")
const todoList = document.querySelector(".todo-list")
const totalTasksSpan = document.querySelector(".total-tasks")
const completedTasksSpan = document.querySelector(".completed-tasks")
const clearCompleteBtn = document.querySelector(".clear-completed")
const clearAllBtn = document.querySelector(".clear-all")

function initApp() {
    // initialTasks.map(task => addTodoItem(task))
    loadTodos()
    updateStats()
}

function saveTodos() {
    localStorage.setItem("todos", JSON.stringify(todos))
}

function loadTodos() {
    const saved = localStorage.getItem("todos")
    if (saved) {
        todos = JSON.parse(saved)
        nextId = todos.length > 0 ? Math.max(...todos.map(todo => todo.id)) + 1 : 1
        renderAllTodos(true)
    }

}



function addTodoItem(text) {
    const todo = {
        id: nextId++,
        text: text,
        completed: false
    };
    todos.push(todo)
    saveTodos()

    const li = createTodoElement(todo)
    li.classList.add("fade-in")
    todoList.insertBefore(li, todoList.firstChild)
    updateStats()
}

function createTodoElement(todo) {
    const li = document.createElement("li")
    li.className = "todo-item"
    li.dataset.id = todo.id

    if (todo.completed) {
        li.classList.add("completed")
    }

    li.innerHTML = `
        <input type="checkbox" class="todo-chechbox" ${todo.completed ? "checked" : ""}>
        <span class="todo-text">${todo.text}</span>
        <button class="delete-btn">Delete</button>
    `

    const chechbox = li.querySelector(".todo-chechbox")
    const deleteBtn = li.querySelector(".delete-btn")

    chechbox.addEventListener("change", () => toggleTodoWithAnimation(todo.id))
    deleteBtn.addEventListener("click", () => deleteTodoWithAnimation(todo.id))

    return li
}

function updateStats() {
    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length

    totalTasksSpan.textContent = total
    completedTasksSpan.textContent = completed

    updateProgressRing("total-progress", total, Math.max(total, 15))
    updateProgressRing("completed-progress", completed, Math.max(total, 1))
}

function updateProgressRing(id, current, max) {
    const circle = document.getElementById(id);
    const circumference = 2 * Math.PI * 26
    const progress = max > 0 ? (current / max) * circumference : 0
    const offset = circumference - progress

    circle.style.strokeDashoffset = offset
}

function renderAllTodos(animate = false) {
    const sortedTodos = getSortedTodos()
    todoList.innerHTML = ""

    sortedTodos.map((todo, index) => {
        const li = createTodoElement(todo)

        if (animate) {
            li.style.animationDelay = `${index * 50}ms`
            li.classList.add("fade-in")
        }

        todoList.appendChild(li)
        return li
    })

    updateStats()
}

function getSortedTodos() {
    return [...todos].sort((a, b) => {
        if (a.completed === b.completed) {
            return a.id - b.id
        }
        return a.completed ? 1 : -1
    })
}

function toggleTodoWithAnimation(id) {
    const todo = todos.find(item => item.id === id)
    const todoElement = document.querySelector(`[data-id="${id}"]`)

    if (todo && todoElement) {
        todo.completed = !todo.completed
        saveTodos();

        if (todo.completed) {
            todoElement.classList.add("dropping")
            setTimeout(() => {
                todoElement.classList.remove("dropping")
                renderAllTodos(false)
            }, 800)
        } else {
            todoElement.classList.add("rising")
            setTimeout(() => {
                todoElement.classList.remove("rising")
                renderAllTodos(false)
            }, 600)
        }

        updateStats()
    }
}

function deleteTodoWithAnimation(id) {
    const todoElement = document.querySelector(`[data-id="${id}"]`)

    if (todoElement) {
        todoElement.style.animation = "fadeOut 0.3s ease-out forwards"

        setTimeout(() => {
            todos = todos.filter(item => item.id !== id)
            saveTodos()
            renderAllTodos(false)
        }, 300);
    }
}

function clearCompleted() {
    const completedElements = document.querySelector(".todo-item.completed")

    Array.from(completedElements).map((elem, index) => {
        elem.style.animation = `fadeOut 0.3s ease-out ${index * 100}mx forwards`
        return elem
    })

    setTimeout(() => {
        todos = todos.filter(todo => !todo.completed)
        saveTodos()
        renderAllTodos(true)
    }, completedElements.length * 100 + 300);
}

function clearAll() {
    const allElements = document.querySelector(".todo-item")

    Array.from(allElements).map((elem, index) => {
        elem.style.animation = `fadeOut 0.3s ease-out ${index * 100}mx forwards`
        return elem
    })

    setTimeout(() => {
        todos = []
        saveTodos()
        // todoList.innerHTML = ""
        // updateStats()
        // totalTasksSpan.textContent = 0
        // renderAllTodos(true)
    }, allElements.length * 100 + 300);
}

todoForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const text = todoInput.value.trim()

    if (text) {
        addTodoItem(text);
        todoInput.value = ""
        updateStats()
    }
})

clearCompleteBtn.addEventListener("click", clearCompleted)
clearAllBtn.addEventListener("click", clearAll)


initApp()


 