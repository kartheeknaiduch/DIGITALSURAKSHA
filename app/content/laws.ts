// Laws content — store with last_verified_on to remind team to check for amendments
export type LawCategory = 'identity' | 'finance' | 'harassment' | 'data' | 'security';

export interface LawSection {
  section: string;
  titleEn: string;
  descEn: string;
  descHi: string;
  descTe: string;
}

export interface LawCard {
  id: string;
  category: LawCategory;
  titleEn: string;
  titleHi: string;
  titleTe: string;
  sections: LawSection[];
  lastVerifiedOn: string; // ISO date
}

export const LAW_CATEGORIES: { key: LawCategory | 'all'; labelEn: string; labelHi: string; labelTe: string }[] = [
  { key: 'all', labelEn: 'All', labelHi: 'सभी', labelTe: 'అన్నీ' },
  { key: 'identity', labelEn: 'Identity & Phishing', labelHi: 'पहचान व फ़िशिंग', labelTe: 'గుర్తింపు & ఫిషింగ్' },
  { key: 'finance', labelEn: 'Financial Fraud', labelHi: 'वित्तीय धोखाधड़ी', labelTe: 'ఆర్థిక మోసం' },
  { key: 'harassment', labelEn: 'Harassment & Content', labelHi: 'उत्पीड़न व सामग्री', labelTe: 'వేధింపులు & కంటెంట్' },
  { key: 'data', labelEn: 'Data & Privacy', labelHi: 'डेटा व गोपनीयता', labelTe: 'డేటా & గోప్యత' },
  { key: 'security', labelEn: 'Hacking & Infrastructure', labelHi: 'हैकिंग व अवसंरचना', labelTe: 'హ్యాకింగ్ & మౌలిక సదుపాయాలు' },
];

