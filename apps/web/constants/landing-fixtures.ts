export type MasteryLevel = "red" | "amber" | "green";

export type PreviewTopic = {
  id: string;
  name: string;
  mastery: MasteryLevel;
  percent: number;
};

export type PreviewSubject = {
  id: string;
  name: string;
  level: "O-Level" | "A-Level";
  topics: PreviewTopic[];
};

export const PREVIEW_SUBJECTS: PreviewSubject[] = [
  {
    id: "pure-maths",
    name: "Pure Mathematics",
    level: "A-Level",
    topics: [
      { id: "differentiation", name: "Differentiation", mastery: "amber", percent: 58 },
      { id: "integration", name: "Integration", mastery: "red", percent: 12 },
      { id: "trigonometry", name: "Trigonometry", mastery: "green", percent: 84 },
      { id: "vectors", name: "Vectors", mastery: "red", percent: 0 },
      { id: "complex-numbers", name: "Complex Numbers", mastery: "red", percent: 0 },
      { id: "matrices", name: "Matrices", mastery: "amber", percent: 42 },
      { id: "sequences", name: "Sequences & Series", mastery: "red", percent: 8 },
      { id: "probability", name: "Probability", mastery: "green", percent: 76 },
      { id: "statistics", name: "Statistics", mastery: "amber", percent: 51 },
      { id: "functions", name: "Functions", mastery: "amber", percent: 44 },
      { id: "logarithms", name: "Logarithms", mastery: "green", percent: 82 },
      { id: "series", name: "Binomial", mastery: "red", percent: 5 },
    ],
  },
  {
    id: "physics",
    name: "Physics",
    level: "A-Level",
    topics: [
      { id: "mechanics", name: "Mechanics", mastery: "amber", percent: 55 },
      { id: "waves", name: "Waves & Optics", mastery: "red", percent: 0 },
      { id: "electricity", name: "Electricity", mastery: "red", percent: 18 },
      { id: "thermodynamics", name: "Thermodynamics", mastery: "red", percent: 0 },
      { id: "modern-physics", name: "Modern Physics", mastery: "red", percent: 0 },
      { id: "fields", name: "Fields", mastery: "red", percent: 0 },
      { id: "circular-motion", name: "Circular Motion", mastery: "amber", percent: 34 },
      { id: "gravitation", name: "Gravitation", mastery: "red", percent: 8 },
    ],
  },
  {
    id: "biology",
    name: "Biology",
    level: "A-Level",
    topics: [
      { id: "cell-biology", name: "Cell Biology", mastery: "green", percent: 88 },
      { id: "genetics", name: "Genetics", mastery: "amber", percent: 47 },
      { id: "ecology", name: "Ecology", mastery: "red", percent: 22 },
      { id: "human-physiology", name: "Human Physiology", mastery: "red", percent: 0 },
      { id: "plant-biology", name: "Plant Biology", mastery: "red", percent: 0 },
      { id: "evolution", name: "Evolution", mastery: "red", percent: 0 },
      { id: "microbiology", name: "Microbiology", mastery: "amber", percent: 38 },
    ],
  },
  {
    id: "chemistry",
    name: "Chemistry",
    level: "A-Level",
    topics: [
      { id: "atomic-structure", name: "Atomic Structure", mastery: "green", percent: 78 },
      { id: "bonding", name: "Chemical Bonding", mastery: "amber", percent: 52 },
      { id: "organic", name: "Organic Chemistry", mastery: "red", percent: 18 },
      { id: "kinetics", name: "Kinetics", mastery: "red", percent: 0 },
      { id: "equilibria", name: "Equilibria", mastery: "amber", percent: 40 },
      { id: "acids-bases", name: "Acids & Bases", mastery: "green", percent: 71 },
    ],
  },
  {
    id: "english",
    name: "English Language",
    level: "O-Level",
    topics: [
      { id: "comprehension", name: "Comprehension", mastery: "green", percent: 80 },
      { id: "summary", name: "Summary Writing", mastery: "amber", percent: 55 },
      { id: "essay", name: "Essay", mastery: "amber", percent: 47 },
      { id: "grammar", name: "Grammar", mastery: "green", percent: 74 },
      { id: "literature", name: "Set Texts", mastery: "red", percent: 20 },
    ],
  },
  {
    id: "economics",
    name: "Economics",
    level: "A-Level",
    topics: [
      { id: "micro", name: "Microeconomics", mastery: "amber", percent: 48 },
      { id: "macro", name: "Macroeconomics", mastery: "red", percent: 22 },
      { id: "trade", name: "International Trade", mastery: "red", percent: 8 },
      { id: "development", name: "Development", mastery: "amber", percent: 35 },
    ],
  },
];

export const MAX_HEATMAP_TOPICS = 56;

export const PREVIEW_HEATMAP_TOPICS = PREVIEW_SUBJECTS.flatMap((s) => s.topics).slice(
  0,
  MAX_HEATMAP_TOPICS,
);
