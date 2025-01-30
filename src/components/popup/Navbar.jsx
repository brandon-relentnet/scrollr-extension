import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faUser, faHouse, faPowerOff } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { toggleIframe } from '../../store/iframeSlice';

const Navbar = ({ activeTab, setActiveTab }) => {
    const dispatch = useDispatch();
    const iframeEnabled = useSelector(state => state.iframe.enabled);

    const handlePowerToggle = () => {
        dispatch(toggleIframe());
        // Send message to content script
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]?.id) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    action: 'TOGGLE_IFRAME',
                    enabled: !iframeEnabled
                });
            }
        });
    };

    return (
        <nav className="flex items-center justify-between p-4 text-text sticky top-0 z-10 border-b-1 border-overlay0">
            {/* Left side of Navbar */}
            <div className="flex items-center space-x-2">
                <button
                    onClick={() => setActiveTab('home')}
                    className={`flex items-center cursor-pointer justify-center p-2 rounded ${activeTab === 'home' ? 'bg-surface0' : 'hover:bg-base'
                        }`}
                    aria-label="Home"
                >
                    <FontAwesomeIcon icon={faHouse} className="h-5 w-5" />
                </button>
                {/* Power Button */}
                <button
                    onClick={handlePowerToggle}
                    className={`flex items-center cursor-pointer justify-center p-2 rounded ${iframeEnabled ? 'bg-surface0 text-accent' : 'hover:bg-base'
                        }`}
                    aria-label="Toggle Iframe"
                >
                    <FontAwesomeIcon icon={faPowerOff} className="h-5 w-5" />
                </button>
            </div>

            {/* Title */}
            <div className="text-lg font-semibold p-2">
                Scrollr v1.0
            </div>

            {/* Right Side of Navbar */}
            <div className="flex space-x-2">
                {/* Accounts Button with Tooltip */}
                <div className="relative group">
                    <button
                        onClick={() => {
                            null
                        }}
                        className={`flex items-center justify-center p-2 rounded hover:bg-surface1`}
                        aria-label="Accounts"
                    // Optionally disable the button to prevent clicks
                    // disabled
                    >
                        <FontAwesomeIcon icon={faUser} className="h-5 w-5" />
                    </button>
                    {/* Tooltip Positioned Below the Icon */}
                    <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-overlay0 text-text text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        Coming Soon
                    </div>
                </div>

                {/* Settings Button */}
                <button
                    onClick={() => setActiveTab('settings')}
                    className={`flex items-center justify-center cursor-pointer p-2 rounded ${activeTab === 'settings' ? 'bg-surface0' : 'hover:bg-base'
                        }`}
                    aria-label="Settings"
                >
                    <FontAwesomeIcon icon={faCog} className="h-5 w-5" />
                </button>
                {/* Future navbar items can be added here */}
            </div>
        </nav>
    );
};

export default Navbar;