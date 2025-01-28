import { React, useState } from "react";
import Navbar from "./Navbar";
import Settings from "./Settings";
import Home from "./Home";

export default function Popup() {
    const [activeTab, setActiveTab] = useState('home');

    return (
        <div className="inline-block top-4 right-4 fixed rounded-lg text-center text-text">
            <div className="bg-base rounded-lg shadow-lg">
                <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
                <div className="p-4">
                    {activeTab === 'home' && <Home />}
                    {activeTab === 'settings' && <Settings />}
                    {activeTab === 'accounts' && <div>Accounts</div>}
                    {/* Add more conditional renderings for other tabs here */}
                </div>
            </div>
        </div>
    );
}