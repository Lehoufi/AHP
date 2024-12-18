'use client'
import { useEffect,useState } from "react"
import Navbar from "./components/Navbar"
import Land from "./Components/Land"
import Footer from "./components/Footer"
import Loading from './Loading'
import Wrapper from "./Components/Wrapper"
import Steps from "./Components/Steps"
import Bowl from "./Components/Bowl"
import AHPSteps from "./Components/LAststep"
export default function Home() {

  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    function handleLoad() {
      setIsLoading(false); 
    }
    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);

  if (isLoading) {
    return <Loading />;
  }
  return (
    <div className="sans  bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white ">
    
<Navbar istrans={false} />
<Land />
<Wrapper>
<Steps />
<Bowl />
<AHPSteps />
</Wrapper>

 <Footer />
 </div>
  )
}