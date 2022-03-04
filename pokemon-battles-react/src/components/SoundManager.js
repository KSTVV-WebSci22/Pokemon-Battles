import Sound from 'react-sound'
import TitleScreen from '../sounds/music/titleScreen.mp3'
import WelcomeMusic from '../sounds/music/welcome.mp3'
import { ClientContext } from '../context/ClientContext';
import { useContext, useEffect, useState } from 'react';

const SoundManager = ({song}) => {

  const {mute, volume} = useContext(ClientContext);

  const [currentSong, setCurrentSong] = useState()

  useEffect(()=>{
    switch(song){
      case 1: 
        // stopMusic()
        setCurrentSong(TitleScreen)
        // setMute(true)
        break
      
      case 2: 
        // stopMusic()
        setCurrentSong(WelcomeMusic)
        // setMute(true)
        break

      default:
        // setMute(false)
        setCurrentSong(TitleScreen)
        // setMute(true)
        break
    }
  }, [song])



  return ( <>
    {currentSong && <Sound 
        url={currentSong}
        playStatus={ mute ? Sound.status.PLAYING : Sound.status.STOPPED}
        volume={volume}
    />
    }
  </>);
}
 
export default SoundManager;