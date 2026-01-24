@description('Azure region for regional resources (storage). AFD is global.')
param location string

@description('Storage account name – must be globally unique (3–24 lowercase letters + digits)')
param storage_account_name string

@description('Your custom domain (e.g., abdullateefoniresume.online or www.abdullateefoniresume.online)')
param custom_domain_name string 

@description('Name of your existing Azure DNS zone that hosts the domain')
param dns_zone_name string 

// ────────────────────────────────────────────────
// Storage Account + Static Website enabled
// ────────────────────────────────────────────────
resource storageAccount 'Microsoft.Storage/storageAccounts@2023-05-01' = {
  name: storage_account_name
  location: location
  kind: 'StorageV2'
  sku: {
    name: 'Standard_LRS'
  }
  properties: {
    allowBlobPublicAccess: true
    minimumTlsVersion: 'TLS1_2'
    supportsHttpsTrafficOnly: true
    staticWebsite: {
      enabled: true
      indexDocument: 'index.html'
      errorDocument404Path: 'index.html'  // optional
    }
  }
}

// Static website origin host (web endpoint, not blob)
var staticHost = replace(
  replace(storageAccount.properties.primaryEndpoints.web, 'https://', ''),
  '/',
  ''
)

// ────────────────────────────────────────────────
// Front Door Profile + Endpoint
// ────────────────────────────────────────────────
resource frontDoorProfile 'Microsoft.Cdn/profiles@2024-02-01' = {
  name: 'fd-${uniqueString(resourceGroup().id)}'
  location: 'global'
  sku: {
    name: 'Standard_AzureFrontDoor'
  }
}

resource frontDoorEndpoint 'Microsoft.Cdn/profiles/afdEndpoints@2024-02-01' = {
  name: 'fd-endpoint-${uniqueString(resourceGroup().id)}'
  parent: frontDoorProfile
  location: 'global'
  properties: {
    enabledState: 'Enabled'
  }
}

// ────────────────────────────────────────────────
// Origin Group + Origin (storage static web)
// ────────────────────────────────────────────────
resource originGroup 'Microsoft.Cdn/profiles/originGroups@2024-02-01' = {
  name: 'storageOriginGroup'
  parent: frontDoorProfile
  properties: {
    loadBalancingSettings: {
      sampleSize: 4
      successfulSamplesRequired: 3
    }
    healthProbeSettings: {
      probePath: '/index.html'
      probeRequestType: 'HEAD'
      probeProtocol: 'Https'
      probeIntervalInSeconds: 100
    }
    sessionAffinityState: 'Disabled'
  }
}

resource origin 'Microsoft.Cdn/profiles/originGroups/origins@2024-02-01' = {
  name: 'storageOrigin'
  parent: originGroup
  properties: {
    hostName: staticHost
    originHostHeader: staticHost
    httpPort: 80
    httpsPort: 443
    priority: 1
    weight: 1000
    enabledState: 'Enabled'
  }
}

// ────────────────────────────────────────────────
// DNS Zone (existing)
// ────────────────────────────────────────────────
resource dnsZone 'Microsoft.Network/dnsZones@2018-05-01' existing = {
  name: dns_zone_name
}

// ────────────────────────────────────────────────
// Custom Domain + Managed Certificate
// ────────────────────────────────────────────────
resource customDomain 'Microsoft.Cdn/profiles/customDomains@2024-02-01' = {
  name: replace(custom_domain_name, '.', '-')
  parent: frontDoorProfile
  properties: {
    hostName: custom_domain_name
    azureDnsZone: {
      id: dnsZone.id
    }
    tlsSettings: {
      certificateType: 'ManagedCertificate'
      minimumTlsVersion: 'TLS12'
    }
  }
}

// ────────────────────────────────────────────────
// Route – binds endpoint + origin group + custom domain
// ────────────────────────────────────────────────
resource route 'Microsoft.Cdn/profiles/afdEndpoints/routes@2024-02-01' = {
  name: 'defaultRoute'
  parent: frontDoorEndpoint
  properties: {
    originGroup: {
      id: originGroup.id
    }
    supportedProtocols: [
      'Http'
      'Https'
    ]
    patternsToMatch: [
      '/*'
    ]
    forwardingProtocol: 'MatchRequest'
    linkToDefaultDomain: 'Disabled'
    httpsRedirect: 'Enabled'
    customDomains: [
      {
        id: customDomain.id
      }
    ]
    cacheConfiguration: {
      queryStringCachingBehavior: 'IgnoreQueryString'
      compressionSettings: {
        contentTypesToCompress: [
          'text/plain'
          'text/html'
          'text/css'
          'application/javascript'
          'application/x-javascript'
          'application/json'
        ]
        isCompressionEnabled: true
      }
    }
  }
}

// ────────────────────────────────────────────────
// Outputs
// ────────────────────────────────────────────────
output storageBlobEndpoint string = storageAccount.properties.primaryEndpoints.web
output frontDoorEndpointHostname string = frontDoorEndpoint.properties.hostName
output customDomainUrl string = 'https://${custom_domain_name}'
