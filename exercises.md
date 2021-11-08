Task 1.01

- built and pushed to dockerhub image ```pndy/logoutput:1.01```
- created deployment using ```kubectl create deployment logoutput-1.01 --image=pndy/logoutput:1.01```
- checked output using
```
[pndy@fedora devopskubernetes]$ kubectl logs -f logoutput-1.01-7bc497cb86-4qqqx 
2021-10-30T00:25:22.814Z: hf264ej7bn-9ef7qhro5n-t6ltgkv39o
2021-10-30T00:25:27.818Z: hf264ej7bn-9ef7qhro5n-t6ltgkv39o
2021-10-30T00:25:32.823Z: hf264ej7bn-9ef7qhro5n-t6ltgkv39o
```

Task 1.02

- built and pushed a minimal express app to ```pndy/todoserver:1.02```
- created deployment using ```kubectl create deployment todoserver-1.02 --image=pndy/todoserver:1.02```
- checked output using
```
[pndy@fedora devopskubernetes]$ kubectl logs -f todoserver-1.02-6f466b6dfb-x8p5m 
Server started on port 3000
```

Task 1.03

- Created the ```manifests/deployment.yaml``` for logoutput
- deployed it using ```kubectl apply -f manifests/deployment.yaml``` 
- checked output using
```
[pndy@fedora LogOutput]$ kubectl logs -f logoutput-dep-58fbff8565-rxf9f 
2021-10-30T02:09:23.418Z: qkrbfd6pvj-8te4778mjq-2p88e23keg
2021-10-30T02:09:28.423Z: qkrbfd6pvj-8te4778mjq-2p88e23keg
```

Task 1.04

- Repeated task 1.03 for todoserver
- checked that server starts
```
[pndy@fedora todoserver]$ kubectl logs todoserver-dep-f7646944d-6b8d2 
Server started on port 3000
```

Task 1.05

- Made changes and pushed the new container to ```pndy/todoserver:1.05```
- modified and applied new deployment using ```kubectl apply -f manifests/deployment.yaml```
- Portforwarded the new pod by ```kubectl port-forward todoserver-dep-5f44bbc85c-q4xkm 3003:3000```
- confirmed server now serves ```http://localhost:3003```

Task 1.06

- Deleted & Recreated cluster opening ports 8082 to nodes and 8081 to loadbalancer using ```k3d cluster create --port 8082:30003@agent:0 -p 8081:80@loadbalancer --agents 2```
- created ```service.yaml``` for todoserver
- applied both manifests to cluster using ```kubectl apply -f manifests/<file.yaml>```
- confirmed i receive response from ```http://localhost:8082```

Task 1.07

- modified LogOutput to respond on '/logs', built and pushed to dockerhub
under ```pndy/logoutput:1.07```
- created service and ingress manifests for logoutput
- applied both changes using ```kubectl apply -f manifests/```
- confirmed it returns timestamp and hash on ```http://localhost:8081/logs``` and the hash updates every 5 seconds

Task 1.08

- modified ```service.yaml``` and added ```ingress.yaml``` for todoserver
- stopped logservice ingress ```kubectl delete -f manifests/ingress.yaml```
- applied todoserver using ```kubectl apply -f manifests/```
- confirmed its working at ```http://localhost:8081/```

Task 1.09

- Developed the application ```pingpong``` that responds to / route with ```pong 0``` with number increasing every request
- built/pushed to dockerhub ```pndy/pingpong:1.09```
- wrote deployment and service manifests, and modified logoutput ingress to include this, in addition to using rewrite-target to remove the kubernetes path /pingpong from application (that responds to /)
- spent a bunch of time looking up why above doesnt work, finding k3s ships with traefik v2, and that changed things, so looked up more how to do it with that
- created middleware for pingpong and added that as annotation to logoutput ingress
- applied all of above, confirmed pingpong now works in /pingpong and /logs still works as normal

Task 1.10

- Split logoutput into 2 logapps, one for generating and one for serving the hashes. they are at ```pndy/loggenerator:1.10``` and ```pndy/logoutput:1.10.1``` (had trouble with deployment getting a previous version even if i had pushed over it)
- modified ```deployment.yaml``` to support multiple containers and gave them a shared volume to share log data
- applied the deployment, and confirmed ```http://localhost:8081/logs``` and ```http://localhost:8081/pingpong``` were still working fine
- confirmed using Lens and going into both containers, that loggenerator was still logging the hashes and writing them to files/log.txt, and also that the files/log.txt was available from logoutput (just to make sure)

Task 1.11

- created ```persistentvolume.yaml``` and ```persistentvolumeclaim.yaml```, and created the folder in docker container.
- modified pingpong and logoutput applications to save/read from filepath specified in persistentvolume
- with some struggle on apps, finally managed to make it work that can be found on ```pndy/logoutput:1.11.1``` and ```pndy/pingpong:1.11.6```
-confirmed the data is persistent by deleting and recreating both deployments

Task 1.12

- Modified todoserver for showing image on main route, and the image changes every day its requested by comparing image creationdate to currentdate (might be inefficient way but its working), built and pushed as ```pndy/todoserver:1.12```
- modified othe other ingress to work for all 3 applications, and deleted todoserver original ingress. also updates its deployment for volume and container.
- applied all changes to cluster, made sure all 3 routes still work, and that image stays for multiple refreshes, and that it changes when the date is changed in computer. 

