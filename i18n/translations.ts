

export type LanguageKey = 'en' | 'tl';

interface TranslationMap {
  [key: string]: string;
}

interface AllTranslations {
  [lang: string]: TranslationMap;
}

export const translations: AllTranslations = {
  en: {
    'common.info': 'Information',
    'common.searchPlaceholder': 'Search grades',
    'common.upload': 'Upload',
    'common.scan': 'Scan',
    'common.home': 'Home',
    'common.history': 'History',
    'common.viewDetails': 'View Details', // New translation
    'common.waitingForPrediction': 'Waiting for prediction...',
    'common.orUploadImage': 'Or upload an image',
    'common.scanAnother': 'Scan Another',
    'common.identifiedGrade': 'Identified Grade',
    'common.confidence': 'Confidence',
    'common.description': 'Description',
    'common.estimatedPrice': 'Estimated Price',
    'common.commonUses': 'Common Uses',
    'common.fetchingDetails': 'Fetching grade details...',
    'common.cameraNotFoundTitle': 'Camera Not Found',
    'common.cameraNotFoundMessage': 'Could not access the camera. Please check permissions and try again, or upload an image instead.',
    'common.liveClassification': 'Live Classification',
    'common.predictionGrade': 'Prediction Grade:',
    'common.loadingModel': 'Loading classification model...',
    'common.english': 'English',
    'common.tagalog': 'Tagalog',
    'common.viewAll': 'View All',
    'common.back': 'Back', 
    'common.close': 'Close', // New common translation
    'common.share': 'Share', // New translation
    'common.noSearchResults': 'No results found.', // New translation
    'common.genericErrorDesc': 'Could not load details. Please check your network connection and try again.', // Updated to be generic

    'home.howToScanTitle': 'How to Scan Your Fiber',
    'home.prepareSampleTitle': '1. Prepare Your Sample',
    'home.prepareSampleDesc': 'Place the fiber inside the photo box, ensuring it\'s centered.',
    'home.frameFiberTitle': '2. Frame the Fiber',
    'home.frameFiberDesc': "Ensure the fiber fills most of the camera's view.",
    'home.tapToScanTitle': '3. View Details',
    'home.tapToScanDesc': "Tap the 'View Details' button to get instant grade analysis.",
    'home.allGradesTitle': 'All Grades',
    'home.abaca': 'Abaca',
    'home.pina': 'Piña',
    'home.fiberScannerDesc': 'Identify and learn about different fiber grades.', // New translation

    'allGrades.title': 'All Grades', 
    'allGrades.abacaGradesTitle': 'Abaca Grades', 
    'allGrades.pinaGradesTitle': 'Piña Grades', 
    
    'terms.title': 'Terms and Conditions',
    'terms.paragraph1': 'Welcome to Abaca Fiber Scanner! By using this mobile application, you agree to comply with and be bound by the following terms and conditions of use. Please review these terms carefully. If you do not agree to these terms, you should not use this application.',
    'terms.paragraph2': 'The content of the pages of this application is for your general information and use only. It is subject to change without notice.',
    'terms.paragraph3': 'Neither we nor any third parties provide any warranty or guarantee as to the accuracy, timeliness, performance, completeness, or suitability of the information and materials found or offered on this application for any particular purpose. You acknowledge that such information and materials may contain inaccuracies or errors and we expressly exclude liability for any such inaccuracies or errors to the fullest extent permitted by law.',
    'terms.paragraph4': 'Your use of any information or materials on this application is entirely at your own risk, for which we shall not be liable. It shall be your own responsibility to ensure that any products, services, or information available through this application meet your specific requirements.',
    'terms.paragraph5': 'This application contains material which is owned by or licensed to us. This material includes, but is not limited to, the design, layout, look, appearance, and graphics. Reproduction is prohibited other than in accordance with the copyright notice, which forms part of these terms and conditions.',
    'terms.dataPrivacyTitle': 'Data Privacy',
    'terms.dataPrivacyDesc': 'We respect your privacy. This application processes images locally on your device for classification. We do not store or transmit any personal identification information or captured images to our servers. Any data used for analysis is anonymized and processed solely to provide the service.',
    'terms.disclaimerTitle': 'Disclaimer',
    'terms.disclaimerDesc': 'The fiber grading provided by this application is based on AI model analysis and is for informational purposes only. It should not be used as the sole basis for commercial decisions. For official grading, please consult certified experts.',
    'terms.updates': 'These terms and conditions are subject to change without prior notice.',
  },
  tl: {
    'common.info': 'Impormasyon',
    'common.searchPlaceholder': 'Maghanap ng mga grado',
    'common.upload': 'Mag-upload',
    'common.scan': 'I-scan',
    'common.home': 'Tahanan',
    'common.history': 'Kasaysayan',
    'common.viewDetails': 'Tingnan ang Detalye', // New translation
    'common.waitingForPrediction': 'Naghihintay ng prediksyon...',
    'common.orUploadImage': 'O mag-upload ng larawan',
    'common.scanAnother': 'I-scan Muli',
    'common.identifiedGrade': 'Natukoy na Grado',
    'common.confidence': 'Katiyakan',
    'common.description': 'Deskripsyon',
    'common.estimatedPrice': 'Tinatayang Presyo',
    'common.commonUses': 'Karaniwang Gamit',
    'common.fetchingDetails': 'Kinukuha ang mga detalye ng grado...',
    'common.cameraNotFoundTitle': 'Hindi Nakita ang Kamera',
    'common.cameraNotFoundMessage': 'Hindi ma-access ang kamera. Pakisuri ang mga pahintulot at subukang muli, o mag-upload ng larawan sa halip.',
    'common.liveClassification': 'Live na Klasipikasyon',
    'common.predictionGrade': 'Grado ng Prediksyon:',
    'common.loadingModel': 'Naglo-load ng modelo ng klasipikasyon...',
    'common.english': 'English',
    'common.tagalog': 'Tagalog',
    'common.viewAll': 'Tingnan Lahat',
    'common.back': 'Bumalik', 
    'common.close': 'Isara', // New common translation
    'common.share': 'Ibahagi', // New translation
    'common.noSearchResults': 'Walang nakitang resulta.', // New translation
    'common.genericErrorDesc': 'Hindi ma-load ang mga detalye. Pakisuri ang iyong koneksyon sa network at subukang muli.', // Updated to be generic

    'home.howToScanTitle': 'Paano I-scan ang Iyong Hibla',
    'home.prepareSampleTitle': '1. Ihanda ang Iyong Sampol',
    'home.prepareSampleDesc': 'Ilagay ang hibla sa loob ng photo box, siguraduhin na nakasentro ito.',
    'home.frameFiberTitle': '2. I-frame ang Hibla',
    'home.frameFiberDesc': 'Siguraduhin na ang hibla ay pumupuno sa karamihan ng view ng kamera.',
    'home.tapToScanTitle': '3. Tingnan ang Detalye',
    'home.tapToScanDesc': "I-tap ang 'Tingnan ang Detalye' na button upang makakuha ng instant na pagsusuri ng grado.",
    'home.allGradesTitle': 'Lahat ng Grado',
    'home.abaca': 'Abaca',
    'home.pina': 'Piña',
    'home.fiberScannerDesc': 'Kilalanin at alamin ang iba\'t ibang grado ng hibla.', // New translation

    'allGrades.title': 'Lahat ng Grado', 
    'allGrades.abacaGradesTitle': 'Mga Grado ng Abaca', 
    'allGrades.pinaGradesTitle': 'Mga Grado ng Piña', 
    
    'terms.title': 'Mga Tuntunin at Kondisyon',
    'terms.paragraph1': 'Maligayang pagdating sa Abaca Fiber Scanner! Sa paggamit ng mobile application na ito, sumasang-ayon ka na sumunod at sumailalim sa mga sumusunod na tuntunin at kondisyon ng paggamit. Pakiusap na suriin nang mabuti ang mga tuntuning ito. Kung hindi ka sumasang-ayon sa mga tuntuning ito, hindi mo dapat gamitin ang application na ito.',
    'terms.paragraph2': 'Ang nilalaman ng mga pahina ng application na ito ay para sa iyong pangkalahatang impormasyon at paggamit lamang. Maaari itong baguhin nang walang paunang abiso.',
    'terms.paragraph3': 'Wala kaming ibinibigay na garantiya, o anumang third-party, tungkol sa katumpakan, pagiging napapanahon, pagganap, pagiging kumpleto, o pagiging angkop ng impormasyon at mga materyales na makikita o inaalok sa application na ito para sa anumang partikular na layunin. Kinikilala mo na ang naturang impormasyon at mga materyales ay maaaring maglaman ng mga kamalian o error at malinaw naming tinatanggi ang pananagutan para sa anumang naturang mga kamalian o error sa pinakamalawak na lawak na pinahihintulutan ng batas.',
    'terms.paragraph4': 'Ang iyong paggamit ng anumang impormasyon o materyales sa application na ito ay ganap na sa iyong sariling peligro, kung saan hindi kami mananagot. Responsibilidad mo na tiyakin na ang anumang mga produkto, serbisyo, o impormasyon na magagamit sa pamamagitan ng application na ito ay nakakatugon sa iyong mga partikular na kinakailangan.',
    'terms.paragraph5': 'Ang application na ito ay naglalaman ng materyal na pag-aari o lisensyado sa us. Kasama sa materyal na ito, ngunit hindi limitado sa, disenyo, layout, hitsura, at graphics. Ipinagbabawal ang pagpaparami maliban sa alinsunod sa abiso sa copyright, na bahagi ng mga tuntunin at kondisyon na ito.',
    'terms.dataPrivacyTitle': 'Pagkapribado ng Data',
    'terms.dataPrivacyDesc': 'Iginagalang namin ang iyong privacy. Ang application na ito ay nagpoproseso ng mga larawan nang lokal sa iyong device para sa klasipikasyon. Hindi kami nag-iimbak o nagpapadala ng anumang personal na impormasyon o nakuhang larawan sa aming mga server. Anumang data na ginamit para sa pagsusuri ay anonymized at pinoproseso lamang upang ibigay ang serbisyo.',
    'terms.disclaimerTitle': 'Disclaimer',
    'terms.disclaimerDesc': 'Ang paggrado ng hibla na ibinigay ng application na ito ay batay sa pagsusuri ng AI model at para sa layuning pang-impormasyon lamang. Hindi ito dapat gamitin bilang tanging batayan para sa mga desisyon sa komersyo. Para sa opisyal na paggrado, kumunsulta sa mga sertipikadong eksperto.',
    'terms.updates': 'Ang mga tuntunin at kondisyon na ito ay maaaring baguhin nang walang paunang abiso.',
  },
};