# PowerShell script to open 4 separate terminals, each handling a different service

# Helper function to format multi-line command into one-liner for PowerShell
function Start-Terminal {
    param (
        [string]$Title,
        [string]$Script
    )
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "Start-Transcript -Path $env:TEMP\$Title.log -Append; $Script"
}

# 1. Cockatoo Gateway
Start-Terminal -Title "Gateway" -Script @'
& minikube -p minikube docker-env --shell powershell | Invoke-Expression;
cd C:\Git\s6-individual\cockatoo-gateway\CockatooGateway;
docker build -t cockatoo-gateway . --no-cache;
kubectl apply -f . --validate=false;
kubectl rollout restart deployment/cockatoo-gateway;
kubectl port-forward service/cockatoo-gateway 5000:5000
'@

# 2. Cockatoo Posts API
Start-Terminal -Title "PostsAPI" -Script @'
& minikube -p minikube docker-env --shell powershell | Invoke-Expression;
cd C:\Git\s6-individual\cockatoo-post-service\api;
docker build -t cockatoo-posts-api . --no-cache;
kubectl apply -f . --validate=false;
kubectl rollout restart deployment/cockatoo-posts-api;
kubectl port-forward service/cockatoo-posts-api 8080:8080
'@

# 3. Cockatoo Accounts API
Start-Terminal -Title "AccountsAPI" -Script @'
& minikube -p minikube docker-env --shell powershell | Invoke-Expression;
cd C:\Git\s6-individual\cockatoo-accounts-service;
docker build -t cockatoo-accounts-api . --no-cache;
kubectl apply -f . --validate=false;
kubectl rollout restart deployment/cockatoo-accounts-api;
kubectl port-forward service/cockatoo-accounts-api 9080:9080
'@

# 4. Cockatoo Frontend
Start-Terminal -Title "Frontend" -Script @'
& minikube -p minikube docker-env --shell powershell | Invoke-Expression;
cd C:\Git\s6-individual\cockatoo-frontend\cockatoo;
docker build -t cockatoo-frontend . --no-cache;
kubectl apply -f . --validate=false;
kubectl rollout restart deployment/cockatoo-frontend;
kubectl port-forward service/cockatoo-frontend 3000:3000
'@
