import Dexie, { Table } from 'dexie';

export interface Item {
  id?: number;
  name: string;
}

export interface TodoList {
  id?: number;
  title: string;
}

export interface TodoItem {
  id?: number;
  todoListId: number;
  title: string;
  done?: boolean;
}

export class AppDB extends Dexie {
  todoItems!: Table<TodoItem, number>;
  todoLists!: Table<TodoList, number>;

  constructor(name: string) {
    const st = new Date().getTime();

    console.log('start creating DB', name);

    super('test' + name);

    this.version(1).stores({
      todoLists: '++id',
      todoItems: '++id, todoListId',
    });

    this.on('ready', () =>
      console.log('ready ' + name, new Date().getTime() - st)
    );
  }
}
