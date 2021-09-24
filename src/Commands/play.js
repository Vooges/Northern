const {
	joinVoiceChannel,
	createAudioPlayer,
	createAudioResource,
	entersState,
	StreamType,
	AudioPlayerStatus,
	VoiceConnectionStatus,
    getVoiceConnection,
} = require('@discordjs/voice');

const Command = require("../Structures/Command.js");
const ytdl = require("ytdl-core");
const ytSearch = require("yt-search");
const config = require("../Data/config.json");

var queue;

const player = createAudioPlayer();

module.exports = new Command({
    name: 'play',
    description: 'Plays a song or adds it to the queue',
    permission: "SEND_MESSAGES",
    async run(message, args, client){
        queue = client.queue;

        const voiceChannel = message.member.voice.channel;

        if (!voiceChannel) return message.channel.send('You need to be in a channel to execute this command!');

        serverQueue = queue.get(voiceChannel.guild.id);

        if (args.length <= 1) return message.reply(`Correct usage: \`${config.prefix}play Song Name\``);
        
        let song = {};

        if (false) { // ytdl.validateURL() doesnt work with actual URL, needs custom function
            const songInfo = await ytdl.getInfo(args[0]);
            
            song = {
                title: songInfo.videoDetails.title,
                url: songInfo.videoDetails.video_url
            }
        } else {
            const videoFinder = async (query) =>{
                const videoResult = await ytSearch(query);
                
                return (videoResult.videos.length > 1) ? videoResult.videos[0] : null;
            }

            const video = await videoFinder(args.join(' '));

            if (video){
                song = {
                    title: video.title,
                    url: video.url,
                }
            } else {
                message.channel.send('Error finding video.');
            }
        }

        if (!serverQueue){
            try {
                const connection = joinVoiceChannel({
                    channelId: voiceChannel.id,
                    guildId: voiceChannel.guild.id,
                    adapterCreator: voiceChannel.guild.voiceAdapterCreator,
                    songs: [],
                    selfDeaf: false,
                    selfMute: false,
                });

                queue.set(voiceChannel.guild.id, connection.joinConfig.songs);

                connection.joinConfig.songs.push(song);

                connection.subscribe(player);

                videoPlayer(voiceChannel.guild.id, connection.joinConfig.songs[0], client, message);

                player.on('error', error => {
                    console.error(`Error: ${error.stack}`);
                    player.stop();
                });
            } catch (err) {
                queue.delete(voiceChannel.guild.id);
                
                message.reply('An error occured');
                
                console.error(err);
            }
        } else {
            const serverQueue = queue.get(voiceChannel.guild.id);

            serverQueue.push(song);

            return message.reply(`**${song.title}** added to queue`);
        }
    }
});

async function videoPlayer(guildId, song, client, message){
    const songQueue = queue.get(guildId);

    if(!song){
        const connection = getVoiceConnection(guildId);

		//check if bot is in same channel as user

        try {
            connection.disconnect();
        } catch (error) {
            console.error(error);
        }
		
        queue.delete(guildId);

		client.voice.adapters
			.get(`${guildId}`)
			.destroy();

		message.reply("Left the channel");

        return;
    }

    const stream = ytdl(song.url, {
        filter: 'audioonly', 
        highWaterMark: 1<<25, //set ytdl-core to use 32mb, fixes (?) https://github.com/fent/node-ytdl-core/issues/405
    });

    player.play(createAudioResource(stream));

    message.reply(`Now playing: **${song.title}**`); //change to generic message

    player.on(AudioPlayerStatus.Idle, () => { //second song stops too early
        songQueue.shift();
        
        videoPlayer(guildId, songQueue[0], client, message);
    });
}