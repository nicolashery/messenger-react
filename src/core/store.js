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
  if (!item.id) {
    item.id = store._newItemId();
  }
  store._items.push(item);
  return item;
};

store._newItemId = function() {
  var lastItem = _.last(store._items);
  var newId;
  if (lastItem) {
    return (parseInt(lastItem.id, 10) + 1).toString();
  }
  return '1';
};

module.exports = store;
