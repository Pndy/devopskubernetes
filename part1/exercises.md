Task 1.01

- built and pushed to dockerhub image pndy/logoutput:1.01
- created deployment using ```kubectl create deployment logoutput-1.01 --image=pndy/logoutput:1.01```
- checked output using
```
[pndy@fedora devopskubernetes]$ kubectl logs -f logoutput-1.01-7bc497cb86-4qqqx 
2021-10-30T00:25:22.814Z: hf264ej7bn-9ef7qhro5n-t6ltgkv39o
2021-10-30T00:25:27.818Z: hf264ej7bn-9ef7qhro5n-t6ltgkv39o
2021-10-30T00:25:32.823Z: hf264ej7bn-9ef7qhro5n-t6ltgkv39o
```