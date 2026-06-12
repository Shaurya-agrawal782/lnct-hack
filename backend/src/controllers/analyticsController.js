const Incident = require('../models/Incident');
const Resource = require('../models/Resource');
const Alert = require('../models/Alert');
const asyncHandler = require('../utils/asyncHandler');

// Role-based helper filters
const getIncidentFilterByRole = (user) => {
  if (user.role === 'admin') {
    return {};
  } else if (user.role === 'responder') {
    return { assignedResponder: user._id };
  } else {
    // citizen
    return { reportedBy: user._id };
  }
};

const getAlertFilterByRole = (user) => {
  return {
    $or: [
      { targetUsers: user._id },
      { targetRoles: user.role }
    ]
  };
};

// Data-fetching helper functions
const fetchSummaryData = async (user) => {
  const incidentFilter = getIncidentFilterByRole(user);

  const [
    totalIncidents,
    activeIncidents,
    criticalIncidents,
    resolvedIncidents,
    closedIncidents
  ] = await Promise.all([
    Incident.countDocuments(incidentFilter),
    Incident.countDocuments({
      ...incidentFilter,
      status: { $in: ['reported', 'verified', 'assigned', 'in-progress'] }
    }),
    Incident.countDocuments({
      ...incidentFilter,
      severity: 'critical'
    }),
    Incident.countDocuments({
      ...incidentFilter,
      status: 'resolved'
    }),
    Incident.countDocuments({
      ...incidentFilter,
      status: 'closed'
    })
  ]);

  let resources = {
    total: 0,
    available: 0,
    busy: 0,
    maintenance: 0
  };

  if (user.role === 'admin' || user.role === 'responder') {
    const [
      totalRes,
      availableRes,
      busyRes,
      maintenanceRes
    ] = await Promise.all([
      Resource.countDocuments({}),
      Resource.countDocuments({ status: 'available' }),
      Resource.countDocuments({ status: 'busy' }),
      Resource.countDocuments({ status: 'maintenance' })
    ]);
    resources = {
      total: totalRes,
      available: availableRes,
      busy: busyRes,
      maintenance: maintenanceRes
    };
  }

  const alertFilter = getAlertFilterByRole(user);
  const [totalAlerts, unreadAlerts] = await Promise.all([
    Alert.countDocuments(alertFilter),
    Alert.countDocuments({
      ...alertFilter,
      'readBy.user': { $ne: user._id }
    })
  ]);

  return {
    incidents: {
      total: totalIncidents,
      active: activeIncidents,
      critical: criticalIncidents,
      resolved: resolvedIncidents,
      closed: closedIncidents
    },
    resources,
    alerts: {
      total: totalAlerts,
      unread: unreadAlerts
    }
  };
};

const fetchIncidentStatsData = async (user) => {
  const incidentFilter = getIncidentFilterByRole(user);

  const stats = await Incident.aggregate([
    { $match: incidentFilter },
    {
      $facet: {
        byStatus: [
          { $group: { _id: '$status', count: { $sum: 1 } } }
        ],
        bySeverity: [
          { $group: { _id: '$severity', count: { $sum: 1 } } }
        ],
        byType: [
          { $group: { _id: '$type', count: { $sum: 1 } } }
        ]
      }
    }
  ]);

  const statusCounts = {
    reported: 0,
    verified: 0,
    assigned: 0,
    'in-progress': 0,
    resolved: 0,
    closed: 0
  };
  const severityCounts = {
    low: 0,
    medium: 0,
    high: 0,
    critical: 0
  };
  const typeCounts = {
    fire: 0,
    flood: 0,
    medical: 0,
    accident: 0,
    crowd: 0,
    rescue: 0,
    other: 0
  };

  const facetResult = stats[0] || {};

  if (facetResult.byStatus) {
    facetResult.byStatus.forEach((item) => {
      if (item._id in statusCounts) {
        statusCounts[item._id] = item.count;
      }
    });
  }

  if (facetResult.bySeverity) {
    facetResult.bySeverity.forEach((item) => {
      if (item._id in severityCounts) {
        severityCounts[item._id] = item.count;
      }
    });
  }

  if (facetResult.byType) {
    facetResult.byType.forEach((item) => {
      if (item._id in typeCounts) {
        typeCounts[item._id] = item.count;
      }
    });
  }

  const recentIncidents = await Incident.find(incidentFilter)
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('reportedBy', 'name email')
    .populate('assignedResponder', 'name email');

  return {
    byStatus: statusCounts,
    bySeverity: severityCounts,
    byType: typeCounts,
    recentIncidents
  };
};

