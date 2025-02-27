export default function debounce(fn, t) {
	let timer
	return function () {
		if (timer) clearTimeout(timer)
		timer = setTimeout(function () {
			fn()
		}, t)
	}
}