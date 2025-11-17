import { Project } from '@/types';

// Mevcut portfolio/admin paneli proje yapısı
export interface PortfolioProject {
  id?: string;
  category?: string;
  client?: string; // Client adı (örn: "Candleiyj")
  content?: string;
  description?: string;
  duration?: string;
  endDate?: string;
  featured?: boolean;
  features?: string[];
  gallery?: string[];
  githubUrl?: string;
  image?: string;
  likes?: number;
  liveUrl?: string;
  publishedAt?: any;
  slug?: string;
  status?: string; // "completed", "active", vb.
  technologies?: string[];
  title?: string;
  updatedAt?: any;
  views?: number;
  createdAt?: any;
  // Client Hub için gerekli field'lar
  clientId?: string; // users koleksiyonundaki uid
  name?: string;
  progress?: number;
  lastUpdate?: any;
}

// Portfolio projesini Client Hub projesine dönüştür
export const adaptPortfolioProjectToClientHub = (
  portfolioProject: PortfolioProject,
  userUid?: string
): Project | null => {
  // Eğer clientId yoksa ve userUid verilmişse, client field'ı ile eşleştirme yapılabilir
  // Ancak şimdilik sadece clientId olan projeleri döndürüyoruz
  if (!portfolioProject.clientId) {
    return null; // Client Hub projesi değil
  }

  // Status mapping
  let status: 'active' | 'completed' | 'on-hold' | 'cancelled' = 'active';
  if (portfolioProject.status) {
    const statusLower = portfolioProject.status.toLowerCase();
    if (statusLower === 'completed' || statusLower === 'done') {
      status = 'completed';
    } else if (statusLower === 'on-hold' || statusLower === 'paused') {
      status = 'on-hold';
    } else if (statusLower === 'cancelled' || statusLower === 'canceled') {
      status = 'cancelled';
    }
  }

  // Progress hesaplama (eğer yoksa)
  let progress = portfolioProject.progress || 0;
  if (status === 'completed') {
    progress = 100;
  }

  // Name mapping
  const name = portfolioProject.name || portfolioProject.title || 'Proje';

  // Date mapping
  const createdAt = portfolioProject.createdAt
    ? typeof portfolioProject.createdAt === 'string'
      ? portfolioProject.createdAt
      : portfolioProject.createdAt.toDate?.().toISOString() || new Date().toISOString()
    : new Date().toISOString();

  const lastUpdate = portfolioProject.lastUpdate || portfolioProject.updatedAt || portfolioProject.createdAt;
  const lastUpdateStr = lastUpdate
    ? typeof lastUpdate === 'string'
      ? lastUpdate
      : lastUpdate.toDate?.().toISOString() || createdAt
    : createdAt;

  const dueDate = portfolioProject.endDate || portfolioProject.dueDate || new Date().toISOString();

  return {
    id: portfolioProject.id || '',
    clientId: portfolioProject.clientId,
    name,
    status,
    progress,
    dueDate,
    lastUpdate: lastUpdateStr,
    createdAt,
    description: portfolioProject.description || portfolioProject.content,
  };
};

// Tüm projeleri filtrele ve dönüştür
export const filterAndAdaptProjects = (
  allProjects: PortfolioProject[],
  userUid: string
): Project[] => {
  return allProjects
    .filter((p) => {
      // Client Hub projesi olması için clientId olmalı
      // VEYA client field'ı ile user'ın email/name'i eşleşmeli (ileride eklenebilir)
      return p.clientId === userUid;
    })
    .map((p) => adaptPortfolioProjectToClientHub(p, userUid))
    .filter((p): p is Project => p !== null);
};

