class AppConstants {
  // Brand Colors
  static const String primaryColor = '#0056b8';
  static const String secondaryColor = '#ff9700';
  static const String accentColor = '#f8f9fb';
  
  // Firebase Collections - Client Hub
  static const String clientsCollection = 'clients';
  static const String clientHubProjectsCollection = 'clientHubProjects'; // Client Hub projeleri için
  static const String tasksCollection = 'tasks';
  static const String updatesCollection = 'updates';
  static const String messagesCollection = 'messages';
  static const String filesCollection = 'files';
  static const String notificationsCollection = 'notifications';
  
  // Firebase Collections - Blog & Portfolio (Mevcut Firestore yapısına göre)
  static const String usersCollection = 'users';
  static const String blogsCollection = 'blogs'; // Mevcut: 'blogs'
  static const String categoriesCollection = 'categories'; // Mevcut: 'categories'
  static const String projectsCollection = 'projects'; // Portfolio projeleri için
  static const String tagsCollection = 'tags';
  static const String activitiesCollection = 'activities';
  static const String sessionsCollection = 'sessions';
  static const String otpCodesCollection = 'otp_codes';
  
  // Firebase Collections - CMS Features
  static const String commentsCollection = 'comments';
  static const String mediaCollection = 'media';
  
  // Project Status
  static const String statusPlanning = 'Planning';
  static const String statusInProgress = 'InProgress';
  static const String statusReview = 'Review';
  static const String statusDelivered = 'Delivered';
  
  // Pagination
  static const int messagesPerPage = 30;
  
  // Storage Paths
  static const String projectFilesPath = 'projectFiles';
  static const String blogImagesPath = 'blogImages';
  static const String portfolioImagesPath = 'portfolioImages';
  static const String mediaPath = 'media';
  static const String avatarsPath = 'avatars';
  
  // User Roles
  static const String roleAdmin = 'admin';
  static const String roleAuthor = 'author';
  static const String roleClient = 'client';
  static const String roleVisitor = 'visitor';
  
  // Comment Status
  static const String commentStatusPending = 'pending';
  static const String commentStatusApproved = 'approved';
  static const String commentStatusRejected = 'rejected';
  static const String commentStatusSpam = 'spam';
  
  // Post Types
  static const String postTypeBlog = 'blog';
  static const String postTypePortfolio = 'portfolio';
  
  // Legal Text
  static const String legalText = 
      'Softiel Client Hub is a project tracking tool.\n'
      'All contracts and payments are handled through Upwork.\n'
      'This platform is only for project transparency and file sharing.';
}

