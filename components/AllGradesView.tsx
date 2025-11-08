import React, { useState, useRef } from 'react';
import { useTranslation } from '../i18n/i18nContext';
import { ChevronLeftIcon, PhotoIcon, InformationCircleIcon } from './Icons';

interface GradeItem {
    grade: string;
    price: string;
    imageUrl: string;
}

interface AllGradesViewProps {
    onBack: () => void;
    abacaGrades: GradeItem[];
    pinaGrades: GradeItem[];
    onViewGradeDetails: (fiberType: 'abaca' | 'pina', grade: string, imageUrl: string) => void;
    onUpdateGradeImage: (fiberType: 'abaca' | 'pina', grade: string, file: File) => void;
    isLoadingGrades: boolean;
}

// Skeleton card reflecting the new design
const SkeletonGradeItem: React.FC = () => {
    return (
        <div className="bg-gray-800 rounded-xl overflow-hidden animate-pulse">
            <div className="w-full h-32 bg-gray-700"></div>
            <div className="p-3">
                <div className="h-6 bg-gray-600 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2"></div>
            </div>
        </div>
    );
};


const AllGradesView: React.FC<AllGradesViewProps> = ({ onBack, abacaGrades, pinaGrades, onViewGradeDetails, onUpdateGradeImage, isLoadingGrades }) => {
    const { translate } = useTranslation();
    const [activeFiberType, setActiveFiberType] = useState<'abaca' | 'pina'>('abaca');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadingGrade, setUploadingGrade] = useState<{ fiberType: 'abaca' | 'pina', grade: string } | null>(null);

    const handleImageClick = (fiberType: 'abaca' | 'pina', grade: string) => {
        setUploadingGrade({ fiberType, grade });
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && uploadingGrade) {
            try {
                await onUpdateGradeImage(uploadingGrade.fiberType, uploadingGrade.grade, file);
            } catch (error) {
                console.error("Failed to upload image:", error);
            } finally {
                setUploadingGrade(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            }
        }
    };

    const renderGradeGrid = (grades: GradeItem[], fiberType: 'abaca' | 'pina') => (
        <div className="grid grid-cols-2 gap-4">
            {isLoadingGrades ? (
                Array.from({ length: 8 }).map((_, index) => <SkeletonGradeItem key={index} />)
            ) : (
                grades.map((item) => {
                    const isUploading = uploadingGrade?.fiberType === fiberType && uploadingGrade?.grade === item.grade;
                    return (
                        <div key={`${fiberType}-${item.grade}`} className="flex flex-col">
                           <div
                             onClick={() => onViewGradeDetails(fiberType, item.grade, item.imageUrl)}
                             className="relative w-full h-32 rounded-xl overflow-hidden cursor-pointer bg-gray-700 group transition-transform active:scale-95"
                           >
                                {isUploading ? (
                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 z-10">
                                        <svg className="animate-spin h-8 w-8 text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    </div>
                                ) : (
                                    <>
                                        <img src={item.imageUrl} alt={`${item.grade} Fiber`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                        {/* Overlay for details icon on hover */}
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                            <InformationCircleIcon className="w-10 h-10 text-white" />
                                        </div>
                                    </>
                                )}
                           </div>
                           <div className="pt-2">
                               <h3 className="text-white font-semibold text-base leading-tight">{item.grade}</h3>
                               <p className="text-xs text-gray-400">{item.price}</p>
                           </div>
                           <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleImageClick(fiberType, item.grade);
                                }}
                                className="mt-2 flex items-center justify-center gap-2 w-full text-center px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-md text-white text-xs font-semibold transition-colors"
                                aria-label={`Change image for ${item.grade}`}
                            >
                                <PhotoIcon className="w-4 h-4" />
                                Change
                            </button>
                        </div>
                    );
                })
            )}
        </div>
    );

    const activeGrades = activeFiberType === 'abaca' ? abacaGrades : pinaGrades;

    return (
        <div className="w-full h-full bg-black text-white flex flex-col font-sans">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 bg-black z-20 w-full px-2">
                <div className="flex items-center justify-between w-full h-16">
                    {/* Left side: Back button and Title */}
                    <div className="flex items-center gap-2">
                        <button onClick={onBack} className="text-gray-400 hover:text-white transition-colors p-2 -ml-2" aria-label={translate('common.back')}>
                            <ChevronLeftIcon className="w-7 h-7" />
                        </button>
                        <h2 className="text-xl font-bold text-white">
                            {translate('allGrades.title')}
                        </h2>
                    </div>

                    {/* Right side: Fiber type selector */}
                    <div className="inline-flex bg-gray-800 rounded-full p-1 flex-shrink-0">
                        <button onClick={() => setActiveFiberType('abaca')} className={`px-4 py-1 text-sm font-medium rounded-full transition-all ${activeFiberType === 'abaca' ? 'bg-green-600 text-white shadow' : 'text-gray-400'}`}>{translate('home.abaca')}</button>
                        <button onClick={() => setActiveFiberType('pina')} className={`px-4 py-1 text-sm font-medium rounded-full transition-all ${activeFiberType === 'pina' ? 'bg-green-600 text-white shadow' : 'text-gray-400'}`}>{translate('home.pina')}</button>
                    </div>
                </div>
            </header>

            {/* Main Content - Scrollable */}
            <main className="flex-grow flex flex-col px-2 pb-4 overflow-y-auto custom-scrollbar min-h-0 pt-20">
                {renderGradeGrid(activeGrades, activeFiberType)}
            </main>
            
            {/* Hidden file input */}
            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
            />
        </div>
    );
};

export default AllGradesView;