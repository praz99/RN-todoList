// methods to create table and perform CRUD operations on to-do items.

import {
  enablePromise,
  openDatabase,
  SQLiteDatabase,
} from 'react-native-sqlite-storage';
import {ToDoItem} from '../models';

const tableName = 'todoData';

enablePromise(true);

const getDBConnection = async () => {
  return openDatabase({name: 'todo-data.db', location: 'default'});
};

const createTable = async (db: SQLiteDatabase) => {
  // create table if not exists
  const query = `CREATE TABLE IF NOT EXISTS ${tableName} (
    value TEXT NOT NULL
  )`;

  await db.executeSql(query);
};

const getTodoItems = async (db: SQLiteDatabase): Promise<ToDoItem[]> => {
  try {
    const todoItems: ToDoItem[] = [];
    const results = await db.executeSql(
      `SELECT rowid as id, value FROM ${tableName}`,
    );
    results.forEach(result => {
      for (let index = 0; index < result.rows.length; index++) {
        todoItems.push(result.rows.item(index));
      }
    });
    return todoItems;
  } catch (error) {
    console.log(error);
    throw Error('Failed to get todoItems!!!');
  }
};

const saveTodoItems = async (db: SQLiteDatabase, todoItems: ToDoItem[]) => {
  const insertQuery =
    `INSERT OR REPLACE INTO ${tableName} (rowid, value) values` +
    todoItems.map(item => `(${item.id}, '${item.value}')`).join(',');
  return db.executeSql(insertQuery);
};

const deleteTodoItem = async (db: SQLiteDatabase, id: number) => {
  const deleteQuery = `DELETE FROM ${tableName} WHERE rowid = ${id}`;
  await db.executeSql(deleteQuery);
};

const deleteTable = async (db: SQLiteDatabase) => {
  const query = `DROP TABLE ${tableName}`;
  await db.executeSql(query);
};

export {
  getDBConnection,
  createTable,
  getTodoItems,
  saveTodoItems,
  deleteTodoItem,
  deleteTable,
};
