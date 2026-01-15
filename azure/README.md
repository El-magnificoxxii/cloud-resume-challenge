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
