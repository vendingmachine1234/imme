import React, { useState } from 'react';
import type { AnalysisResult } from '../types';
import { DocumentTextIcon, CurrencyDollarIcon, WrenchScrewdriverIcon, CheckCircleIcon, ChevronLeftIcon, ShareIcon } from './Icons';
import { useTranslation } from '../i18n/i18nContext';

interface ResultsViewProps {
  result: AnalysisResult | null;
  imageSrc: string;
  onScanAgain: () => void;
}

// Mock gallery images, same as in SearchResultsView
const mockGalleryImages = (mainImage: string) => [
  mainImage,
  'https://images.unsplash.com/photo-1596753092525-26a642e05452?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1621309653489-0b3551a8a9BF?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1560932375-a01f6244a296?q=80&w=800&auto=format&fit=crop',
];

const LoadingSpinner: React.FC = () => {
    const { translate } = useTranslation();
    return (
        <div className="flex flex-col items-center justify-center h-full text-white">
            <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-4 text-lg">{translate('common.fetchingDetails')}</p>
        </div>
    );
};

const ResultsView: React.FC<ResultsViewProps> = ({ result, imageSrc, onScanAgain }) => {
  const { translate } = useTranslation();
  const [activeImage, setActiveImage] = useState(imageSrc);
  const [showAllThumbnails, setShowAllThumbnails] = useState(false);

  const galleryImages = mockGalleryImages(imageSrc);
  const visibleThumbnails = galleryImages.slice(0, 3);
  const remainingImageCount = galleryImages.length - visibleThumbnails.length;

  const handleShare = async () => {
    const confidencePercentage = result ? (result.confidence * 100).toFixed(1) : 'N/A';
    if (navigator.share && result) {
        try {
            // Fetch the image data and convert it to a Blob
            const response = await fetch(activeImage);
            const blob = await response.blob();
            const file = new File([blob], 'fiber_scan_result.jpg', { type: blob.type });

            // Use the Web Share API
            await navigator.share({
                title: 'Abaca Fiber Scan Result',
                text: `I identified this fiber as Grade ${result.grade} with ${confidencePercentage}% confidence!`,
                files: [file],
            });
        } catch (error) {
            console.error('Error sharing:', error);
            // Fallback alert if sharing fails (e.g., user cancels)
            alert('Could not share the result.');
        }
    } else {
        // Fallback for browsers that don't support the Web Share API
        alert('Sharing is not supported on this browser.');
    }
  };

  if (!result) {
      // Consistent loading state with new UI elements
      return (
        <div className="w-full h-full bg-gray-900 text-white flex flex-col font-sans">
            <header className="fixed top-0 left-0 right-0 bg-transparent z-20 w-full px-2">
                <div className="relative flex items-center justify-start w-full h-16">
                    <button onClick={onScanAgain} className="text-white bg-black/40 backdrop-blur-sm rounded-full p-2 transition-colors hover:bg-black/60" aria-label={translate('common.back')}>
                        <ChevronLeftIcon className="w-7 h-7" />
                    </button>
                </div>
            </header>
             <div
                className="relative w-full h-1/3 bg-cover bg-center"
                style={{ backgroundImage: `url(${imageSrc})` }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent"></div>
            </div>
            <div className="flex-grow py-6 px-2">
                <LoadingSpinner />
            </div>
             <div className="absolute bottom-0 left-0 right-0 py-4 px-0 bg-gradient-to-t from-gray-900 to-transparent">
                <div className="w-full px-2 flex items-center gap-4">
                    <button disabled className="flex-1 bg-gray-700 text-gray-400 font-bold py-4 px-4 rounded-lg cursor-not-allowed">{translate('common.share')}</button>
                    <button disabled className="flex-1 bg-gray-600 text-gray-400 font-bold py-4 px-4 rounded-lg cursor-not-allowed">{translate('common.scanAnother')}</button>
                </div>
            </div>
        </div>
      );
  }

  const confidencePercentage = (result.confidence * 100).toFixed(1);
  const gradeTextClass = result.grade.length > 4 ? 'text-4xl sm:text-5xl' : 'text-5xl sm:text-6xl';


  return (
    <div className="w-full h-full bg-gray-900 text-white flex flex-col font-sans">
      <header className="fixed top-0 left-0 right-0 bg-transparent z-20 w-full px-2">
          <div className="relative flex items-center justify-start w-full h-16">
              <button onClick={onScanAgain} className="text-white bg-black/40 backdrop-blur-sm rounded-full p-2 transition-colors hover:bg-black/60" aria-label={translate('common.back')}>
                  <ChevronLeftIcon className="w-7 h-7" />
              </button>
          </div>
      </header>

      <div
        className="relative w-full h-1/3 bg-cover bg-center transition-all duration-300"
        style={{ backgroundImage: `url(${activeImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent"></div>
        <div className="absolute bottom-0 left-0 pb-6 px-2 w-full">
            <div className="flex justify-between items-end">
                <div className="flex-1 min-w-0">
                    <p className="text-gray-400 text-base mb-1">{translate('common.identifiedGrade')}</p>
                    <h1 className={`${gradeTextClass} font-bold text-green-300 leading-none tracking-tighter truncate`}>{result.grade}</h1>
                </div>
                {galleryImages.length > 1 && (
                 <div className="relative flex-shrink-0 ml-4 w-28" style={{ height: showAllThumbnails ? `${Math.ceil(galleryImages.length / 2) * 3.5}rem` : '2.5rem', transition: 'height 0.5s ease-in-out' }}>
                    <div className="absolute inset-0 overflow-hidden">
                        <div className={`absolute inset-0 flex items-center justify-end`}>
                            <div className="flex items-center -space-x-4">
                                {visibleThumbnails.map((img, index) => (
                                    <img key={index} src={img} alt={`Thumbnail ${index + 1}`} className={`w-10 h-10 rounded-lg object-cover border-2 border-gray-900 transition-all duration-300 ease-in-out ${showAllThumbnails ? '-translate-x-full opacity-0' : 'translate-x-0 opacity-100'}`} style={{ transitionDelay: `${(visibleThumbnails.length - index - 1) * 50}ms` }} />
                                ))}
                                {remainingImageCount > 0 && (
                                    <button onClick={() => setShowAllThumbnails(true)} className={`w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center border-2 border-gray-900 hover:bg-green-400 transition-all duration-300 ease-in-out ${showAllThumbnails ? '-translate-x-full opacity-0' : 'translate-x-0 opacity-100'}`} style={{ transitionDelay: `${visibleThumbnails.length * 50}ms` }} aria-label={`View ${remainingImageCount} more images`}>
                                        <span className="text-white font-bold text-xs">+{remainingImageCount}</span>
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className={`absolute inset-0 grid grid-cols-2 gap-2 p-1 transition-opacity duration-300 ${showAllThumbnails ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                            {galleryImages.map((img, index) => (
                                <button key={index} onClick={() => setActiveImage(img)} className={`outline-none focus:outline-none w-12 h-12 transform transition-all duration-300 ease-out ${showAllThumbnails ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: `${index * 50}ms` }}>
                                    <img src={img} alt={`Full thumbnail ${index + 1}`} className={`w-full h-full rounded-lg object-cover transition-all duration-200 ${activeImage === img ? 'border-2 border-green-400 scale-110' : 'border-2 border-transparent'}`} />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
              )}
            </div>
          <div className="w-full bg-gray-700/50 rounded-full h-1.5 mt-3">
            <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${confidencePercentage}%` }}></div>
          </div>
          <p className="text-right text-gray-300 text-sm mt-1">{confidencePercentage}% {translate('common.confidence')}</p>
        </div>
      </div>

      <div className="flex-grow px-2 pt-4 overflow-y-auto pb-28 space-y-8 custom-scrollbar">
        <DetailSection icon={<DocumentTextIcon className="w-6 h-6 text-green-400" />} title={translate('common.description')}>
          <p className="text-gray-300 leading-relaxed">{result.description}</p>
        </DetailSection>

        <DetailSection icon={<CurrencyDollarIcon className="w-6 h-6 text-green-400" />} title={translate('common.estimatedPrice')}>
          <p className="text-xl sm:text-2xl font-semibold text-white">{result.price}</p>
        </DetailSection>

        <DetailSection icon={<WrenchScrewdriverIcon className="w-6 h-6 text-green-400" />} title={translate('common.commonUses')}>
          <ul className="space-y-2">
            {result.uses.map((use, index) => (
              <li key={index} className="flex items-start">
                <CheckCircleIcon className="w-5 h-5 text-green-400 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-300">{use}</span>
              </li>
            ))}
          </ul>
        </DetailSection>
      </div>

      <div className="absolute bottom-0 left-0 right-0 py-4 px-0 bg-gradient-to-t from-gray-900 to-transparent">
         <div className="w-full px-2 flex items-center gap-4">
            <button
              onClick={handleShare}
              className="flex-1 bg-gray-700 text-white font-bold py-4 px-4 rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
            >
              <ShareIcon className="w-5 h-5"/>
              {translate('common.share')}
            </button>
            <button
              onClick={onScanAgain}
              className="flex-1 bg-green-500 text-white font-bold py-4 px-4 rounded-lg hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 shadow-lg shadow-green-500/20"
            >
              {translate('common.scanAnother')}
            </button>
         </div>
      </div>
    </div>
  );
};

interface DetailSectionProps {
    icon: React.ReactNode;
    title: string;
    children: React.ReactNode;
}

const DetailSection: React.FC<DetailSectionProps> = ({ icon, title, children }) => (
    <div>
        <div className="flex items-center mb-3">
            {icon}
            <h3 className="text-xl font-semibold text-green-300 ml-3">{title}</h3>
        </div>
        <div className="border-l-2 border-gray-700 pl-3 ml-3">
            {children}
        </div>
    </div>
);


export default ResultsView;