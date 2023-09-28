interface ShowTodosAction {
  type: "SHOW_TODOS";
  payload: Todo[]; 
}

interface UpdateTodoListAction {
  type: "UPDATE_TODO_LIST";
  payload: Todo[];
}

interface FetchTodosSuccessAction {
  type: "FETCH_TODOS_SUCCESS";
  payload: Todo[];
}

interface AddTodoAction {
  type: "ADD_TODO";
  payload: Todo;
}

interface UpdateTodoAction {
  type: "UPDATE_TODO";
  payload: Todo;
}

interface DeleteTodoAction {
  type: "DELETE_TODO";
  payload: number; 
}

interface Todo {
  id: number;
  title:string;
  completed:boolean
}

interface TodoState {
  todos: Todo[];
}

const initialState: TodoState = {
  todos: [],
};

const todoReducer:any = (
  state: TodoState = initialState,
  action:
    | ShowTodosAction
    | UpdateTodoListAction
    | FetchTodosSuccessAction
    | AddTodoAction
    | UpdateTodoAction
    | DeleteTodoAction
): TodoState => {
  switch (action.type) {
    case "SHOW_TODOS":
    case "UPDATE_TODO_LIST":
    case "FETCH_TODOS_SUCCESS":
      return { ...state, todos: action.payload };
    case "ADD_TODO":
      return { ...state, todos: [...state.todos, action.payload] };
    case "UPDATE_TODO":
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload.id ? action.payload : todo
        ),
      };
    case "DELETE_TODO":
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== action.payload),
      };
    default:
      return state;
  }
};

export default todoReducer;