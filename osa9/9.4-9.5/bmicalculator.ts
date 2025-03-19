interface extractValues {
    height: number;
    weight: number;
}

const parseArguments = (args: string[]): extractValues => {
    if (isNaN(Number(args[2])) || (isNaN(Number(args[3])))) {
        throw new Error('Only numbers allowed!');
    } else if (Number(args[2]) < 100 || Number(args[2]) > 230 || Number(args[3]) < 30 || Number(args[3]) > 250) {
        throw new Error("Invalid height and/or weight. Check given values!")
    }
    return {
        height: Number(args[2]),
        weight: Number(args[3])
    }
}

const calculateBmi = (height: number, weight: number) => {
    const bmi = Number((weight / Math.pow((height / 100), 2)).toFixed(2));
    let result: string;
    
    if (bmi < 18.5) {
        result = 'underweighted';
    } else if (bmi >= 18.5 && bmi < 25) {
        result = 'normal weighted';
    } else if (bmi >= 25 && bmi < 30) {
        result = 'overweighted';
    } else {
        result = 'obese';
    }

    console.log(`Your BMI is ${bmi} and you're ${result}.`);
};

try {
    const { height, weight } = parseArguments(process.argv);
    calculateBmi(height, weight);
} catch (error: unknown) {
    let errorMessage = 'Something went wrong: ';
    if (error instanceof Error) {
        errorMessage += error.message;
    };
    console.log(errorMessage);
};