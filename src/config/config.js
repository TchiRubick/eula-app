const Config = {
  baseApiUrl: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  client: {
    name: process.env.REACT_APP_CLIENT_NAME || 'Noushop',
  },
};

export default Config;
