/* eslint-disable prettier/prettier */
import axios from 'axios';

type Todo = {
  id: number;
  title: string;
  done: boolean;
  desc: string;
};

// This function fetches todos from Firebase and transforms the data
// to ensure that each todo has an "id" property.
export const fetchTodos = async () => {
  const response = await axios.get(
    'https://app19-7-default-rtdb.firebaseio.com/todos.json',
  );

  const data = response.data;

  const todos = Object.keys(data).map(key => ({
    ...data[key],
    id: key,
  }));

  return todos;
};

// addTodo() takes a newTodo object and sends it to the backend to be stored in the database.
// The user can then see the newTodo in the frontend.
export const addTodo = async (newTodo: Todo) => {
  const response = await axios.post(
    'https://app19-7-default-rtdb.firebaseio.com/todos.json',
    newTodo,
  );
  return response.data;
};

// Delete a todo item
export const deleteTodo = async (id: string) => {
  const response = await axios.delete(
    `https://app19-7-default-rtdb.firebaseio.com/todos/${id}.json`,
  );
  return response.data;
};

// This function updates todos
export const updateTodos = async (updatedTodo: Todo) => {
  const response = await axios.put(
    `https://app19-7-default-rtdb.firebaseio.com/todos/${updatedTodo.id}.json`,
    updatedTodo,
  );
  return response.data;
};
