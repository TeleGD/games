(async () => {
	const title = document.querySelector("main > h1");
	let firstGame = document.querySelector("main > section");
	const format = new Intl.DateTimeFormat("fr", {
		"year":"numeric",
		"month":"long",
		"day":"numeric",
		"timeZone":"UTC",
	});
	const response = await fetch("./index.json");
	const json = await response.json();
	for (const game of json) {
		if (game.priority !== 1 && game.priority !== 2) {
			continue;
		}
		const section = document.createElement("section");
		section.id = game.repository;
		if (game.priority === 2) {
			section.classList.add("featured");
		}
		const heading = document.createElement("h2");
		const link = document.createElement("a");
		link.href = `//github.com/TeleGD/${game.repository}`;
		link.textContent = game.title;
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
		image.loading = "lazy";
		image.src = `//raw.githubusercontent.com/TeleGD/${game.repository}/master/screenshot.png`;
		image.addEventListener("load", () => {
			image.width = image.naturalWidth;
			image.height = image.naturalHeight;
			image.alt = ""; // TODO
		});
		image.addEventListener("error", () => {
			image.alt = "Aucun aperçu disponible";
		});
		picture.append(image);
		figure.append(picture);
		section.append(heading, paragraph, figure);
		if (game.released) {
			switch (game.engine) {
				case "GameMaker Studio": {
					const paragraph = document.createElement("p");
					const link = document.createElement("a");
					link.href = `//github.com/TeleGD/${game.repository}/releases/latest/download/${game.repository}.exe`;
					link.download = `${game.repository}.exe`;
					link.textContent = "Pour Windows";
					paragraph.append(link);
					section.append(paragraph);
					break;
				}
				case "Noyo": {
					const paragraph = document.createElement("p");
					const link = document.createElement("a");
					link.href = `//telegd.github.io/${game.repository}/`;
					link.textContent = "En ligne";
					paragraph.append(link);
					section.append(paragraph);
					break;
				}
				case "Slick2D": {
					const assets = [
						["x86", "Pour x86 (Linux, Mac et Windows)"],
						["arm", "Pour ARM (Linux)"],
					];
					for (const asset of assets) {
						const paragraph = document.createElement("p");
						const link = document.createElement("a");
						link.href = `//github.com/TeleGD/${game.repository}/releases/latest/download/${game.repository}-${asset[0]}.zip`;
						link.download = `${game.repository}-${asset[0]}.zip`;
						link.textContent = asset[1];
						paragraph.append(link);
						section.append(paragraph);
					}
					break;
				}
				case "Unity": {
					const paragraph = document.createElement("p");
					const link = document.createElement("a");
					link.href = `//telegd.github.io/${game.repository}/`;
					link.textContent = "En ligne";
					paragraph.append(link);
					section.append(paragraph);
					break;
				}
			}
		}
		if (game.priority === 2) {
			title.after(section);
			continue;
		}
		firstGame.before(section);
		firstGame = section;
	}
	const target = () => {
		const id = location.hash.slice(1);
		let element = null;
		if (id !== "") {
			element = document.querySelector(`main > section#${CSS.escape(id)} > h2 > a:not([download])`);
		}
		if (element === null) {
			element = document.querySelector("main > section > h2 > a:not([download])");
		}
		element.focus();
		element.scrollIntoView({
			"block": "center",
		});
	};
	target();
	window.addEventListener("hashchange", (event) => {
		target();
	});
}) ();
