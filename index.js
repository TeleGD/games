(async () => {
	const title = document.querySelector("main > h1");
	let firstGame = document.querySelector("main > div");
	const format = new Intl.DateTimeFormat("fr", {
		"year":"numeric",
		"month":"long",
		"day":"numeric",
		"timeZone":"UTC",
	});
	const response = await fetch("./index.json");
	const json = await response.json();
	const {java, cs, js} = json;
	let first = true;
	for (const game of [...java, ...cs, ...js]) {
		if (game.priority !== 1 && game.priority !== 2) {
			continue;
		}
		const division = document.createElement("div");
		if (game.priority === 2) {
			division.classList.add("featured");
		}
		const heading = document.createElement("h2");
		const link = document.createElement("a");
		link.href = `//github.com/TeleGD/${game.repository}`;
		link.textContent = game.title;
		if (first == true) {
			link.setAttribute("autofocus", "");
			first = false;
		}
		heading.append(link);
		const paragraph = document.createElement("p");
		const time = document.createElement("time");
		const date = new Date(Date.parse(game.date));
		time.dateTime = date.toISOString().slice(0, 10);
		time.textContent = format.format(date);
		paragraph.append("Commencé le ", time);
		const figure = document.createElement("figure");
		const caption = document.createElement("figcaption");
		caption.textContent = `Capture d'écran du jeu ${game.title}`;
		figure.append(caption);
		const picture = document.createElement("picture");
		const image = document.createElement("img");
		image.width = 1280;
		image.height = 720;
		image.src = `//raw.githubusercontent.com/TeleGD/${game.repository}/master/screenshot.png`;
		image.addEventListener("load", () => {
			image.width = image.naturalWidth;
			image.height = image.naturalHeight;
		});
		image.addEventListener("error", () => {
			image.alt = "Aucun aperçu disponible";
		});
		image.alt = ""; // TODO
		picture.append(image);
		figure.append(picture);
		division.append(heading, paragraph, figure);
		if (game.priority === 2) {
			title.after(division);
			continue;
		}
		firstGame.before(division);
		firstGame = division;
	}
	document.querySelector("main > div > h2 > a:not([download])").focus();
}) ();
