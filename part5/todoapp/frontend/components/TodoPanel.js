import React from 'react'
import axios from 'axios'

const TodoPanel = (params) => {
    const [todos, setTodos] = React.useState([])

    React.useEffect(() => {
        axios.get('/api/todos')
            .then(response => setTodos(response.data))
    }, [])
    
    const addTodo = async(e) => {
        e.preventDefault()
        const response = await axios.post('/api/todos', {
          text: e.target.todo.value
        })
        const data = await response.data

        if(data.error){
            console.log(`Error: ${data.error}`)
        }

        setTodos([...todos, data])
    
        e.target.todo.value = ''
      }

    const completeTodo = async(completed, id) => {
        const response = await axios.put('/api/todos', {
            todo: {
                id: id,
                completed: completed
            }
        })

        const data = await response.data

        if(data.error){
            console.log(`Error: ${data.error}`)
        }

        const newTodos = todos.map(todo => {
            if(todo.id === id){
                todo.completed = completed
            }
            return todo
        })

        setTodos(newTodos)
    }

    return (
        <div>
            <h4>Add new</h4>
            <form onSubmit={addTodo}>
                <input
                type="text"
                name="todo"
                />
                <input
                type="submit"
                value="Add Todo"
                />
            </form>
            <h4>Todos:</h4>
            <ul>
                {todos.length === 0 ? <p>no todos yet</p> :
                todos.map((todo) => (
                    <li key={todo.id}>{todo.text}
                        <input type="checkbox"
                            defaultChecked={todo.completed}
                            onChange={e => completeTodo(e.target.checked, todo.id)}
                        />
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default TodoPanel