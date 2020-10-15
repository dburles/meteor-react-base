/** @jsx jsx */
import { Button, Spinner } from '@theme-ui/components';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import React, { useState } from 'react';
import { jsx } from 'theme-ui';
import Books from '../../collections/books';

const Page = () => {
  const [count, setCount] = useState(0);

  const { books, loading } = useTracker(() => {
    const handle = Meteor.subscribe('books');
    return {
      loading: !handle.ready(),
      books: Books.find().fetch(),
    };
  });

  return (
    <React.Fragment>
      <div>
        {loading ? (
          <Spinner />
        ) : (
          <ul>
            {books.map((book) => (
              <li key={book._id}>{book.name}</li>
            ))}
          </ul>
        )}
      </div>
      <Button onClick={() => setCount(count + 1)}>Pressed {count} times</Button>
    </React.Fragment>
  );
};

export default Page;
