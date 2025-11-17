export function getStatusColor(status: string): string {
  switch (status) {
    case 'active':
    case 'approved':
      return 'bg-green-500';
    case 'pending':
    case 'in-progress':
      return 'bg-yellow-500';
    case 'rejected':
    case 'cancelled':
      return 'bg-red-500';
    case 'completed':
      return 'bg-blue-500';
    case 'on-hold':
      return 'bg-gray-500';
    default:
      return 'bg-gray-400';
  }
}

export function getStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    'active': 'Aktif',
    'completed': 'Tamamlandı',
    'on-hold': 'Beklemede',
    'cancelled': 'İptal Edildi',
    'pending': 'Bekliyor',
    'approved': 'Onaylandı',
    'rejected': 'Reddedildi',
    'revision-requested': 'Revizyon İsteniyor',
    'in-progress': 'Devam Ediyor',
    'not-started': 'Başlamadı',
  };
  return statusMap[status] || status;
}

