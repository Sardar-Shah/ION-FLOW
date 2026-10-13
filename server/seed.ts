import mongoose from 'mongoose';
import { initialCareers } from './data/careersData.ts';
import { Career } from './models/Career.ts';
import { Skill } from './models/Skill.ts';
import { connectDB } from './db.ts';

export async function seedCareers(): Promise<{ success: boolean; count: number; message: string }> {
  try {
    if (mongoose.connection.readyState !== 1) {
      const conn = await connectDB();
      if (!conn.connected) {
        return {
          success: false,
          count: 0,
          message: `Cannot seed careers: ${conn.message}`
        };
      }
    }

    console.log('[Seed] Seeding 12 initial careers into careerpath_ai...');
    let seededCount = 0;

    for (const careerData of initialCareers) {
      await Career.findOneAndUpdate(
        { slug: careerData.slug },
        { $set: careerData },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      seededCount++;

      // Also upsert skills into canonical Skill directory
      for (const reqSkill of careerData.requiredSkills) {
        await Skill.findOneAndUpdate(
          { normalizedName: reqSkill.normalizedName },
          {
            $set: {
              canonicalName: reqSkill.canonicalName,
              normalizedName: reqSkill.normalizedName,
              category: reqSkill.category,
              description: reqSkill.description
            },
            $addToSet: {
              aliases: reqSkill.canonicalName.toLowerCase()
            }
          },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
      }
    }

    console.log(`[Seed] Successfully seeded/updated ${seededCount} careers and canonical skills.`);
    return {
      success: true,
      count: seededCount,
      message: `Successfully seeded/updated all ${seededCount} careers in MongoDB Atlas.`
    };
  } catch (error: any) {
    console.error('[Seed] Error seeding careers:', error);
    return {
      success: false,
      count: 0,
      message: `Seeding error: ${error?.message || 'Unknown error'}`
    };
  }
}

// Allow direct execution via tsx server/seed.ts
if (import.meta.url === `file://${process.argv[1]}`) {
  (async () => {
    const res = await seedCareers();
    console.log(res.message);
    process.exit(res.success ? 0 : 1);
  })();
}
