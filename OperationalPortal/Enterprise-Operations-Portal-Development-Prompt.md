# Enterprise Operations Portal Development Prompt

# Project Overview
You are an expert **Enterprise Software Architect**, **Senior Frontend Engineer**, **System Designer**, **UI/UX Architect**, and **Operations Platform Specialist** responsible for designing the **Operations Portal** for an enterprise-grade super application called the **Unified Digital Concierge Ecosystem**.

The Unified Digital Concierge Ecosystem is a multi-sided digital platform connecting:

- Customers
- Accommodation Partners
- Restaurant Partners
- Riders & Transport Partners
- Payment Providers
- AI Concierge Services
- Internal Operations Teams
through one centralized ecosystem.

The Operations Portal is the internal operational command center used by company staff to monitor, coordinate, and support all platform activities in real time.

Other portals include:

- Customer Portal
- Accommodation Partner Portal
- Restaurant Partner Portal
- Rider & Transport Partner Portal
- Customer Support Portal
- Finance Portal
- Admin Portal
- Super Admin Portal
The Operations Portal must integrate with every portal through shared backend APIs while remaining independent and focused on operational oversight.

---

# Primary Objective
The Operations Portal is the **Mission Control Center** of the Unified Digital Concierge Ecosystem.

Unlike partner portals, it does **not own accommodation, restaurant, rider, or customer data**.

Instead, it consumes operational events from every module, allowing internal teams to:

- Monitor live platform activity.
- Coordinate service delivery.
- Respond to incidents.
- Resolve operational issues.
- Track performance.
- Ensure service quality.
- Maintain Service Level Agreements (SLAs).
- Keep the platform running efficiently.
The Operations Portal is the central workspace for operations managers, dispatch teams, logistics coordinators, supervisors, and incident response personnel.

---

# Users of the Operations Portal
The portal should support multiple operational roles, including:

- Operations Manager
- Dispatch Officer
- Logistics Coordinator
- Field Supervisor
- Incident Response Officer
- Compliance Officer
- Operations Analyst
- Shift Supervisor
- Regional Operations Manager
Role-based permissions must determine what each user can view and manage.

---

# Enterprise Dashboard
The home dashboard should provide a real-time overview of the platform.

Display:

- Active Customers
- Active Accommodation Bookings
- Active Food Orders
- Active Ride Requests
- Active Deliveries
- Online Riders
- Available Riders
- Offline Riders
- Active Restaurants
- Active Accommodation Partners
- Pending Partner Approvals
- Pending Customer Issues
- Pending Operational Incidents
- Revenue Today
- Platform Health Status
- API Status
- Notification Center
- AI Operations Insights
Dashboard widgets must refresh automatically using real-time data.

---

# Live Booking Monitor
Display all accommodation bookings in real time.

Track:

- Booking Status
- Property
- Customer
- Check-in Date
- Check-out Date
- Payment Status
- Booking Value
- Assigned Property
Allow operations staff to:

- View booking details
- Monitor booking progress
- Escalate issues
- Contact accommodation partner
- Contact customer

---

# Live Restaurant Order Monitor
Monitor food orders across the platform.

Display:

- Restaurant
- Customer
- Order Status
- Preparation Status
- Rider Assignment
- Delivery Progress
- Payment Status
Allow operations staff to:

- Monitor delays
- Reassign deliveries
- Escalate issues
- Contact restaurants
- Contact riders

---

# Live Ride & Transport Monitor
Track all transportation services.

Display:

- Driver
- Vehicle
- Customer
- Pickup Location
- Destination
- Driver Status
- ETA
- Trip Status
- Ride Duration
Allow staff to:

- Monitor active rides
- Handle delays
- Resolve incidents
- Reassign drivers when necessary

---

# Live Maps
Provide interactive maps displaying:

- Rider Locations
- Restaurant Locations
- Accommodation Locations
- Customer Pickup Points
- Active Deliveries
- Active Trips
- High-Demand Zones
- Traffic Conditions
Support filtering by:

- City
- Region
- Service Type
- Partner
- Status

---

# Dispatch Center
Provide centralized dispatch capabilities.

Allow operations staff to:

- Assign riders manually
- Reassign deliveries
- Reassign ride requests
- Resolve dispatch conflicts
- Monitor dispatch queues

---

# Incident Management
Create a complete incident management module.

Support:

- Incident Creation
- Incident Classification
- Priority Levels
- Escalation Workflows
- Resolution Tracking
- Root Cause Analysis
- Incident Timeline
- Attachments
- Comments
- Resolution Reports

---

# Customer Escalation Center
Monitor customer issues.

Track:

- Booking complaints
- Ride complaints
- Delivery complaints
- Payment disputes
- Service quality issues
Allow:

- Escalation
- Assignment
- Resolution
- Follow-up

---

# Partner Monitoring
Monitor all partners.

Accommodation Partners

Restaurant Partners

Riders

Track:

- Online Status
- Performance
- SLA Compliance
- Customer Ratings
- Operational Issues

---

# Performance Monitoring
Monitor:

- Booking Success Rate
- Order Success Rate
- Delivery Success Rate
- Ride Completion Rate
- Average Response Time
- Average Delivery Time
- Average Ride Time
- Customer Satisfaction
- Partner Performance
- Rider Performance

---

# SLA Management
Monitor service commitments.

Track:

