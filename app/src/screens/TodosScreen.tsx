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
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../App';
import {useQuery, useMutation} from 'react-query';
import {useFocusEffect} from '@react-navigation/native';
import {fetchTodos, deleteTodo, addTodo, updateTodos} from '../lib/api';
import Icon from 'react-native-vector-icons/FontAwesome';

type Props = NativeStackScreenProps<RootStackParamList, 'Todos'>;

type Todo = {
  id: number;
  title: string;
  done: boolean;
  desc: string;
};

const initialTodo: Todo = {
  id: 0,
  title: '',
  done: false,
  desc: '',
};

const TodoListScreen: React.FC<Props> = ({navigation}) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<Todo>(initialTodo);
  const [isDone, setIsDone] = useState<boolean>(false);
  const todosQuery = useQuery<Todo[]>('todos', fetchTodos);

  useFocusEffect(
    React.useCallback(() => {
      // Set the todos
      setTodos(todosQuery.data!);

      // Check if any of the todos are done
      setIsDone(todosQuery.data!?.some(todo => todo.done));
    }, [todosQuery.data]),
  );

  const deleteTodoMutation = useMutation(deleteTodo, {
    onSuccess: () => {
      // After the mutation is successful, trigger the refetch of all todos
      todosQuery.refetch();
    },
  });
  const addTodoMutation = useMutation(addTodo, {
    onSuccess: () => {
      todosQuery.refetch();
    },
  });
  const updateTodoMutation = useMutation(updateTodos, {
    onSuccess: () => {
      todosQuery.refetch();
    },
  });

  const handleAddTodo = () => {
    if (newTodo.title.trim() === '') {
      return;
    }
    setNewTodo(initialTodo);
    addTodoMutation.mutate(newTodo);
  };

  // This function handles the click event for the todo item checkbox.
  const handleToggleTodo = (id: number) => {
    const newTodos = todos.map(todo => {
      if (todo.id === id) {
        return {...todo, done: !todo.done};
      }

      return todo;
    });
    updateTodoMutation.mutate(newTodos.find(todo => todo.id === id)!);

    setTodos(newTodos);
    setIsDone(newTodos.some(todo => todo.done));
  };

  const handleRemoveTodos = () => {
    const incompleteTodos = todos.filter(todo => !todo.done);
    todos.forEach(todo => {
      if (todo.done) {
        deleteTodoMutation.mutate('' + todo.id);
      }
    });
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
            setNewTodo({id: Math.random(), title: text, done: false, desc: ''})
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
            <View style={{flexDirection: 'row'}}>
              <CheckBox
                value={item.done}
                onValueChange={handleToggleTodo.bind(null, item.id)}
                style={styles.checkbox}
                tintColors={{
                  true: 'white', // Change the color for the true (checked) state
                  false: 'white', // Change the color for the false (unchecked) state
                }}
              />
              <Text style={styles.label}>{item.title}</Text>
            </View>
            <View>
              <Icon.Button
                name="edit"
                onPress={() => navigation.navigate('update', item)}
                backgroundColor="#3b5998"
                solid
              />
            </View>
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
    color: 'white',
  },
  todoItem: {
    fontSize: 18,
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#3b5998',
    borderRadius: 5,
    elevation: 0.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    backgroundColor: '#3b5998',
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
