export default {
    verbose: true,
    transform: {
      '^.+\\.[tj]sx?$': [
        'babel-jest',
        {
          presets: ['@babel/preset-env', '@babel/preset-react'],
        },
      ],
    },
    testEnvironment: 'node',
  };
  