let prompt = "";

document.addEventListener('DOMContentLoaded', function () {
  const target = document.getElementById('ai-content')
  document.getElementById('input-form').addEventListener('submit', function (event) {
    event.preventDefault()
    const formData = new FormData(event.target)
    const query = formData.get('query')
    prompt = query;
    fetchChunked(target)
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
  console.log(text);
  target.innerHTML = `<img src=${text} />`;
  return;

}
