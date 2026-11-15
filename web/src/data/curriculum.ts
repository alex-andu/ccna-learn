// Arborele oficial CCNA 200-301 v1.1 (verbatim din PDF-ul Cisco, © 2024 Cisco Systems, Cisco Public).
// Generat din research_notes/.../user_provided_v11_official.md — nu modifica titlurile manual.
export type Sub = { id: string; title: string };
export type Objective = { id: string; title: string; subs: Sub[] };
export type Domain = { id: string; weight: number; title: string; ro: string; objectives: Objective[] };

export const CURRICULUM: Domain[] = [
  {
    "id": "1",
    "weight": 20,
    "title": "Network Fundamentals",
    "objectives": [
      {
        "id": "1.1",
        "title": "Explain the role and function of network components",
        "subs": [
          {
            "id": "1.1.a",
            "title": "Routers"
          },
          {
            "id": "1.1.b",
            "title": "Layer 2 and Layer 3 switches"
          },
          {
            "id": "1.1.c",
            "title": "Next-generation firewalls and IPS"
          },
          {
            "id": "1.1.d",
            "title": "Access points"
          },
          {
            "id": "1.1.e",
            "title": "Controllers"
          },
          {
            "id": "1.1.f",
            "title": "Endpoints"
          },
          {
            "id": "1.1.g",
            "title": "Servers"
          },
          {
            "id": "1.1.h",
            "title": "PoE"
          }
        ]
      },
      {
        "id": "1.2",
        "title": "Describe characteristics of network topology architectures",
        "subs": [
          {
            "id": "1.2.a",
            "title": "Two-tier"
          },
          {
            "id": "1.2.b",
            "title": "Three-tier"
          },
          {
            "id": "1.2.c",
            "title": "Spine-leaf"
          },
          {
            "id": "1.2.d",
            "title": "WAN"
          },
          {
            "id": "1.2.e",
            "title": "Small office/home office (SOHO)"
          },
          {
            "id": "1.2.f",
            "title": "On-premises and cloud"
          }
        ]
      },
      {
        "id": "1.3",
        "title": "Compare physical interface and cabling types",
        "subs": [
          {
            "id": "1.3.a",
            "title": "Single-mode fiber, multimode fiber, copper"
          },
          {
            "id": "1.3.b",
            "title": "Connections (Ethernet shared media and point-to-point)"
          }
        ]
      },
      {
        "id": "1.4",
        "title": "Identify interface and cable issues (collisions, errors, mismatch duplex, and/or speed)",
        "subs": []
      },
      {
        "id": "1.5",
        "title": "Compare TCP to UDP",
        "subs": []
      },
      {
        "id": "1.6",
        "title": "Configure and verify IPv4 addressing and subnetting",
        "subs": []
      },
      {
        "id": "1.7",
        "title": "Describe private IPv4 addressing",
        "subs": []
      },
      {
        "id": "1.8",
        "title": "Configure and verify IPv6 addressing and prefix",
        "subs": []
      },
      {
        "id": "1.9",
        "title": "Describe IPv6 address types",
        "subs": [
          {
            "id": "1.9.a",
            "title": "Unicast (global, unique local, and link local)"
          },
          {
            "id": "1.9.b",
            "title": "Anycast"
          },
          {
            "id": "1.9.c",
            "title": "Multicast"
          },
          {
            "id": "1.9.d",
            "title": "Modified EUI 64"
          }
        ]
      },
      {
        "id": "1.10",
        "title": "Verify IP parameters for Client OS (Windows, Mac OS, Linux)",
        "subs": []
      },
      {
        "id": "1.11",
        "title": "Describe wireless principles",
        "subs": [
          {
            "id": "1.11.a",
            "title": "Nonoverlapping Wi-Fi channels"
          },
          {
            "id": "1.11.b",
            "title": "SSID"
          },
          {
            "id": "1.11.c",
            "title": "RF"
          },
          {
            "id": "1.11.d",
            "title": "Encryption"
          }
        ]
      },
      {
        "id": "1.12",
        "title": "Explain virtualization fundamentals (server virtualization, containers, and VRFs)",
        "subs": []
      },
      {
        "id": "1.13",
        "title": "Describe switching concepts",
        "subs": [
          {
            "id": "1.13.a",
            "title": "MAC learning and aging"
          },
          {
            "id": "1.13.b",
            "title": "Frame switching"
          },
          {
            "id": "1.13.c",
            "title": "Frame flooding"
          },
          {
            "id": "1.13.d",
            "title": "MAC address table"
          }
        ]
      }
    ],
    "ro": "Fundamentele rețelelor"
  },
  {
    "id": "2",
    "weight": 20,
    "title": "Network Access",
    "objectives": [
      {
        "id": "2.1",
        "title": "Configure and verify VLANs (normal range) spanning multiple switches",
        "subs": [
          {
            "id": "2.1.a",
            "title": "Access ports (data and voice)"
          },
          {
            "id": "2.1.b",
            "title": "Default VLAN"
          },
          {
            "id": "2.1.c",
            "title": "InterVLAN connectivity"
          }
        ]
      },
      {
        "id": "2.2",
        "title": "Configure and verify interswitch connectivity",
        "subs": [
          {
            "id": "2.2.a",
            "title": "Trunk ports"
          },
          {
            "id": "2.2.b",
            "title": "802.1Q"
          },
          {
            "id": "2.2.c",
            "title": "Native VLAN"
          }
        ]
      },
      {
        "id": "2.3",
        "title": "Configure and verify Layer 2 discovery protocols (Cisco Discovery Protocol and LLDP)",
        "subs": []
      },
      {
        "id": "2.4",
        "title": "Configure and verify (Layer 2/Layer 3) EtherChannel (LACP)",
        "subs": []
      },
      {
        "id": "2.5",
        "title": "Interpret basic operations of Rapid PVST+ Spanning Tree Protocol",
        "subs": [
          {
            "id": "2.5.a",
            "title": "Root port, root bridge (primary/secondary), and other port names"
          },
          {
            "id": "2.5.b",
            "title": "Port states and roles"
          },
          {
            "id": "2.5.c",
            "title": "PortFast"
          },
          {
            "id": "2.5.d",
            "title": "Root guard, loop guard, BPDU filter, and BPDU guard"
          }
        ]
      },
      {
        "id": "2.6",
        "title": "Describe Cisco Wireless Architectures and AP modes",
        "subs": []
      },
      {
        "id": "2.7",
        "title": "Describe physical infrastructure connections of WLAN components (AP, WLC, access/trunk ports, and LAG)",
        "subs": []
      },
      {
        "id": "2.8",
        "title": "Describe network device management access (Telnet, SSH, HTTP, HTTPS, console, TACACS+/RADIUS, and cloud managed)",
        "subs": []
      },
      {
        "id": "2.9",
        "title": "Interpret the wireless LAN GUI configuration for client connectivity, such as WLAN creation, security settings, QoS profiles, and advanced settings",
        "subs": []
      }
    ],
    "ro": "Accesul în rețea"
  },
  {
    "id": "3",
    "weight": 25,
    "title": "IP Connectivity",
    "objectives": [
      {
        "id": "3.1",
        "title": "Interpret the components of routing table",
        "subs": [
          {
            "id": "3.1.a",
            "title": "Routing protocol code"
          },
          {
            "id": "3.1.b",
            "title": "Prefix"
          },
          {
            "id": "3.1.c",
            "title": "Network mask"
          },
          {
            "id": "3.1.d",
            "title": "Next hop"
          },
          {
            "id": "3.1.e",
            "title": "Administrative distance"
          },
          {
            "id": "3.1.f",
            "title": "Metric"
          },
          {
            "id": "3.1.g",
            "title": "Gateway of last resort"
          }
        ]
      },
      {
        "id": "3.2",
        "title": "Determine how a router makes a forwarding decision by default",
        "subs": [
          {
            "id": "3.2.a",
            "title": "Longest prefix match"
          },
          {
            "id": "3.2.b",
            "title": "Administrative distance"
          },
          {
            "id": "3.2.c",
            "title": "Routing protocol metric"
          }
        ]
      },
      {
        "id": "3.3",
        "title": "Configure and verify IPv4 and IPv6 static routing",
        "subs": [
          {
            "id": "3.3.a",
            "title": "Default route"
          },
          {
            "id": "3.3.b",
            "title": "Network route"
          },
          {
            "id": "3.3.c",
            "title": "Host route"
          },
          {
            "id": "3.3.d",
            "title": "Floating static"
          }
        ]
      },
      {
        "id": "3.4",
        "title": "Configure and verify single area OSPFv2",
        "subs": [
          {
            "id": "3.4.a",
            "title": "Neighbor adjacencies"
          },
          {
            "id": "3.4.b",
            "title": "Point-to-point"
          },
          {
            "id": "3.4.c",
            "title": "Broadcast (DR/BDR selection)"
          },
          {
            "id": "3.4.d",
            "title": "Router ID"
          }
        ]
      },
      {
        "id": "3.5",
        "title": "Describe the purpose, functions, and concepts of first hop redundancy protocols",
        "subs": []
      }
    ],
    "ro": "Conectivitate IP"
  },
  {
    "id": "4",
    "weight": 10,
    "title": "IP Services",
    "objectives": [
      {
        "id": "4.1",
        "title": "Configure and verify inside source NAT using static and pools",
        "subs": []
      },
      {
        "id": "4.2",
        "title": "Configure and verify NTP operating in a client and server mode",
        "subs": []
      },
      {
        "id": "4.3",
        "title": "Explain the role of DHCP and DNS within the network",
        "subs": []
      },
      {
        "id": "4.4",
        "title": "Explain the function of SNMP in network operations",
        "subs": []
      },
      {
        "id": "4.5",
        "title": "Describe the use of syslog features, including facilities and severity levels",
        "subs": []
      },
      {
        "id": "4.6",
        "title": "Configure and verify DHCP client and relay",
        "subs": []
      },
      {
        "id": "4.7",
        "title": "Explain the forwarding per-hop behavior (PHB) for QoS such as classification, marking, queuing, congestion, policing, and shaping",
        "subs": []
      },
      {
        "id": "4.8",
        "title": "Configure network devices for remote access using SSH",
        "subs": []
      },
      {
        "id": "4.9",
        "title": "Describe the capabilities and functions of TFTP/FTP in the network",
        "subs": []
      }
    ],
    "ro": "Servicii IP"
  },
  {
    "id": "5",
    "weight": 15,
    "title": "Security Fundamentals",
    "objectives": [
      {
        "id": "5.1",
        "title": "Define key security concepts (threats, vulnerabilities, exploits, and mitigation techniques)",
        "subs": []
      },
      {
        "id": "5.2",
        "title": "Describe security program elements (user awareness, training, and physical access control)",
        "subs": []
      },
      {
        "id": "5.3",
        "title": "Configure and verify device access control using local passwords",
        "subs": []
      },
      {
        "id": "5.4",
        "title": "Describe security password policy elements, such as management, complexity, and password alternatives (multifactor authentication, certificates, and biometrics)",
        "subs": []
      },
      {
        "id": "5.5",
        "title": "Describe IPsec remote access and site-to-site VPNs",
        "subs": []
      },
      {
        "id": "5.6",
        "title": "Configure and verify access control lists",
        "subs": []
      },
      {
        "id": "5.7",
        "title": "Configure and verify Layer 2 security features (DHCP snooping, dynamic ARP inspection, and port security)",
        "subs": []
      },
      {
        "id": "5.8",
        "title": "Compare authentication, authorization, and accounting concepts",
        "subs": []
      },
      {
        "id": "5.9",
        "title": "Describe wireless security protocols (WPA, WPA2, and WPA3)",
        "subs": []
      },
      {
        "id": "5.10",
        "title": "Configure and verify WLAN within the GUI using WPA2 PSK",
        "subs": []
      }
    ],
    "ro": "Fundamentele securității"
  },
  {
    "id": "6",
    "weight": 10,
    "title": "Automation and Programmability",
    "objectives": [
      {
        "id": "6.1",
        "title": "Explain how automation impacts network management",
        "subs": []
      },
      {
        "id": "6.2",
        "title": "Compare traditional networks with controller-based networking",
        "subs": []
      },
      {
        "id": "6.3",
        "title": "Describe controller-based, software defined architecture (overlay, underlay, and fabric)",
        "subs": [
          {
            "id": "6.3.a",
            "title": "Separation of control plane and data plane"
          },
          {
            "id": "6.3.b",
            "title": "Northbound and Southbound APIs"
          }
        ]
      },
      {
        "id": "6.4",
        "title": "Explain AI (generative and predictive) and machine learning in network operations",
        "subs": []
      },
      {
        "id": "6.5",
        "title": "Describe characteristics of REST-based APIs (authentication types, CRUD, HTTP verbs, and data encoding)",
        "subs": []
      },
      {
        "id": "6.6",
        "title": "Recognize the capabilities of configuration management mechanisms such as Ansible and Terraform",
        "subs": []
      },
      {
        "id": "6.7",
        "title": "Recognize components of JSON-encoded data",
        "subs": []
      }
    ],
    "ro": "Automatizare și programabilitate"
  }
];

/** Topic-uri cu conținut complet (restul apar ca „în curând”). */
export const AVAILABLE = new Set<string>(['1.1', '1.2', '1.3', '1.4', '1.5', '1.6', '1.7', '1.8', '1.9', '1.10', '1.11', '1.12', '1.13', '2.1', '2.2', '2.3', '2.4', '2.5', '2.6', '2.7', '2.8', '2.9']);

export const allObjectives = () => CURRICULUM.flatMap((d) => d.objectives.map((o) => ({ ...o, domain: d })));
export const findObjective = (id: string) => allObjectives().find((o) => o.id === id);
export const domainOf = (topicId: string) => CURRICULUM.find((d) => topicId.startsWith(d.id + '.'));
export const EXAM_VERSION = 'CCNA 200-301 v1.1';