Task 1.13

- Modified todoserver, added the todos and form (currently using express and pug templating engine for frontend)
- built and pushed to ```pndy/todoserver:1.13```
- modified todoserver deployment for 1.13 tag.
- applied changes, tested and confirmed it now includes hardcoded todos and a form to add new ones.

Task 2.01

- modified logoutput to get data from the kubernetes service for pingpong app, and removed the shared volume from logoutput (keeping the hash share volume and the volume on pingpong side for restarts)
- deprecated the route for /pingpong from ingress as unnessecary
- built and pushed logoutput to ```pndy/logoutput:2.01.4```
- applied all manifests, and made sure /logs still works and increments the counter

Task 2.02

- Rebuilt almost all of the todoserver, into frontend (NextJS app) and backend (Express server, almost same as before).
- added manifests to both, built and pushed them as ```pndy/todoserver:2.02.1``` as backend and ```pndy/todofrontend:2.02.1``` as nextjs frontend. due to how nextjs, i didnt need to expose express backend to the world (as in, its not in ingress), and nextjs server side calls ```todoserver-svc:1234``` as the backend url
- applied manifests, tested that the frontpage works, /logs route still works as intended, and that adding new todos works in frontpage and stay with reloads.

Task 2.03 / 2.04

- Created both namespaces using ```kubectl create namespace apps-ns``` and ```kubectl create namespace project-ns```
- modified all relevant manifests to set the namespace.

- created 2 ExternalName services, to link services from different namespaces to the default namespace where the ingress is at. (good or bad?)

- made sure all routes still worked as usual (/logs still shows timestamp: hash and ping amounts, and / the frontend which can use the backend)

Task 2.05

- Installed kubeseal to machine & cluster, and added 'secret.yaml' to gitignore to prevent leaking.
- created test secret for logoutput, sealed it using ```kubeseal -o yaml <secret.yaml> sealedsecret.yaml``` and applied ```sealedsecret.yaml``` and modified ```deployment.yaml```.
- entered logoutput container shell, and made sure the env var was applied correctly ```echo $SERVICE_KEY```

Task 2.06

- Created configmap for logoutput, that just has .env file with 'MESSAGE=Hello', and applied it to cluster.
- modified logoutput app to use dotenv package, and print 'MESSAGE' env var on the logs output. Built and pushed to ```pndy/logoutput:2.06```
- Modified deployment to include configmap volume, and mounted it as a single file to the root app directory using subPath (great for single file into existing folder, painful for multiple files as you need separate volumeMounts for each file.)
- applied deployment, and made sure 'Hello' is printed on top on /logs

Task 2.07

- Created postgres StatefulSet and headless service in ```part2/manifests/postgres``` folder. also created needed ```secret.yaml```, which was sealed and applied for all 3 namespaces (using the same database for both application namespaces).
- removed the volume from pingpong application (probably should have removed earlier when it was made to be used from rest) and added env vars from earlier defined secrets (for pg pass), modified it to use the database (havent used Sequelize before so ugly code), and after some tinkering built and pushed to ```pndy/pingpong:2.07.10```.
- Applied the application, tested that its still working on /logs, removed both pingpong pod and postgres pod, one at a time, to make sure things were saving/working correctly

Task 2.08

- all the hard work was done in 2.07, so now i just needed to modify the todo backend to select and insert from database, built and pushed as ```pndy/todoserver:2.08.1```
- modified backend deployment so it gets the secrets as env vars.
- applied all, tested that there were no pre-determined todos, and adding them does insert them into database for page refreshes.

Task 2.09

- Created new Cronjob using ```https://kubernetes.io/docs/concepts/workloads/controllers/cron-jobs/``` as guide.
- Created, built and pushed ```pndy/dailytodo:2.09.2```, that lives in project-ns, connects to database and adds new Todo with ```<date>: <random wikipedia entry>```.
- applied cronjob to cluster, and made sure its correctly there ```kubectl get cronjobs -n project-ns``` (and also using Lens)

- I triggered the cronjob manually from Lens, and the execution was fine, it added the todo correctly and stopped the container.
unfortunately i dont think k3d liked that manual triggering much, as i got errors to events log and little bit after the cluster stopped working (atleast i couldnt reach the services from browser). deleted the pod and job objects the manual trigger made and restarted cluster and everything is fine again.
- just going to wait for actual cron runs to happen...

Task 2.10
- Installed Prometheus stack / Loki stack within their own namespaces.
- Modified todoserver to output consolemessages on todo additions (and errors), built and pushed to ```pndy/todoserver:2.10.2``` and applied to cluster.
- Port-forwarded Grafana using ```kubectl -n prometheus port-forward kube-prometheus-stack-1636319980-grafana-587b9dcbd5-4gc9g 3000```
- Made new dashboard in grafana, set the log query as as ```{app="todoserver"} |="TODO"``` and visualization as Logs.
- Output: [grafana panel showing logs](https://i.imgur.com/vxaLEUx.png)

- ps. Had bunch of problems with Loki and linux fsnotify limits, had to increase the inotify.max_user_watches = 512, and after that everything works fine.