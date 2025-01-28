import React from 'react';
import ThemeDropdown from '../../features/theme/ThemeDropdown';
import AccentDropdown from '../../features/accent/AccentDropdown';
import FontFamilyDropdown from '../../features/font-family/FontFamilyDropdown';

function Settings() {
    return (
        <div>
            <div className="text-center text-text w-96">
                <h2 className='text-2xl text-subtext1 font-semibold m-4 text-left'>Appearance</h2>
                {/* Centered grid with larger width */}
                <div className='p-4 rounded shadow-lg bg-surface0 gap-8'>
                    <label className='ml-1 text-left block mb-2 font-bold'>Theme:</label>
                    <ThemeDropdown />
                    <label className='ml-1 text-left block mb-2 font-bold'>Accent:</label>
                    <AccentDropdown />
                    <label className='ml-1 text-left block mb-2 font-bold'>Font Family:</label>
                    <FontFamilyDropdown />
                </div>
            </div>
        </div>
    );
}

export default Settings;