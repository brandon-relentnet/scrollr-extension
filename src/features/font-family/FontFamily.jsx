import { useEffect } from 'react';
import { useSelector } from 'react-redux';

function FontFamily() {
    const currentFontFamily = useSelector((state) => state.fontFamily);

    useEffect(() => {
        if (currentFontFamily) {
            document.body.style.setProperty('--fontFamily', `${currentFontFamily}, sans-serif`);
        }
    }, [currentFontFamily]);

    return null;
}


export default FontFamily;