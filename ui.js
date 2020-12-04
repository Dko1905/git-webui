const http = require('http')
const util = require('util')
const readFile = util.promisify(require('fs').readFile)

const { render } = require('mustache')

const PORT = process.env.PORT || 8080

const home_template = readFile('./view/home.mustache', { encoding: 'utf-8' })

const home_handle = async (req, res) => {
	try{
		const start = Date.now()

		const view = {
			files: [
				{ name: 'test.git', clone_url: `git clone ssh://git@190405.xyz:22000/~/${'test.git'}`}
			]
		}

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
	if(req.url == '/index.html' || req.url == '/'){
		home_handle(req, res)
	} else{
		res.writeHead(404)
		res.end()
	}
})

app.listen(PORT)
console.log(`Server now listening on http://localhost:${PORT}/`)
