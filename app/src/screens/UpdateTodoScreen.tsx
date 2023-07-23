/* eslint-disable prettier/prettier */
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {RootStackParamList} from '../App';
import {updateTodos, deleteTodo} from '../lib/api';
import {
  useMutation,
  useQuery,
  fetchTodos,
  QueryClient,
  useQueryClient,
} from 'react-query';

type Props = NativeStackScreenProps<RootStackParamList, 'update'>;
type Todo = {
  id: number;
  title: string;
  done: boolean;
  desc: string;
};

const TodoDetailsScreen: React.FC<Props> = ({route, navigation}) => {
  const queryClient = useQueryClient();
  const {id, title, desc, done} = route.params;
  const [editedText, setEditedText] = useState(title);
  const [editedDescription, setEditedDescription] = useState(desc);
  const todosQuery = useQuery<Todo[]>('todos', fetchTodos);
  const deleteTodoMutation = useMutation(deleteTodo, {
    onSuccess: () => {
      queryClient.invalidateQueries('todos');
      navigation.goBack();
    },
  });
  const updateTodoMutation = useMutation(updateTodos, {
    onSuccess: () => {
      queryClient.invalidateQueries('todos');
      navigation.goBack();
    },
  });

  const handleEditTodo = () => {
    console.log(id);
    const updatedTodo = {
      id: id,
      title: editedText,
      desc: editedDescription,
      done: done,
    };
    updateTodoMutation.mutate(updatedTodo);
  };

  const handleDeleteTodo = () => {
    deleteTodoMutation.mutate('' + id);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Todo Details</Text>

      <Text style={styles.label}>Todo:</Text>
      <TextInput
        style={styles.input}
        value={editedText}
        onChangeText={text => setEditedText(text)}
      />

      <Text style={styles.label}>Description:</Text>
      <TextInput
        style={styles.input}
        value={editedDescription}
        onChangeText={text => setEditedDescription(text)}
      />
      <View style={styles.buttonGroup}>
        <TouchableOpacity style={styles.updateButton} onPress={handleEditTodo}>
          <Text style={styles.buttonText}>Update</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDeleteTodo}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  updateButton: {
    backgroundColor: '#3b5998',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
    width: '45%',
    height: 50,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: '45%',
    height: 50,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default TodoDetailsScreen;
