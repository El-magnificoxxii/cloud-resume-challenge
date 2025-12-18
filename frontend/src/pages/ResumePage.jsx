import React from "react";
import 'css/pages/resume.css'
export default function ResumePage() {
  return (
    <>
      <section className="header">
        <h1>Abdullateef Oni</h1>
        <p>
            &bull;
            <a href="mailto:abdullateefoni@yahoo.com">abdullateefoni@yahoo.com</a>
            &bull; |
            &bull;
            +234 803 123 4567
            &bull; | 
            &bull;
            www.example.com
            &bull;
        </p>
      </section>
      <section className="projects">
        <h2>PROJECTS</h2>
        <div className="items">
            <div className="item">
                <div className="item_heading">
                    <h3><a href="https://github.com/El-magnificoxxii/Azure-Refresher/blob/main/Point-to-Site-Connection">Securing Hub-and-Spoke Azure Networks with Azure Firewall and Point-to-Site VPN</a></h3>
                    <div className="duration">June 2025</div>
                </div>
                <p>Designed and implemented a secure Azure network architecture combining centralized traffic control with remote user connectivity.</p>
                <ul>
                    <li>Created a hub-style Azure Virtual Network with dedicated subnets for Azure Firewall, GatewaySubnet, and workload resources.</li>
                    <li>Deployed Azure Firewall and configured firewall policies to control outbound and inbound traffic using application and network rules.</li>
                    <li>Implemented user-defined routes (UDRs) to force internet-bound and inter-VNet traffic through Azure Firewall for inspection.</li>
                    <li>Deployed an Azure VPN Gateway and configured Point-to-Site (P2S) VPN connectivity to enable secure remote access for users.</li>
                    <li>Generated and deployed VPN client certificates and validated authentication and connectivity from external client machines.</li>
                    <li>Tested end-to-end traffic flow to confirm <ul><li>VPN clients could securely access internal Azure resources</li><li>Traffic routing adhered to firewall and UDR policies</li></ul></li>
                </ul>
            </div>
            <div className="item">
                <div className="item_heading">
                    <h3><a href="https://github.com/El-magnificoxxii/Azure-Refresher/tree/main/azure-webserver-windows">Hosting Multiple IIS Websites on Azure Using Application Gateway and HTTPS</a></h3>
                    <div className="duration">July 2025</div>
                </div>
                <p>Built and documented a multi-phase Azure infrastructure project to host multiple IIS-based websites on a single Windows Server virtual machine, evolving from basic port-based access to secure, production-style host-based routing with HTTPS.</p>
                <ul>
                    <li>Deployed a Windows Server 2022 Datacenter VM in a custom Azure Virtual Network and subnet, with IIS installed and configured to serve web content.</li>
                    <li>Hosted two independent websites on the same VM using IIS bindings on ports 80 and 8080, and validated access using both local and external testing.</li>
                    <li>Integrated custom DNS using DuckDNS to assign public domain names to each website.</li>
                    <li>Re-architected access using Azure Application Gateway (Layer 7) with multi-site listeners and host header-based routing, eliminating the need for port-based URLs</li>
                    <li>Configured backend pools, routing rules, and host header overrides to ensure IIS correctly served content based on the requested domain.</li>
                    <li>Implemented HTTPS using free Let’s Encrypt certificates generated with Win-ACME, uploaded PFX certificates to Azure Application Gateway, and enforced HTTP-to-HTTPS redirection.</li>
                </ul>
            </div>
            <div className="item">
                <div className="item_heading">
                    <h3><a href="https://github.com/El-magnificoxxii/Azure-FinOps-PowerBI-Dashboard-1.0">Azure FinOps Power BI Dashboard</a></h3>
                    <div className="duration">November 2025</div>
                </div>
                <p>Built a Power BI dashboard to analyze and visualize Azure cost and usage data, applying FinOps principles for cloud cost governance and optimization.</p>
                <ul>
                    <li>Ingested sample Azure CSP daily usage data and modeled it for reporting and analysis.</li>
                    <li>Developed interactive visuals to provide insights into:
                        <ul>
                            <li>Top services by spend and cost per service</li>
                            <li>Daily cost trends to identify spikes or anomalies</li>
                            <li>Regional consumption patterns</li>

                        </ul>
                    </li>
                </ul>
            </div>
        </div>
      </section>
      <section className="skills">
        <h2>SKILLS</h2>
        <div className="item">
            <ul>
                <li><strong>Cloud Platforms : </strong>Azure, AWS</li>
                <li><strong>IaC & Automation : </strong>Terraform, Azure Bicep, ARM Templates, PowerShell, Bash</li>
                <li><strong>FinOps & Cloud Cost Management : </strong>Reserved Instances, Azure Hybrid Benefit, Savings Plan, Azure Pricng Calculator</li>
                <li><strong>Security :</strong> Azure Firewall, Checkpoint CloudGuard, Zero Trust, Defender for Cloud</li>
                <li><strong>Others : </strong> Git, Github, SQL, Power BI, Excel</li>
                <li><strong>Languages:</strong> Yoruba, English</li>
            </ul>
        </div>
      </section>
      <section className="skills">
        <h2>CERTIFICATIONS</h2>
        <div className="item">
            <ul>
                <li>FinOps Certified Practitioner </li>
                <li>FinOps Certified FOCUS Analyst</li>
                <li>AWS Certified Solutions Architect – Associate</li>
                <li>Azure Administrator Associate</li>
                <li>Microsoft Licensing Specialist Azure Solutions</li>
                <li> Microsoft Certified: Security, Compliance, and Identity Fundamentals</li>
                <li>Microsoft Licensing Specialist CSP Program</li>
                <li>Microsoft Licensing Specialist Onpremises</li>
            </ul>
        </div>
      </section>
      <section className="experience">
        <h2>PROFESSIONAL EXPERIENCE</h2>
        <div className="items">
            <div className="item">
                <div className="item_heading">
                    <h3>TD Africa Distributions ltd, - Lagos, Nigeria</h3>
                    <div className="duration">Jul 2021 - Present</div>
                </div>
                <div>Azure Technical Presales</div>
                <ul>
                    <li>Designed scalable Azure architectures and solution diagrams based on customer workloads and business requirements, aligning with Microsoft Well-Architected Framework principles.</li>
                    <li>Conducted detailed cost modeling and optimization using Azure Pricing Calculator and TCO Calculator, delivering accurate pre-migration cost projections for compute, storage, networking, and database resources.</li>
                    <li>Advised on Azure Hybrid Benefit and Reserved Instances strategies, including licensing optimization for Windows Server and SQL Server workloads, achieving up to 70% cost reduction versus pay-as-you-go pricing.</li>
                    <li>Managed technical presales lifecycle for Azure deployments, including workload migrations (e.g., Enterprise Agreement to CSP transitions) with minimal downtime.</li>
                    <li>Performed hands-on product demonstrations, proof-of-concepts, and technical workshops on Azure services (App Services, Functions, Cosmos DB, etc.), enabling faster customer evaluation and adoption.</li>
                    <li>Conducted customer environment assessments using Block 64, identifying security vulnerabilities and optimization opportunities, and recommending integrated Microsoft 365/Azure solutions.</li>
                    <li>Collaborated with solution architects and Microsoft teams to translate business needs into production-ready cloud implementations.</li>
                </ul> 
            </div>
            <div className="item">
                <div className="item_heading">
                    <h3>TD Africa Distributions ltd, - Lagos, Nigeria</h3>
                    <div className="duration">Nov 2021 - Aug 2022</div>
                </div>
                <div>Checkpoint Technical Presales</div>
                <ul>
                    <li>Deployed and managed Checkpoint Infinity Portal solutions to implement security controls across on-premises and cloud environments.</li>
                    <li>Monitored systems on Windows and macOS platforms via Infinity Portal to identify performance issues, vulnerabilities, and improvement opportunities.</li>
                    <li>Delivered technical workshops and proof-of-concepts on Checkpoint product suites, demonstrating integration with cloud platforms and driving partner enablement.</li>
                </ul>  
            </div>
        </div>
      </section>
      <section className="education">
        <h2>EDUCATION</h2>
        <div className="items">
            <div className="item">
                <div className="item_heading">
                    <h3>University of Lagos, - Lagos, Nigeria</h3>
                    {/*<div className="duration">commenting year out to remove bias</div>*/}
                </div>
                <div className="details">
                        <div className="degree">BSc, Mechanical Engineering</div>
                        {/*<p>relevant course work</p> course work isnt important*/}
                </div>   
            </div>
        </div>
      </section>
    </>
  );
}
    