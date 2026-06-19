import { SpeakingTopic } from "../types";

const categoryBaseTopics: Record<string, string[]> = {
  "General": [
    "What is your absolute favorite childhood memory?",
    "If you could have dinner with any historical figure, who would it be?",
    "How do you prefer to spend a rainy afternoon?",
    "What are the qualities of a truly good friend?",
    "What is the most beautiful place you have ever seen?",
    "How has a book or a movie changed your perspective on life?",
    "What does success look like to you personally?",
    "If you had the chance to learn any musical instrument today, what would it be?",
    "What are three things you are most grateful for in your life?",
    "How does a positive mindset impact your physical health?",
  ],
  "Technology": [
    "Should artificial intelligence be regulated, or left to free innovation?",
    "Are smartphones creating a more connected or a more isolated society?",
    "What tech invention from the last 20 years could you not live without?",
    "How will quantum computing change the security landscape?",
    "What are the pros and cons of working in the virtual metaverse?",
    "Do you believe that social media algorithms are ethical?",
    "Will self-driving cars improve safety or increase transportation stress?",
    "How will blockchain technology shape future economies?",
    "What are your thoughts on neural interfaces and brain-computer chips?",
    "Is technology making the current generation of students smarter or lazier?"
  ],
  "Education": [
    "Should traditional grades be abolished in favor of skills-based portfolios?",
    "Is a university degree still a necessity for a successful modern career?",
    "How can classrooms be redesigned to foster critical thinking?",
    "What is the role of play in early childhood educational settings?",
    "Should financial literacy and tax filing be mandatory high school subjects?",
    "Does virtual schooling offer the same quality as in-person education?",
    "How does learning a second language alter cognitive brain patterns?",
    "What are the benefits of lifelong learning outside formal institutions?",
    "Should schools teach children how to recognize fake news online?",
    "How do standardized exams affect the mental health of students?"
  ],
  "Lifestyle": [
    "What is your daily routine and how does it optimize your energy?",
    "Do you practice mindfulness or meditation? Why or why not?",
    "How do you balance professional ambitions with local personal health?",
    "What does a 'minimalist lifestyle' mean to you, and is it achievable?",
    "How does the structure of your physical home affect your mental peace?",
    "What is the importance of hobbies in dealing with workplace burnout?",
    "How do you stay hydrated and energized during busy seasons?",
    "Should people strive to wake up early, or embrace night-owl rhythms?",
    "What is the impact of fast-fashion culture on our current environment?",
    "How do you maintain long-distance or high-school friendships?"
  ],
  "Travel": [
    "If you could move to any country tomorrow, where would you go?",
    "What is your ultimate travel checklist and luggage strategy?",
    "How does solo travel differ from traveling with a group?",
    "What has been your most adventurous travel experience so far?",
    "Does traveling to new places make people more open-minded?",
    "What is the most underrated travel destination in your country?",
    "How can we practice sustainable and ocean-friendly ecotourism?",
    "Would you prefer a relaxing tropical beach or a busy city tour?",
    "What is the best way to immerse yourself in a brand new culture?",
    "Have you ever experienced severe culture shock? How did you cope?"
  ],
  "Business": [
    "What are the key differences between a manager and a true leader?",
    "Is a remote-work setup highly productive for large scale businesses?",
    "How do startups build a strong, healthy brand identity from scratch?",
    "What is the ethical responsibility of companies regarding clean energy?",
    "How should businesses handle customer support complaints effectively?",
    "What is the future of retail stores in an e-commerce-heavy world?",
    "How does high employee turnover affect business culture and growth?",
    "Would you prefer to build your own startup or climb the corporate ladder?",
    "How important is professional networking in finding career stability?",
    "What are the major challenges faced by small family-owned businesses?"
  ],
  "Food": [
    "What is the ultimate comfort food you always turn to?",
    "Should schools provide completely free, chef-cooked lunches for students?",
    "How does culture influence the spices and ingredients used in recipes?",
    "What are your opinions on meat substitutes and laboratory-grown food?",
    "Is cooking a necessary life skill that every adult should master?",
    "How do popular cooking shows change the way people prepare dinner?",
    "What is the most exotic food item you have ever tasted?",
    "Should sugary drinks and sodas carry health warning labels like cigarettes?",
    "What is the secret recipe or cooking style that represents your family?",
    "How does eating meals together with family strengthen social connections?"
  ],
  "Entertainment": [
    "Will streaming platforms completely eliminate traditional cinema theaters?",
    "What is your all-time favorite television series, and what makes it special?",
    "How has viral short-form music affected classical songwriting standards?",
    "Should video games be classified as an official professional sport?",
    "How do blockbuster movies impact local and global fashion trends?",
    "What is the value of live theater and musical performances today?",
    "How does listening to ambient lo-fi music influence study concentration?",
    "What are the pros and cons of celebrity influencer endorsements?",
    "Do you prefer reading fantasy novels or watching historical documentaries?",
    "How do you feel about movie endings that are left totally ambiguous?"
  ],
  "Debate": [
    "Should public transportation in large cities be absolutely free of cost?",
    "Is colonizing Mars a worthy human scientific goal, or a waste of funds?",
    "Should animal testing for cosmetic industries be banned globally?",
    "Are eBooks superior to physical paper books for studying purposes?",
    "Should voting in high stakes democratic elections be legally mandatory?",
    "Are online avatars and digital identities replacing face-to-face greetings?",
    "Should homework be eliminated entirely for preschool and primary students?",
    "Is artificial intelligence art a form of true, soulful creativity?",
    "Should cellphones be locked away in lockers during middle-school classes?",
    "Should humans transition entirely to clean renewable energy grids?"
  ],
  "Storytelling": [
    "Tell a quick, playful story about an unexpected package at your door.",
    "Describe an imaginary encounter with a friendly koi fish that speaks English.",
    "Draft a script about a time-traveler who accidentally misplaced their keys.",
    "Share a story about finding an old, dusty notebook in an attic closet.",
    "Create a short story where a rare four-leaf clover grants a tiny, unexpected wish.",
    "Narrate a funny situation in which a puppy pretends to be a computer programmer.",
    "Imagine you woke up on a cozy island of floating pastel clouds.",
    "Tell a story about a mysterious bookstore that only opens during full moons.",
    "Describe a day in the life of a wizard who works at a regular coffee shop.",
    "Share a whimsical tale of a wind chime that sings bedtime lullabies."
  ],
  "Interview": [
    "Why do you believe you are the absolute best candidate for this position?",
    "Describe a challenging situation at your previous workspace and how you behaved.",
    "Where do you see your professional career heading in the next five years?",
    "What are your greatest professional strengths, and how do you apply them?",
    "How do you prioritize multiple urgent deadlines in a busy team setup?",
    "Can you share an instance where you worked collaboratively with a difficult partner?",
    "What are your salary expectations, and how do you justify your pricing?",
    "Why do you want to work for our specific startup instead of competitors?",
    "How do you handle constructive criticism and feedback from managers?",
    "Tell me about a project that you successfully managed from start to finish."
  ],
  "One Minute Pitch": [
    "Pitch an app that translates what puppies are barking about in real time.",
    "Give a 60-second pitch for self-cooking mugs that keep soup hot forever.",
    "Convince investors to support a floating organic garden in city skylines.",
    "Pitch a specialized alarm clock that wakes you with fresh-brewed matcha tea.",
    "Sell me a magic notebook that converts messy scribbles into clean typography.",
    "Pitch an eco-friendly service storing organic rain-water for indoor plants.",
    "Give an elegant pitch for an audio player that mimics cozy forest noises.",
    "Pitch a rental service for premium mechanical keyboards and keycaps.",
    "Convince me to buy a miniature smart terrarium that adjusts its own weather.",
    "Pitch an app that gamifies morning stretching with cute koi avatars."
  ],
  "Explain Like I'm 5": [
    "Explain how the internet works and how photos travel through thin air.",
    "Why is the sky blue instead of green, purple, or beautiful yellow?",
    "How do giant heavy metal airplanes manage to fly high above the clouds?",
    "Explain what inflation is and why we can't just print infinite money.",
    "How do plants drink water from the dirt and use sunlight to make food?",
    "Explain how a regular microwave heats up leftovers in just a minute.",
    "What are stars, and why do they twinkle like tiny light bulbs far away?",
    "How does a spider spin structured webs to catch flies without getting stuck?",
    "Explain how computers think and run games using only ones and zeros.",
    "Why do we sleep and dream when our bodies are tired at night?"
  ],
  "Hot Takes": [
    "Pineapple on pizza is the absolute supreme pizza flavor. Discuss.",
    "Social media has completely ruined the art of modern storytelling.",
    "Breakfast is actually the most skippable and overrated meal of the day.",
    "Staying in a cozy cabin is ten times better than staying in a luxury hotel.",
    "Physical paper books are highly inefficient and digital reading is superior.",
    "We should replace all text emojis with hand-drawn clover decorations.",
    "Watching movies at double-speed is the best way to consume entertainment.",
    "Cold coffee is superior to warm coffee, regardless of the winter season.",
    "The concept of professional dress codes in offices is totally outdated.",
    "Syllabuses should be taught completely via voice recordings instead of reading."
  ],
  "Creative Thinking": [
    "If colors had distinct sounds, what would the color green sound like?",
    "How would a city look if all personal transport vehicles flew like bees?",
    "If you could combine any two animal breeds, what would they be and why?",
    "How would society operate if clocks tracked energy levels instead of hours?",
    "If you were a cloud, what kind of weather would you love to create most?",
    "Design a playground using only recycled clover stems and soft sand.",
    "What would the world be like if humans hibernated all winter long?",
    "If we built buildings in spiral shell shapes, how would that alter home plans?",
    "How would trees communicate if they had access to a digital network?",
    "If memories could be saved in glass jars, which one of yours would you seal?"
  ]
};

