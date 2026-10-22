import React, { useEffect, useRef } from 'react';

const AdBanner = () => {
  const bannerRef = useRef(null);

  useEffect(() => {
    // Ensure the container exists
    if (!bannerRef.current) return;

    // 1. Set up the configuration script
    const confScript = document.createElement('script');
    confScript.type = 'text/javascript';
    confScript.innerHTML = `
      atOptions = {
        'key' : '4692dd0b42853ebbaace72d9a4822b95',
        'format' : 'iframe',
        'height' : 90,
        'width' : 728,
        'params' : {}
      };
    `;

    // 2. Set up the external invoke script provided by your ad network
    const invokeScript = document.createElement('script');
    invokeScript.type = 'text/javascript';
    invokeScript.async = true;
    invokeScript.src = 'https://www.highperformanceformat.com/4692dd0b42853ebbaace72d9a4822b95/invoke.js';

    // 3. Inject both scripts into the component container
    bannerRef.current.appendChild(confScript);
    bannerRef.current.appendChild(invokeScript);

    // Clean up DOM on unmount to prevent duplicate ads or leaks
    return () => {
      if (bannerRef.current) {
        bannerRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <div 
      ref={bannerRef} 
      style={{ 
        width: '728px', 
        height: '90px', 
        margin: '20px auto', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center' 
      }} 
    />
  );
};

export default AdBanner;