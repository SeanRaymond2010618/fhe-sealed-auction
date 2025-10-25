import axios from 'axios';

// Mock API base URL - replace with actual API endpoint
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Project-related services
export const fetchProjects = async (params?: {
  search?: string;
  category?: string;
  sort?: string;
}) => {
  // Simulated data for demo
  const projects = [
    {
      id: '1',
      name: 'Privacy DEX',
      description: 'Decentralized exchange with fully private order matching using FHE',
      category: 'DeFi',
      goal: '50 ETH',
      raised: '32.5 ETH',
      donors: 245,
      matchingPool: '15.2 ETH',
      verified: true,
      imageUrl: '',
      owner: '0x1234...5678',
      createdAt: '2024-01-10',
      roundId: '12',
    },
    {
      id: '2',
      name: 'FHE Voting System',
      description: 'On-chain voting with encrypted ballots for complete privacy',
      category: 'Infrastructure',
      goal: '30 ETH',
      raised: '18.7 ETH',
      donors: 156,
      matchingPool: '8.4 ETH',
      verified: true,
      imageUrl: '',
      owner: '0xabcd...efgh',
      createdAt: '2024-01-12',
      roundId: '12',
    },
    {
      id: '3',
      name: 'Zero-Knowledge Identity',
      description: 'Self-sovereign identity solution with privacy-preserving credentials',
      category: 'Infrastructure',
      goal: '40 ETH',
      raised: '25.3 ETH',
      donors: 189,
      matchingPool: '11.7 ETH',
      verified: false,
      imageUrl: '',
      owner: '0x9876...5432',
      createdAt: '2024-01-15',
      roundId: '12',
    },
    {
      id: '4',
      name: 'Education DAO',
      description: 'Decentralized platform for funding educational initiatives globally',
      category: 'Education',
      goal: '25 ETH',
      raised: '12.8 ETH',
      donors: 98,
      matchingPool: '5.9 ETH',
      verified: true,
      imageUrl: '',
      owner: '0xfedc...ba98',
      createdAt: '2024-01-08',
      roundId: '12',
    },
    {
      id: '5',
      name: 'Climate Action Fund',
      description: 'Supporting renewable energy projects in developing nations',
      category: 'Environment',
      goal: '100 ETH',
      raised: '67.4 ETH',
      donors: 412,
      matchingPool: '28.3 ETH',
      verified: true,
      imageUrl: '',
      owner: '0x1357...2468',
      createdAt: '2024-01-05',
      roundId: '12',
    },
    {
      id: '6',
      name: 'Healthcare Access',
      description: 'Telemedicine platform for underserved communities',
      category: 'Healthcare',
      goal: '45 ETH',
      raised: '21.6 ETH',
      donors: 134,
      matchingPool: '9.8 ETH',
      verified: false,
      imageUrl: '',
      owner: '0x2468...1357',
      createdAt: '2024-01-18',
      roundId: '12',
    },
  ];

  // Apply filters
  let filtered = [...projects];
  
  if (params?.search) {
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(params.search!.toLowerCase()) ||
      p.description.toLowerCase().includes(params.search!.toLowerCase())
    );
  }
  
  if (params?.category && params.category !== 'all') {
    filtered = filtered.filter(p => 
      p.category.toLowerCase() === params.category!.toLowerCase()
    );
  }
  
  // Apply sorting
  if (params?.sort) {
    switch (params.sort) {
      case 'recent':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'funding':
        filtered.sort((a, b) => parseFloat(b.raised) - parseFloat(a.raised));
        break;
      case 'matching':
        filtered.sort((a, b) => parseFloat(b.matchingPool) - parseFloat(a.matchingPool));
        break;
      default:
        // trending - sort by donors
        filtered.sort((a, b) => b.donors - a.donors);
    }
  }

  return filtered;
};

export const fetchProjectDetail = async (id: string) => {
  const projects = await fetchProjects();
  const project = projects.find(p => p.id === id);
  
  if (!project) {
    throw new Error('Project not found');
  }
  
  return {
    ...project,
    longDescription: `${project.description}. This project aims to revolutionize the space by leveraging cutting-edge FHE technology to ensure complete privacy while maintaining transparency and accountability. Our team consists of experienced developers and researchers committed to building a better, more private future.`,
    website: 'https://example.com',
    twitter: 'https://twitter.com/example',
    github: 'https://github.com/example',
    features: [
      'Fully homomorphic encryption for all sensitive data',
      'Quadratic funding mechanism implementation',
      'Anti-sybil attack measures',
      'Transparent fund distribution',
      'Community governance features',
    ],
    daysLeft: 15,
    uniqueContributors: project.donors,
  };
};

