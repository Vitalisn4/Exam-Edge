import { seedGceBueaTopics } from "./gce-buea-topics";

async function main(): Promise<void> {
  await seedGceBueaTopics();
  console.log("GCE Buea curriculum seed completed");
}

main().catch((error: unknown) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
