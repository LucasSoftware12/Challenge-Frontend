import React, { useState, useEffect } from "react"
import { GridRenderCellParams } from "@mui/x-data-grid";
import { useSelector, useDispatch } from "react-redux"
import {
  fetchTodos,
  updateTodo,
  deleteTodo,
  addTodo,
  Todo,
} from "../actions/todoActions"
import { DataGrid } from "@mui/x-data-grid"
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Checkbox,
  FormControl,
  InputLabel,
  Input,
  Grid,
} from "@mui/material"
import { CheckCircleOutline, Cancel } from "@mui/icons-material"
// import { Todo } from "../actions/todoActions";

const TodoList = () => {
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editedTitle, setEditedTitle] = useState("")
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [editedCompleted, setEditedCompleted] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const dispatch:any = useDispatch();
  // const todos = useSelector((state: { todos: Todo[] }) => state.todos);
  const todos = useSelector((state:any) => state.todos.todos);
  
  useEffect(() => {
    if (todos.length === 0) {
      dispatch(fetchTodos())
    }
  }, [dispatch, todos.length])

  const handleOpenEditDialog = (taskId:number) => {
    const taskToEdit = todos.find((task:Todo ) => task.id === taskId)
    if (taskToEdit) {
      setSelectedTaskId(taskId)
      setEditedTitle(taskToEdit.title)
      setEditedCompleted(taskToEdit.completed)
      setEditDialogOpen(true)
    }
  }

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false)
    setSelectedTaskId(null)
    setEditedTitle("")
  }

  const handleSaveEditedTask = () => {
    if (selectedTaskId !== null) {
      const editedTask = todos.find((task:Todo) => task.id === selectedTaskId)
      if (editedTask) {
        const updatedTask = {
          ...editedTask,
          title: editedTitle,
          completed: editedCompleted,
        }
        dispatch(updateTodo(updatedTask))
        handleCloseEditDialog()
      }
    }
  }

  const handleDeleteTask = (taskId:number) => {
      dispatch(deleteTodo(taskId))
  }

  const handleAddTask = () => {
    if (newTaskTitle.trim() !== "") {
      const newTask = {
        userId: 1,
        id: todos.length + 1,
        title: newTaskTitle,
        completed: false,
      }
      dispatch(addTodo(newTask))
      setNewTaskTitle("")
    }
  }

  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "title", headerName: "Titulo", width: 500 },
    {
      field: "completed",
      headerName: "Completado",
      width: 150,
      renderCell: (params:GridRenderCellParams) => (
        <div
          style={{
            textAlign: "right",
            paddingLeft: "25px",
          }}
        >
          {params.value ? (
            <CheckCircleOutline color="success" />
          ) : (
            <Cancel color="error" />
          )}
        </div>
      ),
    },
    {
      field: "actions",
      headerName: "",
      width: 150,
      renderCell: (params:GridRenderCellParams) => (
        <>
          <Button
            style={{marginRight:'10px'}}
            variant="outlined"
            color="primary"
            onClick={() => handleOpenEditDialog(params.row.id)}
          >
            Editar
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => handleDeleteTask(params.row.id)}
          >
            Borrar
          </Button>
        </>
      ),
    },
  ]

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h1>Lista de tareas</h1>
     
      <FormControl>
        <InputLabel>Nueva tarea</InputLabel>
        <Grid
          container
          style={{ marginTop: "5px", paddingTop: "5px", width: "100%" }}
        >
          <Grid item xs={8}>
            <Input
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
            />
            <Button
              style={{ marginBottom: "5px", paddingBottom: "5px" }}
              type="submit"
              variant="contained"
              color="primary"
              onClick={handleAddTask}
            >
              Agregar
            </Button>
          </Grid>
        </Grid>
      </FormControl>

      <DataGrid
        rows={todos}
        columns={columns}
        pagination
        pageSizeOptions={[5, 10, 20, 100]}
        sortModel={[
          {
            field: "id",
            sort: "desc",
          },
        ]}
      />

      <Dialog open={editDialogOpen} onClose={handleCloseEditDialog}>
        <DialogTitle>Editar tarea</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            variant="outlined"
            fullWidth
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={editedCompleted}
                onChange={(e) => setEditedCompleted(e.target.checked)}
              />
            }
            label="Completed"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleSaveEditedTask} color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default TodoList
