import axios from "axios";

const api = axios.create({
    baseURL: 'http://192.168.29.66:3333' //reid
  // baseURL: 'http://192.168.0.114:3333'//gj
  //baseURL: "http://192.168.42.217:3333", //gj2
  //baseURL: 'https://esclarecabeta.herokuapp.com/'
  //baseURL: 'http://54.162.88.146:3333'
});

export default api;