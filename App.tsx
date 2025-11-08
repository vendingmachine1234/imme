import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import type { View, AnalysisResult, Prediction, AbacaGrade, AbacaDetails } from './types';
import BottomNav from './components/BottomNav';
import CameraView from './components/CameraView';
import ResultsView from './components/ResultsView';
import AllGradesView from './components/AllGradesView';
import TermsAndConditionsModal from './components/TermsAndConditionsModal';
import SearchResultsView from './components/SearchResultsView';
import HomeView from './components/HomeView'; // Correctly import HomeView
import { getFiberDetails } from './services/mockFiberService';
import { db } from './index';
import { getImage, storeImage } from './services/imageCacheService';
import { useTranslation, I18nProvider } from './i18n/i18nContext';
import { LanguageKey } from './i18n/translations';


interface GradeItem {
  grade: string;
  price: string;
  imageUrl: string;
}

// Initial Data (will be overridden by Firebase if available)
const initialAbacaGradesData: GradeItem[] = [
    { grade: 'S2', price: '$2.80 - $3.10', imageUrl: 'https://placehold.co/300x300/18181b/4ade80/png?text=S2' },
    { grade: 'S3', price: '$2.50 - $2.80', imageUrl: 'https://placehold.co/300x300/18181b/4ade80/png?text=S3' },
    { grade: 'H', price: '$1.70 - $2.00', imageUrl: 'https://placehold.co/300x300/18181b/4ade80/png?text=H' },
    { grade: 'G', price: '$2.10 - $2.45', imageUrl: 'https://placehold.co/300x300/18181b/4ade80/png?text=G' },
    { grade: 'JK', price: '$1.65 - $1.95', imageUrl: 'https://placehold.co/300x300/18181b/4ade80/png?text=JK' },
    { grade: 'M1', price: '$1.90 - $2.20', imageUrl: 'https://placehold.co/300x300/18181b/4ade80/png?text=M1' },
    { grade: 'Y1', price: '$2.20 - $2.50', imageUrl: 'https://placehold.co/300x300/18181b/4ade80/png?text=Y1' },
    { grade: 'Y2', price: '$1.80 - $2.10', imageUrl: 'https://placehold.co/300x300/18181b/4ade80/png?text=Y2' },
    { grade: 'I', price: '$1.60 - $1.90', imageUrl: 'https://placehold.co/300x300/18181b/4ade80/png?text=I' },
    { grade: 'EF', price: '$1.50 - $1.75', imageUrl: 'https://placehold.co/300x300/18181b/4ade80/png?text=EF' },
];

const initialPinaGradesData: GradeItem[] = [
    { grade: 'Lino', price: '$20 - $25 /m', imageUrl: 'https://placehold.co/300x300/18181b/facc15/png?text=Lino' },
    { grade: 'Bastos', price: '$15 - $20 /m', imageUrl: 'https://placehold.co/300x300/18181b/facc15/png?text=Bastos' },
    { grade: 'Seda', price: '$25 - $30 /m', imageUrl: 'https://placehold.co/300x300/18181b/facc15/png?text=Seda' },
    { grade: 'Jusi', price: '$18 - $22 /m', imageUrl: 'https://placehold.co/300x300/18181b/facc15/png?text=Jusi' }
];


