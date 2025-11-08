
import React from 'react';
import { useTranslation } from '../i18n/i18nContext';
import { CloseIcon } from './Icons';

interface TermsAndConditionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TermsAndConditionsModal: React.FC<TermsAndConditionsModalProps> = ({ isOpen, onClose }) => {
  const { translate } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center py-4 px-2 bg-black bg-opacity-75 backdrop-blur-sm">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-sm max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center py-4 px-4 border-b border-gray-700 flex-shrink-0">
          <h2 className="text-xl font-bold text-white">{translate('terms.title')}</h2>
          <button
            onClick={onClose}
            className="py-2 px-0 text-gray-400 hover:text-white transition-colors"
            aria-label={translate('common.close')}
          >
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="py-4 px-4 overflow-y-auto text-gray-300 flex-grow custom-scrollbar">
          <p className="mb-4">{translate('terms.paragraph1')}</p>
          <p className="mb-4">{translate('terms.paragraph2')}</p>
          <p className="mb-4">{translate('terms.paragraph3')}</p>
          <p className="mb-4">{translate('terms.paragraph4')}</p>
          <p className="mb-4">{translate('terms.paragraph5')}</p>
          <h3 className="text-lg font-semibold text-white mb-2">{translate('terms.dataPrivacyTitle')}</h3>
          <p className="mb-4">{translate('terms.dataPrivacyDesc')}</p>
          <h3 className="text-lg font-semibold text-white mb-2">{translate('terms.disclaimerTitle')}</h3>
          <p className="mb-4">{translate('terms.disclaimerDesc')}</p>
          <p className="mb-4">{translate('terms.updates')}</p>
        </div>

        {/* Footer (Optional, could have an "Accept" button) */}
        <div className="py-4 px-4 border-t border-gray-700 flex-shrink-0 text-right">
          <button
            onClick={onClose}
            className="bg-green-500 text-white px-2 py-2 rounded-lg hover:bg-green-600 transition-colors"
          >
            {translate('common.close')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditionsModal;
