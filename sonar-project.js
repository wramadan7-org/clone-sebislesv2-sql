const sonarqubeScanner = require('sonarqube-scanner');

const serverUrl = 'http://192.168.1.27:9000';
const token = '3e116acb23ad4a5823a4fa50fcf961a5c0e5f0a2';

sonarqubeScanner(
  {
    serverUrl,
    token,
    options: {
      'sonar.projectKey': 'les-express-v2',
      'sonar.sources': 'src',
      'sonar.tests': 'src',
      'sonar.inclusions': '**', // Code entry point
      'sonar.test.inclusions': 'src/**/*.spec.js,src/**/*.spec.jsx,src/**/*.test.js,src/**/*.test.jsx',
    },
  }, () => process.exit(),
);
