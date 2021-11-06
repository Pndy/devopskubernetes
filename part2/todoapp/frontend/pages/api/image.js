import axios from "axios"

const baseUrl = 'http://todoserver-svc.project-ns:1234'

export default async function handler(req, res) {
    const response = await axios.get(`${baseUrl}/image`, { responseType: 'arraybuffer' })
    res.setHeader('Content-Type', 'image/jpg')
    res.send(response.data)
  }
  