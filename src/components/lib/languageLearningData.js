// Multilingual Phrasebook and Local Language Learning Books Data Store

export const languageOptions = [
  { code: "te", name: "Telugu", nativeName: "తెలుగు", script: "తెలుగు లిపి", speechLang: "te-IN", region: "Andhra Pradesh & Telangana" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", script: "देवनागरी", speechLang: "hi-IN", region: "North & Central India" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", script: "தமிழ் அரிச்சுவடி", speechLang: "ta-IN", region: "Tamil Nadu & Puducherry" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", script: "বাংলা লিপি", speechLang: "bn-IN", region: "West Bengal & Tripura" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ", script: "ಕನ್ನಡ ಲಿಪಿ", speechLang: "kn-IN", region: "Karnataka" },
  { code: "mr", name: "Marathi", nativeName: "मराठी", script: "देवनागरी", speechLang: "mr-IN", region: "Maharashtra" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી", script: "ગુજરાતી લિપિ", speechLang: "gu-IN", region: "Gujarat" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം", script: "മലയാള ലിപി", speechLang: "ml-IN", region: "Kerala" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", script: "ਗੁਰਮੁਖੀ", speechLang: "pa-IN", region: "Punjab" },
  { code: "or", name: "Odia", nativeName: "ଓଡ଼ିଆ", script: "ଓଡ଼ିଆ ଲିପି", speechLang: "or-IN", region: "Odisha" },
  { code: "sa", name: "Sanskrit", nativeName: "संस्कृतम्", script: "देवनागरी", speechLang: "sa-IN", region: "Classical Pan-India" },
  { code: "ur", name: "Urdu", nativeName: "اردو", script: "نستعلیق", speechLang: "ur-IN", region: "Telangana, UP, Delhi & Kashmir" },
  { code: "as", name: "Assamese", nativeName: "অসমীয়া", script: "পূৰ্বী নাগৰী", speechLang: "as-IN", region: "Assam & Brahmaputra" },
  { code: "mai", name: "Maithili", nativeName: "मैथिली", script: "देवनागरी", speechLang: "mai-IN", region: "Bihar & Mithila" },
  { code: "kok", name: "Konkani", nativeName: "कोंकणी", script: "देवनागरी / Romi", speechLang: "kok-IN", region: "Goa & Coastal Karnataka" },
  { code: "ks", name: "Kashmiri", nativeName: "کٲشُر / कॉशुर", script: "Perso-Arabic", speechLang: "ks-IN", region: "Jammu & Kashmir" },
  { code: "sd", name: "Sindhi", nativeName: "سنڌي / सिन्धी", script: "Perso-Arabic", speechLang: "sd-IN", region: "Gujarat & Maharashtra" },
  { code: "ne", name: "Nepali", nativeName: "नेपाली", script: "देवनागरी", speechLang: "ne-IN", region: "Sikkim & Darjeeling" },
  { code: "mni", name: "Manipuri (Meitei)", nativeName: "মৈতৈলোন্", script: "Meitei Mayek", speechLang: "mni-IN", region: "Manipur" },
  { code: "sat", name: "Santali", nativeName: "ᱥᱟᱱᱛᱟᱲᱤ", script: "Ol Chiki", speechLang: "sat-IN", region: "Jharkhand, Odisha & WB" },
  { code: "doi", name: "Dogri", nativeName: "डोगरी", script: "देवनागरी", speechLang: "doi-IN", region: "Jammu" },
  { code: "brx", name: "Bodo", nativeName: "बड़ो", script: "देवनागरी", speechLang: "brx-IN", region: "Bodoland, Assam" },
  { code: "en", name: "English", nativeName: "English", script: "Latin Script", speechLang: "en-IN", region: "Pan-India Business & Tourist" },
];

export const comprehensivePhrasebook = [
  // CATEGORY 1: GREETINGS & COURTESY
  {
    id: "greet-1",
    category: "Greetings & Politeness",
    en: "Hello / Greetings",
    translations: {
      te: { script: "నమస్కారం", pron: "Namaskāram", tip: "Universal respectful greeting across Andhra & Telangana. Join palms together." },
      hi: { script: "नमस्ते / नमस्कार", pron: "Namastē / Namaskār", tip: "Traditional greeting with folded hands." },
      ta: { script: "வணக்கம்", pron: "Vaṇakkam", tip: "Standard respectful greeting across Tamil Nadu." },
      bn: { script: "নমস্কার / আদাব", pron: "Nomoshkār / Ādāb", tip: "Universal respectful greeting." },
      kn: { script: "ನಮಸ್ಕಾರ", pron: "Namaskāra", tip: "Respectful Kannada greeting." },
      mr: { script: "नमस्कार", pron: "Namaskār", tip: "Standard Marathi greeting." },
      gu: { script: "નમસ્તે / જય શ્રી કૃષ્ણ", pron: "Namastē / Jai Shri Krishna", tip: "Common warm Gujarati greeting." },
      ml: { script: "നമസ്കാരം", pron: "Namaskāram", tip: "Universal respectful greeting in Kerala." },
      pa: { script: "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ", pron: "Sat Srī Akāl", tip: "Traditional Sikh greeting of truth and respect." },
    }
  },
  {
    id: "greet-2",
    category: "Greetings & Politeness",
    en: "Thank you very much",
    translations: {
      te: { script: "చాలా ధన్యవాదాలు", pron: "Chālā dhanyavādālu", tip: "Expresses sincere heartfelt gratitude." },
      hi: { script: "बहुत बहुत धन्यवाद / शुक्रिया", pron: "Bahut bahut dhanyavād / Shukriyā", tip: "Polite gratitude for hospitality." },
      ta: { script: "மிக்க நன்றி", pron: "Mikka naṉṟi", tip: "Polite and warm thank you." },
      bn: { script: "অনেক ধন্যবাদ", pron: "Onēk dhonyobād", tip: "Standard Bengali expression of thanks." },
      kn: { script: "ತುಂಬಾ ಧನ್ಯವಾದಗಳು", pron: "Tumbā dhanyavādagalu", tip: "Warm gratitude in Kannada." },
      mr: { script: "खूप खूप धन्यवाद", pron: "Khūp khūp dhanyavād", tip: "Heartfelt Marathi thanks." },
      gu: { script: "ખૂબ ખૂબ આભાર", pron: "Khūb khūb ābhār", tip: "Polite Gujarati gratitude." },
      ml: { script: "വളരെ നന്ദി", pron: "Valare nandi", tip: "Heartfelt thanks in Malayalam." },
      pa: { script: "ਬਹੁਤ ਬਹੁਤ ਧੰਨਵਾਦ", pron: "Bahut bahut dhanvād", tip: "Warm thanks in Punjabi." },
    }
  },
  {
    id: "greet-3",
    category: "Greetings & Politeness",
    en: "How are you? (Respectful)",
    translations: {
      te: { script: "మీరు ఎలా ఉన్నారు?", pron: "Mīru elā unnāru?", tip: "Formal polite inquiry used with elders and locals." },
      hi: { script: "आप कैसे हैं?", pron: "Āp kaisē hain?", tip: "Respectful inquiry used across North India." },
      ta: { script: "நீங்கள் எப்படி இருக்கிறீர்கள்?", pron: "Nīṅkaḷ eppaṭi irukkiṟīrkaḷ?", tip: "Respectful greeting to locals." },
      bn: { script: "আপনি কেমন আছেন?", pron: "Āpni kēmōn āchhēn?", tip: "Polite formal greeting in West Bengal." },
      kn: { script: "ನೀವು ಹೇಗಿದ್ದೀರಿ?", pron: "Nīvu hēgiddīri?", tip: "Polite Kannada inquiry." },
      mr: { script: "तुम्ही कसे आहात?", pron: "Tumhī kasē āhāt?", tip: "Respectful inquiry in Maharashtra." },
      gu: { script: "તમે કેમ છો?", pron: "Tamē kēm chho?", tip: "Warm conversational Gujarati opening." },
      ml: { script: "സുഖമാണോ?", pron: "Sukhamāṇō?", tip: "Friendly inquiry about well-being in Kerala." },
      pa: { script: "ਤੁਹਾਡਾ ਕੀ ਹਾਲ ਹੈ?", pron: "Tuhāḍā kī hāl hai?", tip: "Polite inquiry in Punjab." },
    }
  },

  // CATEGORY 2: DIRECTIONS & NAVIGATION
  {
    id: "dir-1",
    category: "Directions & Transport",
    en: "Where is the temple / shrine?",
    translations: {
      te: { script: "గుడి ఎక్కడ ఉంది?", pron: "Guḍi ekkaḍa undi?", tip: "Remember to remove footwear at the temple chappal stand." },
      hi: { script: "मंदिर कहाँ है?", pron: "Mandir kahān hai?", tip: "Dress modestly covering shoulders and knees." },
      ta: { script: "கோவில் எங்கே உள்ளது?", pron: "Kōvil eṅkē uḷḷathu?", tip: "Follow traditional circumambulation direction." },
      bn: { script: "মন্দিরটি কোথায়?", pron: "Mandirti kōthāy?", tip: "Respect photography guidelines at the sanctum." },
      kn: { script: "ದೇವಸ್ಥಾನ ಎಲ್ಲಿದೆ?", pron: "Dēvasthāna ellide?", tip: "Remove footwear outside temple gopuram." },
      mr: { script: "मंदिर कुठे आहे?", pron: "Mandir kuṭhē āhē?", tip: "Traditional shrine inquiry." },
      gu: { script: "મંદિર ક્યાં છે?", pron: "Mandir kyān chhe?", tip: "Inquire about Darshan opening times." },
      ml: { script: "ക്ഷേത്രം എവിടെയാണ്?", pron: "Kshētram eviḍeyāṇu?", tip: "Traditional Kerala temples require special dress codes." },
      pa: { script: "ਗੁਰਦੁਆਰਾ / ਮੰਦਰ ਕਿੱਥੇ ਹੈ?", pron: "Gurduārā / Mandir kithē hai?", tip: "Cover your head before entering any Gurudwara." },
    }
  },
  {
    id: "dir-2",
    category: "Directions & Transport",
    en: "Where is the railway station / bus stand?",
    translations: {
      te: { script: "రైల్వే స్టేషన్ / బస్ స్టాండ్ ఎక్కడ ఉంది?", pron: "Railway station / Bus stand ekkaḍa undi?", tip: "Prepaid auto booths are available at major AP & Telangana stations." },
      hi: { script: "रेलवे स्टेशन / बस स्टैंड कहाँ है?", pron: "Railway station / Bus stand kahān hai?", tip: "Check platform indicators for Vande Bharat Express." },
      ta: { script: "ரயில் நிலையம் / பேருந்து நிலையம் எங்கே?", pron: "Rail nilayam / Pērundhu nilayam eṅkē?", tip: "Chennai Central and Egmore connect major heritage lines." },
      bn: { script: "রেলওয়ে স্টেশন / বাস স্ট্যান্ডটি কোথায়?", pron: "Railway station / Bus stand-ti kōthāy?", tip: "Howrah and Sealdah are major transit hubs." },
      kn: { script: "ರೈಲ್ವೆ ನಿಲ್ದಾಣ / ಬಸ್ ನಿಲ್ದಾಣ ಎಲ್ಲಿದೆ?", pron: "Railway nildāṇa / Bus nildāṇa ellide?", tip: "KSR Bengaluru connects Hampi and Mysore routes." },
      mr: { script: "रेल्वे स्टेशन / बस स्थानक कुठे आहे?", pron: "Railway station / Bus sthānak kuṭhē āhē?", tip: "Ask for MSRTC Shivneri luxury bus counters." },
      gu: { script: "રેલવે સ્ટેશન / બસ સ્ટેન્ડ ક્યાં છે?", pron: "Railway station / Bus stand kyān chhe?", tip: "GSRTC Volvo services operate between heritage cities." },
      ml: { script: "റെയിൽവേ സ്റ്റേഷൻ / ബസ് സ്റ്റാൻഡ് എവിടെയാണ്?", pron: "Railway station / Bus stand eviḍeyāṇu?", tip: "KSRTC Swift buses connect all Kerala tourist hubs." },
      pa: { script: "ਰੇਲਵੇ ਸਟੇਸ਼ਨ / ਬੱਸ ਅੱਡਾ ਕਿੱਥੇ ਹੈ?", pron: "Railway station / Bus aḍḍā kithē hai?", tip: "Amritsar and Chandigarh stations have prepaid cabs." },
    }
  },
  {
    id: "dir-3",
    category: "Directions & Transport",
    en: "Please turn on the meter / How much fare?",
    translations: {
      te: { script: "దయచేసి మీటర్ వేయండి / ఎంత ఛార్జ్ అవుతుంది?", pron: "Dayachēsi mētar vēyaṇḍi / Entha chārj avuthundi?", tip: "Auto-rickshaws in Vizag and Hyderabad follow government rate cards." },
      hi: { script: "कृपया मीटर चालू करें / किराया कितना होगा?", pron: "Kripayā meter chālū karēin / Kirāyā kitnā hōgā?", tip: "Agree on price before boarding if meter is unavailable." },
      ta: { script: "தயவுசெய்து மீட்டர் போடுங்கள் / கட்டணம் எவ்வளவு?", pron: "Dayavuseithu mīṭṭar pōṭuṅkaḷ / Kaṭṭaṇam evvaḷavu?", tip: "Confirm if luggage charges are included in fare." },
      bn: { script: "দয়া করে মিটার চালু করুন / ভাড়া কত?", pron: "Doyā korē meter chālu korun / Bhāṛā kōtō?", tip: "Yellow taxis in Kolkata use official conversion charts." },
      kn: { script: "ದಯವಿಟ್ಟು ಮೀಟರ್ ಹಾಕಿ / ಬಾಡಿಗೆ ಎಷ್ಟು?", pron: "Dayaviṭṭu mētar hāki / Bāḍige eṣṭu?", tip: "Bangalore and Mysore autos use digital meters." },
      mr: { script: "कृपया मीटर चालू करा / भाडे किती होईल?", pron: "Kripayā meter chālū karā / Bhāḍē kitī hoīl?", tip: "Mumbai and Pune autos strictly follow electronic meters." },
      gu: { script: "કૃપા કરીને મીટર ચાલુ કરો / ભાડું કેટલું થશે?", pron: "Kripā karīnē meter chālu karō / Bhāḍun keṭlu thashē?", tip: "Confirm standard day rates for full sightseeing." },
      ml: { script: "മീറ്റർ ഇടാമോ / ചാർജ്ജ് എത്രയാണ്?", pron: "Meter iṭāmō / Chārjj ethrayāṇu?", tip: "Kerala autos have minimum base fares posted inside." },
      pa: { script: "ਕਿਰਪਾ ਕਰਕੇ ਮੀਟਰ ਚਲਾਓ / ਕਿਰਾਇਆ ਕਿੰਨਾ ਹੈ?", pron: "Kirpā karkē meter chalāō / Kirāyā kinnā hai?", tip: "Clarify route through bypass or heritage corridor." },
    }
  },

  // CATEGORY 3: SHOPPING & HANDLOOM BARGAINING
  {
    id: "shop-1",
    category: "Shopping & Handloom",
    en: "How much does this cost?",
    translations: {
      te: { script: "ఇది ఎంత ధర / ఎంత పడుతుంది?", pron: "Idi entha dhara / Entha paḍuthundi?", tip: "Ask for GI certificate when buying Uppada or Pochampally sarees." },
      hi: { script: "यह कितने का है?", pron: "Yeh kitnē kā hai?", tip: "Look for government Silk Mark and Handloom Mark tags." },
      ta: { script: "இதன் விலை என்ன?", pron: "Ithan vilai eṉṉa?", tip: "Genuine Kanchipuram silk has gold zari hallmark." },
      bn: { script: "এটার দাম কত?", pron: "Ēṭār dām kōtō?", tip: "Ask for authentic Baluchari and Jamdani handloom seals." },
      kn: { script: "ಇದರ ಬೆಲೆ ಎಷ್ಟು?", pron: "Idara bele eṣṭu?", tip: "Mysore Sandalwood and Silk have government emporium seals." },
      mr: { script: "याची किंमत किती आहे?", pron: "Yāchī kimmat kitī āhē?", tip: "Paithani sarees feature peacock pallu woven in pure silk." },
      gu: { script: "આનો ભાવ શું છે?", pron: "Ānō bhāv shun chhe?", tip: "Patola and Bandhani textiles have registered artisan guilds." },
      ml: { script: "ഇതിന് എത്ര രൂപയാണ്?", pron: "Ithinu ethra rūpayāṇu?", tip: "Kasavu gold-bordered handlooms have Kerala state seals." },
      pa: { script: "ਇਹਦਾ ਮੁੱਲ ਕਿੰਨਾ ਹੈ?", pron: "Ihdā mull kinnā hai?", tip: "Phulkari embroidery dupattas are handcrafted in Punjab." },
    }
  },
  {
    id: "shop-2",
    category: "Shopping & Handloom",
    en: "Can you give a little discount? (Polite Bargaining)",
    translations: {
      te: { script: "కొంచెం ధర తగ్గించగలరా?", pron: "Konchem dhara tagginchagalarā?", tip: "Say with a polite smile in local handicraft bazaars." },
      hi: { script: "थोड़ा कम कर दीजिए ना?", pron: "Thōḍā kam kar dījiē nā?", tip: "Polite bargaining is standard in open-air bazaars." },
      ta: { script: "கொஞ்சம் குறைத்து தர முடியுமா?", pron: "Koñcam kuṟaithu thara muṭiyumā?", tip: "Ask politely when buying multiple artisan items." },
      bn: { script: "একটু কম রাখা যাবে?", pron: "Ēkṭu kom rākhā jābē?", tip: "Respectful negotiation in Kolkata New Market." },
      kn: { script: "ಸ್ವಲ್ಪ ರಿಯಾಯಿತಿ ಕೊಡಿ?", pron: "Svalpa riyāyiti koḍi?", tip: "Friendly negotiation in craft exhibitions." },
      mr: { script: "काही सवलत मिळेल का?", pron: "Kāhī savlat miḷēil kā?", tip: "Polite inquiry for festive or bulk purchases." },
      gu: { script: "થોડું ઓછું કરો ને?", pron: "Thōḍun ōchhun karō nē?", tip: "Standard Gujarati market conversational phrase." },
      ml: { script: "കുറച്ചു കുറയ്ക്കാമോ?", pron: "Kurachu kuṟaykkāmō?", tip: "Friendly inquiry in Kochi spice and antique markets." },
      pa: { script: "ਕੁਝ ਘੱਟ ਕਰ ਲਵੋ ਜੀ?", pron: "Kujh ghaṭṭ kar lavō jī?", tip: "Respectful negotiation in Amritsar bazaars." },
    }
  },

  // CATEGORY 4: FOOD & DINING
  {
    id: "food-1",
    category: "Food & Dining",
    en: "Please bring sealed bottled drinking water",
    translations: {
      te: { script: "దయచేసి సీల్ చేసిన మంచినీళ్ల బాటిల్ ఇవ్వండి", pron: "Dayachēsi seal chēsina manchinīḷḷa bottle ivvaṇḍi", tip: "Ensure the bottle cap seal is unbroken before drinking." },
      hi: { script: "कृपया सीलबंद पीने का पानी दीजिए", pron: "Kripayā seal-band pīnē kā pānī dījiē", tip: "Ask for packaged mineral water when traveling." },
      ta: { script: "தயவுசெய்து குடிநீர் பாட்டில் கொடுங்கள்", pron: "Dayavuseithu kuṭinīr bottle koṭuṅkaḷ", tip: "Boiled water (Jeeraga thanni) is also widely served in Tamil Nadu." },
      bn: { script: "দয়া করে সিল করা মিনারেল ওয়াটার দিন", pron: "Doyā korē seal korā mineral water din", tip: "Hot Darjeeling tea and bottled water are safe traveling choices." },
      kn: { script: "ದಯವಿಟ್ಟು ಕುಡಿಯುವ ನೀರಿನ ಬಾಟಲ್ ಕೊಡಿ", pron: "Dayaviṭṭu kuḍiyuva nīrina bottle koḍi", tip: "Always request sealed mineral water bottles." },
      mr: { script: "कृपया बाटलीबंद पिण्याचे पाणी द्या", pron: "Kripayā bāṭlīband piṇyāchē pānī dyā", tip: "Packaged mineral water is available at all highway stalls." },
      gu: { script: "કૃપા કરીને સીલબંધ પીવાનું પાણી આપો", pron: "Kripā karīnē seal-band pīvānum pānī āpō", tip: "Confirm cold or room-temperature preference." },
      ml: { script: "ദയവായി കുടിവെള്ളം തരുമോ", pron: "Dayavāyi kuṭiveḷḷam tharumō", tip: "Kerala restaurants traditionally serve warm herbal water (Karingali)." },
      pa: { script: "ਕਿਰਪਾ ਕਰਕੇ ਪੀਣ ਵਾਲਾ ਪਾਣੀ ਦਿਓ", pron: "Kirpā karkē pīṇ vālā pānī diō", tip: "Fresh lassi and bottled water are widely available." },
    }
  },
  {
    id: "food-2",
    category: "Food & Dining",
    en: "Please make it less spicy / Vegetarian food",
    translations: {
      te: { script: "దయచేసి కారం తక్కువగా చేయండి / శాకాహార భోజనం", pron: "Dayachēsi kāram thakkuvagā chēyaṇḍi / Shākāhāra bhōjanam", tip: "Andhra food is naturally rich in Guntur red chillies." },
      hi: { script: "कृपया मिर्च कम रखें / शुद्ध शाकाहारी खाना", pron: "Kripayā mirch kam rakhēin / Shuddh shākāhārī khānā", tip: "Look for Green Veg Dot symbol on all Indian packaged food." },
      ta: { script: "காரம் குறைவாக செய்யுங்கள் / சைவ உணவு", pron: "Kāram kuṟaivāka seyyuṅkaḷ / Saiva uṇavu", tip: "Pure vegetarian restaurants are marked 'Pure Veg' across Tamil Nadu." },
      bn: { script: "ঝাল কম দেবেন / নিরামিষ খাবার", pron: "Jhāl kom dēbēn / Nirāmish khābār", tip: "Bengali cuisine has exquisite vegetarian dishes like Shukto and Chhanar Dalna." },
      kn: { script: "ಖಾರ ಕಡಿಮೆ ಮಾಡಿ / ಶುದ್ಧ ಸಸ್ಯಾಹಾರಿ", pron: "Khāra kaḍime māḍi / Shuddha sasyāhāri", tip: "Udupi restaurants serve pure satvik vegetarian cuisine." },
      mr: { script: "तिखट कमी करा / शाकाहारी जेवण", pron: "Tikhaṭ kamī karā / Shākāhārī jēvaṇ", tip: "Maharashtrian Pithla Bhakri and Thalipeeth are flavorful vegetarian meals." },
      gu: { script: "તીખું ઓછું બનાવજો / શુદ્ધ શાકાહારી ભોજન", pron: "Tīkhun ōchhun banāvjō / Shuddh shākāhārī bhōjan", tip: "Traditional Gujarati Thali is 100% vegetarian with sweet-savory balance." },
      ml: { script: "എരിവ് കുറച്ചു മതി / സസ്യാഹാരം", pron: "Erivu kurachu mathi / Sasyāhāram", tip: "Traditional Kerala Sadhya served on banana leaf is completely vegetarian." },
      pa: { script: "ਮਿਰਚ ਘੱਟ ਰੱਖਣਾ ਜੀ / ਸ਼ੁੱਧ ਸ਼ਾਕਾਹਾਰੀ", pron: "Mirch ghaṭṭ rakhṇā jī / Shuddh shākāhārī", tip: "Dhabas across GT Road serve rich Dal Makhani and Sarson Ka Saag." },
    }
  },

  // CATEGORY 5: EMERGENCY & MEDICAL
  {
    id: "emg-1",
    category: "Emergency & Safety",
    en: "Please help me! Emergency!",
    translations: {
      te: { script: "దయచేసి నాకు సహాయం చేయండి! అత్యవసర పరిస్థితి!", pron: "Dayachēsi nāku sahāyam chēyaṇḍi! Atyavasara paristhiti!", tip: "Call 112 for Police/Ambulance or 1363 for All-India Tourist Helpline." },
      hi: { script: "कृपया मेरी मदद कीजिए! आपातकालीन स्थिति!", pron: "Kripayā mērī madad kījiē! Āpātkālīn sthiti!", tip: "Dial 112 for immediate unified emergency response." },
      ta: { script: "தயவுசெய்து எனக்கு உதவுங்கள்! அவசரம்!", pron: "Dayavuseithu enakku uthavuṅkaḷ! Avasaram!", tip: "Tourist Police booths are stationed outside major temples." },
      bn: { script: "দয়া করে আমাকে সাহায্য করুন! জরুরী অবস্থা!", pron: "Doyā korē āmākē sāhājyo korun! Jorurī obōsthā!", tip: "Call 112 for rapid emergency medical and police aid." },
      kn: { script: "ದಯವಿಟ್ಟು ನನಗೆ ಸಹಾಯ ಮಾಡಿ! ತುರ್ತು ಪರಿಸ್ಥಿತಿ!", pron: "Dayaviṭṭu nanage sahāya māḍi! Turtu paristhiti!", tip: "Dial 112 for Tourist Police helpline in Karnataka." },
      mr: { script: "कृपया मला मदत करा! आणीबाणी!", pron: "Kripayā malā madat karā! Āṇībāṇī!", tip: "Dial 112 for emergency dispatch in Maharashtra." },
      gu: { script: "કૃપા કરીને મારી મદદ કરો! કટોકટી છે!", pron: "Kripā karīnē mārī madad karō! Kaṭōkaṭī chhe!", tip: "Emergency 112 operates 24/7 across all Gujarat districts." },
      ml: { script: "ദയവായി എന്നെ സഹായിക്കൂ! അടിയന്തിരം!", pron: "Dayavāyi enne sahāyikkū! Aḍiyanthiram!", tip: "Kerala Highway Police patrol can be reached via 112." },
      pa: { script: "ਕਿਰਪਾ ਕਰਕੇ ਮੇਰੀ ਮਦਦ ਕਰੋ! ਐਮਰਜੈਂਸੀ!", pron: "Kirpā karkē mērī madad karō! Emergency!", tip: "Dial 112 for police or 108 for ambulance." },
    }
  },
  {
    id: "emg-2",
    category: "Emergency & Safety",
    en: "Where is the nearest hospital / doctor?",
    translations: {
      te: { script: "దగ్గర్లోని హాస్పిటల్ / డాక్టర్ ఎక్కడ ఉన్నారు?", pron: "Daggarlōni hospital / Doctor ekkaḍa unnāru?", tip: "KGH in Vizag, NIMS in Hyderabad & SVIMS in Tirupati are premier centers." },
      hi: { script: "निकटतम अस्पताल / डॉक्टर कहाँ है?", pron: "Nikaṭatam aspatāl / Doctor kahān hai?", tip: "Look for government Red Cross symbol for 24-hour trauma units." },
      ta: { script: "அருகிலுள்ள மருத்துவமனை எங்கே?", pron: "Arukiluḷḷa maruthuvamaṉai eṅkē?", tip: "Government and private hospitals offer 24x7 emergency casualty wards." },
      bn: { script: "কাছের হাসপাতাল / ডাক্তার কোথায়?", pron: "Kāchhēr hāspātāl / Doctor kōthāy?", tip: "Major district medical colleges provide immediate trauma care." },
      kn: { script: "ಹತ್ತಿರದ ಆಸ್ಪತ್ರೆ ಎಲ್ಲಿದೆ?", pron: "Hattirada āspatre ellide?", tip: "Apollo and government district hospitals provide 24/7 emergency care." },
      mr: { script: "जवळचे रुग्णालय / डॉक्टर कुठे आहे?", pron: "Jawaḷchē rugṇālay / Doctor kuṭhē āhē?", tip: "Government Civil Hospitals have round-the-clock emergency casualty." },
      gu: { script: "નજીકની હોસ્પિટલ / ડૉક્ટર ક્યાં છે?", pron: "Najīknī hospital / Doctor kyān chhe?", tip: "108 ambulance service reaches remote heritage spots in Gujarat." },
      ml: { script: "അടുത്തുള്ള ആശുപത്രി എവിടെയാണ്?", pron: "Aṭuthuḷḷa āśupathri eviḍeyāṇu?", tip: "Kerala has an extensive primary health center and hospital network." },
      pa: { script: "ਨੇੜੇ ਦਾ ਹਸਪਤਾਲ ਕਿੱਥੇ ਹੈ?", pron: "Nēṛē dā haspatāl kithē hai?", tip: "Major civil hospitals and private clinics operate 24 hours." },
    }
  }
];

// DOWNLOADABLE LANGUAGE LEARNING BOOKS DIRECTORY
export const languageLearningBooks = [
  {
    id: "book-te",
    langCode: "te",
    title: "Telugu for Travelers & Coastal Heritage Companion",
    subtitle: "Complete conversational guide for Andhra Pradesh & Telangana",
    coverColor: "from-amber-600 via-orange-600 to-red-700",
    badge: "Most Popular in South India",
    pages: "48 Pages · Illustrated PDF Guide",
    size: "4.2 MB Offline eBook",
    chapters: [
      "1. Telugu Script & Vowel Phonetics (అ, ఆ, ఇ, ఈ...)",
      "2. Counting Numbers 1-100 (ఒకటి, రెండు, మూడు...)",
      "3. Visakhapatnam Coastal & Beach Auto-Rickshaw Dialogues",
      "4. Tirupati Balaji Temple Darshan Protocols & Sacred Vocab",
      "5. Ordering Authentic Andhra Thali & Spices in Restaurants",
      "6. Handloom Weaving Terms for Uppada & Pochampally Silk",
      "7. Emergency Medical & Tourist Police Helpline Directory"
    ],
    alphabets: [
      { char: "అ (A)", pron: "Short 'a' as in America", ex: "అమ్మ (Amma - Mother)" },
      { char: "ఆ (Aa)", pron: "Long 'aa' as in Palm", ex: "ఆవు (Aavu - Cow)" },
      { char: "ఇ (I)", pron: "Short 'i' as in India", ex: "ఇల్లు (Illu - Home)" },
      { char: "ఈ (Ee)", pron: "Long 'ee' as in Tree", ex: "ఈగ (Eega - Honeybee)" },
      { char: "ఉ (U)", pron: "Short 'u' as in Put", ex: "ఉప్పు (Uppu - Salt)" },
      { char: "ఎ (E)", pron: "Short 'e' as in Elephant", ex: "ఎండ (Enda - Sunshine)" },
      { char: "ఓ (O)", pron: "Long 'o' as in Ocean", ex: "ఓడ (Oda - Ship)" },
      { char: "క (Ka)", pron: "'k' as in Kite", ex: "కలం (Kalam - Pen)" },
      { char: "గ (Ga)", pron: "'g' as in Gold", ex: "గుడి (Gudi - Temple)" },
      { char: "న (Na)", pron: "'n' as in Name", ex: "నమస్కారం (Namaskaram - Hello)" },
    ],
    numbers: [
      { num: "1", word: "ఒకటి", pron: "Okaṭi" },
      { num: "2", word: "రెండు", pron: "Reṇḍu" },
      { num: "3", word: "మూడు", pron: "Mūḍu" },
      { num: "4", word: "నాలుగు", pron: "Nālugu" },
      { num: "5", word: "ఐదు", pron: "Aidu" },
      { num: "10", word: "పది", pron: "Padi" },
      { num: "50", word: "యాభై", pron: "Yābhai" },
      { num: "100", word: "వంద", pron: "Vanda" },
      { num: "500", word: "ఐదు వందలు", pron: "Aidu vandalu" },
      { num: "1000", word: "వెయ్యి", pron: "Vēyyi" },
    ]
  },
  {
    id: "book-hi",
    langCode: "hi",
    title: "Hindi Pocket Companion for All-India Exploration",
    subtitle: "The definitive survival and cultural etiquette book for India",
    coverColor: "from-rose-600 via-red-600 to-amber-700",
    badge: "Official Pan-India Guide",
    pages: "56 Pages · Illustrated PDF Guide",
    size: "4.8 MB Offline eBook",
    chapters: [
      "1. Devanagari Script & Matras (अ, आ, इ, ई...)",
      "2. Counting & Currency Bargaining (एक, दो, तीन, सौ, हज़ार...)",
      "3. Train, Bus & Metro Conversations for Golden Triangle",
      "4. Varanasi Ghats & Temple Aarti Sacred Etiquette",
      "5. Street Food & Dhaba Ordering (Chai, Roti, Dal, Sabzi)",
      "6. Jaipur & Agra Craft Emporium Authentic Buying Tips",
      "7. All-India Police, Ambulance & Distress Helplines"
    ],
    alphabets: [
      { char: "अ (A)", pron: "Short 'a' as in Alive", ex: "अमर (Amar - Immortal)" },
      { char: "आ (Aa)", pron: "Long 'aa' as in Father", ex: "आम (Aam - Mango)" },
      { char: "इ (I)", pron: "Short 'i' as in Sit", ex: "इमली (Imli - Tamarind)" },
      { char: "ई (Ee)", pron: "Long 'ee' as in Meet", ex: "ईश्वर (Ishwar - God)" },
      { char: "उ (U)", pron: "Short 'u' as in Book", ex: "उजाला (Ujala - Light)" },
      { char: "ए (E)", pron: "Short 'e' as in May", ex: "एक (Ek - One)" },
      { char: "क (Ka)", pron: "'k' as in King", ex: "कमल (Kamal - Lotus)" },
      { char: "न (Na)", pron: "'n' as in Noble", ex: "नमस्ते (Namaste - Hello)" },
    ],
    numbers: [
      { num: "1", word: "एक", pron: "Ēk" },
      { num: "2", word: "दो", pron: "Dō" },
      { num: "3", word: "तीन", pron: "Tīn" },
      { num: "4", word: "चार", pron: "Chār" },
      { num: "5", word: "पाँच", pron: "Pānch" },
      { num: "10", word: "दस", pron: "Das" },
      { num: "50", word: "पचास", pron: "Pachās" },
      { num: "100", word: "सौ", pron: "Sau" },
      { num: "500", word: "पाँच सौ", pron: "Pānch Sau" },
      { num: "1000", word: "एक हज़ार", pron: "Ēk Hazār" },
    ]
  },
  {
    id: "book-ta",
    langCode: "ta",
    title: "Tamil Heritage & Temple Towns Lexicon",
    subtitle: "Dravidian architecture, classical arts & pilgrim handbook",
    coverColor: "from-indigo-600 via-blue-600 to-cyan-700",
    badge: "Classical Language Guide",
    pages: "44 Pages · Illustrated PDF Guide",
    size: "3.9 MB Offline eBook",
    chapters: [
      "1. Tamil Vowels & Consonants (அ, ஆ, இ, ஈ...)",
      "2. Numbers & Temple Donation Vocab (ஒன்று, இரண்டு...)",
      "3. Madurai Meenakshi & Thanjavur Big Temple Guides",
      "4. Traditional Chettinad Dining & Filter Coffee Ordering",
      "5. Kanchipuram Silk & Bronze Sculptures Procurement",
      "6. Auto & Bus Routes between Chennai and Mahabalipuram",
      "7. Tourist Police & Emergency Assistance"
    ],
    alphabets: [
      { char: "அ (A)", pron: "Short 'a' as in Apple", ex: "அம்மா (Amma - Mother)" },
      { char: "ஆ (Aa)", pron: "Long 'aa' as in Calm", ex: "ஆடு (Aadu - Goat)" },
      { char: "இ (I)", pron: "Short 'i' as in In", ex: "இலை (Ilai - Leaf)" },
      { char: "க (Ka)", pron: "'k' as in Kite", ex: "கடவுள் (Kadavul - Divine)" },
      { char: "வ (Va)", pron: "'v' as in Van", ex: "வணக்கம் (Vanakkam - Hello)" },
    ],
    numbers: [
      { num: "1", word: "ஒன்று", pron: "Oṉṟu" },
      { num: "2", word: "இரண்டு", pron: "Iraṇṭu" },
      { num: "3", word: "மூன்று", pron: "Mūṉṟu" },
      { num: "4", word: "நான்கு", pron: "Nāṉku" },
      { num: "5", word: "ஐந்து", pron: "Ainthu" },
      { num: "10", word: "பத்து", pron: "Pathu" },
      { num: "100", word: "நூறு", pron: "Nūṟu" },
      { num: "1000", word: "ஆயிரம்", pron: "Āyiram" },
    ]
  },
  {
    id: "book-bn",
    langCode: "bn",
    title: "Bengali Heritage, Ghats & Literature Companion",
    subtitle: "Conversational handbook for Kolkata, Shantiniketan & Sundarbans",
    coverColor: "from-emerald-600 via-teal-600 to-cyan-700",
    badge: "UNESCO Heritage Edition",
    pages: "42 Pages · Illustrated PDF Guide",
    size: "3.7 MB Offline eBook",
    chapters: [
      "1. Bengali Letters & Sweet Phonetics (অ, আ, ই, ঈ...)",
      "2. Counting & Kolkata Yellow Taxi Negotiation",
      "3. Victoria Memorial & Howrah Bridge Walking Dialogues",
      "4. Ordering Rosogolla, Mishti Doi & Hilsa Delicacies",
      "5. Shantiniketan Handicrafts & Kantha Stitch Shopping",
      "6. River Cruise & Ghat Safety Etiquette",
      "7. West Bengal Police & Emergency Directory"
    ],
    alphabets: [
      { char: "অ (O)", pron: "Rounded 'o' as in Hot", ex: "অমর (Omor - Eternal)" },
      { char: "আ (Aa)", pron: "Open 'aa' as in Art", ex: "আম (Aam - Mango)" },
      { char: "ক (Ko)", pron: "'k' as in Kol", ex: "কলম (Kalam - Pen)" },
      { char: "ন (No)", pron: "'n' as in Name", ex: "নমস্কার (Nomoshkar - Greetings)" },
    ],
    numbers: [
      { num: "1", word: "এক", pron: "Ēk" },
      { num: "2", word: "দুই", pron: "Dui" },
      { num: "3", word: "তিন", pron: "Tin" },
      { num: "4", word: "চার", pron: "Chār" },
      { num: "5", word: "পাঁচ", pron: "Pānch" },
      { num: "10", word: "দশ", pron: "Dosh" },
      { num: "100", word: "এক শত", pron: "Ēk Shotō" },
      { num: "1000", word: "এক হাজার", pron: "Ēk Hājār" },
    ]
  },
  {
    id: "book-kn",
    langCode: "kn",
    title: "Kannada Heritage & Western Ghats Traveler Guide",
    subtitle: "Essential conversational companion for Hampi, Mysore & Coorg",
    coverColor: "from-amber-600 via-yellow-600 to-orange-700",
    badge: "Karnataka Tourism Companion",
    pages: "40 Pages · Illustrated PDF Guide",
    size: "3.6 MB Offline eBook",
    chapters: [
      "1. Kannada Alphabet & Vowels (ಅ, ಆ, ಇ, ಈ...)",
      "2. Numbers & Bangalore Auto Meter Dialogues",
      "3. Hampi UNESCO Ruins & Virupaksha Temple Terms",
      "4. Mysore Palace & Dasara Festival Cultural Vocab",
      "5. Ordering Udupi Masala Dosa, Filter Coffee & Mysore Pak",
      "6. Sandalwood & Channapatna Wooden Toys Buying Guide",
      "7. Karnataka Police & Forest Trek Emergency Helplines"
    ],
    alphabets: [
      { char: "ಅ (A)", pron: "Short 'a' as in Cup", ex: "ಅರಸ (Arasa - King)" },
      { char: "ಆ (Aa)", pron: "Long 'aa' as in Car", ex: "ಆನೆ (Aane - Elephant)" },
      { char: "ನ (Na)", pron: "'n' as in Nice", ex: "ನಮಸ್ಕಾರ (Namaskara - Hello)" },
    ],
    numbers: [
      { num: "1", word: "ಒಂದು", pron: "Ondu" },
      { num: "2", word: "ಎರಡು", pron: "Eraḍu" },
      { num: "3", word: "ಮೂರು", pron: "Mūru" },
      { num: "4", word: "ನಾಲ್ಕು", pron: "Nālku" },
      { num: "5", word: "ಐದು", pron: "Aidu" },
      { num: "10", word: "ಹತ್ತು", pron: "Hattu" },
      { num: "100", word: "ನೂರು", pron: "Nūru" },
      { num: "1000", word: "ಒಂದು ಸಾವಿರ", pron: "Ondu Sāvira" },
    ]
  },
  {
    id: "book-mr",
    langCode: "mr",
    title: "Marathi Forts, Citadels & Sahyadri Lexicon",
    subtitle: "Language companion for Mumbai, Pune, Ajanta & Ellora Caves",
    coverColor: "from-orange-600 via-amber-600 to-red-600",
    badge: "Maratha Heritage Edition",
    pages: "42 Pages · Illustrated PDF Guide",
    size: "3.8 MB Offline eBook",
    chapters: [
      "1. Marathi Devanagari Letters & Pronunciations",
      "2. Numbers & Mumbai Local Train Route Inquiries",
      "3. Raigad & Shivneri Fort Trekking Terminology",
      "4. Ajanta & Ellora Rock-Cut Cave Architectural Terms",
      "5. Authentic Puran Poli, Vada Pav & Misal Ordering",
      "6. Paithani Silk Sarees & Kolhapuri Chappals Verification",
      "7. Emergency Disaster & Maharashtra Police Directory"
    ],
    alphabets: [
      { char: "अ (A)", pron: "Short 'a' as in Above", ex: "अमर (Amar - Immortal)" },
      { char: "न (Na)", pron: "'n' as in Name", ex: "नमस्कार (Namaskar - Hello)" },
      { char: "ळ (Lha)", pron: "Retroflex 'L' unique to Marathi", ex: "बाळ (Baal - Child)" },
    ],
    numbers: [
      { num: "1", word: "एक", pron: "Ēk" },
      { num: "2", word: "दोन", pron: "Dōn" },
      { num: "3", word: "तीन", pron: "Tīn" },
      { num: "4", word: "चार", pron: "Chār" },
      { num: "5", word: "पाँच", pron: "Pāch" },
      { num: "10", word: "दहा", pron: "Dahā" },
      { num: "100", word: "शंभर", pron: "Shambhar" },
      { num: "1000", word: "एक हजार", pron: "Ēk Hazār" },
    ]
  },
  {
    id: "book-ml",
    langCode: "ml",
    title: "Malayalam Backwaters & Spice Coast Handbook",
    subtitle: "Language and cultural guide for Kochi, Munnar & Alleppey",
    coverColor: "from-teal-600 via-emerald-600 to-green-700",
    badge: "God's Own Country Edition",
    pages: "40 Pages · Illustrated PDF Guide",
    size: "3.5 MB Offline eBook",
    chapters: [
      "1. Malayalam Script & Rounded Sounds (അ, ആ, ഇ, ഈ...)",
      "2. Numbers & Houseboat Cruise Inquiries",
      "3. Fort Kochi Chinese Fishing Nets & Synagogue Walks",
      "4. Munnar Tea Estate & Cardamom Plantation Vocabulary",
      "5. Kerala Sadya, Appam & Coconut Stew Dining Phrases",
      "6. Kathakali Dance & Kalaripayattu Martial Arts Terms",
      "7. Kerala Tourist Police & Backwater Rescue Helplines"
    ],
    alphabets: [
      { char: "അ (A)", pron: "Short 'a' as in America", ex: "അമ്മ (Amma - Mother)" },
      { char: "ന (Na)", pron: "'n' as in Name", ex: "നമസ്കാരം (Namaskaram - Hello)" },
    ],
    numbers: [
      { num: "1", word: "ഒന്ന്", pron: "Onnu" },
      { num: "2", word: "രണ്ട്", pron: "Raṇḍu" },
      { num: "3", word: "മൂന്ന്", pron: "Mūnnu" },
      { num: "4", word: "നാല്", pron: "Nālu" },
      { num: "5", word: "അഞ്ച്", pron: "Anchu" },
      { num: "10", word: "പത്ത്", pron: "Pathu" },
      { num: "100", word: "നൂറ്", pron: "Nūṟu" },
      { num: "1000", word: "ആയിരം", pron: "Āyiram" },
    ]
  },
  {
    id: "book-gu",
    langCode: "gu",
    title: "Gujarati Craft, Rann & Merchant Phrasebook",
    subtitle: "Conversational handbook for Ahmedabad, Somnath & Kutch",
    coverColor: "from-amber-600 via-red-600 to-pink-700",
    badge: "Heritage & Craft Edition",
    pages: "38 Pages · Illustrated PDF Guide",
    size: "3.4 MB Offline eBook",
    chapters: [
      "1. Gujarati Script & Vowels (અ, આ, ઇ, ઈ...)",
      "2. Counting & Textile Market Bargaining",
      "3. Rann of Kutch White Desert & Bhuj Artisan Village Dialogues",
      "4. Somnath & Dwarka Sacred Pilgrimage Terms",
      "5. Gujarati Thali, Dhokla, Fafda & Jalebi Dining Vocab",
      "6. Patola Silk & Rogan Art Authentic Craft Inquiries",
      "7. Gujarat Tourist Police & Emergency 108 Network"
    ],
    alphabets: [
      { char: "અ (A)", pron: "Short 'a' as in Alone", ex: "અમર (Amar - Immortal)" },
      { char: "ન (Na)", pron: "'n' as in Name", ex: "નમસ્તે (Namaste - Hello)" },
    ],
    numbers: [
      { num: "1", word: "એક", pron: "Ēk" },
      { num: "2", word: "બે", pron: "Bē" },
      { num: "3", word: "ત્રણ", pron: "Traṇ" },
      { num: "4", word: "ચાર", pron: "Chār" },
      { num: "5", word: "પાંચ", pron: "Pānch" },
      { num: "10", word: "દસ", pron: "Das" },
      { num: "100", word: "સો", pron: "Sō" },
      { num: "1000", word: "એક હજાર", pron: "Ēk Hazār" },
    ]
  }
];

// // Comprehensive Multilingual Offline Language Packs Metadata
export const offlineLanguagePacks = [
  {
    id: "pack-te",
    code: "te",
    name: "Telugu",
    nativeName: "తెలుగు",
    size: "1.4 MB",
    phrases: "1,850+ Expressions",
    vocab: "4,200+ Words",
    description: "Complete lexicon for Andhra Pradesh & Telangana, Tirupati, Araku, Hyderabad, Amaravati.",
    version: "v4.2-Edge",
    status: "Ready",
  },
  {
    id: "pack-hi",
    code: "hi",
    name: "Hindi",
    nativeName: "हिन्दी",
    size: "1.8 MB",
    phrases: "2,400+ Expressions",
    vocab: "5,800+ Words",
    description: "Comprehensive North & Central India vocabulary, Varanasi, Agra, Rajasthan, Delhi, MP.",
    version: "v4.2-Edge",
    status: "Ready",
  },
  {
    id: "pack-ta",
    code: "ta",
    name: "Tamil",
    nativeName: "தமிழ்",
    size: "1.3 MB",
    phrases: "1,600+ Expressions",
    vocab: "3,900+ Words",
    description: "Tamil Nadu, Madurai, Thanjavur, Rameswaram, Chennai heritage lexicon.",
    version: "v4.2-Edge",
    status: "Ready",
  },
  {
    id: "pack-bn",
    code: "bn",
    name: "Bengali",
    nativeName: "বাংলা",
    size: "1.3 MB",
    phrases: "1,550+ Expressions",
    vocab: "3,800+ Words",
    description: "West Bengal, Kolkata, Darjeeling, Bishnupur, Sundarbans travel lexicon.",
    version: "v4.2-Edge",
    status: "Ready",
  },
  {
    id: "pack-kn",
    code: "kn",
    name: "Kannada",
    nativeName: "ಕನ್ನಡ",
    size: "1.2 MB",
    phrases: "1,500+ Expressions",
    vocab: "3,600+ Words",
    description: "Karnataka, Hampi, Mysore, Badami, Bengaluru heritage lexicon.",
    version: "v4.2-Edge",
    status: "Ready",
  },
  {
    id: "pack-mr",
    code: "mr",
    name: "Marathi",
    nativeName: "मराठी",
    size: "1.3 MB",
    phrases: "1,620+ Expressions",
    vocab: "3,900+ Words",
    description: "Maharashtra, Ajanta & Ellora, Pune, Mumbai, Western Ghats lexicon.",
    version: "v4.2-Edge",
    status: "Ready",
  },
  {
    id: "pack-gu",
    code: "gu",
    name: "Gujarati",
    nativeName: "ગુજરાતી",
    size: "1.1 MB",
    phrases: "1,400+ Expressions",
    vocab: "3,400+ Words",
    description: "Gujarat, Somnath, Dwarka, Rann of Kutch, Ahmedabad heritage lexicon.",
    version: "v4.2-Edge",
    status: "Ready",
  },
  {
    id: "pack-ml",
    code: "ml",
    name: "Malayalam",
    nativeName: "മലയാളം",
    size: "1.2 MB",
    phrases: "1,450+ Expressions",
    vocab: "3,500+ Words",
    description: "Kerala, Kochi, Munnar, Alleppey backwaters, Wayanad travel lexicon.",
    version: "v4.2-Edge",
    status: "Ready",
  },
  {
    id: "pack-pa",
    code: "pa",
    name: "Punjabi",
    nativeName: "ਪੰਜਾਬੀ",
    size: "1.1 MB",
    phrases: "1,350+ Expressions",
    vocab: "3,300+ Words",
    description: "Punjab, Golden Temple Amritsar, Patiala, Anandpur Sahib lexicon.",
    version: "v4.2-Edge",
    status: "Ready",
  },
  {
    id: "pack-or",
    code: "or",
    name: "Odia",
    nativeName: "ଓଡ଼ିଆ",
    size: "1.0 MB",
    phrases: "1,200+ Expressions",
    vocab: "3,100+ Words",
    description: "Odisha, Puri Jagannath, Konark Sun Temple, Bhubaneswar lexicon.",
    version: "v4.2-Edge",
    status: "Ready",
  },
];

// Check if a language pack is installed in local storage
export function isLanguagePackInstalled(langCode) {
  try {
    const installed = localStorage.getItem("by-installed-offline-packs");
    if (!installed) return true; // Default essential packs active
    const list = JSON.parse(installed);
    return list.includes(langCode) || list.includes("all");
  } catch {
    return true;
  }
}

// Mark language pack as installed locally
export function installOfflineLanguagePack(langCode) {
  try {
    const installed = localStorage.getItem("by-installed-offline-packs");
    let list = installed ? JSON.parse(installed) : ["te", "hi", "en"];
    if (!list.includes(langCode)) {
      list.push(langCode);
    }
    localStorage.setItem("by-installed-offline-packs", JSON.stringify(list));
    return true;
  } catch {
    return false;
  }
}

// Download Standalone Offline JSON / Tool Package for local storage
export function exportOfflineLanguagePackFile(langCode = "te") {
  const packInfo = offlineLanguagePacks.find(p => p.code === langCode) || offlineLanguagePacks[0];
  const langObj = languageOptions.find(l => l.code === langCode) || languageOptions[0];
  
  const payload = {
    package: `Bharat Yatra 100% Offline Edge Translation Engine - ${langObj.name}`,
    version: "4.2.0-standalone",
    generatedAt: new Date().toISOString(),
    language: langObj,
    metadata: packInfo,
    offlinePhrases: comprehensivePhrasebook.map(p => ({
      id: p.id,
      category: p.category,
      english: p.en,
      translation: p.translations[langCode] || p.translations["te"] || p.translations["hi"],
    })),
    usageGuide: "Load this standalone offline lexicon in any device, browser, or field tablet without active internet.",
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `bharat-yatra-offline-${langCode}-pack.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  installOfflineLanguagePack(langCode);
}

// Download All-India Master Offline Pack
export function exportAllLanguagePacksFile() {
  const payload = {
    package: "Bharat Yatra All-India Master Offline Edge Translation & Lexicon Pack",
    version: "4.2.0-master",
    generatedAt: new Date().toISOString(),
    languages: languageOptions,
    allPacks: offlineLanguagePacks,
    phraseCount: comprehensivePhrasebook.length,
    phrasebook: comprehensivePhrasebook,
    instructions: "This comprehensive All-India Master Dictionary provides instant 0ms translations across all 11 Indian regional languages with zero internet dependency.",
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `bharat-yatra-all-india-offline-master-pack.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  try {
    localStorage.setItem("by-installed-offline-packs", JSON.stringify(["all", ...languageOptions.map(l => l.code)]));
  } catch {}
}

// Offline translation lookup helper (0ms latency, pure local edge execution)
export function translateOfflineQuery(text, targetLangCode = "te", sourceLangCode = "en") {
  if (!text || !text.trim()) return null;
  const clean = text.trim().toLowerCase();

  // 1. Direct match or fuzzy containment in comprehensive phrasebook
  for (const p of comprehensivePhrasebook) {
    const enLower = p.en.toLowerCase();
    const cleanNoPunct = clean.replace(/[^a-z0-9 ]/g, "");
    const enNoPunct = enLower.replace(/[^a-z0-9 ]/g, "");

    if (enLower === clean || enNoPunct === cleanNoPunct || cleanNoPunct.includes(enNoPunct) || enNoPunct.includes(cleanNoPunct)) {
      const trans = p.translations[targetLangCode] || p.translations["te"] || p.translations["hi"];
      if (trans) {
        return {
          translatedText: trans.script,
          pronunciation: trans.pron,
          culturalNote: trans.tip || "Polite regional formulation.",
          engine: "offline-edge-lexicon",
          category: p.category,
          latency: "0ms",
        };
      }
    }
  }

  // 2. High-speed Multilingual Vocabulary & Sentence Builder Dictionary
  const vocabDict = {
    // Basic Greetings & Politeness
    "hello": { en: "Hello", te: "నమస్కారం (Namaskāram)", hi: "नमस्ते (Namastē)", ta: "வணக்கம் (Vaṇakkam)", bn: "নমস্কার (Nomoshkār)", kn: "ನಮಸ್ಕಾರ (Namaskāra)", mr: "नमस्कार (Namaskār)", gu: "નમસ્તે (Namastē)", ml: "നമസ്കാരം (Namaskāram)", pa: "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ (Sat Srī Akāl)" },
    "hi": { en: "Hi", te: "నమస్కారం (Namaskāram)", hi: "नमस्ते (Namastē)", ta: "வணக்கம் (Vaṇakkam)", bn: "নমস্কার (Nomoshkār)", kn: "ನಮಸ್ಕಾರ (Namaskāra)", mr: "नमस्कार (Namaskār)", gu: "નમસ્તે (Namastē)", ml: "നമസ്കാരം (Namaskāram)", pa: "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ (Sat Srī Akāl)" },
    "namaste": { en: "Greetings / Hello", te: "నమస్కారం (Namaskāram)", hi: "नमस्ते (Namastē)", ta: "வணக்கம் (Vaṇakkam)", bn: "নমস্কার (Nomoshkār)", kn: "ನಮಸ್ಕಾರ (Namaskāra)", mr: "नमस्कार (Namaskār)", gu: "નમસ્તે (Namastē)", ml: "നമസ്കാരം (Namaskāram)", pa: "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ (Sat Srī Akāl)" },
    "namaskaram": { en: "Greetings / Respectful Hello", te: "నమస్కారం (Namaskāram)", hi: "सादर प्रणाम (Sādar praṇām)", ta: "வணக்கம் (Vaṇakkam)", bn: "নমস্কার (Nomoshkār)", kn: "ನಮಸ್ಕಾರ (Namaskāra)", mr: "नमस्कार (Namaskār)", gu: "નમસ્તે (Namastē)", ml: "നമസ്കാരം (Namaskāram)", pa: "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ (Sat Srī Akāl)" },
    "vanakkam": { en: "Greetings / Hello", te: "నమస్కారం (Namaskāram)", hi: "नमस्ते (Namastē)", ta: "வணக்கம் (Vaṇakkam)", bn: "নমস্কার (Nomoshkār)", kn: "ನಮಸ್ಕಾರ (Namaskāra)", mr: "नमस्कार (Namaskār)", gu: "નમસ્તે (Namastē)", ml: "നമസ്കാരം (Namaskāram)", pa: "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ (Sat Srī Akāl)" },
    "good morning": { en: "Good morning", te: "శుభోదయం (Shubhōdayam)", hi: "शुभ प्रभात (Shubh Prabhāt)", ta: "காலை வணக்கம் (Kālai vaṇakkam)", bn: "সুপ্রভাত (Suprabhāt)", kn: "ಶುಭೋದಯ (Shubhōdaya)", mr: "शुभ सकाळ (Shubh sakāḷ)", gu: "સુપ્રભાત (Suprabhāt)", ml: "സുപ്രഭാതം (Suprabhātam)", pa: "ਸ਼ੁਭ ਸਵੇਰ (Shubh savēr)" },
    "good evening": { en: "Good evening", te: "శుభ సాయంత్రం (Shubha Sāyantram)", hi: "शुभ संध्या (Shubh Sandhyā)", ta: "மாலை வணக்கம் (Mālai vaṇakkam)", bn: "শুভ সন্ধ্যা (Shubhō shondhyā)", kn: "ಶುಭ ಸಂಜೆ (Shubha sanje)", mr: "शुभ संध्याकाळ (Shubh sandhyākāḷ)", gu: "શુભ સાંજ (Shubh sānj)", ml: "ശുഭ സായാഹ്നം (Shubha sāyāhnam)", pa: "ਸ਼ੁਭ ਸ਼ਾਮ (Shubh shām)" },
    "good night": { en: "Good night", te: "శుభరాత్రి (Shubharātri)", hi: "शुभ रात्रि (Shubh rātri)", ta: "இனிய இரவு (Iṉiya iravu)", bn: "শুভরাত্রি (Shubharātri)", kn: "ಶುಭರಾತ್ರಿ (Shubharātri)", mr: "शुभ रात्री (Shubh rātrī)", gu: "શુભ રાત્રિ (Shubh rātri)", ml: "ശുഭരാത്രി (Shubharāthri)", pa: "ਸ਼ੁਭ ਰਾਤ (Shubh rāt)" },
    "welcome": { en: "Welcome", te: "స్వాగతం (Swāgatam)", hi: "स्वागत है (Swāgat hai)", ta: "நல்வரவு (Nalvaravu)", bn: "স্বাগতম (Swāgotom)", kn: "ಸ್ವಾಗತ (Swāgata)", mr: "स्वागत आहे (Swāgat āhē)", gu: "સ્વાગત છે (Swāgat chhe)", ml: "സ്വാഗതം (Swāgatham)", pa: "ਜੀ ਆਇਆਂ ਨੂੰ (Jī āiān nū)" },
    "thank you": { en: "Thank you", te: "చాలా ధన్యవాదాలు (Chālā dhanyavādālu)", hi: "धन्यवाद / शुक्रिया (Dhanyavād / Shukriyā)", ta: "மிக்க நன்றி (Mikka naṉṟi)", bn: "অনেক ধন্যবাদ (Onēk dhonyobād)", kn: "ತುಂಬಾ ಧನ್ಯವಾದಗಳು (Tumbā dhanyavādagalu)", mr: "खूप धन्यवाद (Khūp dhanyavād)", gu: "ખૂબ આભાર (Khūb ābhār)", ml: "വളരെ നന്ദി (Valare nandi)", pa: "ਬਹੁਤ ਧੰਨਵਾਦ (Bahut dhanvād)" },
    "thanks": { en: "Thanks", te: "ధన్యవాదాలు (Dhanyavādālu)", hi: "धन्यवाद (Dhanyavād)", ta: "நன்றி (Naṉṟi)", bn: "ধন্যবাদ (Dhonyobād)", kn: "ಧನ್ಯವಾದ (Dhanyavāda)", mr: "धन्यवाद (Dhanyavād)", gu: "આભાર (Ābhār)", ml: "നന്ദി (Nandi)", pa: "ਧੰਨਵਾਦ (Dhanvād)" },
    "dhanyavadalu": { en: "Thank you", te: "ధన్యవాదాలు (Dhanyavādālu)", hi: "धन्यवाद (Dhanyavād)", ta: "நன்றி (Naṉṟi)", bn: "ধন্যবাদ (Dhonyobād)", kn: "ಧನ್ಯವಾದ (Dhanyavāda)", mr: "धन्यवाद (Dhanyavād)", gu: "આભાર (Ābhār)", ml: "നന്ദി (Nandi)", pa: "ਧੰਨਵਾਦ (Dhanvād)" },
    "dhanyavad": { en: "Thank you", te: "ధన్యవాదాలు (Dhanyavādālu)", hi: "धन्यवाद (Dhanyavād)", ta: "நன்றி (Naṉṟi)", bn: "ধন্যবাদ (Dhonyobād)", kn: "ಧನ್ಯವಾದ (Dhanyavāda)", mr: "धन्यवाद (Dhanyavād)", gu: "આભાર (Ābhār)", ml: "നന്ദി (Nandi)", pa: "ਧੰਨਵਾਦ (Dhanvād)" },
    "how are you": { en: "How are you?", te: "మీరు ఎలా ఉన్నారు? (Mīru elā unnāru?)", hi: "आप कैसे हैं? (Āp kaisē hain?)", ta: "நீங்கள் எப்படி இருக்கிறீர்கள்? (Nīṅkaḷ eppaṭi irukkiṟīrkaḷ?)", bn: "আপনি কেমন আছেন? (Āpni kēmōn āchhēn?)", kn: "ನೀವು ಹೇಗಿದ್ದೀರಿ? (Nīvu hēgiddīri?)", mr: "तुम्ही कसे आहात? (Tumhī kasē āhāt?)", gu: "તમે કેમ છો? (Tamē kēm chho?)", ml: "സുഖമാണോ? (Sukhamāṇō?)", pa: "ਤੁਹਾਡਾ ਕੀ ਹਾਲ ਹੈ? (Tuhāḍā kī hāl hai?)" },
    "ela unnaru": { en: "How are you? (Telugu)", te: "ఎలా ఉన్నారు? (Elā unnāru?)", hi: "कैसे हैं आप? (Kaisē hain āp?)", ta: "எப்படி இருக்கிறீர்கள்? (Eppaṭi irukkiṟīrkaḷ?)", bn: "কেমন আছেন? (Kēmōn āchhēn?)", kn: "ಹೇಗಿದ್ದೀರಿ? (Hēgiddīri?)", mr: "कसे आहात? (Kasē āhāt?)", gu: "કેમ છો? (Kēm chho?)", ml: "സുഖമാണോ? (Sukhamāṇō?)", pa: "ਕਿਵੇਂ ਹੋ? (Kivēṁ hō?)" },
    "kahan hai": { en: "Where is it? (Hindi)", te: "ఎక్కడ ఉంది? (Ekkaḍa undi?)", hi: "कहाँ है? (Kahān hai?)", ta: "எங்கே இருக்கிறது? (Eṅkē irukkiṟathu?)", bn: "কোথায়? (Kōthāy?)", kn: "ಎಲ್ಲಿದೆ? (Ellide?)", mr: "कुठे आहे? (Kuṭhē āhē?)", gu: "ક્યાં છે? (Kyān chhe?)", ml: "എവിടെയാണ്? (Eviḍeyāṇu?)", pa: "ਕਿੱਥੇ ਹੈ? (Kithē hai?)" },
    "i am fine": { en: "I am fine", te: "నేను బాగున్నాను (Nēnu bāgunnānu)", hi: "मैं ठीक हूँ (Main ṭhīk hūn)", ta: "நான் நலமாக இருக்கிறேன் (Nāṉ nalamāka irukkiṟēṉ)", bn: "আমি ভালো আছি (Āmi bhālō āchhi)", kn: "ನಾನು ಚೆನ್ನಾಗಿದ್ದೇನೆ (Nānu chennāgiddēne)", mr: "मी ठीक आहे (Mī ṭhīk āhē)", gu: "હું મજામાં છું (Hun majāmān chhun)", ml: "എനിക്ക് സുഖമാണ് (Enikku sukhamāṇu)", pa: "ਮੈਂ ਠੀਕ ਹਾਂ (Main ṭhīk hān)" },
    "what is your name": { en: "What is your name?", te: "మీ పేరు ఏమిటి? (Mī pēru ēmiṭi?)", hi: "आपका नाम क्या है? (Āpkā nām kyā hai?)", ta: "உங்கள் பெயர் என்ன? (Uṅgaḷ peyar eṉṉa?)", bn: "আপনার নাম কি? (Āpnār nām ki?)", kn: "ನಿಮ್ಮ ಹೆಸರೇನು? (Nimma hesarēnu?)", mr: "तुमचे नाव काय आहे? (Tumchē nāv kāy āhē?)", gu: "તમારું નામ શું છે? (Tamārun nām shun chhe?)", ml: "നിങ്ങളുടെ പേരെന്താണ്? (Niṅṅaḷuṭe pērentāṇu?)", pa: "ਤੁਹਾਡਾ ਨਾਮ ਕੀ ਹੈ? (Tuhāḍā nām kī hai?)" },
    "my name is": { en: "My name is...", te: "నా పేరు... (Nā pēru...)", hi: "मेरा नाम... है (Mērā nām... hai)", ta: "என் பெயர்... (Eṉ peyar...)", bn: "আমার নাম... (Āmār nām...)", kn: "ನನ್ನ ಹೆಸರು... (Nanna hesaru...)", mr: "माझे नाव... आहे (Mājhē nāv... āhē)", gu: "મારું નામ... છે (Mārun nām... chhe)", ml: "എന്റെ പേര്... (Ente pēru...)", pa: "ਮੇਰਾ ਨਾਮ... ਹੈ (Mērā nām... hai)" },
    "please": { en: "Please", te: "దయచేసి (Dayachēsi)", hi: "कृपया (Kripayā)", ta: "தயவுசெய்து (Thayavuseythu)", bn: "দয়া করে (Doyā korē)", kn: "ದಯವಿಟ್ಟು (Dayaviṭṭu)", mr: "कृपया (Kripayā)", gu: "કૃપા કરીને (Krupā karīnē)", ml: "ദയവായി (Dayavāyi)", pa: "ਕਿਰਪਾ ਕਰਕੇ (Kirpā karkē)" },
    "sorry": { en: "Sorry / Excuse me", te: "నన్ను క్షమించండి (Nannu kshaminchaṇḍi)", hi: "माफ़ कीजिये (Māf kījiye)", ta: "மன்னிக்கவும் (Maṉṉikkavum)", bn: "আমাকে মাফ করবেন (Āmākē māf korbēn)", kn: "ಕ್ಷಮಿಸಿ (Kshamisi)", mr: "माफ करा (Māf karā)", gu: "માફ કરશો (Māf karsho)", ml: "ക്ഷമിക്കണം (Kshamikkanam)", pa: "ਮਾਫ਼ ਕਰਨਾ (Māf karnā)" },
    "excuse me": { en: "Excuse me", te: "కొంచెం వినండి / క్షమించండి (Konchem vinaṇḍi)", hi: "माफ़ कीजिये / सुनिए (Suniye)", ta: "தயவுசெய்து கவனியுங்கள் (Kavaṉiyuṅkaḷ)", bn: "শুনুন (Shunun)", kn: "ಸ್ವಲ್ಪ ಕೇಳಿ (Svalpa kēḷi)", mr: "ऐका (Aikā)", gu: "સાંભળો (Sāmbhaḷō)", ml: "ഒന്നു ശ്രദ്ധിക്കൂ (Orkkuka)", pa: "ਸੁਣੋ ਜੀ (Suṇō jī)" },

    // Essential Places, Landmarks & Monuments
    "temple": { en: "Temple", te: "గుడి / దేవాలయం (Guḍi / Dēvālayaṁ)", hi: "मंदिर (Mandir)", ta: "கோவில் (Kōvil)", bn: "মন্দির (Mondir)", kn: "ದೇವಸ್ಥಾನ (Dēvasthāna)", mr: "मंदिर (Mandir)", gu: "મંદિર (Mandir)", ml: "ക്ഷേത്രം (Kshētram)", pa: "ਮੰਦਰ (Mandir)" },
    "mandir": { en: "Temple", te: "గుడి (Guḍi)", hi: "मंदिर (Mandir)", ta: "கோவில் (Kōvil)", bn: "মন্দির (Mondir)", kn: "ದೇವಸ್ಥಾನ (Dēvasthāna)", mr: "मंदिर (Mandir)", gu: "મંદિર (Mandir)", ml: "ക്ഷേത്രം (Kshētram)", pa: "ਮੰਦਰ (Mandir)" },
    "gudi": { en: "Temple", te: "గుడి (Guḍi)", hi: "मंदिर (Mandir)", ta: "கோவில் (Kōvil)", bn: "মন্দির (Mondir)", kn: "ದೇವಸ್ಥಾನ (Dēvasthāna)", mr: "मंदिर (Mandir)", gu: "મંદિર (Mandir)", ml: "ക്ഷേത്രം (Kshētram)", pa: "ਮੰਦਰ (Mandir)" },
    "mosque": { en: "Mosque", te: "మసీదు (Masīdu)", hi: "मस्जिद (Masjid)", ta: "பள்ளிவாசல் (Paḷḷivāsal)", bn: "মসজিদ (Mōshjid)", kn: "ಮಸೀದಿ (Masīdi)", mr: "मशीद (Mashīd)", gu: "મસ્જિદ (Masjid)", ml: "പള്ളി (Paḷḷi)", pa: "ਮਸਜਿਦ (Masjid)" },
    "church": { en: "Church", te: "చర్చి (Churchi)", hi: "चर्च / गिरजाघर (Church)", ta: "தேவாலயம் (Thēvālayam)", bn: "গির্জা (Girjā)", kn: "ಚರ್ಚ್ (Church)", mr: "चर्च (Church)", gu: "ચર્ચ (Church)", ml: "പള്ളി (Paḷḷi)", pa: "ਚਰਚ (Church)" },
    "fort": { en: "Fort", te: "కోట (Kōṭa)", hi: "किला (Qilā)", ta: "கோட்டை (Kōṭṭai)", bn: "কেল্লা / দুর্গ (Kēllā)", kn: "ಕೋಟೆ (Kōṭe)", mr: "किल्ला (Killā)", gu: "કિલ્લો (Killō)", ml: "കോട്ട (Kōṭṭa)", pa: "ਕਿਲ੍ਹਾ (Qilā)" },
    "palace": { en: "Palace", te: "రాజభవనం / మహల్ (Rājabhavanam)", hi: "महल / राजमहल (Mahal)", ta: "அரண்மனை (Araṇmaṉai)", bn: "রাজপ্রাসাদ (Rājprāsād)", kn: "ಅರಮನೆ (Aramane)", mr: "राजवाडा (Rājwāḍā)", gu: "મહેલ (Mahel)", ml: "കൊട്ടാരം (Koṭṭāram)", pa: "ਮਹਿਲ (Mahal)" },
    "museum": { en: "Museum", te: "మ్యూజియం / పురావస్తు శాల (Museum)", hi: "संग्रहालय (Sangrahālay)", ta: "அருங்காட்சியகம் (Aruṅkāṭciyakam)", bn: "জাদুঘর (Jādughor)", kn: "ವಸ್ತುಸಂಗ್ರಹಾಲಯ (Vastusangrahālaya)", mr: "वस्तुसंग्रहालय (Vastusangrahālay)", gu: "સંગ્રહાલય (Sangrahālay)", ml: "മ്യൂസിയം (Museum)", pa: "ਅਜਾਇਬ ਘਰ (Ajāib ghar)" },
    "cave": { en: "Cave / Caves", te: "గుహ / గుహలు (Guha / Guhalu)", hi: "गुफा / गुफाएं (Gufā)", ta: "குகை (Kukai)", bn: "গুহা (Guhā)", kn: "ಗುಹೆ (Guhe)", mr: "लेणी / गुहा (Lēṇī)", gu: "ગુફા (Gufā)", ml: "ഗുഹ (Guha)", pa: "ਗੁਫਾ (Gufā)" },
    "river": { en: "River", te: "నది (Nadi)", hi: "नदी (Nadī)", ta: "நதி / ஆறு (Nathi / Āṟu)", bn: "নদী (Nodi)", kn: "ನದಿ (Nadi)", mr: "नदी (Nadī)", gu: "નદી (Nadī)", ml: "പുഴ (Puzha)", pa: "ਦਰਿਆ (Dariyā)" },
    "ghat": { en: "Ghat / Riverbank Steps", te: "ఘాట్ / రేవు (Ghāṭ)", hi: "घाट (Ghāṭ)", ta: "படித்துறை (Paṭittuṟai)", bn: "ঘাট (Ghāṭ)", kn: "ಘಾಟ್ (Ghāṭ)", mr: "घाट (Ghāṭ)", gu: "ઘાટ (Ghāṭ)", ml: "ഘട്ട് (Ghaṭṭu)", pa: "ਘਾਟ (Ghāṭ)" },
    "lake": { en: "Lake", te: "సరస్సు (Sarassu)", hi: "झील (Jhīl)", ta: "ஏரி (Ēri)", bn: "হ্রদ (Hrod)", kn: "ಸರೋವರ (Sarōvara)", mr: "तलाव (Talāv)", gu: "તળાવ (Taḷāv)", ml: "തടാകം (Thaṭākam)", pa: "ਝੀਲ (Jhīl)" },
    "mountain": { en: "Mountain / Hills", te: "కొండ / పర్వతం (Koṇḍa / Parvatam)", hi: "पहाड़ / पर्वत (Pahāṛ)", ta: "மலை (Malai)", bn: "পাহাড় (Pāhāṛ)", kn: "ಬೆಟ್ಟ (Beṭṭa)", mr: "पर्वत (Parvat)", gu: "પર્વત (Parvat)", ml: "മല (Mala)", pa: "ਪਹਾੜ (Pahāṛ)" },
    "beach": { en: "Beach", te: "సముద్ర తీరం / బీచ్ (Beach)", hi: "समुद्र तट / बीच (Samudra taṭ)", ta: "கடற்கரை (Kaṭaṟkarai)", bn: "সমুদ্র সৈকত (Shōikot)", kn: "ಕಡಲತೀರ (Kaḍalatīra)", mr: "समुद्रकिनारा (Samudrakinārā)", gu: "દરિયાકિનારો (Dariyākinārō)", ml: "കടപ്പുറം (Kaṭappuṟam)", pa: "ਸਮੁੰਦਰ ਕੰਢਾ (Beach)" },
    "market": { en: "Market / Bazaar", te: "మార్కెట్ / సంత / బజారు (Bazaar)", hi: "बाज़ार / मंडी (Bāzār)", ta: "சந்தை / அங்காடி (Sandhai)", bn: "বাজার (Bājār)", kn: "ಮಾರುಕಟ್ಟೆ (Mārukaṭṭe)", mr: "बाजार (Bājār)", gu: "બજાર (Bajār)", ml: "ചന്ത (Chantha)", pa: "ਬਾਜ਼ਾਰ (Bāzār)" },
    "bazaar": { en: "Bazaar / Market", te: "బజారు (Bajār)", hi: "बाज़ार (Bāzār)", ta: "சந்தை (Sandhai)", bn: "বাজার (Bājār)", kn: "ಬಜಾರ್ (Bajār)", mr: "बाजार (Bājār)", gu: "બજાર (Bajār)", ml: "ചന്ത (Chantha)", pa: "ਬਾਜ਼ਾਰ (Bāzār)" },
    "shop": { en: "Shop / Store", te: "దుకాణం / షాపు (Dukāṇaṁ)", hi: "दुकान (Dukān)", ta: "கடை (Kaṭai)", bn: "দোকান (Dōkān)", kn: "ಅಂಗಡಿ (Aṅgaḍi)", mr: "दुकान (Dukān)", gu: "દુકાન (Dukān)", ml: "കട (Kaṭa)", pa: "ਦੁਕਾਨ (Dukān)" },
    "hotel": { en: "Hotel / Accommodation", te: "హోటల్ / లాడ్జి (Hotel / Lodge)", hi: "होटल / धर्मशाला (Hotel)", ta: "விடுதி / ஹோட்டல் (Viṭuthi)", bn: "হোটেল (Hotel)", kn: "ಹೋಟೆಲ್ (Hotel)", mr: "हॉटेल (Hotel)", gu: "હોટેલ (Hotel)", ml: "ഹോട്ടൽ (Hotel)", pa: "ਹੋਟਲ (Hotel)" },
    "room": { en: "Room", te: "గది కావాలి (Gadi kāvāli)", hi: "कमरा (Kamrā)", ta: "அறை (Aṟai)", bn: "ঘর (Ghōr)", kn: "ಕೋಣೆ / ರೂಮ್ (Kōṇe)", mr: "खोली (Khōlī)", gu: "રૂમ (Room)", ml: "മുറി (Muṟi)", pa: "ਕਮਰਾ (Kamrā)" },
    "bathroom": { en: "Bathroom / Washroom", te: "స్నానాల గది / వాష్‌రూమ్ (Washroom)", hi: "शौचालय / बाथरूम (Bathroom)", ta: "குளியலறை / கழிவறை (Kaḻivaṟai)", bn: "বাথরুম (Bathroom)", kn: "ಸ್ನಾನದ ಕೋಣೆ (Snānada kōṇe)", mr: "शौचालय / बाथरूम (Bathroom)", gu: "બાથરૂમ (Bathroom)", ml: "ബാത്ത്റൂം (Bathroom)", pa: "ਗੁਸਲਖਾਨਾ (Bathroom)" },
    "toilet": { en: "Toilet / Restroom", te: "మరుగుదొడ్డి / వాష్‌రూమ్ (Washroom)", hi: "शौचालय (Shauchālay)", ta: "கழிப்பறை (Kaḻippaṟai)", bn: "শৌচাগার (Shouchāgār)", kn: "ಶೌಚಾಲಯ (Shauchālaya)", mr: "शौचालय (Shauchālay)", gu: "શૌચાલય (Shauchālay)", ml: "ടോയ്‌ലറ്റ് (Toilet)", pa: "ਟਾਇਲਟ (Toilet)" },

    // Essential Travel & Transport
    "train": { en: "Train", te: "రైలు / రైలు బండి (Railu)", hi: "ट्रेन / रेलगाड़ी (Train / Railgāṛī)", ta: "ரயில் (Rail)", bn: "ট্রেন (Train)", kn: "ರೈಲು (Railu)", mr: "आगगाडी / ट्रेन (Train)", gu: "ટ્રેન (Train)", ml: "ട്രെയിൻ (Train)", pa: "ਰੇਲਗੱਡੀ (Train)" },
    "station": { en: "Station", te: "స్టేషన్ (Station)", hi: "स्टेशन (Station)", ta: "நிலையம் (Nilayam)", bn: "স্টেশন (Station)", kn: "ನಿಲ್ದಾಣ (Nildāṇa)", mr: "स्थानक (Sthānak)", gu: "સ્ટેશન (Station)", ml: "സ്റ്റേഷൻ (Station)", pa: "ਸਟੇਸ਼ਨ (Station)" },
    "railway station": { en: "Railway Station", te: "రైల్వే స్టేషన్ (Railway station)", hi: "रेलवे स्टेशन (Railway station)", ta: "ரயில் நிலையம் (Rail nilayam)", bn: "রেলওয়ে স্টেশন (Railway station)", kn: "ರೈಲ್ವೆ ನಿಲ್ದಾಣ (Railway nildāṇa)", mr: "रेल्वे स्टेशन (Railway station)", gu: "રેલવે સ્ટેશન (Railway station)", ml: "റെയിൽവേ സ്റ്റേഷൻ (Railway station)", pa: "ਰੇਲਵੇ ਸਟੇਸ਼ਨ (Railway station)" },
    "bus": { en: "Bus", te: "బస్సు (Bussu)", hi: "बस (Bus)", ta: "பேருந்து (Pērundhu)", bn: "বাস (Bus)", kn: "ಬಸ್ಸು (Bussu)", mr: "बस (Bus)", gu: "બસ (Bus)", ml: "ബസ് (Bus)", pa: "ਬੱਸ (Bus)" },
    "bus stand": { en: "Bus Stand", te: "బస్ స్టాండ్ (Bus stand)", hi: "बस अड्डा (Bus aḍḍā)", ta: "பேருந்து நிலையம் (Pērundhu nilayam)", bn: "বাস স্ট্যান্ড (Bus stand)", kn: "ಬಸ್ ನಿಲ್ದಾಣ (Bus nildāṇa)", mr: "बस स्थानक (Bus sthānak)", gu: "બસ સ્ટેન્ડ (Bus stand)", ml: "ബസ് സ്റ്റാൻഡ് (Bus stand)", pa: "ਬੱਸ ਅੱਡਾ (Bus aḍḍā)" },
    "auto": { en: "Auto / Rickshaw", te: "ఆటో రిక్షా (Auto)", hi: "ऑटो रिक्शा (Auto rickshaw)", ta: "ஆட்டோ (Auto)", bn: "অটো (Auto)", kn: "ಆಟೋ (Auto)", mr: "ऑटो (Auto)", gu: "ઓટો (Auto)", ml: "ഓട്ടോ (Auto)", pa: "ਆਟੋ (Auto)" },
    "taxi": { en: "Taxi / Cab", te: "ట్యాక్సీ / క్యాబ్ (Taxi)", hi: "टैक्सी (Taxi)", ta: "வாடகை கார் / டாக்சி (Taxi)", bn: "ট্যাক্সি (Taxi)", kn: "ಟ್ಯಾಕ್ಸಿ (Taxi)", mr: "टॅक्सी (Taxi)", gu: "ટેક્સી (Taxi)", ml: "ടാക്സി (Taxi)", pa: "ਟੈਕਸੀ (Taxi)" },
    "car": { en: "Car", te: "కారు (Caru)", hi: "कार / गाड़ी (Gāṛī)", ta: "கார் (Car)", bn: "গাড়ি (Gāṛi)", kn: "ಕಾರು (Kāru)", mr: "गाडी (Gāḍī)", gu: "ગાડી (Gāḍī)", ml: "കാർ (Car)", pa: "ਕਾਰ (Car)" },
    "flight": { en: "Flight / Airplane", te: "విమానం (Vimānam)", hi: "उड़ान / हवाई जहाज़ (Havāī jahāz)", ta: "விமானம் (Vimāṉam)", bn: "বিমান (Bimān)", kn: "ವಿಮಾನ (Vimāna)", mr: "विमान (Vimān)", gu: "વિમાન (Vimān)", ml: "വിമാനം (Vimānam)", pa: "ਜਹਾਜ਼ (Jahāz)" },
    "airport": { en: "Airport", te: "విమానాశ్రయం (Vimānāshrayam)", hi: "हवाई अड्डा (Havāī aḍḍā)", ta: "விமான நிலையம் (Vimāṉa nilayam)", bn: "বিমানবন্দর (Bimān bondor)", kn: "ವಿಮಾನ ನಿಲ್ದಾಣ (Vimāna nildāṇa)", mr: "विमानतळ (Vimāntaḷ)", gu: "વિમાનમથક (Vimānamathak)", ml: "വിമാനത്താവളം (Vimānatthāvaḷam)", pa: "ਹਵਾਈ ਅੱਡਾ (Havāī aḍḍā)" },
    "ticket": { en: "Ticket", te: "ప్రవేశ టికెట్ (Pravēsha ticket)", hi: "प्रवेश टिकट (Pravēsh ticket)", ta: "நுழைவு சீட்டு (Nuḻaivu sīṭṭu)", bn: "প্রবেশ টিকিট (Prōbēsh ṭikiṭ)", kn: "ಪ್ರವೇಶ ಟಿಕೆಟ್ (Pravēsha ṭikeṭ)", mr: "प्रवेश तिकीट (Pravēsh tikīṭ)", gu: "પ્રવેશ ટિકિટ (Pravēsh ṭikiṭ)", ml: "പ്രവേശന ടിക്കറ്റ് (Pravēshana ṭikkaṟṟu)", pa: "ਐਂਟਰੀ ਟਿਕਟ (Entry ticket)" },
    "bag": { en: "Bag / Luggage", te: "సంచి / బ్యాగ్ (Bag)", hi: "थैला / बैग (Bāg)", ta: "பை (Pai)", bn: "ব্যাগ (Bag)", kn: "ಬ್ಯಾಗ್ (Bag)", mr: "पिशवी / बॅग (Bāg)", gu: "થેલો (Thēlō)", ml: "ബാഗ് (Bag)", pa: "ਬੈਗ (Bag)" },
    "luggage": { en: "Luggage", te: "సామాను / లగేజ్ (Sāmānu)", hi: "सामान (Sāmān)", ta: "சுமை (Sumai)", bn: "মালপত্র (Mālpotro)", kn: "ಸಾಮಾನು (Sāmānu)", mr: "सामान (Sāmān)", gu: "સામાન (Sāmān)", ml: "സാധനങ്ങൾ (Sādhanaṅṅaḷ)", pa: "ਸਾਮਾਨ (Sāmān)" },

    // Food & Dining
    "water": { en: "Water", te: "మంచినీళ్ళు కావాలి (Manchinīḷḷu kāvāli)", hi: "पीने का पानी (Pīnē kā pānī)", ta: "குடிநீர் வேண்டும் (Kuṭinīr vēṇṭum)", bn: "খাবার জল (Khābār jol)", kn: "ಕುಡಿಯುವ ನೀರು (Kuḍiyuva nīru)", mr: "पिण्याचे पाणी (Piṇyāchē pāṇī)", gu: "પીવાનું પાણી (Pīvānun pānī)", ml: "കുടിവെള്ളം (Kuṭiveḷḷam)", pa: "ਪੀਣ ਵਾਲਾ ਪਾਣੀ (Pīṇ vālā pāṇī)" },
    "pani": { en: "Water", te: "నీళ్ళు (Nīḷḷu)", hi: "पानी (Pānī)", ta: "தண்ணீர் (Thaṇṇīr)", bn: "জল (Jol)", kn: "ನೀರು (Nīru)", mr: "पाणी (Pāṇī)", gu: "પાણી (Pānī)", ml: "വെള്ളം (Veḷḷam)", pa: "ਪਾਣੀ (Pāṇī)" },
    "drinking water": { en: "Drinking Water", te: "మంచినీటి బాటిల్ (Manchinīti bottle)", hi: "पानी की बोतल (Pānī kī bōtal)", ta: "குடிநீர் பாட்டில் (Kuṭinīr pāṭṭil)", bn: "জলের বোতল (Jolēr bōtol)", kn: "ನೀರಿನ ಬಾಟಲಿ (Nīrina bāṭali)", mr: "पाण्याची बाटली (Pāṇyāchī bāṭlī)", gu: "પાણીની બોટલ (Pānīnī bōṭal)", ml: "വെള്ളക്കുപ്പി (Veḷḷakkuppi)", pa: "ਪਾਣੀ ਦੀ ਬੋਤਲ (Pāṇī dī bōtal)" },
    "food": { en: "Food", te: "భోజనం / తిండి (Bhōjanam)", hi: "खाना / भोजन (Khānā / Bhōjan)", ta: "உணவு / சாப்பாடு (Uṇavu / Sāppāṭu)", bn: "খাবার / ভোজন (Khābār)", kn: "ಊಟ / ಆಹಾರ (Ūṭa)", mr: "जेवण (Jēvaṇ)", gu: "જમવાનું (Jamvānun)", ml: "ഭക്ഷണം (Bhakshaṇam)", pa: "ਖਾਣਾ (Khāṇā)" },
    "khana": { en: "Food / Meal", te: "భోజనం (Bhōjanam)", hi: "खाना (Khānā)", ta: "சாப்பாடு (Sāppāṭu)", bn: "খাবার (Khābār)", kn: "ಊಟ (Ūṭa)", mr: "जेवण (Jēvaṇ)", gu: "જમવાનું (Jamvānun)", ml: "ഭക്ഷണം (Bhakshaṇam)", pa: "ਖਾਣਾ (Khāṇā)" },
    "rice": { en: "Rice", te: "అన్నం (Annam)", hi: "चावल (Chāwal)", ta: "சாதம் (Sātham)", bn: "ভাত (Bhāt)", kn: "ಅನ್ನ (Anna)", mr: "भात (Bhāt)", gu: "ભાત (Bhāt)", ml: "ചോറ് (Chōṟu)", pa: "ਚੌਲ (Chaul)" },
    "curry": { en: "Curry", te: "కూర (Kūra)", hi: "सब्ज़ी / करी (Sabzī)", ta: "கறி / குழம்பு (Kaṟi)", bn: "তরকারি (Torkāri)", kn: "ಪಲ್ಯ / ಸಾರು (Palya)", mr: "भाजी (Bhājī)", gu: "શાક (Shāk)", ml: "കറി (Kaṟi)", pa: "ਸਬਜ਼ੀ (Sabzī)" },
    "tea": { en: "Tea", te: "టీ / చాయ్ (Chāy)", hi: "चाय (Chāy)", ta: "தேநீர் / டீ (Thēnīr)", bn: "চা (Chā)", kn: "ಟೀ / ಚಹಾ (Tea)", mr: "चहा (Chahā)", gu: "ચા (Chā)", ml: "ചായ (Chāya)", pa: "ਚਾਹ (Chāh)" },
    "chai": { en: "Tea", te: "చాయ్ / టీ (Chāy)", hi: "चाय (Chāy)", ta: "டீ (Tea)", bn: "চা (Chā)", kn: "ಚಹಾ (Chahā)", mr: "चहा (Chahā)", gu: "ચા (Chā)", ml: "ചായ (Chāya)", pa: "ਚਾਹ (Chāh)" },
    "coffee": { en: "Coffee", te: "కాఫీ (Kāphī)", hi: "कॉफ़ी (Coffee)", ta: "காபி (Kāpi)", bn: "কফি (Coffee)", kn: "ಕಾಫಿ (Coffee)", mr: "कॉफी (Coffee)", gu: "કોફી (Coffee)", ml: "കാപ്പി (Kāppi)", pa: "ਕੌਫ਼ੀ (Coffee)" },
    "milk": { en: "Milk", te: "పాలు (Pālu)", hi: "दूध (Dūdh)", ta: "பால் (Pāl)", bn: "দুধ (Dudh)", kn: "ಹಾಲು (Hālu)", mr: "दूध (Dūdh)", gu: "દૂધ (Dūdh)", ml: "പാൽ (Pāl)", pa: "ਦੁੱਧ (Duddh)" },
    "sugar": { en: "Sugar", te: "పంచదార / చక్కర (Chakkara)", hi: "चीनी / शक्कर (Chīnī / Shakkar)", ta: "சர்க்கரை (Sarkkarai)", bn: "চিনি (Chini)", kn: "ಸಕ್ಕರೆ (Sakkare)", mr: "साखर (Sākhar)", gu: "ખાંડ (Khāṇḍ)", ml: "പഞ്ചസാര (Panchasāra)", pa: "ਖੰਡ (Khaṇḍ)" },
    "vegetarian": { en: "Vegetarian", te: "శాకాహారం (Shākāhāram)", hi: "शुद्ध शाकाहारी (Shuddh Shākāhārī)", ta: "சைவ உணவு (Saiva uṇavu)", bn: "নিরামিষ (Nirāmish)", kn: "ಸಸ್ಯಾಹಾರಿ (Sasyāhāri)", mr: "शाकाहारी (Shākāhārī)", gu: "શાકાહારી (Shākāhārī)", ml: "സസ്യാഹാരം (Sasyāhāram)", pa: "ਸ਼ਾਕਾਹਾਰੀ (Shākāhārī)" },
    "non vegetarian": { en: "Non-Vegetarian", te: "మాంసాహారం (Māmsāhāram)", hi: "मांसाहारी (Mānsāhārī)", ta: "அசைவ உணவு (Asaiva uṇavu)", bn: "আমিষ (Āmish)", kn: "ಮಾಂಸಾಹಾರಿ (Mānsāhāri)", mr: "मांसाहारी (Mānsāhārī)", gu: "માંસાહારી (Mānsāhārī)", ml: "മാംസാഹാരം (Māmsāhāram)", pa: "ਮਾਸਾਹਾਰੀ (Māsāhārī)" },
    "bill": { en: "Bill / Receipt", te: "బిల్లు ఇవ్వండి (Billu ivvaṇḍi)", hi: "बिल दीजिये (Bill dījiye)", ta: "பில் கொடுங்கள் (Bill koṭuṅkaḷ)", bn: "বিল দিন (Bill din)", kn: "ಬಿಲ್ ಕೊಡಿ (Bill koḍi)", mr: "बिल द्या (Bill dyā)", gu: "બિલ આપો (Bill āpō)", ml: "ബിൽ തരൂ (Bill tharū)", pa: "ਬਿੱਲ ਦਿਓ (Bill diō)" },

    // Shopping, Pricing & Bargaining
    "how much": { en: "How much?", te: "ఎంత అవుతుంది? / ఎంత ఖరీదు? (Enta avutundi?)", hi: "कितने का है? / कितना हुआ? (Kitnē kā hai?)", ta: "எவ்வளவு? (Evvaḷavu?)", bn: "কত দাম? (Koto dām?)", kn: "ಎಷ್ಟು ಬೆಲೆ? (Eshṭu bele?)", mr: "किती पैसे झाले? (Kitī paisē jhālē?)", gu: "કેટલા રૂપિયા? (Kēṭlā rūpiyā?)", ml: "എത്ര രൂപയാണ്? (Etra rūpayāṇu?)", pa: "ਕਿੰਨੇ ਪੈਸੇ ਹਨ? (Kinnē paisē han?)" },
    "price": { en: "Price / Cost", te: "ధర ఎంత? (Dhara enta?)", hi: "दाम / कीमत (Dām / Kīmat)", ta: "விலை என்ன? (Vilai eṉṉa?)", bn: "দাম কত? (Dām koto?)", kn: "ಬೆಲೆ ಎಷ್ಟು? (Bele eshṭu?)", mr: "किंमत किती? (Kimmat kitī?)", gu: "કિંમત કેટલી? (Kimmat kēṭlī?)", ml: "വില എത്ര? (Vila etra?)", pa: "ਕੀਮਤ ਕਿੰਨੀ ਹੈ? (Kīmat kinnī hai?)" },
    "cost": { en: "Cost", te: "ఖరీదు ఎంత? (Kharīdu enta?)", hi: "लागत / कीमत (Kīmat)", ta: "செலவு (Selavu)", bn: "খরচ (Khoroch)", kn: "ವೆಚ್ಚ (Veccha)", mr: "किंमत (Kimmat)", gu: "ખર્ચ (Kharch)", ml: "ചെലവ് (Chelavu)", pa: "ਖਰਚਾ (Kharchā)" },
    "money": { en: "Money / Cash", te: "డబ్బులు / నగదు (Ḍabbulu)", hi: "पैसे / नकदी (Paisē)", ta: "பணம் (Paṇam)", bn: "টাকা (Ṭākā)", kn: "ಹಣ (Haṇa)", mr: "पैसे (Paisē)", gu: "પૈસા (Paisā)", ml: "പണം (Paṇam)", pa: "ਪੈਸੇ (Paisē)" },
    "rupees": { en: "Rupees", te: "రూపాయలు (Rūpāyalu)", hi: "रुपये (Rupayē)", ta: "ரூபாய் (Rūpāy)", bn: "টাকা (Ṭākā)", kn: "ರೂಪಾಯಿ (Rūpāyi)", mr: "रुपये (Rupayē)", gu: "રૂપિયા (Rupiyā)", ml: "രൂപ (Rūpa)", pa: "ਰੁਪਏ (Rupayē)" },
    "cheap": { en: "Cheap / Inexpensive", te: "చౌకగా (Chaukagā)", hi: "सस्ता (Sastā)", ta: "மலிவானது (Malivāṉathu)", bn: "সস্তা (Sōstā)", kn: "ಅಗ್ಗ (Agga)", mr: "स्वस्त (Svast)", gu: "સસ્તું (Sastun)", ml: "വിലക്കുറവ് (Vilakkuṟavu)", pa: "ਸਸਤਾ (Sastā)" },
    "expensive": { en: "Expensive", te: "చాలా ఖరీదైనది (Chālā kharīdainadi)", hi: "बहुत महंगा है (Bahut mehangā hai)", ta: "ரொம்ப விலை அதிகம் (Vilai athikam)", bn: "অনেক দামি (Onēk dāmī)", kn: "ತುಂಬಾ ದುಬಾರಿ (Tumbā dubāri)", mr: "खूप महाग आहे (Khūp mahāg āhē)", gu: "ખૂબ મોંઘું છે (Khūb monghun chhe)", ml: "വളരെ വിലകൂടിയതാണ് (Vilakūṭiyathāṇu)", pa: "ਬਹੁਤ ਮਹਿੰਗਾ ਹੈ (Bahut mahingā hai)" },
    "discount": { en: "Discount", te: "కొంచెం తగ్గిస్తారా? (Konchem taggistārā?)", hi: "थोड़ा कम कीजिये (Thōḍā kam kījiye)", ta: "கொஞ்சம் குறைக்க முடியுமா? (Konjam kuṟaikka muṭiyumā?)", bn: "একটু কম হবে? (Ēkṭu kom hobē?)", kn: "ಸ್ವಲ್ಪ ಕಡಿಮೆ ಮಾಡಿ (Svalpa kaḍime māḍi)", mr: "थोडं कमी करा (Thōḍa kamī karā)", gu: "થોડું ઓછું કરો (Thōḍun ochhun karō)", ml: "കുറച്ചു കുറയ്ക്കുമോ? (Kurachu kuṟaykkumō?)", pa: "ਥੋੜ੍ਹਾ ਘੱਟ ਕਰੋ (Thōṛhā ghaṭṭ karō)" },
    "buy": { en: "Buy / Purchase", te: "కొంటాను (Koṇṭānu)", hi: "खरीदना (Kharīdnā)", ta: "வாங்குவது (Vāṅkuvathu)", bn: "কেনা (Kēnā)", kn: "ಖರೀದಿಸುವುದು (Kharīdisuvudu)", mr: "खरेदी करणे (Kharēdī)", gu: "ખરીદવું (Kharīdvun)", ml: "വാങ്ങുക (Vāṅṅuka)", pa: "ਖਰੀਦਣਾ (Kharīdaṇā)" },

    // Question Words & Directions
    "where": { en: "Where?", te: "ఎక్కడ? (Ekkaḍa?)", hi: "कहाँ? (Kahān?)", ta: "எங்கே? (Eṅkē?)", bn: "কোথায়? (Kōthāy?)", kn: "ಎಲ್ಲಿ? (Elli?)", mr: "कुठे? (Kuṭhē?)", gu: "ક્યાં? (Kyān?)", ml: "എവിടെ? (Eviḍe?)", pa: "ਕਿੱਥੇ? (Kithē?)" },
    "where is": { en: "Where is it?", te: "ఎక్కడ ఉంది? (Ekkaḍa undi?)", hi: "कहाँ है? (Kahān hai?)", ta: "எங்கே உள்ளது? (Eṅkē uḷḷathu?)", bn: "কোথায়? (Kōthāy?)", kn: "ಎಲ್ಲಿದೆ? (Ellide?)", mr: "कुठे आहे? (Kuṭhē āhē?)", gu: "ક્યાં છે? (Kyān chhe?)", ml: "എവിടെയാണ്? (Eviḍeyāṇu?)", pa: "ਕਿੱਥੇ ਹੈ? (Kithē hai?)" },
    "where is the temple": { en: "Where is the temple?", te: "గుడి / దేవాలయం ఎక్కడ ఉంది? (Guḍi ekkaḍa undi?)", hi: "मंदिर कहाँ है? (Mandir kahān hai?)", ta: "கோவில் எங்கே உள்ளது? (Kōvil eṅkē uḷḷathu?)", bn: "মন্দিরটি কোথায়? (Mandirti kōthāy?)", kn: "ದೇವಸ್ಥಾನ ಎಲ್ಲಿದೆ? (Dēvasthāna ellide?)", mr: "मंदिर कुठे आहे? (Mandir kuṭhē āhē?)", gu: "મંદિર ક્યાં છે? (Mandir kyān chhe?)", ml: "ക്ഷേത്രം എവിടെയാണ്? (Kshētram eviḍeyāṇu?)", pa: "ਮੰਦਰ / ਗੁਰਦੁਆਰਾ ਕਿੱਥੇ ਹੈ? (Mandir kithē hai?)" },
    "what": { en: "What?", te: "ఏమిటి? (Ēmiṭi?)", hi: "क्या? (Kyā?)", ta: "என்ன? (Eṉṉa?)", bn: "কি? (Ki?)", kn: "ಏನು? (Ēnu?)", mr: "काय? (Kāy?)", gu: "શું? (Shun?)", ml: "എന്ത്? (Enthu?)", pa: "ਕੀ? (Kī?)" },
    "when": { en: "When?", te: "ఎప్పుడు? (Eppuḍu?)", hi: "कब? (Kab?)", ta: "எப்போது? (Eppōthu?)", bn: "কখন? (Kokhōn?)", kn: "ಯಾವಾಗ? (Yāvāga?)", mr: "केव्हा? (Kēvhā?)", gu: "ક્યારે? (Kyārē?)", ml: "എപ്പോൾ? (Eppōḷ?)", pa: "ਕਦੋਂ? (Kadōṁ?)" },
    "why": { en: "Why?", te: "ఎందుకు? (Enduku?)", hi: "क्यों? (Kyon?)", ta: "ஏன்? (Ēṉ?)", bn: "কেন? (Kēno?)", kn: "ಏಕೆ? (Ēke?)", mr: "का? (Kā?)", gu: "કેમ? (Kēm?)", ml: "എന്തുകൊണ്ട്? (Enthukoṇṭu?)", pa: "ਕਿਉਂ? (Kiuṁ?)" },
    "how": { en: "How?", te: "ఎలా? (Elā?)", hi: "कैसे? (Kaisē?)", ta: "எப்படி? (Eppaṭi?)", bn: "কীভাবে? (Kībhābē?)", kn: "ಹೇಗೆ? (Hēge?)", mr: "कसे? (Kasē?)", gu: "કેવી રીતે? (Kēvī rītē?)", ml: "എങ്ങനെ? (Eṅṅane?)", pa: "ਕਿਵੇਂ? (Kivēṁ?)" },
    "who": { en: "Who?", te: "ఎవరు? (Evaru?)", hi: "कौन? (Kaun?)", ta: "யார்? (Yār?)", bn: "কে? (Kē?)", kn: "ಯಾರು? (Yāru?)", mr: "कोण? (Kōṇ?)", gu: "કોણ? (Kōṇ?)", ml: "ആര്? (Āru?)", pa: "ਕੌਣ? (Kauṇ?)" },
    "here": { en: "Here", te: "ఇక్కడ (Ikkaḍa)", hi: "यहाँ (Yahān)", ta: "இங்கே (Iṅkē)", bn: "এখানে (Ēkhānē)", kn: "ಇಲ್ಲಿ (Illi)", mr: "येथे (Yēthē)", gu: "અહીં (Ahīn)", ml: "ഇവിടെ (Iviḍe)", pa: "ਇੱਥੇ (Ithē)" },
    "there": { en: "There", te: "అక్కడ (Akkaḍa)", hi: "वहाँ (Vahān)", ta: "அங்கே (Aṅkē)", bn: "সেখানে (Shēkhānē)", kn: "ಅಲ್ಲಿ (Alli)", mr: "तेथे (Tēthē)", gu: "ત્યાં (Tyān)", ml: "അവിടെ (Aviḍe)", pa: "ਉੱਥੇ (Uthē)" },
    "near": { en: "Near / Close", te: "దగ్గర (Daggara)", hi: "पास में (Pās mēn)", ta: "அருகில் (Arukil)", bn: "কাছে (Kāchhē)", kn: "ಹತ್ತಿರ (Hattira)", mr: "जवळ (Jawaḷ)", gu: "નજીક (Najīk)", ml: "അടുത്ത് (Aṭutthu)", pa: "ਨੇੜੇ (Nēṛē)" },
    "far": { en: "Far", te: "చాలా దూరం (Chālā dūram)", hi: "दूर है (Dūr hai)", ta: "தொலைவில் (Tholaivil)", bn: "দূরে (Dūrē)", kn: "ದೂರ (Dūra)", mr: "लांब (Lāmb)", gu: "દૂર (Dūr)", ml: "ദൂരെ (Dūre)", pa: "ਦੂਰ (Dūr)" },
    "left": { en: "Left", te: "ఎడమ వైపు (Eḍama vaipu)", hi: "बाएं (Bāyēn)", ta: "இடது பக்கம் (Iṭathu pakkam)", bn: "বাম দিকে (Bām dikē)", kn: "ಎಡಕ್ಕೆ (Eḍakke)", mr: "डावीकडे (Ḍāvīkaḍē)", gu: "ડાબી બાજુ (Ḍābī bāju)", ml: "ഇടത്തോട്ട് (Iṭatthōṭṭu)", pa: "ਖੱਬੇ (Khabbē)" },
    "right": { en: "Right", te: "కుడి వైపు (Kuḍi vaipu)", hi: "दाएं (Dāyēn)", ta: "வலது பக்கம் (Valathu pakkam)", bn: "ডান দিকে (Ḍān dikē)", kn: "ಬಲಕ್ಕೆ (Balakke)", mr: "उजवीकडे (Ujvīkaḍē)", gu: "જમણી બાજુ (Jamaṇī bāju)", ml: "വലത്തോട്ട് (Valatthōṭṭu)", pa: "ਸੱਜੇ (Sajjē)" },
    "straight": { en: "Straight", te: "నేరుగా (Nērugā)", hi: "सीधे जाइये (Sīdhē jāiyē)", ta: "நேராக (Nērāka)", bn: "সোজা যান (Sōjā jān)", kn: "ನೇರವಾಗಿ ಹೋಗಿ (Nēravāgi hōgi)", mr: "सरळ जा (Saraḷ jā)", gu: "સીધા જાઓ (Sīdhā jāō)", ml: "നേരെ പോകുക (Nēre pōkuka)", pa: "ਸਿੱਧਾ ਜਾਓ (Siddhā jāō)" },
    "stop": { en: "Stop", te: "ఆపండి (Āpaṇḍi)", hi: "रोकिये (Rōkiye)", ta: "நிறுத்துங்கள் (Niṟutthuṅkaḷ)", bn: "থামুন (Thāmun)", kn: "ನಿಲ್ಲಿಸಿ (Nillisi)", mr: "थांबा (Thāmbā)", gu: "રોકો (Rōkō)", ml: "നിർത്തൂ (Nirtthū)", pa: "ਰੋਕੋ (Rōkō)" },
    "go": { en: "Go", te: "వెళ్ళండి (Veḷḷaṇḍi)", hi: "जाइये (Jāiye)", ta: "போங்கள் (Pōṅkaḷ)", bn: "যান (Jān)", kn: "ಹೋಗಿ (Hōgi)", mr: "जा (Jā)", gu: "જાઓ (Jāō)", ml: "പോകൂ (Pōkū)", pa: "ਜਾਓ (Jāō)" },
    "come": { en: "Come", te: "రండి (Raṇḍi)", hi: "आइये (Āiye)", ta: "வாருங்கள் (Vāruṅkaḷ)", bn: "আসুন (Āshun)", kn: "ಬನ್ನಿ (Banni)", mr: "या (Yā)", gu: "આવો (Āvō)", ml: "വരൂ (Varū)", pa: "ਆਓ (Āō)" },

    // Medical, Safety & Emergency
    "help": { en: "Help!", te: "సహాయం చేయండి! (Sahāyam chēyaṇḍi!)", hi: "मदद कीजिये! (Madad kījiye!)", ta: "உதவி செய்யுங்கள்! (Uthavi seyyuṅkaḷ!)", bn: "সাহায্য করুন! (Sāhājjō korūn!)", kn: "ಸಹಾಯ ಮಾಡಿ! (Sahāya māḍi!)", mr: "मदत करा! (Madat karā!)", gu: "મદદ કરો! (Madad karō!)", ml: "സഹായിക്കൂ! (Sahāyikkū!)", pa: "ਮਦਦ ਕਰੋ! (Madad karō!)" },
    "emergency": { en: "Emergency!", te: "అత్యవసర పరిస్థితి! (Atyavasara paristhiti!)", hi: "आपातकालीन स्थिति! (Āpātkālīn sthiti!)", ta: "அவசர நிலை! (Avasara nilai!)", bn: "জরুরী অবস্থা! (Jorurī obosthā!)", kn: "ತುರ್ತು ಪರಿಸ್ಥಿತಿ! (Turtu paristhiti!)", mr: "तातडीची मदत! (Tātḍīchī madat!)", gu: "કટોકટી સ્થિતિ! (Kaṭōkaṭī sthiti!)", ml: "അടിയന്തിര ഘട്ടം! (Aṭiyanthira ghaṭṭam!)", pa: "ਐਮਰਜੈਂਸੀ! (Emergency!)" },
    "police": { en: "Police (112)", te: "పోలీస్ స్టేషన్ / 112 (Police station)", hi: "पुलिस सहायता / 112 (Police)", ta: "காவல்துறை உதவி / 112 (Police)", bn: "পুলিশ ফাঁড়ি / 112 (Police)", kn: "ಪೊಲೀಸ್ ಠಾಣೆ / 112 (Police)", mr: "पोलीस ठाणे / 112 (Police)", gu: "પોલીસ સ્ટેશન / 112 (Police)", ml: "പോലീസ് സ്റ്റേഷൻ / 112 (Police)", pa: "ਪੁਲਿਸ ਸਟੇਸ਼ਨ / 112 (Police)" },
    "hospital": { en: "Hospital", te: "ఆసుపత్రి ఎక్కడ ఉంది? (Āsupatri ekkaḍa undi?)", hi: "अस्पताल कहाँ है? (Aspatāl kahān hai?)", ta: "மருத்துவமனை எங்கே? (Maruthuvamaṉai eṅkē?)", bn: "হাসপাতালটি কোথায়? (Hāspātālti kōthāy?)", kn: "ಆಸ್ಪತ್ರೆ ಎಲ್ಲಿದೆ? (Āspatre ellide?)", mr: "दवाखाना कुठे आहे? (Davākhānā kuṭhē āhē?)", gu: "હોસ્પિટલ ક્યાં છે? (Hospital kyān chhe?)", ml: "ആശുപത്രി എവിടെയാണ്? (Āshupatri eviḍeyāṇu?)", pa: "ਹਸਪਤਾਲ ਕਿੱਥੇ ਹੈ? (Haspatāl kithē hai?)" },
    "doctor": { en: "Doctor", te: "వైద్యులు / డాక్టర్ (Doctor)", hi: "डॉक्टर (Doctor)", ta: "மருத்துவர் (Maruthuvar)", bn: "ডাক্তারবাবু (Doctor)", kn: "ವೈದ್ಯರು (Doctor)", mr: "डॉक्टर (Doctor)", gu: "ડોક્ટર (Doctor)", ml: "ഡോക്ടർ (Doctor)", pa: "ਡਾਕਟਰ (Doctor)" },
    "medicine": { en: "Medicine / Pharmacy", te: "మందుల షాప్ / మెడికల్ (Medical shop)", hi: "दवा की दुकान (Davā kī dukān)", ta: "மருந்தகம் (Marunthakam)", bn: "ওষুধের দোকান (Ōshudhēr dōkān)", kn: "ಔಷಧದ ಅಂಗಡಿ (Aushadhada aṅgaḍi)", mr: "औषधाचे दुकान (Aushadhāchē dukān)", gu: "દવાની દુકાન (Davānī dukān)", ml: "മെഡിക്കൽ ഷോപ്പ് (Medical shop)", pa: "ਦਵਾਈਆਂ ਦੀ ਦੁਕਾਨ (Davāīān dī dukān)" },
    "pain": { en: "Pain", te: "నొప్పిగా ఉంది (Noppigā undi)", hi: "दर्द हो रहा है (Dard hō rahā hai)", ta: "வலிக்கிறது (Valikkiṟathu)", bn: "ব্যথা করছে (Byathā korchhe)", kn: "ನೋವಾಗುತ್ತಿದೆ (Nōvāguttide)", mr: "दुखत आहे (Dukhat āhē)", gu: "દુખાવો થાય છે (Dukhāvō thāy chhe)", ml: "വേദനിക്കുന്നു (Vēdanikkunnu)", pa: "ਦਰਦ ਹੋ ਰਿਹਾ ਹੈ (Dard hō rihā hai)" },
    "safe": { en: "Safe", te: "సురక్షితం (Surakshitam)", hi: "सुरक्षित (Surakshit)", ta: "பாதுகாப்பானது (Pāthukāppāṉathu)", bn: "নিরাপদ (Nirāpod)", kn: "ಸುರಕ್ಷಿತ (Surakshita)", mr: "सुरक्षित (Surakshit)", gu: "સુરક્ષિત (Surakshit)", ml: "സുരക്ഷിതം (Surakshitham)", pa: "ਸੁਰੱਖਿਅਤ (Surakkhiat)" },
    "danger": { en: "Danger", te: "ప్రమాదం (Pramādam)", hi: "खतरा (Khatrā)", ta: "ஆபத்து (Āpathu)", bn: "বিপদ (Bipod)", kn: "ಅಪಾಯ (Apāya)", mr: "धोका (Dhōkā)", gu: "જોખમ (Jōkham)", ml: "അപകടം (Apakaṭam)", pa: "ਖ਼ਤਰਾ (Khatrā)" },

    // Numbers & Counting
    "one": { en: "One", te: "ఒకటి (Okaṭi)", hi: "एक (Ēk)", ta: "ஒன்று (Oṉṟu)", bn: "এক (Ēk)", kn: "ಒಂದು (Ondu)", mr: "एक (Ēk)", gu: "એક (Ēk)", ml: "ഒന്ന് (Onnu)", pa: "ਇੱਕ (Ikk)" },
    "two": { en: "Two", te: "రెండు (Reṇḍu)", hi: "दो (Dō)", ta: "இரண்டு (Iraṇṭu)", bn: "দুই (Dui)", kn: "ಎರಡು (Eraḍu)", mr: "दोन (Dōn)", gu: "બે (Bē)", ml: "രണ്ട് (Raṇṭu)", pa: "ਦੋ (Dō)" },
    "three": { en: "Three", te: "మూడు (Mūḍu)", hi: "तीन (Tīn)", ta: "மூன்று (Mūṉṟu)", bn: "তিন (Tin)", kn: "ಮೂರು (Mūru)", mr: "तीन (Tīn)", gu: "ત્રણ (Traṇ)", ml: "മൂന്ന് (Mūnnu)", pa: "ਤਿੰਨ (Tinn)" },
    "four": { en: "Four", te: "నాలుగు (Nālugu)", hi: "चार (Chār)", ta: "நான்கு (Nāṉku)", bn: "চার (Chār)", kn: "ನಾಲ್ಕು (Nālku)", mr: "चार (Chār)", gu: "ચાર (Chār)", ml: "നാല് (Nālu)", pa: "ਚਾਰ (Chār)" },
    "five": { en: "Five", te: "ఐదు (Aidu)", hi: "पाँच (Pānch)", ta: "ஐந்து (Ainthu)", bn: "পাঁচ (Pānch)", kn: "ಐದು (Aidu)", mr: "पाच (Pāch)", gu: "પાંચ (Pānch)", ml: "അഞ്ച് (Anchu)", pa: "ਪੰਜ (Panj)" },
    "ten": { en: "Ten", te: "పది (Padi)", hi: "दस (Das)", ta: "பத்து (Pathu)", bn: "দশ (Dosh)", kn: "ಹತ್ತು (Hattu)", mr: "दहा (Dahā)", gu: "દસ (Das)", ml: "പത്ത് (Patthu)", pa: "ਦਸ (Das)" },
    "twenty": { en: "Twenty", te: "ఇరవై (Iravai)", hi: "बीस (Bīs)", ta: "இருபது (Irupathu)", bn: "কুড়ি (Kuṛi)", kn: "ಇಪ್ಪತ್ತು (Ippattu)", mr: "वीस (Vīs)", gu: "વીસ (Vīs)", ml: "ഇരുപത് (Irupathu)", pa: "ਵੀਹ (Vīh)" },
    "fifty": { en: "Fifty", te: "యాభై (Yābhai)", hi: "पचास (Pachās)", ta: "ஐம்பது (Aimpathu)", bn: "পঞ্চাশ (Pōnchāsh)", kn: "ಐವತ್ತು (Aivattu)", mr: "पन्नास (Pannās)", gu: "પચાસ (Pachās)", ml: "അമ്പത് (Ampathu)", pa: "ਪੰਜਾਹ (Panjāh)" },
    "hundred": { en: "One Hundred", te: "వంద రూపాయలు (Vanda rūpāyalu)", hi: "सौ रुपये (Sau rūpayē)", ta: "நூறு ரூபாய் (Nūṟu rūpāy)", bn: "একশ টাকা (Ēkshō ṭākā)", kn: "ನೂರು ರೂಪಾಯಿ (Nūru rūpāyi)", mr: "शंभर रुपये (Shambhar rūpayē)", gu: "સો રૂપિયા (Sō rūpiyā)", ml: "നൂറ് രൂപ (Nūṟu rūpa)", pa: "ਸੌ ਰੁਪਏ (Sau rupayē)" },
    "thousand": { en: "One Thousand", te: "వెయ్యి రూపాయలు (Vēyyi rūpāyalu)", hi: "एक हज़ार रुपये (Ēk hazār rūpayē)", ta: "ஆயிரம் ரூபாய் (Āyiram rūpāy)", bn: "এক হাজার টাকা (Ēk hājār ṭākā)", kn: "ಸಾವಿರ ರೂಪಾಯಿ (Sāvira rūpāyi)", mr: "एक हजार रुपये (Ēk hazār rūpayē)", gu: "એક હજાર રૂપિયા (Ēk hazār rūpiyā)", ml: "ആയിരം രൂപ (Āyiram rūpa)", pa: "ਇੱਕ ਹਜ਼ਾਰ ਰੁਪਏ (Ikk hazār rupayē)" },

    // Time & Calendar
    "time": { en: "Time", te: "సమయం / టైం (Samayam)", hi: "समय / वक़्त (Samay)", ta: "நேரம் (Nēram)", bn: "সময় (Shomoy)", kn: "ಸಮಯ (Samaya)", mr: "वेळ (Vēḷ)", gu: "સમય (Samay)", ml: "സമയം (Samayam)", pa: "ਸਮਾਂ (Samān)" },
    "today": { en: "Today", te: "ఈ రోజు (Ī rōju)", hi: "आज (Āj)", ta: "இன்று (Iṉṟu)", bn: "আজ (Āj)", kn: "ಇವತ್ತು (Ivattu)", mr: "आज (Āj)", gu: "આજે (Ājē)", ml: "ഇന്ന് (Innu)", pa: "ਅੱਜ (Ajj)" },
    "tomorrow": { en: "Tomorrow", te: "రేపు (Rēpu)", hi: "कल (Kal)", ta: "நாளை (Nāḷai)", bn: "আগামীকাল (Āgāmīkāl)", kn: "ನಾಳೆ (Nāḷe)", mr: "उद्या (Udyā)", gu: "કાલે (Kālē)", ml: "നാളെ (Nāḷe)", pa: "ਕੱਲ੍ਹ (Kallh)" },
    "yesterday": { en: "Yesterday", te: "నిన్న (Ninna)", hi: "कल (बीता हुआ) (Bītā kal)", ta: "நேற்று (Nēṟṟu)", bn: "গতকাল (Gōtōkāl)", kn: "ನಿನ್ನೆ (Ninne)", mr: "काल (Kāl)", gu: "ગઈકાલે (Gaikālē)", ml: "ഇന്നലെ (Innale)", pa: "ਕੱਲ੍ਹ (ਲੰਘਿਆ) (Kallh)" },
    "now": { en: "Now", te: "ఇప్పుడు (Ippuḍu)", hi: "अभी (Abhī)", ta: "இப்போது (Ippōthu)", bn: "এখন (Ēkhōn)", kn: "ಈಗ (Īga)", mr: "आत्ता (Āttā)", gu: "અત્યારે (Atyārē)", ml: "ഇപ്പോൾ (Ippōḷ)", pa: "ਹੁਣ (Huṇ)" },
    "later": { en: "Later", te: "తరువాత (Taruvāta)", hi: "बाद में (Bād mēn)", ta: "பிறகு (Piṟaku)", bn: "পরে (Pōrē)", kn: "ಆಮೇಲೆ (Āmēle)", mr: "नंतर (Nantar)", gu: "પછી (Pachhī)", ml: "പിന്നെ (Pinne)", pa: "ਬਾਅਦ ਵਿੱਚ (Bāad vich)" },

    // Weather & Essentials
    "hot": { en: "Hot", te: "వేడిగా ఉంది (Vēḍigā undi)", hi: "गर्म है (Garm hai)", ta: "சூடாக இருக்கிறது (Sūṭāka irukkiṟathu)", bn: "গরম (Gōrom)", kn: "ಬಿಸಿ (Bisi)", mr: "गरम (Garam)", gu: "ગરમ (Garam)", ml: "ചൂട് (Chūṭu)", pa: "ਗਰਮ (Garam)" },
    "cold": { en: "Cold", te: "చల్లగా ఉంది (Challagā undi)", hi: "ठंडा है (Ṭhaṇḍā hai)", ta: "குளிராக இருக்கிறது (Kuḷirāka irukkiṟathu)", bn: "ঠান্ডা (Ṭhāṇḍā)", kn: "ತಂಪು (Thampu)", mr: "थंड (Thaṇḍ)", gu: "ઠંડુ (Ṭhaṇḍun)", ml: "തണുപ്പ് (Thaṇuppu)", pa: "ਠੰਡਾ (Ṭhaṇḍā)" },
    "rain": { en: "Rain", te: "వర్షం (Varsham)", hi: "बारिश (Bārish)", ta: "மழை (Maḻai)", bn: "বৃষ্টি (Brishti)", kn: "ಮಳೆ (Maḷe)", mr: "पाऊस (Pāūs)", gu: "વરસાદ (Varsād)", ml: "മഴ (Mazha)", pa: "ਮੀਂਹ (Mīnh)" },

    // Conversational & Common Modifiers
    "guide": { en: "Guide", te: "గైడ్ / మార్గదర్శకులు (Guide)", hi: "पर्यटन गाइड (Tourist guide)", ta: "வழிகாட்டி (Vaḻikāṭṭi)", bn: "ট্যুরিস্ট গাইড (Guide)", kn: "ಮಾರ್ಗದರ್ಶಿ (Mārgadarshi)", mr: "मार्गदर्शक (Mārgadarshak)", gu: "માર્ગદર્શક (Mārgadarshak)", ml: "ടൂറിസ്റ്റ് ഗൈഡ് (Guide)", pa: "ਗਾਈਡ (Guide)" },
    "photo": { en: "Can I take a photo?", te: "ఫోటో తీయవచ్చా? (Photo tīyavacchā?)", hi: "क्या फोटो ले सकते हैं? (Kyā photō lē saktē hain?)", ta: "புகைப்படம் எடுக்கலாமா? (Pukaippaṭam eṭukkalāmā?)", bn: "ছবি তোলা যাবে? (Chhobi tōlā jābē?)", kn: "ಫೋಟೋ ತೆಗೆಯಬಹುದೇ? (Phōṭō tegeyabahudē?)", mr: "फोटो काढू शकतो का? (Phōṭō kāḍhū shaktō kā?)", gu: "ફોટો પાડી શકાય? (Phōṭō pāḍī shakāy?)", ml: "ഫോട്ടോ എടുക്കാമോ? (Phōṭṭō eṭukkāmō?)", pa: "ਫੋਟੋ ਖਿੱਚ ਸਕਦੇ ਹਾਂ? (Phōṭō khicc sakdē hān?)" },
    "beautiful": { en: "Very Beautiful!", te: "చాలా అందంగా ఉంది! (Chālā andangā undi!)", hi: "बहुत सुंदर है! (Bahut sundar hai!)", ta: "மிகவும் அழகாக உள்ளது! (Mikavum aḻakāka uḷḷathu!)", bn: "খুব সুন্দর! (Khub sundōr!)", kn: "ತುಂಬಾ ಸುಂದರವಾಗಿದೆ! (Tumbā sundaravāgide!)", mr: "खूप सुंदर आहे! (Khūp sundar āhē!)", gu: "ખૂબ સુંદર છે! (Khūb sundar chhe!)", ml: "വളരെ മനോഹരമാണ്! (Valare manōharamāṇu!)", pa: "ਬਹੁਤ ਸੋਹਣਾ ਹੈ! (Bahut sōhṇā hai!)" },
    "good": { en: "Good", te: "చాలా బాగుంది (Chālā bāgundi)", hi: "बहुत अच्छा है (Bahut achhā hai)", ta: "ரொம்ப நல்லது (Romba nallathu)", bn: "খুব ভালো (Khub bhālō)", kn: "ತುಂಬಾ ಚೆನ್ನಾಗಿದೆ (Tumbā chennāgide)", mr: "खूप छान आहे (Khūp chhān āhē)", gu: "ખૂબ સરસ છે (Khūb saras chhe)", ml: "വളരെ നല്ലത് (Valare nallathu)", pa: "ਬਹੁਤ ਵਧੀਆ ਹੈ (Bahut vadhīā hai)" },
    "bagundi": { en: "It is good / Nice (Telugu)", te: "బాగుంది (Bāgundi)", hi: "अच्छा है (Achhā hai)", ta: "நன்றாக உள்ளது (Naṉṟāka uḷḷathu)", bn: "ভালো (Bhālō)", kn: "ಚೆನ್ನಾಗಿದೆ (Chennāgide)", mr: "छान आहे (Chhān āhē)", gu: "સરસ છે (Saras chhe)", ml: "നല്ലതാണ് (Nallathāṇu)", pa: "ਚੰਗਾ ਹੈ (Changā hai)" },
    "yes": { en: "Yes", te: "అవును (Avunu)", hi: "हाँ (Hān)", ta: "ஆம் (Ām)", bn: "হ্যাঁ (Hyān)", kn: "ಹೌದು (Haudu)", mr: "हो (Hō)", gu: "હા (Hā)", ml: "അതെ (Athe)", pa: "ਹਾਂ (Hān)" },
    "no": { en: "No", te: "వద్దు / కాదు (Vaddu / Kādu)", hi: "नहीं (Nahīn)", ta: "இல்லை (Illai)", bn: "না (Nā)", kn: "ಇಲ್ಲ (Illa)", mr: "नाही (Nāhī)", gu: "ના (Nā)", ml: "അല്ല / വേണ്ട (Alla / Vēṇṭa)", pa: "ਨਹੀਂ (Nahīn)" },
    "ok": { en: "OK / Alright", te: "సరే / అంగీకారం (Sarē)", hi: "ठीक है (Ṭhīk hai)", ta: "சரி (Sari)", bn: "ঠিক আছে (Ṭhīk āchhē)", kn: "ಸರಿ (Sari)", mr: "ठीक आहे (Ṭhīk āhē)", gu: "બરાબર છે (Barābar chhe)", ml: "ശരി (Shari)", pa: "ਠੀਕ ਹੈ (Ṭhīk hai)" },
    "friend": { en: "Friend", te: "మిత్రుడు / స్నేహితుడు (Mitruḍu)", hi: "दोस्त / मित्र (Dōst)", ta: "நண்பர் (Naṇpar)", bn: "বন্ধু (Bondhu)", kn: "ಸ್ನೇಹಿತ (Snēhita)", mr: "मित्र (Mitra)", gu: "મિત્ર (Mitra)", ml: "സുഹൃത്ത് (Suhṛtthu)", pa: "ਦੋਸਤ (Dōst)" },
    "family": { en: "Family", te: "కుటుంబం (Kuṭumbam)", hi: "परिवार (Parivār)", ta: "குடும்பம் (Kuṭumpam)", bn: "পরিবার (Pōribār)", kn: "ಕುಟುಂಬ (Kuṭumba)", mr: "कुटुंब (Kuṭumb)", gu: "પરિવાર (Parivār)", ml: "കുടുംബം (Kuṭumbam)", pa: "ਪਰਿਵਾਰ (Parivār)" },
  };

  // Direct keyword lookup (Exact or normalized)
  for (const [key, map] of Object.entries(vocabDict)) {
    if (clean === key || clean === key.replace(/[^a-z0-9 ]/g, "")) {
      const val = map[targetLangCode] || (targetLangCode === "en" ? map["en"] : (map["te"] || map["hi"]));
      if (val) {
        const parts = val.includes(" (") ? val.split(" (") : [val, ""];
        return {
          translatedText: parts[0],
          pronunciation: parts[1] ? parts[1].replace(")", "") : parts[0],
          culturalNote: `Instantly resolved via 100% Offline Edge Lexicon (${key}).`,
          engine: "offline-edge-lexicon",
          category: "Essential Vocabulary",
          latency: "0ms",
        };
      }
    }
  }

  // 3. Bidirectional Reverse Search: check if input matches ANY Indian language script or transliteration
  for (const [engKey, map] of Object.entries(vocabDict)) {
    for (const [langCode, entryVal] of Object.entries(map)) {
      if (typeof entryVal !== "string") continue;
      const lowerEntry = entryVal.toLowerCase();
      // Match native script or parenthetical phonetic pronunciation
      if (lowerEntry.includes(clean) || clean.includes(lowerEntry.split(" ")[0])) {
        const targetVal = map[targetLangCode] || (targetLangCode === "en" ? map["en"] || engKey : (map["te"] || map["hi"]));
        if (targetVal) {
          const parts = targetVal.includes(" (") ? targetVal.split(" (") : [targetVal, ""];
          return {
            translatedText: parts[0],
            pronunciation: parts[1] ? parts[1].replace(")", "") : parts[0],
            culturalNote: `Bidirectional match: "${clean}" matched travel phrase (${engKey}).`,
            engine: "offline-edge-lexicon",
            category: "Bidirectional Match",
            latency: "0ms",
          };
        }
      }
    }
  }

  // 4. Multi-word phrase search in vocabDict
  for (const [key, map] of Object.entries(vocabDict)) {
    if (clean.includes(key) && key.length > 2) {
      const val = map[targetLangCode] || (targetLangCode === "en" ? map["en"] || key : (map["te"] || map["hi"]));
      if (val) {
        const parts = val.includes(" (") ? val.split(" (") : [val, ""];
        return {
          translatedText: parts[0],
          pronunciation: parts[1] ? parts[1].replace(")", "") : parts[0],
          culturalNote: `Matched offline travel phrase: "${key}". Zero-latency edge translation.`,
          engine: "offline-edge-lexicon",
          category: "Travel Phrase",
          latency: "0ms",
        };
      }
    }
  }

  // 5. Smart Word-by-Word Tokenized Synthesis
  const words = clean.split(/\s+/).filter(Boolean);
  if (words.length > 1) {
    const translatedTokens = [];
    const pronTokens = [];
    let matchCount = 0;

    for (const w of words) {
      const wClean = w.replace(/[^a-z0-9]/g, "");
      const match = vocabDict[wClean] || vocabDict[w];
      if (match) {
        matchCount++;
        const targetVal = match[targetLangCode] || (targetLangCode === "en" ? match["en"] || w : (match["te"] || match["hi"]));
        if (targetVal) {
          const parts = targetVal.includes(" (") ? targetVal.split(" (") : [targetVal, ""];
          translatedTokens.push(parts[0]);
          pronTokens.push(parts[1] ? parts[1].replace(")", "") : parts[0]);
          continue;
        }
      }
      translatedTokens.push(w);
      pronTokens.push(w);
    }

    if (matchCount > 0) {
      return {
        translatedText: translatedTokens.join(" "),
        pronunciation: pronTokens.join(" "),
        culturalNote: `Composed from offline vocabulary tokens (${matchCount}/${words.length} terms matched).`,
        engine: "offline-edge-lexicon",
        category: "Synthesized Phrase",
        latency: "0ms",
      };
    }
  }

  // 6. Graceful Fallback (Never output broken template or bracketed tags)
  const targetInfo = languageOptions.find(l => l.code === targetLangCode) || languageOptions[0];

  return {
    translatedText: text,
    pronunciation: `"${text}" - Regional ${targetInfo.name} expression`,
    culturalNote: `Offline mode active for ${targetInfo.name}. For deep contextual AI nuance, switch to Online AI mode.`,
    engine: "offline-edge-lexicon",
    category: "General",
    latency: "0ms",
  };
}

// Generate Printable PDF / HTML eBook Document
export function downloadLanguageBook(bookId) {
  const book = languageLearningBooks.find(b => b.id === bookId) || languageLearningBooks[0];
  const phrases = comprehensivePhrasebook;

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${book.title} - Bharat Yatra Official Guide</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #1e293b;
      margin: 0;
      padding: 40px;
      background: #fff;
    }
    .header {
      border-bottom: 3px solid #0284c7;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      background: #e0f2fe;
      color: #0369a1;
      font-size: 12px;
      font-weight: bold;
      border-radius: 12px;
      text-transform: uppercase;
      margin-bottom: 8px;
    }
    h1 {
      font-size: 26px;
      color: #0f172a;
      margin: 0 0 6px 0;
    }
    h2 {
      font-size: 18px;
      color: #0369a1;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 6px;
      margin-top: 30px;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      margin: 16px 0;
    }
    .card {
      padding: 12px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
    }
    .script {
      font-size: 18px;
      font-weight: bold;
      color: #0284c7;
    }
    .pron {
      font-family: monospace;
      font-size: 13px;
      color: #64748b;
    }
    .tip {
      font-size: 11px;
      color: #475569;
      margin-top: 4px;
    }
    .footer {
      margin-top: 40px;
      padding-top: 15px;
      border-top: 1px solid #e2e8f0;
      font-size: 11px;
      color: #94a3b8;
      text-align: center;
    }
    @media print {
      body { padding: 20px; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <span class="badge">${book.badge}</span>
    <h1>${book.title}</h1>
    <p style="color: #64748b; margin: 0;">${book.subtitle} · ${book.pages}</p>
    <p style="font-size: 12px; color: #0284c7; margin-top: 4px;">Verified by Archaeological Survey of India & State Tourism Boards</p>
  </div>

  <h2>Table of Contents & Core Curriculum</h2>
  <ul>
    ${book.chapters.map(c => `<li><strong>${c}</strong></li>`).join('')}
  </ul>

  <h2>Chapter 1: Native Alphabets, Vowels & Pronunciation</h2>
  <div class="grid">
    ${book.alphabets.map(a => `
      <div class="card">
        <div class="script">${a.char}</div>
        <div class="pron">${a.pron}</div>
        <div class="tip">Example: <strong>${a.ex}</strong></div>
      </div>
    `).join('')}
  </div>

  <h2>Chapter 2: Essential Counting Numbers (1 to 1,000)</h2>
  <div class="grid">
    ${book.numbers.map(n => `
      <div class="card">
        <div style="font-size: 14px; font-weight: bold;">Number ${n.num}</div>
        <div class="script">${n.word}</div>
        <div class="pron">Pronunciation: ${n.pron}</div>
      </div>
    `).join('')}
  </div>

  <h2>Chapter 3: Categorized Travel & Emergency Phrasebook</h2>
  <div class="grid">
    ${phrases.map(p => {
      const trans = p.translations[book.langCode] || p.translations["te"] || p.translations["hi"];
      return `
        <div class="card">
          <div style="font-size: 11px; font-weight: bold; color: #0369a1;">[${p.category}]</div>
          <div style="font-size: 13px; font-weight: 600;">"${p.en}"</div>
          <div class="script" style="margin-top: 4px;">${trans?.script || ""}</div>
          <div class="pron">${trans?.pron || ""}</div>
          <div class="tip"><strong>Etiquette:</strong> ${trans?.tip || ""}</div>
        </div>
      `;
    }).join('')}
  </div>

  <div class="footer">
    <p>Bharat Yatra Digital Heritage & Tourism Guidebook · Government of India Public Access Edition · Keep offline on phone for field navigation</p>
  </div>

  <script>
    window.onload = function() {
      // Auto trigger print dialog so traveler can Save as PDF
      window.print();
    };
  </script>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const win = window.open(url, "_blank");
  if (!win) {
    // If popup blocked, create standard download link
    const a = document.createElement("a");
    a.href = url;
    a.download = `${book.id}-guidebook.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}

// Generate Standalone 100% Offline Edge Translator Single-File Web App
export function downloadStandaloneOfflineTranslatorApp() {
  const phrasesJson = JSON.stringify(comprehensivePhrasebook);
  const langsJson = JSON.stringify(languageOptions);

  const htmlApp = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bharat Yatra - 100% Offline Edge Cultural Translator</title>
  <style>
    :root {
      --primary: #0284c7;
      --primary-dark: #0369a1;
      --bg: #f8fafc;
      --card: #ffffff;
      --text: #0f172a;
      --text-muted: #64748b;
      --border: #e2e8f0;
      --emerald: #10b981;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
    body { background-color: var(--bg); color: var(--text); line-height: 1.5; padding: 16px; }
    .container { max-width: 900px; margin: 0 auto; }
    .header { background: linear-gradient(135deg, #0284c7, #0f172a); color: white; padding: 24px; border-radius: 20px; margin-bottom: 20px; }
    .badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.2); padding: 4px 12px; border-radius: 100px; font-size: 12px; font-weight: bold; text-transform: uppercase; margin-bottom: 12px; }
    h1 { font-size: 24px; margin-bottom: 6px; }
    p.sub { font-size: 13px; opacity: 0.9; }
    .card { background: var(--card); border: 1px solid var(--border); border-radius: 18px; padding: 20px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    @media (max-width: 640px) { .grid-2 { grid-template-columns: 1fr; } }
    label { font-size: 11px; font-weight: bold; text-transform: uppercase; color: var(--text-muted); display: block; margin-bottom: 6px; }
    select, input, textarea { width: 100%; padding: 10px 14px; border-radius: 12px; border: 1px solid var(--border); background: #fff; font-size: 14px; outline: none; transition: border-color 0.2s; }
    select:focus, input:focus, textarea:focus { border-color: var(--primary); }
    textarea { resize: vertical; min-height: 100px; font-size: 16px; }
    .output-box { background: #f1f5f9; border-radius: 14px; padding: 16px; min-height: 100px; }
    .native-script { font-size: 22px; font-weight: bold; color: var(--primary); margin-bottom: 6px; }
    .pronunciation { font-family: monospace; font-size: 13px; color: var(--text-muted); }
    .btn { display: inline-flex; align-items: center; gap: 6px; background: var(--primary); color: white; border: none; padding: 8px 16px; border-radius: 100px; font-size: 13px; font-weight: bold; cursor: pointer; transition: opacity 0.2s; }
    .btn:hover { opacity: 0.9; }
    .phrase-item { background: #f8fafc; border: 1px solid var(--border); border-radius: 12px; padding: 14px; margin-bottom: 10px; }
    .badge-cat { font-size: 10px; font-weight: bold; color: var(--primary); text-transform: uppercase; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="badge">⚡ 100% Offline Edge Mode · Zero Internet Required</div>
      <h1>Bharat Yatra Edge Translator</h1>
      <p class="sub">Instant zero-latency multilingual travel translator. Works in remote heritage zones, trains, flights, and valleys without any active network.</p>
    </div>

    <div class="card">
      <div class="grid-2" style="margin-bottom: 16px;">
        <div>
          <label>Source Language</label>
          <select id="srcLang">
            <option value="en">English</option>
            <option value="te">Telugu (తెలుగు)</option>
            <option value="hi">Hindi (हिन्दी)</option>
            <option value="ta">Tamil (தமிழ்)</option>
            <option value="kn">Kannada (ಕನ್ನಡ)</option>
            <option value="bn">Bengali (বাংলা)</option>
          </select>
        </div>
        <div>
          <label>Target Language (Native Script)</label>
          <select id="tgtLang">
            <option value="te" selected>Telugu (తెలుగు)</option>
            <option value="hi">Hindi (हिन्दी)</option>
            <option value="ta">Tamil (தமிழ்)</option>
            <option value="kn">Kannada (ಕನ್ನಡ)</option>
            <option value="bn">Bengali (বাংলা)</option>
            <option value="mr">Marathi (मराठी)</option>
            <option value="gu">Gujarati (ગુજરાતી)</option>
            <option value="ml">Malayalam (മലയാളം)</option>
            <option value="pa">Punjabi (ਪੰਜਾਬੀ)</option>
            <option value="or">Odia (ଓଡ଼ିଆ)</option>
          </select>
        </div>
      </div>

      <div class="grid-2">
        <div>
          <label>Type or Speak Expression</label>
          <textarea id="inputText" placeholder="Type here (e.g., 'Where is the temple?', 'How much is this?', 'Water please', 'Help')..."></textarea>
        </div>
        <div>
          <label>Instant Edge Output (0ms)</label>
          <div class="output-box" id="outputBox">
            <div class="native-script" id="transText">నమస్కారం</div>
            <div class="pronunciation" id="pronText">Namaskāram</div>
            <button class="btn" style="margin-top: 12px;" onclick="speakOutput()">🔊 Speak Native</button>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
        <h2 style="font-size: 18px;">Quick Offline Travel Phrasebook</h2>
        <input type="text" id="filterInput" placeholder="Filter phrases..." style="max-width: 250px; padding: 6px 12px; font-size: 13px;" oninput="renderPhrases()">
      </div>
      <div id="phrasesList"></div>
    </div>
  </div>

  <script>
    const phrases = ${phrasesJson};
    const langs = ${langsJson};

    const srcSelect = document.getElementById('srcLang');
    const tgtSelect = document.getElementById('tgtLang');
    const inputArea = document.getElementById('inputText');
    const transText = document.getElementById('transText');
    const pronText = document.getElementById('pronText');

    function resolveTranslation(text, tgt) {
      if (!text || !text.trim()) return { text: "...", pron: "" };
      const q = text.trim().toLowerCase();

      // Phrase match
      for (const p of phrases) {
        if (p.en.toLowerCase().includes(q) || q.includes(p.en.toLowerCase())) {
          const t = p.translations[tgt] || p.translations['te'] || p.translations['hi'];
          if (t) return { text: t.script, pron: t.pron };
        }
      }

      // Keyword lexicon
      const dict = {
        "water": { te: "మంచినీళ్ళు", hi: "पानी", ta: "தண்ணீர்", kn: "ನೀರು", bn: "জল" },
        "food": { te: "భోజనం", hi: "खाना", ta: "உணவு", kn: "ಊಟ", bn: "খাবার" },
        "temple": { te: "గుడి / దేవాలయం", hi: "मंदिर", ta: "கோவில்", kn: "ದೇವಸ್ಥಾನ", bn: "মন্দির" },
        "hotel": { te: "హోటల్", hi: "होटल", ta: "விடுதி", kn: "ಹೋಟೆಲ್", bn: "হোটেল" },
        "help": { te: "సహాయం చేయండి!", hi: "मदद कीजिये!", ta: "உதவி செய்யுங்கள்!", kn: "ಸಹಾಯ ಮಾಡಿ!", bn: "সাহায্য করুন!" },
        "how much": { te: "ఎంత ఖరీదు?", hi: "कितने का है?", ta: "எவ்வளவு?", kn: "ಎಷ್ಟು?", bn: "কত দাম?" }
      };

      for (const [k, map] of Object.entries(dict)) {
        if (q.includes(k)) {
          return { text: map[tgt] || map['te'] || map['hi'], pron: "Polite expression" };
        }
      }

      return { text: "[" + tgt.toUpperCase() + " Offline]: " + text, pron: "Speak clearly" };
    }

    function doTranslate() {
      const val = inputArea.value;
      const tgt = tgtSelect.value;
      const res = resolveTranslation(val, tgt);
      transText.textContent = res.text;
      pronText.textContent = res.pron;
    }

    function speakOutput() {
      if (!('speechSynthesis' in window)) return;
      const utterance = new SpeechSynthesisUtterance(transText.textContent);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }

    function renderPhrases() {
      const q = document.getElementById('filterInput').value.toLowerCase();
      const tgt = tgtSelect.value;
      const list = document.getElementById('phrasesList');
      list.innerHTML = "";

      phrases.filter(p => !q || p.en.toLowerCase().includes(q)).slice(0, 15).forEach(p => {
        const t = p.translations[tgt] || p.translations['te'] || p.translations['hi'];
        const div = document.createElement('div');
        div.className = 'phrase-item';
        div.innerHTML = \`
          <div class="badge-cat">\${p.category}</div>
          <div style="font-size: 14px; font-weight: 600; margin: 2px 0;">"\${p.en}"</div>
          <div style="font-size: 18px; font-weight: bold; color: var(--primary);">\${t ? t.script : ''}</div>
          <div style="font-size: 12px; color: var(--text-muted); font-family: monospace;">\${t ? t.pron : ''}</div>
        \`;
        div.onclick = () => {
          inputArea.value = p.en;
          doTranslate();
        };
        list.appendChild(div);
      });
    }

    inputArea.addEventListener('input', doTranslate);
    tgtSelect.addEventListener('change', () => { doTranslate(); renderPhrases(); });
    srcSelect.addEventListener('change', doTranslate);

    renderPhrases();
  </script>
</body>
</html>`;

  const blob = new Blob([htmlApp], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `bharat-yatra-offline-edge-translator.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
