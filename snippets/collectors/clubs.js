const config = {};
config.clubs = [
  ['2021-03-15'],
  ['40005', 'Verein 1', 'google.com', '50.2487:10.9867', 'WAHR', 'WAHR'],
  ['40006', 'Verein 2', '', '', 'FALSCH', 'WAHR'],
  ['40007', 'Verein 3', '', '', 'WAHR', 'WAHR'],
];
//EXCELSPLIT
let clubs = {
  data: config.clubs
    .filter((_, i) => i)
    .map(([number, name, website, geolocation, cert1, cert2]) => ({
      name,
      number,
      website,
      geolocation,
      cert1: cert1 === 'WAHR',
      cert2: cert2 === 'WAHR',
    })),
  certs: {
    cert1: {
      img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrAtxpeLdK0EA0LioBg-6LETLnSDsWsGUMLQ&usqp=CAU',
      thumb:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrAtxpeLdK0EA0LioBg-6LETLnSDsWsGUMLQ&usqp=CAU',
      name: 'Cert 1',
      proof: () => {
        return '';
      },
    },
    cert2: {
      url: '',
      name: 'Cert 2',
      proof: () => {
        return '';
      },
    },
  },
  loading: false,
  timestamp: new Date(config.clubs[0][0]),
  cbs: [],
  popupCbs: {},
};
clubs.addCB = (cb) => {
  clubs.cbs.push(cb);
  cb(clubs);
};
clubs.addPopupCB = (name, cb) => {
  if (!clubs.popupCbs[name]) clubs.popupCbs[name] = [];
  clubs.popupCbs[name].push(cb);
};
clubs.set = (cb) => {
  clubs = cb(clubs);
  clubs.cbs.forEach((_) => _(clubs));
};
// Use it like this:
window.addEventListener('replaceState', function () {
  console.log('11', getRouterParam('popup'));
  if (!getRouterParam('popup'))
    return (document.querySelector('div#clubs_popup').style.display = 'none');
  const [name, value] = getRouterParam('popup').split('_');
  console.log(name, value);
  document.querySelector('div#clubs_popup').style.display = 'flex';
  clubs.popupCbs[name].forEach((_) =>
    _(
      value,
      document.querySelector('div#clubs_popup'),
      document.querySelector('div#clubs_popup div')
    )
  );
});
