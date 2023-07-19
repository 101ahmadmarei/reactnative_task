/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';

type Todo = {
  id: number;
  title: string;
  done: boolean;
};

const initialTodo: Todo = {
  id: 0,
  title: '',
  done: false,
};

const TodoListScreen: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<Todo>(initialTodo);
  const [isDone, setIsDone] = useState<boolean>(false);

  const handleAddTodo = () => {
    if (newTodo.title.trim() === '') {
      return;
    }

    setTodos(prevTodos => [...prevTodos, newTodo]);
    setNewTodo(initialTodo);
  };

  // This function handles the click event for the todo item checkbox.
  // It updates the todo item's done field to the opposite of its current value.
  const handleToggleTodo = (id: number) => {
    const newTodos = todos.map(todo => {
      if (todo.id === id) {
        return {...todo, done: !todo.done};
      }

      return todo;
    });

    setTodos(newTodos);
    setIsDone(newTodos.some(todo => todo.done));
  };

  const handleRemoveTodos = () => {
    const incompleteTodos = todos.filter(todo => !todo.done);
    setTodos(incompleteTodos);
    setIsDone(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Todo List</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter a new todo..."
          value={newTodo.title}
          onChangeText={text =>
            setNewTodo({id: Math.random(), title: text, done: false})
          }
        />

        <TouchableOpacity style={styles.addButton} onPress={handleAddTodo}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={[
          styles.addButton,
          styles.remove,
          isDone ? {} : {backgroundColor: '#ccc'},
        ]}
        onPress={handleRemoveTodos}
        disabled={!isDone}>
        <Text style={styles.addButtonText}>Remove</Text>
      </TouchableOpacity>
      <FlatList
        data={todos}
        renderItem={({item}) => (
          <View style={styles.todoItem}>
            <CheckBox
              value={item.done}
              onValueChange={handleToggleTodo.bind(null, item.id)}
              style={styles.checkbox}
            />
            <Text style={styles.label}>{item.title}</Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    margin: 10,
    backgroundColor: 'white',
    // height: '100%',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 20,
  },
  checkbox: {
    alignSelf: 'center',
  },
  label: {
    margin: 8,
  },
  todoItem: {
    fontSize: 18,
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f9f9',
    borderRadius: 5,
    elevation: 0.5,
    flexDirection: 'row',
    // marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
    width: 200,
    marginVertical: 10,
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  remove: {
    backgroundColor: '#ff0000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default TodoListScreen;
