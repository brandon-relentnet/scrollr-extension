import React from 'react';
import Theme from '../../features/theme/Theme';
import Accent from '../../features/accent/Accent';
import FontFamily from '../../features/font-family/FontFamily';
import '../../css/index.css';
import Carousel from '../carousel/Carousel';

function ContentApp() {
    return (
        <>
            <Carousel />
            <Theme />
            <Accent />
            <FontFamily />
        </>
    );
}

export default ContentApp;