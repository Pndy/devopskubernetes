import axios from "axios";

const baseUrl = 'http://todoserver-svc.default:80'

export default async function handler(req, res) {
    if (req.method === 'GET') {
      const response = await axios.get(`${baseUrl}/todos`)
      res.status(200).json(response.data)
    } else if(req.method === 'POST') {
      const response = await axios.post(`${baseUrl}/todos`, {
        text: req.body.text
      })
      res.status(200).json(response.data)
    }
  }