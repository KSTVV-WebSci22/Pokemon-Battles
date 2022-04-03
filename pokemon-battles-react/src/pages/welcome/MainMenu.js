import Navbar from '../../components/Navbar';
import Matches from './Matches';
import './MainMenu.css'
import { getUser } from '../../util/users/Users'
import { useState, useEffect } from 'react'
import { auth } from '../../util/Firebase'

const MainMenu = ({user}) => {

  return ( 
    <>
      {user && <>
        <Navbar user={user}/>
        <Matches user={user}/>
      </>}
    </>
  );
}
 
export default MainMenu;