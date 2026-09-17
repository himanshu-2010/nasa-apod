import './style.css'

const API_KEY = import.meta.env.VITE_NASA_API_KEY;
const app = document.querySelector('#app');
const dateInput = document.querySelector('#datepicker');

function fetchAPOD(date = '') {
  app.innerHTML = '<p>loading...</p>';
  const url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}${date ? `&date=${date}` : ''}`;

  fetch(url)
    .then(response =>
      response.json().then(data => {
        if (!response.ok) throw new Error(data.msg || `Request failed (${response.status})`);
        return data;
      })
    )
    .then(data => {
      let mediaHtml;

      if (data.media_type === 'image') {
        mediaHtml = `
          <div id="media" class="loading">
            <div class="placeholder"></div>
          </div>
        `;
      } else if (data.url.includes('youtube')) {
        mediaHtml = `
          <div id="media" class="video">
            <iframe src="${data.url.replace('watch?v=', 'embed/')}" allowfullscreen></iframe>
          </div>
        `;
      } else {
        mediaHtml = `
          <div id="media" class="video">
            <video src="${data.url}" controls></video>
          </div>
        `;
      }

      app.innerHTML = `
        <h1>${data.title}</h1>
        ${mediaHtml}
        <p>${data.explanation}</p>
      `;

      if (data.media_type === 'image') {
        const mediaEl = document.querySelector('#media');
        const img = new Image();
        img.alt = data.title;
        img.onload = () => {
          mediaEl.classList.remove('loading');
          mediaEl.replaceChildren(img);
        };
        img.onerror = () => {
          mediaEl.classList.remove('loading');
          mediaEl.innerHTML = '<p>Image could not be loaded.</p>';
        };
        img.src = data.url;
      }
    })
    .catch(err => {
      app.innerHTML = `<p>Error: ${err.message}</p>`;
    });
}

dateInput.max = new Date().toISOString().split('T')[0];
dateInput.min = '1995-06-16';

dateInput.addEventListener('change', () => fetchAPOD(dateInput.value));

fetchAPOD();