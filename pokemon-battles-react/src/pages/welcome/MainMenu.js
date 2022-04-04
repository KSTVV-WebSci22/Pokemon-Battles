import Navbar from '../../components/Navbar';
import Matches from './Matches';
import './MainMenu.css'
import { getUser } from '../../util/users/Users'
import { useState, useEffect } from 'react'
import { auth } from '../../util/Firebase'

const MainMenu = () => {
  
  return ( 
    <>
      <Navbar />
      <Matches />
    </>
  );
}
 
export default MainMenu;