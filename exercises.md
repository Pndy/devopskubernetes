## Task 1.01

- built and pushed to dockerhub image ```pndy/logoutput:1.01```
- created deployment using ```kubectl create deployment logoutput-1.01 --image=pndy/logoutput:1.01```
- checked output using
```
[pndy@fedora devopskubernetes]$ kubectl logs -f logoutput-1.01-7bc497cb86-4qqqx 
2021-10-30T00:25:22.814Z: hf264ej7bn-9ef7qhro5n-t6ltgkv39o
2021-10-30T00:25:27.818Z: hf264ej7bn-9ef7qhro5n-t6ltgkv39o
2021-10-30T00:25:32.823Z: hf264ej7bn-9ef7qhro5n-t6ltgkv39o
```

## Task 1.02

- built and pushed a minimal express app to ```pndy/todoserver:1.02```
- created deployment using ```kubectl create deployment todoserver-1.02 --image=pndy/todoserver:1.02```
- checked output using
```
[pndy@fedora devopskubernetes]$ kubectl logs -f todoserver-1.02-6f466b6dfb-x8p5m 
Server started on port 3000
```

## Task 1.03

- Created the ```manifests/deployment.yaml``` for logoutput
- deployed it using ```kubectl apply -f manifests/deployment.yaml``` 
- checked output using
```
[pndy@fedora LogOutput]$ kubectl logs -f logoutput-dep-58fbff8565-rxf9f 
2021-10-30T02:09:23.418Z: qkrbfd6pvj-8te4778mjq-2p88e23keg
2021-10-30T02:09:28.423Z: qkrbfd6pvj-8te4778mjq-2p88e23keg
```

## Task 1.04

- Repeated task 1.03 for todoserver
- checked that server starts
```
[pndy@fedora todoserver]$ kubectl logs todoserver-dep-f7646944d-6b8d2 
Server started on port 3000
```

## Task 1.05

- Made changes and pushed the new container to ```pndy/todoserver:1.05```
- modified and applied new deployment using ```kubectl apply -f manifests/deployment.yaml```
- Portforwarded the new pod by ```kubectl port-forward todoserver-dep-5f44bbc85c-q4xkm 3003:3000```
- confirmed server now serves ```http://localhost:3003```

## Task 1.06

- Deleted & Recreated cluster opening ports 8082 to nodes and 8081 to loadbalancer using ```k3d cluster create --port 8082:30003@agent:0 -p 8081:80@loadbalancer --agents 2```
- created ```service.yaml``` for todoserver
- applied both manifests to cluster using ```kubectl apply -f manifests/<file.yaml>```
- confirmed i receive response from ```http://localhost:8082```

## Task 1.07

- modified LogOutput to respond on '/logs', built and pushed to dockerhub
under ```pndy/logoutput:1.07```
- created service and ingress manifests for logoutput
- applied both changes using ```kubectl apply -f manifests/```
- confirmed it returns timestamp and hash on ```http://localhost:8081/logs``` and the hash updates every 5 seconds

## Task 1.08

- modified ```service.yaml``` and added ```ingress.yaml``` for todoserver
- stopped logservice ingress ```kubectl delete -f manifests/ingress.yaml```
- applied todoserver using ```kubectl apply -f manifests/```
- confirmed its working at ```http://localhost:8081/```

## Task 1.09

- Developed the application ```pingpong``` that responds to / route with ```pong 0``` with number increasing every request
- built/pushed to dockerhub ```pndy/pingpong:1.09```
- wrote deployment and service manifests, and modified logoutput ingress to include this, in addition to using rewrite-target to remove the kubernetes path /pingpong from application (that responds to /)
- spent a bunch of time looking up why above doesnt work, finding k3s ships with traefik v2, and that changed things, so looked up more how to do it with that
- created middleware for pingpong and added that as annotation to logoutput ingress
- applied all of above, confirmed pingpong now works in /pingpong and /logs still works as normal

## Task 1.10

