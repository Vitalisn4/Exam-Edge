import { describe, expect, it } from "vitest";

import { GCE_BUEA_CURRICULUM, GCE_BUEA_SUBJECTS } from "./gce-buea-topics";

describe("GCE Buea seed data", () => {
  it("defines the GCE AL curriculum", () => {
    expect(GCE_BUEA_CURRICULUM.code).toBe("GCE_AL");
    expect(GCE_BUEA_CURRICULUM.country).toBe("Cameroon");
  });

  it("includes three pilot subjects", () => {
    expect(GCE_BUEA_SUBJECTS).toHaveLength(3);
    expect(GCE_BUEA_SUBJECTS.map((subject) => subject.code)).toEqual(["0765", "0710", "0730"]);
  });

  it("defines at least five topics per subject", () => {
    for (const subject of GCE_BUEA_SUBJECTS) {
      expect(subject.topics.length).toBeGreaterThanOrEqual(5);
    }
  });

  it("uses unique topic slugs within each subject", () => {
    for (const subject of GCE_BUEA_SUBJECTS) {
      const slugs = subject.topics.map((topic) => topic.slug);
      expect(new Set(slugs).size).toBe(slugs.length);
    }
  });
});
