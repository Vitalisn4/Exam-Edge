export type ExamBoardId = "gce-a-level" | "gce-o-level" | "bepc-bac" | "waec" | "neco" | "kcse";

export type CurriculumSubject = {
  id: string;
  name: string;
  topicCount: number;
  level: string;
};

export const EXAM_BOARDS: Array<{ id: ExamBoardId; label: string }> = [
  { id: "gce-a-level", label: "GCE A-Level" },
  { id: "gce-o-level", label: "GCE O-Level" },
  { id: "bepc-bac", label: "BEPC / Bac" },
  { id: "waec", label: "WAEC" },
  { id: "neco", label: "NECO" },
  { id: "kcse", label: "KCSE" },
];

export const SUBJECTS_BY_BOARD: Record<ExamBoardId, CurriculumSubject[]> = {
  "gce-a-level": [
    { id: "pure-maths", name: "Pure Mathematics", topicCount: 12, level: "A-Level" },
    { id: "physics", name: "Physics", topicCount: 8, level: "A-Level" },
    { id: "biology", name: "Biology", topicCount: 7, level: "A-Level" },
    { id: "chemistry", name: "Chemistry", topicCount: 6, level: "A-Level" },
    { id: "english", name: "English Language", topicCount: 5, level: "O-Level" },
    { id: "economics", name: "Economics", topicCount: 4, level: "A-Level" },
  ],
  "gce-o-level": [
    { id: "mathematics", name: "Mathematics", topicCount: 10, level: "O-Level" },
    { id: "physics", name: "Physics", topicCount: 7, level: "O-Level" },
    { id: "biology", name: "Biology", topicCount: 6, level: "O-Level" },
    { id: "chemistry", name: "Chemistry", topicCount: 5, level: "O-Level" },
    { id: "english", name: "English Language", topicCount: 5, level: "O-Level" },
    { id: "geography", name: "Geography", topicCount: 4, level: "O-Level" },
  ],
  "bepc-bac": [
    { id: "mathematiques", name: "Mathématiques", topicCount: 9, level: "BEPC" },
    { id: "physique", name: "Physique", topicCount: 6, level: "BEPC" },
    { id: "svt", name: "SVT", topicCount: 5, level: "BEPC" },
    { id: "francais", name: "Français", topicCount: 5, level: "BEPC" },
    { id: "anglais", name: "Anglais", topicCount: 4, level: "BEPC" },
    { id: "histoire", name: "Histoire-Géo", topicCount: 4, level: "BEPC" },
  ],
  waec: [
    { id: "mathematics", name: "Mathematics", topicCount: 11, level: "SSCE" },
    { id: "physics", name: "Physics", topicCount: 8, level: "SSCE" },
    { id: "biology", name: "Biology", topicCount: 7, level: "SSCE" },
    { id: "chemistry", name: "Chemistry", topicCount: 6, level: "SSCE" },
    { id: "english", name: "English Language", topicCount: 5, level: "SSCE" },
    { id: "economics", name: "Economics", topicCount: 4, level: "SSCE" },
  ],
  neco: [
    { id: "mathematics", name: "Mathematics", topicCount: 10, level: "SSCE" },
    { id: "physics", name: "Physics", topicCount: 7, level: "SSCE" },
    { id: "biology", name: "Biology", topicCount: 6, level: "SSCE" },
    { id: "chemistry", name: "Chemistry", topicCount: 5, level: "SSCE" },
    { id: "english", name: "English Language", topicCount: 5, level: "SSCE" },
    { id: "crs", name: "CRS", topicCount: 3, level: "SSCE" },
  ],
  kcse: [
    { id: "mathematics", name: "Mathematics", topicCount: 10, level: "KCSE" },
    { id: "physics", name: "Physics", topicCount: 7, level: "KCSE" },
    { id: "biology", name: "Biology", topicCount: 6, level: "KCSE" },
    { id: "chemistry", name: "Chemistry", topicCount: 5, level: "KCSE" },
    { id: "english", name: "English", topicCount: 5, level: "KCSE" },
    { id: "business", name: "Business Studies", topicCount: 4, level: "KCSE" },
  ],
};