export const createProject = async (projectData: any) => {
  // Simulated API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: Date.now().toString(),
        ...projectData,
        status: 'pending',
      });
    }, 1000);
  });
};

// Donation services
export const submitDonation = async (params: {
  projectId: string;
  amount: number;
  encryptedAmount: string;
  isAnonymous: boolean;
}) => {
  // Simulated blockchain interaction
  return new Promise<{ txHash: string }>((resolve) => {
    setTimeout(() => {
      resolve({
        txHash: `0x${Date.now().toString(16)}${Math.random().toString(16).slice(2)}`,
      });
    }, 2000);
  });
};

export const fetchMyDonations = async () => {
  // Simulated user donations
  return [
    {
      id: '1',
      projectId: '1',
      projectName: 'Privacy DEX',
      amount: '0.5 ETH',
      encryptedAmount: true,
      matchingReceived: '0.23 ETH',
      timestamp: '2024-01-20 14:30',
      txHash: '0x1234...abcd',
      roundId: '12',
      status: 'matched' as const,
    },
    {
      id: '2',
      projectId: '2',
      projectName: 'FHE Voting System',
      amount: '0.25 ETH',
      encryptedAmount: true,
      matchingReceived: '0.12 ETH',
      timestamp: '2024-01-19 10:15',
      txHash: '0x5678...efgh',
      roundId: '12',
      status: 'confirmed' as const,
    },
    {
      id: '3',
      projectId: '4',
      projectName: 'Education DAO',
      amount: '0.1 ETH',
      encryptedAmount: true,
      matchingReceived: '0.05 ETH',
      timestamp: '2024-01-18 16:45',
      txHash: '0x9012...ijkl',
      roundId: '12',
      status: 'pending' as const,
    },
  ];
};

// Rounds services
export const fetchRounds = async () => {
  return [
    {
      id: '12',
      name: 'Round 12 - Public Goods',
      startDate: '2024-01-15',
      endDate: '2024-02-15',
      matchingPool: '$500,000',
      totalRaised: '$2,456,789',
      totalDonors: 3456,
      projectsCount: 45,
      status: 'active' as const,
    },
    {
      id: '13',
      name: 'Round 13 - DeFi Focus',
      startDate: '2024-02-20',
      endDate: '2024-03-20',
      matchingPool: '$750,000',
      totalRaised: '$0',
      totalDonors: 0,
      projectsCount: 0,
      status: 'upcoming' as const,
    },
    {
      id: '11',
      name: 'Round 11 - Infrastructure',
      startDate: '2023-12-01',
      endDate: '2024-01-01',
      matchingPool: '$400,000',
      totalRaised: '$1,876,543',
      totalDonors: 2789,
      projectsCount: 38,
      status: 'completed' as const,
    },
  ];
};

export const createRound = async (roundData: any) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: Date.now().toString(),
        ...roundData,
        status: 'upcoming',
      });
    }, 1000);
  });
};

export const updateRound = async (id: string, updates: any) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id,
        ...updates,
      });
    }, 1000);
  });
};

// Leaderboard services
export const fetchLeaderboard = async (params?: {
  timeRange?: string;
  category?: string;
}) => {
  const projects = await fetchProjects();
  
  return projects.map((project, index) => ({
    rank: index + 1,
    projectId: project.id,
    projectName: project.name,
    category: project.category,
    totalRaised: project.raised,
    donorsCount: project.donors,
    matchingReceived: project.matchingPool,
    verified: project.verified,
    momentum: Math.floor(Math.random() * 100),
  })).sort((a, b) => parseFloat(b.totalRaised) - parseFloat(a.totalRaised));
};

// Admin services
export const fetchAdminData = async () => {
  const rounds = await fetchRounds();
  const projects = await fetchProjects();
  
  return {
    activeRounds: rounds.filter(r => r.status === 'active').length,
    pendingProjects: 5,
    rounds,
    projects: projects.map(p => ({
      ...p,
      status: Math.random() > 0.3 ? 'approved' : 'pending',
    })),
  };
};

// Wallet services
export const connectWallet = async () => {
  // Simulated wallet connection
  if (typeof window.ethereum !== 'undefined') {
    try {
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      return accounts[0];
    } catch (error) {
      throw new Error('Failed to connect wallet');
    }
  } else {
    throw new Error('Please install MetaMask');
  }
};

export const getWalletBalance = async (address: string) => {
  // Simulated balance fetch
  return '10.5 ETH';
};

// Anti-sybil verification
export const verifyCredentials = async (credentialType: string) => {
  // Simulated credential verification
  return new Promise<boolean>((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 1500);
  });
};