TRUNCATE TABLE
    comment_reactions, news_reactions, news_visits,
    comments, news_tags, tags, news, categories, users
RESTART IDENTITY CASCADE;

INSERT INTO users (email, name, surname, user_type, status, password) VALUES
    ('admin@raf.rs',  'Admin',  'Admin',     'ADMIN',   TRUE,
     '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918'),
    ('petar@raf.rs',  'Petar',  'Petrovic',  'CREATOR', TRUE,
     '20d3ebb9526c1fd137189ffe7eebabfb0505ac1e553875a46db6ca23fdf68017'),
    ('marko@raf.rs',  'Marko',  'Markovic',  'CREATOR', TRUE,
     'f18d6b99c2220efb480af983c37ddd65ba0262fe72b55e3ea67d4288798c1374'),
    ('jelena@raf.rs', 'Jelena', 'Jovanovic', 'CREATOR', FALSE,
     '35f507742b73e2fcfe6aca06ccb0152d88dd91a677f6ba3585393e5c326262ba');

INSERT INTO categories (name, description) VALUES
    ('Auto-moto',   'Novi modeli, testovi, automobilski sajmovi i saobracajni propisi.'),
    ('Ekonomija',   'Berza, kursevi, kompanije, energetika, makroekonomski trendovi.'),
    ('Hronika',     'Crna hronika, sudski procesi, saobracajke i vanredne situacije.'),
    ('Kultura',     'Filmovi, muzika, knjige, izlozbe i kulturni dogadjaji u zemlji i svetu.'),
    ('Lifestyle',   'Moda, gastronomija, dizajn, hobiji i savremeni nacin zivota.'),
    ('Nauka',       'Istrazivanja, otkrica, astronomija, ekologija, klimatske promene.'),
    ('Politika',    'Domace i strane politicke vesti, izbori, vlada, parlament.'),
    ('Putovanja',   'Destinacije, vodici, putopisi, saveti za putnike.'),
    ('Sport',       'Najnovije sportske vesti, prenosi meceva, intervjui sa sportistima i analize.'),
    ('Tehnologija', 'Tehnoloske vesti, recenzije gadgeta, inovacije i vestacka inteligencija.'),
    ('Zabava',      'Estrada, poznate licnosti, rijaliti, viralni sadrzaj.'),
    ('Zdravlje',    'Medicinski saveti, ishrana, prevencija bolesti, mentalno zdravlje.');

