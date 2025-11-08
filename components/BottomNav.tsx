
import React from 'react';
import { HomeIcon, ChartBarIcon, CameraIcon } from './Icons';
import { useTranslation } from '../i18n/i18nContext';

interface BottomNavProps {
  onCameraClick: () => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ onCameraClick }) => {
  const { translate } = useTranslation();
  return (
    <nav className="relative w-full h-24 bg-gray-800 flex justify-between items-center px-0">
      <button className="flex flex-col items-center justify-center text-gray-400 hover:text-green-300 transition-colors flex-1 h-full py-2" aria-label={translate('common.home')}>
        <HomeIcon className="w-7 h-7" />
        <span className="text-xs mt-1">{translate('common.home')}</span>
      </button>

      {/* Invisible spacer/placeholder for the camera button to help distribute space within the flex container */}
      <div className="w-20 h-full flex-shrink-0" />

      <button className="flex flex-col items-center justify-center text-gray-400 hover:text-green-300 transition-colors flex-1 h-full py-2" aria-label={translate('common.history')}>
        <ChartBarIcon className="w-7 h-7" />
        <span className="text-xs mt-1">{translate('common.history')}</span>
      </button>

      {/* Actual Camera Button, absolutely positioned over the nav bar */}
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <button
          onClick={onCameraClick}
          className="bg-green-500 rounded-full p-2 shadow-lg shadow-green-500/30 border-4 border-gray-900 hover:bg-green-400 transition-transform transform hover:scale-110 focus:outline-none"
          aria-label={translate('common.scan')}
        >
          <CameraIcon className="w-14 h-14 text-white" />
        </button>
      </div>
    </nav>
  );
};

export default BottomNav;
