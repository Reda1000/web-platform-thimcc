let usersView = { search: '', groups: [], data: [], loading: false, timestamp: new Date() };

const convertDate = (date) =>
  new Date(date).toISOString().split('T')[0].split('-').join('');

const download = (from, to, title, details, place) => {
  const temp = document.createElement('a');
  temp.download = title.replaceAll(' ', '_') + '.ics';
  temp.href = window.URL.createObjectURL(new File(
[`BEGIN:VCALENDAR
CALSCALE:GREGORIAN
METHOD:PUBLISH
PRODID:-//Test Cal//EN
VERSION:2.0
BEGIN:VEVENT
UID:test-1
DTSTAMP;VALUE=DATE:${convertDate(Date.now())}
DTSTART;VALUE=DATE:${convertDate(from)}
DTEND;VALUE=DATE:${convertDate(to)}
SUMMARY:${title}
DESCRIPTION:${details}
LOCATION:${place}
END:VEVENT
END:VCALENDAR`], { type: 'text/plain' }));
  temp.click();
};

const formatterUsers = () => {
  document.querySelector('#users div.content').innerHTML = usersView.data
    .filter((_) => !usersView.search || JSON.stringify(_).toLowerCase().includes(usersView.search))
    .map((_) => `
<div style="position: relative; background:url(${_.img}) no-repeat top center; background-size:cover; flex:1 0 11%; height:250px; margin:0.5rem; min-width:260px; padding:0.5rem;">
  <b style="background: #1D71B9; padding: 0.1rem; display: inline-block; margin: 0 0.0 0.2rem 0;">${_.name}</b><br />
  ${_.title
    .filter((_) => !!_)
    .map((_) => `<span style="background-color:#1d71b9; padding: 0.1rem; display: inline-block; margin: 0 0.2rem 0.2rem 0;">${_}</span>`)
    .join('')}
  <a href="mailto:${_.mail}?subject=Anfrage - BTV-Webseite" style="background: #1D71B9; position: absolute; bottom: 0.5rem; right: 0.5rem; color: white; text-decoration: none; display: block-inline; padding: 0.5rem">${_.mail}</a>
</div>`)
    .join('') + 
  ['', '', '', '', '']
    .map(() => '<div style="flex: 1 0 11%; margin: 0 0.5rem; padding: 0 0.5rem; min-width: 250px"></div>' )
    .join('');
};

setTimeout(() => {
  users.addCB((users) => { usersView = {...usersView, ...users}; formatterUsers(); });

  // Popup-Content
  users.addPopupCB('clubView', (id, target, pane) => {
    pane.innerHTML = `
<div style='position: relative; display: flex; flex-direction: column; flex: 1'><a href='#' role='button' id='close' style='text-decoration: none; color: white; position: absolute; right: 0;margin: 0.5rem; background: #1D71B9; border: none; padding: 0.5rem 1rem; font-size: 1.5rem; font-weight: bold;'>X</a>${users.data[id].geolocation ? 
  `<iframe width="100%" style="flex: 1" frameborder="0" scrolling="no" src="https://www.openstreetmap.org/export/embed.html?bbox=${users.data[id].geolocation.split(':')[1]}%2C${users.data[id].geolocation.split(':')[id]}%2C11.067352294921875%2C50.31181759082695&amp;layer=mapnik"></iframe>`: 
  ''
}<dl style='margin: 0.5rem'>
  <dt style='float: left;'>BTV-ID:</dt><dd>&nbsp;${users.data[id].number}</dd>
  <dt style='float: left;'>Verein:</dt><dd>&nbsp;${users.data[id].name}</dd>
  <dt style='float: left;'>Webseite:</dt><dd>&nbsp;<a href='${users.data[id].website}'>${users.data[id].website}</a></dd>
</dl>
<ul style='margin: 0.5rem; padding: 0; list-style: none; display: flex; flex-wrap: wrap;'>${users.data[id].cert1 ? 
  `<li><a style='padding: 1rem; padding-top: 0; display: flex; flex-direction: column' href='${users.certs['cert1'].proof(users.data[id])}'><img style='height: 3.5rem; width: 3.5rem;' src='${users.certs['cert1'].img}'>${users.certs['cert1'].name}</a></li>` : 
  ''
}</ul></div>`;
    pane.querySelector('#close').setAttribute('onClick', `removeRouterParam('popup'); return false`)
  });

  // Popup-Main
  document.querySelector('#users div.control').innerHTML = `
  <span></span><div style='display: flex;'>${Object.keys(usersView.data.reduce((st, it) => {st[it.group]=true; return st}, {}))
    .map(_ => `<button style='margin-right: 0.5rem; background: ${usersView.groups.indexOf(_)!==-1 ? '#1D71B9' : 'white'}; color: ${usersView.groups.indexOf(_)!==-1 ? 'white' : 'black'}; border: 3px solid #1D71B9; padding: 0.5rem'>${_}</button>`).join('')
  }<input placeholder='Suche' type='text'
    style='display: flex;flex-wrap: wrap;padding: 0.5rem;border: none;border-bottom: 3px solid #1d71b9;outline: none;width: auto;'
  /></div>`;
  document
    .querySelector('#users div.control input')
    .addEventListener('keyup', (e) => {
      setRouterParam('search', e.target.value.toLowerCase());
      usersView.search = e.target.value.toLowerCase();
      formatterUsers();
    });
}, 100);
