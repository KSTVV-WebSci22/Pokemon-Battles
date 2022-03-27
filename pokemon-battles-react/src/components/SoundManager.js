import Sound, {soundManager } from 'react-sound'
import TitleScreen from '../sounds/music/titleScreen.mp3'
import WelcomeMusic from '../sounds/music/welcome.mp3'
import BattleMusic from '../sounds/music/battle.mp3'
import { ClientContext } from '../context/ClientContext';
import { useContext, useEffect, useState } from 'react';

const SoundManager = ({song}) => {

  const {mute, volume} = useContext(ClientContext);

  const [currentSong, setCurrentSong] = useState()

  window.soundManager.setup({debugMode: false});

  useEffect(()=>{
    switch(song){
      case 1: 
        setCurrentSong(TitleScreen)
        break
      
      case 2: 
        setCurrentSong(WelcomeMusic)
        break

      case 3: 
        setCurrentSong(BattleMusic)
        break

      default:
        setCurrentSong(TitleScreen)
        break
    }
  }, [song])



  return ( <>
    {currentSong && <Sound 
        url={currentSong}
        playStatus={ mute ? Sound.status.PLAYING : Sound.status.STOPPED}
        volume={volume}
        loop={true}
    />
    }
  </>);
}
 
export default SoundManager;