import './style.css'

const API_KEY = import.meta.env.VITE_NASA_API_KEY;

document.querySelector('#app').innerHTML = '<p>loading...</p>';

fetch(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`)
  .then(response => response.json())
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

    document.querySelector('#app').innerHTML = `
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
    document.querySelector('#app').innerHTML = `<p>Error: ${err.message}</p>`;
  });