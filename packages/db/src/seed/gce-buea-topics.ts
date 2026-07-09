export type GceBueaTopicSeed = {
  name: string;
  slug: string;
  syllabusRef: string;
  difficultyBand: number;
  examWeight: string;
};

export type GceBueaSubjectSeed = {
  code: string;
  name: string;
  level: "OL" | "AL";
  syllabusRef: string;
  topics: GceBueaTopicSeed[];
};

export const GCE_BUEA_CURRICULUM = {
  code: "GCE_AL",
  name: "GCE Board Buea Advanced Level",
  country: "Cameroon",
  language: "en",
  boardConfig: {
    board: "GCE_BUEA",
    grading: "letter",
  },
} as const;

export const GCE_BUEA_SUBJECTS: GceBueaSubjectSeed[] = [
  {
    code: "0765",
    name: "Pure Mathematics With Mechanics",
    level: "AL",
    syllabusRef: "GCE/AL/0765",
    topics: [
      {
        name: "Differentiation",
        slug: "differentiation",
        syllabusRef: "0765/1.1",
        difficultyBand: 2,
        examWeight: "18.00",
      },
      {
        name: "Integration",
        slug: "integration",
        syllabusRef: "0765/1.2",
        difficultyBand: 2,
        examWeight: "16.00",
      },
      {
        name: "Vectors",
        slug: "vectors",
        syllabusRef: "0765/2.1",
        difficultyBand: 2,
        examWeight: "14.00",
      },
      {
        name: "Complex Numbers",
        slug: "complex-numbers",
        syllabusRef: "0765/3.1",
        difficultyBand: 3,
        examWeight: "12.00",
      },
      {
        name: "Trigonometry",
        slug: "trigonometry",
        syllabusRef: "0765/4.1",
        difficultyBand: 2,
        examWeight: "15.00",
      },
      {
        name: "Matrices",
        slug: "matrices",
        syllabusRef: "0765/5.1",
        difficultyBand: 3,
        examWeight: "10.00",
      },
    ],
  },
  {
    code: "0710",
    name: "Physics",
    level: "AL",
    syllabusRef: "GCE/AL/0710",
    topics: [
      {
        name: "Mechanics",
        slug: "mechanics",
        syllabusRef: "0710/1.1",
        difficultyBand: 2,
        examWeight: "20.00",
      },
      {
        name: "Waves and Optics",
        slug: "waves-optics",
        syllabusRef: "0710/2.1",
        difficultyBand: 2,
        examWeight: "15.00",
      },
      {
        name: "Electricity",
        slug: "electricity",
        syllabusRef: "0710/3.1",
        difficultyBand: 2,
        examWeight: "18.00",
      },
      {
        name: "Thermodynamics",
        slug: "thermodynamics",
        syllabusRef: "0710/4.1",
        difficultyBand: 3,
        examWeight: "12.00",
      },
      {
        name: "Fields",
        slug: "fields",
        syllabusRef: "0710/5.1",
        difficultyBand: 3,
        examWeight: "15.00",
      },
    ],
  },
  {
    code: "0730",
    name: "Biology",
    level: "AL",
    syllabusRef: "GCE/AL/0730",
    topics: [
      {
        name: "Cell Biology",
        slug: "cell-biology",
        syllabusRef: "0730/1.1",
        difficultyBand: 1,
        examWeight: "16.00",
      },
      {
        name: "Genetics",
        slug: "genetics",
        syllabusRef: "0730/2.1",
        difficultyBand: 2,
        examWeight: "18.00",
      },
      {
        name: "Ecology",
        slug: "ecology",
        syllabusRef: "0730/3.1",
        difficultyBand: 2,
        examWeight: "14.00",
      },
      {
        name: "Human Physiology",
        slug: "human-physiology",
        syllabusRef: "0730/4.1",
        difficultyBand: 2,
        examWeight: "17.00",
      },
      {
        name: "Plant Biology",
        slug: "plant-biology",
        syllabusRef: "0730/5.1",
        difficultyBand: 2,
        examWeight: "15.00",
      },
    ],
  },
];

export async function seedGceBueaTopics(): Promise<void> {
  const {
    createCurriculum,
    createSubject,
    createTopic,
    findCurriculumByCode,
    findSubjectByCode,
    findTopicBySlug,
  } = await import("../repositories/curriculum");

  let curriculum = await findCurriculumByCode(GCE_BUEA_CURRICULUM.code);
  if (!curriculum) {
    curriculum = await createCurriculum({
      code: GCE_BUEA_CURRICULUM.code,
      name: GCE_BUEA_CURRICULUM.name,
      country: GCE_BUEA_CURRICULUM.country,
      language: GCE_BUEA_CURRICULUM.language,
      boardConfig: GCE_BUEA_CURRICULUM.boardConfig,
    });
  }

  for (const subjectSeed of GCE_BUEA_SUBJECTS) {
    let subject = await findSubjectByCode(curriculum.id, subjectSeed.code);
    if (!subject) {
      subject = await createSubject({
        curriculumId: curriculum.id,
        code: subjectSeed.code,
        name: subjectSeed.name,
        level: subjectSeed.level,
        syllabusRef: subjectSeed.syllabusRef,
      });
    }

    for (const topicSeed of subjectSeed.topics) {
      const existing = await findTopicBySlug(subject.id, topicSeed.slug);
      if (existing) {
        continue;
      }

      await createTopic({
        subjectId: subject.id,
        name: topicSeed.name,
        slug: topicSeed.slug,
        syllabusRef: topicSeed.syllabusRef,
        examWeight: topicSeed.examWeight,
        difficultyBand: topicSeed.difficultyBand,
        prerequisiteIds: [],
      });
    }
  }
}
