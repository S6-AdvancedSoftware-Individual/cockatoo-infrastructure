# Index

- [Index](#index)
  - [Running minikube](#running-minikube)
  - [Refresh .env secrets](#refresh-env-secrets)
    - [Reload deployments](#reload-deployments)
    - [Validate existence of secrets](#validate-existence-of-secrets)
    - [Validate logs](#validate-logs)
  - [Building images](#building-images)
  - [Validate existence of Docker Images](#validate-existence-of-docker-images)
  - [Adding Docker (local) images to cache](#adding-docker-local-images-to-cache)
  - [Validate Docker Images are present in MiniKube](#validate-docker-images-are-present-in-minikube)
  - [Use local images configuration](#use-local-images-configuration)
  - [Check \& port foward](#check--port-foward)
  - [HPA (Horizontal Pod Autoscaling)](#hpa-horizontal-pod-autoscaling)
  - [AKS shizzle](#aks-shizzle)
    - [Login](#login)
    - [Get resource group state](#get-resource-group-state)
  - [Frontend HTTPS drama](#frontend-https-drama)

## Running minikube

Create a local `.env` file with the following data:

```plaintext
DB_POSTS_USERID=
DB_POSTS_PASSWORD=
DB_POSTS_SERVER=
DB_POSTS_PORT=
DB_POSTS_DATABASE=

DB_ACCOUNTS_USERID=
DB_ACCOUNTS_PASSWORD=
DB_ACCOUNTS_SERVER=
DB_ACCOUNTS_PORT=
DB_ACCOUNTS_DATABASE=
```

Run

```ps
kubectl apply -f .
```

## Refresh .env secrets

```ps
kubectl delete secret cockatoo-global-secret
kubectl create secret generic cockatoo-global-secret --from-env-file=.env
```

### Reload deployments

For accounts service
`kubectl rollout restart deployment/cockatoo-accounts-api`

For posts service
`kubectl rollout restart deployment/cockatoo-posts-api`

```ps
kubectl rollout restart deployment/cockatoo-gateway
```

```ps
kubectl rollout restart deployment/cockatoo-frontend
```

### Validate existence of secrets

`kubectl get secret cockatoo-global-secret -o jsonpath='{.data}'`

### Validate logs

`kubectl logs -f deployment/cockatoo-accounts-api --tail=50`

`kubectl logs -f deployment/cockatoo-posts-api --tail=50`

```ps
kubectl logs -f deployment/cockatoo-gateway --tail=50
```

```ps
kubectl logs -f deployment/cockatoo-frontend --tail=50
```

## Building images

Run these in the right repos

```ps
docker build -t cockatoo-accounts-api .
docker build -t cockatoo-posts-api .
docker build -t cockatoo-frontend .
docker build -t cockatoo-gateway .

or

docker compose build --no-cache
```

Add this option `--no-cache` behind any of these commands to force an Image rebuild

## Validate existence of Docker Images

```ps
docker images
```

## Adding Docker (local) images to cache

```ps
minikube image load cockatoo-accounts-api
minikube image load cockatoo-posts-api
minikube image load cockatoo-frontend
minikube image load cockatoo-gateway
kubectl apply -f .
```

## Validate Docker Images are present in MiniKube

Run this in an elevated Powershell instance.

```ps
minikube ssh
docker image ls
```

## Use local images configuration

Make sure to use `imagePullPolicy: IfNotPresent` to use local images over remote images.

## Check & port foward

Find all services

```ps
kubectl get services
```

```ps
kubectl port-forward service/<SERVICE_NAME> <REQUESTED_ACTUAL_PORT>:<INTERNAL_POD_PORT>
```

e.g:

```ps
kubectl port-forward service/cockatoo-accounts-api 9080:9080
kubectl port-forward service/cockatoo-posts-api 8080:8080
kubectl port-forward service/cockatoo-frontend 5173:5173
kubectl port-forward service/cockatoo-gateway 5000:5000
```

## HPA (Horizontal Pod Autoscaling)

```ps
kubectl autoscale deployment cockatoo-gateway --cpu-percent=70 --min=1 --max=3
kubectl autoscale deployment cockatoo-posts-api --cpu-percent=70 --min=1 --max=3
```

## AKS shizzle

**All AZ commands need to be logged in first.**

### Login

```ps
az aks get-credentials --resource-group AdvancedSoftwareIndividual --name myNewAKSCluster
```

### Get resource group state

```ps
az aks show --name myAKSCluster --resource-group myResourceGroup
```

## Frontend HTTPS drama

1. Install NGINX Ingress Controller

```ps
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.10.1/deploy/static/provider/cloud/deploy.yaml
```

Wait a few seconds, then get the external IP:

```ps
kubectl get service ingress-nginx-controller -n ingress-nginx
```

2. Pick a Dynamic Domain

Use nip.io, which maps IPs to fake DNS:

<your-ip>.nip.io

Example: 131.189.137.141.nip.io

3. Install cert-manager for TLS automation

```ps
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.14.4/cert-manager.yaml
```

4. Set up Let’s Encrypt ClusterIssuer

```ps
# cert-issuer.yaml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-http
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: your-email@example.com
    privateKeySecretRef:
      name: letsencrypt-http-private-key
    solvers:
      - http01:
          ingress:
            class: nginx
```

Apply:

kubectl apply -f cert-issuer.yaml

https://chatgpt.com/g/g-QgiQ408Af-azure-architect/c/6838447e-212c-800c-8800-10f42cb07f53
