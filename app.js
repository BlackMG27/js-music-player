//set up initial variables
const musicGroup = document.getElementById('music-group'),
   songTitle = document.getElementById('song-title'),
   songInfo = document.getElementById('song-info'),
   albumCover = document.getElementById('cover'),
   progressContainer = document.getElementById('progress-container'),
   progress = document.getElementById('progress'),
   songTime = document.getElementById('song-time'),
   audio = document.getElementById('audio'),
   prevBtn = document.getElementById('prev'),
   rewindBtn = document.getElementById('rewind'),
   playBtn = document.getElementById('play'),
   forwardBtn = document.getElementById('forward'),
   nextBtn = document.getElementById('next'),
   repeatBtn = document.getElementById('repeat'),
   artistImage = document.getElementById('artist-image'),
   artistName = document.getElementById('artist'),
   shortBio = document.getElementById('artist-bio');

//initial song index, currentTime and songLength;
let songIndex = 0;
let songData;


//get song data
fetch(`./artists.json`)
    .then(res => res.json())
    .then(data => {
        //load the song into the DOM
        loadSongData(data[songIndex]);

    });

    

//update song details 
const loadSongData = song => {
    songTitle.innerText = song.songTitle;
    audio.src = song.song;
    albumCover.src = song.albumCover;
    songInfo.innerText = `${song.artist}   -  ${song.album}`;
    artistImage.src = `${song.artistImage}`;
    artistName.innerText = song.artist;
    shortBio.innerText = song.bio;
    songTime.innerText = '00:00 / 00:00';

}

//play the song
const playSong = () => {
    musicGroup.classList.add('play');
    playBtn.querySelector('i.fas').classList.remove('fa-play');
    playBtn.querySelector('i.fas').classList.add('fa-pause');

    audio.play();

}

//pause the song
const pauseSong = () => {
    musicGroup.classList.remove('play');
    playBtn.querySelector('i.fas').classList.remove('fa-pause');
    playBtn.querySelector('i.fas').classList.add('fa-play');

    audio.pause();

}

//rewind the song by 15sec
const rewindBy15 = () => {
    audio.currentTime -= 15;
}

//fast forward song by 15 sec
const forwardBy15 = () => {
    audio.currentTime += 15;
}

//gets the previous song in the queue
const playPrevSong = () => {
    songIndex--;
    fetch(`./artists.json`)
        .then(res => res.json())
        .then( data => {
            if(songIndex < 0){
                songIndex = data.length - 1;
            }
            loadSongData(data[songIndex]);
        })
    pauseSong();  
}

//plays the next song
const playNextSong = () => {
    songIndex++;
    fetch(`./artists.json`)
        .then(res => res.json())
        .then( data => {
            if(songIndex > data.length - 1){
                songIndex = 0;
            }
            loadSongData(data[songIndex]);
        })
        
    pauseSong();  
}

//repeats the song
const songLoop = () => {
    const isLoopActive = audio.hasAttribute('loop')
    if(!isLoopActive){
        audio.loop = true;
        repeatBtn.classList.add('loop-active');
    }else{
        audio.loop = false;
        repeatBtn.classList.remove('loop-active');
    }
}

//updates progress bar
const updateTime = (e) => {
    const { duration, currentTime} = e.srcElement;
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;
    formatTimeValues(currentTime, duration);
}
//formats the currentTime and duration
const formatTimeValues = (cur, dur) => {
   
    let curMins = Math.floor(cur/60);
    if(curMins < 10){
        curMins = '0' + String(curMins);
    }

    let curSeconds = Math.floor(cur % 60);
    if(curSeconds < 10){
        curSeconds = '0' + String(curSeconds);
    }

    let durMins = Math.floor(dur/60);
    if(durMins < 10){
        durMins = '0' + String(durMins);
    }

    let durSeconds = Math.floor(dur % 60);
    if(durSeconds < 10){
        durSeconds = '0' + String(durSeconds);
    }

    songTime.innerText = `${curMins}:${curSeconds} / ${durMins}:${durSeconds}`
}
//set the progressBar
const setProgress = (e) => {
    const width = e.target.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    audio.currentTime = (clickX/width) * duration;
}
//Event Listeners
playBtn.addEventListener('click', () => {
    const isPlaying = musicGroup.classList.contains('play');

    if(isPlaying){
        pauseSong()
    }else{
        playSong()
    }
});

//song functionalities
rewindBtn.addEventListener('click', rewindBy15);
forwardBtn.addEventListener('click', forwardBy15);
repeatBtn.addEventListener('click', songLoop);
//change song data
prevBtn.addEventListener('click', playPrevSong);
nextBtn.addEventListener('click', playNextSong);
//update progress bar
audio.addEventListener('timeupdate', updateTime);
//click on progress bar
progressContainer.addEventListener('click', setProgress);
//song ends
audio.addEventListener('ended', playNextSong);