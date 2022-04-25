import { useContext, useEffect } from "react";
import { ClientContext } from "../../context/ClientContext";
import sad from './404.png'
import sad2 from './sad.gif'
import './BadPage.css'

const BadPage = () => {
  
  const { setLoading } = useContext(ClientContext)

  useEffect(() => {
    setLoading(false)
  }, []);
  return ( 
    <div className="full-screen content">
      <div className="content-item">
        <h1 className="text-center mt-4">404: Page Does Not Exist</h1>
        <img src={sad} alt="" />
        <img src={sad2} alt="" />
        <h5>If you're sure the page should exist, please send us an email so we may resolve it.</h5>
      </div>
    </div>
  );
  
}
 
export default BadPage;