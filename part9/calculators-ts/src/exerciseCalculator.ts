export interface Result {
periodLength: number;
trainingDays: number;
success: boolean;
rating: 1 | 2 | 3;
ratingDescription: string;
target: number;
average: number;
}
export const calculateExercises = (dailyHours: number[], target: number): Result => {
const periodLength = dailyHours.length;
const trainingDays = dailyHours.filter(h => h > 0).length;
const average = dailyHours.reduce((a, b) => a + b, 0) / periodLength;
const success = average >= target;

let rating: 1 | 2 | 3 = 2;
let ratingDescription = 'not too bad but could be better';
if (average < target * 0.8) {
rating = 1; ratingDescription = 'bad';
} else if (average >= target) {
rating = 3; ratingDescription = 'great';
}

return { periodLength, trainingDays, success, rating, ratingDescription, target, average };
};

// CLI: first arg = target, rest = hours
if (require.main === module) {
const args = process.argv.slice(2).map(Number);
if (args.length < 2 || args.some(n => isNaN(n))) {
console.log('Usage: npm run calculateExercises <target> [h1 h2 h3 ...]');
process.exit(1);
}
const [target, ...hours] = args;
console.log(calculateExercises(hours, target));
}

export default calculateExercises;

