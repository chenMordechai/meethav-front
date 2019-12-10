import io from "socket.io-client";
// const socket = io();
const BASE_URL = true || process.env.NODE_ENV === 'production'
    ? '/'
    : '//localhost:3000/'

const socket = io(BASE_URL);
export default socket