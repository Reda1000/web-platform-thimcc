var currentHash = window.location.hash;

var _wr = (type) => { var orig = history[type]; 
  return function(...arguments) {
    var e = new Event(type);
    currentHash='#'+(arguments[2].split('#')[1] || '')
    e.arguments = arguments;
    window.dispatchEvent(e);
    return orig.apply(this, arguments);
  };
};
history.pushState = _wr('pushState');
history.replaceState = _wr('replaceState');

let _routes = (key, value) => {
  const res = (currentHash.split('#')[1] || '')
    .split('?')
    .reduce((st, it, i) => {
      if (!i) st['main'] = it;
      else
        it.split('&')
          .map((_) => _.split('='))
          .forEach(([k, v]) => (st[k] = v));
      return st;
    }, {});
  if(key) res[key] = value;
  return res;
};

let setRouterParam = (key, value) => {
  const url = Object.entries(_routes(key, value))
    .filter(([k, v]) => k !== 'main')
    .reduce((st, it, i) => `${st}${!i ? '?' : '&'}${it[0]}=${it[1]}`, '');
  history.replaceState(null, null, `#${_routes.main || ''}${url}`);
};
let removeRouterParam = (key) => {
  const url = Object.entries(_routes())
    .filter(([k, v]) => k !== 'main' && k!==key)
    .reduce((st, it, i) => `${st}${!i ? '?' : '&'}${it[0]}=${it[1]}`, '');
  history.replaceState(null, null, `#${_routes.main || ''}${url}`);
};
let getRouterParam = (name) => _routes()[name];
