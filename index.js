import { videos } from "./videoPlaylist.js";

const media = document.querySelector("video");
const controls = document.querySelector(".controls");
const source = document.getElementById('video-src');
const mediaTitle = document.getElementById('media-title')

const play = document.querySelector(".button-play");
const stop = document.querySelector(".button-stop");
const rwd = document.querySelector(".button-rwd-container");
const fwd = document.querySelector(".button-fwd-container");
const fiveBack = document.getElementById('step-five-back');

const timerWrapper = document.querySelector(".timer");
const timer = document.getElementById("timer-text-left");
const timerBar = document.getElementById("media-progress-bar");
const volumeBar = document.getElementById('volume')
const volumeIcon = document.getElementById('volume-icon')
const fullscreenIcon = document.getElementById('fullscreen-icon');
const progressBar = document.querySelector('.progress-bar')
const timerEnd = document.getElementById('timer-text-right')
const buttonNext = document.getElementById('button-next');

const playlistContainer = document.getElementById('videos-container')

const form = document.getElementById('mp4-file-form')
const fileInput = document.getElementById('file-input')
const preview = document.getElementById('img-preview')
const message = document.getElementById('message-status')


let intervalRwd;
let intervalFwd;
let isClicked = false;
let lastVolume = 0;
let onFullScreen = false
let currentVideo = ""
let numVideos = 0


function togglePlay(){
  const element = document.getElementById('media-btn')
  element.classList.toggle('pause')
  if (element.classList.contains('pause')){
    element.title = 'Pause (k)'
  }else{
    element.title = 'Play (k)'
  }
}

function playPauseMedia(){
  rwd.classList.remove("active");
  fwd.classList.remove("active");
  clearInterval(intervalRwd);
  clearInterval(intervalFwd);
  if (media.paused){
    play.setAttribute('data-icon', 'u');
    media.play();
  } else {
    play.setAttribute('data-icon', 'P');
    media.pause();
  }
}

function stopMedia(){
  rwd.classList.remove("active");
  fwd.classList.remove("active");
  clearInterval(intervalRwd);
  clearInterval(intervalFwd);
  media.pause();
  media.currentTime = 0
  play.setAttribute('data-icon', 'P');
  const element = document.getElementById('media-btn')
  if (element.classList.contains('pause')){
    element.classList.toggle('pause')
    element.title = 'Play (k)'
  }

}



function windBackward(){
  if (media.currentTime <= 3){
    stopMedia();
  } else {
    media.currentTime -= 1;
  }
}

function windForward(){
  if (media.currentTime >= media.duration - 3){
    stopMedia();
  } else {
    media.currentTime += 3;
  }
}


function mediaBackward() {
  clearInterval(intervalFwd);
  fwd.classList.remove("active");

  if (rwd.classList.contains("active")) {
    rwd.classList.remove("active");
    clearInterval(intervalRwd);
    media.play();
    const element = document.getElementById('media-btn')
    if (element.classList.contains('pause')){
      element.title = 'Play (k)'
    } else {
      element.classList.toggle('pause')
      element.title = 'Pause (k)'
    }
  } else {
    rwd.classList.add("active");
    media.pause();
    intervalRwd = setInterval(windBackward, 200);
  }
}

function mediaForward() {
  clearInterval(intervalRwd);
  rwd.classList.remove("active");

  if (fwd.classList.contains("active")) {
    fwd.classList.remove("active");
    clearInterval(intervalFwd);
    media.play();
    const element = document.getElementById('media-btn')
    if (element.classList.contains('pause')){
      element.title = 'Play (k)'
    } else {
      element.classList.toggle('pause')
      element.title = 'Pause (k)'
    }
    
  } else {
    fwd.classList.add("active");
    media.pause();
    intervalFwd = setInterval(windForward, 200);
  }
}

function mediaDuration(){
  const minutes = Math.floor(media.duration / 60);
  const seconds = Math.floor(media.duration - minutes * 60)

  const minuteValue = minutes.toString().padStart(2, "0")
  const secondValue = seconds.toString().padStart(2, "0")

  const mediaTime = `${minuteValue}:${secondValue}`;
  return mediaTime;
}

function setTime(){
  const minutes = Math.floor(media.currentTime / 60 );
  const seconds = Math.floor(media.currentTime - minutes * 60);

  const minuteValue = minutes.toString().padStart(2, "0")
  const secondValue = seconds.toString().padStart(2, "0")

  const mediaTime = `${minuteValue}:${secondValue}`;
  timer.textContent = mediaTime;
  timerEnd.textContent = mediaDuration()

  const barLength =  (media.currentTime / media.duration) * 100;
  timerBar.style.width = `${barLength}%`

}

