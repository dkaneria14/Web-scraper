const remoteEP = process.env.REACT_APP_SERVER_ENDPOINT;
const apiEndpoint = remoteEP ? `https://${remoteEP}:8001` : "http://127.0.0.1:8000";
console.log("Fetching from: ", apiEndpoint);

export default apiEndpoint;