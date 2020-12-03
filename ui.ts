import { serve } from 'https://deno.land/std@0.79.0/http/server.ts'
import { render } from './mustache/mod.ts'

const server = serve({ hostname: "0.0.0.0", port: 8080 });
console.log(`HTTP webserver running.  Access it at:  http://localhost:8080/`);

const bodyContent = Deno.readTextFile('./view/home.mustache');

for await (const request of server) {
	const now1 = new Date().getMilliseconds()
	const view = {
		title: 'Joe',
		calc: () => {
			return 5
		}
	}
	const view2 = {
		price: () => {
			let all = []
			for(let i = 0; i < 1000; ++i){
				all.push(view)
			}
			return all
		}
	}

	let rendered = render(await bodyContent, view2)
	const now2 = new Date().getMilliseconds()
	request.respond({ status: 200, body: `It took ${now1 - now2} ms to render` });
	
}
