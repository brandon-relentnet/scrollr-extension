import { useEffect } from 'react';
import { useSelector } from 'react-redux';

function Accent() {
    const currentAccent = useSelector((state) => state.accent);

    useEffect(() => {
        if (currentAccent) {
            document.getElementById("root").style.setProperty('--color-accent', `var(--color-${currentAccent})`);
        }
    }, [currentAccent]);

    return null;
}

export default Accent;