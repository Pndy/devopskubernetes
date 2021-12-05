// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from "axios"

const baseUrl = 'http://todoserver-svc.default:1236'

export default function handler(req, res) {
  axios.get(`${baseUrl}`)
  .then(res => {
    res.status(200)
  })
  .catch(err => {
    res.status(500)
  })
}
