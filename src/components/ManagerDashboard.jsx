import React from 'react';

const ManagerDashboard = ({ user, onLogout }) => {
  // Vehicle Data with Service Milestones
  const vehicleData = [
    { id: 'CONT-101', availability: 'Available', driverId: 'DRV-9912', location: 'Warehouse A', serviceDate: '2026-05-20' },
    { id: 'CONT-105', availability: 'In Transit', driverId: 'DRV-8821', location: 'Interstate 95', serviceDate: '2026-01-05' }, // Expired
    { id: 'CONT-210', availability: 'Maintenance', driverId: 'N/A', location: 'Main Garage', serviceDate: '2026-01-12' }, // Due Soon
  ];

  // Driver Data with Assigned Vehicle IDs
  const driverData = [
    { id: 'DRV-9912', name: 'John Doe', status: 'Active', location: 'Warehouse A', vehicleId: 'CONT-101' },
    { id: 'DRV-8821', name: 'Sarah Smith', status: 'On Break', location: 'Rest Stop 4', vehicleId: 'CONT-105' },
  ];

  // Helper to determine service urgency
  const getServiceStatus = (date) => {
    const today = new Date();
    const due = new Date(date);
    const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { label: 'EXPIRED', style: statusRed };
    if (diffDays <= 7) return { label: 'DUE SOON', style: statusOrange };
    return { label: 'HEALTHY', style: statusGreen };
  };

  return (
    <div style={{ padding: '30px', background: '#f8fafc', minHeight: '100vh', overflowY: 'auto' }}>
      <header style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ color: '#1e293b', margin: 0, fontSize: '32px' }}>Manager Portal</h1>
          <p style={{ color: '#64748b' }}>Fleet Safety & Service Oversight</p>
        </div>
        <button onClick={onLogout} style={logoutBtnStyle}>Logout</button>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', maxWidth: '1200px' }}>
        
        {/* Vehicle & Service Status */}
        <div style={cardStyle}>
          <h3 style={cardTitleStyle}>Vehicle Service Schedule</h3>
          <table style={tableStyle}>
            <thead>
              <tr style={headerRowStyle}>
                <th>Container ID</th>
                <th>Current Driver</th>
                <th>Location</th>
                <th>Service Due Date</th>
                <th>Service Status</th>
              </tr>
            </thead>
            <tbody>
              {vehicleData.map((v) => {
                const service = getServiceStatus(v.serviceDate);
                return (
                  <tr key={v.id} style={rowStyle}>
                    <td style={{ padding: '15px 0' }}><strong>{v.id}</strong></td>
                    <td>{v.driverId}</td>
                    <td>{v.location}</td>
                    <td>{v.serviceDate}</td>
                    <td>
                      <span style={service.style}>{service.label}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Driver Overview with Vehicle Link */}
        <div style={cardStyle}>
          <h3 style={cardTitleStyle}>Driver & Asset Assignment</h3>
          <table style={tableStyle}>
            <thead>
              <tr style={headerRowStyle}>
                <th>Driver ID</th>
                <th>Name</th>
                <th>Assigned Vehicle</th>
                <th>Status</th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody>
              {driverData.map((d) => (
                <tr key={d.id} style={rowStyle}>
                  <td style={{ padding: '15px 0' }}>{d.id}</td>
                  <td><strong>{d.name}</strong></td>
                  <td>{d.vehicleId}</td>
                  <td>
                    <span style={d.status === 'Active' ? statusGreen : statusRed}>
                      {d.status}
                    </span>
                  </td>
                  <td>{d.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

// Styles (consistent with your previous screenshots)
const cardStyle = { background: 'white', padding: '25px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' };
const cardTitleStyle = { color: '#3b82f6', fontSize: '20px', marginBottom: '20px', borderBottom: '2px solid #f1f5f9', paddingBottom: '10px' };
const tableStyle = { width: '100%', borderCollapse: 'collapse' };
const headerRowStyle = { textAlign: 'left', color: '#94a3b8', fontSize: '12px', textTransform: 'uppercase' };
const rowStyle = { borderBottom: '1px solid #f1f5f9', fontSize: '15px', color: '#334155' };

const statusGreen = { color: '#166534', background: '#dcfce7', padding: '4px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' };
const statusOrange = { color: '#92400e', background: '#fef3c7', padding: '4px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' };
const statusRed = { color: '#991b1b', background: '#fee2e2', padding: '4px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' };
const logoutBtnStyle = { padding: '10px 20px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' };

export default ManagerDashboard;