- Booking Response Time
- Restaurant Preparation Time
- Rider Pickup Time
- Delivery Time
- Ride Arrival Time
- Resolution Time
Automatically identify SLA violations and generate alerts.

---

# AI Operations Assistant
The AI assistant should provide:

- Operational summaries
- Bottleneck detection
- Demand forecasting
- Resource recommendations
- Staffing recommendations
- High-demand area prediction
- Delay prediction
- Incident recommendations
- Automated reports
- Risk analysis

---

# Notification Center
Provide real-time notifications for:

- New incidents
- SLA violations
- Partner issues
- Rider issues
- Payment failures
- Booking failures
- Order delays
- Ride delays
- System alerts
- AI recommendations

---

# Activity Timeline
Provide a chronological platform activity stream.

Display:

- Bookings
- Orders
- Deliveries
- Trips
- Payments
- Escalations
- Incidents
- Partner actions
Support advanced filtering and search.

---

# Reports & Analytics
Generate operational reports including:

- Daily Operations
- Weekly Operations
- Monthly Operations
- Regional Performance
- Partner Performance
- Rider Performance
- Restaurant Performance
- Accommodation Performance
- Incident Reports
- SLA Reports
Support export to:

- PDF
- Excel
- CSV

---

# Audit Logs
Record every operational activity.

Track:

- User
- Action
- Timestamp
- Module
- Before & After Changes
- IP Address
- Device Information
Audit logs must be immutable and searchable.

---

# Communication Center
Provide secure communication with:

- Customers
- Accommodation Partners
- Restaurant Partners
- Riders
- Customer Support
- Finance Team
- Admin Team
Support:

- Internal Chat
- Announcements
- Broadcast Messages
- Escalation Notes

---

# Platform Health Monitoring
Provide operational visibility into platform services.

Monitor:

- API Health
- Database Status
- Queue Status
- Notification Services
- Payment Gateway Status
- Search Service
- AI Service
- File Storage
- Background Jobs
Generate automatic alerts for degraded services.

---

# Data Ownership & Integration
The Operations Portal does not own customer, partner, or transaction data.

Instead, it consumes operational events from:

- Customer Portal
- Accommodation Partner Portal
- Restaurant Partner Portal
- Rider & Transport Partner Portal
- Finance Portal
- Customer Support Portal
The Operations Portal provides a centralized operational view while allowing authorized interventions where business rules permit.

---

# Live Synchronization Requirements
Examples:

When a customer books accommodation:

→ Booking appears instantly in the Live Booking Monitor.

When a restaurant accepts an order:

→ Order status updates immediately.

When a rider accepts a delivery:

→ Delivery tracking begins automatically.

When an incident is reported:

→ Operations receives an alert instantly.

When an SLA threshold is exceeded:

→ AI generates recommendations and alerts the responsible team.

All operational events must synchronize across the platform in real time.

---

# Platform Data Flow
Customer Portal

↓

Accommodation Partner Portal

↓

Restaurant Partner Portal

↓

Rider & Transport Partner Portal

↓

Shared Backend Services

↓

Operations Portal

↓

Operations Team

↓

Incident Resolution

↓

Customer Experience Improvement

The Operations Portal functions as the central monitoring and coordination layer of the entire ecosystem.

---

# User Interface
Design a premium enterprise operations dashboard inspired by modern Network Operations Centers (NOC) and Operations Control Centers.

The interface should be:

- Modern
- Clean
- Information-rich
- Responsive
- Fast
- Accessible
Support:

- Light Mode
- Dark Mode
Responsive layouts for:

- Desktop
- Tablet
Desktop should be the primary experience due to the complexity of operational workflows.

---

# Technical Requirements
Use:

- React
- Vite
- TypeScript
- Tailwind CSS
- Redux Toolkit
- React Query
- React Router
- Axios
- React Hook Form
- Framer Motion
- Google Maps or Leaflet
- WebSockets or Server-Sent Events (SSE) for live updates
Follow:

- Feature-first architecture
- Domain-driven design
- Clean Architecture
- API-first communication
- Reusable components
- Role-based routing
No business logic inside UI components.

---

# Folder Structure
All Operations Portal functionality must reside inside:

features/operations/

Modules:

- Dashboard
- Live Booking Monitor
- Live Order Monitor
- Live Ride Monitor
- Live Maps
- Dispatch Center
- Incident Management
- Customer Escalations
- Partner Monitoring
- Performance Monitoring
- SLA Management
- Reports
- Audit Logs
- Notifications
- Communication
- Platform Health
- AI Operations Assistant
- Profile
- Settings
Each module should contain:

- api/
- components/
- hooks/
- pages/
- routes/
- services/
- store/
- types/
- utils/
- validation/
- tests/
The Operations Portal must remain modular and integrate with every other portal exclusively through shared backend APIs and real-time event streams.

---

# Expected Outcome
Generate a production-ready, enterprise-grade Operations Portal that serves as the centralized operational command center for the Unified Digital Concierge Ecosystem.

The portal must:

- Provide real-time visibility across accommodation bookings, restaurant orders, transportation, payments, and platform services.
- Enable operations teams to monitor, coordinate, and resolve issues efficiently.
- Integrate with all platform portals through shared backend APIs and live event streams.
- Scale to support thousands of partners, millions of transactions, and multi-region deployments.
- Follow enterprise software architecture, clean code principles, and a modular feature-first design suitable for a large-scale, multi-tenant platform.
