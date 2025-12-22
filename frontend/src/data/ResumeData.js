const resumeData = {
  person: {
    name: "Abdullateef Oni",
    email: "abdullateefoni@yahoo.com",
    phone: "+234 803 123 4567",
    website: "www.example.com"
  },

  projects: [
    {
      title: "Securing Hub-and-Spoke Azure Networks with Azure Firewall and Point-to-Site VPN",
      link: "https://github.com/El-magnificoxxii/Azure-Refresher/blob/main/Point-to-Site-Connection",
      date: "June 2025",
      summary:
        "Designed and implemented a secure Azure network architecture combining centralized traffic control with remote user connectivity.",
      highlights: [
        "Created a hub-style Azure Virtual Network with dedicated subnets for Azure Firewall, GatewaySubnet, and workload resources.",
        "Deployed Azure Firewall and configured firewall policies to control outbound and inbound traffic using application and network rules.",
        "Implemented user-defined routes (UDRs) to force internet-bound and inter-VNet traffic through Azure Firewall for inspection.",
        "Deployed an Azure VPN Gateway and configured Point-to-Site (P2S) VPN connectivity to enable secure remote access for users.",
        "Generated and deployed VPN client certificates and validated authentication and connectivity from external client machines.",
        {
          title: "Tested end-to-end traffic flow to confirm:",
          items: [
            "VPN clients could securely access internal Azure resources",
            "Traffic routing adhered to firewall and UDR policies"
          ]
        }
      ]
    },
    {
      title: "Hosting Multiple IIS Websites on Azure Using Application Gateway and HTTPS",
      link: "https://github.com/El-magnificoxxii/Azure-Refresher/tree/main/azure-webserver-windows",
      date: "July 2025",
      summary:
        "Built and documented a multi-phase Azure infrastructure project to host multiple IIS-based websites on a single Windows Server virtual machine.",
      highlights: [
        "Deployed a Windows Server 2022 Datacenter VM in a custom Azure Virtual Network with IIS installed and configured.",
        "Hosted two independent websites on the same VM using IIS bindings on ports 80 and 8080.",
        "Integrated custom DNS using DuckDNS to assign public domain names to each website.",
        "Re-architected access using Azure Application Gateway with host-based routing.",
        "Configured backend pools, routing rules, and host header overrides.",
        "Implemented HTTPS using Let’s Encrypt certificates generated via Win-ACME and enforced HTTP-to-HTTPS redirection."
      ]
    },
    {
      title: "Azure FinOps Power BI Dashboard",
      link: "https://github.com/El-magnificoxxii/Azure-FinOps-PowerBI-Dashboard-1.0",
      date: "November 2025",
      summary:
        "Built a Power BI dashboard to analyze and visualize Azure cost and usage data using FinOps principles.",
      highlights: [
        "Ingested sample Azure CSP daily usage data for modeling and reporting.",
        {
          title: "Developed interactive visuals to show:",
          items: [
            "Top services by spend and cost per service",
            "Daily cost trends to identify anomalies",
            "Regional consumption patterns"
          ]
        }
      ]
    }
  ],

  skills: {
    cloudPlatforms: ["Azure", "AWS"],
    infrastructureAsCode: [
      "Terraform",
      "Azure Bicep",
      "ARM Templates",
      "PowerShell",
      "Bash"
    ],
    finOps: [
      "Reserved Instances",
      "Azure Hybrid Benefit",
      "Savings Plan",
      "Azure Pricing Calculator"
    ],
    security: [
      "Azure Firewall",
      "Checkpoint CloudGuard",
      "Zero Trust",
      "Defender for Cloud"
    ],
    others: ["Git", "GitHub", "SQL", "Power BI", "Excel"],
    languages: ["Yoruba", "English"]
  },

  certifications: [
    "FinOps Certified Practitioner",
    "FinOps Certified FOCUS Analyst",
    "AWS Certified Solutions Architect – Associate",
    "Azure Administrator Associate",
    "Microsoft Licensing Specialist Azure Solutions",
    "Microsoft Certified: Security, Compliance, and Identity Fundamentals",
    "Microsoft Licensing Specialist CSP Program",
    "Microsoft Licensing Specialist On-Premises"
  ],

  experience: [
    {
      company: "TD Africa Distributions Ltd",
      location: "Lagos, Nigeria",
      role: "Azure Technical Presales",
      duration: "Jul 2021 - Present",
      responsibilities: [
        "Designed scalable Azure architectures aligned with Microsoft Well-Architected Framework.",
        "Conducted detailed cost modeling using Azure Pricing and TCO Calculators.",
        "Advised on Azure Hybrid Benefit and Reserved Instances achieving up to 70% cost reduction.",
        "Managed Azure presales lifecycle including EA to CSP migrations.",
        "Delivered demos, PoCs, and technical workshops on Azure services.",
        "Performed environment assessments using Block 64 to identify security and optimization gaps.",
        "Collaborated with solution architects and Microsoft teams for production-ready deployments."
      ]
    },
    {
      company: "TD Africa Distributions Ltd",
      location: "Lagos, Nigeria",
      role: "Checkpoint Technical Presales",
      duration: "Nov 2021 - Aug 2022",
      responsibilities: [
        "Deployed and managed Checkpoint Infinity Portal across hybrid environments.",
        "Monitored Windows and macOS systems for performance and security issues.",
        "Delivered technical workshops and PoCs for Checkpoint security solutions."
      ]
    }
  ],

  education: [
    {
      institution: "University of Lagos",
      location: "Lagos, Nigeria",
      degree: "BSc, Mechanical Engineering"
    }
  ]
};


export default resumeData;