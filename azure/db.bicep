@description('Cosmos DB account for a simple visitor counter')
param location string = 'ukwest'  // or 'northeurope' — choose closest to you

@description('Unique name for the Cosmos DB account (globally unique)')
param cosmos_account_name string = 'crcviewcounter02022026'

@description('Database name')
param database_name string = 'CounterDB'

@description('Container name – single partition')
param container_name string = 'Counter'

resource cosmosAccount 'Microsoft.DocumentDB/databaseAccounts@2024-05-15' = {
  name: cosmos_account_name
  location: location
  kind: 'GlobalDocumentDB'
  properties: {
    databaseAccountOfferType: 'Standard'
    locations: [
      {
        locationName: location
        failoverPriority: 0
      }
    ]
    capabilities: [
      {
        name: 'EnableServerless'
      }
    ]
    enableAutomaticFailover: false
    enableMultipleWriteLocations: false
    isVirtualNetworkFilterEnabled: false
    backupPolicy: {
      type: 'Periodic'
      periodicModeProperties: {
        backupIntervalInMinutes: 240
        backupRetentionIntervalInHours: 8
      }
    }
    // Free tier is enabled automatically if account is eligible
    // No need to set anything extra – Azure applies it on first use
  }
}

resource database 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases@2024-05-15' = {
  name: '${cosmosAccount.name}/${database_name}'
  dependsOn: [
    cosmosAccount
  ]
  properties: {
    resource: {
      id: database_name
    }
  }
}

resource container 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers@2024-05-15' = {
  name: '${database.name}/${container_name}'
  dependsOn: [
    database
  ]
  properties: {
    resource: {
      id: container_name
      partitionKey: {
        paths: ['/id']  // single partition – we only have one document
        kind: 'Hash'
      }
      defaultTtl: -1  // no TTL
      //analyticalStorageTtl: -1
    }
    //options: {
      //throughput: -1  // serverless → no RU provisioning
    //}
  }
}

// Optional: Output the connection string (use in Function App settings)
output connectionString string = listConnectionStrings(cosmosAccount.id, cosmosAccount.apiVersion).connectionStrings[0].connectionString

// Optional: Output endpoint & key (for local development)
output endpoint string = cosmosAccount.properties.documentEndpoint
output primaryKey string = listKeys(cosmosAccount.id, cosmosAccount.apiVersion).primaryMasterKey