- Split logoutput into 2 logapps, one for generating and one for serving the hashes. they are at ```pndy/loggenerator:1.10``` and ```pndy/logoutput:1.10.1``` (had trouble with deployment getting a previous version even if i had pushed over it)
- modified ```deployment.yaml``` to support multiple containers and gave them a shared volume to share log data
- applied the deployment, and confirmed ```http://localhost:8081/logs``` and ```http://localhost:8081/pingpong``` were still working fine
- confirmed using Lens and going into both containers, that loggenerator was still logging the hashes and writing them to files/log.txt, and also that the files/log.txt was available from logoutput (just to make sure)

## Task 1.11

- created ```persistentvolume.yaml``` and ```persistentvolumeclaim.yaml```, and created the folder in docker container.
- modified pingpong and logoutput applications to save/read from filepath specified in persistentvolume
- with some struggle on apps, finally managed to make it work that can be found on ```pndy/logoutput:1.11.1``` and ```pndy/pingpong:1.11.6```
-confirmed the data is persistent by deleting and recreating both deployments

## Task 1.12

- Modified todoserver for showing image on main route, and the image changes every day its requested by comparing image creationdate to currentdate (might be inefficient way but its working), built and pushed as ```pndy/todoserver:1.12```
- modified othe other ingress to work for all 3 applications, and deleted todoserver original ingress. also updates its deployment for volume and container.
- applied all changes to cluster, made sure all 3 routes still work, and that image stays for multiple refreshes, and that it changes when the date is changed in computer. 

## Task 1.13

- Modified todoserver, added the todos and form (currently using express and pug templating engine for frontend)
- built and pushed to ```pndy/todoserver:1.13```
- modified todoserver deployment for 1.13 tag.
- applied changes, tested and confirmed it now includes hardcoded todos and a form to add new ones.

## Task 2.01

- modified logoutput to get data from the kubernetes service for pingpong app, and removed the shared volume from logoutput (keeping the hash share volume and the volume on pingpong side for restarts)
- deprecated the route for /pingpong from ingress as unnessecary
- built and pushed logoutput to ```pndy/logoutput:2.01.4```
- applied all manifests, and made sure /logs still works and increments the counter

## Task 2.02

- Rebuilt almost all of the todoserver, into frontend (NextJS app) and backend (Express server, almost same as before).
- added manifests to both, built and pushed them as ```pndy/todoserver:2.02.1``` as backend and ```pndy/todofrontend:2.02.1``` as nextjs frontend. due to how nextjs, i didnt need to expose express backend to the world (as in, its not in ingress), and nextjs server side calls ```todoserver-svc:1234``` as the backend url
- applied manifests, tested that the frontpage works, /logs route still works as intended, and that adding new todos works in frontpage and stay with reloads.

## Task 2.03 / 2.04

- Created both namespaces using ```kubectl create namespace apps-ns``` and ```kubectl create namespace project-ns```
- modified all relevant manifests to set the namespace.

- created 2 ExternalName services, to link services from different namespaces to the default namespace where the ingress is at. (good or bad?)

- made sure all routes still worked as usual (/logs still shows timestamp: hash and ping amounts, and / the frontend which can use the backend)

## Task 2.05

- Installed SOPS / Age, created key for secret and put it as correct envvar for decrypting.
- Created new secret.yaml, encrypted it using sops to secret.enc.yaml
- Deleted secret.yaml and decrypted it succesfully

- What i also did:
- Installed kubeseal to machine & cluster, and added 'secret.yaml' to gitignore to prevent leaking.
- created test secret for logoutput, sealed it using ```kubeseal -o yaml <secret.yaml> sealedsecret.yaml``` and applied ```sealedsecret.yaml``` and modified ```deployment.yaml```.
- entered logoutput container shell, and made sure the env var was applied correctly ```echo $SERVICE_KEY```

## Task 2.06

- Created configmap for logoutput, that just has .env file with 'MESSAGE=Hello', and applied it to cluster.
- modified logoutput app to use dotenv package, and print 'MESSAGE' env var on the logs output. Built and pushed to ```pndy/logoutput:2.06```
- Modified deployment to include configmap volume, and mounted it as a single file to the root app directory using subPath (great for single file into existing folder, painful for multiple files as you need separate volumeMounts for each file.)
- applied deployment, and made sure 'Hello' is printed on top on /logs

## Task 2.07

