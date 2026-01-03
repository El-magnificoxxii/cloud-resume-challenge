## Render Project – Emulate Markdown

For our project page, we want to be able to render Markdown.

We know we should render Markdown server-side because client-side Markdown rendering is difficult to implement and can produce inconsistent results.

Our `render_projects.py` script will render our JSON content containing Markdown into HTML.

Eventually, we’ll rework this code into our serverless functions.
