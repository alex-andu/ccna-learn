import type { Fact } from '../flashcards';

// Fapte esențiale pentru 6.4 — AI generativ/predictiv și ML în operațiunile de rețea
export const FACTS: Fact[] = [
  { topicId: '6.4', id: 'f-6.4-01', front: 'AI vs ML vs deep learning', back: 'AI = domeniul larg · ML = învățare din date · deep learning = rețele neuronale mari (ex. LLM)', detail: 'AI ⊃ ML ⊃ deep learning.' },
  { topicId: '6.4', id: 'f-6.4-02', front: 'Cum „învață” un model ML', back: 'Date de antrenare → algoritm → model; apoi inferență pe date noi', detail: 'Antrenarea e rară și costisitoare; inferența e continuă.' },
  { topicId: '6.4', id: 'f-6.4-03', front: 'AI predictiv: ce face', back: 'Prezice, detectează anomalii, clasifică, estimează probabilități', detail: 'Produce valori, scoruri, etichete, alarme.' },
  { topicId: '6.4', id: 'f-6.4-04', front: 'AI generativ: ce face', back: 'Creează conținut nou: text, cod, configurații, rezumate', detail: 'De obicei un LLM care primește un prompt.' },
  { topicId: '6.4', id: 'f-6.4-05', front: 'Exemple predictive în rețea', back: 'Baseline + anomalii · prognoză de capacitate · clasificare trafic · risc de defectare', detail: 'Necesită telemetrie și date istorice.' },
  { topicId: '6.4', id: 'f-6.4-06', front: 'Exemple generative în rețea', back: 'Rezumat de log-uri · draft de config/script · explicații · asistent de depanare', detail: 'Ieșirea e un draft de validat.' },
  { topicId: '6.4', id: 'f-6.4-07', front: 'Ce este un baseline?', back: 'Profilul „normal” al unei metrici (de exemplu pe ora zilei)', detail: 'Referința pentru detectarea anomaliilor.' },
  { topicId: '6.4', id: 'f-6.4-08', front: 'Sensibilitatea la anomalii', back: 'Bandă îngustă → alarme false · bandă largă → anomalii ratate', detail: 'Alert fatigue: oamenii ignoră alarmele prea dese.' },
  { topicId: '6.4', id: 'f-6.4-09', front: 'Ce este o halucinație?', back: 'Răspuns fals, dar convingător, al unui model generativ', detail: 'Ex.: o comandă IOS care nu există. Remediu: validare + test.' },
  { topicId: '6.4', id: 'f-6.4-10', front: 'Ce faci cu o configurație generată de AI?', back: 'O tratezi ca draft: revizuire, test în laborator, change cu rollback, verificare după', detail: 'La fel ca codul unui coleg junior.' },
  { topicId: '6.4', id: 'f-6.4-11', front: 'Ce nu pui într-un prompt', back: 'Parole, chei, topologii sau date confidențiale/personale', detail: 'Folosește doar unelte aprobate de organizație.' },
  { topicId: '6.4', id: 'f-6.4-12', front: 'Învățare supervizată vs nesupervizată', back: 'Supervizată: exemple etichetate · nesupervizată: găsește singură structuri/abateri', detail: 'Clasificare vs grupare/anomalii.' },
  { topicId: '6.4', id: 'f-6.4-13', front: 'Model drift', back: 'Modelul își pierde precizia pentru că datele reale s-au schimbat față de cele de antrenare', detail: 'Remediu: monitorizare și reantrenare. ≠ configuration drift.' },
  { topicId: '6.4', id: 'f-6.4-14', front: 'Ce este AIOps?', back: 'AI/ML aplicate pe date operaționale pentru mai puțin zgomot, diagnostic mai rapid, remedieri automate', detail: 'Cu om în buclă pentru acțiunile cu impact.' },
  { topicId: '6.4', id: 'f-6.4-15', front: 'Combustibilul AI în rețea', back: 'Telemetria și datele de calitate (log-uri, contoare, evenimente)', detail: 'Fără date bune: garbage in, garbage out.' },
  { topicId: '6.4', id: 'f-6.4-16', front: 'Cuvinte-cheie în enunț', back: '„prezice/detectează/clasifică” → predictiv · „scrie/rezumă/generează” → generativ', detail: 'Util la întrebările de examen.' },
  { topicId: '6.4', id: 'f-6.4-17', front: 'Prompt bun', back: 'Sarcină clară + platformă și versiune + context + formatul dorit', detail: 'Chiar și așa, rezultatul se verifică.' },
];
