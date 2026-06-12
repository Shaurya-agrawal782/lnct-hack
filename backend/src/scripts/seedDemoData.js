'use strict';

/**
 * seedDemoData.js
 *
 * Populates realistic demo data for hackathon presentation.
 * Safe to re-run: all demo records are prefixed with "[DEMO]" and
 * are cleaned before re-inserting so the dataset stays consistent.
 *
 * Prerequisites:
 *   npm run seed:users      (must run first)
 *   npm run seed:resources  (must run first)
 *
 * Usage:
 *   npm run seed:demo
 */

const mongoose = require('mongoose');
const Incident = require('../models/Incident');
const Resource = require('../models/Resource');
const Alert    = require('../models/Alert');
const User     = require('../models/User');
const env      = require('../config/env');

// ─── helpers ────────────────────────────────────────────────────────────────

const ago = (minutes) => new Date(Date.now() - minutes * 60 * 1000);

// ─── main ───────────────────────────────────────────────────────────────────

const seedDemoData = async () => {
  try {
    // 1. Connect ─────────────────────────────────────────────────────────────
    console.log('\n[SEED] Connecting to database…');
    await mongoose.connect(env.MONGODB_URI);
    console.log('[SEED] Database connected.');

    // 2. Resolve prerequisite users ──────────────────────────────────────────
    const adminUser     = await User.findOne({ email: 'admin@disasterconnect.dev' });
    const responderUser = await User.findOne({ email: 'responder@disasterconnect.dev' });
    const citizenUser   = await User.findOne({ email: 'citizen@disasterconnect.dev' });

    if (!adminUser || !responderUser || !citizenUser) {
      console.error('[SEED] ❌  One or more demo users are missing.');
      console.error('[SEED]     Run `npm run seed:users` first.');
      process.exit(1);
    }
    console.log('[SEED] ✓  Demo users confirmed.');

    // 3. Resolve prerequisite resources ──────────────────────────────────────
    const allResources = await Resource.find({});
    if (allResources.length === 0) {
      console.error('[SEED] ❌  No resources found in database.');
      console.error('[SEED]     Run `npm run seed:resources` first.');
      process.exit(1);
    }
    console.log(`[SEED] ✓  ${allResources.length} resource(s) found.`);

    // 4. Idempotent cleanup ───────────────────────────────────────────────────
    const deletedIncidents = await Incident.deleteMany({ title: { $regex: /^\[DEMO\]/ } });
    const deletedAlerts    = await Alert.deleteMany({ title: { $regex: /^\[DEMO\]/ } });

    // Reset any resources that were previously assigned by this script
    await Resource.updateMany(
      { name: { $in: allResources.map(r => r.name) }, status: 'assigned' },
      { $set: { status: 'available', assignedIncident: null } }
    );

    console.log(`[SEED] ✓  Cleaned ${deletedIncidents.deletedCount} old demo incident(s) and ${deletedAlerts.deletedCount} old demo alert(s).`);

    // 5. Build demo incidents ─────────────────────────────────────────────────
    //
    // Coordinates: [longitude, latitude]  (GeoJSON)
    // Clustered around Bhopal / LNCT area to create visible density hotspots.
    //
    const incidentDefs = [
      // ── CLUSTER A – LNCT / Raisen Road (3 incidents → dense hotspot) ────
      {
        title:       '[DEMO] Fire Outbreak Near LNCT Main Gate',
        description: 'Large fire reported at a transformer yard beside LNCT main gate. Smoke visible from 500m. Security has cordoned the area. Electricity tripped in adjacent hostels.',
        type:        'fire',
        severity:    'critical',
        status:      'in-progress',
        location: {
          type: 'Point',
          coordinates: [77.5022, 23.2832],
          address:     'LNCT Main Gate, Raisen Road, Bhopal'
        },
        reportedBy:        citizenUser._id,
        assignedResponder: responderUser._id,
        statusHistory: [
          { status: 'reported',    changedBy: citizenUser._id,   note: 'Fire reported by on-site security guard.',         changedAt: ago(110) },
          { status: 'verified',    changedBy: adminUser._id,     note: 'Admin verified via CCTV footage.',                 changedAt: ago(95) },
          { status: 'assigned',    changedBy: adminUser._id,     note: 'Responder dispatched to scene.',                  changedAt: ago(80) },
          { status: 'in-progress', changedBy: responderUser._id, note: 'Fire suppression unit actively engaging blaze.',  changedAt: ago(60) }
        ],
        createdAt: ago(110)
      },
      {
        title:       '[DEMO] Medical Emergency – Student Collapse LNCT Campus',
        description: 'A student collapsed near the LNCT cafeteria, reportedly due to heat exhaustion. Ambulance requested. Campus doctor present but oxygen support unavailable.',
        type:        'medical',
        severity:    'high',
        status:      'assigned',
        location: {
          type: 'Point',
          coordinates: [77.5045, 23.2815],
          address:     'LNCT Campus, Cafeteria Block, Raisen Road, Bhopal'
        },
        reportedBy:        citizenUser._id,
        assignedResponder: responderUser._id,
        statusHistory: [
          { status: 'reported', changedBy: citizenUser._id, note: 'Reported via citizen app.', changedAt: ago(55) },
          { status: 'verified', changedBy: adminUser._id,   note: 'Admin verified – ambulance en route.', changedAt: ago(45) },
          { status: 'assigned', changedBy: adminUser._id,   note: 'Responder assigned.', changedAt: ago(35) }
        ],
        createdAt: ago(55)
      },
      {
        title:       '[DEMO] Crowd Surge at LNCT Event Entry',
        description: 'Unmanaged crowd of approximately 2,000 students at the LNCT techfest gate. Multiple minor injuries from pushing. Barrier collapsed. Security overwhelmed.',
        type:        'crowd',
        severity:    'critical',
        status:      'in-progress',
        location: {
          type: 'Point',
          coordinates: [77.5038, 23.2842],
          address:     'LNCT Techfest Entry Gate, Raisen Road, Bhopal'
        },
        reportedBy:        adminUser._id,
        assignedResponder: responderUser._id,
        statusHistory: [
          { status: 'reported',    changedBy: adminUser._id,     note: 'Admin flagged based on live camera feeds.', changedAt: ago(90) },
          { status: 'verified',    changedBy: adminUser._id,     note: 'Confirmed critical. Escalated immediately.', changedAt: ago(85) },
          { status: 'assigned',    changedBy: adminUser._id,     note: 'Dispatch team mobilised.',                   changedAt: ago(75) },
          { status: 'in-progress', changedBy: responderUser._id, note: 'Crowd dispersal underway.',                  changedAt: ago(60) }
        ],
        createdAt: ago(90)
      },

      // ── CLUSTER B – Govindpura / JK Road (2 incidents) ──────────────────
      {
        title:       '[DEMO] Accident – Two-Wheeler Collision on JK Road',
        description: 'Two motorcycles collided at the JK Road intersection. One rider critically injured, another has a fractured arm. Traffic blocked in both directions.',
        type:        'accident',
        severity:    'high',
        status:      'resolved',
        location: {
          type: 'Point',
          coordinates: [77.4640, 23.2490],
          address:     'JK Road Intersection, Govindpura, Bhopal'
        },
        reportedBy: citizenUser._id,
        statusHistory: [
          { status: 'reported',    changedBy: citizenUser._id,   note: 'Reported by eyewitness.',             changedAt: ago(300) },
          { status: 'verified',    changedBy: adminUser._id,     note: 'Police confirmation received.',        changedAt: ago(285) },
          { status: 'assigned',    changedBy: adminUser._id,     note: 'Ambulance assigned.',                  changedAt: ago(270) },
          { status: 'in-progress', changedBy: responderUser._id, note: 'Injured persons receiving first aid.', changedAt: ago(250) },
          { status: 'resolved',    changedBy: adminUser._id,     note: 'Patients transported to hospital.',    changedAt: ago(200) }
        ],
        createdAt: ago(300)
      },
      {
        title:       '[DEMO] Industrial Gas Leak – Govindpura MSME Zone',
        description: 'Chlorine-like odour detected near a small chemical unit in Govindpura. Workers evacuated. Three persons showing respiratory symptoms. Area cordoned by local police.',
        type:        'other',
        severity:    'critical',
        status:      'verified',
        location: {
          type: 'Point',
          coordinates: [77.4680, 23.2510],
          address:     'MSME Industrial Zone, Govindpura, Bhopal'
        },
        reportedBy: citizenUser._id,
        statusHistory: [
          { status: 'reported', changedBy: citizenUser._id, note: 'Reported by factory worker.',       changedAt: ago(40) },
          { status: 'verified', changedBy: adminUser._id,   note: 'Admin verified via district alert.', changedAt: ago(25) }
        ],
        createdAt: ago(40)
      },

      // ── CLUSTER C – MP Nagar / Ayodhya Bypass (2 incidents) ────────────
      {
        title:       '[DEMO] Flooding at MP Nagar Zone-II Underpass',
        description: 'Heavy rains caused waterlogging at the Zone-II underpass. Water level at ~3 feet. Two vehicles stalled. Commuters stranded on both sides.',
        type:        'flood',
        severity:    'medium',
        status:      'in-progress',
        location: {
          type: 'Point',
          coordinates: [77.4320, 23.2340],
          address:     'MP Nagar Zone-II Underpass, Bhopal'
        },
        reportedBy:        citizenUser._id,
        assignedResponder: responderUser._id,
        statusHistory: [
          { status: 'reported',    changedBy: citizenUser._id,   note: 'Reported via map form.',           changedAt: ago(130) },
          { status: 'verified',    changedBy: adminUser._id,     note: 'Rainfall data confirmed.',          changedAt: ago(115) },
          { status: 'assigned',    changedBy: adminUser._id,     note: 'Rescue team dispatched.',           changedAt: ago(100) },
          { status: 'in-progress', changedBy: responderUser._id, note: 'Pump units working.',               changedAt: ago(80) }
        ],
        createdAt: ago(130)
      },
      {
        title:       '[DEMO] Road Blockage – Tree Fall Ayodhya Bypass',
        description: 'A large neem tree fell across Ayodhya Bypass near Arera Colony junction following strong winds. Three lanes blocked. Traffic diverted by police.',
        type:        'accident',
        severity:    'medium',
        status:      'reported',
        location: {
          type: 'Point',
          coordinates: [77.4450, 23.2180],
          address:     'Ayodhya Bypass, Arera Colony Junction, Bhopal'
        },
        reportedBy: adminUser._id,
        statusHistory: [
          { status: 'reported', changedBy: adminUser._id, note: 'Patrol team spotted tree fall.', changedAt: ago(20) }
        ],
        createdAt: ago(20)
      },

      // ── CLUSTER D – Kalchuri Nagar / BHEL (2 incidents) ─────────────────
      {
        title:       '[DEMO] Power Outage – Kalchuri Nagar Residential Block',
        description: 'Electricity disrupted in 12 residential buildings since last evening. Hospital emergency backup running. Residents without water pump. Local sub-station overloaded.',
        type:        'other',
        severity:    'low',
        status:      'reported',
        location: {
          type: 'Point',
          coordinates: [77.4100, 23.2560],
          address:     'Kalchuri Nagar, Block 7, Bhopal'
        },
        reportedBy: citizenUser._id,
        statusHistory: [
          { status: 'reported', changedBy: citizenUser._id, note: 'Filed via citizen portal.', changedAt: ago(15) }
        ],
        createdAt: ago(15)
      },
      {
        title:       '[DEMO] Minor Fire – BHEL Canteen Kitchen',
        description: 'Small grease fire in BHEL township canteen kitchen. Staff used extinguisher and contained it. No injuries. Kitchen closed for safety inspection.',
        type:        'fire',
        severity:    'low',
        status:      'resolved',
        location: {
          type: 'Point',
          coordinates: [77.4580, 23.2310],
          address:     'BHEL Township Canteen, Bhopal'
        },
        reportedBy: adminUser._id,
        statusHistory: [
          { status: 'reported',    changedBy: adminUser._id,     note: 'Staff raised alarm.',          changedAt: ago(500) },
          { status: 'verified',    changedBy: adminUser._id,     note: 'Site team confirmed.',          changedAt: ago(490) },
          { status: 'in-progress', changedBy: responderUser._id, note: 'Extinguisher used by staff.',   changedAt: ago(485) },
          { status: 'resolved',    changedBy: adminUser._id,     note: 'Fire out. No injuries.',        changedAt: ago(470) }
        ],
        createdAt: ago(500)
      },

      // ── CLUSTER E – Additional citizen reports ────────────────────────────
      {
        title:       '[DEMO] Stray Cattle Blocking Raisen Road',
        description: 'Large herd of stray cattle blocking the main lane of Raisen Road near LNCT. Risk of accidents in night hours. Drivers honking aggressively.',
        type:        'other',
        severity:    'low',
        status:      'reported',
        location: {
          type: 'Point',
          coordinates: [77.4990, 23.2800],
          address:     'Raisen Road, Near LNCT, Bhopal'
        },
        reportedBy: citizenUser._id,
        statusHistory: [
          { status: 'reported', changedBy: citizenUser._id, note: 'Citizen photo evidence uploaded.', changedAt: ago(10) }
        ],
        createdAt: ago(10)
      },
      {
        title:       '[DEMO] Crowd Control Required – Hamidia Road Market',
        description: 'Weekend market at Hamidia Road overflow past footpaths. Vehicle movement blocked. Pickpocketing incidents reported. Police presence requested.',
        type:        'crowd',
        severity:    'medium',
        status:      'verified',
        location: {
          type: 'Point',
          coordinates: [77.3980, 23.2620],
          address:     'Hamidia Road Market, Old Bhopal'
        },
        reportedBy: citizenUser._id,
        statusHistory: [
          { status: 'reported', changedBy: citizenUser._id, note: 'Reported during morning patrol.', changedAt: ago(75) },
          { status: 'verified', changedBy: adminUser._id,   note: 'Confirmed by admin.', changedAt: ago(60) }
        ],
        createdAt: ago(75)
      }
    ];

    // 6. Insert incidents ─────────────────────────────────────────────────────
    // Using insertMany with lean objects; bypass pre-save statusHistory hook
    // by only inserting entries that already have statusHistory filled.
    // We need to use create() individually so mongoose hooks run, but since
    // we pre-build statusHistory, we set a flag via a workaround: set
    // the statusHistory before create so the hook's `if length === 0` is skipped.
    const createdIncidents = [];
    for (const def of incidentDefs) {
      const incident = await Incident.create(def);
      createdIncidents.push(incident);
    }
    console.log(`[SEED] ✓  Created ${createdIncidents.length} demo incident(s).`);

    // 7. Assign resources to active incidents ─────────────────────────────────
    // Strategy: pick a couple of resources and assign them to in-progress incidents
    const inProgressIncidents = createdIncidents.filter(i => i.status === 'in-progress' || i.status === 'assigned');
    const ambulance  = allResources.find(r => r.type === 'ambulance');
    const fireTruck  = allResources.find(r => r.type === 'fire_truck');
    const rescueTeam = allResources.find(r => r.type === 'rescue_team');

    let assignedResourceCount = 0;

    if (ambulance && inProgressIncidents[0]) {
      const inc = inProgressIncidents[0];
      inc.assignedResources.addToSet(ambulance._id);
      await inc.save();
      ambulance.status          = 'assigned';
      ambulance.assignedIncident = inc._id;
      await ambulance.save();
      assignedResourceCount++;
    }

    if (fireTruck && inProgressIncidents[1]) {
      const inc = inProgressIncidents[1];
      inc.assignedResources.addToSet(fireTruck._id);
      await inc.save();
      fireTruck.status          = 'assigned';
      fireTruck.assignedIncident = inc._id;
      await fireTruck.save();
      assignedResourceCount++;
    }

    if (rescueTeam && inProgressIncidents[2]) {
      const inc = inProgressIncidents[2];
      inc.assignedResources.addToSet(rescueTeam._id);
      await inc.save();
      rescueTeam.status          = 'assigned';
      rescueTeam.assignedIncident = inc._id;
      await rescueTeam.save();
      assignedResourceCount++;
    }

    console.log(`[SEED] ✓  Assigned ${assignedResourceCount} resource(s) to active demo incidents.`);

    // 8. Create demo alerts ───────────────────────────────────────────────────
    const criticalIncident = createdIncidents.find(i => i.severity === 'critical' && i.status === 'in-progress');
    const assignedIncident = createdIncidents.find(i => i.status === 'assigned');
    const resolvedIncident = createdIncidents.find(i => i.status === 'resolved');

    const alertDefs = [
      {
        title:           '[DEMO] CRITICAL: Active Fire at LNCT Main Gate',
        message:         '[DEMO] Fire suppression units are currently engaged at LNCT Main Gate. Avoid Raisen Road. All admin staff on standby.',
        type:            'incident_created',
        priority:        'critical',
        targetRoles:     ['admin', 'responder'],
        relatedIncident: criticalIncident?._id,
        createdBy:       adminUser._id
      },
      {
        title:           '[DEMO] Responder Assignment: Medical Emergency – LNCT Campus',
        message:         '[DEMO] You have been assigned to a medical emergency at LNCT Campus cafeteria block. Patient is conscious. Ambulance en route.',
        type:            'incident_assigned',
        priority:        'high',
        targetRoles:     ['responder'],
        targetUsers:     [responderUser._id],
        relatedIncident: assignedIncident?._id,
        createdBy:       adminUser._id
      },
      {
        title:           '[DEMO] Status Update: Crowd Surge LNCT Techfest',
        message:         '[DEMO] Crowd control operation at LNCT Techfest entry gate is in progress. Barriers being restored. Injuries are minor.',
        type:            'status_updated',
        priority:        'high',
        targetRoles:     ['admin', 'responder', 'citizen'],
        createdBy:       adminUser._id
      },
      {
        title:           '[DEMO] Resource Dispatched: Ambulance to JK Road',
        message:         '[DEMO] Bhopal Central Ambulance 01 has been dispatched to the accident site on JK Road, Govindpura.',
        type:            'resource_updated',
        priority:        'medium',
        targetRoles:     ['admin'],
        createdBy:       adminUser._id
      },
      {
        title:           '[DEMO] Incident Resolved: BHEL Canteen Fire',
        message:         '[DEMO] The minor fire at BHEL Township Canteen has been resolved. No injuries reported. Resources released back to inventory.',
        type:            'status_updated',
        priority:        'low',
        targetRoles:     ['admin', 'responder', 'citizen'],
        relatedIncident: resolvedIncident?._id,
        createdBy:       adminUser._id
      },
      {
        title:           '[DEMO] Safety Alert: Flooding MP Nagar Underpass',
        message:         '[DEMO] Heavy waterlogging at MP Nagar Zone-II underpass. Citizens advised to use alternate routes. Rescue team is on site.',
        type:            'system',
        priority:        'high',
        targetRoles:     ['admin', 'responder', 'citizen'],
        createdBy:       adminUser._id
      },
      {
        title:           '[DEMO] Your Incident Report Was Verified',
        message:         '[DEMO] Your incident report has been reviewed and verified by the admin team. A responder has been assigned. You will receive further updates.',
        type:            'status_updated',
        priority:        'medium',
        targetRoles:     ['citizen'],
        targetUsers:     [citizenUser._id],
        createdBy:       adminUser._id
      }
    ];

    const createdAlerts = await Alert.insertMany(alertDefs);
    console.log(`[SEED] ✓  Created ${createdAlerts.length} demo alert(s).`);

    // 9. Summary ──────────────────────────────────────────────────────────────
    const incidentsByStatus = createdIncidents.reduce((acc, i) => {
      acc[i.status] = (acc[i.status] || 0) + 1;
      return acc;
    }, {});

    const incidentsBySeverity = createdIncidents.reduce((acc, i) => {
      acc[i.severity] = (acc[i.severity] || 0) + 1;
      return acc;
    }, {});

    const citizenIncidents  = createdIncidents.filter(i => i.reportedBy.equals(citizenUser._id)).length;
    const responderAssigned = createdIncidents.filter(i => i.assignedResponder && i.assignedResponder.equals(responderUser._id)).length;

    console.log('\n╔══════════════════════════════════════════╗');
    console.log('║        DEMO DATA SEED COMPLETE           ║');
    console.log('╠══════════════════════════════════════════╣');
    console.log(`║  Incidents created : ${String(createdIncidents.length).padEnd(20)} ║`);
    console.log(`║  Citizen reports   : ${String(citizenIncidents).padEnd(20)} ║`);
    console.log(`║  Responder assigned: ${String(responderAssigned).padEnd(20)} ║`);
    console.log(`║  Resources assigned: ${String(assignedResourceCount).padEnd(20)} ║`);
    console.log(`║  Alerts created    : ${String(createdAlerts.length).padEnd(20)} ║`);
    console.log('╠══════════════════════════════════════════╣');
    console.log('║  Status breakdown:                        ║');
    Object.entries(incidentsByStatus).forEach(([s, n]) => {
      console.log(`║    ${(s + ':').padEnd(18)} ${String(n).padEnd(22)} ║`);
    });
    console.log('╠══════════════════════════════════════════╣');
    console.log('║  Severity breakdown:                      ║');
    Object.entries(incidentsBySeverity).forEach(([s, n]) => {
      console.log(`║    ${(s + ':').padEnd(18)} ${String(n).padEnd(22)} ║`);
    });
    console.log('╚══════════════════════════════════════════╝\n');

  } catch (error) {
    console.error('[SEED] ❌  Error:', error.message);
    if (error.stack) console.error(error.stack);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('[SEED] Database connection closed.');
    process.exit(0);
  }
};

seedDemoData();