INSERT INTO news (title, text, published_time, number_of_visits, author_id, category_id) VALUES
    -- ZDRAVLJE
    ('Nova studija o uticaju Mediteranske ishrane na srce',
     'Veliko istrazivanje pokazalo je da Mediteranska ishrana, bogata maslinovim uljem, ribom, povrcem i orasastim plodovima, smanjuje rizik od kardiovaskularnih bolesti za cak 30 odsto.',
     CURRENT_TIMESTAMP - INTERVAL '1 day', 0, 2, 12),
    ('Vakcina protiv malarije pokazala 90% efikasnosti u Africi',
     'Klinicka ispitivanja nove vakcine u Gani i Burkini Faso potvrdila su izuzetnu efikasnost, sto bi moglo da promeni tok borbe protiv malarije u sub-saharskoj Africi.',
     CURRENT_TIMESTAMP - INTERVAL '3 days', 0, 3, 12),
    ('WHO upozorava na rast otpornosti bakterija na antibiotike',
     'Svetska zdravstvena organizacija objavila je novi izvestaj koji pokazuje da rezistentne bakterije postaju ozbiljna globalna pretnja.',
     CURRENT_TIMESTAMP - INTERVAL '7 days', 0, 2, 12),
    ('Pet jednostavnih navika koje produzavaju zivot za 10 godina',
     'Lekari preporucuju redovan san, fizicku aktivnost, balansiranu ishranu, drustvenu povezanost i kontrolu stresa kao kljucne faktore dugovecnosti.',
     CURRENT_TIMESTAMP - INTERVAL '10 days', 0, 3, 12),
    ('Mentalno zdravlje mladih u krizi - studija iz Stockholma',
     'Istrazivaci sa Karolinska Instituta tvrde da je broj mladih sa anksioznim poremecajima u porastu, a osnovni krivac je preterana upotreba drustvenih mreza.',
     CURRENT_TIMESTAMP - INTERVAL '14 days', 0, 2, 12),
    ('Probiotici i njihova prava uloga u digestiji - mit ili realnost?',
     'Strucnjaci ukazuju da samo odredjeni sojevi probiotika imaju klinicki potvrdjeno dejstvo, dok mnogi suplementi na trzistu nemaju naucne osnove.',
     CURRENT_TIMESTAMP - INTERVAL '20 days', 0, 3, 12),

    -- SPORT
    ('Djokovic osvojio Australian Open',
     'Novak Djokovic je u dramaticnom finalu pobedio Karlosa Alkaraza rezultatom 3:2 i osvojio svoj jedanaesti pehar u Melburnu. Mec je trajao gotovo pet sati a publika je bila na nogama do poslednje lopte.',
     CURRENT_TIMESTAMP - INTERVAL '2 days', 0, 2, 9),
    ('Crvena Zvezda u finalu Evrolige',
     'Kosarkasi Crvene Zvezde plasirali su se u finale Evrolige posle senzacionalne pobede nad Real Madridom. Najefikasniji u redovima crveno-belih bio je kapiten sa 28 poena.',
     CURRENT_TIMESTAMP - INTERVAL '5 days', 0, 3, 9),
    ('Partizan na korak od titule u ABA ligi',
     'Crno-beli su slavili u dramaticnoj utakmici protiv Megabasket-a i sada su samo jednu pobedu udaljeni od osvajanja regionalnog prvenstva.',
     CURRENT_TIMESTAMP - INTERVAL '8 days', 0, 2, 9),
    ('Verstappen osvojio cetvrtu uzastopnu titulu u F1',
     'Holandjanin je u poslednjoj trci sezone obezbedio sampionsku titulu, ucvrstivsi svoju dominaciju u Formuli 1 poslednjih godina.',
     CURRENT_TIMESTAMP - INTERVAL '12 days', 0, 3, 9),
    ('Atletski Mundijal: zlatne medalje za srpsku stafetu',
     'Srpska atletska reprezentacija osvojila je istorijsko zlato u stafeti 4x100 metara na Svetskom prvenstvu u atletici.',
     CURRENT_TIMESTAMP - INTERVAL '18 days', 0, 2, 9),

    -- POLITIKA
    ('Parlament usvojio novi zakon o energetici',
     'Skupstina je sa 167 glasova ZA usvojila novi zakon koji ce regulisati cene struje i prirodnog gasa u narednih pet godina.',
     CURRENT_TIMESTAMP - INTERVAL '1 day', 0, 1, 7),
    ('Sastanak EU lidera u Briselu - dogovor o sankcijama',
     'Lideri Evropske unije postigli su dogovor o novom paketu mera, ukljucujuci dodatne sankcije protiv pojedinih sektora.',
     CURRENT_TIMESTAMP - INTERVAL '4 days', 0, 2, 7),
    ('Predsednik najavio rebalans budzeta',
     'Tokom obracanja naciji, predsednik je najavio da ce vlada predloziti rebalans budzeta sa fokusom na infrastrukturu i obrazovanje.',
     CURRENT_TIMESTAMP - INTERVAL '9 days', 0, 3, 7),
    ('Lokalni izbori u Beogradu - izlaznost ispod proseka',
     'Prema preliminarnim podacima RIK-a, izlaznost na lokalnim izborima u glavnom gradu bila je oko 38 odsto, znatno ispod ocekivanog proseka.',
     CURRENT_TIMESTAMP - INTERVAL '16 days', 0, 1, 7),

    -- EKONOMIJA
    ('NBS zadrzao referentnu kamatnu stopu na 5.75%',
     'Narodna banka Srbije saopstila je da ce referentna kamatna stopa ostati nepromenjena na nivou od 5.75 odsto.',
     CURRENT_TIMESTAMP - INTERVAL '2 days', 0, 3, 2),
    ('Dolar pao na najnize vrednosti u poslednjih sest meseci',
     'Americka valuta zabelezila je pad u odnosu na evro nakon objavljivanja podataka o inflaciji koji su bili nizi od ocekivanih.',
     CURRENT_TIMESTAMP - INTERVAL '6 days', 0, 2, 2),
    ('EPS objavio rekordnu zaradu u proteklom kvartalu',
     'Elektroprivreda Srbije objavila je trijedmesecne rezultate koji ukazuju na znacajan rast prihoda u odnosu na isti period prosle godine.',
     CURRENT_TIMESTAMP - INTERVAL '13 days', 0, 1, 2),

    -- TEHNOLOGIJA
    ('OpenAI predstavio GPT-6',
     'OpenAI je danas zvanicno predstavio novi GPT-6 model koji prema internim testovima nadmasuje sve prethodne verzije u zadacima rezonovanja, pisanja koda i razumevanja konteksta. Dostupan je za sve Plus korisnike.',
     CURRENT_TIMESTAMP - INTERVAL '10 days', 0, 2, 10),
    ('Apple iPhone 17 stigao u prodaju',
     'Apple je danas zvanicno pustio u prodaju novi iPhone 17 sa unapredjenim A19 cipom, boljom kamerom i dramaticnim redizajnom kucista. Cene pocinju od 999 dolara za osnovni model.',
     CURRENT_TIMESTAMP - INTERVAL '1 day', 0, 1, 10),
    ('Microsoft predstavio nov Surface laptop sa ARM cipom',
     'Microsoft je predstavio sledecu generaciju Surface laptopa sa Snapdragon X procesorom, koji obecava do 22 sata trajanja baterije.',
     CURRENT_TIMESTAMP - INTERVAL '5 days', 0, 3, 10),

    -- HRONIKA
    ('Saobracajna nesreca na A1 - troje povredjenih',
     'U sudaru tri vozila na autoputu A1 kod naplatne rampe, troje ljudi je zadobilo lakse povrede. Saobracaj je bio u prekidu vise od dva sata.',
     CURRENT_TIMESTAMP - INTERVAL '1 day', 0, 1, 3),
    ('Policija razbila kriminalnu grupu u Beogradu',
     'U koordiniranoj akciji policija je uhapsila sest osoba osumnjicenih za organizovani kriminal. Zaplenjeno je oruzje i znacajna kolicina droge.',
     CURRENT_TIMESTAMP - INTERVAL '4 days', 0, 2, 3),

    -- KULTURA
    ('Festival u Kanu zatvorio vrata',
     'Sedamdeset deveto izdanje Filmskog festivala u Kanu zvanicno je zatvoreno dodelom Zlatne palme. Pobednicki film "Tisina nakon oluje" rezisera Pjera Lefevra dobio je ovacije publike.',
     CURRENT_TIMESTAMP - INTERVAL '15 days', 0, 3, 4),
    ('Nova knjiga Harukija Murakamija',
     'Japanski pisac Haruki Murakami objavio je nov roman pod nazivom "Grad mecaka i njegova zid". Knjiga je vec tri nedelje na vrhu lista prodaje u Japanu, a prevodi se ocekuju do kraja godine.',
     CURRENT_TIMESTAMP - INTERVAL '40 days', 0, 2, 4),

    -- ZABAVA
    ('Domaca filmska premijera "Beogradska Bajka" odusevila publiku',
     'Premijera novog filma rezisera Marka Markovica okupila je veliki broj zvanica i kritike su uglavnom pozitivne. Film ulazi u redovnu distribuciju sledeceg vikenda.',
     CURRENT_TIMESTAMP - INTERVAL '3 days', 0, 1, 11);

