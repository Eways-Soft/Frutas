

console.log(nDate);

function date(x, y) {	
	const nDate = new Date().toLocaleString('en-US', {
	  timeZone: 'Asia/Calcutta'
	});
}

function time(x, y) {
  return x - y;
}

module.exports = { date, time };