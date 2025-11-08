import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { UploadIcon, CloseIcon, HelpIcon, InformationCircleIcon } from './Icons';
import { loadModel } from '../services/abacaAnalyzer';
import type { Prediction } from '../types';
import { useTranslation } from '../i18n/i18nContext';

interface CameraViewProps {
  onCapture: (imageSrc: string, prediction: Prediction) => void;
  onClose: () => void;
  shouldTriggerFileUpload: boolean; // New prop
  onFileUploadTriggered: () => void; // New prop
}

interface PredictionRowProps {
  grade: string;
  confidence: number;
  isTop: boolean;
}

const PredictionRow: React.FC<PredictionRowProps> = ({ grade, confidence, isTop }) => {
  const confidencePercentage = (confidence * 100).toFixed(1);
  return (
    <div className={`p-2 rounded-lg transition-all duration-200 ${isTop ? 'bg-green-500/20 border border-green-500' : 'bg-gray-800'}`}>
      <div className="flex justify-between items-center text-white">
        <span className={`font-bold ${isTop ? 'text-green-300' : 'text-gray-300'}`}>{grade}</span>
        <span className={`text-sm ${isTop ? 'text-white' : 'text-gray-400'}`}>{confidencePercentage}%</span>
      </div>
      <div className="w-full bg-gray-700/50 rounded-full h-1.5 mt-1">
        <div 
            className={`h-1.5 rounded-full transition-all duration-200 ${isTop ? 'bg-green-400' : 'bg-green-600'}`} 
            style={{ width: `${confidencePercentage}%` }}
        ></div>
      </div>
    </div>
  );
};