INSERT INTO tags (value) VALUES
    ('tenis'), ('djokovic'),
    ('kosarka'), ('evroliga'),
    ('ai'), ('openai'),
    ('apple'), ('iphone'),
    ('film'), ('festival'),
    ('knjiga'), ('murakami'),
    ('sport'), ('tehnologija'), ('kultura');

-- ------------------------------------------------------------
-- News_tags - povezivanje vesti i tagova
-- (samo za vesti 1-6 koje su iz originalnog seed-a; ostale bez tagova)
-- ID-evi vesti: Zdravlje 1-6, Sport 7-11, Politika 12-15,
--               Ekonomija 16-18, Tehnologija 19-21,
--               Hronika 22-23, Kultura 24-25, Zabava 26
-- ------------------------------------------------------------
INSERT INTO news_tags (news_id, tag_id) VALUES

    (7, 1), (7, 2), (7, 13),

    (8, 3), (8, 4), (8, 13),

    (19, 5), (19, 6), (19, 14),

    (20, 7), (20, 8), (20, 14),

    (24, 9), (24, 10), (24, 15),

    (25, 11), (25, 12), (25, 15);


INSERT INTO news_visits (news_id, session_id, visited_at) VALUES

    (7, 'session-alice', CURRENT_TIMESTAMP - INTERVAL '1 day'),
    (7, 'session-bob',   CURRENT_TIMESTAMP - INTERVAL '1 day'),
    (7, 'session-carol', CURRENT_TIMESTAMP - INTERVAL '12 hours'),

    (19, 'session-alice', CURRENT_TIMESTAMP - INTERVAL '5 days'),
    (19, 'session-bob',   CURRENT_TIMESTAMP - INTERVAL '4 days'),

    (20, 'session-alice', CURRENT_TIMESTAMP - INTERVAL '3 hours'),
    (20, 'session-bob',   CURRENT_TIMESTAMP - INTERVAL '2 hours'),
    (20, 'session-carol', CURRENT_TIMESTAMP - INTERVAL '1 hour'),
    (20, 'session-dave',  CURRENT_TIMESTAMP - INTERVAL '30 minutes'),

    (8, 'session-alice', CURRENT_TIMESTAMP - INTERVAL '3 days'),

    (24, 'session-bob',  CURRENT_TIMESTAMP - INTERVAL '14 days'),

    (1, 'session-alice', CURRENT_TIMESTAMP - INTERVAL '20 hours'),
    (1, 'session-bob',   CURRENT_TIMESTAMP - INTERVAL '15 hours'),

    (12, 'session-carol', CURRENT_TIMESTAMP - INTERVAL '5 hours');


