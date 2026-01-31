@description('Azure region for regional resources (storage). AFD is global.')
param location string

@description('Storage account name – must be globally unique (3–24 lowercase letters + digits)')
param storage_account_name string

@description('Your custom domain (e.g., abdullateefoniresume.online or www.abdullateefoniresume.online)')
param custom_domain_name string 

param apex_domain_name string 

@description('Name of your existing Azure DNS zone that hosts the domain')
param dns_zone_name string 





// ────────────────────────────────────────────────
// Storage Account + Static Website enabled
// ────────────────────────────────────────────────
resource storageAccount 'Microsoft.Storage/storageAccounts@2021-09-01' = {
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
/* all resources that were commented out were because we would be redirecting to cloudflare and all previous resources from CDN or front door would not be needed
// ────────────────────────────────────────────────
// Front Door Profile + Endpoint
// ────────────────────────────────────────────────
resource frontDoorProfile 'Microsoft.Cdn/profiles@2025-06-01' = {
  name: 'fd-${uniqueString(resourceGroup().id)}'
  location: 'global'
  sku: {
    name: 'Standard_AzureFrontDoor'
  }
}

resource frontDoorEndpoint 'Microsoft.Cdn/profiles/afdEndpoints@2025-06-01' = {
  name: 'fd-endpoint-${uniqueString(resourceGroup().id)}'
  parent: frontDoorProfile
  location: 'global'
  properties: {
    enabledState: 'Enabled'
  }
}

// Rule set that performs apex -> www redirect
resource rulesetApex 'Microsoft.Cdn/profiles/ruleSets@2025-04-15' = {
  name: 'rulesetApexRedirect'
  parent: frontDoorProfile
}


//Rule (child resource of the ruleset)
resource apexToWwwRule 'Microsoft.Cdn/profiles/ruleSets/rules@2025-04-15' = {
  name: 'apexToWwwRedirect'
  parent: rulesetApex
  properties: {
    order: 2
    actions: [
      {
        name: 'UrlRedirect'
        parameters: {
          redirectType: 'Moved'              // 301 (use 'PermanentRedirect' if you prefer 308)
          destinationProtocol: 'Https'
          customHostname: custom_domain_name       // e.g., "www.andrewbrownresume.net"
          // customPath/customQueryString/customFragment optional
          typeName: 'DeliveryRuleUrlRedirectActionParameters'
        }
      }
    ]
  }
}


// ────────────────────────────────────────────────
// Origin Group + Origin (storage static web)
// ────────────────────────────────────────────────
resource originGroup 'Microsoft.Cdn/profiles/originGroups@2025-06-01' = {
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
*/
/*
resource origin 'Microsoft.Cdn/profiles/originGroups/origins@2025-06-01' = {
  name: 'storageOrigin'
  parent: originGroup
  properties: {
    hostName: staticHost
    originHostHeader: staticHost
    httpPort: 80
    httpsPort: 443
    priority: 1
    weight: 1000
  }
}
*/

/*we wont be needing Azure dns, Dns zone and custom domain since we would we redirecting to cloudflare
// ────────────────────────────────────────────────
// DNS Zone (existing)
// ────────────────────────────────────────────────
resource dnsZone 'Microsoft.Network/dnsZones@2018-05-01' existing = {
  name: dns_zone_name
}

// ────────────────────────────────────────────────
// Custom Domain + Managed Certificate
// ────────────────────────────────────────────────
resource customDomain 'Microsoft.Cdn/profiles/customDomains@2025-06-01' = {
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

*/// ────────────────────────────────────────────────
/*
resource apexDomain 'Microsoft.Cdn/profiles/customDomains@2025-06-01' = {
  name: replace(apex_domain_name, '.', '-')
  parent: frontDoorProfile
  properties: {
    hostName: apex_domain_name
    azureDnsZone: {
      id: dnsZone.id
    }
    tlsSettings: {
      certificateType: 'ManagedCertificate'
      minimumTlsVersion: 'TLS12'
    }
  }
}
*/
/*
// ────────────────────────────────────────────────
// Route – binds endpoint + origin group + custom domain
// ────────────────────────────────────────────────
resource route 'Microsoft.Cdn/profiles/afdEndpoints/routes@2025-06-01' = {
  name: 'defaultRoute'
  parent: frontDoorEndpoint
  properties: {
    originGroup: { id: originGroup.id }
    supportedProtocols: [ 'Http', 'Https' ]
    httpsRedirect: 'Enabled'
    linkToDefaultDomain: 'Disabled'
    customDomains: [ { id: customDomain.id } ]
    patternsToMatch: [ '/*' ]
    forwardingProtocol: 'MatchRequest'
    enabledState: 'Enabled'
  }
}

*/
/*
resource routeApexWww 'Microsoft.Cdn/profiles/afdEndpoints/routes@2025-06-01' = {
  name: 'routeRedirect'
  parent: frontDoorEndpoint
  properties: {
    originGroup: { id: originGroup.id }
    customDomains: [ { id: apexDomain.id } ]
    //patternsToMatch: [ '/*' ]
    supportedProtocols: [ 'Http', 'Https' ]
    linkToDefaultDomain: 'Disabled'
    ruleSets: [ { id: rulesetApex.id } ]

    // no originGroup here — we are *redirecting*, not forwarding
    forwardingProtocol: 'MatchRequest'
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
*/


// ────────────────────────────────────────────────
// Outputs
// ────────────────────────────────────────────────
output storageBlobEndpoint string = storageAccount.properties.primaryEndpoints.web
/*output frontDoorEndpointHostname string = frontDoorEndpoint.properties.hostName */
output customDomainUrl string = custom_domain_name
