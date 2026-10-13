import { computeGapAnalysis, normalizeSkillName, findMatchingUserSkill } from '../server/services/gapAnalysisEngine.ts';
import { initialCareers } from '../server/data/careersData.ts';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion Failed: ${message}`);
  }
  console.log(`  ✓ ${message}`);
}

console.log('--- RUNNING SKILL-GAP ENGINE TESTS ---');

// Test 1: Skill normalization
console.log('Test 1: Skill name normalization');
assert(normalizeSkillName('HTML5 & Semantic Markup') === 'html5semanticmarkup', 'Normalizes special characters');
assert(normalizeSkillName('React.js') === 'reactjs', 'Normalizes periods');
assert(normalizeSkillName('  TypeScript  ') === 'typescript', 'Trims whitespace');

// Test 2: Cybersecurity Analyst gap analysis
console.log('\nTest 2: Cybersecurity Analyst calculation');
const cyberCareer = initialCareers.find((c) => c.slug === 'cybersecurity-analyst')!;
assert(!!cyberCareer, 'Cybersecurity Analyst career exists in seed data');

// Scenario A: Candidate with no assessed skills (0% readiness)
const emptyResult = computeGapAnalysis(cyberCareer, []);
assert(emptyResult.readinessScore === 0, `Empty skills should yield 0% readiness (got ${emptyResult.readinessScore}%)`);
assert(emptyResult.skillsMissingCount === cyberCareer.requiredSkills.length, 'All required skills marked missing');
assert(emptyResult.skillsMetCount === 0, 'Zero skills met');

// Scenario B: Perfect candidate meeting all target levels (100% readiness)
const perfectSkills = cyberCareer.requiredSkills.map((req) => ({
  skillName: req.canonicalName,
  normalizedName: req.normalizedName,
  level: req.targetLevel,
  updatedAt: new Date()
}));
const perfectResult = computeGapAnalysis(cyberCareer, perfectSkills);
assert(perfectResult.readinessScore === 100, `Perfect candidate should yield 100% readiness (got ${perfectResult.readinessScore}%)`);
assert(perfectResult.skillsMetCount === cyberCareer.requiredSkills.length, 'All skills met');
assert(perfectResult.rankedGaps.length === 0, 'No gaps present');

// Scenario C: Realistic university student profile with mixed skills
const studentSkills = [
  { skillName: 'Network Fundamentals & Protocols', normalizedName: 'networking', level: 3, updatedAt: new Date() }, // target 4, weight 3 -> completion 3/4 = 0.75, weighted = 2.25
  { skillName: 'Security Information & Event Management (SIEM)', normalizedName: 'siem-monitoring', level: 2, updatedAt: new Date() }, // target 4, weight 3 -> completion 2/4 = 0.5, weighted = 1.5
  { skillName: 'Web Application Security (OWASP Top 10)', normalizedName: 'owasp-security', level: 3, updatedAt: new Date() }, // target 3, weight 2 -> completion 3/3 = 1.0, weighted = 2.0
  { skillName: 'Security Scripting (Python / Bash)', normalizedName: 'security-scripting', level: 2, updatedAt: new Date() } // target 3, weight 2 -> completion 2/3 = 0.667, weighted = 1.333
];
const studentResult = computeGapAnalysis(cyberCareer, studentSkills);
assert(studentResult.readinessScore > 0 && studentResult.readinessScore < 100, `Score is between 0 and 100 (got ${studentResult.readinessScore}%)`);
assert(studentResult.skillsMetCount === 1, `1 skill met target (got ${studentResult.skillsMetCount})`);
assert(studentResult.skillsPartialCount === 3, `3 skills partially met (got ${studentResult.skillsPartialCount})`);
assert(studentResult.skillsMissingCount > 0, `Unassessed skills correctly identified as missing`);

// Verify gap ranking: Required skills (weight 3) rank ahead of Optional skills
assert(studentResult.rankedGaps[0].weight >= studentResult.rankedGaps[studentResult.rankedGaps.length - 1].weight, 'Gaps are prioritized by weight descending');

console.log('\n--- ALL UNIT TESTS PASSED SUCCESSFULLY! ---');
