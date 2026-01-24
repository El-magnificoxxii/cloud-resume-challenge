# Azure DNS Setup Journal - Delegating Domain from Hostinger

**Date:** January 10, 2026  
**Registrar:** Hostinger  
**DNS Provider:** Azure DNS

## Steps Performed

1. **Created DNS Zone in Azure**
   - Azure Portal → DNS zones → Create new zone

2. **Copied Azure Name Servers**
   - After zone creation, Azure provided 4 name servers (they all ended with a trailing dot)

3. **Updated Nameservers at Hostinger**
   - Hostinger → Domains → Manage → Nameservers → Custom nameservers
   - Pasted the 4 Azure name servers

4. **Issue Encountered**
   - Error: **"Invalid nameserver structure"**

5. **Solution that Worked**
   - Removed the trailing dot (`.`) from each nameserver  
     Example:  
     Before: `nsX-XX.azure-dns.com.`  
     After: `nsX-XX.azure-dns.com`  
   - Applied to all four → saved successfully  
   **Note:** Azure displays nameservers **with** trailing dot (correct per DNS standard), but Hostinger rejects them when the dot is included. Removing it is the common & working fix.

6. **Verification Attempts**
   - **In GitHub Codespaces:**
     - First try: `sudo apt install` → failed
     - Successful: `sudo apt update && sudo apt install whois` → worked
     - Then ran: `whois [domain]` to view current nameservers


7. **Current Status**
   - ✅ Nameservers successfully updated at Hostinger (custom NS pointing to Azure)
   - ✅ DNS has propagated globally (confirmed via multiple online checkers)
   - ✅ The domain now resolves using the name servers listed **in the Azure DNS zone**  
     (Azure portal shows the correct SOA/NS records being authoritative)
   - Propagation was relatively fast (~few hours)

## Key Lessons Learned

- Remove trailing `.` when pasting Azure nameservers into Hostinger (very frequent gotcha)
- In minimal dev environments: run `sudo apt update` first before installing packages
- `whois` is a lightweight way to quickly check current nameservers
- Once propagation finishes, the Azure DNS zone itself becomes the authoritative source — confirmed directly in the Azure portal (NS/SOA records match)

# Deployment Journal – Bicep + Ansible in Codespaces

Date range: January 12, 2026  
Environment: GitHub Codespaces (Ubuntu-based)

Goal: Use Ansible to deploy a Bicep template for a Premium Storage Account.

## Initial Plan

Use `azure.azcollection.azure_rm_deployment` module with compiled ARM JSON.

Expected flow:
1. `az bicep build` → compiled.json
2. Load JSON → ansible_rm_deployment

we were able to Deploy Bicep template using Ansible `azure_rm_deployment` module.

## Major Problems were: 

i was able to solve using AI:https://grok.com/share/c2hhcmQtMw_f88a6926-1caa-49a2-adb3-6e9d4bc967c2 

1. **Bicep compilation worked from the start**  
   - `az bicep build` always succeeded  
   - JSON loading via `lookup('file', ...)` always OK

2. **azure_rm_deployment module import failure**  
   - Error evem after installing venv:  
     `Failed to import the required Python library (ansible[azure] (azure >= 2.0.0))`  
   - Tried `pip install ansible[azure]` → warning: no extra 'azure'  
   - SDK packages installed manually, imports worked in shell (`python -c "import azure.mgmt.storage"` printed OK), but module still failed

3. **PEP 668 externally-managed-environment**  
   - Blocked pip on `/usr/bin/python3`  
   - Error:  
     `error: externally-managed-environment ... create a virtual environment`  
   - Solution: Created venv `ansible-azure-venv`

4. **Interpreter mismatch**  
   - Ansible used `/usr/bin/python3` instead of venv  
   - Tried `ansible_python_interpreter: "{{ ansible_env.VIRTUAL_ENV }}/bin/python"` → failed: `'ansible_env' is undefined`  
   - Solution: Hardcoded path:  
     `ansible_python_interpreter: /workspaces/cloud-resume-challenge/azure/playbooks/ansible-azure-venv/bin/python`

5. **Requirements file format issue**  
   - Had `requirements.txt` with collections section  
   - `ansible-galaxy` ignored or failed  
   - Renamed to `requirements.yml`  
   - Re-ran: `ansible-galaxy collection install -r requirements.yml --force` → recognized correctly

   it then succeded and resources was created in azure but terminal was still throwing error, which led to step 6

6. **json_query filter error**  
   - Error:  
     `You need to install "jmespath" prior to running json_query filter`  
   - Fix: `pip install jmespath`

7. **Multiple storage accounts created**  
   - Dynamic name created new account each run (e.g. abdullateefoni255637, abdullateefoni255869)  
   - Deleted older one via Azure portal GUI

## What finally worked

- Venv active + hardcoded interpreter  
- Switched to CLI fallback (bypassed module):  

