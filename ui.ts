import { serve } from 'https://deno.land/std@0.79.0/http/server.ts'
import { expandGlobSync } from 'https://deno.land/std@0.79.0/fs/mod.ts'
import { basename } from 'https://deno.land/std@0.79.0/path/mod.ts'
import { render } from './mustache/mod.ts'

const server = serve({ hostname: "0.0.0.0", port: 8080 });
console.log(`HTTP webserver running. Access it at: http://localhost:8080/`);

const home_template = Deno.readTextFile('./view/home.mustache');

for await (const request of server) {
	const start = new Date().getMilliseconds()
	
	const git_dirs = expandGlobSync('/home/daniel/Documents/*')
	const view: {files: {name: string, clone_url: string}[]} = {
		files: function(){
			const list: {name: string, clone_url: string}[] = []
			for(const file of git_dirs){
				if(file.isDirectory){
					list.push({ name: basename(file.path), clone_url: `git clone ssh://git@190405.xyz:22000/~/${basename(file.path)}`})
				}
			}
			return list
		}()
	}
	const rendered = render(await home_template, view)

	const time = new Date().getMilliseconds() - start
	console.log(`Took ${time} ms to render page!`)
	
	request.respond({ status: 200, body: rendered });
}
