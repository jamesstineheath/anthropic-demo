export interface AgentActivity {
  lastActive: string;
  totalConversations: number;
  actionsThisWeek: number;
  messagesThisWeek: number;
}

export interface ScheduledJob {
  id: string;
  name: string;
  schedule: string;
  lastRun: string;
  nextRun: string;
  status: "active" | "paused" | "completed";
}

export interface AgentPerformance {
  successRate: number;
  avgConfidence: number;
  escalationRate: number;
  tasksCompleted: number;
  tasksFailed: number;
}

export interface SharedMemoryStatus {
  canRead: boolean;
  canWrite: boolean;
  memoriesContributed: number;
  memoriesAccessed: number;
  lastContribution: string;
}

export interface ConnectedSource {
  name: string;
  icon: string;
  status: "connected" | "pending" | "disconnected";
  lastSync: string;
}

export interface AgentManagementData {
  agentId: string;
  activity: AgentActivity;
  scheduledJobs: ScheduledJob[];
  performance: AgentPerformance;
  sharedMemory: SharedMemoryStatus;
  connections: ConnectedSource[];
  unlockedCapabilities: number;
  totalCapabilities: number;
  nextCapabilityPreview: string;
}

const managementData: Record<string, AgentManagementData> = {
  calendaring: {
    agentId: "calendaring",
    activity: {
      lastActive: "12 min ago",
      totalConversations: 47,
      actionsThisWeek: 23,
      messagesThisWeek: 89,
    },
    scheduledJobs: [
      {
        id: "cal-morning-briefing",
        name: "Morning briefing",
        schedule: "Weekdays 7:30am",
        lastRun: "12 hours ago",
        nextRun: "Tomorrow 7:30am",
        status: "active",
      },
      {
        id: "cal-weekly-review",
        name: "Weekly schedule review",
        schedule: "Sunday 8pm",
        lastRun: "6 days ago",
        nextRun: "Sunday 8pm",
        status: "active",
      },
      {
        id: "cal-meeting-prep",
        name: "Meeting prep reminders",
        schedule: "30min before meetings",
        lastRun: "2 hours ago",
        nextRun: "Before next meeting",
        status: "active",
      },
    ],
    performance: {
      successRate: 0.94,
      avgConfidence: 0.91,
      escalationRate: 0.08,
      tasksCompleted: 156,
      tasksFailed: 10,
    },
    sharedMemory: {
      canRead: true,
      canWrite: true,
      memoriesContributed: 31,
      memoriesAccessed: 18,
      lastContribution: "12 min ago",
    },
    connections: [
      {
        name: "Google Calendar",
        icon: "Calendar",
        status: "connected",
        lastSync: "12 min ago",
      },
      {
        name: "Google Contacts",
        icon: "Users",
        status: "connected",
        lastSync: "1 hour ago",
      },
      {
        name: "Zoom",
        icon: "Video",
        status: "pending",
        lastSync: "Never",
      },
    ],
    unlockedCapabilities: 8,
    totalCapabilities: 24,
    nextCapabilityPreview: "Auto-decline low-priority conflicts",
  },

  "meal-planner": {
    agentId: "meal-planner",
    activity: {
      lastActive: "1 day ago",
      totalConversations: 12,
      actionsThisWeek: 5,
      messagesThisWeek: 22,
    },
    scheduledJobs: [
      {
        id: "meal-weekly-plan",
        name: "Weekly meal plan",
        schedule: "Every Sunday 6pm",
        lastRun: "6 days ago",
        nextRun: "Sunday 6pm",
        status: "active",
      },
      {
        id: "meal-grocery-sync",
        name: "Grocery list sync",
        schedule: "Every Sunday 7pm",
        lastRun: "6 days ago",
        nextRun: "Sunday 7pm",
        status: "active",
      },
    ],
    performance: {
      successRate: 0.87,
      avgConfidence: 0.82,
      escalationRate: 0.15,
      tasksCompleted: 43,
      tasksFailed: 6,
    },
    sharedMemory: {
      canRead: true,
      canWrite: false,
      memoriesContributed: 4,
      memoriesAccessed: 8,
      lastContribution: "1 week ago",
    },
    connections: [
      {
        name: "Instacart",
        icon: "ShoppingCart",
        status: "connected",
        lastSync: "1 day ago",
      },
    ],
    unlockedCapabilities: 3,
    totalCapabilities: 16,
    nextCapabilityPreview: "Auto-reorder pantry staples",
  },

  "grocery-shopper": {
    agentId: "grocery-shopper",
    activity: {
      lastActive: "2 days ago",
      totalConversations: 8,
      actionsThisWeek: 2,
      messagesThisWeek: 11,
    },
    scheduledJobs: [
      {
        id: "grocery-restock",
        name: "Restock check",
        schedule: "Wednesday 10am",
        lastRun: "5 days ago",
        nextRun: "Wednesday 10am",
        status: "active",
      },
    ],
    performance: {
      successRate: 0.82,
      avgConfidence: 0.78,
      escalationRate: 0.22,
      tasksCompleted: 27,
      tasksFailed: 6,
    },
    sharedMemory: {
      canRead: true,
      canWrite: false,
      memoriesContributed: 2,
      memoriesAccessed: 6,
      lastContribution: "2 weeks ago",
    },
    connections: [
      {
        name: "Instacart",
        icon: "ShoppingCart",
        status: "connected",
        lastSync: "2 days ago",
      },
      {
        name: "Good Earth",
        icon: "Store",
        status: "disconnected",
        lastSync: "3 weeks ago",
      },
    ],
    unlockedCapabilities: 2,
    totalCapabilities: 14,
    nextCapabilityPreview: "Price comparison across stores",
  },

  "friend-keeper": {
    agentId: "friend-keeper",
    activity: {
      lastActive: "3 days ago",
      totalConversations: 6,
      actionsThisWeek: 1,
      messagesThisWeek: 7,
    },
    scheduledJobs: [
      {
        id: "friend-monthly-checkin",
        name: "Monthly check-in reminder",
        schedule: "1st of month",
        lastRun: "1 week ago",
        nextRun: "May 1st",
        status: "active",
      },
      {
        id: "friend-birthday-scan",
        name: "Birthday scanner",
        schedule: "Daily 9am",
        lastRun: "3 days ago",
        nextRun: "Tomorrow 9am",
        status: "active",
      },
    ],
    performance: {
      successRate: 0.79,
      avgConfidence: 0.73,
      escalationRate: 0.28,
      tasksCompleted: 14,
      tasksFailed: 4,
    },
    sharedMemory: {
      canRead: true,
      canWrite: true,
      memoriesContributed: 7,
      memoriesAccessed: 12,
      lastContribution: "3 days ago",
    },
    connections: [
      {
        name: "Google Contacts",
        icon: "Users",
        status: "connected",
        lastSync: "3 days ago",
      },
      {
        name: "iMessage",
        icon: "MessageSquare",
        status: "pending",
        lastSync: "Never",
      },
    ],
    unlockedCapabilities: 2,
    totalCapabilities: 12,
    nextCapabilityPreview: "Auto-suggest meetup times",
  },

  "email-drafter": {
    agentId: "email-drafter",
    activity: {
      lastActive: "5 days ago",
      totalConversations: 3,
      actionsThisWeek: 0,
      messagesThisWeek: 0,
    },
    scheduledJobs: [],
    performance: {
      successRate: 0.71,
      avgConfidence: 0.68,
      escalationRate: 0.35,
      tasksCompleted: 5,
      tasksFailed: 2,
    },
    sharedMemory: {
      canRead: true,
      canWrite: false,
      memoriesContributed: 0,
      memoriesAccessed: 3,
      lastContribution: "Never",
    },
    connections: [
      {
        name: "Gmail",
        icon: "Mail",
        status: "pending",
        lastSync: "Never",
      },
    ],
    unlockedCapabilities: 1,
    totalCapabilities: 18,
    nextCapabilityPreview: "Draft style matching",
  },
};

export function getAgentManagementData(
  agentId: string
): AgentManagementData | undefined {
  return managementData[agentId];
}
