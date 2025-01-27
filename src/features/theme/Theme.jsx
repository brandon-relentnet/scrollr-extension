import { useEffect } from 'react';
import { useSelector } from 'react-redux';

function Theme() {
    const currentTheme = useSelector((state) => state.theme);

    useEffect(() => {
        if (currentTheme) {
            document.body.setAttribute('data-theme', currentTheme);
        }
    }, [currentTheme]);

    return null;
}

export default Theme;