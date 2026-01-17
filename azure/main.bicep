@description('Azure region for regional resources (storage)')
param location string = 'ukwest'

@description('Location for CDN – must be "global"')
param cdn_location string = 'global'

@description('Name of the storage account (must be globally unique)')
param storage_account_name string

@description('Name of the blob container for static website (usually $web)')
param container_name string = '$web'

@description('Your custom domain name (must exist in Azure DNS)')
param custom_domain_name string = 'abdullateefoniresume.online'

var cdn_profile_name = 'cdn-${uniqueString(resourceGroup().id)}'
var cdn_endpoint_name = 'endpoint-${uniqueString(resourceGroup().id)}'

// ────────────────────────────────────────────────
// Storage Account (regional – ukwest)
// ────────────────────────────────────────────────
resource storageAccount 'Microsoft.Storage/storageAccounts@2023-05-01' = {
  name: storage_account_name
  location: location
  kind: 'StorageV2'
  sku: {
    name: 'Standard_LRS'
  }

  properties: {
    allowBlobPublicAccess: true   // ← must be true for container public access to work
    minimumTlsVersion: 'TLS1_2'
    supportsHttpsTrafficOnly: true

    staticWebsite: {
      enabled: true
      indexDocument: 'index.html'
    }
  }
}

// $web container – public Blob access
resource webContainer 'Microsoft.Storage/storageAccounts/blobServices/containers@2023-01-01' = {
  name: '${storageAccount.name}/default/${container_name}'
  dependsOn: [
    storageAccount
  ]

  properties: {
    publicAccess: 'Blob'
  }
}

// ────────────────────────────────────────────────
// CDN Profile (global)
// ────────────────────────────────────────────────
resource cdnProfile 'Microsoft.Cdn/profiles@2024-02-01' = {
  name: cdn_profile_name
  location: cdn_location   // ← global
  sku: {
    name: 'Standard_Microsoft'
  }
}

// CDN Endpoint (global)
resource cdnEndpoint 'Microsoft.Cdn/profiles/endpoints@2024-02-01' = {
  name: cdn_endpoint_name
  parent: cdnProfile
  location: cdn_location   // ← global

  properties: {
    originHostHeader: storageAccount.properties.primaryEndpoints.blobHost
    isHttpAllowed: false
    isHttpsAllowed: true
    queryStringCachingBehavior: 'IgnoreQueryString'
    contentTypesToCompress: [
      'text/plain'
      'text/html'
      'text/css'
      'application/javascript'
      'application/x-javascript'
      'application/json'
    ]
    isCompressionEnabled: true

    origins: [
      {
        name: 'storageOrigin'
        properties: {
          hostName: storageAccount.properties.primaryEndpoints.blobHost
        }
      }
    ]
  }
}

// Custom domain + Managed Certificate
resource cdnCustomDomain 'Microsoft.Cdn/profiles/endpoints/customDomains@2024-02-01' = {
  name: replace(custom_domain_name, '.', '-')
  parent: cdnEndpoint
  properties: {
    hostName: custom_domain_name
    tlsSettings: {
      certificateType: 'ManagedCertificate'
      minimumTlsVersion: 'TLS12'
    }
  }
}

// DNS CNAME (root domain)
resource dnsZone 'Microsoft.Network/dnsZones@2018-05-01' existing = {
  name: custom_domain_name
}

resource cnameRecord 'Microsoft.Network/dnsZones/CNAME@2018-05-01' = {
  parent: dnsZone
  name: '@'
  properties: {
    TTL: 3600
    CNAMERecord: {
      cname: cdnEndpoint.properties.hostName
    }
  }
}

// Outputs
output storageBlobEndpoint string = storageAccount.properties.primaryEndpoints.blob
output cdnEndpointHostname string = cdnEndpoint.properties.hostName
output customDomainUrl string = 'https://${custom_domain_name}'
