export interface TriviaCard {
  id: string;
  title: string;
  description: string;
  year: number;
  category: "history" | "sports" | "cinema" | "science" | "general";
  imageUrl?: string;
}

export const TRIVIA_DATA: TriviaCard[] = [
  // ==================== HISTORY & POLITICS ====================
  {
    id: "hist_1",
    title: "Indus Valley Civilization Peak",
    description: "Major urban centers like Harappa and Mohenjo-daro reached their peak of development.",
    year: -2500,
    category: "history"
  },
  {
    id: "hist_2",
    title: "Birth of Gautama Buddha",
    description: "Siddhartha Gautama, who went on to found Buddhism, was born in Lumbini.",
    year: -563,
    category: "history"
  },
  {
    id: "hist_3",
    title: "Alexander's Invasion of India",
    description: "Alexander the Great crossed the Indus and fought King Porus in the Battle of the Hydaspes.",
    year: -326,
    category: "history"
  },
  {
    id: "hist_4",
    title: "Founding of the Mauryan Empire",
    description: "Chandragupta Maurya established the empire with the help of his advisor Chanakya.",
    year: -321,
    category: "history"
  },
  {
    id: "hist_5",
    title: "Reign of Ashoka the Great",
    description: "Ashoka ascended the Mauryan throne and later embraced Buddhism after the Kalinga War.",
    year: -268,
    category: "history"
  },
  {
    id: "hist_6",
    title: "Accession of Kanishka",
    description: "The Kushan emperor Kanishka ascended the throne, beginning the Saka era.",
    year: 78,
    category: "history"
  },
  {
    id: "hist_7",
    title: "Golden Age of the Gupta Empire",
    description: "Chandragupta I ascended the throne, initiating a period of immense scientific and cultural growth.",
    year: 320,
    category: "history"
  },
  {
    id: "hist_8",
    title: "Completion of the Taj Mahal",
    description: "The magnificent white marble mausoleum commissioned by Shah Jahan was completed.",
    year: 1653,
    category: "history"
  },
  {
    id: "hist_9",
    title: "Battle of Plassey",
    description: "British East India Company forces under Robert Clive defeated the Nawab of Bengal, initiating British rule.",
    year: 1757,
    category: "history"
  },
  {
    id: "hist_10",
    title: "First War of Indian Independence",
    description: "Also known as the Sepoy Mutiny, this major uprising against British East India Company rule spread across North India.",
    year: 1857,
    category: "history"
  },
  {
    id: "hist_11",
    title: "Founding of the Indian National Congress",
    description: "The political party was founded in Bombay, initially representing elite opinion but later driving the independence movement.",
    year: 1885,
    category: "history"
  },
  {
    id: "hist_12",
    title: "Jallianwala Bagh Massacre",
    description: "British troops under General Dyer opened fire on a peaceful gathering in Amritsar, killing hundreds.",
    year: 1919,
    category: "history"
  },
  {
    id: "hist_13",
    title: "The Salt March (Dandi Satyagraha)",
    description: "Mahatma Gandhi walked 240 miles to the sea at Dandi to produce salt, launching the Civil Disobedience Movement.",
    year: 1930,
    category: "history"
  },
  {
    id: "hist_14",
    title: "Quit India Movement Launched",
    description: "Gandhi issued a call to 'Do or Die' demanding an immediate end to British rule in India.",
    year: 1942,
    category: "history"
  },
  {
    id: "hist_15",
    title: "India Gains Independence",
    description: "British rule ended and the nation of India was partitioned, creating India and Pakistan.",
    year: 1947,
    category: "history"
  },
  {
    id: "hist_16",
    title: "Adoption of the Constitution of India",
    description: "The constitution drafted by Dr. B.R. Ambedkar came into effect, establishing India as a Republic.",
    year: 1950,
    category: "history"
  },
  {
    id: "hist_17",
    title: "First General Elections of India",
    description: "The democratic nation held its first landmark general elections under universal adult suffrage.",
    year: 1951,
    category: "history"
  },
  {
    id: "hist_18",
    title: "Integration of Goa",
    description: "Indian armed forces executed Operation Vijay, ending 451 years of Portuguese colonial rule in Goa.",
    year: 1961,
    category: "history"
  },
  {
    id: "hist_19",
    title: "Signing of the Simla Agreement",
    description: "Indira Gandhi and Zulfikar Ali Bhutto signed a peace treaty following the Indo-Pakistani War of 1971.",
    year: 1972,
    category: "history"
  },
  {
    id: "hist_20",
    title: "Liberalization of the Indian Economy",
    description: "Facing a major balance of payments crisis, India launched structural reforms and opened its economy.",
    year: 1991,
    category: "history"
  },

  // ==================== SPORTS ====================
  {
    id: "sport_1",
    title: "First Olympic Hockey Gold",
    description: "India defeated the Netherlands in Amsterdam to secure its first-ever Olympic gold medal in field hockey.",
    year: 1928,
    category: "sports"
  },
  {
    id: "sport_2",
    title: "Inaugural Asian Games in New Delhi",
    description: "India hosted the very first Asian Games, welcoming athletes from across Asia.",
    year: 1951,
    category: "sports"
  },
  {
    id: "sport_3",
    title: "Milkha Singh's Rome Olympics Run",
    description: "The 'Flying Sikh' narrowly missed a podium finish, placing fourth in the historic 400m Olympic final.",
    year: 1960,
    category: "sports"
  },
  {
    id: "sport_4",
    title: "Krishnan's Wimbledon Semifinal",
    description: "Ramanathan Krishnan became the first Indian to reach the Men's Singles semifinals at Wimbledon.",
    year: 1960,
    category: "sports"
  },
  {
    id: "sport_5",
    title: "First Cricket World Cup Victory",
    description: "Kapil Dev's underdog Indian team defeated the dominant West Indies at Lord's, changing cricket forever.",
    year: 1983,
    category: "sports"
  },
  {
    id: "sport_6",
    title: "PT Usha's Olympic Heartbreak",
    description: "PT Usha finished fourth in the 400m hurdles at the Los Angeles Olympics, missing bronze by 1/100th of a second.",
    year: 1984,
    category: "sports"
  },
  {
    id: "sport_7",
    title: "India's First Chess Grandmaster",
    description: "At age 18, Viswanathan Anand earned the title, sparking a chess revolution in India.",
    year: 1988,
    category: "sports"
  },
  {
    id: "sport_8",
    title: "Leander Paes wins Olympic Bronze",
    description: "Paes broke a long Olympic medal dry-spell for India by winning bronze in Singles Tennis in Atlanta.",
    year: 1996,
    category: "sports"
  },
  {
    id: "sport_9",
    title: "Karnam Malleswari wins Olympic Medal",
    description: "Malleswari won bronze in Weightlifting in Sydney, becoming the first Indian woman to win an Olympic medal.",
    year: 2000,
    category: "sports"
  },
  {
    id: "sport_10",
    title: "Rathore's Olympic Shooting Silver",
    description: "Rajyavardhan Singh Rathore secured silver in Double Trap shooting in Athens, India's first individual silver.",
    year: 2004,
    category: "sports"
  },
  {
    id: "sport_11",
    title: "Inaugural ICC T20 World Cup Win",
    description: "India defeated Pakistan in a thrilling final in Johannesburg to win the first T20 World Cup.",
    year: 2007,
    category: "sports"
  },
  {
    id: "sport_12",
    title: "First Individual Olympic Gold",
    description: "Abhinav Bindra won gold in the 10m Air Rifle shooting event at the Beijing Olympics.",
    year: 2008,
    category: "sports"
  },
  {
    id: "sport_13",
    title: "Second Cricket World Cup Victory",
    description: "MS Dhoni hit a six to seal the final against Sri Lanka in Mumbai, winning the World Cup at home.",
    year: 2011,
    category: "sports"
  },
  {
    id: "sport_14",
    title: "Mary Kom's Olympic Boxing Bronze",
    description: "The flyweight boxer secured bronze at the London Olympics, cementing her legacy.",
    year: 2012,
    category: "sports"
  },
  {
    id: "sport_15",
    title: "PV Sindhu's Olympic Silver",
    description: "PV Sindhu became the first Indian badminton player to win an Olympic silver medal in Rio.",
    year: 2016,
    category: "sports"
  },
  {
    id: "sport_16",
    title: "Neeraj Chopra's Olympic Javelin Gold",
    description: "Chopra won India's first-ever Olympic gold medal in track and field in Tokyo.",
    year: 2021,
    category: "sports"
  },
  {
    id: "sport_17",
    title: "First Thomas Cup Badminton Title",
    description: "The Indian men's badminton team swept powerhouse Indonesia 3-0 to lift the historic trophy.",
    year: 2022,
    category: "sports"
  },
  {
    id: "sport_18",
    title: "Bopanna's Historic Grand Slam Win",
    description: "Rohan Bopanna won the Australian Open Men's Doubles, becoming the oldest male player to win a Major.",
    year: 2024,
    category: "sports"
  },

  // ==================== CINEMA & ART ====================
  {
    id: "cine_1",
    title: "Release of Raja Harishchandra",
    description: "Directed by Dadasaheb Phalke, this was India's first silent full-length feature film.",
    year: 1913,
    category: "cinema"
  },
  {
    id: "cine_2",
    title: "Release of Alam Ara",
    description: "Directed by Ardeshir Irani, this film was introduced as India's first talkie (sound film).",
    year: 1931,
    category: "cinema"
  },
  {
    id: "cine_3",
    title: "First Filmfare Awards",
    description: "Dilip Kumar won the first Best Actor award for 'Daag' at the newly instituted awards ceremony.",
    year: 1954,
    category: "cinema"
  },
  {
    id: "cine_4",
    title: "Release of Pather Panchali",
    description: "Directed by Satyajit Ray, this Bengali masterpiece put Indian cinema on the global map.",
    year: 1955,
    category: "cinema"
  },
  {
    id: "cine_5",
    title: "Mother India's Oscar Nomination",
    description: "Mehboob Khan's drama became the first Indian film nominated for the Academy Award for Best Foreign Language Film.",
    year: 1958,
    category: "cinema"
  },
  {
    id: "cine_6",
    title: "Release of Mughal-e-Azam",
    description: "K. Asif's historical epic was released, becoming a milestone of artistic and scale grandeur.",
    year: 1960,
    category: "cinema"
  },
  {
    id: "cine_7",
    title: "Dadasaheb Phalke Award Instituted",
    description: "The government created the award to recognize outstanding contributions to the growth of Indian cinema.",
    year: 1969,
    category: "cinema"
  },
  {
    id: "cine_8",
    title: "Release of Sholay",
    description: "Ramesh Sippy's blockbuster 'curry western' was released, running for years in theatres.",
    year: 1975,
    category: "cinema"
  },
  {
    id: "cine_9",
    title: "Bhanu Athaiya's Oscar Win",
    description: "Athaiya won India's first Academy Award for Costume Design in Richard Attenborough's film Gandhi.",
    year: 1983,
    category: "cinema"
  },
  {
    id: "cine_10",
    title: "Satyajit Ray's Lifetime Achievement Oscar",
    description: "The master director received an Honorary Academy Award on his deathbed in Kolkata.",
    year: 1992,
    category: "cinema"
  },
  {
    id: "cine_11",
    title: "Release of Dilwale Dulhania Le Jayenge",
    description: "Aditya Chopra's film was released, going on to run continuously for over 25 years in Mumbai.",
    year: 1995,
    category: "cinema"
  },
  {
    id: "cine_12",
    title: "Lagaan's Oscar Nomination",
    description: "Aamir Khan's sports drama reached the final five nomination list for Best Foreign Language Film.",
    year: 2002,
    category: "cinema"
  },
  {
    id: "cine_13",
    title: "Rahman's Double Oscar Win",
    description: "A.R. Rahman won two Academy Awards for Best Original Score and Best Original Song for Slumdog Millionaire.",
    year: 2009,
    category: "cinema"
  },
  {
    id: "cine_14",
    title: "Release of Baahubali: The Conclusion",
    description: "SS Rajamouli's epic fantasy broke records, becoming the highest-grossing film in India.",
    year: 2017,
    category: "cinema"
  },
  {
    id: "cine_15",
    title: "Naatu Naatu wins Oscar",
    description: "The energetic Telugu track from RRR won the Academy Award for Best Original Song.",
    year: 2023,
    category: "cinema"
  },
  {
    id: "cine_16",
    title: "The Elephant Whisperers wins Oscar",
    description: "Directed by Kartiki Gonsalves, this film won the Academy Award for Best Documentary Short Film.",
    year: 2023,
    category: "cinema"
  },

  // ==================== SCIENCE & TECHNOLOGY ====================
  {
    id: "sci_1",
    title: "Discovery of the Raman Effect",
    description: "Physicist C.V. Raman discovered the scattering of light, earning him a Nobel Prize in 1930.",
    year: 1928,
    category: "science"
  },
  {
    id: "sci_2",
    title: "Tata Institute of Fundamental Research (TIFR)",
    description: "Homi J. Bhabha founded the institute to spearhead nuclear physics research in India.",
    year: 1945,
    category: "science"
  },
  {
    id: "sci_3",
    title: "First IIT Established in Kharagpur",
    description: "India's first Indian Institute of Technology was founded, training generations of world-class engineers.",
    year: 1951,
    category: "science"
  },
  {
    id: "sci_4",
    title: "Bhabha Atomic Research Centre Founded",
    description: "The nuclear research facility (initially AEET) was established in Trombay, Mumbai.",
    year: 1954,
    category: "science"
  },
  {
    id: "sci_5",
    title: "Founding of ISRO",
    description: "The Indian Space Research Organisation was created under Vikram Sarabhai to manage space activities.",
    year: 1969,
    category: "science"
  },
  {
    id: "sci_6",
    title: "Smiling Buddha Nuclear Test",
    description: "India successfully conducted its first underground nuclear test at Pokhran, Rajasthan.",
    year: 1974,
    category: "science"
  },
  {
    id: "sci_7",
    title: "Aryabhata Satellite Launch",
    description: "India's first indigenous satellite, named after the ancient astronomer, was launched into space.",
    year: 1975,
    category: "science"
  },
  {
    id: "sci_8",
    title: "First Indian in Space",
    description: "Rakesh Sharma traveled aboard the Soviet Soyuz T-11 spacecraft and famously described India as 'Saare Jahan Se Achha'.",
    year: 1984,
    category: "science"
  },
  {
    id: "sci_9",
    title: "PARAM 8000 Supercomputer",
    description: "C-DAC built India's first indigenously designed supercomputer, defying tech export bans.",
    year: 1991,
    category: "science"
  },
  {
    id: "sci_10",
    title: "Chandrayaan-1 Moon Mission",
    description: "India's first lunar mission was launched, discovering water molecules on the Moon's surface.",
    year: 2008,
    category: "science"
  },
  {
    id: "sci_11",
    title: "Mars Orbiter Mission (Mangalyaan) Arrival",
    description: "India became the first nation to reach Martian orbit on its maiden attempt, doing so at a fraction of standard cost.",
    year: 2014,
    category: "science"
  },
  {
    id: "sci_12",
    title: "India declared Polio-Free",
    description: "Following a massive immunisation drive, the World Health Organization certified India free of wild polio.",
    year: 2014,
    category: "science"
  },
  {
    id: "sci_13",
    title: "Record Launch of 104 Satellites",
    description: "ISRO's PSLV-C37 successfully put 104 satellites into orbit in a single launch, breaking world records.",
    year: 2017,
    category: "science"
  },
  {
    id: "sci_14",
    title: "Chandrayaan-3 Lands on Moon",
    description: "India became the first country to land a spacecraft (Vikram and Pragyan) near the Lunar South Pole.",
    year: 2023,
    category: "science"
  },
  {
    id: "sci_15",
    title: "Aditya-L1 Solar Mission Launch",
    description: "ISRO launched its first dedicated scientific mission to study the Sun, placing it in halo orbit.",
    year: 2023,
    category: "science"
  },

  // ==================== GENERAL & CULTURE ====================
  {
    id: "gen_1",
    title: "First Telegraph Line Opened",
    description: "The first experimental electric telegraph line began operating between Calcutta and Diamond Harbour.",
    year: 1851,
    category: "general"
  },
  {
    id: "gen_2",
    title: "First Passenger Train Runs",
    description: "India's first passenger train traveled 34 km from Bombay's Bori Bunder to Thane.",
    year: 1853,
    category: "general"
  },
  {
    id: "gen_3",
    title: "Tagore's Nobel Prize in Literature",
    description: "Rabindranath Tagore became the first non-European Nobel laureate for his collection Gitanjali.",
    year: 1913,
    category: "general"
  },
  {
    id: "gen_4",
    title: "JRD Tata's Commercial Flight",
    description: "J.R.D. Tata piloted the inaugural mail flight from Karachi to Bombay, founding Tata Airlines (later Air India).",
    year: 1932,
    category: "general"
  },
  {
    id: "gen_5",
    title: "Nationalisation of Banks",
    description: "Prime Minister Indira Gandhi nationalised 14 major private commercial banks in a landmark reform.",
    year: 1969,
    category: "general"
  },
  {
    id: "gen_6",
    title: "Wildlife Protection Act Enacted",
    description: "The Indian Parliament enacted this landmark law to protect wild animals, birds, and plants.",
    year: 1972,
    category: "general"
  },
  {
    id: "gen_7",
    title: "Introduction of PIN Code System",
    description: "The 6-digit Postal Index Number was introduced to streamline mail sorting across diverse regions.",
    year: 1972,
    category: "general"
  },
  {
    id: "gen_8",
    title: "Mother Teresa's Nobel Peace Prize",
    description: "The founder of the Missionaries of Charity was awarded the peace prize for her work with the poor in Calcutta.",
    year: 1979,
    category: "general"
  },
  {
    id: "gen_9",
    title: "Doordarshan's National Color Telecast",
    description: "National television broadcasts in color began, launching coinciding with the Asian Games.",
    year: 1982,
    category: "general"
  },
  {
    id: "gen_10",
    title: "First Metro Starts in Calcutta",
    description: "India's first underground rapid transit system began running operations in Kolkata.",
    year: 1984,
    category: "general"
  },
  {
    id: "gen_11",
    title: "Amartya Sen wins Nobel Prize",
    description: "Sen was awarded the Nobel Memorial Prize in Economic Sciences for his contributions to welfare economics.",
    year: 1998,
    category: "general"
  },
  {
    id: "gen_12",
    title: "Taj Mahal named a New Wonder",
    description: "Following a worldwide poll, the Agra monument was declared one of the New Seven Wonders of the World.",
    year: 2007,
    category: "general"
  },
  {
    id: "gen_13",
    title: "Opening of Bandra-Worli Sea Link",
    description: "The iconic cable-stayed bridge in Mumbai was opened to the public, easing city transit.",
    year: 2009,
    category: "general"
  },
  {
    id: "gen_14",
    title: "Mega Kumbh Mela in Prayagraj",
    description: "The Hindu pilgrimage gathered a record estimated 120 million people, the largest human gathering in history.",
    year: 2013,
    category: "general"
  }
];
