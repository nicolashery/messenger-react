var _ = window._;

var store = {};

store._items = [];

store.resetItems = function(items) {
  store._items = items;
  return items;
};

store.getItems = function() {
  return store._items;
};

store.addItem = function(item) {
  store._items.push(item);
  return item;
};

module.exports = store;
