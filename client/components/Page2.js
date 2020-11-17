/** @jsx jsx */

import { Button } from '@theme-ui/components';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { readCache } from 'react/unstable-cache';
import { jsx } from 'theme-ui';
import Books from '../../collections/books';
import getResource from '../lib/getResource';

const Pending = 0;
const Resolved = 1;
const Rejected = 2;

const readEntry = (entry) => {
  if (entry.status === Resolved) {
    return entry.value;
  }
  throw entry.value;
};

const createEntry = (thenable) => {
  const entry = {
    status: Pending,
    value: thenable,
  };

  thenable.then(
    (value) => {
      if (entry.status === Pending) {
        const resolvedResult = entry;
        resolvedResult.status = Resolved;
        resolvedResult.value = value;
      }
    },
    (err) => {
      if (entry.status === Pending) {
        const rejectedResult = entry;
        rejectedResult.status = Rejected;
        rejectedResult.value = err;
      }
    },
  );

  return entry;
};

const useSubscription = (options, ...args) => {
  const { name, key } =
    typeof options === 'string'
      ? { name: options, key: options }
      : { name: options.name, key: options.key };
  // const name = options.name;

  // console.log('useSubscription called', name, key);
  console.log(args);

  const { resources } = readCache();

  console.log(handle);

  let entry = resources.get(handle);

  if (!entry) {
    const handle = Meteor.subscribe(name, ...args);
    const promise = new Promise((resolve, reject) => {
      Tracker.autorun((computation) => {
        if (handle.ready()) {
          resolve();
          // computation.stop();
        }
      });
    });

    entry = createEntry(promise);
    resources.set(handle, entry);
  }

  // readEntry(entry);

  // const memoizedGetResource = useCallback(() => {
  //   console.log('x');
  //   return getResource(key, () => {
  //     return new Promise((resolve, reject) => {
  //       const handle = Meteor.subscribe(name, ...args, {
  //         onReady() {
  //           resolve(handle);
  //         },
  //         onError: reject,
  //       });
  //     });
  //   });
  // }, args);

  // const { value: handle, invalidate } = memoizedGetResource();

  // console.log(handle, invalidate);

  // useEffect(() => {
  //   if (handle.stop) {
  //     console.log(handle);
  //     handle.stop();
  //   }
  // }, args);

  // useEffect(() => {
  //   return () => {
  //     handle.stop();
  //     invalidate();
  //   };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // return handle;
};

const useQuery = (func, dependencies = []) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoizedCursor = useMemo(func, dependencies);
  // console.log(func, memoizedCursor);
  const [state, setState] = useState(memoizedCursor.fetch());

  useEffect(() => {
    console.log('useEffect');
    Tracker.autorun(() => {
      console.log('setState');
      setState(memoizedCursor.fetch());
    });
  }, [memoizedCursor]);

  return state;
};

const Page = () => {
  const [count, setCount] = useState(0);
  const [filter, setFilter] = useState('');

  // const handle = useSubscription('books');
  useSubscription('books3', filter);
  // useSubscription({ name: 'books3', key: 'books3-static' }, 'test');

  // const booksAll = useQuery(() => {
  //   return Books.find();
  // }, []);

  const booksAll = [];

  const booksFiltered = useQuery(() => {
    return Books.find({ name: filter });
  }, [filter]);

  return (
    <React.Fragment>
      <div>
        <Button onClick={() => handle.stop()}>Stop books Subscription</Button>
        <div sx={{ marginTop: 3 }}>
          <input
            type="text"
            placeholder="Filter"
            onChange={(event) => {
              console.log(event.target.value);
              setFilter(event.target.value);
            }}
          />
        </div>
        <p>All:</p>
        <ul>
          {booksAll.map((book) => (
            <li key={book._id}>{book.name}</li>
          ))}
        </ul>
        <p>Filtered:</p>
        <ul>
          {booksFiltered.map((book) => (
            <li key={book._id}>{book.name}</li>
          ))}
        </ul>
      </div>
      <Button onClick={() => setCount(count + 1)}>Pressed {count} times</Button>
    </React.Fragment>
  );
};

export default Page;
