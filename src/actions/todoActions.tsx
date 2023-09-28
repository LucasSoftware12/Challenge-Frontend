
import axios from 'axios';

export interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

export const SHOW_TODOS = 'SHOW_TODOS';
export const FETCH_TODOS_SUCCESS = 'FETCH_TODOS_SUCCESS';
export const FETCH_TODOS_FAILURE = 'FETCH_TODOS_FAILURE';
export const ADD_TODO = 'ADD_TODO';
export const UPDATE_TODO = 'UPDATE_TODO';
export const DELETE_TODO = 'DELETE_TODO';

interface ShowTodosAction {
  type: 'SHOW_TODOS';
  payload: Todo[];
}

export const showTodos = (storedTodos: Todo[]): ShowTodosAction => ({
  type: 'SHOW_TODOS',
  payload: storedTodos,
});

export const fetchTodos = () => async (dispatch: any) => {
  try {
    const storedTodos: Todo[] = JSON.parse(localStorage.getItem('todos') || '[]');
    if (storedTodos.length > 0) {
      dispatch({ type: 'FETCH_TODOS_SUCCESS', payload: storedTodos });
    } else {
      const response = await axios.get<Todo[]>('http://localhost:3000/api/tasks');
      localStorage.setItem('todos', JSON.stringify(response.data));
      dispatch({ type: 'FETCH_TODOS_SUCCESS', payload: response.data });
    }
  } catch (error) {
    dispatch({ type: 'FETCH_TODOS_FAILURE', error });
  }
};

export const addTodo = (todo:Todo) => async (dispatch:any) => {
  try {
    const response = await axios.post('http://localhost:3000/api/tasks', todo);
    const newTodo = response.data;
    const storedTodos = JSON.parse(localStorage.getItem('todos') || '[]');
    storedTodos.push(newTodo);
    localStorage.setItem('todos', JSON.stringify(storedTodos));
    dispatch({
      type: ADD_TODO,
      payload: newTodo,
    });
  } catch (error) {
    console.error('Error al agregar la tarea:', error);
  }
};

export const updateTodo = (todo:Todo) => async (dispatch:any) => {
  try {
    await axios.put(`http://localhost:3000/api/tasks/${todo.id}`, todo);
    const storedTodos = JSON.parse(localStorage.getItem('todos') || '[]');
    const updatedTodos = storedTodos.map((t:Todo) =>
      t.id === todo.id ? { ...t, ...todo } : t
    );
    localStorage.setItem('todos', JSON.stringify(updatedTodos));
    dispatch({ type: UPDATE_TODO, payload: todo });
  } catch (error) {
    console.error('Error al actualizar la tarea:', error);
  }
};

export const deleteTodo = (id:number) => async (dispatch:any) => {
  try {
    await axios.delete(`http://localhost:3000/api/tasks/${id}`);
    const storedTodos = JSON.parse(localStorage.getItem('todos') || '[]');
    const updatedTodos = storedTodos.filter((todo:Todo) => todo.id !== id);
    localStorage.setItem('todos', JSON.stringify(updatedTodos));
    dispatch({ type: DELETE_TODO, payload: id });
  } catch (error) {
    console.error('Error al eliminar la tarea:', error);
  }
};
