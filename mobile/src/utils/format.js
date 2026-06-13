export const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const d = new Date(dateString);
    // Custom readable format: e.g. Jun 13, 2026, 9:02 AM
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  } catch (error) {
    return dateString;
  }
};

export const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'reported':
      return { bg: 'rgba(59, 130, 246, 0.12)', text: '#3B82F6', border: '#2563EB' }; // Blue
    case 'verified':
      return { bg: 'rgba(139, 92, 246, 0.12)', text: '#C084FC', border: '#8B5CF6' }; // Purple
    case 'assigned':
      return { bg: 'rgba(245, 158, 11, 0.12)', text: '#F59E0B', border: '#D97706' }; // Amber
    case 'in-progress':
      return { bg: 'rgba(59, 130, 246, 0.12)', text: '#3B82F6', border: '#2563EB' }; // Blue (Command Action)
    case 'resolved':
      return { bg: 'rgba(16, 185, 129, 0.12)', text: '#10B981', border: '#059669' }; // Success Green
    case 'closed':
      return { bg: 'rgba(148, 163, 184, 0.12)', text: '#94A3B8', border: '#475569' }; // Muted Gray
    default:
      return { bg: 'rgba(148, 163, 184, 0.12)', text: '#94A3B8', border: '#475569' };
  }
};

export const getSeverityColor = (severity) => {
  switch (severity?.toLowerCase()) {
    case 'low':
      return { bg: 'rgba(16, 185, 129, 0.12)', text: '#10B981', border: '#059669' }; // Green
    case 'medium':
      return { bg: 'rgba(245, 158, 11, 0.12)', text: '#F59E0B', border: '#D97706' }; // Amber
    case 'high':
      return { bg: 'rgba(249, 115, 22, 0.12)', text: '#F97316', border: '#EA580C' }; // Orange
    case 'critical':
      return { bg: 'rgba(239, 68, 68, 0.15)', text: '#EF4444', border: '#DC2626' }; // Red
    default:
      return { bg: 'rgba(148, 163, 184, 0.12)', text: '#94A3B8', border: '#475569' };
  }
};

export const getIncidentTypeLabel = (type) => {
  const mapping = {
    fire: 'Fire',
    flood: 'Flood',
    medical: 'Medical Emergency',
    accident: 'Accident',
    crowd: 'Crowd Hazard',
    rescue: 'Rescue Ops',
    other: 'Other'
  };
  return mapping[type?.toLowerCase()] || type || 'Other';
};
