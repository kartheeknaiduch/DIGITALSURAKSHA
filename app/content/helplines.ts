// Single source of truth for all contact numbers and portal URLs
export interface HelpContact {
  id: string;
  number?: string;
  portal?: string;
  titleEn: string;
  titleHi: string;
  titleTe: string;
  descEn: string;
  descHi: string;
  descTe: string;
  category: 'emergency' | 'cybercrime' | 'banking' | 'platform' | 'women';
  priority: number; // lower = shown first
}

export const HELPLINES: HelpContact[] = [
  {
    id: 'cyber-helpline',
    number: '1930',
    titleEn: 'National Cyber Crime Helpline',
    titleHi: 'राष्ट्रीय साइबर क्राइम हेल्पलाइन',
    titleTe: 'జాతీయ సైబర్ క్రైమ్ హెల్ప్లైన్',
    descEn: 'Toll-free, 24×7, run by I4C, Ministry of Home Affairs. Best for financial fraud, UPI/net-banking theft.',
    descHi: 'टोल-फ्री, 24×7, I4C, गृह मंत्रालय द्वारा संचालित। वित्तीय धोखाधड़ी, UPI/नेट-बैंकिंग चोरी के लिए सर्वश्रेष्ठ।',
    descTe: 'టోల్-ఫ్రీ, 24×7, I4C, హోం మంత్రిత్వ శాఖ ద్వారా నిర్వహించబడుతుంది. ఆర్థిక మోసం, UPI/నెట్-బ్యాంకింగ్ దొంగతనానికి ఉత్తమమైనది.',
    category: 'cybercrime',
    priority: 1,
  },
  {
    id: 'cyber-portal',
    portal: 'https://cybercrime.gov.in',
    titleEn: 'National Cyber Crime Reporting Portal',
    titleHi: 'राष्ट्रीय साइबर अपराध रिपोर्टिंग पोर्टल',
    titleTe: 'జాతీయ సైబర్ నేర నివేదన పోర్టల్',
    descEn: 'File a detailed complaint online — hacking, phishing, identity theft, cyberbullying. Anonymous option for crimes against women & children.',
    descHi: 'हैकिंग, फ़िशिंग, पहचान चोरी, साइबरबुलिंग के लिए ऑनलाइन विस्तृत शिकायत दर्ज करें। महिलाओं व बच्चों के विरुद्ध अपराधों के लिए गुमनाम विकल्प।',
    descTe: 'హ్యాకింగ్, ఫిషింగ్, గుర్తింపు దొంగతనం, సైబర్బుల్లింగ్ కోసం ఆన్లైన్లో వివరణాత్మక ఫిర్యాదు దాఖలు చేయండి.',
    category: 'cybercrime',
    priority: 2,
  },
  {
    id: 'police',
    number: '100',
    titleEn: 'Police Helpline',
    titleHi: 'पुलिस हेल्पलाइन',
    titleTe: 'పోలీస్ హెల్ప్లైన్',
    descEn: 'General emergency and police helpline — use if there\'s an immediate safety threat alongside the cyber incident.',
    descHi: 'सामान्य आपातकालीन व पुलिस हेल्पलाइन — साइबर घटना के साथ तत्काल सुरक्षा खतरा होने पर उपयोग करें।',
    descTe: 'సాధారణ అత్యవసర మరియు పోలీస్ హెల్ప్లైన్ — సైబర్ ఘటనతో పాటు తక్షణ భద్రతా ముప్పు ఉన్నప్పుడు ఉపయోగించండి.',
    category: 'emergency',
    priority: 3,
  },
  {
    id: 'rbi-ombudsman',
    portal: 'https://cms.rbi.org.in',
    titleEn: 'RBI Ombudsman (Banking/NBFC Disputes)',
    titleHi: 'RBI लोकपाल (बैंकिंग/NBFC विवाद)',
    titleTe: 'RBI అంబుడ్స్మన్ (బ్యాంకింగ్/NBFC వివాదాలు)',
    descEn: 'Escalate here only after your bank\'s own grievance process hasn\'t resolved things within 30 days.',
    descHi: 'केवल तब यहां जाएं जब आपके बैंक की अपनी शिकायत प्रक्रिया 30 दिनों में समाधान न दे पाई हो।',
    descTe: 'మీ బ్యాంక్ యొక్క సొంత ఫిర్యాదు ప్రక్రియ 30 రోజుల్లో పరిష్కరించలేకపోయినప్పుడు మాత్రమే ఇక్కడకు వెళ్లండి.',
    category: 'banking',
    priority: 4,
  },
  {
    id: 'gac',
    portal: 'https://gac.gov.in',
    titleEn: 'Grievance Appellate Committee',
    titleHi: 'शिकायत अपीलीय समिति',
    titleTe: 'ఫిర్యాదు అప్పీలేట్ కమిటీ',
    descEn: 'Appeal a social media/app\'s Grievance Officer decision that didn\'t satisfy you.',
    descHi: 'किसी सोशल मीडिया/ऐप के शिकायत अधिकारी के निर्णय से असंतुष्ट होने पर अपील करें।',
    descTe: 'సోశల్ మీడియా/యాప్ ఫిర్యాదు అధికారి నిర్ణయంతో మీరు సంతృప్తి చెందకపోతే అప్పీల్ చేయండి.',
    category: 'platform',
    priority: 5,
  },
  {
    id: 'women-helpline',
    number: '1091',
    titleEn: 'Women\'s Helpline',
    titleHi: 'महिला हेल्पलाइन',
    titleTe: 'మహిళా హెల్ప్లైన్',
    descEn: 'For harassment or abuse where immediate personal safety support is also needed.',
    descHi: 'उत्पीड़न या दुर्व्यवहार के लिए जहां तत्काल व्यक्तिगत सुरक्षा सहायता भी चाहिए।',
    descTe: 'వేధింపు లేదా దుర్వినియోగం కోసం తక్షణ వ్యక్తిగత భద్రతా మద్దతు కూడా అవసరమైనప్పుడు.',
    category: 'women',
    priority: 6,
  },
];
