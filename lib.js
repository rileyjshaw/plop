module.exports = {
	d3: (() => {
		const date = new Date();
		return [date.getYear(), date.getMonth() + 1, date.getDate()]
			.map(d => `${d}`.slice(0, 2).padStart(2, 0)).join('-');
	})(),
	adr: '1-2345 Fake Ave.\nBarrie, ON\nCanada\nM1N2B3',
};
