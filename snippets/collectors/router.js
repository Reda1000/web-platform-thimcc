let _routes = (key, value) => ({
  ...(window.location.hash.split('#')[1] || '')
    .split('?')
    .reduce((st, it, i) => {
      if (!i) st['main'] = it;
      else
        it.split('&')
          .map((_) => _.split('='))
          .forEach(([k, v]) => (st[k] = v));
      return st;
    }, {}),
  [key || 'nothing']: value,
});

let setRouterParam = (key, value) => {
  const url = Object.entries(_routes(key, value))
    .filter(([k, v]) => k !== 'main')
    .reduce((st, it, i) => `${st}${!i ? '?' : '&'}${it[0]}=${it[1]}`, '');
  console.log(url);
  history.replaceState(null, null, `#${_routes.main || ''}${url}`);
  //  return (window.location.hash = `#${_routes.main || ''}${url}`);
};
let getRouterParam = (name) => _routes()[name];
