interface ExerciseResult {
    periodLength: number;
    trainingDays: number;
    success: boolean;
    rating: number;
    ratingDescription: string;
    target: number;
    average: number;
};

interface Extractor {
    target: number;
    exercises: number[];
};

const filterValues = (args: string[]): Extractor => {
    const target = Number(args[2]);
    const exercises = args.slice(3).map((value) => Number(value));

    return { target, exercises };
};
  
export const calculateExercises = (target: number, dailyHours: number[]): ExerciseResult => {
    for (let i=0; i < dailyHours.length; i++) {
        if (isNaN(Number(dailyHours[i])) || isNaN(Number(target))) {
            throw new Error('Target & exercisehours must be in numerical format!');
        };
        if (dailyHours[i] >= 24 || dailyHours[i] < 0) {
            throw new Error("Invalid exercisehours!");
        };
    };

    const periodLength = dailyHours.length;
    const trainingDays = dailyHours.filter(day => day > 0).length;
    const totalHours = dailyHours.reduce((sum, hours) => sum + hours, 0);
    const average = parseFloat((totalHours / periodLength).toFixed(2));
    const success = average >= target;
  
    let rating: number;
    let ratingDescription: string;
  
    if (average >= target) {
      rating = 3;
      ratingDescription = "You have achieved your goal!";
    } else if (average >= target * 0.75) {
      rating = 2;
      ratingDescription = "You can do better!";
    } else {
      rating = 1;
      ratingDescription = "You've been lazy...";
    };
  
    return {
      periodLength,
      trainingDays,
      success,
      rating,
      ratingDescription,
      target,
      average
    };
};

if (require.main === module) {
  try {
      const { target, exercises } = filterValues(process.argv);
      console.log(calculateExercises(target, exercises));
  } catch (error: unknown) {
      let errorMessage = "";
      if (error instanceof Error) {
        errorMessage += ' Error: ' + error.message;
      };
      console.log(errorMessage);
    };
  };