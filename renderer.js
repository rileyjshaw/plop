const constrain = (n, min, max) => Math.min(Math.max(n, min), max);
const textarea = document.querySelector('textarea');
const ghost = document.querySelector('.ghost');

textarea.focus();
function resize() {
	ghost.textContent = textarea.value.replace(/\n$/, '\n ');
	let {width, height} = ghost.getBoundingClientRect();
	[width, height] = [width, height].map(Math.round);
	width = constrain(width + 40, 400, 1000);
	height = constrain(height, 80, 640);
	ipcRenderer.send('resize', width, height);
};
textarea.addEventListener('change', resize);
textarea.addEventListener('input', () => setTimeout(resize));
textarea.addEventListener('keydown', (e) => {
	switch (e.key) {
		case 'Enter':
			if (e.shiftKey) return;
			try {
				const code = textarea.value;
				const result = code && eval(code);
				e.preventDefault();
				textarea.value = '';
				ipcRenderer.send('print', result);
			} catch (err) {
				ipcRenderer.send('log', err.message);
				// Flash red or something.
			}
			break;
		case 'Esc':
		case 'Escape':
			ipcRenderer.send('hide');
	};
});
resize();