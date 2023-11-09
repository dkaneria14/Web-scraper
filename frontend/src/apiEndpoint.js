const remoteEP = process.env.REACT_APP_SERVER_ENDPOINT;
const apiEndpoint = `http://${remoteEP ? remoteEP : "127.0.0.1"}:8000`;

export default apiEndpoint;