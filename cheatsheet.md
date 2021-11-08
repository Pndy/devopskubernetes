Commands:

k3d cluster create --port 8082:30003@agent:0 -p 8081:80@loadbalancer --agents 2

k3d cluster <start/stop>

export KUBECONFIG=$(k3d kubeconfig write)

kubectl <apply/delete> -f <folder/manifest>

kubectl <get/delete/describe> <pods/deployments/services..> -n <namespace> -l <labelname=label>

kubectl create namespace <namespace name>

kubectl label <pod/deployment..> <name> <labelname=label>

External Tools:

SealedSecrets <https://github.com/bitnami-labs/sealed-secrets#installation>
kubeseal -o yaml <secret.yaml> sealedsecret.yaml
                 ^ needs brackets

kubectl -n prometheus port-forward <kube-prometheus-stack-grafana> <port>