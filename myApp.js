// See also:
// https://shortexts.com
// https://quickwords.co

const path = require('path');
const {promisify} = require('util');
const {globalShortcut, ipcMain} = require('electron');
const {exec} = require('child_process');
const {menubar} = require('menubar');

// HACK(riley): Actually check...
// I can't get the visibility API working as expected,
// so for now I'm just setting it manually here. This
// is fragile and not a smart idea.
let hidden = true;

const type = output => {
	const fns = output
		.split('\n').flatMap((line, i) => {
			const keystrokes = `echo "tell application \\"System Events\\" to keystroke \\"${line}\\"" | osascript`;
			return i ? [
				`echo "tell application \\"System Events\\" to key code 36" | osascript`,
				keystrokes,
			] : keystrokes;
		})
		.map(str => promisify((_, cb) => exec(str, {}, cb)))
		.reduce((chain, fn) => chain.then(fn), Promise.resolve());
};
const mb = menubar({
	windowPosition: 'center',
	browserWindow: {
		useContentSize: true,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
		},
	},
	frame: false,
	backgroundColor: '#333',
	showDockIcon: false,
});
ipcMain.on('devtools', (event, open) => {
	mb.window.webContents.openDevTools();
});
ipcMain.on('log', (event, ...output) => {
	console.log(...output);
});
ipcMain.on('resize', (event, w, h) => {
	mb.window.setSize(w, h);
	mb.positioner.move('center');
});
ipcMain.on('print', (event, output) => {
	mb.window.setSize(400, 80);
	mb.app.hide();
	if (output) type(output);
	hidden = true;
});
ipcMain.on('hide', (event) => {
	mb.app.hide();
	hidden = true;
});
mb.on('ready', () => {
	globalShortcut.register('CommandOrControl+Shift+Space', () => {
		hidden ? mb.showWindow() : mb.hideWindow();
		hidden = !hidden;
	});
});
mb.on('will-quit', () => {
	globalShortcut.unregisterAll()
});