const CameraView: React.FC<CameraViewProps> = ({ onCapture, onClose, shouldTriggerFileUpload, onFileUploadTriggered }) => {
  const { translate } = useTranslation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const predictionsContainerRef = useRef<HTMLDivElement>(null);
  const [hasCamera, setHasCamera] = useState(true);
  const [model, setModel] = useState<any>(null);
  const [allPredictions, setAllPredictions] = useState<Prediction[]>([]);
  const [classLabels, setClassLabels] = useState<string[]>([]);
  const animationFrameId = useRef<number | null>(null);
  const predictionHistory = useRef<Prediction[][]>([]);
  const PREDICTION_HISTORY_SIZE = 10; // Number of frames to average for smoothing

  // Load model and get class labels
  useEffect(() => {
    loadModel().then(loadedModel => {
      setModel(loadedModel);
      const labels = loadedModel.getClassLabels();
      // Defensive check to prevent crash if labels are not an array
      if (Array.isArray(labels)) {
        setClassLabels(labels);
      } else {
        console.error("Model's class labels are not an array:", labels);
        setClassLabels([]); // Default to an empty array to avoid crashes
      }
    }).catch(err => console.error("Failed to load model for CameraView", err));
  }, []);
  
  // Setup camera
  useEffect(() => {
    let stream: MediaStream | null = null;
    const enableCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera: ", err);
        setHasCamera(false);
      }
    };

    enableCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Effect to trigger file upload directly from HomeView
  useEffect(() => {
    if (shouldTriggerFileUpload && fileInputRef.current) {
      fileInputRef.current.click();
      onFileUploadTriggered(); // Reset the trigger
    }
  }, [shouldTriggerFileUpload, onFileUploadTriggered]);


  // Prediction loop with smoothing
  useEffect(() => {
    const predict = async () => {
      if (model && videoRef.current && videoRef.current.readyState === 4 && classLabels.length > 0) {
        const predictions: Prediction[] = await model.predict(videoRef.current);
        
        predictionHistory.current.push(predictions);
        if (predictionHistory.current.length > PREDICTION_HISTORY_SIZE) {
            predictionHistory.current.shift();
        }

        if (predictionHistory.current.length > 0) {
            const probabilitySums: { [key: string]: number } = {};
            
            classLabels.forEach(label => {
                probabilitySums[label] = 0;
            });

            for (const framePredictions of predictionHistory.current) {
                for (const prediction of framePredictions) {
                    if (probabilitySums[prediction.className] !== undefined) {
                        probabilitySums[prediction.className] += prediction.probability;
                    }
                }
            }
            // Complete the prediction logic
            const averagedPredictions: Prediction[] = Object.keys(probabilitySums).map(className => {
                return {
                    className,
                    probability: probabilitySums[className] / predictionHistory.current.length
                };
            });

            // Sort predictions by probability in descending order
            averagedPredictions.sort((a, b) => b.probability - a.probability);
            setAllPredictions(averagedPredictions);
        }
      }
      animationFrameId.current = requestAnimationFrame(predict);
    };

    if (model && classLabels.length > 0) {
      animationFrameId.current = requestAnimationFrame(predict);
    }

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [model, classLabels]); // Dependencies: model and classLabels

  const handleCaptureClick = useCallback(async () => {
    if (videoRef.current && canvasRef.current && model && allPredictions.length > 0) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const imageSrc = canvas.toDataURL('image/jpeg', 0.9);
        const topPrediction = allPredictions[0];
        onCapture(imageSrc, topPrediction);
      }
    }
  }, [allPredictions, model, onCapture]);

  const handleImageUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && model && canvasRef.current) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const img = new Image();
        img.onload = async () => {
          const canvas = canvasRef.current;
          if (canvas) {
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0, img.width, img.height);
              // Predict from canvas
              const predictions: Prediction[] = await model.predict(canvas);
              predictions.sort((a, b) => b.probability - a.probability); // Sort for top prediction

              if (predictions.length > 0) {
                onCapture(reader.result as string, predictions[0]);
              } else {
                // Fallback if no prediction is made
                onCapture(reader.result as string, { className: 'Unknown', probability: 0 });
              }
            }
          }
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }, [model, onCapture]);

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const isViewDetailsButtonDisabled = useMemo(() => {
    if (!model || !hasCamera || allPredictions.length === 0) {
      return true;
    }
    const topPrediction = allPredictions[0];
    // Disable if the top prediction is 'UNCLASSIFIED' or 'EMPTY'
    return topPrediction.className === 'UNCLASSIFIED' || topPrediction.className === 'EMPTY';
  }, [model, hasCamera, allPredictions]);


  return (
    <div className="w-full h-full bg-black text-white flex flex-col font-sans">
      {/* Top Bar */}
      <div className="flex justify-between items-center py-2 px-2">
        <button onClick={onClose} className="py-2 px-0 text-gray-400 hover:text-white transition-colors" aria-label={translate('common.close')}>
          <CloseIcon className="w-7 h-7" />
        </button>
        <h2 className="text-xl font-bold text-white">{translate('common.liveClassification')}</h2>
        <button className="py-2 px-0 text-gray-400 hover:text-white transition-colors" aria-label={translate('common.info')}>
          <HelpIcon className="w-7 h-7" />
        </button>
      </div>

      {/* Video Feed / Placeholder */}
      <div className="relative flex-grow flex items-center justify-center bg-gray-800 min-h-0">
        {!hasCamera && (
          <div className="text-center py-4 px-2">
            <h3 className="text-xl font-bold text-red-400">{translate('common.cameraNotFoundTitle')}</h3>
            <p className="text-gray-300 mt-2">{translate('common.cameraNotFoundMessage')}</p>
          </div>
        )}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-contain ${hasCamera ? '' : 'hidden'}`}
        />
        {/* Hidden canvas for image capture */}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Prediction Results & Controls */}
      <div className="flex-shrink-0 py-4 px-2 bg-gray-900"> {/* Removed rounded-t-3xl and -mt-8 */}
        <h3 className="text-lg font-bold text-gray-200 mb-3">
          {translate('common.predictionGrade')}{' '}
          {allPredictions.length > 0 && (
            <span className="text-green-400">{allPredictions[0].className}</span>
          )}
        </h3>
        <div className="border-b border-gray-700 mb-3"></div> {/* Divider Line */}
        <div ref={predictionsContainerRef} className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
          {model && allPredictions.length > 0 ? (
            allPredictions.slice(0, 3).map((prediction, index) => (
              <PredictionRow
                key={prediction.className}
                grade={prediction.className}
                confidence={prediction.probability}
                isTop={index === 0}
              />
            ))
          ) : (
            <div className="text-gray-400 text-center py-4">
              {model ? translate('common.waitingForPrediction') : translate('common.loadingModel')}
            </div>
          )}
        </div>
        
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={triggerFileUpload}
            className="flex flex-col items-center justify-center py-3 px-1 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors focus: