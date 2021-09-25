const Discord = require("discord.js");
const HtmlToText = require("html-to-text");

const axios = require("axios").default;
const fuzzysort = require("fuzzysort");
const getColors = require("get-image-colors");

const Command = require("../Structures/Command.js");

const STEAM_GETAPPLIST_ENDPOINT =
	"https://api.steampowered.com/ISteamApps/GetAppList/v2/";
const STEAM_GETAPPDETAILS_ENDPOINT =
	"https://store.steampowered.com/api/appdetails/";

let steamAppList = [];

async function fetchSteamApplist() {
	const res = await axios.get(STEAM_GETAPPLIST_ENDPOINT);
	steamAppList = res.data.applist.apps;
}

async function fetchSteamApp(appid) {
	const res = await axios.get(
		`${STEAM_GETAPPDETAILS_ENDPOINT}/?appids=${appid}`
	);
	return res.data[`${appid}`].data;
}

async function fetchDLCs(appids, msg) {
	const names = [];
	let temp = "";

	for (const appid of appids) {
		const appDetails = await fetchSteamApp(appid);
		names.push(appDetails.name);

		await msg.edit(`Retrieved DLC: **${appDetails.name}**`);
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
	return HtmlToText.convert(value, {
		selectors: [{ selector: "br", format: "skip" }],
		wordwrap: 10000,
	})
		.split("*")
		.join("-");
}

function createGameEmbed(appInfo, dlcs, color) {
	const embed = new Discord.MessageEmbed();

	embed
		.setTitle(appInfo.name)
		.setColor(color)
		.setThumbnail(appInfo.header_image)
		.setDescription(fixHtmlString(appInfo.short_description))
		.addFields(
			{
				name: "Price",
				value: appInfo.price_overview
					? appInfo.price_overview.final_formatted
					: "FREE",
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
					: appInfo.release_date.date,
				inline: true,
			}
		);

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

	let app;
	if (isNaN(query)) {
		await msg.edit(`Searching for title **${query}**...`);

		const steamAppNames = steamAppList.map((a) => a.name);
		const results = fuzzysort.go(query, steamAppNames);

		if (results.length !== 0) {
			const appName = results[0].target;
			app = steamAppList.find((a) => a.name === appName);
		}
	} else {
		app = steamAppList.find((a) => a.appid === parseInt(query));
	}

	if (!app) {
		await msg.edit(`No title found with query: **${query}**`);
		return;
	}

	await msg.edit(`Fetching app details...`);
	const appDetails = await fetchSteamApp(app.appid);

	if (!appDetails) {
		await msg.edit(`Game **${app.name}** not found!`);
		return;
	}

	const dlcs = await fetchDLCs(appDetails.dlc || [], msg);

	const imageBuffer = await getImageBuffer(appDetails.header_image);
	const colors = await getImageColors(imageBuffer);

	const sortedColors = colors.sort((a, b) =>
		a.luminance() > b.luminance() ? -1 : 1
	);

	const saturatedColors = sortedColors.map((c) => c.saturate(1));
	const embed = createGameEmbed(appDetails, dlcs, saturatedColors[0].hex());
	message.reply({ embeds: [embed] });
}

module.exports = new Command({
	name: "steam",
	description: "Show details of steam title!",
	permission: "SEND_MESSAGES",
	run(message, args, client) {
		steam(message, args, client);
	},
});
