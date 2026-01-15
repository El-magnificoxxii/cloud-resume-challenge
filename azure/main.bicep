
param storage_account_name string
param container_name string

//https://learn.microsoft.com/en-us/azure/templates/microsoft.storage/storageaccounts?pivots=deployment-language-bicep
param location string
resource storageaccount 'Microsoft.Storage/storageAccounts@2021-02-01' = {
  name: storage_account_name 
    location: location
      kind: 'StorageV2'
        sku: {
            name: 'Standard_LRS'
        }
    
}

// https://learn.microsoft.com/en-us/azure/templates/microsoft.storage/storageaccounts/blobservices/containers?pivots=deployment-language-bicep
resource blobcontainer 'Microsoft.Storage/storageAccounts/blobServices/containers@2025-06-01' = {
  name: '${storage_account_name}/default/${container_name}'
  dependsOn: [
    storageaccount
  ]

}

