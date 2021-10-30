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