// Helper function to create menu items for project detail pages
export const createProjectMenuItems = (projectId: string, unreadCount: number = 0) => {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'home-outline', path: '' },
    { id: 'phases', label: 'Phases', icon: 'layers-outline', path: '/phases' },
    { id: 'tasks', label: 'Tasks', icon: 'checkbox-outline', path: '/tasks' },
    { id: 'updates', label: 'Updates', icon: 'megaphone-outline', path: '/updates' },
    { id: 'chat', label: 'Chat', icon: 'chatbubbles-outline', path: '/chat' },
    { id: 'files', label: 'Files', icon: 'folder-outline', path: '/files' },
    { id: 'approvals', label: 'Approvals', icon: 'checkmark-circle-outline', path: '/approvals' },
    { id: 'analytics', label: 'Analytics', icon: 'bar-chart-outline', path: '/analytics' },
    { id: 'deliverables', label: 'Deliverables', icon: 'cube-outline', path: '/deliverables' },
  ];

  return [
    { label: 'Dashboard', icon: 'home-outline', path: '/dashboard' },
    { label: 'My Projects', icon: 'folder-outline', path: '/projects' },
    { label: 'Notifications', icon: 'notifications-outline', path: '/notifications', badge: unreadCount },
    // Project tabs
    ...tabs.map(tab => ({
      label: tab.label,
      icon: tab.icon,
      path: `/projects/${projectId}${tab.path}`,
    })),
  ];
};

export const projectTabs = [
  { id: 'overview', label: 'Overview', icon: 'home-outline', path: '' },
  { id: 'phases', label: 'Phases', icon: 'layers-outline', path: '/phases' },
  { id: 'tasks', label: 'Tasks', icon: 'checkbox-outline', path: '/tasks' },
  { id: 'updates', label: 'Updates', icon: 'megaphone-outline', path: '/updates' },
  { id: 'chat', label: 'Chat', icon: 'chatbubbles-outline', path: '/chat' },
  { id: 'files', label: 'Files', icon: 'folder-outline', path: '/files' },
  { id: 'approvals', label: 'Approvals', icon: 'checkmark-circle-outline', path: '/approvals' },
  { id: 'analytics', label: 'Analytics', icon: 'bar-chart-outline', path: '/analytics' },
  { id: 'deliverables', label: 'Deliverables', icon: 'cube-outline', path: '/deliverables' },
];

