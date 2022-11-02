import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AppDB } from './db';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  output: string = '';
  initOutput: string = '';

  constructor(public httpClient: HttpClient) {}

  ngOnInit() {
    const st = new Date().getTime();

    console.log('start reading from the DB', st);

    const db = new AppDB('0');

    db.on('ready', () => {
      this.initOutput = (new Date().getTime() - st).toString();
    });

    db.transaction('r', db.todoItems, async () => {
      return await db.todoItems.get({ id: 1 });
    }).then(() => {
      console.log('done');
    });

    // const request = window.indexedDB.open('dexietest', 10);
    // request.onerror = (event) => {
    //   console.log('error', event);
    //   console.log('error complete', new Date().getTime() - st);
    // };
    // request.onsuccess = (event) => {
    //   console.log('success', event);
    //   console.log('success complete', new Date().getTime() - st);
    // };
  }

  async populateDBs() {
    const st = new Date().getTime();
    const numberOfDBs = 5;

    for (let dbIndex = 0; dbIndex < numberOfDBs; dbIndex++) {
      console.log('start populating ' + dbIndex, st);

      const db = new AppDB(dbIndex.toString());

      await this.populateDB(db, dbIndex, numberOfDBs);

      db.close();

      console.log('finished populating ' + dbIndex, st);
    }
  }

  async populateDB(db: AppDB, dbIndex: number, dbTotal: number) {
    const st = new Date().getTime();

    const numberOfChunks = 10;

    for (let i = 0; i < numberOfChunks; i++) {
      this.output =
        'populating DB: ' +
        (dbIndex + 1) +
        '/' +
        dbTotal +
        ' chunk ' +
        (i + 1) +
        '/' +
        numberOfChunks;

      console.log('populating chunk ' + (i + 1) + '/' + numberOfChunks, st);

      await db
        .transaction('rw', db.todoLists, async () => {
          const dataToPut = [];

          for (let i = 0; i < 10000; i++) {
            dataToPut.push({
              title:
                'One morning, when Gregor Samsa woke from troubled dreams, he found himself transformed in his bed into a horrible vermin. He lay on his armour-like back, and if he lifted his head a little he could see his brown belly, slightly domed and divided by arches into stiff sections. The bedding was hardly able to cover it and seemed ready to slide off any moment. His many legs, pitifully thin compared with the size of the rest of him, waved about helplessly as he looked. "Whats happened to me?" he thought. It wasnt a dream. His room, a proper human room although a little too small, lay peacefully between its four familiar walls. A collection of textile samples lay spread out on the table - Samsa was a travelling salesman - and above it there hung a picture that he had recently cut out of an illustrated magazine and housed in a nice, gilded frame. It showed a lady fitted out with a fur hat and fur boa who sat upright, raising a heavy fur muff that covered the whole of her lower arm towards the viewer. Gregor then turned to look out the window at the dull weather.',
            });
          }

          await db.todoLists.bulkPut(dataToPut);
        })
        .then(() => {
          console.log('transaction complete', new Date().getTime() - st);
        })
        .catch((error) => {
          console.log('error:', error);
        });
    }
  }
}
