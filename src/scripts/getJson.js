import axios from "axios";
export default async function getJson(url) {
  return (await axios.get(url)).data;
}
