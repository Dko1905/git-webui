const http = require('http')
const util = require('util')
const readFile = util.promisify(require('fs').readFile)
const readdir = util.promisify(require('fs').readdir)

const { render } = require('mustache')

// Constants
const PORT = process.env.PORT || 8080
const GIT_DIR = '.'
const CLONE_SSH_PREFIX = 'git clone \"ssh://git@190405.xyz:22000/~/'
// Semi-Constants
const home_template = readFile('./view/home.mustache', { encoding: 'utf-8' })

const home_handle = async (req, res) => {
	try{
		const start = Date.now()

		const view = {
			files: []
		}
		const dir = await readdir(GIT_DIR)
		dir.forEach((file) => {
			view.files.push({
				name: file, clone_ssh_url: `${CLONE_SSH_PREFIX}${file}"`
			})
		})
		const rendered = render(await home_template, view)

		res.writeHead(200)

		const time = Date.now() - start
		console.log(`Took ${time} ms to render page!`)

		res.end(rendered)
	} catch(e){
		res.writeHead(500)
		res.end(`An error occured: ${e.message}`)
		console.error(`Cought error ${e.message}`)
	}
}

const app = http.createServer(async (req, res) => {
	if((req.url == '/index.html' || req.url == '/' ) && req.method == 'GET'){
		home_handle(req, res)
	} else{
		res.writeHead(404)
		res.end()
	}
})

app.listen(PORT)
console.log(`Server now listening on http://localhost:${PORT}/`)
