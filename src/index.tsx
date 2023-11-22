import { Hono } from 'hono'
import { renderer } from './renderer'
import { Ai } from '@cloudflare/ai'
import script from '../assets/script.js'

type Bindings = {
  AI: any
}

type Answer = {
  response: string
}

type Message = {
  content: string
  role: string
}

const app = new Hono<{ Bindings: Bindings }>()

app.get('/script.js', (c) => {
  return c.body(script, 200, {
    'Content-Type': 'text/javascript'
  })
})

app.get('*', renderer)

app.get('/', (c) => {
  return c.render(
    <>
      <h2>What should the coloring book page be of?</h2>
      <form id="input-form" autocomplete="off" method="post">
        <input
          type="text"
          name="query"
          style={{
            width: '89%'
          }}
        />
        <button type="submit">Create</button>
      </form>
      <h2>Page</h2>
      <pre
        id="ai-content"
        style={{
          'white-space': 'pre-wrap'
        }}
      ></pre>
    </>
  )
})

app.post('/ai', async (c) => {
  // Get prompt from request
  const json = await c.req.json();
  const prompt = json.prompt;

  // Make request to Workers AI
  const ai = new Ai(c.env.AI)
  const image: Uint8Array = await ai.run('@cf/stabilityai/stable-diffusion-xl-base-1.0', {
    prompt: "A black and white coloring book page of " + prompt
  })

  // Convert response to base64
  const binaryString = new Uint8Array(image).reduce((acc, byte) => acc + String.fromCharCode(byte), '');
  const base64Image = btoa(binaryString);

  // Send base64 string in our response so we can embed it in our webpage
  return c.render("data:image/png;base64,"+base64Image);
})

export default app
