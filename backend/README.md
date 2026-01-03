## Render Project – Emulate Markdown

For our project page, we want to be able to render Markdown.

We know we should render Markdown server-side because client-side Markdown rendering is difficult to implement and can produce inconsistent results.

Our `render_projects.py` script will render our JSON content containing Markdown into HTML.

Eventually, we’ll rework this code into our serverless functions.


## Render Items with Frontmatter 
Both my Projects and blog posts rely on markdown.
It would probably be better to collect markdown files with frontmatter and turn those into json objects
Matbe everything contained within a directory for data 

e.g: `/projects/:handle.markdown`
e.g: `/blog/:date/:handle.markdown`


### Taks runner with invoke

I am using the task runner invoke and refactor the render_projects into render_items so it can render the project and the blog

````sh
invoke --list
invoke render-blog
invoke render-projects
````
