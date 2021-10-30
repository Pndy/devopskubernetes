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
checked output using
```
[pndy@fedora LogOutput]$ kubectl logs -f logoutput-dep-58fbff8565-rxf9f 
2021-10-30T02:09:23.418Z: qkrbfd6pvj-8te4778mjq-2p88e23keg
2021-10-30T02:09:28.423Z: qkrbfd6pvj-8te4778mjq-2p88e23keg
```