- Created postgres StatefulSet and headless service in ```part2/manifests/postgres``` folder. also created needed ```secret.yaml```, which was sealed and applied for all 3 namespaces (using the same database for both application namespaces).
- removed the volume from pingpong application (probably should have removed earlier when it was made to be used from rest) and added env vars from earlier defined secrets (for pg pass), modified it to use the database (havent used Sequelize before so ugly code), and after some tinkering built and pushed to ```pndy/pingpong:2.07.10```.
- Applied the application, tested that its still working on /logs, removed both pingpong pod and postgres pod, one at a time, to make sure things were saving/working correctly

## Task 2.08

- all the hard work was done in 2.07, so now i just needed to modify the todo backend to select and insert from database, built and pushed as ```pndy/todoserver:2.08.1```
- modified backend deployment so it gets the secrets as env vars.
- applied all, tested that there were no pre-determined todos, and adding them does insert them into database for page refreshes.

## Task 2.09

- Created new Cronjob using ```https://kubernetes.io/docs/concepts/workloads/controllers/cron-jobs/``` as guide.
- Created, built and pushed ```pndy/dailytodo:2.09.2```, that lives in project-ns, connects to database and adds new Todo with ```<date>: <random wikipedia entry>```.
- applied cronjob to cluster, and made sure its correctly there ```kubectl get cronjobs -n project-ns``` (and also using Lens)

- I triggered the cronjob manually from Lens, and the execution was fine, it added the todo correctly and stopped the container.
unfortunately i dont think k3d liked that manual triggering much, as i got errors to events log and little bit after the cluster stopped working (atleast i couldnt reach the services from browser). deleted the pod and job objects the manual trigger made and restarted cluster and everything is fine again.
- just going to wait for actual cron runs to happen...

