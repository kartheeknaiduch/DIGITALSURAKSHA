// Scam content definitions — add new scams here without a code deploy
export interface ScamStep {
  label: string;
  type: 'normal' | 'alert';
}

export interface Scam {
  slug: string;
  tag: string;
  title: string;
  titleHi: string;
  titleTe: string;
  summary: string;
  summaryHi: string;
  summaryTe: string;
  steps: ScamStep[];
  redFlag: string;
  redFlagHi: string;
  redFlagTe: string;
  detail: string;
  detailHi: string;
  detailTe: string;
}

export const SCAMS: Scam[] = [
  {
    slug: 'otp-scam',
    tag: 'OTP Scam',
    title: 'Caller → "Your KYC will expire today" → asks for OTP',
    titleHi: 'कॉलर → "आपकी KYC आज समाप्त हो जाएगी" → OTP मांगता है',
    titleTe: 'కాలర్ → "మీ KYC ఈరోజు గడువు ముగుస్తుంది" → OTP అడుగుతారు',
    summary: 'A caller poses as your bank or telecom company, creates urgency about a blocked account, then asks you to read out the OTP — which actually authorizes a transaction on your account.',
    summaryHi: 'एक कॉलर आपके बैंक या टेलीकॉम कंपनी होने का दिखावा करता है, खाता ब्लॉक होने की जल्दी बनाता है, फिर OTP बताने को कहता है।',
    summaryTe: 'ఒక కాలర్ మీ బ్యాంక్ లేదా టెలికాం సంస్థగా నటిస్తూ, ఖాతా బ్లాక్ అవుతుందని తొందర సృష్టించి, OTPని చెప్పమని అడుగుతారు.',
    steps: [
      { label: 'Caller', type: 'normal' },
      { label: 'KYC Urgency', type: 'alert' },
      { label: 'OTP Capture', type: 'alert' },
    ],
    redFlag: '🚩 No bank or government body ever asks for your OTP over a call.',
    redFlagHi: '🚩 कोई भी बैंक या सरकारी संस्था कभी फोन पर OTP नहीं मांगती।',
    redFlagTe: '🚩 ఏ బ్యాంక్ లేదా ప్రభుత్వ సంస్థ కూడా కాల్లో OTP ఎప్పుడూ అడగదు.',
    detail: 'The fraudster typically calls between 10am–12pm when people are at work and distracted. They may already know your name and partial account details (bought from data brokers), which makes them seem legitimate. The moment you say the OTP, a pre-staged transaction is authorized — often a wallet top-up or UPI transfer to a mule account. Call 1930 immediately if this happened to you.',
    detailHi: 'धोखेबाज़ आमतौर पर सुबह 10 बजे से दोपहर 12 बजे के बीच कॉल करता है। वे आपका नाम और आंशिक खाता विवरण पहले से जानते हो सकते हैं। OTP बताते ही एक पूर्व-निर्धारित लेनदेन अधिकृत हो जाता है।',
    detailTe: 'మోసగాడు సాధారణంగా ఉదయం 10 నుండి 12 గంటల మధ్య కాల్ చేస్తాడు. మీరు OTP చెప్పిన వెంటనే ఒక పూర్వ-నిర్ణీత లావాదేవీ అధికారం పొందుతుంది.',
  },
  {
    slug: 'upi-collect-request',
    tag: 'UPI Collect Request',
    title: '"Pay ₹1 to receive ₹5,000" → it\'s actually a Collect request',
    titleHi: '"₹5,000 पाने के लिए ₹1 भेजें" — यह असल में कलेक्ट रिक्वेस्ट है',
    titleTe: '"₹5,000 పొందడానికి ₹1 పంపండి" — ఇది నిజానికి కలెక్ట్ రిక్వెస్ట్',
    summary: 'A seller or prize contact sends what looks like a payment link, but it\'s a UPI Collect Request — approving it sends money OUT of your account, not in.',
    summaryHi: 'एक विक्रेता या पुरस्कार भेजने वाला भुगतान लिंक जैसा कुछ भेजता है, पर यह UPI कलेक्ट रिक्वेस्ट होती है।',
    summaryTe: 'అమ్మకందారు చెల్లింపు లింక్ లాగా కనిపించేదాన్ని పంపుతారు, కానీ ఇది UPI కలెక్ట్ రిక్వెస్ట్.',
    steps: [
      { label: 'Fake Seller', type: 'normal' },
      { label: 'Collect Request', type: 'alert' },
      { label: 'PIN Entered', type: 'alert' },
    ],
    redFlag: '🚩 Receiving money never requires entering your UPI PIN.',
    redFlagHi: '🚩 पैसे पाने के लिए कभी UPI पिन डालने की जरूरत नहीं होती।',
    redFlagTe: '🚩 డబ్బు పొందడానికి ఎప్పుడూ UPI పిన్ నమోదు చేయాల్సిన అవసరం లేదు.',
    detail: 'Common on OLX, Quikr, and Facebook Marketplace. The "buyer" sends a UPI collect request for ₹1 as a "token amount to verify your UPI." The moment you enter your PIN, your UPI app deducts money — not adds it. Always verify: receiving money shows a green "Pay" button, not a "Receive" notification requiring PIN.',
    detailHi: 'OLX, Quikr और फेसबुक मार्केटप्लेस पर आम है। "खरीदार" ₹1 की UPI कलेक्ट रिक्वेस्ट भेजता है। PIN डालते ही पैसे कट जाते हैं।',
    detailTe: 'OLX, Quikr మరియు Facebook Marketplace లో సాధారణం. "కొనుగోలుదారు" ₹1 కోసం UPI కలెక్ట్ రిక్వెస్ట్ పంపుతాడు. PIN నమోదు చేసిన వెంటనే డబ్బు కటయిపోతుంది.',
  },
  {
    slug: 'fake-loan-app',
    tag: 'Fake Loan / Job App',
    title: 'Instant-loan app asks for full contact & gallery access',
    titleHi: 'तुरंत लोन ऐप पूरी कॉन्टैक्ट व गैलरी एक्सेस मांगता है',
    titleTe: 'తక్షణ లోన్ యాప్ పూర్తి కాంటాక్ట్ & గ్యాలరీ యాక్సెస్ అడుగుతుంది',
    summary: 'A "no-document, instant approval" loan or job app requests contact list and photo access at install, then harasses the borrower\'s contacts if payment is delayed.',
    summaryHi: '"बिना दस्तावेज़, तुरंत मंजूरी" वाला लोन ऐप इंस्टॉल के समय कॉन्टैक्ट लिस्ट और फोटो एक्सेस मांगता है।',
    summaryTe: '"డాక్యుమెంట్ లేకుండా, తక్షణ ఆమోదం" ఉన్న లోన్ యాప్ ఇన్స్టాల్ సమయంలో కాంటాక్ట్ లిస్ట్ మరియు ఫోటో యాక్సెస్ అడుగుతుంది.',
    steps: [
      { label: 'Install App', type: 'normal' },
      { label: 'Grant Contacts+Gallery', type: 'alert' },
      { label: 'Harassment Calls', type: 'alert' },
    ],
    redFlag: '🚩 Apps outside RBI\'s registered NBFC list demanding contact/gallery access.',
    redFlagHi: '🚩 RBI की पंजीकृत NBFC सूची से बाहर के ऐप जो कॉन्टैक्ट/गैलरी एक्सेस मांगें।',
    redFlagTe: '🚩 RBI నమోదిత NBFC జాబితా వెలుపల ఉన్న యాప్లు కాంటాక్ట్/గ్యాలరీ యాక్సెస్ అడగడం.',
    detail: 'These apps charge 60–300% annualized interest and require repayment in 7 days. If you miss a payment, they call your family, friends, and employer using your own contact list, and may send doctored images. Check if the lender is on the RBI\'s NBFC list at rbi.org.in/nbfcList before installing any loan app.',
    detailHi: 'ये ऐप 60-300% वार्षिक ब्याज लेते हैं और 7 दिन में भुगतान मांगते हैं। भुगतान न होने पर आपकी कॉन्टैक्ट लिस्ट में कॉल करते हैं।',
    detailTe: 'ఈ యాప్లు 60-300% వార్షిక వడ్డీ వసూలు చేస్తాయి మరియు 7 రోజుల్లో చెల్లించమని అడుగుతాయి.',
  },
  {
    slug: 'sim-swap',
    tag: 'SIM Swap',
    title: 'Silent call-forwarding is switched on without you noticing',
    titleHi: 'बिना बताए चुपचाप कॉल-फॉरवर्डिंग चालू कर दी जाती है',
    titleTe: 'మీకు తెలియకుండా నిశ్శబ్దంగా కాల్-ఫార్వార్డింగ్ ఆన్ చేయబడుతుంది',
    summary: 'A fraudster tricks your telecom operator or convinces you to dial a code that quietly forwards your calls and OTP SMS to their number — then resets your bank login.',
    summaryHi: 'धोखेबाज़ आपके टेलीकॉम ऑपरेटर को धोखा देता है या आपसे ऐसा कोड डायल करवाता है जो OTP SMS चुपचाप उसके नंबर पर भेज देता है।',
    summaryTe: 'మోసగాడు మీ టెలికాం ఆపరేటర్ను మోసం చేస్తాడు లేదా మీ కాల్లు వారి నంబర్కు ఫార్వార్డ్ చేసే కోడ్ను డయల్ చేయమని మిమ్మల్ని ఒప్పిస్తాడు.',
    steps: [
      { label: 'Social Engineering', type: 'normal' },
      { label: 'SIM/Forward Activated', type: 'alert' },
      { label: 'Bank Reset', type: 'alert' },
    ],
    redFlag: '🚩 Dial *#21# periodically — if forwarding shows active and you didn\'t set it, disable it immediately.',
    redFlagHi: '🚩 समय-समय पर *#21# डायल करें — अगर फॉरवर्डिंग चालू दिखे और आपने नहीं की, तो तुरंत बंद करें।',
    redFlagTe: '🚩 అప్పుడప్పుడు *#21# డయల్ చేయండి — ఫార్వార్డింగ్ యాక్టివ్గా కనిపిస్తే వెంటనే ఆఫ్ చేయండి.',
    detail: 'The attacker may impersonate you at a telecom store with a fake ID, or they may call you pretending to be your carrier\'s customer care and ask you to dial a code that activates MMI-based call forwarding. Once your OTPs are diverted, they can reset any account tied to your phone number. Dial ##002# immediately to cancel all forwarding.',
    detailHi: 'हमलावर नकली ID के साथ टेलीकॉम स्टोर पर आपका रूप धारण कर सकता है, या आपको MMI-आधारित कॉल फॉरवर्डिंग सक्रिय करने वाला कोड डायल करवा सकता है।',
    detailTe: 'దాడిదారుడు నకిలీ IDతో టెలికాం స్టోర్లో మిమ్మల్ని వేషధారించవచ్చు, లేదా MMI-ఆధారిత కాల్ ఫార్వార్డింగ్ కోడ్ డయల్ చేయమని మిమ్మల్ని ఒప్పించవచ్చు.',
  },
];
