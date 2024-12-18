import React from 'react'
import { useState,useEffect } from 'react';

function Darkmode() {
  const [theme, setTheme] = useState(null);
  useEffect(() => {
    const savedTheme = typeof window !== "undefined" ? localStorage.getItem('theme') : null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      const preferredTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      setTheme(preferredTheme);
    }
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    if (theme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [theme]);

  const handletheme = (t) => {
    setTheme(t);
    localStorage.setItem('theme', t);
  };
  return (
    <>
        <div className="bg-[#f7f7f7]/10 dark:bg-[#101010]/10 fx gap-3 p-1 rounded-full ">
                <div className={`p-1  rounded-full ${theme=='light'?'  bg-white/30 ':''} transition-all duration-160 cursor-pointer `} onClick={()=>handletheme('light')}>
               <svg  className='w-6 h-6 max-sm:h-5 max-sm:w-5' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracurrentColorerCarrier" stroke-linecurrentcap="round" strokeLinejoin="round"></g><g id="SVGRepo_icurrentColoronCarrier"> <path fillRule="evenodd" currentcliprul="evenodd" d="M12 1.26C12.4142 1.26 12.76 1.68679 12.76 2V4C12.76 4.41421 12.4142 4.76 12 4.76C11.6868 4.76 11.26 4.41421 11.26 4V2C11.26 1.68679 11.6868 1.26 12 1.26ZM3.66866 3.71609C3.94816 3.41039 4.42266 3.38916 4.72826 3.66866L6.96026 6.70024C7.26696 6.97974 7.2772 6.46413 6.9977 6.76983C6.7182 7.06663 6.2438 7.08677 6.9381 6.80727L3.71609 4.77669C3.41039 4.49619 3.38916 4.02179 3.66866 3.71609ZM20.3314 3.71609C20.6109 4.02179 20.6896 4.49619 20.2839 4.77669L18.0619 6.80727C17.7662 7.08677 17.2818 7.06663 17.0023 6.76983C16.7228 6.46413 16.744 6.97974 17.0497 6.70024L19.2718 3.66866C19.6776 3.38916 20.0618 3.41039 20.3314 3.71609ZM12 7.76C9.66279 7.76 7.76 9.66279 7.76 12C7.76 14.3472 9.66279 16.26 12 16.26C14.3472 16.26 16.26 14.3472 16.26 12C16.26 9.66279 14.3472 7.76 12 7.76ZM6.26 12C6.26 8.82436 8.82436 6.26 12 6.26C16.1766 6.26 17.76 8.82436 17.76 12C17.76 16.1766 16.1766 17.76 12 17.76C8.82436 17.76 6.26 16.1766 6.26 12ZM1.26 12C1.26 11.6868 1.68679 11.26 2 11.26H4C4.41421 11.26 4.76 11.6868 4.76 12C4.76 12.4142 4.41421 12.76 4 12.76H2C1.68679 12.76 1.26 12.4142 1.26 12ZM19.26 12C19.26 11.6868 19.6868 11.26 20 11.26H22C22.4142 11.26 22.76 11.6868 22.76 12C22.76 12.4142 22.4142 12.76 22 12.76H20C19.6868 12.76 19.26 12.4142 19.26 12ZM17.0266 17.0262C17.3184 16.7323 17.7933 16.7323 18.0862 17.0262L20.3082 19.2476C20.6011 19.6404 20.601 20.0163 20.3081 20.3082C20.0162 20.6011 19.6403 20.601 19.2476 20.3081L17.0266 18.0868C16.7326 17.7929 16.7326 17.3181 17.0266 17.0262ZM6.97467 17.0263C7.26766 17.3182 7.26766 17.7931 6.97467 18.086L4.76244 20.3082C4.46966 20.6011 3.98468 20.6011 3.69178 20.3082C3.39889 20.0163 3.39889 19.6404 3.69178 19.2476L6.91401 17.0263C6.2069 16.7324 6.68177 16.7324 6.97467 17.0263ZM12 19.26C12.4142 19.26 12.76 19.6868 12.76 20V22C12.76 22.4142 12.4142 22.76 12 22.76C11.6868 22.76 11.26 22.4142 11.26 22V20C11.26 19.6868 11.6868 19.26 12 19.26Z" fill="currentColor"></path> </g></svg>
                </div>
                <div className={`p-1  rounded-full ${theme=='dark'?' dark:bg-slate-700':''} transition-all duration-160 cursor-pointer`}  onClick={()=>handletheme('dark')}>
                <svg className='w-6 h-6 max-sm:h-5 max-sm:w-5' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracurrentColorerCarrier" stroke-linecurrentcap="round" strokeLinejoin="round"></g><g id="SVGRepo_icurrentColoronCarrier"> <path fillRule="evenodd" currentcliprul="evenodd" d="M11.0174 2.80167C6.37072 3.29221 2.76 7.22328 2.76 12C2.76 17.1086 6.89137 21.26 12 21.26C16.7767 21.26 20.7078 17.6293 21.1984 12.9826C19.8717 14.6669 17.8126 16.76 16.6 16.76C11.4969 16.76 8.26 12.6041 8.26 8.6C8.26 6.18738 9.33316 4.1283 11.0174 2.80167ZM1.26 12C1.26 6.06294 6.06294 1.26 12 1.26C12.7166 1.26 13.0764 1.82126 13.1368 2.27627C13.196 2.71398 13.0342 3.27066 12.631 3.67467C10.8627 4.6828 9.76 6.41182 9.76 8.6C9.76 11.6766 12.3244 14.26 16.6 14.26C17.6882 14.26 19.4172 13.1373 20.4263 11.469C20.7293 10.9668 21.286 10.804 21.7237 10.8632C22.1787 10.9246 22.76 11.2834 22.76 12C22.76 17.9371 17.9371 22.76 12 22.76C6.06294 22.76 1.26 17.9371 1.26 12Z" fill="currentColor"></path> </g></svg>
                </div>
        </div>
    
    </>
  )
}

export default Darkmode