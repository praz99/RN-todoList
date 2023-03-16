import React from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';

import {ToDoItem} from '../../models';

interface IProps {
  todo: ToDoItem;
  deleteItem: (id: number) => Promise<void>;
}

const ToDoItemComponent = ({todo: {id, value}, deleteItem}: IProps) => {
  return (
    <View style={styles.todoContainer}>
      <View style={styles.todotTextContainer}>
        <Text style={styles.sectionTitle}>{value}</Text>
      </View>
      <Button
        onPress={() => deleteItem(id)}
        title="done"
        color="#841584"
        accessibilityLabel="add todo item"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  todoContainer: {
    marginTop: 10,
    paddingHorizontal: 24,
    backgroundColor: 'deepskyblue',
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 1,
  },
  todotTextContainer: {
    justifyContent: 'center',
    flexDirection: 'row',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '400',
  },
});

export default ToDoItemComponent;