## Task 2.10
- Installed Prometheus stack / Loki stack within their own namespaces.
- Modified todoserver to output consolemessages on todo additions (and errors), built and pushed to ```pndy/todoserver:2.10.2``` and applied to cluster.
- Port-forwarded Grafana using ```kubectl -n prometheus port-forward kube-prometheus-stack-1636319980-grafana-587b9dcbd5-4gc9g 3000```
- Made new dashboard in grafana, set the log query as as ```{app="todoserver"} |="TODO"``` and visualization as Logs.
- Output: [grafana panel showing logs](https://i.imgur.com/vxaLEUx.png)

- ps. Had bunch of problems with Loki and linux fsnotify limits, had to increase the inotify.max_user_watches = 512, and after that everything works fine.


## Task 3.01

- after setting up GCP/GKE, created new cluster ```gcloud container clusters create dwk-gke-cluster --zone=europe-north1-b --release-channel=rapid --cluster-version=1.22```
- modified postgres manifests to fit GKE, and deployed it and the needed secrets succesfully.
- modified pingpong app (removed middleware due to GKE using different ingress controller), and made the service into LoadBalancer.
- Applied the new app to cluster, tested that the ExternalIP service gives routes to the PingPong App, and that its connected to the postgres database correctly and counts the pongs.

## Task 3.02

- Modified pingpong to use NodePort and added ingress, and tested these working.
- Added logapps, and modified it for GKE
- added default route http 200 responses to both apps due to ingress requiring it.
- applied all, and made sure /pingpong responded with "pong <amount>" and /logs responded with the configmap message, loggenerator generated hash and timestamp, and the pong amount gotten from pingpong app.
- ps. currently everything is on default namespace as im working thru this.

## Task 3.03

- modified todoapps frontend and backend to work on GKE
- Added kustomization files for both projects
- made workflow to build, publish to GCR and deploy to GKE
- after many tries, the workflow worked
- Github workflow: https://i.imgur.com/SYLC2Gc.png
- Lastly, added / route to ingress for frontend, and tested that the apps work together. Frontend gets the image from backend, and you are able to add todos that save to database.
- ps. currently everything on default namespace

## Task 3.04

- Added namespaced deployments to workflow.
- Also had to copy the ```pg-secret``` from default namespace to newly created namespace due to project backend requiring database access.

## Task 3.05

- Made new workflow ```delete.yaml```, and made the job run ```kubectl delete namespace <branchname>```.
- Tested this out by creating new branch ```feature-1```, pushed it to github and let the 3.04 workflow create the environment (Confirmed recources were created).
- After making sure resources existed and were properly deployed, i deleted the branch from github and watched as the delete workflow started running.
- After workflow completed succesfully, confirmed that all the previously generated recourses (Project deployment on feature-1 namespace) were deleted.

- at this point, i also stopped github from running actions as i didnt want them to be ran everytime i updated anything.

## Task 3.06

- DBaaS
    - Pros
        - Ready to be used
        - SLA
        - you dont need to worry about managing
        - sane defaults
        - Integrated into the environment (easy access from other gcloud services)
        - additional features (easy database migration)
    - Cons
        - more expensive at start (db-standard-1 starts out at ~51$/m, similar specs)
        - Not as much control (might not be able to choose postgres or maria/mysql, might not be able to which release)
- DIY
    - Pros
        - Starting out cheaper (n1-standard-1 starts out at ~25$/m, similar specs)
        - More Control over everything
        - More static pricing (scaling is x$ amount per new node, no per use charges)
    - Cons
        - Cost overhead (cost of setting up, maintaining)
        - Probably need to hire expert to manage things
        - need to manage backups,snapshots yourself

## Task 3.07

- Ive chosen to continue using Postgres, as i had already deployed it into GKE for pingpong and todo apps earlier.

## Task 3.08

- As i looked from GCP metrics, both of them are using less than 50mb of ram, so ive limited it to 100mb incase it somewhat increases.
- Cpu is harder to estimate, as for just me spam refreshing it, it spikes, but not that high so i limited it to quarter of a core (250m).

## Task 3.09

- did the same spam refresh test on /logs, and watched the metrics.
- I limited loggenerator and pingpong to "100m" cpu and "100Mi", due to both being light apps just occasionally generating data for others
- set "250m" to logoutput due to it being more of a data server, that has a bigger possibility of spiking.

- I also checked the graphs at GCP after applying 3.08 and 3.09 limits, to see how they look regarding the spikes and they look good/well within limits

## Task 3.10

- Checked that Cloud Logging API was enabled (it was by default)
- Entered the "Logs Explorer", filtered containers by name
- Logs: https://i.imgur.com/JVZrVCC.png
- ps. on grafana i was able to filter out the default sequelize database logging,

## Task 3.XX

- I went back to check if i would be able to separate the applications into different namespaces, but due to Google's ingress controller not allowing ExternalNames (the way i used in part 2), i was not able to do it.

## Task 4.01

- Added Lightship to pingpong and logoutput apps, and made them report ready in correct points (logoutput checks connection to pingpong, and pingpong check for db)
- added readinessProbes to both logapps and pingpong, using lightship reporting (and filesystem check on loggenerator)
- tested by deleting db deployment that both logoutput and pingpong fail to start, started db and looked as pingpong worked on next restart, and same for logoutput

## Task 4.02

 - Added lightship to todo backend
 - added readiness and liveness checks to both, backend using lightship and frontend using the next api's that connect to backend
 - Tested that both of them fail readiness/liveness without database, but applying it they both start working fine

## Task 4.03

 - ```count(count(kube_pod_info{namespace="prometheus", created_by_kind="StatefulSet"}) by (uid))```
 - returns: ```{} 2```

## Task 4.04

 - Tested prometheus rate query on prometheus client (like above)
 - Created and applied AnalysisTemplate for prject using above cpu rate query
 - added analysistemplates to todo deployments
 - made sure they run correctly

## Task 4.05
 
 - Added completed to frontend and backend
 - Tested that it works, not much else

## Task 4.06

 - Installed NATS to kubernetes from helm
 - modifed backend to publish to nats
 - created todoconsumer, thats subscribed to backend using queue workers, that will print them to consumers console
 - spammed actions on frontend to make sure queue works, and only one consumer gets each message (but still get distributed to different consumers)

## Task 4.07

 - installed flux to pc, set github token and all that
 - bootstrapped flux to new github repo, found at ```https://github.com/Pndy/kube-cluster-gitops```
 - setup this repo as source (had to make it public)
 - setup pingpong app as test 'deployment'
 - Deleted and recreated cluster, so its started from 0
 - bootstrapped from the github repo, and looked as flux deployed the pingpong app (currently not working due to no db yet)

 ## Task 4.08

 - made nats and argo-rollouts helm deployments using gitops
 - made todoapp (frontend and backend) deployment using gitops
 - made postgres deployment using gitops (excluding secrets)
 - made ingress deployment using gitops
 - made sure everything works together

 - created github actions to build and publish backend to dockerhub, and commit to github

## Task 5.01

 - looked over the examples from material-examples
 - tried making it in golang, switched to nodejs real quick

 - created manifests based on examples
 - created controller, and after multiple iterations its at ```pndy/dummysite-c:5.1.14```
 - created base app at ```pndy/dummysite:5.1.1```
 - applied all (everything else, but dummysite separately)
 - made sure pod and service are created, port forwarded service to see that its working correctly (lens made it easy)
 - made sure deleting base dummysite deployments deletes the associated pod and service

 - it has some problems, but its working

## Task 5.02

 - injecting the todoconsumer was successful, as it was normal Deployment
 - as backend and frontend were switched over to rollouts, injecting didnt work. needed to change them back to deployments and inject them.
 - opened the viz dashboard, to make sure everything was properly meshed

## Task 5.03

 - followed the canary release task
 - image of the result is on ```part5/part5-03.png```

## Task 5.04

### OpenShift against Anthos GKE

 - Has Managed/Self-Managed options, when Anthos GKE only has managed
 - Pure Multi-cloud options, when Anthos still needs ateast GCloud
 -  OpenShift is Cerfitied Kubernetes Distribution, whereas Anthos doesnt seem to be
 - OpenShift is its own platform, while Anthos is more of a backend to use different cloud platforms like GKE
 - OpenShift Certified software Marketplace is more expansive than Google cloud markeplace for Anthos
 - OpenShift had initial release on 2011, while Anthos 1.0 was released 2019
 - (Preference) RedHat being better parent company than Google

## Task 5.05

 - I chose OpenFaaS as i had heard of it before.
 - I deleted the current cluster, and created a blank one (Might not have needed to do that, but initially had problems so it was easier)
 - Installed OpenFaaS using arkade, and port forwarded as explained
 - installed Postgres from part4 folder to cluster
 - installed faas-cli, created new function using it
 - adapted previous pingpong app to work with openfaas
 - created openfaas secret, where the application gets the postgres pass
 - built, pushed to ```pndy/pingless:5.5```, and deployed to OpenFaaS automatically using faas-cli up
 - tested it working, that it increases pongs counter for every request

## Task 5.06
Also on ```part5/cncf-landscape.png```

- MongoDB (Outside this course)
- MariaDB (Outside this course)
- CockroachDB (Outside this course)
- PostgresDB (Used as a database from part 2)

- Nats (Used in part4 for message queue)

- Bitnami (docker images - might have been used inside this course)
- Eclipse Che (Online IDE - outside the course)
- Gitpod (Online IDE - outside the course)
- Gradle (Java build system - outside the course)
- OpenAPI (outside the course)
- Podman (Docker alt - outside the course)

- Argo (CI/CD - From part 4 for rollouts)
- Flux (CI/CD - From part 4 for gitops)
- Github Actions (CI/CD from part 3 )
 
- K3s (Used by K3d thats being used in this course)
- OpenShift (Outside this course)
 
- Kubernetes (Used this whole course)
 
- Etcd (Used by k3d/k3s internally in the background)
- CoreDNS (Used by k3d/k3s internally in the background)
 
- gRPC (outside this course)
 
- Nginx (outside this course)
- Traefik (Used by k3s as default reverse proxy)
 
- Linkerd (Used as service mesh on part 5)
 
- Google Container Registry (used as container registry on part 3)
- Google Kubernetes Engine (used as hosted kubernetes service on part 3)

- Heroku (used outside this course)

- Prometheus (Used for monitoring from part 2)
- Grafana (Used for monitoring from part 2)
- Grafana Loki (Used for monitoring from part 2)
 
- OpenFaaS (Used as a serverless platform on part 5)

