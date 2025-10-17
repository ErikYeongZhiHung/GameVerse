import axios from 'axios';


const baseURL = 'http://localhost:5000/api'; // Replace with your API base URL

export const apiConfig = axios.create({
  baseURL:baseURL,
});

