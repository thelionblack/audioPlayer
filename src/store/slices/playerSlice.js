import {createSlice} from "@reduxjs/toolkit";
import aquaCaelestis from '../../assets/sounds/assets_sounds_AquaCaelestis.mp3';
import summerWind from '../../assets/sounds/assets_sounds_Summer Wind.mp3';
import riverFlowsInYou from '../../assets/sounds/assets_sounds_River Flows In You.mp3';
import ennioMorricone from '../../assets/sounds/assets_sounds_Ennio Morricone.mp3';
import lofiStudy from '../../assets/sounds/lofi-study.mp3';
import calmBackgroundForVideo from '../../assets/sounds/calm-background-for-video.mp3';
import pleaseCalmMyMind from '../../assets/sounds/please-calm-my-mind.mp3';
import theBeatOfNature from '../../assets/sounds/the-beat-of-nature.mp3';


const initialState = {
    trackList: [
        {
            title: 'Aqua Caelestis',
            path: aquaCaelestis,
        },
        {
            title: 'Summer Wind',
            path: summerWind,
        },
        {
            title: 'River Flows In You',
            path: riverFlowsInYou,
        },
        {
            title: 'Lofi Study',
            path: lofiStudy,
        },
        {
            title: 'Ennio Morricone',
            path: ennioMorricone,
        },
        {
            title: 'Calm Background For Video',
            path: calmBackgroundForVideo,
        },
        {
            title: 'Please Calm My Mind',
            path: pleaseCalmMyMind,
        },
        {
            title: 'the Beat Of Nature',
            path: theBeatOfNature,
        },
    ],
    currentTrack: {
        id: 0,
        isPlaying: false,
        title: 'Aqua Caelestis',
        path: aquaCaelestis,
        currentTime: '00:00',
        duration: '00:00',
        progress: 0,
        isVolume: true,
        volumeProgress: 0.01,
        saveVolumeProp: 0,
    }
}

export const playerSlice = createSlice({
    name: 'player',
    initialState,
    reducers: {
        initialDuration(state, action) {
            state.currentTrack.duration = transformationTimer(action.payload);
        },
        changeIsPlaying(state) {
            state.currentTrack.isPlaying = !state.currentTrack.isPlaying;
        },
        changeCurrentTime(state, action) {
            state.currentTrack.progress = ((action.payload.currentTime / action.payload.duration) * 100) + '%';
            state.currentTrack.currentTime = transformationTimer(action.payload.currentTime);
        },
        changeVolume(state, action) {
            let mouseX = Math.floor(action.payload.pageX - action.payload.offsetLeft);
            let progress = mouseX / (action.payload.offsetWidth / 100);
            state.currentTrack.volumeProgress = 1 * (progress / 100);
        },
        toogleVolume(state) {
            state.currentTrack.isVolume = !state.currentTrack.isVolume;

            if (!state.currentTrack.isVolume) {
                state.currentTrack.saveVolumeProp = state.currentTrack.volumeProgress;
                state.currentTrack.volumeProgress = 0;
            }
            else state.currentTrack.volumeProgress = state.currentTrack.saveVolumeProp;
        }
        ,
        changeTrack(state, action) {

            if (action.payload.className === 'next-song') {
                state.currentTrack.id < state.trackList.length - 1 ? state.currentTrack.id += 1 : state.currentTrack.id = 0;
            }
            else if (action.payload.className === 'previouse-song') {
                state.currentTrack.id === 0 ? state.currentTrack.id = state.trackList.length - 1 : state.currentTrack.id -= 1;
            }
            else {
                state.currentTrack.id = action.payload.id;
            }
            state.currentTrack = {
                ...state.currentTrack,
                ...state.trackList[state.currentTrack.id],
            };
        }
    }
})

function transformationTimer (time) {
    let minutes = Math.floor(time / 60);
    let seconds = Math.floor(time - minutes * 60);

    if(minutes < 10) minutes = '0' + minutes;
    if(seconds < 10) seconds = '0' + seconds;

    return `${minutes}:${seconds}`;
}

export const { initialDuration, changeIsPlaying, changeCurrentTime, changeTrack, changeVolume, toogleVolume, clickChangeCurentTime } = playerSlice.actions;

export default playerSlice.reducer;