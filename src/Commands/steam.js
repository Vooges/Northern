const Discord = require("discord.js");
const HtmlToText = require("html-to-text");

const axios = require("axios").default;
const fuzzysort = require("fuzzysort");
const getColors = require("get-image-colors");

const Command = require("../Structures/Command.js");

const STEAM_GETAPPLIST_ENDPOINT =
	"https://api.steampowered.com/ISteamApps/GetAppList/v2/";
const STEAM_GETAPPDETAILS_ENDPOINT =
	"https://store.steampowered.com/api/appdetails/?l=english";

let steamAppList = [];

async function fetchSteamApplist() {
	const res = await axios.get(STEAM_GETAPPLIST_ENDPOINT);
	steamAppList = res.data.applist.apps;
}

async function fetchSteamApp(appid) {
	const res = await axios.get(
		`${STEAM_GETAPPDETAILS_ENDPOINT}/&appids=${appid}`
	);
	return res.data[`${appid}`].data;
}

async function fetchDLCs(appids) {
	const names = [];

	for (const appid of appids) {
		const appDetails = await fetchSteamApp(appid);
		names.push(appDetails.name);

		// Check if the DLC's fit, dirty but it works
		if (names.join("").length > 800) {
			const overflowCount = appids.length - names.length;
			names.push(`not displaying ${overflowCount} more DLC's`);
			break;
		}
	}

	return names;
}

async function getImageBuffer(url) {
	return axios
		.get(url, {
			responseType: "arraybuffer",
		})
		.then((response) => Buffer.from(response.data, "binary"));
}

async function getImageColors(buffer, type = "image/jpeg") {
	return getColors(buffer, type);
}

function capitalizeFirstLetter(value) {
	return value.charAt(0).toUpperCase() + value.slice(1);
}

function fixHtmlString(value) {
	var text = HtmlToText.convert(value, {
		selectors: [{ selector: "br", format: "skip" }],
		wordwrap: 10000,
	})
		.split("*")
		.join("-")
		.slice(0, 1021); //fixes max string length in embed field

	if (text.length == 1021) {
		text = text.concat("...");
	}

	return text;
}

function createGameEmbed(appInfo, dlcs, color) {
	const embed = new Discord.MessageEmbed();

	var price;

	if (appInfo.is_free) {
		price = "FREE";
	} else {
		price = appInfo.price_overview
			? appInfo.price_overview.final_formatted
			: "N/A";
	}

	embed
		.setTitle(appInfo.name)
		.setColor(color)
		.setThumbnail(appInfo.header_image)
		.setDescription(fixHtmlString(appInfo.short_description))
		.addFields(
			{
				name: "Price",
				value: price,
				inline: true,
			},
			{
				name: "Type",
				value: capitalizeFirstLetter(appInfo.type),
				inline: true,
			},
			{
				name: "Required age",
				value: appInfo.required_age.toString(),
				inline: true,
			},
			{
				name: "DLC",
				//too many dlcs can crash the bot due to the character limit of 1024
				value:
					dlcs.length !== 0
						? dlcs.map((d) => `- ${d}`).join("\n")
						: "N/A",
				inline: false,
			},
			{
				name: "Supported languages",
				value: fixHtmlString(appInfo.supported_languages),
				inline: false,
			},
			{
				name: "Minimum PC requirements",
				value: fixHtmlString(appInfo.pc_requirements.minimum)
					.split("Minimum:")
					.join(""),
				inline: false,
			},
			{
				name: "Recommended PC requirements",
				value: appInfo.pc_requirements.recommended
					? fixHtmlString(appInfo.pc_requirements.recommended)
							.split("Recommended:")
							.join("")
					: "N/A",
				inline: false,
			},
			{
				name: "Genres",
				value: appInfo.genres.map((g) => g.description).join(", "),
				inline: false,
			},
			{
				name: "Platforms",
				value: Object.keys(appInfo.platforms)
					.filter((k) => appInfo.platforms[k])
					.map((k) => capitalizeFirstLetter(k))
					.join(", "),
				inline: true,
			},
			{
				name: "Release date",
				value: appInfo.release_date.coming_soon
					? "coming soon"
					: appInfo.release_date.date || "N/A",
				inline: true,
			}
		)
		.setFooter("Price can only be retrieved in euros as of now.");

	return embed;
}