```yaml
- ansible.builtin.command: >
    az deployment group create ...
  register: deployment_result
  changed_when: "'Succeeded' in deployment_result.stdout"


# Updating Blob Container in Deployed Storage Account
Date range: January 13, 2026  
Environment: GitHub Codespaces (Ubuntu-based)

- **Regex-based naming** caused new storage accounts to be created on each deployment run  
- **Storage account name was hardcoded** to stabilize and fix the deployments

## First Attempt (using Azure CLI)
```text
Error BCP156: The resource type segment "blobServices/containers@2023-05-01" is invalid.
```

This happened because the resource type path was incorrect.

## Second Attempt (Bicep – incorrect hierarchy)

```bicep
resource resumeContainer 'containers@2023-05-01' = {
  name: 'resume-content'
  properties: {
    publicAccess: 'None'
  }
}

Error received:
```text
HttpResourceNotFound:
The request URL .../storageAccounts/<name>/containers/resume-content was not found
```

## Final Working Solution
- Corrected the proper resource hierarchy for blob containers
- Added explicit dependsOn to make sure the storage account exists first
- Passed the blob container name as a parameter in the deploy.yml workflow
- Fixed the container name rules:
   - Blob containers do NOT allow dots (.) in the name
   - Replaced all dots with hyphens (-)



# Azure Storage Account

## Azure Storage Limitation: Block Blobs Not Supported in Premium_LRS Accounts

**Date**: January 14, 2026  
**Context**: Attempting to upload static website files to `$web` container using `az storage blob upload-batch` in `upload.yml`.

### What happened

After switching from the failing `azure_rm_storageblob` module to CLI commands (to avoid Python SDK import errors), the batch upload task failed with:
```text
 ERROR: Block blobs are not supported.
 ErrorCode:BlobTypeNotSupported
```

### Root cause

The storage account (`abdullateefoni346088`) was created with:

- `kind: 'StorageV2'`
- `sku.name: 'Premium_LRS'`

**Premium block blob accounts** (Premium_LRS) are **optimized for high-performance workloads** (e.g. databases, VMs, analytics), but they have strict limitations:

- They **only support page blobs and append blobs** for most operations
- **Block blobs** (the default blob type used by `az storage blob upload` and `upload-batch`) are **explicitly not supported**
- Result: Any attempt to upload files as block blobs (which is what `upload-batch` does) fails with `BlobTypeNotSupported`

This limitation is documented in Azure docs (Premium block blobs section):
> Premium block blob storage accounts do not support block blobs for upload operations.

### How we arrived at this point

1. Original deployment (`deploy.yml`):
   - Used Bicep with `sku: { name: 'Premium_LRS' }` → account created as Premium
   - No uploads yet → no problem

2. Attempted upload with Ansible module (`azure_rm_storageblob`):
   - Failed due to repeated Python SDK import errors (`Failed to import ... ansible[azure]`)

3. Switched to CLI (`az storage blob upload-batch`):
   - Avoided import issues (great!)
   - But hit Azure limitation instead — Premium account rejects block blob uploads

### Lessons learned

- Premium_LRS accounts are **not suitable** for static website hosting or general file uploads (block blobs blocked)
- Standard_LRS / Standard_GRS (general-purpose v2) are the right choice for static sites:
  - Full block blob support
  - Cheaper
  - Works with `upload-batch`
- Always check account SKU/tier before using batch operations


# January 14–15, 2026 – Issues Encountered while uploading upload.yml

### Phase Goal
Complete the upload of all static website files (`index.html` + assets + top-level files) to the `$web` container using Ansible + Azure CLI, with correct `Cache-Control` headers, and confirm the site is publicly accessible.

#### 1. Variable name confusion (earlier runs)
- **Problem**: 'storage_name_account' is undefined or 'storage_account' is undefined
- **Root cause**: deploy.yml used storage_name_account while upload.yml referenced storage_account or storage_name_account inconsistently.

**Solution**:
Standardized on storage_account_name in vars: and all tasks:

#### 2. Permissions issue (resolved earlier but worth noting)
- **Problem**: "You do not have the required permissions... Storage Blob Data Contributor

**Solution**:
Assigned RBAC:
```bash
az role assignment create \
  --assignee xxx.onmicrosoft.com \
  --role "Storage Blob Data Contributor" \
  --scope /subscriptions/.../storageAccounts/abdullateefoni346088

```

#### 3. Persistent "unrecognized arguments: --cache-control no-store" 
- **Problem**:While running `upload.yml` to deploy frontend assets to Azure Blob Storage, the playbook failed on the `azure_rm_storageblob` module.
- **Symptoms**:
  - Assets upload → worked perfectly every time
  - Cache update on assets → worked (using `--content-cache-control`)
  - Every single index.html upload → failed with rc=2 see error mesaage:

```text
ERROR: unrecognized arguments: --cache-control no-store
```
- **Attempts that failed**:
- `--cache-control "no-store"` (double quotes)
- `--cache-control 'no-store'` (single quotes)
- **Root cause** (discovered via ChatGPT + `az storage blob upload --help`):
- `--cache-control` is **NOT** a valid parameter for `az storage blob upload` / `upload-batch`.
- The correct flag for setting the `Cache-Control` response header on the uploaded blob is **`--content-cache-control`**.


