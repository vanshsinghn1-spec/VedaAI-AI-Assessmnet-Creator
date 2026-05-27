'use client';

export default function SettingsPage() {
  return (
    <div className="settings-page">
      <div className="assignments-header">
        <h1>Settings</h1>
        <p>Manage your account and preferences.</p>
      </div>

      <div style={{ maxWidth: '600px', marginTop: '32px' }}>
        <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '24px' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '18px' }}>Profile Information</h3>
          
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input type="text" className="form-input" defaultValue="John Doe" />
          </div>
          
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" className="form-input" defaultValue="john.doe@example.com" />
          </div>
        </div>

        <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '24px' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '18px' }}>School Details</h3>
          
          <div className="form-group">
            <label className="form-label">School Name</label>
            <input type="text" className="form-input" defaultValue="Delhi Public School" />
          </div>
          
          <div className="form-group">
            <label className="form-label">Location</label>
            <input type="text" className="form-input" defaultValue="Bokaro Steel City" />
          </div>
        </div>

        <button className="btn-primary">Save Changes</button>
      </div>
    </div>
  );
}