function createDLCEmbed(appInfo, color) {
	

	var price;

	if (appInfo.is_free) {
		price = "FREE";
	} else {
		price = appInfo.price_overview
			? appInfo.price_overview.final_formatted
			: "N/A";
	}

	const embed = new Discord.MessageEmbed()
		.setTitle(appInfo.name)
		.setColor(color)
		.setThumbnail(appInfo.header_image)
		.setDescription(fixHtmlString(appInfo.short_description))
		.addFields(
			{
				name: "Price",
				value: price,
				inline: true,
			},
			{
				name: "Type",
				value: appInfo.type.toUpperCase(),
				inline: true,
			},
			{
				name: "Required age",
				value: appInfo.required_age.toString(),
				inline: true,
			},
			{
				name: "Full game",
				value: appInfo.fullgame.name,
				inline: false,
			},
			{
				name: "Supported languages",
				value: fixHtmlString(appInfo.supported_languages),
				inline: false,
			},
			{
				name: "Minimum PC requirements",
				value: fixHtmlString(appInfo.pc_requirements.minimum)
					.split("Minimum:")
					.join(""),
				inline: false,
			},
			{
				name: "Recommended PC requirements",
				value: appInfo.pc_requirements.recommended
					? fixHtmlString(appInfo.pc_requirements.recommended)
							.split("Recommended:")
							.join("")
					: "N/A",
				inline: false,
			},
			{
				name: "Genres",
				value: appInfo.genres.map((g) => g.description).join(", "),
				inline: false,
			},
			{
				name: "Platforms",
				value: Object.keys(appInfo.platforms)
					.filter((k) => appInfo.platforms[k])
					.map((k) => capitalizeFirstLetter(k))
					.join(", "),
				inline: true,
			},
			{
				name: "Release date",
				value: appInfo.release_date.coming_soon
					? "coming soon"
					: appInfo.release_date.date || "N/A",
				inline: true,
			}
		)
		.setFooter("Price can only be retrieved in euros as of now.");

	return embed;
}

async function steam(message, args, client) {
	args.shift();
	const query = args.join(" ");

	const msg = await message.reply(`Searching for title **${query}**...`);

	if (!query) {
		await msg.edit(
			`Correct usage: ${config.prefix}steam **App Title** or **Id**`
		);
		return;
	}

	if (steamAppList.length === 0) {
		await msg.edit(`Updating steam applist, hold on!`);
		await fetchSteamApplist();
	}

	let apps;

	if (isNaN(query)) {
		await msg.edit(`Searching for title **${query}**...`);

		const steamAppNames = steamAppList.map((a) => a.name);
		const results = fuzzysort.go(query, steamAppNames, {
			threshold: -50,
		});
		const resultNames = results.map((r) => r.target);

		apps = steamAppList.filter((a) => resultNames.includes(a.name));
		apps.sort((a, b) => {
			const resultA = results.find((r) => r.target === a.name);
			const resultB = results.find((r) => r.target === b.name);

			return resultA.score > resultB.score ? -1 : 1;
		});
	} else {
		apps = steamAppList.filter((a) => a.appid === parseInt(query));
	}

	if (apps.length === 0) {
		await msg.edit(`No title found with query: **${query}**`);
		return;
	}

	let appDetails;
	for (const app of apps) {
		await msg.edit(`Fetching app details for title **${app.name}**...`);
		appDetails = await fetchSteamApp(app.appid);

		if (!!appDetails && appDetails.type === "game") break;
	}

	if (!appDetails) {
		await msg.edit(`Failed fetching **${query}**`);
		return;
	}

	await msg.edit("Fetching DLC's...");
	const dlcs = await fetchDLCs(appDetails.dlc || []);

	const imageBuffer = await getImageBuffer(appDetails.header_image);
	const colors = await getImageColors(imageBuffer);

	const sortedColors = colors.sort((a, b) =>
		a.luminance() > b.luminance() ? -1 : 1
	);

	const saturatedColors = sortedColors.map((c) => c.saturate(1));

	let embed;
	switch (appDetails.type) {
		case "game":
			embed = createGameEmbed(appDetails, dlcs, saturatedColors[0].hex());
			break;
		case "dlc":
			embed = createDLCEmbed(appDetails, saturatedColors[0].hex());
			break;
	}

	msg.edit({ embeds: [embed] });
}

module.exports = new Command({
	name: "steam",
	aliases: ["stm"],
	description: "Show details of the specified steam game/DLC",
	permission: "SEND_MESSAGES",
	run(message, args, client) {
		steam(message, args, client);
	},
});
