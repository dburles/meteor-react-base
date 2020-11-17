import { readCache } from 'react/unstable-cache';

// Reference: https://github.com/facebook/react/blob/master/packages/react-fetch/src/ReactFetchBrowser.js

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

const getResource = (key, resource) => {
  const { resources } = readCache();
  console.log(resources);
  let entry = resources.get(key);
  if (!entry) {
    const thenable = resource();
    console.log('new resource');
    entry = createEntry(thenable);
    resources.set(key, entry);
  }
  return {
    value: readEntry(entry),
    invalidate() {
      resources.delete(key);
    },
  };
};

export default getResource;
