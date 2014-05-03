window.addEventListener('load', function() {
    window.FastClick.attach(document.body);
}, false);

window.app = React.renderComponent(
  window.ReactApp(), document.getElementById('app')
);
