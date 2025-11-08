import React, { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import type { View, AnalysisResult, Prediction, AbacaGrade, AbacaDetails } from '../types';
// Add TranslateIcon and VideoCameraIcon to the import list
import { InformationCircleIcon, SearchIcon, UploadIcon, CameraIcon, ChevronDownIcon, WrenchScrewdriverIcon, PhotoIcon, TranslateIcon, DocumentTextIcon, VideoCameraIcon } from './Icons';
// Import useTranslation and I1nProvider
import { useTranslation } from '../i18n/i18nContext';
// Import LanguageKey
import { LanguageKey } from '../i18n/translations';
// Import db
import { db } from '../index';


interface GradeItem {
  grade: string;
  price: string;
  imageUrl: string;
}

interface HomeViewProps {
  onScanClick: () => void; // Changed from onCameraClick
  onUploadClick: () => void; // New prop for direct upload
  onViewAllGradesClick: () => void;
  abacaGrades: GradeItem[];
  pinaGrades: GradeItem[];
  onOpenTermsModal: () => void;
  onViewGradeDetails: (fiberType: 'abaca' | 'pina', grade: string, imageUrl: string) => void;
  isLoadingGrades: boolean; // New prop for skeleton loading
}

const DEFAULT_FEATURE_IMAGE_URL = 'https://placehold.co/100x100/18181b/4ade80/png?text=Fiber'; // Default placeholder

const HomeView: React.FC<HomeViewProps> = ({ onScanClick, onUploadClick, onViewAllGradesClick, abacaGrades, pinaGrades, onOpenTermsModal, onViewGradeDetails, isLoadingGrades }) => {
  const { translate, language, setLanguage } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeGradeType, setActiveGradeType] = useState('abaca');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [featureImageUrl, setFeatureImageUrl] = useState<string>(() => {
    const storedImage = localStorage.getItem('featureImage');
    return storedImage || DEFAULT_FEATURE_IMAGE_URL;
  });
  const [isLoadingFeatureImage, setIsLoadingFeatureImage] = useState<boolean>(!localStorage.getItem('featureImage')); // Re-added isLoadingFeatureImage state
  const featureImageInputRef = useRef<HTMLInputElement>(null); // Ref for hidden file input

  const currentGrades = activeGradeType === 'abaca' ? abacaGrades : pinaGrades;

  const allFiberGrades = useMemo(() => {
    return [
      ...abacaGrades.map(grade => ({ ...grade, type: 'abaca' })),
      ...pinaGrades.map(grade => ({ ...grade, type: 'pina' }))
    ];
  }, [abacaGrades, pinaGrades]);

  const filteredGrades = useMemo(() => {
    if (!searchQuery) return [];
    const lowerCaseQuery = searchQuery.toLowerCase();
    return allFiberGrades.filter(item =>
      item.grade.toLowerCase().includes(lowerCaseQuery)
    );
  }, [searchQuery, allFiberGrades]);


  const handleLanguageChange = (lang: LanguageKey) => {
    setLanguage(lang);
    setShowLanguageDropdown(false);
  };

  // Handler for uploading new feature image
  const handleFeatureImageUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result as string;

        // Optimistic UI update
        setFeatureImageUrl(base64Image);
        localStorage.setItem('featureImage', base64Image);
        setIsLoadingFeatureImage(false); // New: Set loading to false after optimistic update

        // Upload to Firebase
        try {
          await db.ref('appConfig/featureImage').set(base64Image);
          console.log("Feature image updated in Firebase.");
        } catch (error) {
          console.error("Error uploading feature image to Firebase:", error);
          // Optionally revert UI or show error
        }
      };
      reader.readAsDataURL(file);
    }
  }, []);

  // Load persisted feature image on component mount from localStorage and Firebase
  useEffect(() => {
    // Only set loading to true if localStorage didn't immediately provide an image
    if (!localStorage.getItem('featureImage')) {
        setIsLoadingFeatureImage(true);
    }

    // 2. Set up Firebase listener for real-time updates
    const featureImageRef = db.ref('appConfig/featureImage');
    const listener = featureImageRef.on('value', (snapshot: any) => {
      const dbImageUrl = snapshot.val();
      if (dbImageUrl) {
        setFeatureImageUrl(dbImageUrl);
        localStorage.setItem('featureImage', dbImageUrl);
      } else {
        setFeatureImageUrl(DEFAULT_FEATURE_IMAGE_URL); // Ensure default if nothing in Firebase
        localStorage.removeItem('featureImage');
      }
      setIsLoadingFeatureImage(false); // Set loading to false once Firebase data is processed
    }, (error: any) => {
      console.error("Firebase feature image fetch failed:", error);
      // Fallback to default or localStorage if Firebase fails
      const localFallback = localStorage.getItem('featureImage');
      if (localFallback) {
        setFeatureImageUrl(localFallback);
      } else {
        setFeatureImageUrl(DEFAULT_FEATURE_IMAGE_URL);
      }
      setIsLoadingFeatureImage(false); // Set loading to false on error
    });

    // Cleanup Firebase listener on component unmount
    return () => {
      featureImageRef.off('value', listener);
    };
  }, []);


  return (
    <div className="w-full h-full bg-black text-white flex flex-col font-sans">
      {/* Top Navigation - FIXED HEADER */}
      <header className="fixed top-0 left-0 right-0 bg-gray-900 py-4 z-20 flex items-center w-full px-2">
          <button onClick={onOpenTermsModal} className="text-gray-400 hover:text-white transition-colors px-0 py-2" aria-label={translate('common.info')}>
            <InformationCircleIcon className="w-7 h-7" />
          </button>
          <div className="relative flex items-center flex-grow ml-1">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <SearchIcon className="w-5 h-5 text-gray-500" />
            </span>
            <input
              type="search"
              placeholder={translate('common.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-gray-800 border border-gray-700 text-white placeholder-gray-500 text-sm rounded-full focus:ring-green-500 focus:border-green-500 block w-full pl-10 py-2.5 px-0.5 transition-all"
              aria-label={translate('common.searchPlaceholder')}
            />
            {searchQuery && filteredGrades.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                {filteredGrades.map((item, index) => (
                  <button
                    key={item.grade + item.type + index}
                    onClick={() => {
                      onViewGradeDetails(item.type as 'abaca' | 'pina', item.grade, item.imageUrl);
                      setSearchQuery(''); // Clear search after click
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors"
                  >
                    {item.grade} ({item.type === 'abaca' ? translate('home.abaca') : translate('home.pina')})
                  </button>
                ))}
              </div>
            )}
            {searchQuery && filteredGrades.length === 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10 p-3 text-sm text-gray-400">
                {translate('common.noSearchResults')}
              </div>
            )}
          </div>
          <button
            onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
            className="ml-1 px-0 py-2 text-gray-400 hover:text-white transition-colors flex items-center relative" // Moved relative here
            aria-label="Select Language"
            aria-expanded={showLanguageDropdown}
          >
            <TranslateIcon className="w-7 h-7" />
            <ChevronDownIcon className={`w-4 h-4 ml-1 transition-transform ${showLanguageDropdown ? 'rotate-180' : ''}`} />
            {showLanguageDropdown && (
              <div className="absolute right-0 mt-2 w-32 bg-gray-800 rounded-md shadow-lg z-20 top-full"> {/* Adjusted top-full */}
                <button
                  onClick={() => handleLanguageChange('en')}
                  className={`block w-full text-left px-4 py-2 text-sm rounded-t-md ${language === 'en' ? 'bg-green-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
                >
                  {translate('common.english')}
                </button>
                <button
                  onClick={() => handleLanguageChange('tl')}
                  className={`block w-full text-left px-4 py-2 text-sm rounded-b-md ${language === 'tl' ? 'bg-green-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
                >
                  {translate('common.tagalog')}
                </button>
              </div>
            )}
          </button>
      </header>

      {/* Main Content - Scrollable */}
      <main className="flex-grow flex flex-col items-center px-2 pb-40 overflow-y-auto overflow-x-hidden custom-scrollbar min-h-0 pt-20 space-y-4"> {/* Added pt-20 and px-2 to main */}
        {/* NEW SECTION: Fiber Scanner Banner */}
        <div className="relative w-full bg-gray-900 z-10 rounded-xl min-h-[100px] flex items-center mt-6">
          <div className="flex flex-col justify-center py-4 pl-4 pr-2 flex-1 min-w-0">
            <h2 className="text-2xl font-bold text-white tracking-tight">Fiber <span className="text-green-400">Scanner</span></h2>
            <p className="text-sm text-gray-400 mt-1">{translate('home.fiberScannerDesc')}</p>
          </div>
          <div className="w-28 flex-shrink-0" aria-hidden="true" /> {/* Spacer for the image that pops out */}
          {isLoadingFeatureImage ? (
            <div className="absolute right-[-2rem] bottom-0 h-36 w-36 bg-gray-700 rounded-full animate-pulse z-10"></div>
          ) : (
            <img
              src={featureImageUrl}
              alt="Feature"
              className="absolute right-[-2.1rem] bottom-0 h-40 w-36 object-contain rounded-full z-10"
            />
          )}
          {/* Hidden input for feature image upload */}
          <input
            type="file"
            accept="image/*"
            ref={featureImageInputRef}
            onChange={handleFeatureImageUpload}
            className="hidden"
          />
          {/* Button to trigger feature image upload, positioned for user interaction */}
          <button
            onClick={() => featureImageInputRef.current?.click()}
            className="absolute right-24 bottom-36 text-gray-400 hover:text-white transition-colors z-30 p-1 bg-gray-800/60 rounded-full backdrop-blur-sm text-xs"
            aria-label="Change banner image"
            title="Change banner image"
          >
            <PhotoIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="w-full flex justify-around items-center gap-4"> {/* Removed px-2, padding now from parent main */}
           <button onClick={onUploadClick} className="flex flex-col items-center justify-center py-3 px-1 w-full space-y-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500" aria-label={translate('common.upload')}>
              <UploadIcon className="w-8 h-8 text-green-400" />
              <span className="text-sm font-semibold text-white">{translate('common.upload')}</span>
          </button>
           <button onClick={onScanClick} className="flex flex-col items-center justify-center py-3 px-1 w-full space-y-2 bg-green-600 rounded-lg hover:bg-green-500 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500" aria-label={translate('common.scan')}>
              <CameraIcon className="w-8 h-8 text-white" />
              <span className="text-sm font-semibold text-white">{translate('common.scan')}</span>
          </button>
        </div>

        {/* How-to Guide */}
        <div className="w-full text-left">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-200">{translate('home.howToScanTitle')}</h2>
              <button className="text-gray-400 hover:text-white transition-colors" aria-label="Watch tutorial video">
                <VideoCameraIcon className="w-7 h-7" />
              </button>
            </div>
            <div className="space-y-4">
                <HowToStep icon={<PhotoIcon className="w-7 h-7 text-green-400" />} title={translate('home.prepareSampleTitle')} description={translate('home.prepareSampleDesc')} />
                <HowToStep icon={<CameraIcon className="w-7 h-7 text-green-400" />} title={translate('home.frameFiberTitle')} description={translate('home.frameFiberDesc')} />
                <HowToStep icon={<DocumentTextIcon className="w-7 h-7 text-green-400" />} title={translate('home.tapToScanTitle')} description={translate('home.tapToScanDesc')} />
            </div>
        </div>

        {/* Grades Section */}
        <div className="w-full">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-200">{translate('home.allGradesTitle')}</h2>
                <button onClick={onViewAllGradesClick} className="text-green-400 font-semibold hover:text-green-300 transition-colors">
                    {translate('common.viewAll')}
                </button>
            </div>
            {/* Segmented Control */}
            <div className="flex justify-start mb-4">
                <div className="inline-flex bg-gray-800 rounded-full p-1">
                    <button onClick={() => setActiveGradeType('abaca')} className={`px-4 py-1 text-sm font-medium rounded-full transition-colors ${activeGradeType === 'abaca' ? 'bg-green-600 text-white shadow-sm' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}>{translate('home.abaca')}</button>
                    <button onClick={() => setActiveGradeType('pina')} className={`px-4 py-1 text-sm font-medium rounded-full transition-colors ${activeGradeType === 'pina' ? 'bg-green-600 text-white shadow-sm' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}>{translate('home.pina')}</button>
                </div>
            </div>
            {/* Horizontal Scroll for Grades */}
            <div ref={scrollContainerRef} className="flex space-x-4 overflow-x-auto pb-4 custom-scrollbar">
                {isLoadingGrades ? (
                    Array.from({ length: 4 }).map((_, index) => (
                      <div key={index} className="relative flex-shrink-0 w-36 h-36 rounded-2xl overflow-hidden bg-gray-800 border border-gray-700 shadow-lg animate-pulse">
                          <div className="w-full h-full bg-gray-700"></div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                          <div className="absolute bottom-0 left-0 p-3 w-full">
                              <div className="h-5 bg-gray-600 rounded w-3/4 mb-1"></div>
                              <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                          </div>
                          <div className="absolute top-3 right-3 p-1.5 bg-gray-700 rounded-full w-8 h-8"></div>
                      </div>
                    ))
                ) : (
                    currentGrades.slice(0, 6).map(item => (
                        <div
                            key={item.grade}
                            onClick={() => onViewGradeDetails(activeGradeType as 'abaca' | 'pina', item.grade, item.imageUrl)}
                            className="flex-shrink-0 w-36 h-36 rounded-2xl overflow-hidden relative group cursor-pointer bg-gray-800 border border-gray-700 hover:border-green-600 transition-all duration-200 shadow-lg"
                        >
                            <img src={item.imageUrl} alt={item.grade} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                            <div className="absolute bottom-0 left-0 p-3 w-full">
                                <h3 className="text-white font-bold text-lg leading-tight">{item.grade}</h3>
                                <p className="text-sm text-gray-300 mt-0.5">{item.price}</p>
                            </div>
                            <div
                              className="absolute top-3 right-3 p-1.5 bg-black/60 rounded-full backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20"
                              aria-label={translate('common.info')}
                            >
                              <InformationCircleIcon className="w-6 h-6" />
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
      </main>
    </div>
  );
};


interface HowToStepProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const HowToStep: React.FC<HowToStepProps> = ({ icon, title, description }) => (
    <div className="flex items-start bg-gray-800 p-3 rounded-lg">
        <div className="flex-shrink-0 mr-4 mt-1">
            {icon}
        </div>
        <div>
            <h3 className="font-bold text-base text-white">{title}</h3>
            <p className="text-gray-400 text-sm">{description}</p>
        </div>
    </div>
);


export default HomeView;