# Running minikube

```ps
kubectl apply -f .
```

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
