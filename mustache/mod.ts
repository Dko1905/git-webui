import mustache from './mustache.mjs';

export function render(body: string, model: Object) {
	return mustache.render(body, model);
}
