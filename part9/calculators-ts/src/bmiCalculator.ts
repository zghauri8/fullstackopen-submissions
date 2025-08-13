export const calculateBmi = (heightCm: number, weightKg: number): string => {
const heightM = heightCm / 100;
const bmi = weightKg / (heightM * heightM);
if (bmi < 18.5) return 'Underweight';
if (bmi < 25) return 'Normal range';
if (bmi < 30) return 'Overweight';
return 'Obese';
};

// CLI support
if (require.main === module) {
const [, , h, w] = process.argv;
if (!h || !w || isNaN(Number(h)) || isNaN(Number(w))) {
console.log('Usage: npm run calculateBmi <height(cm)> <weight(kg)>');
process.exit(1);
}
console.log(calculateBmi(Number(h), Number(w)));
}

export default calculateBmi;