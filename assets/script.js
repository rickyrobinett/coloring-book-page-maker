let prompt = "";

document.addEventListener('DOMContentLoaded', function () {
  const target = document.getElementById('ai-content')
  const button = document.querySelector('#input-form button');

  document.getElementById('input-form').addEventListener('submit', async function (event) {
    event.preventDefault()
    button.disabled = true;
    const formData = new FormData(event.target)
    const query = formData.get('query')
    prompt = query;
    await fetchChunked(target)
    button.disabled = false;
  })
})

async function fetchChunked(target) {
  target.innerHTML = 'loading...'
  const response = await fetch('/ai', {
    method: 'post',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({ prompt })
  })

  const text = await response.text();
  target.innerHTML = `<img src=${text} />`;
  return;

}
