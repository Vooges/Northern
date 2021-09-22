const {
	joinVoiceChannel,
	createAudioPlayer,
	createAudioResource,
	entersState,
	StreamType,
	AudioPlayerStatus,
	VoiceConnectionStatus,
} = require('@discordjs/voice');

const Command = require("../Structures/Command.js");
const ytdl = require("ytdl-core");
const ytSearch = require("yt-search");

const queue = new Map(); //convert to MySQL

module.exports = {
    name: 'play',
    description: 'Advanced music bot',
    permission: "SEND_MESSAGES",
    async run(message, args, client){
        const voiceChannel = message.member.voice.channel;

        if (!voiceChannel) return message.channel.send('You need to be in a channel to execute this command!');

        const serverQueue = queue.get(message.guild.id);

        if (!args.length) return message.channel.send('You need to send a URL or keywords!');
        
        let song = {};

        if (ytdl.validateURL(args[0])) { // doesnt work with actual URL, needs custom function
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
                    selfDeaf: false,
                    selfMute: false
                });

                const player = createAudioPlayer();

                connection.subscribe(player);

                const stream = ytdl(song.url, {
                    filter: 'audioonly', 
                    highWaterMark: 1<<25, //set ytdl-core to use 32mb, fixes (?) https://github.com/fent/node-ytdl-core/issues/405
                });

                player.play(createAudioResource(stream));

                message.reply(`Now playing: **${song.title}**`);

                player.on('error', error => {
                    console.error(`Error: ${error.stack}`);
                    player.stop();
                });
            } catch (err) {
                queue.delete(voiceChannel.guild.id);
                
                message.reply('An error occured');
                
                throw err;
            }
        }
    }
}