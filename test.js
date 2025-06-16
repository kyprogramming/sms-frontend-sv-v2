function generateUsername(name) {
	const randomNum = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
	return `${name.toLowerCase().replace(/\s+/g, '')}${randomNum}`;
}

const userName = generateUsername('kumar');
// console.log(userName) //
