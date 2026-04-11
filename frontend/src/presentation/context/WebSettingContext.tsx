'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { WebSetting } from '@/src/domain/entity/web-setting.entity';
import { AppProviders } from '@/src/provider/provider';

interface WebSettingContextProps {
  settings: WebSetting | null;
  loading: boolean;
}

const WebSettingContext = createContext<WebSettingContextProps>({
  settings: null,
  loading: true,
});

export const WebSettingProvider = ({ children }: { children: React.ReactNode }) => {
  const [settings, setSettings] = useState<WebSetting | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Define the logic to update Document Metadata
    const updateDOMMetadata = (data: WebSetting) => {
      // Update Title
      if (data.webName && document.title !== data.webName) {
        document.title = data.webName;
      }

      // 2. Update Favicon
      if (data.logoUrl) {
        // Find ALL existing icon links (Next.js might create multiple)
        const existingIcons = document.querySelectorAll("link[rel*='icon']");

        // Remove all existing icons to prevent Next.js from fighting back
        existingIcons.forEach(el => el.remove());

        // Create and append your new dynamic icon
        const newLink = document.createElement('link');
        newLink.rel = 'icon';
        newLink.href = data.logoUrl;
        // For Base64 images, specifying the type helps browsers
        if (data.logoUrl.startsWith('data:image/svg+xml')) {
          newLink.type = 'image/svg+xml';
        } else if (data.logoUrl.startsWith('data:image/')) {
          newLink.type = 'image/png';
        }

        document.head.appendChild(newLink);
      }
    };

    // 2. Define the Fetch Function
    const fetchSettings = async (isInitial = false) => {
      try {
        const data = await AppProviders.GetActiveWebSettingUseCase.execute();
        if (data) {
          setSettings(data);
          updateDOMMetadata(data);
        }
      } catch (error) {
        console.error("Interval sync failed:", error);
      } finally {
        if (isInitial) setLoading(false);
      }
    };

    // 3. Initial execution
    fetchSettings(true);

    // 4. Set interval for every 5 seconds
    // const intervalId = setInterval(() => {
    //   fetchSettings(false);
    // }, 5000);

    // // 5. Cleanup on unmount
    // return () => clearInterval(intervalId);
  }, []);

  return (
    <WebSettingContext.Provider value={{ settings, loading }}>
      {children}
    </WebSettingContext.Provider>
  );
};

export const useWebSettings = () => useContext(WebSettingContext);
