export type Operation = 'multiply' | 'add' | 'divide';

export const calculator = (a: number, b: number, op: Operation) : number => {
  switch(op) {
    case 'multiply':
      return a * b;
    case 'divide':
      if (b === 0) throw new Error('Can\'t divide by 0!');
      return a / b;
    case 'add':
      return a + b;
    default:
      throw new Error('Operation is not multiply, add or divide!');
  };
};

if (require.main === module) {
  try {
    const value1 = Number(process.argv[2]);
    const value2 = Number(process.argv[3]);
    const operator = process.argv[4] as Operation;
    console.log(calculator(value1, value2, operator));
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong: ';
    if (error instanceof Error) {
      errorMessage += error.message;
    };
    console.log(errorMessage);
  };
}