const fetchResourceStatsData = async (user) => {
  const statusCounts = {
    available: 0,
    assigned: 0,
    busy: 0,
    maintenance: 0,
    offline: 0
  };

  const typeCounts = {
    ambulance: 0,
    fire_truck: 0,
    rescue_team: 0,
    medical: 0,
    shelter: 0,
    supply: 0,
    volunteer_group: 0,
    other: 0
  };

  if (user.role !== 'admin' && user.role !== 'responder') {
    return {
      byStatus: statusCounts,
      byType: typeCounts,
      availableCount: 0,
      totalCapacity: 0
    };
  }

  const stats = await Resource.aggregate([
    {
      $facet: {
        byStatus: [
          { $group: { _id: '$status', count: { $sum: 1 } } }
        ],
        byType: [
          { $group: { _id: '$type', count: { $sum: 1 } } }
        ],
        capacityStats: [
          {
            $group: {
              _id: null,
              totalCapacity: { $sum: '$capacity' }
            }
          }
        ]
      }
    }
  ]);

  const facetResult = stats[0] || {};

  if (facetResult.byStatus) {
    facetResult.byStatus.forEach((item) => {
      if (item._id in statusCounts) {
        statusCounts[item._id] = item.count;
      }
    });
  }

  if (facetResult.byType) {
    facetResult.byType.forEach((item) => {
      if (item._id in typeCounts) {
        typeCounts[item._id] = item.count;
      }
    });
  }

  const availableCount = statusCounts.available;
  const totalCapacity = (facetResult.capacityStats && facetResult.capacityStats[0])
    ? facetResult.capacityStats[0].totalCapacity
    : 0;

  return {
    byStatus: statusCounts,
    byType: typeCounts,
    availableCount,
    totalCapacity
  };
};

const fetchAlertStatsData = async (user) => {
  const alertFilter = getAlertFilterByRole(user);

  const priorityCounts = {
    low: 0,
    medium: 0,
    high: 0,
    critical: 0
  };

  const typeCounts = {
    incident_created: 0,
    incident_assigned: 0,
    status_updated: 0,
    resource_updated: 0,
    system: 0
  };

  const stats = await Alert.aggregate([
    { $match: alertFilter },
    {
      $facet: {
        byPriority: [
          { $group: { _id: '$priority', count: { $sum: 1 } } }
        ],
        byType: [
          { $group: { _id: '$type', count: { $sum: 1 } } }
        ]
      }
    }
  ]);

  const facetResult = stats[0] || {};

  if (facetResult.byPriority) {
    facetResult.byPriority.forEach((item) => {
      if (item._id in priorityCounts) {
        priorityCounts[item._id] = item.count;
      }
    });
  }

  if (facetResult.byType) {
    facetResult.byType.forEach((item) => {
      if (item._id in typeCounts) {
        typeCounts[item._id] = item.count;
      }
    });
  }

  const unreadCount = await Alert.countDocuments({
    ...alertFilter,
    'readBy.user': { $ne: user._id }
  });

  const recentAlerts = await Alert.find(alertFilter)
    .sort({ createdAt: -1 })
    .limit(5);

  return {
    byPriority: priorityCounts,
    byType: typeCounts,
    unreadCount,
    recentAlerts
  };
};

// Exported controllers
const getSummary = asyncHandler(async (req, res, next) => {
  const summary = await fetchSummaryData(req.user);
  res.status(200).json({
    success: true,
    data: summary
  });
});

const getIncidentStats = asyncHandler(async (req, res, next) => {
  const stats = await fetchIncidentStatsData(req.user);
  res.status(200).json({
    success: true,
    data: stats
  });
});

const getResourceStats = asyncHandler(async (req, res, next) => {
  const stats = await fetchResourceStatsData(req.user);
  res.status(200).json({
    success: true,
    data: stats
  });
});

const getAlertStats = asyncHandler(async (req, res, next) => {
  const stats = await fetchAlertStatsData(req.user);
  res.status(200).json({
    success: true,
    data: stats
  });
});

const getDashboardOverview = asyncHandler(async (req, res, next) => {
  const [summary, incidentStats, resourceStats, alertStats] = await Promise.all([
    fetchSummaryData(req.user),
    fetchIncidentStatsData(req.user),
    fetchResourceStatsData(req.user),
    fetchAlertStatsData(req.user)
  ]);

  res.status(200).json({
    success: true,
    data: {
      summary,
      incidentStats,
      resourceStats,
      alertStats
    }
  });
});

module.exports = {
  getSummary,
  getIncidentStats,
  getResourceStats,
  getAlertStats,
  getDashboardOverview
};
