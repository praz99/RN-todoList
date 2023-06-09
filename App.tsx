import React, {useCallback, useEffect, useState} from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';

import ToDoItemComponent from './components/to-do-item';
import {ToDoItem} from './models';
import {
  createTable,
  deleteTodoItem,
  getDBConnection,
  getTodoItems,
  saveTodoItems,
} from './utils/db-services';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [todos, setTodos] = useState<ToDoItem[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const loadDataCallback = useCallback(async () => {
    try {
      const db = await getDBConnection();
      await createTable(db);
      const storedTodoItems = await getTodoItems(db);
      if (storedTodoItems.length > 0) {
        setTodos(storedTodoItems);
      }
    } catch (error) {
      console.error('error');
    }
  }, []);

  useEffect(() => {
    loadDataCallback();
  }, [loadDataCallback]);

  const addTodo = async () => {
    if (!newTodo.trim()) {
      return;
    }

    try {
      const newTodos = [
        ...todos,
        {
          id: todos.length
            ? todos.reduce((acc, cur) => {
                if (cur.id > acc.id) {
                  return cur;
                }
                return acc;
              }).id + 1
            : 0,
          value: newTodo,
        },
      ];
      setTodos(newTodos);
      const db = await getDBConnection();
      await saveTodoItems(db, newTodos);
      setNewTodo('');
    } catch (error) {
      console.error(error);
    }
  };

  const deleteItem = async (id: number) => {
    try {
      const db = await getDBConnection();
      await deleteTodoItem(db, id);
      const newTodos = todos.filter(item => item.id !== id);
      setTodos(newTodos);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={[styles.appTitleView]}>
          <Text style={styles.appTitleView}>ToDo Application</Text>
        </View>
        <View>
          {todos.length ? (
            todos.map(todo => (
              <ToDoItemComponent
                key={todo.id}
                todo={todo}
                deleteItem={deleteItem}
              />
            ))
          ) : (
            <Text>
              Nothing to do yet. Add some new tasks and make them done when
              finished...
            </Text>
          )}
        </View>
        <View style={styles.textInputContainer}>
          <TextInput
            placeholder="Enter a task to do..."
            value={newTodo}
            onChangeText={text => setNewTodo(text)}
          />
          <Button
            onPress={addTodo}
            title="Add Todo"
            color="#841584"
            accessibilityLabel="add todo item"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  appTitleView: {
    marginTop: 20,
    justifyContent: 'center',
    flexDirection: 'row',
  },

  appTitleText: {
    fontSize: 24,
    fontWeight: '800',
  },

  textInputContainer: {
    marginTop: 30,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 1,
    justifyContent: 'flex-end',
  },
});

export default App;
