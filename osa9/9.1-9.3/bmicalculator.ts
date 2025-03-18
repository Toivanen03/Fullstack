const calculateBmi = (height: number, weight: number) => {
    if (isNaN(height) || (isNaN(weight))) {
        throw new Error('Only numbers allowed!');
    }
    const bmi = (weight / Math.pow((height / 100), 2)).toFixed(2);
    let result: string;
    
    if (Number(bmi) < 18.50) {
        result = 'underweighted';
    } else if (Number(bmi) >= 25 && Number(bmi) < 30) {
        result = 'overweighted';
    } else if (Number(bmi) >= 30) {
        result = 'obese';
    } else {
        result = 'normal weighted';
    }
    return `Your bmi is ${bmi} and you're ${result}.`;
}

try {
    console.log(calculateBmi(178, 95));
} catch (error: unknown) {
    let errorMessage = 'Something went wrong: ';
    if (error instanceof Error) {
        errorMessage += error.message;
    }
    console.log(errorMessage);
}