const AppContent: React.FC = () => {
  const { translate } = useTranslation();
  const [view, setView] = useState<View>('home');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [showTermsModal, setShowTermsModal] = useState(false);

  // States for grade data, initialized with hardcoded values (which will be overwritten by cache/Firebase)
  const [abacaGrades, setAbacaGrades] = useState<GradeItem[]>(initialAbacaGradesData);
  const [pinaGrades, setPinaGrades] = useState<GradeItem[]>(initialPinaGradesData);

  // New loading states for all grades data
  const [isLoadingGrades, setIsLoadingGrades] = useState(true);
  const initialAbacaFirebaseLoadComplete = useRef(false);
  const initialPinaFirebaseLoadComplete = useRef(false);

  // State for direct upload from HomeView
  const [triggerUploadInCameraView, setTriggerUploadInCameraView] = useState(false);

  // New state for search results
  const [searchedGradeName, setSearchedGradeName] = useState<string | null>(null);
  const [searchedFiberType, setSearchedFiberType] = useState<'abaca' | 'pina' | null>(null);
  const [searchedImageUrl, setSearchedImageUrl] = useState<string | null>(null);
  const [searchAnalysisResult, setSearchAnalysisResult] = useState<AbacaDetails | null>(null);

  // New state to track the view from which SearchResultsView was opened
  const [previousView, setPreviousView] = useState<View | null>(null);

  // Firebase listener for real-time image updates and initial data load
  useEffect(() => {
    // Function to load initial images from cache, updating state immediately.
    // These will be overridden by Firebase listeners if newer data is available.
    const loadCachedImages = async () => {
      const cachedAbacaGrades = [...initialAbacaGradesData];
      for (let i = 0; i < cachedAbacaGrades.length; i++) {
        const key = `abaca-${cachedAbacaGrades[i].grade}`;
        const cachedImage = await getImage(key);
        if (cachedImage) {
          cachedAbacaGrades[i] = { ...cachedAbacaGrades[i], imageUrl: cachedImage };
        }
      }
      setAbacaGrades(cachedAbacaGrades);

      const cachedPinaGrades = [...initialPinaGradesData];
      for (let i = 0; i < cachedPinaGrades.length; i++) {
        const key = `pina-${cachedPinaGrades[i].grade}`;
        const cachedImage = await getImage(key);
        if (cachedImage) {
          cachedPinaGrades[i] = { ...cachedPinaGrades[i], imageUrl: cachedImage };
        }
      }
      setPinaGrades(cachedPinaGrades);
    };

    loadCachedImages();

    const unsubscribeAbaca = db.ref('fibers/abaca').on('value', (snapshot: any) => {
      const dbAbacaGrades = snapshot.val();
      setAbacaGrades(prevGrades =>
        initialAbacaGradesData.map(initialGrade => {
          const dbData = dbAbacaGrades?.[initialGrade.grade]; // Use optional chaining
          let imageUrl = initialGrade.imageUrl;

          if (dbData && dbData.imageUrl) {
            imageUrl = dbData.imageUrl;
            // If it's a data URL, store it in cache
            if (imageUrl.startsWith('data:')) {
              storeImage(`abaca-${initialGrade.grade}`, imageUrl);
            }
          }
          return { ...initialGrade, imageUrl: imageUrl };
        })
      );
      // Mark initial Firebase load for Abaca as complete
      if (!initialAbacaFirebaseLoadComplete.current) {
          initialAbacaFirebaseLoadComplete.current = true;
          if (initialPinaFirebaseLoadComplete.current) {
              setIsLoadingGrades(false); // Set loading to false if Piña is also loaded
          }
      }
    });

    const unsubscribePina = db.ref('fibers/pina').on('value', (snapshot: any) => {
      const dbPinaGrades = snapshot.val();
      setPinaGrades(prevGrades =>
        initialPinaGradesData.map(initialGrade => {
          const dbData = dbPinaGrades?.[initialGrade.grade]; // Use optional chaining
          let imageUrl = initialGrade.imageUrl;

          if (dbData && dbData.imageUrl) {
            imageUrl = dbData.imageUrl;
            // If it's a data URL, store it in cache
            if (imageUrl.startsWith('data:')) {
              storeImage(`pina-${initialGrade.grade}`, imageUrl);
            }
          }
          return { ...initialGrade, imageUrl: imageUrl };
        })
      );
      // Mark initial Firebase load for Piña as complete
      if (!initialPinaFirebaseLoadComplete.current) {
          initialPinaFirebaseLoadComplete.current = true;
          if (initialAbacaFirebaseLoadComplete.current) {
              setIsLoadingGrades(false); // Set loading to false if Abaca is also loaded
          }
      }
    });

    return () => {
      db.ref('fibers/abaca').off('value', unsubscribeAbaca);
      db.ref('fibers/pina').off('value', unsubscribePina);
    };
  }, []); // Empty dependency array means this runs once on mount

  // Handler for updating a grade's image in Firebase and local cache
  const handleUpdateGradeImage = useCallback(async (fiberType: 'abaca' | 'pina', grade: string, file: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const base64Image = reader.result as string;

      // 1. Store the new image in IndexedDB immediately
      await storeImage(`${fiberType}-${grade}`, base64Image);
      console.log(`Image for ${fiberType} ${grade} cached locally.`);

      // 2. Update local state immediately for instant UI feedback
      if (fiberType === 'abaca') {
        setAbacaGrades(prevGrades =>
          prevGrades.map(item =>
            item.grade === grade ? { ...item, imageUrl: base64Image } : item
          )
        );
      } else { // pina
        setPinaGrades(prevGrades =>
          prevGrades.map(item =>
            item.grade === grade ? { ...item, imageUrl: base64Image } : item
          )
        );
      }

      // 3. Then, upload the image to Firebase
      try {
        await db.ref(`fibers/${fiberType}/${grade}/imageUrl`).set(base64Image);
        console.log(`Image for ${fiberType} ${grade} updated in Firebase.`);
      } catch (error) {
        console.error("Error uploading image to Firebase:", error);
        // If Firebase upload fails, consider reverting local state or showing an error.
        // For now, the app will eventually resynchronize if the Firebase listener is active.
      } finally {
        // Ensure any uploading state in AllGradesView is reset if it's dependent on this callback finishing
        // (the AllGradesView component currently manages its own uploadingGrade state)
      }
    };
  }, []);


  const handleScanClick = useCallback(() => {
    setTriggerUploadInCameraView(false); // Ensure upload is not triggered
    setView('camera');
  }, []);

  const handleUploadFromHomeClick = useCallback(() => {
    setTriggerUploadInCameraView(true); // Trigger upload
    setView('camera');
  }, []);

  const onFileUploadTriggered = useCallback(() => {
    setTriggerUploadInCameraView(false); // Reset the trigger after it's used
  }, []);


  const handleCloseCamera = useCallback(() => {
    setView('home');
    setCapturedImage(null);
    setAnalysisResult(null); // Clear previous camera results
    setTriggerUploadInCameraView(false); // Also reset if camera is closed manually
  }, []);

  const handleCapture = useCallback(async (imageSrc: string, prediction: Prediction) => {
    setCapturedImage(imageSrc);
    setAnalysisResult(null); // Show loading state in ResultsView
    setView('results');

    try {
      const grade = prediction.className as AbacaGrade;
      // Explicitly set fiberType to 'abaca' here as the model is for abaca only
      const details = await getFiberDetails('abaca', grade);
      setAnalysisResult({
        grade,
        confidence: prediction.probability,
        ...details
      });
    } catch (error: any) {
      console.error("Failed to get abaca details:", error);
      // Set a fallback result on error without Gemini specific messages
      setAnalysisResult({
        grade: prediction.className as AbacaGrade,
        confidence: prediction.probability,
        description: translate('common.genericErrorDesc'), // Use a generic error message
        price: "N/A",
        uses: ["-"]
      });
    }
  }, [translate]);
  
  const handleScanAgain = useCallback(() => {
      setCapturedImage(null);
      setAnalysisResult(null);
      setView('camera');
  }, []);

  const handleViewAllGradesClick = useCallback(() => {
    setView('allGrades');
  }, []);

  const handleBackFromAllGrades = useCallback(() => {
    setView('home');
  }, []);

  const handleOpenTermsModal = useCallback(() => {
    setShowTermsModal(true);
  }, []);

  const handleCloseTermsModal = useCallback(() => {
    setShowTermsModal(false);
  }, []);

  // Renamed from handleSearchGradeClick to handleViewGradeDetails
  const handleViewGradeDetails = useCallback(async (fiberType: 'abaca' | 'pina', grade: string, imageUrl: string) => {
    setPreviousView(view); // Store the current view before navigating to search results
    setSearchedGradeName(grade);
    setSearchedFiberType(fiberType);
    setSearchedImageUrl(imageUrl);
    setSearchAnalysisResult(null); // Show loading state in SearchResultsView
    setView('searchResults');

    try {
      const details = await getFiberDetails(fiberType, grade);
      setSearchAnalysisResult(details);
    } catch (error: any) {
      console.error(`Failed to get ${fiberType} details for ${grade}:`, error);
      setSearchAnalysisResult({
        description: translate('common.genericErrorDesc'), // Use a generic error message
        price: "N/A",
        uses: ["-"]
      });
    }
  }, [view, translate]); // Added `view` and `translate` to dependencies

  const handleBackFromSearchResults = useCallback(() => {
    if (previousView === 'allGrades') {
      setView('allGrades');
    } else {
      setView('home');
    }
    setSearchedGradeName(null);
    setSearchedFiberType(null);
    setSearchedImageUrl(null);
    setSearchAnalysisResult(null);
    setPreviousView(null); // Clear previous view
  }, [previousView]); // Added `previousView` to dependencies


  const renderContent = () => {
    switch (view) {
      case 'camera':
        return <CameraView onCapture={handleCapture} onClose={handleCloseCamera} shouldTriggerFileUpload={triggerUploadInCameraView} onFileUploadTriggered={onFileUploadTriggered} />;
      case 'results':
        return capturedImage ? <ResultsView result={analysisResult} imageSrc={capturedImage} onScanAgain={handleScanAgain} /> : <HomeView onScanClick={handleScanClick} onUploadClick={handleUploadFromHomeClick} onViewAllGradesClick={handleViewAllGradesClick} abacaGrades={abacaGrades} pinaGrades={pinaGrades} onOpenTermsModal={handleOpenTermsModal} onViewGradeDetails={handleViewGradeDetails} isLoadingGrades={isLoadingGrades} />;
      case 'allGrades':
        return <AllGradesView onBack={handleBackFromAllGrades} abacaGrades={abacaGrades} pinaGrades={pinaGrades} onViewGradeDetails={handleViewGradeDetails} onUpdateGradeImage={handleUpdateGradeImage} isLoadingGrades={isLoadingGrades} />;
      case 'searchResults':
        return searchedGradeName && searchedImageUrl ? (
          <SearchResultsView 
            fiberType={searchedFiberType || 'abaca'}
            grade={searchedGradeName} 
            imageSrc={searchedImageUrl} 
            result={searchAnalysisResult} 
            onBackHome={handleBackFromSearchResults} 
          />
        ) : <HomeView onScanClick={handleScanClick} onUploadClick={handleUploadFromHomeClick} onViewAllGradesClick={handleViewAllGradesClick} abacaGrades={abacaGrades} pinaGrades={pinaGrades} onOpenTermsModal={handleOpenTermsModal} onViewGradeDetails={handleViewGradeDetails} isLoadingGrades={isLoadingGrades} />;
      case 'home':
      default:
        return <HomeView onScanClick={handleScanClick} onUploadClick={handleUploadFromHomeClick} onViewAllGradesClick={handleViewAllGradesClick} abacaGrades={abacaGrades} pinaGrades={pinaGrades} onOpenTermsModal={handleOpenTermsModal} onViewGradeDetails={handleViewGradeDetails} isLoadingGrades={isLoadingGrades} />;
    }
  };

  return (
    <div className="h-screen w-screen bg-gray-900 flex flex-col font-sans overflow-hidden">
      <div className="relative flex-grow h-full">
        <div className="w-full h-full bg-black">
          {renderContent()}
        </div>
      </div>
      {(view === 'home') && ( // Only show bottom nav on home
        <div className="absolute bottom-0 left-0 right-0 z-30">
          <BottomNav onCameraClick={handleScanClick} /> {/* Changed to handleScanClick */}
        </div>
      )}
      {/* Render the modal here */}
      <TermsAndConditionsModal isOpen={showTermsModal} onClose={handleCloseTermsModal} />
    </div>
  );
};

const App: React.FC = () => (
  <I18nProvider>
    <AppContent />
  </I18nProvider>
);

export default App;