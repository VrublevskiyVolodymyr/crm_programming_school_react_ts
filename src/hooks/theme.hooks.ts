import React, { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface UseThemeReturn {
    theme: Theme;
    setTheme: React.Dispatch<React.SetStateAction<Theme>>;
}

export const useTheme = (): UseThemeReturn => {
    const isDarkTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const defaultTheme: Theme = isDarkTheme ? 'dark' : 'light';

    const storedTheme = localStorage.getItem('app-theme') as Theme | null;
    const [theme, setTheme] = useState<Theme>(storedTheme ?? defaultTheme);

    useEffect(() => {
        if (document.documentElement) {
            document.documentElement.setAttribute('data-theme', theme);
        }

        localStorage.setItem('app-theme', theme);
    }, [theme]);

    return { theme, setTheme };
};