function modifyVolume(){
  const progress =  volumeBar.value / volumeBar.max;
  if (progress == 0){
    volumeIcon.className = 'fa fa-volume-off'
  }
  else if (progress <= 0.60) {
    volumeIcon.className = 'fa fa-volume-down'
  }
  else {
    volumeIcon.className = 'fa fa-volume-up'
  }
  media.volume = progress;
}

function toggleFullScreen(event){
  const mediaPlayer = document.getElementById('media-player-container');
  if (!onFullScreen){
    if (mediaPlayer.requestFullscreen){
      mediaPlayer.requestFullscreen()
    } else if (mediaPlayer.webkitRequestFullscreen) {
      mediaPlayer.webkitRequestFullscreen()
    } else if (mediaPlayer.msRequestFullscreen) {
      mediaPlayer.msRequestFullscreen();
    }
    event.target.className = 'fa fa-compress';
    onFullScreen = true;
  } else {
    if (document.exitFullscreen){
      document.exitFullscreen()
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
    event.target.className = 'fa fa-expand';
    onFullScreen = false;
  }
}

function toggleFullScreenWithFKey(event){
  if (event.keyCode == 70) {
    const mediaPlayer = document.getElementById('media-player-container');
    if (!onFullScreen){
      if (mediaPlayer.requestFullscreen){
        mediaPlayer.requestFullscreen()
      } else if (mediaPlayer.webkitRequestFullscreen) {
        mediaPlayer.webkitRequestFullscreen()
      } else if (mediaPlayer.msRequestFullscreen) {
        mediaPlayer.msRequestFullscreen();
      }
      fullscreenIcon.className = 'fa fa-compress';
      onFullScreen = true;
    } else {
      if (document.exitFullscreen){
        document.exitFullscreen()
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      fullscreenIcon.className = 'fa fa-expand';
      onFullScreen = false;
    }
  } else if (event.keyCode == 27) {
    if (onFullScreen){
      if (document.exitFullscreen){
        document.exitFullscreen()
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      fullscreenIcon.className = 'fa fa-expand';
      onFullScreen = false;
    }
  }
}


function keyboardControls(event){
  if (event.keyCode == 75){ // Play or Pause
    playPauseMedia();
    togglePlay();
  } else if (event.keyCode == 85) {  // Forward
    mediaForward();
  } else if (event.keyCode == 66) { // Rewind
    mediaBackward();
  } else if (event.keyCode == 83) { // Stop media
    stopMedia();
  }
}

function mouseOverProgressBar(event){
  if (isClicked) {
    const coordinates = progressBar.getBoundingClientRect()
    let start = coordinates.left
    let end = coordinates.right
    let totalOffset = start - end
    let mousePos = event.clientX
    let mouseOffset = mousePos - start
    let finalOffset = -(mouseOffset / totalOffset)
    const barLength =  finalOffset * 100
    timerBar.style.width = `${barLength}%`
    media.currentTime = media.duration * (finalOffset)
  }
}

function clickProgressBar(event){
    const coordinates = progressBar.getBoundingClientRect()
    let start = coordinates.left
    let end = coordinates.right
    let totalOffset = start - end
    let mousePos = event.clientX
    let mouseOffset = mousePos - start
    let finalOffset = -(mouseOffset / totalOffset)
    const barLength =  finalOffset * 100
    timerBar.style.width = `${barLength}%`
    media.currentTime = media.duration * (finalOffset)
}


function toggleMute(event){
  if (media.volume != 0){
    lastVolume = volumeBar.value / volumeBar.max;
    volumeBar.value = 0;
    media.volume = 0;
    event.target.className = 'fa fa-volume-off'
  }else {
    media.volume = lastVolume;
    volumeBar.value = lastVolume * 100;
    if (media.volume == 0){
      event.target.className = 'fa fa-volume-off'
    } else if (media.volume <= 0.60) {
      event.target.className = 'fa fa-volume-down'
    } else {
      event.target.className = 'fa fa-volume-up'
    }
  }
}

function keyDownControls(e){
  if (e.key == 'ArrowLeft'){
    if (media.currentTime < 5){
      media.currentTime = 0;
    } else {
      media.currentTime -= 5;
    }
  } else if (e.key == 'ArrowRight'){
    if (media.currentTime >= media.duration - 5){
      media.currentTime = media.duration;
    } else {
      media.currentTime += 5;
    }
  } 
}
 
function resetVideo(){
  timerBar.style.width = `0%`;
  timer.textContent = '00:00';
  media.load();
  timerEnd.textContent = '';
  const element = document.getElementById('media-btn')
  if (element.classList.contains('pause')){
    element.classList.toggle('pause')
    element.title = 'Play (k)'
  }  
}

function switchVideo(event){
  if (event.target.className == 'video-contain') {
    currentVideo.classList.remove('selec')
    currentVideo = event.target
    currentVideo.classList.add('selec')
    media.src = currentVideo.children[0].url;
    mediaTitle.textContent = currentVideo.children[0].title
  } else if (event.target.className == 'video-thumbnail' || event.target.className == 'video-title') {
    currentVideo.classList.remove('selec')
    currentVideo = event.target.parentElement
    currentVideo.classList.add('selec')
    media.src = currentVideo.children[0].url
    mediaTitle.textContent = currentVideo.children[0].title
  }

  resetVideo()
}

function playNextVideo() {
  let nextVideoId = parseInt(currentVideo.children[0].id) + 1
  if (nextVideoId > numVideos){
    currentVideo.classList.remove('selec');
    currentVideo = document.getElementById('1').parentElement;
    currentVideo.classList.add('selec');
    media.src = currentVideo.children[0].url;
    mediaTitle.textContent = currentVideo.children[0].title
  } else {
    currentVideo.classList.remove('selec');
    currentVideo = document.getElementById(nextVideoId + "").parentElement;
    currentVideo.classList.add('selec');
    media.src = currentVideo.children[0].url;
    mediaTitle.textContent = currentVideo.children[0].title
  }
  
  resetVideo()
}

function goToNextVideo(event){
  if (event.shiftKey && event.keyCode == 78) { // SHIFT + N
    playNextVideo();
  } 
}


 function handleSubmit(e){
  e.preventDefault();

  const file = fileInput.files[0];
  if (file) {
    const url = 'https://httpbin.org/post';
    const formData = new FormData(form);

    const fetchOptions = {
      method: 'post',
      body: formData,
      headers: {
        'Accepts': 'multipart/form-data'
      }
    }

    message.textContent = 'Uploading file...'
    message.className = ""

    fetch(url, fetchOptions)
    .then(response => response.json())
    .then(data => {
      console.log(data.files.file)
      message.textContent = 'File uploaded successfully.'
      message.className = 'success'
    })
    .catch(error => {
      console.log('Error', error)
      message.textContent = 'Error uploading file.'
      message.className = 'error'
    });

  } else {
    message.textContent = "Please select a file to upload";
    message.className = "error";
  }
}

// async function uploadFiles() {
//   const url = 'https://httpbin.org/post';
//   const formData = new FormData(form);

//   const fetchOptions = {
//     method: 'post',
//     body: formData
//   }

//   const data = await fetch(url, fetchOptions);
//   console.log(data)
// }

function loadPlaylist(){
  media.volume = 0.50;
  volumeBar.value = 50;
  videos.forEach(function(videoEle){
    const newVideo = document.createElement('div');
    newVideo.className = 'video-contain';
    const videoImg = document.createElement('img');
    videoImg.className = 'video-thumbnail';
    videoImg.src = videoEle.thumbnail;
    videoImg.alt = videoEle.title;
    videoImg.title = videoEle.title;
    videoImg.url = videoEle.url
    videoImg.id = videoEle.id + ""
    newVideo.appendChild(videoImg);
    const videoTitle = document.createElement('span');
    videoTitle.className = 'video-title';
    videoTitle.textContent = videoEle.title;
    newVideo.appendChild(videoTitle)
    newVideo.addEventListener('click', switchVideo)
    playlistContainer.appendChild(newVideo)
    if (videoEle.id == 1) {
      newVideo.classList.add('selec');
      currentVideo = newVideo;
      mediaTitle.textContent = videoEle.title;
    }
    numVideos++;
  })
}

window.onload = loadPlaylist;

window.addEventListener('mousedown', e => {
  isClicked = true;
})


window.addEventListener('mouseup', e => {
  if (isClicked){
    isClicked = false;
  }
})


play.addEventListener('click', playPauseMedia);
play.addEventListener('click', togglePlay)
stop.addEventListener('click', stopMedia)

rwd.addEventListener('click', mediaBackward)
fwd.addEventListener('click', mediaForward)


media.addEventListener('timeupdate', setTime);
volumeBar.addEventListener('input', modifyVolume);
fullscreenIcon.addEventListener('click', toggleFullScreen)
volumeIcon.addEventListener('click', toggleMute)
progressBar.addEventListener('mousemove', mouseOverProgressBar)
progressBar.addEventListener('click', clickProgressBar)
buttonNext.addEventListener('click', playNextVideo)
document.documentElement.addEventListener('keyup', keyboardControls)
document.documentElement.addEventListener('keyup', toggleFullScreenWithFKey)
document.addEventListener('keydown', goToNextVideo)
window.addEventListener('keydown', keyDownControls)

form.addEventListener('submit', handleSubmit)

media.removeAttribute("controls");
controls.style.visibility = "visible";