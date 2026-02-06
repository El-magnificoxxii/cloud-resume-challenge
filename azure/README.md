## Checking Updated Nameservers

After I changed the nameservers for my third-party domain  
I checked to make sure they were updated using the whois command:

```sh
sudo apt install whois
whois abdullateefoniresume.online | grep "Name Server"

```


## Install Azure Bicep

we could use Terraform but then we would have to mange
the statefile, and if a company only uses Azure they  
lean towards using Azure Bicep.

```sh
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash

```


## Login to Azure

```sh
az login

```


### Install Ansible

Although we dont need ansible to run azure bicep we want to do various configuration chnages like uploading web site files so lets use ansible because it is more flexible than bash or powershell scripting

```sh
pipx install --include-deps ansible
```

## Install Deps for Ansible

```sh
cd azure
ansible-galaxy collection install -r requirements.txt
```

```sh
/usr/local/py-utils/venvs/ansible/bin/python -m pip install --upgrade pip
/usr/local/py-utils/venvs/ansible/bin/python -m pip install --upgrade "ansible[azure]"

```


## Setup Steps (venv + deps)
### Create & activate dedicated venv
```sh
python3 -m venv ansible-azure-venv
source ansible-azure-venv/bin/activate
```

### Install Ansible + collections
```sh
pip install --upgrade pip setuptools wheel
pip install ansible ansible[azure] jmespath
```

### Install Azure collection
```sh
ansible-galaxy collection install azure.azcollection --force
```

### Install required Azure SDK packages (critical!)
```sh
pip install \
  azure-common \
  azure-mgmt-resource \
  azure-mgmt-storage \
  azure-identity \
  msrestazure \
  azure-mgmt-authorization \
  azure-core \
  azure-mgmt-core\
```

### To deploy IAC through runbook for storage account and containers
```sh
cd /workspaces/cloud-resume-challenge/azure/playbooks
source ansible-azure-venv/bin/activate
ansible-playbook deploy.yml -vvv
```

### To assign Storage Blob Data Contributor
```bash
az role assignment create \
  --assignee xxx.onmicrosoft.com \
  --role "Storage Blob Data Contributor" \
  --scope /subscriptions/.../storageAccounts/abdullateefoni346088

```

### To run scripts from the playbook

```bash
ansible-playbook purge.yml -vvv  # to purge frontdoor
ansible-playbook deploy.yml -vvv # to deploy infrastructure in main.bicep
ansible-playbook upload.yml -vvv # to upload files into storage container
ansible-playbook purge-cloudflare.yml -vvv # to purge Azure frontdoor
ansible-playbook deploy-db.yml -vvv # to deploy cosmos db
```
### checking DNS resolution and ensuring apex is redirecting to frontdoor

```bash
curl -I https://abdullateefoniresume.online
```


```bash
HTTP/2 200
date: Sun, 25 Jan 2026 00:08:18 GMT
content-type: text/html
content-length: 773
cache-control: no-store
content-md5: Kzwxgf2uVnxxxxxxxxxxx==
last-modified: Sat, 24 Jan 2026 15:44:55 GMT
etag: xxxxxxxxxxxxxxxxxx
x-ms-request-id: xxxxxxxxxxxxxxxxxx
x-ms-version: 2018-03-28
x-azure-ref: 20260125T000818Z-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
x-fd-int-roxy-purgeid: 1
x-cache: PRIVATE_NOSTORE
accept-ranges: bytes
```


### To verify $web container exists

```bash
az storage container list \
  --account-name abdullateefoni346088 \
  --auth-mode login \
  --output table
```
# Edit Vault
## We are going to store all sensitive information here for security

# Create a vault inside your playbooks to store secrets like token_id from cloudflare, and then you can run the following commands

```bash
ansible-vault create playbooks/vaults/prod.yml #to create yml to store secrets
ansible-vault edit playbooks/vaults/prod.yml  #to edit yml 
ansible-vault view playbooks/vaults/prod.yml  #to view secret files
```

# To Run Purge For cloudflare 

```bash
ansible-playbook purge-cloudflare.yml --ask-vault-pass -vvv ### --ask-vault-pass is added because the tokens in cloudflare are secured in a vault
```



# To Test Count from function

```bash
curl -X POST https://viewcounterapps.azurewebsites.net/api/http_trigger
```