export const LAWS: LawCard[] = [
  {
    id: 'identity-theft',
    category: 'identity',
    titleEn: 'Identity Theft & OTP/Password Misuse',
    titleHi: 'पहचान चोरी व OTP/पासवर्ड दुरुपयोग',
    titleTe: 'గుర్తింపు దొంగతనం & OTP/పాస్వర్డ్ దుర్వినియోగం',
    sections: [
      {
        section: 'Sec 66C, IT Act',
        titleEn: 'Identity Theft',
        descEn: 'Fraudulent use of another person\'s password, digital signature, or unique ID. Up to 3 years jail + ₹1 lakh fine.',
        descHi: 'किसी और के पासवर्ड, डिजिटल हस्ताक्षर या अद्वितीय पहचान का धोखे से उपयोग। 3 साल तक की जेल + ₹1 लाख जुर्माना।',
        descTe: 'మరొకరి పాస్వర్డ్, డిజిటల్ సంతకం లేదా ప్రత్యేక గుర్తింపును మోసపూరితంగా ఉపయోగించడం. 3 సంవత్సరాల వరకు జైలు + ₹1 లక్ష జరిమానా.',
      },
      {
        section: 'Sec 66D, IT Act',
        titleEn: 'Cheating by Personation',
        descEn: 'Using a computer resource to cheat by impersonation — phishing, vishing, fake-caller fraud. Up to 3 years jail + ₹1 lakh fine.',
        descHi: 'कंप्यूटर संसाधन के माध्यम से प्रतिरूपण द्वारा धोखाधड़ी — फ़िशिंग, विशिंग, फर्जी-कॉलर धोखाधड़ी। 3 साल तक जेल + ₹1 लाख जुर्माना।',
        descTe: 'కంప్యూటర్ వనరు ద్వారా వ్యక్తిత్వ మోసం — ఫిషింగ్, విషింగ్, నకిలీ-కాలర్ మోసం. 3 సంవత్సరాల వరకు జైలు + ₹1 లక్ష జరిమానా.',
      },
      {
        section: 'Sec 419, IPC / BNS 2023',
        titleEn: 'Cheating by Personation (General Law)',
        descEn: 'Cheating by personation under general criminal law, invoked alongside IT Act sections in most FIRs.',
        descHi: 'सामान्य आपराधिक कानून के तहत प्रतिरूपण द्वारा धोखाधड़ी, अधिकांश FIR में IT अधिनियम के साथ।',
        descTe: 'సాధారణ నేర చట్టం కింద వ్యక్తిత్వ మోసం, చాలా FIRలలో IT చట్టం సెక్షన్లతో పాటు.',
      },
    ],
    lastVerifiedOn: '2025-01-15',
  },
  {
    id: 'financial-fraud',
    category: 'finance',
    titleEn: 'Unauthorized Access & Digital Payment Fraud',
    titleHi: 'अनधिकृत पहुंच व डिजिटल भुगतान धोखाधड़ी',
    titleTe: 'అనధికార ప్రవేశం & డిజిటల్ చెల్లింపు మోసం',
    sections: [
      {
        section: 'Sec 43, IT Act',
        titleEn: 'Unauthorized Access',
        descEn: 'Unauthorized access to a computer/account and resulting damage — basis for compensation claims in fraud cases.',
        descHi: 'किसी कंप्यूटर/खाते तक अनधिकृत पहुंच और उससे हुई क्षति — धोखाधड़ी मामलों में मुआवज़े के दावे का आधार।',
        descTe: 'కంప్యూటర్/ఖాతాకు అనధికార ప్రవేశం మరియు దాని వల్ల కలిగిన నష్టం — మోసం కేసుల్లో పరిహారం క్లెయిమ్లకు ఆధారం.',
      },
      {
        section: 'Sec 66, IT Act',
        titleEn: 'Computer-Related Offences',
        descEn: 'Dishonest or fraudulent acts under Sec 43. Up to 3 years jail or fine, or both.',
        descHi: 'धारा 43 के तहत बेईमानी/धोखाधड़ी वाले कृत्य। 3 साल तक जेल या जुर्माना, या दोनों।',
        descTe: 'సెక్షన్ 43 కింద మోసపూరిత చర్యలు. 3 సంవత్సరాల వరకు జైలు లేదా జరిమానా, లేదా రెండూ.',
      },
      {
        section: 'RBI Digital Lending Guidelines, 2022',
        titleEn: 'Digital Lending Regulations',
        descEn: 'Every lending app/NBFC must run a grievance mechanism and disclose the lender\'s name — legal hook against fake loan apps.',
        descHi: 'हर लेंडिंग ऐप/NBFC को शिकायत तंत्र चलाना और ऋणदाता का नाम बताना अनिवार्य।',
        descTe: 'ప్రతి లెండింగ్ యాప్/NBFC ఫిర్యాదు వ్యవస్థను నడపడం మరియు రుణదాత పేరు వెల్లడించడం తప్పనిసరి.',
      },
    ],
    lastVerifiedOn: '2025-01-15',
  },
  {
    id: 'harassment',
    category: 'harassment',
    titleEn: 'Obscene Content, Harassment & Cyberstalking',
    titleHi: 'अश्लील सामग्री, उत्पीड़न व साइबरस्टॉकिंग',
    titleTe: 'అశ్లీల కంటెంట్, వేధింపులు & సైబర్స్టాకింగ్',
    sections: [
      {
        section: 'Sec 66E, IT Act',
        titleEn: 'Violation of Privacy',
        descEn: 'Capturing or sharing images of a private area without consent.',
        descHi: 'बिना सहमति निजी अंगों की तस्वीरें लेना या साझा करना।',
        descTe: 'సమ్మతి లేకుండా వ్యక్తిగత భాగాల చిత్రాలు తీయడం లేదా పంచుకోవడం.',
      },
      {
        section: 'Sec 67 / 67A, IT Act',
        titleEn: 'Publishing Obscene Material',
        descEn: 'Publishing obscene or sexually explicit material electronically.',
        descHi: 'अश्लील/यौन रूप से स्पष्ट सामग्री का इलेक्ट्रॉनिक प्रकाशन।',
        descTe: 'అశ్లీల/లైంగికంగా స్పష్టమైన కంటెంట్ ఎలక్ట్రానిక్గా ప్రచురించడం.',
      },
      {
        section: 'BNS, 2023',
        titleEn: 'Stalking, Defamation & Criminal Intimidation',
        descEn: 'Provisions on stalking, defamation and criminal intimidation apply alongside IT Act sections where there\'s a specific victim.',
        descHi: 'स्टॉकिंग, मानहानि व आपराधिक धमकी के प्रावधान IT अधिनियम धाराओं के साथ लागू होते हैं।',
        descTe: 'స్టాకింగ్, పరువు నష్టం మరియు నేర బెదిరింపుపై నిబంధనలు IT చట్టం సెక్షన్లతో పాటు వర్తిస్తాయి.',
      },
    ],
    lastVerifiedOn: '2025-01-15',
  },
  {
    id: 'data-privacy',
    category: 'data',
    titleEn: 'Data Breach & Personal Data Protection',
    titleHi: 'डेटा उल्लंघन व व्यक्तिगत डेटा सुरक्षा',
    titleTe: 'డేటా ఉల్లంఘన & వ్యక్తిగత డేటా రక్షణ',
    sections: [
      {
        section: 'Sec 72, IT Act',
        titleEn: 'Breach of Confidentiality',
        descEn: 'Breach of confidentiality and privacy by a person who accessed data under a service contract.',
        descHi: 'सेवा अनुबंध के तहत डेटा एक्सेस करने वाले व्यक्ति द्वारा गोपनीयता भंग।',
        descTe: 'సేవా ఒప్పందం కింద డేటాను యాక్సెస్ చేసిన వ్యక్తి ద్వారా గోపనీయతా భంగం.',
      },
      {
        section: 'Sec 72A, IT Act',
        titleEn: 'Disclosure of Information',
        descEn: 'Disclosure of personal information in breach of a lawful contract, with intent to cause wrongful loss.',
        descHi: 'वैध अनुबंध के उल्लंघन में व्यक्तिगत जानकारी का खुलासा, गलत नुकसान पहुंचाने के इरादे से।',
        descTe: 'చట్టబద్ధమైన ఒప్పంద ఉల్లంఘనలో వ్యక్తిగత సమాచారాన్ని బహిర్గతం చేయడం.',
      },
      {
        section: 'DPDP Act, 2023',
        titleEn: 'Digital Personal Data Protection',
        descEn: 'Governs how organizations must collect, store, and protect personal data, with penalties for misuse.',
        descHi: 'संगठनों द्वारा व्यक्तिगत डेटा संग्रह, भंडारण व सुरक्षा को नियंत्रित करता है, दुरुपयोग पर दंड सहित।',
        descTe: 'సంస్థలు వ్యక్తిగత డేటాను ఎలా సేకరించాలి, నిల్వ చేయాలి మరియు రక్షించాలో నియంత్రిస్తుంది.',
      },
    ],
    lastVerifiedOn: '2025-01-15',
  },
  {
    id: 'hacking',
    category: 'security',
    titleEn: 'Stolen Devices, Hacking & Cyber Terrorism',
    titleHi: 'चोरी उपकरण, हैकिंग व साइबर आतंकवाद',
    titleTe: 'దొంగిలించిన పరికరాలు, హ్యాకింగ్ & సైబర్ ఉగ్రవాదం',
    sections: [
      {
        section: 'Sec 66B, IT Act',
        titleEn: 'Receiving Stolen Device',
        descEn: 'Dishonestly receiving a stolen computer resource or communication device. Up to 3 years jail + ₹1 lakh fine.',
        descHi: 'चोरी हुए कंप्यूटर संसाधन या संचार उपकरण को बेईमानी से प्राप्त करना। 3 साल तक जेल + ₹1 लाख जुर्माना।',
        descTe: 'దొంగిలించిన కంప్యూటర్ వనరు లేదా కమ్యూనికేషన్ పరికరాన్ని మోసపూరితంగా స్వీకరించడం. 3 సంవత్సరాల వరకు జైలు + ₹1 లక్ష జరిమానా.',
      },
      {
        section: 'Sec 66F, IT Act',
        titleEn: 'Cyber Terrorism',
        descEn: 'Attacks threatening national security or critical systems (power, banking). Punishable with life imprisonment.',
        descHi: 'राष्ट्रीय सुरक्षा या महत्वपूर्ण प्रणालियों को खतरे में डालने वाले हमले। आजीवन कारावास तक दंडनीय।',
        descTe: 'జాతీయ భద్రత లేదా కీలక వ్యవస్థలను బెదిరించే దాడులు. జీవిత ఖైదు వరకు శిక్షార్హం.',
      },
      {
        section: 'Sec 69A, IT Act',
        titleEn: 'Blocking Access to Websites',
        descEn: 'Empowers government to block access to information/websites for national security or public order.',
        descHi: 'राष्ट्रीय सुरक्षा या सार्वजनिक व्यवस्था के लिए सरकार को वेबसाइट/जानकारी तक पहुंच रोकने का अधिकार देता है।',
        descTe: 'జాతీయ భద్రత లేదా ప్రజా క్రమం కోసం వెబ్సైట్లు/సమాచారానికి ప్రాప్యతను నిరోధించే అధికారాన్ని ప్రభుత్వానికి ఇస్తుంది.',
      },
    ],
    lastVerifiedOn: '2025-01-15',
  },
  {
    id: 'intermediary',
    category: 'harassment',
    titleEn: 'Intermediary Rules for Social Media & Apps',
    titleHi: 'सोशल मीडिया व ऐप्स के लिए मध्यस्थ नियम',
    titleTe: 'సోషల్ మీడియా & యాప్ల కోసం మధ్యవర్తి నిబంధనలు',
    sections: [
      {
        section: 'IT Rules, 2021',
        titleEn: 'Grievance Officer Requirement',
        descEn: 'Every social media/intermediary must appoint a Grievance Officer who must acknowledge complaints within 24 hours and resolve within 15 days.',
        descHi: 'हर सोशल मीडिया/मध्यस्थ को एक शिकायत अधिकारी नियुक्त करना होगा जो 24 घंटे में स्वीकार करे और 15 दिन में समाधान करे।',
        descTe: 'ప్రతి సోశల్ మీడియా/మధ్యవర్తి 24 గంటల్లో ఫిర్యాదులను గుర్తించి 15 రోజుల్లో పరిష్కరించే ఫిర్యాదు అధికారిని నియమించాలి.',
      },
      {
        section: 'GAC (gac.gov.in)',
        titleEn: 'Grievance Appellate Committee',
        descEn: 'Grievance Appellate Committee — appeal here if a platform\'s Grievance Officer doesn\'t resolve your complaint satisfactorily.',
        descHi: 'शिकायत अपीलीय समिति — यदि प्लेटफ़ॉर्म का शिकायत अधिकारी संतोषजनक समाधान नहीं देता तो यहां अपील करें।',
        descTe: 'ఫిర్యాదు అప్పీలేట్ కమిటీ — ప్లాట్ఫారమ్ ఫిర్యాదు అధికారి సంతృప్తికరంగా పరిష్కరించకపోతే ఇక్కడ అప్పీల్ చేయండి.',
      },
    ],
    lastVerifiedOn: '2025-01-15',
  },
];