const difficulties: ('Easy' | 'Medium' | 'Hard')[] = ["Easy", "Medium", "Hard"];

export function getMetadataForCategory(category: string): { angles: string[]; framework: string; frameworkHelper: string[] } {
  switch (category) {
    case "Technology":
      return {
        framework: "PREP",
        angles: ["As a software engineer", "As a non-tech general user", "As an optimistic futurist", "As a cautious ethics critic"],
        frameworkHelper: [
          "P (Point): State your primary opinion about this technology.",
          "R (Reason): Share why you hold this view (efficiency, cost, safety).",
          "E (Example): Give a clear, daily life example of this tech in action.",
          "P (Point): End with a 1-sentence prediction or takeaway."
        ]
      };
    case "Education":
      return {
        framework: "PREP",
        angles: ["As a student", "As an educator", "As a parent", "As a policy creator"],
        frameworkHelper: [
          "P (Point): Answer if this educational method is effective.",
          "R (Reason): Cite mental well-being or knowledge retention factors.",
          "E (Example): Mention a real classroom or online learning story.",
          "P (Point): Summarize how school systems should adapt."
        ]
      };
    case "Lifestyle":
      return {
        framework: "STAR",
        angles: ["As a health practitioner", "As an active professional", "As a simple minimalist", "As a student"],
        frameworkHelper: [
          "S (Situation): Describe a personal routine or lifestyle challenge.",
          "T (Task): Identify the goal or habit (e.g., balance, meditation).",
          "A (Action): State the specific physical or mental actions taken.",
          "R (Result): Describe the positive results and how it feels."
        ]
      };
    case "Travel":
      return {
        framework: "STAR",
        angles: ["As a solo backpacker", "As a leisure traveler", "As a local tour guide", "As a cultural critic"],
        frameworkHelper: [
          "S (Situation): Paint a picture of a new country or city scenery.",
          "T (Task): Explain why you want or need to blend in or explore.",
          "A (Action): Describe travel tasks (trying food, talking to locals).",
          "R (Result): Share the memorable lessons and perspective shift."
        ]
      };
    case "Business":
      return {
        framework: "STAR",
        angles: ["As a startup founder", "As a senior manager", "As a young job seeker", "As an end client"],
        frameworkHelper: [
          "S (Situation): Set the scene of a common office/market hurdle.",
          "T (Task): Outline the primary goal to improve growth or trust.",
          "A (Action): Walk through strategic action steps (agile, feedback).",
          "R (Result): Detail the outcome (profit growth, high satisfaction)."
        ]
      };
    case "Food":
      return {
        framework: "PREP",
        angles: ["As a passionate chef", "As a busy home cook", "As a health nutritionist", "As an international traveler"],
        frameworkHelper: [
          "P (Point): State your clear view on this food item or policy.",
          "R (Reason): Detail the taste profile, cultural roots, or health reasons.",
          "E (Example): Share a memorable dish or family cooking moment.",
          "P (Point): Wrap up with a tasty recommendation for everyone."
        ]
      };
    case "Entertainment":
      return {
        framework: "PREP",
        angles: ["As an avid console gamer", "As a film director", "As a literature reader", "As a regular parent"],
        frameworkHelper: [
          "P (Point): State your opinion on this form of entertainment.",
          "R (Reason): Explain how it grabs attention or tells a story.",
          "E (Example): Detail a memorable movie, game level, or book chapter.",
          "P (Point): Conclude with how this media shapes our culture today."
        ]
      };
    case "Debate":
      return {
        framework: "PREP",
        angles: ["Supporting argument (Pro)", "Opposing argument (Con)", "Neutral mediator", "Young active progressive citizen"],
        frameworkHelper: [
          "P (Point): Take a strong, unambiguous stance on this motion.",
          "R (Reason): Present logical reasons (economic, societal, safety).",
          "E (Example): Illustrate with a well-known real-world case study.",
          "P (Point): Summarize your core argument as a final plea."
        ]
      };
    case "Storytelling":
      return {
        framework: "STAR",
        angles: ["As the main adventurer", "As an old wise storyteller", "As a passive bystander", "As a wizard/companion"],
        frameworkHelper: [
          "S (Situation): Describe the warm, funny, or mysterious starting scene.",
          "T (Task): Introduce the unexpected goal, task, or event.",
          "A (Action): Narrate the main action, struggle, or hilarious climax.",
          "R (Result): Give a satisfying, creative, or curious conclusion."
        ]
      };
    case "Interview":
      return {
        framework: "STAR",
        angles: ["As an active job seeker", "As a senior tech manager", "As an HR interviewer", "As an industry mentor"],
        frameworkHelper: [
          "S (Situation): Describe a professional context or target project.",
          "T (Task): State the core objective or problem to resolve.",
          "A (Action): Highlight specific technical/human action strategies you did.",
          "R (Result): Quantify the positive result (time saved, revenue boost)."
        ]
      };
    case "One Minute Pitch":
      return {
        framework: "PREP",
        angles: ["As a passionate creator", "As a strict business person", "As a crowd-funding organizer", "As an active user"],
        frameworkHelper: [
          "P (Point): Present the product or pitch hook immediately.",
          "R (Reason): Detail why standard products fail and yours succeeds.",
          "E (Example): Show how a customer saves time or gets happy using it.",
          "P (Point): Call to action: ask for support, money, or signing up."
        ]
      };
    case "Explain Like I'm Five":
      return {
        framework: "PREP",
        angles: ["As a playful kindergarten teacher", "As a kind elder sibling", "As an animated hero character", "As a passionate scientist"],
        frameworkHelper: [
          "P (Point): Ground the concept using a basic, fun household metaphor.",
          "R (Reason): Explain why it works without using technical jargon.",
          "E (Example): Connect it to a physical object they can see or feel.",
          "P (Point): Leave them with a sense of wonder and warmth."
        ]
      };
    case "Hot Takes":
      return {
        framework: "PREP",
        angles: ["Unapologetically defending the take", "Deeply opposing the take", "As a culinary/lifestyle critic", "As an everyday citizen"],
        frameworkHelper: [
          "P (Point): Fire off your spicy opinion clearly and courageously.",
          "R (Reason): Explain the rational/irrational logic backing up your view.",
          "E (Example): Give a funny, extreme, or relatable example or story.",
          "P (Point): Restate the take proudly with high confidence."
        ]
      };
    case "Creative Thinking":
      return {
        framework: "STAR",
        angles: ["As an imaginative designer", "As an abstract painter", "As a science-fiction writer", "As an inquisitive child"],
        frameworkHelper: [
          "S (Situation): Describe this dream-world situation or question.",
          "T (Task): Identify the creative task or constraint to explore.",
          "A (Action): Detail the fascinating, imaginative action steps.",
          "R (Result): Describe how this design would change human feelings."
        ]
      };
    default:
      return {
        framework: "PREP",
        angles: ["As yourself", "As an analytical speaker", "As an objective critic", "As an interested student"],
        frameworkHelper: [
          "P (Point): Express your core answer to the prompt.",
          "R (Reason): Supply reasons supporting this response.",
          "E (Example): Give a relatable personal or real-world example.",
          "P (Point): Restate your stance briefly and clearly."
        ]
      };
  }
}

