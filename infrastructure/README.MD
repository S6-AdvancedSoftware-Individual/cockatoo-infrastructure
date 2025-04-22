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

`kubectl apply -f .`

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

### Validate existence of secrets

`kubectl get secret cockatoo-global-secret -o jsonpath='{.data}'`

### Validate logs

`kubectl logs -f deployment/cockatoo-accounts-api --tail=50`
`kubectl logs -f deployment/cockatoo-posts-api --tail=50`

## Building images

Run these in the right repos

```ps
docker build -t cockatoo-accounts-api .
docker build -t cockatoo-posts-api .
docker build -t cockatoo-frontend .
docker build -t cockatoo-gateway .
```

Add this option ``--no-cache`` behind any of these commands to force an Image rebuild

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

Make sure to use ``imagePullPolicy: IfNotPresent`` to use local images over remote images.

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
