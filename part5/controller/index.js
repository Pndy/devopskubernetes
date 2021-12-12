const k8s = require('@kubernetes/client-node')
const mustache = require('mustache')
const JSONStream = require('json-stream')
const request = require('request')
const fs = require('fs').promises

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const opts = {
    strictSSL: false
}
kc.applyToRequest(opts)
const client = kc.makeApiClient(k8s.CoreV1Api);

const sendRequestToApi = async (api, method = 'get', options = {}) => 
    new Promise((resolve, reject) => 
        request[method](`${kc.getCurrentCluster().server}${api}`, {...opts, ...options,
            headers: {
                ...options.headers,
                ...opts.headers
            }}, (err, res) => 
                err ? reject(err) : resolve(JSON.parse(res.body))
        )
    )

const fieldsFromDummySite = (object) => ({
    container_name: object.metadata.name,
    namespace: object.metadata.namespace,
    website_url: object.spec.website_url
})

const getPodYAML = async (fields) => {
    const deploymentTemplate = await fs.readFile("pod.mustache", "utf-8")
    return mustache.render(deploymentTemplate, fields)
}

const getServiceYAML = async (fields) => {
    const serviceTemplate = await fs.readFile("service.mustache", "utf-8")
    return mustache.render(serviceTemplate, fields)
}

const createPod = async (fields) => {
    console.log(`Create new DummySite: ${fields.container_name}`)

    const yaml = await getPodYAML(fields)

    const response = await sendRequestToApi(`/api/v1/namespaces/${fields.namespace}/pods`, 'post', {
        headers: {
            'Content-Type': 'application/yaml'
        },
        body: yaml
    })

    //console.log(response)
}

const createService = async (fields) => {
    const yaml = await getServiceYAML(fields)

    const response = await sendRequestToApi(`/api/v1/namespaces/${fields.namespace}/services`, 'post', {
        headers: {
            'Content-Type': 'application/yaml'
        },
        body: yaml
    })

    console.log(response)
}

const removeDummySite = ({ namespace, container_name }) => {
    console.log(`Deleted DummySite: ${container_name}`)
    sendRequestToApi(`/api/v1/namespaces/${namespace}/pods/${container_name}`, 'delete')
    sendRequestToApi(`/api/v1/namespaces/${namespace}/services/${container_name}-svc`, 'delete')

}
const maintainStatus = async () => {
    (await client.listPodForAllNamespaces()).body

    const dummysite_stream = new JSONStream()
    
    dummysite_stream.on('data', async ({ type, object }) => {
        const fields = fieldsFromDummySite(object)

        if(type === 'ADDED') {
            createPod(fields)
            createService(fields)
        }
        if(type === 'DELETED') {
            removeDummySite(fields)
        }
    })

    request.get(`${kc.getCurrentCluster().server}/apis/example.dwk/v1/dummysites?watch=true`, opts).pipe(dummysite_stream)
}

maintainStatus()