import React, {useEffect, useRef} from 'react';
import prevSong from "../../assets/img/playPrev.svg";
import playSong from "../../assets/img/play.svg";
import pauseSong from "../../assets/img/pause.svg";
import nextSong from "../../assets/img/playNext.svg";
import sound from  '../../assets/img/volume.svg';
import soundMute from '../../assets/img/volume-mute.svg'
import {useDispatch, useSelector} from "react-redux";
import { initialDuration, changeIsPlaying, changeCurrentTime, changeTrack, changeVolume, toogleVolume } from '../../store/slices/playerSlice'

const Player = () => {
    const {trackList, currentTrack} = useSelector(state => state.playerReducer);
    const dispatch = useDispatch();
    const audioRef = useRef(null);

    const handlerOnPlaying = () => {
        dispatch(changeIsPlaying());

        if (currentTrack.isPlaying) audioRef.current.pause();
        else audioRef.current.play()
    }

    useEffect(() => {if (currentTrack.isPlaying) audioRef.current.play();}, [currentTrack.path]);
    useEffect(() => {audioRef.current.volume = currentTrack.volumeProgress}, [currentTrack.volumeProgress]);


    return (
        <div className="player">
            <audio
                ref={audioRef}
                src={currentTrack.path}
                onDurationChange={(event) => dispatch(initialDuration(event.target.duration))}
                onTimeUpdate={(event) => dispatch(changeCurrentTime({
                    currentTime: event.target.currentTime,
                    duration: event.target.duration,
                }))}
                onEnded={(event) => {
                    dispatch(changeTrack({id: currentTrack.id + 1}))
                }}
            ></audio>
            <div className='controls-panel'>
                <img className='previouse-song' src={prevSong}
                     alt='previous sound'
                     onClick={(event) => {
                         dispatch(changeTrack({className: event.target.className}));
                     }}
                />
                <img
                    src={!currentTrack.isPlaying ? playSong : pauseSong}
                    alt='play or pause sound'
                    onClick={handlerOnPlaying}
                />
                <img className='next-song'
                     src={nextSong} alt='next sound'
                     onClick={(event) => {

                         dispatch(changeTrack({className: event.target.className}));
                     }}
                />
                <h3 className='song-title'>{currentTrack.title}</h3>
                <div className='progress'>
                    <span>{currentTrack.currentTime}</span>
                    <div className='progress-bar'
                         onClick={(event) => {
                             let mouseX = Math.floor(event.pageX - event.target.offsetLeft);
                             let progress = mouseX / (event.target.offsetWidth / 100);
                             audioRef.current.currentTime = audioRef.current.duration * (progress / 100);
                         }}
                    >
                        <span style={{width: currentTrack.progress}}></span>
                    </div>
                    <span>{currentTrack.duration}</span>
                </div>
                <div className='volume'>
                    <img src={currentTrack.isVolume ? sound : soundMute} alt='volume'
                        onClick={() => dispatch(toogleVolume())}
                    />
                    <progress value={currentTrack.volumeProgress} max="1"
                        onClick={(event) => dispatch(changeVolume({
                            pageX: event.pageX,
                            offsetLeft: event.target.offsetLeft,
                            offsetWidth: event.target.offsetWidth,
                        }))}
                    ></progress>
                </div>
            </div>
            <ul className='songs-list'>
                {trackList.map((track, id) => {return (
                    <li key={track.path} className={track.title === currentTrack.title ? 'songs-list__item active' : 'songs-list__item'}
                        onClick={() => dispatch(changeTrack({id: id}))}
                    >
                        <img
                            src={currentTrack.isPlaying && track.title === currentTrack.title ? pauseSong : playSong}
                            alt='play or pause sound'
                            onClick={() => {
                                if (track.title === currentTrack.title) handlerOnPlaying();
                                else {
                                    dispatch(changeTrack({id: id}))
                                }
                            }}
                        />
                        <span>{track.title}</span>
                    </li>
                )})}
            </ul>
        </div>
    );
};

export default Player;