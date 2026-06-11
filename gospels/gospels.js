/* ===========================================================
   THE FOUR GOSPELS — shared data + render engine
   Each page sets <body data-gospel="matthew"> and loads this file.
   All cross-gospel parallels live in ONE place (the refs object on
   each event), so the "jump to another Gospel" links generate
   themselves.  Anchor ids = the event slug, identical on every page,
   so matthew.html#feeding-5000 -> mark.html#feeding-5000 works.
   =========================================================== */
(function(){
"use strict";

/* ---------- the four evangelists ---------- */
var G = {
  matthew:{name:"Matthew", sym:"👤", creature:"The Winged Man", order:1,
    role:"Tax collector & apostle", aud:"Jewish believers",
    theme:"Jesus the promised Messiah & King",
    greek:"Κατὰ Μαθθαῖον",
    chapters:28,
    lede:"Written to show the Jewish people that Jesus is the long-awaited King — Son of David, Son of Abraham — in whom every promise of Scripture is fulfilled.",
    key:"“She will bear a son, and you shall call his name Jesus, for he will save his people from their sins.”", keyref:"Matthew 1:21",
    facts:["Symbol: the Man — opens with Jesus' human lineage","≈ 60 quotations from the Old Testament","Five great discourses (incl. the Sermon on the Mount)"]},
  mark:{name:"Mark", sym:"🦁", creature:"The Lion", order:2,
    role:"Companion of Peter", aud:"Roman believers",
    theme:"Jesus the suffering Servant",
    greek:"Κατὰ Μᾶρκον",
    chapters:16,
    lede:"The shortest, fastest Gospel — Jesus on the move, “immediately” doing the will of God, the Servant who came to give his life as a ransom.",
    key:"“For even the Son of Man came not to be served but to serve, and to give his life as a ransom for many.”", keyref:"Mark 10:45",
    facts:["Symbol: the Lion — a voice roaring in the wilderness","Uses “immediately” ≈ 40 times","Likely the first Gospel written"]},
  luke:{name:"Luke", sym:"🐂", creature:"The Ox", order:3,
    role:"Physician & historian", aud:"Theophilus & the Gentiles",
    theme:"Jesus the Son of Man, Savior of all",
    greek:"Κατὰ Λουκᾶν",
    chapters:24,
    lede:"A careful physician's orderly account — the most detailed nativity, the most parables, and a Savior whose mercy reaches the poor, the outsider and the lost.",
    key:"“For the Son of Man came to seek and to save the lost.”", keyref:"Luke 19:10",
    facts:["Symbol: the Ox — opens in the temple of sacrifice","The longest Gospel; volume one of Luke–Acts","Unique parables: Good Samaritan, Prodigal Son"]},
  john:{name:"John", sym:"🦅", creature:"The Eagle", order:4,
    role:"The beloved disciple", aud:"All who would believe",
    theme:"Jesus the eternal Son of God",
    greek:"Κατὰ Ἰωάννην",
    chapters:21,
    lede:"Soaring above the others — beginning before time itself with the Word who was God, structured around seven signs and seven “I AM” sayings, written that you may believe.",
    key:"“These are written so that you may believe that Jesus is the Christ, the Son of God, and that by believing you may have life in his name.”", keyref:"John 20:31",
    facts:["Symbol: the Eagle — soars to the eternal Word","Seven signs & seven “I AM” statements","≈ 90% unique material not in the other three"]}
};
var ORDER=["matthew","mark","luke","john"];

/* ---------- SVG scenes (self-contained, no external images) ---------- */
var S={
 word:'<svg class="scene" viewBox="0 0 340 170"><rect width="340" height="170" fill="none"/><circle cx="170" cy="85" r="46" fill="#FBF0D0" stroke="#C4872A" stroke-width="2"/><g stroke="#C4872A" stroke-width="2"><line x1="170" y1="15" x2="170" y2="40"/><line x1="170" y1="130" x2="170" y2="155"/><line x1="100" y1="85" x2="124" y2="85"/><line x1="216" y1="85" x2="240" y2="85"/><line x1="120" y1="35" x2="138" y2="53"/><line x1="202" y1="117" x2="220" y2="135"/><line x1="220" y1="35" x2="202" y2="53"/><line x1="138" y1="117" x2="120" y2="135"/></g><text x="170" y="96" text-anchor="middle" font-family="Playfair Display,serif" font-size="30" fill="#2C1810">λόγος</text></svg>',
 star:'<svg class="scene" viewBox="0 0 340 170"><path d="M0 150 L60 120 L120 145 L190 115 L260 142 L340 118 V170 H0 Z" fill="#EBD9BE"/><g stroke="#C4872A" stroke-width="2"><line x1="170" y1="18" x2="170" y2="78"/><line x1="140" y1="48" x2="200" y2="48"/><line x1="150" y1="28" x2="190" y2="68"/><line x1="190" y1="28" x2="150" y2="68"/></g><path d="M170 40 l5 12 13 1 -10 9 3 13 -11 -7 -11 7 3 -13 -10 -9 13 -1z" fill="#E8C97A" stroke="#C4872A"/><line x1="170" y1="78" x2="170" y2="150" stroke="#C4872A" stroke-width="1" stroke-dasharray="3 4"/></svg>',
 manger:'<svg class="scene" viewBox="0 0 340 170"><path d="M170 22 l4 10 11 1 -9 7 3 11 -9 -6 -9 6 3 -11 -9 -7 11 -1z" fill="#E8C97A" stroke="#C4872A"/><path d="M110 150 q60 -55 120 0" fill="none" stroke="#6B4423" stroke-width="3"/><path d="M120 150 l50 -28 50 28" fill="#FBF0D0" stroke="#C4872A" stroke-width="2"/><circle cx="170" cy="118" r="13" fill="#FFFDF7" stroke="#C4872A" stroke-width="2"/><g stroke="#E8C97A" stroke-width="2"><line x1="170" y1="92" x2="170" y2="105"/><line x1="156" y1="106" x2="184" y2="106"/></g><line x1="90" y1="150" x2="250" y2="150" stroke="#6B4423" stroke-width="3"/></svg>',
 dove:'<svg class="scene" viewBox="0 0 340 170"><line x1="40" y1="150" x2="300" y2="150" stroke="#2A7B6B" stroke-width="3"/><path d="M40 150 q130 -22 260 0" fill="none" stroke="#2A7B6B" stroke-width="2" opacity=".5"/><path d="M170 40 q-22 6 -34 28 q26 -6 34 4 q8 -10 34 -4 q-12 -22 -34 -28z" fill="#FFFDF7" stroke="#C4872A" stroke-width="2"/><circle cx="170" cy="46" r="6" fill="#FFFDF7" stroke="#C4872A" stroke-width="2"/><path d="M170 72 l0 18 M170 90 l-7 8 M170 90 l7 8" stroke="#C4872A" stroke-width="2"/><g stroke="#E8C97A" stroke-width="2"><line x1="170" y1="14" x2="170" y2="34"/><line x1="150" y1="24" x2="190" y2="24"/></g></svg>',
 bread:'<svg class="scene" viewBox="0 0 340 170"><ellipse cx="125" cy="92" rx="42" ry="30" fill="#FBF0D0" stroke="#C4872A" stroke-width="2"/><ellipse cx="125" cy="92" rx="26" ry="17" fill="none" stroke="#C4872A" opacity=".5"/><path d="M118 80 l8 -16 m-16 18 l6 -14 m18 14 l6 -14" stroke="#C4872A" stroke-width="2" fill="none"/><g transform="translate(210 92)"><path d="M-40 0 q40 -34 80 0 q-40 34 -80 0z" fill="#EBD9BE" stroke="#2A7B6B" stroke-width="2"/><circle cx="22" cy="-4" r="3" fill="#2C1810"/><path d="M40 0 l22 -12 l0 24z" fill="#EBD9BE" stroke="#2A7B6B" stroke-width="2"/><line x1="-30" y1="0" x2="20" y2="0" stroke="#2A7B6B" opacity=".5"/></g><text x="170" y="150" text-anchor="middle" font-family="Caveat,cursive" font-size="20" fill="#6B4423">five loaves &amp; two fish</text></svg>',
 boat:'<svg class="scene" viewBox="0 0 340 170"><path d="M0 120 q42 -22 84 0 t84 0 t84 0 t84 0 V170 H0Z" fill="#2A7B6B" opacity=".25"/><path d="M0 132 q42 -20 84 0 t84 0 t84 0 t84 0" fill="none" stroke="#2A7B6B" stroke-width="2"/><path d="M118 118 h104 l-16 26 h-72 z" fill="#FBF0D0" stroke="#6B4423" stroke-width="2"/><line x1="170" y1="60" x2="170" y2="118" stroke="#6B4423" stroke-width="3"/><path d="M170 64 l44 44 h-44 z" fill="#FFFDF7" stroke="#C4872A" stroke-width="2"/></svg>',
 jars:'<svg class="scene" viewBox="0 0 340 170"><g stroke="#C4872A" stroke-width="2" fill="#EBD9BE">'+
   '<path d="M120 60 q18 -14 36 0 l-4 14 q10 12 10 38 q0 22 -24 22 q-24 0 -24 -22 q0 -26 10 -38z"/>'+
   '<path d="M186 70 q14 -11 28 0 l-3 11 q8 9 8 30 q0 17 -19 17 q-19 0 -19 -17 q0 -21 8 -30z"/></g>'+
   '<path d="M120 110 q14 8 36 0" stroke="#8B3A3A" stroke-width="2" fill="none"/><path d="M183 118 q11 6 28 0" stroke="#8B3A3A" stroke-width="2" fill="none"/><text x="170" y="150" text-anchor="middle" font-family="Caveat,cursive" font-size="20" fill="#6B4423">water turned to wine</text></svg>',
 tomb:'<svg class="scene" viewBox="0 0 340 170"><path d="M70 150 a90 90 0 0 1 180 0z" fill="#EBD9BE" stroke="#6B4423" stroke-width="2"/><path d="M120 150 a40 60 0 0 1 80 0z" fill="#2C1810"/><circle cx="240" cy="138" r="30" fill="#D4B896" stroke="#6B4423" stroke-width="2"/><line x1="240" y1="150" x2="300" y2="150" stroke="#6B4423" stroke-width="2" stroke-dasharray="4 5"/><g stroke="#E8C97A" stroke-width="2"><line x1="155" y1="40" x2="155" y2="70"/><line x1="140" y1="55" x2="170" y2="55"/></g></svg>',
 cross:'<svg class="scene" viewBox="0 0 340 170"><path d="M0 150 q80 -26 170 -26 t170 26 V170 H0Z" fill="#EBD9BE"/><g stroke="#2C1810" stroke-width="6" stroke-linecap="round"><line x1="170" y1="22" x2="170" y2="150"/><line x1="132" y1="58" x2="208" y2="58"/></g><path d="M150 42 a20 20 0 0 1 40 0" fill="none" stroke="#8B3A3A" stroke-width="3"/><g stroke="#8B3A3A" stroke-width="2"><line x1="150" y1="42" x2="146" y2="34"/><line x1="170" y1="38" x2="170" y2="30"/><line x1="190" y1="42" x2="194" y2="34"/></g></svg>',
 palm:'<svg class="scene" viewBox="0 0 340 170"><path d="M70 150 H270" stroke="#6B4423" stroke-width="3"/><g fill="#2A7B6B" opacity=".85"><path d="M170 150 q-50 -10 -70 -50 q34 6 50 22 q-2 -28 12 -50 q14 22 12 50 q16 -16 50 -22 q-20 40 -70 50z"/></g><line x1="170" y1="150" x2="170" y2="92" stroke="#6B4423" stroke-width="2"/><text x="170" y="140" text-anchor="middle" font-family="Caveat,cursive" font-size="20" fill="#C4872A">Hosanna!</text></svg>',
 cup:'<svg class="scene" viewBox="0 0 340 170"><path d="M120 50 h100 l-10 50 q-6 26 -40 26 q-34 0 -40 -26z" fill="#FBF0D0" stroke="#C4872A" stroke-width="2"/><line x1="170" y1="126" x2="170" y2="148" stroke="#C4872A" stroke-width="2"/><line x1="148" y1="148" x2="192" y2="148" stroke="#C4872A" stroke-width="3"/><path d="M120 64 h100" stroke="#8B3A3A" stroke-width="3"/><path d="M250 70 q24 -10 40 0 l-4 12 q-6 18 -16 18 q-10 0 -16 -18z" fill="#EBD9BE" stroke="#C4872A" stroke-width="2"/></svg>'
};

/* ---------- the harmonized events ----------
   cat: section it belongs to | refs: {gospel:"Ref"} present in that Gospel
   art: optional scene key | note: red highlight line  | hl: extra emphasis */
var ACTS=[
 ["birth","Prologue &amp; Birth","The Word made flesh, foretold and born"],
 ["ministry","Ministry Begins","Baptism, testing and the first followers"],
 ["miracle","Miracles &amp; Signs","Power over sickness, nature, demons and death"],
 ["teaching","Teaching &amp; Parables","The Kingdom of God explained"],
 ["journey","Entering Jerusalem","The King comes to the city"],
 ["passion","The Final Days","Upper room, garden, betrayal and trial"],
 ["cross","The Cross","The suffering and death of Jesus"],
 ["resurr","Resurrection &amp; Appearances","He is risen — and shows himself alive"],
 ["comm","Commission &amp; Ending","Go… and how each Gospel closes"]
];

var EV=[
 /* ---- BIRTH ---- */
 {s:"prologue-word",t:"In the Beginning Was the Word",cat:"birth",art:"word",refs:{john:"John 1:1–18"},
  d:"John reaches back before creation: the eternal <b>Word</b> who was with God and was God, through whom all things were made, became flesh and dwelt among us, full of grace and truth."},
 {s:"genealogy",t:"The Genealogy of Jesus",cat:"birth",refs:{matthew:"Matt 1:1–17",luke:"Luke 3:23–38"},
  d:"Matthew traces Jesus forward from <b>Abraham through David</b> — the royal line of the King. Luke traces him back all the way to <b>Adam, the son of God</b> — the Savior of the whole human race."},
 {s:"gabriel-zechariah",t:"Gabriel Foretells John the Baptist",cat:"birth",refs:{luke:"Luke 1:5–25"},
  d:"The angel Gabriel meets the aged priest Zechariah in the temple, promising a son — John — who will go before the Lord. Doubting, Zechariah is struck silent until the child is born."},
 {s:"annunciation",t:"The Annunciation to Mary",cat:"birth",art:"star",refs:{luke:"Luke 1:26–38"},
  d:"Gabriel greets the young virgin Mary: she will conceive by the Holy Spirit and bear the Son of the Most High. Her answer: <b>“Let it be to me according to your word.”</b>"},
 {s:"visitation",t:"Mary Visits Elizabeth — the Magnificat",cat:"birth",refs:{luke:"Luke 1:39–56"},
  d:"The baby leaps in Elizabeth's womb at Mary's greeting, and Mary sings the <b>Magnificat</b>: “My soul magnifies the Lord… he has exalted the humble.”"},
 {s:"joseph-dream",t:"An Angel Reassures Joseph",cat:"birth",refs:{matthew:"Matt 1:18–25"},
  d:"Learning Mary is with child, Joseph plans a quiet divorce — until an angel tells him the child is from the Holy Spirit and is to be named <b>Jesus</b> (“the Lord saves”) and <b>Immanuel</b> (“God with us”)."},
 {s:"nativity",t:"The Birth of Jesus",cat:"birth",art:"manger",hl:1,refs:{matthew:"Matt 1:24–25",luke:"Luke 2:1–7"},
  d:"In Bethlehem, the city of David, the King is born and laid in a manger because there was no room in the inn. Luke gives the manger; Matthew sets it within the fulfilment of prophecy.",
  note:"Birth & early life highlighted — the eternal Son enters his own creation."},
 {s:"shepherds",t:"The Shepherds and the Angels",cat:"birth",refs:{luke:"Luke 2:8–20"},
  d:"To shepherds — the lowly, not the powerful — the heavenly host announces “good news of great joy for all people.” They hurry to find the child and spread the word."},
 {s:"presentation",t:"Presented at the Temple — Simeon &amp; Anna",cat:"birth",refs:{luke:"Luke 2:21–38"},
  d:"At the temple the devout Simeon takes the infant in his arms and blesses God — “a light for the Gentiles” — while the prophetess Anna gives thanks for the redemption of Jerusalem."},
 {s:"magi",t:"The Visit of the Magi",cat:"birth",art:"star",refs:{matthew:"Matt 2:1–12"},
  d:"Wise men from the east follow a star to honour the newborn <b>King of the Jews</b>, offering gold, frankincense and myrrh — Gentiles worshipping at the cradle of Israel's Messiah."},
 {s:"flight-egypt",t:"The Flight to Egypt",cat:"birth",refs:{matthew:"Matt 2:13–23"},
  d:"Warned in a dream, Joseph takes the child to Egypt to escape Herod's slaughter of the infants of Bethlehem; later they settle in Nazareth — each move fulfilling Scripture."},
 {s:"boy-temple",t:"The Boy Jesus at the Temple",cat:"birth",refs:{luke:"Luke 2:41–52"},
  d:"At twelve, Jesus stays behind among the teachers, astonishing them with his understanding: “Did you not know I must be in my Father's house?” He grows in wisdom and stature."},

 /* ---- MINISTRY ---- */
 {s:"baptist",t:"John the Baptist Prepares the Way",cat:"ministry",refs:{matthew:"Matt 3:1–12",mark:"Mark 1:1–8",luke:"Luke 3:1–20",john:"John 1:19–28"},
  d:"A voice in the wilderness calls Israel to repent and be baptised, pointing beyond himself: “One mightier than I is coming… he will baptise you with the Holy Spirit.”"},
 {s:"baptism",t:"The Baptism of Jesus",cat:"ministry",art:"dove",refs:{matthew:"Matt 3:13–17",mark:"Mark 1:9–11",luke:"Luke 3:21–22",john:"John 1:29–34"},
  d:"Jesus is baptised in the Jordan; the Spirit descends like a <b>dove</b> and the Father's voice declares, “This is my beloved Son.” John names him “the Lamb of God who takes away the sin of the world.”"},
 {s:"temptation",t:"The Temptation in the Wilderness",cat:"ministry",refs:{matthew:"Matt 4:1–11",mark:"Mark 1:12–13",luke:"Luke 4:1–13"},
  d:"Forty days fasting, then tested three times by Satan — bread, power, presumption — Jesus answers each with Scripture and overcomes where Israel and Adam fell."},
 {s:"first-disciples",t:"Calling the First Disciples",cat:"ministry",refs:{matthew:"Matt 4:18–22",mark:"Mark 1:16–20",luke:"Luke 5:1–11",john:"John 1:35–51"},
  d:"By the Sea of Galilee Jesus calls fishermen — Peter, Andrew, James, John — “Follow me, and I will make you fishers of men.” In Luke, the call follows a miraculous catch of fish."},
 {s:"nazareth",t:"Rejected at Nazareth",cat:"ministry",refs:{matthew:"Matt 13:53–58",mark:"Mark 6:1–6",luke:"Luke 4:16–30"},
  d:"In his hometown synagogue Jesus reads Isaiah and announces, “Today this Scripture is fulfilled.” Amazement turns to fury; “a prophet is not without honour except in his own town.”"},

 /* ---- MIRACLES / SIGNS ---- */
 {s:"cana",t:"Water into Wine at Cana — 1st Sign",cat:"miracle",art:"jars",refs:{john:"John 2:1–11"},
  d:"At a wedding Jesus turns six stone jars of water into the finest wine — “the first of his signs,” revealing his glory so that his disciples believed in him."},
 {s:"officials-son",t:"Healing the Official's Son — 2nd Sign",cat:"miracle",refs:{john:"John 4:46–54"},
  d:"A royal official begs Jesus to heal his dying son. “Go; your son will live.” The boy recovers at the very hour Jesus spoke — healing at a distance, by his word alone."},
 {s:"leper",t:"Cleansing a Leper",cat:"miracle",refs:{matthew:"Matt 8:1–4",mark:"Mark 1:40–45",luke:"Luke 5:12–16"},
  d:"A leper kneels: “If you are willing, you can make me clean.” Jesus touches the untouchable — “I am willing” — and the leprosy leaves him instantly."},
 {s:"centurion",t:"The Centurion's Servant",cat:"miracle",refs:{matthew:"Matt 8:5–13",luke:"Luke 7:1–10"},
  d:"A Roman centurion trusts Jesus to heal with a word from afar: “only say the word.” Jesus marvels at such faith — “not even in Israel have I found faith like this.”"},
 {s:"peters-mother",t:"Healing Peter's Mother-in-Law",cat:"miracle",refs:{matthew:"Matt 8:14–15",mark:"Mark 1:29–31",luke:"Luke 4:38–39"},
  d:"Jesus takes her by the hand and the fever leaves; at once she rises and serves them — the first of many healed that same evening at the door."},
 {s:"paralytic",t:"The Paralytic Lowered Through the Roof",cat:"miracle",refs:{matthew:"Matt 9:1–8",mark:"Mark 2:1–12",luke:"Luke 5:17–26"},
  d:"Friends dig through a roof to lower a paralysed man. “Your sins are forgiven… take up your bed and walk.” He does — proving the Son of Man has authority to forgive."},
 {s:"storm",t:"Calming the Storm",cat:"miracle",art:"boat",refs:{matthew:"Matt 8:23–27",mark:"Mark 4:35–41",luke:"Luke 8:22–25"},
  d:"As the boat fills in a squall, Jesus sleeps. Woken, he rebukes the wind and sea — “Peace! Be still!” — and the terrified disciples ask, “Who is this, that even wind and sea obey him?”"},
 {s:"gerasene",t:"The Gerasene Demoniac",cat:"miracle",refs:{matthew:"Matt 8:28–34",mark:"Mark 5:1–20",luke:"Luke 8:26–39"},
  d:"Jesus frees a man tormented by a legion of demons, sending them into a herd of pigs. The man, now clothed and in his right mind, becomes the first missionary to the Decapolis."},
 {s:"jairus",t:"Raising Jairus' Daughter",cat:"miracle",refs:{matthew:"Matt 9:18–26",mark:"Mark 5:21–43",luke:"Luke 8:40–56"},
  d:"A synagogue ruler's twelve-year-old daughter dies; Jesus takes her hand — “Talitha cumi… little girl, arise” — and her life returns. “Do not fear, only believe.”"},
 {s:"bleeding-woman",t:"The Woman Who Touched His Cloak",cat:"miracle",refs:{matthew:"Matt 9:20–22",mark:"Mark 5:25–34",luke:"Luke 8:43–48"},
  d:"Bleeding twelve years, she reaches through the crowd to touch his garment and is healed. Jesus feels power go out: “Daughter, your faith has made you well.”"},
 {s:"feeding-5000",t:"Feeding the Five Thousand — 4th Sign",cat:"miracle",art:"bread",hl:1,refs:{matthew:"Matt 14:13–21",mark:"Mark 6:30–44",luke:"Luke 9:10–17",john:"John 6:1–14"},
  d:"From five loaves and two fish Jesus feeds a crowd of five thousand men, with twelve baskets left over — the bread of life given to all.",
  note:"The only miracle recorded in all four Gospels — follow the badges to read every account."},
 {s:"walk-water",t:"Walking on the Water — 5th Sign",cat:"miracle",art:"boat",refs:{matthew:"Matt 14:22–33",mark:"Mark 6:45–52",john:"John 6:16–21"},
  d:"Jesus comes to the storm-tossed disciples walking on the sea: “Take heart; it is I. Do not be afraid.” In Matthew, Peter walks toward him until fear sinks him."},
 {s:"syrophoenician",t:"The Syrophoenician Woman's Daughter",cat:"miracle",refs:{matthew:"Matt 15:21–28",mark:"Mark 7:24–30"},
  d:"A Gentile mother's persistent, humble faith wins her daughter's deliverance: “Woman, great is your faith! Be it done for you as you desire.”"},
 {s:"feeding-4000",t:"Feeding the Four Thousand",cat:"miracle",refs:{matthew:"Matt 15:32–39",mark:"Mark 8:1–10"},
  d:"Moved with compassion for a hungry crowd, Jesus multiplies seven loaves and a few fish — this time among the Gentiles — with seven baskets left over."},
 {s:"blind-bethsaida",t:"The Blind Man of Bethsaida",cat:"miracle",refs:{mark:"Mark 8:22–26"},
  d:"Jesus heals a blind man in two stages — first blurred, then clear — a sign placed beside the disciples' own slow-opening eyes."},
 {s:"transfiguration",t:"The Transfiguration",cat:"miracle",art:"word",refs:{matthew:"Matt 17:1–13",mark:"Mark 9:2–13",luke:"Luke 9:28–36"},
  d:"On a high mountain Jesus shines with glory, with Moses and Elijah beside him, and the Father's voice declares, “This is my beloved Son; listen to him.”"},
 {s:"boy-spirit",t:"Healing the Demon-Possessed Boy",cat:"miracle",refs:{matthew:"Matt 17:14–21",mark:"Mark 9:14–29",luke:"Luke 9:37–43"},
  d:"Where the disciples failed, Jesus frees a convulsing boy. The father's cry has echoed ever since: “I believe; help my unbelief!”"},
 {s:"man-born-blind",t:"Healing the Man Born Blind — 6th Sign",cat:"miracle",refs:{john:"John 9:1–41"},
  d:"Jesus gives sight to a man blind from birth, sparking a whole chapter of debate. The healed man's testimony is unanswerable: “One thing I know: I was blind, now I see.”"},
 {s:"ten-lepers",t:"Healing Ten Lepers",cat:"miracle",refs:{luke:"Luke 17:11–19"},
  d:"Ten are cleansed, but only one — a Samaritan — returns to give thanks. “Were not ten cleansed? Where are the nine?”"},
 {s:"lazarus",t:"Raising Lazarus — 7th Sign",cat:"miracle",art:"tomb",hl:1,refs:{john:"John 11:1–44"},
  d:"Four days dead, Lazarus walks from the tomb at Jesus' command. First Jesus declares, “I am the resurrection and the life,” then proves it — the sign that sealed his enemies' resolve to kill him."},
 {s:"bartimaeus",t:"Blind Bartimaeus",cat:"miracle",refs:{matthew:"Matt 20:29–34",mark:"Mark 10:46–52",luke:"Luke 18:35–43"},
  d:"On the road to Jerusalem a blind beggar shouts, “Son of David, have mercy!” His faith is rewarded: “Go; your faith has made you well,” and he follows Jesus on the way."},
 {s:"fig-tree",t:"Withering the Fig Tree",cat:"miracle",refs:{matthew:"Matt 21:18–22",mark:"Mark 11:12–25"},
  d:"A barren fig tree withers at Jesus' word — an acted parable of fruitless religion — paired with a lesson on mountain-moving, believing prayer."},

 /* ---- TEACHING ---- */
 {s:"sermon-mount",t:"The Sermon on the Mount &amp; Beatitudes",cat:"teaching",refs:{matthew:"Matt 5–7",luke:"Luke 6:17–49"},
  d:"“Blessed are the poor in spirit…” Jesus unfolds the heart of the Kingdom — salt and light, love of enemies, true righteousness. Luke gives a parallel Sermon on the Plain."},
 {s:"lords-prayer",t:"The Lord's Prayer",cat:"teaching",refs:{matthew:"Matt 6:9–13",luke:"Luke 11:1–4"},
  d:"“Our Father in heaven…” Jesus teaches his disciples to pray — for God's name, kingdom and will, for daily bread, forgiveness and deliverance."},
 {s:"born-again",t:"You Must Be Born Again — Nicodemus",cat:"teaching",refs:{john:"John 3:1–21"},
  d:"By night a Pharisee comes seeking, and hears the heart of the gospel: “God so loved the world that he gave his only Son, that whoever believes in him should not perish but have eternal life.”"},
 {s:"living-water",t:"The Woman at the Well",cat:"teaching",refs:{john:"John 4:1–42"},
  d:"To a Samaritan outsider Jesus offers “living water… welling up to eternal life,” and reveals himself as Messiah. Her whole town comes to believe."},
 {s:"kingdom-parables",t:"Parables of the Kingdom",cat:"teaching",refs:{matthew:"Matt 13",mark:"Mark 4",luke:"Luke 8:4–15"},
  d:"The Sower, the Mustard Seed, the Hidden Treasure — story after story reveals that the Kingdom grows quietly, costs everything, and is worth all."},
 {s:"bread-of-life",t:"I Am the Bread of Life",cat:"teaching",refs:{john:"John 6:25–59"},
  d:"The day after feeding the crowd, Jesus declares himself the true bread from heaven: “Whoever comes to me shall not hunger.” The first of seven great “I AM” sayings."},
 {s:"good-shepherd",t:"I Am the Good Shepherd",cat:"teaching",refs:{john:"John 10:1–21"},
  d:"“The good shepherd lays down his life for the sheep.” Jesus knows his own, they know his voice, and no one can snatch them from his hand."},
 {s:"good-samaritan",t:"The Good Samaritan",cat:"teaching",refs:{luke:"Luke 10:25–37"},
  d:"To “Who is my neighbour?” Jesus answers with a despised Samaritan who shows mercy where priest and Levite passed by. “Go and do likewise.”"},
 {s:"prodigal",t:"The Prodigal Son",cat:"teaching",refs:{luke:"Luke 15:11–32"},
  d:"A wayward son comes home to a father who runs to meet him — Luke's portrait of the Father's heart for the lost, and a warning to the elder brother who will not rejoice."},
 {s:"peters-confession",t:"Peter's Confession — “You Are the Christ”",cat:"teaching",refs:{matthew:"Matt 16:13–20",mark:"Mark 8:27–30",luke:"Luke 9:18–20"},
  d:"At Caesarea Philippi Jesus asks, “Who do you say I am?” Peter answers, “You are the Christ, the Son of the living God” — the hinge of the Synoptic story."},
 {s:"greatest-command",t:"The Greatest Commandment",cat:"teaching",refs:{matthew:"Matt 22:34–40",mark:"Mark 12:28–34",luke:"Luke 10:25–28"},
  d:"Love the Lord your God with all your heart, and your neighbour as yourself — “On these two commandments depend all the Law and the Prophets.”"},
 {s:"olivet",t:"The Olivet Discourse",cat:"teaching",refs:{matthew:"Matt 24–25",mark:"Mark 13",luke:"Luke 21:5–38"},
  d:"On the Mount of Olives Jesus foretells the temple's fall, the troubles to come, and his return in glory, calling his people to watch and be ready."},

 /* ---- JOURNEY / ENTERING JERUSALEM ---- */
 {s:"triumphal-entry",t:"The Triumphal Entry",cat:"journey",art:"palm",refs:{matthew:"Matt 21:1–11",mark:"Mark 11:1–11",luke:"Luke 19:28–44",john:"John 12:12–19"},
  d:"Riding a donkey's colt, Jesus enters Jerusalem to shouts of “Hosanna! Blessed is he who comes in the name of the Lord!” — the humble King fulfilling Zechariah's prophecy."},
 {s:"temple-cleansing",t:"Cleansing the Temple",cat:"journey",refs:{matthew:"Matt 21:12–17",mark:"Mark 11:15–19",luke:"Luke 19:45–48",john:"John 2:13–22"},
  d:"Jesus overturns the money-changers' tables: “My house shall be a house of prayer, but you make it a den of robbers.” (John places a cleansing early in the ministry.)"},
 {s:"anointing",t:"The Anointing at Bethany",cat:"journey",refs:{matthew:"Matt 26:6–13",mark:"Mark 14:3–9",john:"John 12:1–8"},
  d:"A woman pours costly perfume over Jesus. To the indignant he says she has anointed his body “for burial” — “wherever the gospel is preached, what she has done will be told.”"},

 /* ---- PASSION / FINAL DAYS ---- */
 {s:"last-supper",t:"The Last Supper",cat:"passion",art:"cup",hl:1,refs:{matthew:"Matt 26:17–30",mark:"Mark 14:12–26",luke:"Luke 22:7–38",john:"John 13:1–30"},
  d:"In the upper room Jesus shares the Passover, gives the bread and cup as his body and blood of the new covenant — “do this in remembrance of me” — and foretells his betrayal.",
  note:"The final meal — the institution of the Lord's Supper, recorded in all four Gospels."},
 {s:"foot-washing",t:"Washing the Disciples' Feet",cat:"passion",refs:{john:"John 13:1–17"},
  d:"The Lord girds himself with a towel and washes his disciples' feet: “If I, your Lord, have washed your feet, you also ought to wash one another's feet.”"},
 {s:"farewell",t:"The Vine &amp; the Promise of the Spirit",cat:"passion",refs:{john:"John 14–16"},
  d:"“I am the way, the truth and the life.” Jesus comforts his own with the promise of the Father's house, the abiding Vine, and the coming Helper, the Holy Spirit."},
 {s:"high-priestly-prayer",t:"Jesus' High Priestly Prayer",cat:"passion",refs:{john:"John 17"},
  d:"On the brink of the cross, Jesus prays for himself, for his disciples, and for all who will believe through their word — “that they may all be one.”"},
 {s:"gethsemane",t:"Agony in Gethsemane",cat:"passion",art:"cup",refs:{matthew:"Matt 26:36–46",mark:"Mark 14:32–42",luke:"Luke 22:39–46"},
  d:"In the garden, sorrowful to death, Jesus prays, “Father… not my will, but yours, be done.” Luke records his sweat like drops of blood and an angel strengthening him."},
 {s:"betrayal",t:"The Betrayal &amp; Arrest",cat:"passion",refs:{matthew:"Matt 26:47–56",mark:"Mark 14:43–52",luke:"Luke 22:47–53",john:"John 18:2–12"},
  d:"Judas betrays him with a kiss. As the mob seizes Jesus, a disciple draws a sword — and Jesus surrenders himself: “Shall I not drink the cup the Father has given me?”"},
 {s:"malchus-ear",t:"Healing the Servant's Ear",cat:"passion",refs:{luke:"Luke 22:50–51"},
  d:"When a disciple cuts off the high priest's servant's ear, Jesus heals it — his last miracle before the cross, mercy even to those arresting him."},
 {s:"trials",t:"Trial Before the Sanhedrin &amp; Pilate",cat:"passion",refs:{matthew:"Matt 26:57–27:26",mark:"Mark 14:53–15:15",luke:"Luke 22:54–23:25",john:"John 18:13–19:16"},
  d:"Condemned for blasphemy by the council, then handed to Pilate, who finds no guilt yet yields to the crowd: “Crucify him!” Barabbas is released in his place."},
 {s:"herod",t:"Jesus Before Herod",cat:"passion",refs:{luke:"Luke 23:6–12"},
  d:"Pilate sends Jesus to Herod, who hopes for a sign; receiving only silence, he mocks and returns him — and that day Herod and Pilate become friends."},
 {s:"peters-denial",t:"Peter's Denial",cat:"passion",refs:{matthew:"Matt 26:69–75",mark:"Mark 14:66–72",luke:"Luke 22:54–62",john:"John 18:15–27"},
  d:"Three times Peter denies knowing Jesus; the cock crows, and he weeps bitterly — a fall that the risen Lord will later restore."},

 /* ---- CROSS ---- */
 {s:"via-dolorosa",t:"The Way to Golgotha — Simon of Cyrene",cat:"cross",refs:{matthew:"Matt 27:31–32",mark:"Mark 15:20–21",luke:"Luke 23:26–31",john:"John 19:17"},
  d:"Beaten and crowned with thorns, Jesus is led out to be crucified; Simon of Cyrene is pressed into carrying his cross. Luke records the weeping women he comforts on the way."},
 {s:"crucifixion",t:"The Crucifixion",cat:"cross",art:"cross",hl:1,refs:{matthew:"Matt 27:33–44",mark:"Mark 15:22–32",luke:"Luke 23:32–43",john:"John 19:17–27"},
  d:"At Golgotha they crucify him between two criminals, casting lots for his clothing, the sign above reading “The King of the Jews.” He is mocked by rulers, soldiers and the crowd.",
  note:"The suffering on the cross — read all four accounts side by side using the badges below."},
 {s:"death",t:"The Death of Jesus",cat:"cross",refs:{matthew:"Matt 27:45–56",mark:"Mark 15:33–41",luke:"Luke 23:44–49",john:"John 19:28–37"},
  d:"Darkness covers the land; Jesus breathes his last, the temple curtain tears in two, the earth quakes, and the centurion confesses, “Truly this was the Son of God.”"},
 {s:"burial",t:"The Burial",cat:"cross",art:"tomb",refs:{matthew:"Matt 27:57–61",mark:"Mark 15:42–47",luke:"Luke 23:50–56",john:"John 19:38–42"},
  d:"Joseph of Arimathea (with Nicodemus in John) lays the body in a new rock-hewn tomb and rolls a great stone across the entrance, the women watching where he was laid."},
 {s:"guard-tomb",t:"The Guard at the Tomb",cat:"cross",refs:{matthew:"Matt 27:62–66"},
  d:"Fearing the disciples might steal the body, the chief priests secure the tomb with a Roman guard and a seal — unwittingly providing witnesses to the resurrection."},

 /* ---- RESURRECTION ---- */
 {s:"empty-tomb",t:"The Empty Tomb",cat:"resurr",art:"tomb",hl:1,refs:{matthew:"Matt 28:1–10",mark:"Mark 16:1–8",luke:"Luke 24:1–12",john:"John 20:1–10"},
  d:"At dawn the women find the stone rolled away and the tomb empty. An angel proclaims the heart of the faith: “He is not here, for he has risen, as he said.”",
  note:"He is risen — the resurrection, witnessed first by the women, in all four Gospels."},
 {s:"mary-magdalene",t:"Jesus Appears to Mary Magdalene",cat:"resurr",refs:{mark:"Mark 16:9–11",john:"John 20:11–18"},
  d:"Weeping at the tomb, Mary mistakes him for the gardener — until he speaks her name, “Mary.” She runs to tell the disciples, “I have seen the Lord!”"},
 {s:"emmaus",t:"On the Road to Emmaus",cat:"resurr",refs:{mark:"Mark 16:12–13",luke:"Luke 24:13–35"},
  d:"Two disciples walk with the risen Jesus without knowing him as he opens the Scriptures; their eyes are opened in the breaking of bread, and he vanishes."},
 {s:"appear-disciples",t:"Jesus Appears to the Disciples",cat:"resurr",hl:1,refs:{mark:"Mark 16:14",luke:"Luke 24:36–49",john:"John 20:19–23"},
  d:"Jesus stands among them: “Peace be with you.” He shows his hands and side, eats before them to prove he is no ghost, and breathes on them the Holy Spirit.",
  note:"Appearing to the disciples — risen and bodily, sending them out."},
 {s:"thomas",t:"Thomas Believes",cat:"resurr",refs:{john:"John 20:24–29"},
  d:"Absent before, Thomas demands to touch the wounds. A week later Jesus offers them: “Do not disbelieve, but believe.” Thomas answers, “My Lord and my God!”"},
 {s:"breakfast",t:"Breakfast by the Sea — Peter Restored",cat:"resurr",refs:{john:"John 21:1–19"},
  d:"After a miraculous catch, Jesus cooks breakfast on the shore and three times asks, “Simon, do you love me?” — restoring Peter and recommissioning him: “Feed my sheep.”"},
 {s:"guards-report",t:"The Soldiers' Report",cat:"resurr",refs:{matthew:"Matt 28:11–15"},
  d:"The guards are bribed to claim the disciples stole the body — the very rumour Matthew answers by recording the truth of the empty tomb."}
];

/* ---- SEVEN LAST WORDS (the cross) ---- */
var WORDS=[
 {say:"“Father, forgive them, for they know not what they do.”",src:{luke:"Luke 23:34"}},
 {say:"“Truly I say to you, today you will be with me in Paradise.”",src:{luke:"Luke 23:43"}},
 {say:"“Woman, behold your son… Behold your mother.”",src:{john:"John 19:26–27"}},
 {say:"“My God, my God, why have you forsaken me?”",src:{matthew:"Matt 27:46",mark:"Mark 15:34"}},
 {say:"“I thirst.”",src:{john:"John 19:28"}},
 {say:"“It is finished.”",src:{john:"John 19:30"}},
 {say:"“Father, into your hands I commit my spirit.”",src:{luke:"Luke 23:46"}}
];

/* ---- THE GREAT COMMISSION ---- */
var COMM={
 matthew:{verse:"“All authority in heaven and on earth has been given to me. Go therefore and make disciples of all nations, baptising them in the name of the Father and of the Son and of the Holy Spirit… and behold, I am with you always, to the end of the age.”",ref:"Matthew 28:18–20"},
 mark:{verse:"“Go into all the world and proclaim the gospel to the whole creation. Whoever believes and is baptised will be saved.”",ref:"Mark 16:15–16"},
 luke:{verse:"“Repentance and forgiveness of sins should be proclaimed in his name to all nations… You are witnesses of these things. I am sending the promise of my Father upon you.”",ref:"Luke 24:46–49"}
};

/* ---- HOW EACH GOSPEL ENDS ---- */
var ENDINGS={
 matthew:{ref:"Matthew 28:16–20",cc:"#3A4A8B",p:"On a mountain in Galilee the risen King sends the Eleven to disciple the nations, sealing the Gospel with an unbreakable promise: <b>“I am with you always, to the very end of the age.”</b>"},
 mark:{ref:"Mark 16:8 / 16:9–20",cc:"#8B3A3A",p:"The earliest manuscripts end abruptly at the empty tomb — the women fleeing in fear and wonder. The traditional longer ending adds the appearances, the commission and Jesus <b>taken up to the right hand of God</b>, the disciples preaching everywhere."},
 luke:{ref:"Luke 24:50–53",cc:"#2A7B6B",p:"At Bethany Jesus lifts his hands, blesses them, and is <b>carried up into heaven</b>. The disciples return to Jerusalem with great joy, continually in the temple blessing God — the story flows straight on into Acts."},
 john:{ref:"John 21:25",cc:"#6B3A7B",p:"After restoring Peter, John lays down his pen with wonder: <b>“the world itself could not contain the books”</b> that would be written of all that Jesus did — an open-ended invitation to keep believing."}
};

/* =================== RENDER =================== */
function dot(g){return '<span class="dot d-'+g+'">'+G[g].sym+'</span>';}
function esc(x){return x;}

function build(){
 var gid=document.body.dataset.gospel;
 var me=G[gid];
 document.title=me.name+" — The Four Gospels";

 /* header nav */
 var nav='';
 ORDER.forEach(function(g){
   nav+='<a class="gnav'+(g===gid?' on':'')+'" href="'+g+'.html" title="The Gospel of '+G[g].name+' — '+G[g].creature+'">'+G[g].sym+'</a>';
 });
 document.getElementById('gnav').innerHTML=nav;

 /* hero */
 document.getElementById('hero').innerHTML=
   '<div class="symbol">'+symbolSVG(gid)+'</div>'+
   '<div class="eyebrow">The Gospel according to</div>'+
   '<h1>'+me.name+'</h1>'+
   '<div class="greek">'+me.greek+' · '+me.creature+'</div>'+
   '<p class="lede">'+me.lede+'</p>'+
   '<div class="facts">'+
     '<span class="fact"><b>'+me.chapters+'</b> chapters</span>'+
     '<span class="fact"><b>Author:</b> '+me.role+'</span>'+
     '<span class="fact"><b>For:</b> '+me.aud+'</span>'+
     '<span class="fact"><b>Theme:</b> '+me.theme+'</span>'+
   '</div>'+
   '<div class="keyverse">'+me.key+'<span class="ref">'+me.keyref+'</span></div>';

 /* which acts appear in this gospel */
 var present={};
 EV.forEach(function(e){ if(e.refs[gid]) present[e.cat]=true; });
 present.cross=true; present.comm=true; // always render seven-words + commission/endings

 /* jump bar */
 var jb='';
 ACTS.forEach(function(a){ if(present[a[0]]) jb+='<a href="#act-'+a[0]+'">'+a[1]+'</a>'; });
 document.getElementById('jump').innerHTML=jb;

 /* body */
 var html='';
 var n=0;
 ACTS.forEach(function(a){
   var cat=a[0];
   var rows=EV.filter(function(e){return e.cat===cat && e.refs[gid];});
   if(!rows.length && cat!=="cross" && cat!=="comm") return;
   n++;
   html+='<section class="act" id="act-'+cat+'"><span class="num">'+roman(n)+'</span>'+
         '<div><h2>'+a[1]+'</h2><p>'+a[2]+'</p></div><span class="line"></span></section>';
   rows.forEach(function(e){ html+=card(e,gid); });

   if(cat==="cross"){ html+=sevenWords(gid); }
   if(cat==="comm"){ html+=commission(gid)+endings(gid); }
 });

 /* read links */
 var ng=encodeURIComponent(me.name);
 html+='<div class="read">'+
   '<a href="https://www.biblegateway.com/passage/?search='+ng+'%201&version=NIV" target="_blank" rel="noopener">📖 Read '+me.name+' (NIV) ↗</a>'+
   '<a class="alt" href="https://www.biblegateway.com/passage/?search='+ng+'%201&version=KJV" target="_blank" rel="noopener">Read in KJV ↗</a>'+
   '</div>';

 document.getElementById('content').innerHTML=html;

 /* footer symbol row */
 document.getElementById('symrow').innerHTML=ORDER.map(function(g){return G[g].sym;}).join(' ');
}

function card(e,gid){
 var others=ORDER.filter(function(g){return g!==gid && e.refs[g];});
 var all=Object.keys(e.refs).length===4;
 var links='';
 if(others.length){
   links='<div class="links"><span class="lbl">'+(e.cat==="miracle"?"Also in:":"Read alongside:")+'</span>';
   others.forEach(function(g){
     links+='<a class="xlink" href="'+g+'.html#'+e.s+'">'+dot(g)+G[g].name+' · '+e.refs[g]+'</a>';
   });
   if(all) links+='<span class="allfour">★ in all four</span>';
   links+='</div>';
 }
 var scene = e.art && (e.hl||e.cat==="miracle"||e.cat==="cross"||e.cat==="resurr"||e.cat==="birth"||e.cat==="journey"||e.cat==="passion") ? S[e.art] : '';
 return '<article class="ev" id="'+e.s+'" style="--cat:var(--c-'+catKey(e.cat)+')">'+
   '<div class="top"><span class="cat">'+catLabel(e.cat)+'</span>'+
   '<h3>'+e.t+'</h3><span class="here">'+e.refs[gid]+'</span></div>'+
   (scene||'')+
   '<div class="body">'+e.d+'</div>'+
   (e.note?'<div class="note">✦ '+e.note+'</div>':'')+
   links+'</article>';
}

function sevenWords(gid){
 var w='<article class="ev" id="seven-words" style="--cat:var(--c-cross)">'+
   '<div class="top"><span class="cat">From the Cross</span><h3>The Seven Last Words of Jesus</h3></div>'+
   '<div class="body">The seven sayings of Jesus from the cross are gathered from across the four Gospels. The sayings recorded in <b>'+G[gid].name+'</b> are highlighted; the badges link to the Gospel that records each one.</div>'+
   '<div class="words" style="margin-top:1rem">';
 WORDS.forEach(function(o,i){
   var mine=!!o.src[gid];
   var badges='';
   for(var g in o.src){
     badges+='<a class="badge d-'+g+'" href="'+g+'.html#death" style="text-decoration:none">'+G[g].name+' · '+o.src[g]+'</a>';
   }
   w+='<div class="word'+(mine?'':' dim')+'">'+
      (mine?'<span class="mine">in '+G[gid].name+'</span>':'')+
      '<div class="n">'+(i+1)+'</div>'+
      '<div class="say">'+o.say+'</div>'+
      '<div class="src">'+badges+'</div></div>';
 });
 w+='</div></article>';
 return w;
}

function commission(gid){
 var mark=COMM.mark;
 var main = COMM[gid] || mark;
 var rows='';
 ORDER.forEach(function(g){
   if(!COMM[g]) return;
   var star = (g==="mark");
   rows+='<a href="'+g+'.html#act-comm">'+
         '<b>'+(star?'★ ':'')+G[g].name+'</b><span>'+COMM[g].ref+(g===gid?' — shown above':'')+(star&&g!==gid?' — the Mark 16 commission':'')+'</span></a>';
 });
 return '<article class="callout" id="great-commission">'+
   '<h3>The Great Commission</h3>'+
   '<div class="verse">'+main.verse+'</div>'+
   '<span class="ref">'+main.ref+'</span>'+
   '<div class="alt">'+rows+'</div>'+
   '</article>';
}

function endings(gid){
 var c='<section class="act" id="act-ending"><span class="num">'+'✦'+'</span>'+
   '<div><h2>How the Four Gospels End</h2><p>One Lord, four closing notes — '+G[gid].name+'\'s is highlighted</p></div><span class="line"></span></section>'+
   '<div class="compare">';
 ORDER.forEach(function(g){
   var e=ENDINGS[g];
   c+='<div class="cmp'+(g===gid?' is-here':'')+'" style="--cc:'+e.cc+'">'+
      '<h4><span class="sy">'+G[g].sym+'</span> '+G[g].name+'</h4>'+
      '<div class="ref">'+e.ref+'</div><p>'+e.p+'</p>'+
      (g!==gid?'<div style="margin-top:.5rem"><a class="xlink" href="'+g+'.html#act-comm">open '+G[g].name+' →</a></div>':'')+
      '</div>';
 });
 c+='</div>';
 return c;
}

/* ---- helpers ---- */
function catKey(c){return c;}
function catLabel(c){return ({birth:"Birth & Life",ministry:"Ministry",miracle:"Miracle",teaching:"Teaching",journey:"Jerusalem",passion:"Final Days",cross:"The Cross",resurr:"Resurrection",comm:"Commission"})[c]||c;}
function roman(n){return ["","I","II","III","IV","V","VI","VII","VIII","IX","X"][n]||n;}

/* illuminated roundel per evangelist */
function symbolSVG(g){
 var col={matthew:"#3A4A8B",mark:"#8B3A3A",luke:"#2A7B6B",john:"#6B3A7B"}[g];
 return '<svg viewBox="0 0 120 120" width="100%" height="100%">'+
   '<circle cx="60" cy="60" r="56" fill="#FFFDF7" stroke="#C4872A" stroke-width="3"/>'+
   '<circle cx="60" cy="60" r="48" fill="none" stroke="'+col+'" stroke-width="1.5" stroke-dasharray="3 4"/>'+
   '<text x="60" y="78" text-anchor="middle" font-size="50">'+G[g].sym+'</text>'+
   '</svg>';
}

if(document.readyState!=="loading") build();
else document.addEventListener("DOMContentLoaded",build);
})();