- **Solution**:
Replaced `--cache-control` with `--content-cache-control` in the index.html task:
```yaml
- --content-cache-control
- no-store



# January 15–16, 2026 – Adding Managed SSL + Custom Domain (abdullateefoniresume.online) via Azure DNS

### Goal
Attach custom domain `abdullateefoniresume.online` to the CDN/Front Door setup with a **free Azure-managed SSL certificate** (auto-renewing), while managing DNS records in **Azure DNS**.

### Initial Approach (Classic Azure CDN)
Started with classic Azure CDN (Standard_Verizon SKU) + custom domain + managed certificate.

**Initial Bicep snippet attempted**:
```bicep
resource cdnCustomDomain 'Microsoft.Cdn/profiles/endpoints/customDomains@2024-02-01' = {
  name: replace(custom_domain_name, '.', '-')
  parent: endpoint
  properties: {
    hostName: custom_domain_name
    tlsSettings: {
      certificateType: 'ManagedCertificate'
      minimumTlsVersion: 'TLS12'
    }
  }
}

### Issues Encountered (Classic CDN phase)

1. **Location validation failure**  
   - **Error code**: `LocationNotAvailableForResourceType`  
   - **Message**: `'ukwest' is not available for resource type 'Microsoft.Cdn/profiles'`  
   - **Allowed regions**: `global, australiaeast, australiasoutheast, brazilsouth, canadacentral, canadaeast, centralindia, centralus, eastasia, eastus, eastus2, japaneast, japanwest, northcentralus, northeurope, southcentralus, southindia, southeastasia, westeurope, westindia, westus, westcentralus` (no `ukwest`)  
   - **Root cause**: Classic CDN profiles are **global resources**, not regional — they can only be deployed in `'global'` or specific allowed regions.  
   - **Solution**: Changed CDN profile & endpoint `location` to `'global'`.

2. **Verizon SKU deprecation**  
   - **Error**: `"Verizon SKU is not supported anymore."`  
   - **Root cause**: Azure deprecated new creations of `Standard_Verizon` (and Premium_Verizon) classic CDN profiles.  
   - **Solution**: Switched to `Standard_Microsoft` SKU.

3. **Public access blocked on storage account**  
   - **Error**: `"Public access is not permitted on this storage account."`  
   - **Root cause**: `allowBlobPublicAccess` was `false` (or unset) at the storage account level, which blocks container-level `publicAccess: 'Blob'` even when explicitly set.  
   - **Solution**: Set `allowBlobPublicAccess: true` on the storage account (required for CDN to pull content anonymously from the `$web` container).

4. **Microsoft classic CDN also deprecated**  
   - **Error**: `"Azure CDN from Microsoft (classic) no longer support new profile creation."`  
   - **Root cause**: Microsoft fully deprecated **classic CDN** (all SKUs: Verizon, Microsoft, etc.) for new profile creations as of late 2025/early 2026.  
   - **Solution**: Migrated to **Azure Front Door** (the modern replacement for classic CDN).

# January 18–24, 2026 – Final Phase: Static Hosting, Upload, Cert Propagation, and Custom Domain Live
### Issue: $web container not auto-created / static hosting disabled after multiple deploys

- Portal → Storage → Configuration → Static website = Disabled
- Upload failed with "container does not exist"
- Redeploy (without delete) didn't enable it again

### Root Cause

- Bicep template included creating web container from storage account rather than automatically from static website
- Azure auto-creates $webonly on initial account creation or manual portal enablement
- Redeploy without deletion skips container creation

### Solutions
- i redeployed bicep template, this time i didnt add container resource, as it would be automatically created

### Issue: $web container was empty,and after deploying frontdoor, url abdullateefoniesume.online was pointing to error 404

### Solutions
- i didnt redeploy upload.yml after deleting the previous container and creating a new container

# Issue: Permissions during upload
### Symptoms
- "You do not have the required permissions... Storage Blob Data Contributor"

### Root Cause

```text
ERROR:
--auth-mode login requires explicit Storage Blob Data Contributor role on the storage account
```
### Solution

- Assigned role in portal (IAM → + Add → Storage Blob Data Contributor → your user)
Or fallback: --auth-mode key in upload tasks

### Outcome

- Upload succeeded after role assignment

### Final Status – January 24, 2026

- Site live: https://abdullateefoniresume.online (root domain + HTTPS padlock)
- Storage endpoint: https://abdullateefoni346088.z35.web.core.windows.net/
- Front Door default: fd-endpoint-prtqllz6hqg4a-hsduf2a7h7a8fda5.a02.azurefd.net
- Pipeline: deploy.yml (infra + force-enable static hosting) + upload.yml (content)
- Fully automated: No manual portal steps after final fixes