UPDATE news SET number_of_visits = (
    SELECT COUNT(*) FROM news_visits WHERE news_visits.news_id = news.news_id
);

INSERT INTO news_reactions (news_id, session_id, reaction_type) VALUES
    (7,  'session-alice', 'LIKE'),
    (7,  'session-bob',   'LIKE'),
    (7,  'session-carol', 'DISLIKE'),
    (19, 'session-alice', 'LIKE'),
    (19, 'session-bob',   'LIKE'),
    (20, 'session-alice', 'LIKE'),
    (20, 'session-bob',   'DISLIKE'),
    (20, 'session-carol', 'LIKE'),
    (8,  'session-dave',  'LIKE'),
    (1,  'session-alice', 'LIKE'),
    (1,  'session-bob',   'LIKE');

INSERT INTO comments (news_id, author_name, text, created_at) VALUES
    (7, 'Marko iz Beograda',  'Bravo Nole, najveci svih vremena!',                 CURRENT_TIMESTAMP - INTERVAL '1 day'),
    (7, 'Ana',                'Kakav mec, gledala sam do tri ujutru.',             CURRENT_TIMESTAMP - INTERVAL '20 hours'),
    (7, 'Aleksandar',         'Alkaraz ce mu se osvetiti u Parizu.',               CURRENT_TIMESTAMP - INTERVAL '5 hours'),

    (19, 'devjs',             'GPT-6 izgleda zaista impresivno na demoima.',       CURRENT_TIMESTAMP - INTERVAL '4 days'),
    (19, 'skepticno',         'Verujem tek kad probam, marketing je uvek prejak.', CURRENT_TIMESTAMP - INTERVAL '3 days'),

    (20, 'Tehno fan',         'Cena je strasna, ali iPhone je iPhone.',            CURRENT_TIMESTAMP - INTERVAL '1 hour'),

    (1, 'Dijetolog',          'Mediteranska ishrana je zaista odlican izbor.',     CURRENT_TIMESTAMP - INTERVAL '15 hours');

INSERT INTO comment_reactions (comment_id, session_id, reaction_type) VALUES
    (1, 'session-bob',   'LIKE'),
    (1, 'session-carol', 'LIKE'),
    (2, 'session-alice', 'LIKE'),
    (4, 'session-carol', 'LIKE'),
    (5, 'session-bob',   'DISLIKE'),
    (6, 'session-alice', 'DISLIKE'),
    (7, 'session-bob',   'LIKE');