export function generateAllTopics(): SpeakingTopic[] {
  const topicsList: SpeakingTopic[] = [];

  Object.entries(categoryBaseTopics).forEach(([category, bases]) => {
    const meta = getMetadataForCategory(category);
    
    // Generate exactly 100 topics for each category
    // Each category will have the 10 core bases, followed by 90 procedural variations
    for (let i = 1; i <= 100; i++) {
      const difficulty = difficulties[(i - 1) % difficulties.length];
      let topicText = "";

      if (i <= bases.length) {
        topicText = bases[i - 1];
      } else {
        const baseIndex = (i - 1) % bases.length;
        const base = bases[baseIndex];
        const variationNum = Math.floor(i / bases.length);
        
        // Cozy, cute procedural variation templates to satisfy exactly 100 items per category
        const variations = [
          `Deep dive: ${base} What are your secondary thoughts?`,
          `Discuss the long-term impact: ${base}`,
          `Consider a personal growth angle: ${base}`,
          `If you had to explain this to a friend: ${base}`,
          `Imagine a world where this changes: ${base}`,
          `Reflect on your personal history: ${base}`,
          `From a Genz or modern perspective, explain: ${base}`,
          `What are some common misconceptions about: ${base}`,
          `How does this influence daily happiness? ${base}`,
          `Give a brief speech outlining: ${base}`
        ];
        
        topicText = variations[variationNum % variations.length];
      }

      topicsList.push({
        id: `${category.toLowerCase().replace(/\s+/g, '_')}_${i}`,
        text: topicText,
        category: category,
        difficulty: difficulty,
        angles: meta.angles,
        framework: meta.framework,
        frameworkHelper: meta.frameworkHelper
      });
    }
  });

  return topicsList;
}
