module.exports = {
  roots: ['<rootDir>/src'], 
  testEnviroments: 'node',
  transform: {
    '.+\\.ts$': 'ts-jest'
  },
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1'
  }
}