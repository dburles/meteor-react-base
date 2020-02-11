import { Meteor } from 'meteor/meteor';
import Books from '../collections/books';

Meteor.startup(() => {
  if (Books.find().count() === 0) {
    Books.insert({ name: 'Book 1' });
    Books.insert({ name: 'Book 2' });
    Books.insert({ name: 'Book 3' });
  }
});

Meteor.publish('books', function() {
  return Books.find();
});
