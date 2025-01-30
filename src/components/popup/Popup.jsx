import { React, useState } from "react";
import Navbar from "./Navbar";
import Settings from "./Settings";
import Home from "./Home";
import Theme from '../../features/theme/Theme';
import Accent from '../../features/accent/Accent';
import FontFamily from '../../features/font-family/FontFamily';

export default function Popup() {
    const [activeTab, setActiveTab] = useState('home');

    return (
        <div className="text-text">
            <FontFamily />
            <Theme />
            <Accent />
            <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="p-4">
                {activeTab === 'home' && <Home />}
                {activeTab === 'settings' && <Settings />}
                {activeTab === 'accounts' && <div>Accounts</div>}
                {/* Add more conditional renderings for other tabs here */}
            </div>
        </div>
    );
}