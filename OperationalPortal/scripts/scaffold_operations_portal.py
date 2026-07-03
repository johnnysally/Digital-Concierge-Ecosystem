from pathlib import Path
import re

root = Path.cwd() / 'src' / 'features' / 'operations'
modules = {
    'dashboard': ['Dashboard Home', 'Executive Dashboard', 'Regional Dashboard', 'Live Activity Dashboard', 'Operations KPIs'],
    'liveOperations': ['Live Accommodation Bookings', 'Live Restaurant Orders', 'Live Ride Requests', 'Live Food Deliveries', 'Live Airport Transfers', 'Live Customer Activity', 'Real-Time Activity Feed'],
    'dispatchCenter': ['Dispatch Dashboard', 'Pending Dispatches', 'Driver Assignment', 'Restaurant Assignment', 'Ride Assignment', 'Delivery Assignment', 'Dispatch Queue', 'Manual Dispatch', 'Dispatch History'],
    'accommodationMonitoring': ['Accommodation Overview', 'Properties', 'Active Bookings', 'Upcoming Check-ins', 'Upcoming Check-outs', 'Cancelled Bookings', 'Availability Monitor', 'Property Performance', 'Partner Status'],
    'restaurantMonitoring': ['Restaurant Overview', 'Restaurant Directory', 'Active Orders', 'Preparing Orders', 'Ready for Pickup', 'Delivered Orders', 'Cancelled Orders', 'Restaurant Performance', 'Restaurant Availability'],
    'riderMonitoring': ['Rider Dashboard', 'Online Riders', 'Offline Riders', 'Busy Riders', 'Available Riders', 'Vehicle Monitoring', 'Active Trips', 'Active Deliveries', 'Driver Performance', 'GPS Tracking'],
    'customerMonitoring': ['Customer Overview', 'Active Customers', 'Current Trips', 'Current Orders', 'Current Bookings', 'Customer Timeline', 'VIP Customers', 'Customer Issues'],
    'mapsTracking': ['Live Operations Map', 'Rider Locations', 'Restaurant Locations', 'Accommodation Locations', 'Customer Locations', 'Demand Heat Map', 'Traffic Map', 'Regional Coverage'],
    'incidentManagement': ['Incident Dashboard', 'Open Incidents', 'Critical Incidents', 'Resolved Incidents', 'Incident Categories', 'Escalation Queue', 'Incident Timeline', 'Root Cause Analysis'],
    'customerEscalations': ['Booking Complaints', 'Food Complaints', 'Ride Complaints', 'Payment Complaints', 'General Complaints', 'Escalated Cases', 'Resolution Center'],
    'partnerSupport': ['Accommodation Support', 'Restaurant Support', 'Rider Support', 'Partner Tickets', 'Partner Violations', 'Partner Warnings', 'Partner Suspension'],
    'slaMonitoring': ['SLA Dashboard', 'Booking SLA', 'Restaurant SLA', 'Ride SLA', 'Delivery SLA', 'Response Time', 'Violation Reports'],
    'performanceMonitoring': ['Platform Performance', 'Accommodation Performance', 'Restaurant Performance', 'Rider Performance', 'Regional Performance', 'City Performance', 'Peak Hour Analysis'],
    'operationsAnalytics': ['Operations Overview', 'Daily Analytics', 'Weekly Analytics', 'Monthly Analytics', 'Demand Analysis', 'Revenue Analysis', 'Booking Trends', 'Ride Trends', 'Food Trends', 'Growth Reports'],
    'aiOperationsCenter': ['AI Dashboard', 'Operational Insights', 'Demand Forecast', 'Resource Allocation', 'Delay Prediction', 'Risk Detection', 'Optimization Suggestions', 'AI Reports'],
    'communicationCenter': ['Inbox', 'Customer Messages', 'Partner Messages', 'Broadcast Messages', 'Announcements', 'Emergency Alerts', 'Templates'],
    'notifications': ['Notification Center', 'Unread Notifications', 'System Alerts', 'Operational Alerts', 'Emergency Alerts', 'Notification History'],
    'reports': ['Daily Reports', 'Weekly Reports', 'Monthly Reports', 'Booking Reports', 'Restaurant Reports', 'Ride Reports', 'Delivery Reports', 'Incident Reports', 'Export Center'],
    'auditCompliance': ['Audit Logs', 'Activity Logs', 'Security Logs', 'Compliance Reports', 'System Events', 'User Activity'],
    'platformHealth': ['Platform Status', 'API Health', 'Database Status', 'Queue Monitoring', 'Notification Services', 'Payment Gateway Status', 'Storage Monitoring', 'Background Jobs'],
    'userManagement': ['Operations Users', 'Roles', 'Permissions', 'Teams', 'Departments', 'Shift Management'],
    'profile': ['My Profile', 'Security', 'Notification Preferences', 'Activity History', 'Sessions'],
    'settings': ['General Settings', 'Regional Settings', 'Operational Settings', 'Dispatch Settings', 'Notification Settings', 'Map Settings', 'Integration Settings'],
}

folder_types = ['api', 'components', 'hooks', 'pages', 'routes', 'services', 'store', 'types', 'utils', 'validation', 'tests']

# Create module folders and page files
for module_name, page_labels in modules.items():
    module_path = root / module_name
    for folder in folder_types:
        (module_path / folder).mkdir(parents=True, exist_ok=True)

    for label in page_labels:
        sanitized = re.sub(r'[^0-9a-zA-Z]', ' ', label).strip()
        component_name = ''.join(word.capitalize() for word in sanitized.split()) + 'Page'
        file_name = component_name + '.tsx'
        page_path = module_path / 'pages' / file_name
        if not page_path.exists():
            page_path.write_text(
                f"function {component_name}() {{\n"
                f"  return (\n"
                f"    <section className=\"space-y-6\">\n"
                f"      <div className=\"rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200/80\">\n"
                f"        <p className=\"text-sm uppercase tracking-[0.24em] text-slate-500\">{label}</p>\n"
                f"        <h1 className=\"mt-4 text-3xl font-semibold text-slate-900\">{label}</h1>\n"
                f"        <p className=\"mt-2 text-slate-500\">Placeholder page for {label} in the Operational Portal.</p>\n"
                f"      </div>\n"
                f"    </section>\n"
                f"  );\n"
                f"}}\n\nexport default {component_name};\n"
            )

# Build routes file
route_file = root / 'routes' / 'operationsRoutes.tsx'
imports = []
route_entries = []

for module_name, page_labels in modules.items():
    if module_name == 'dashboard':
        continue
    import_module_path = f"../{module_name}/pages"
    route_path = module_name
    first_label = page_labels[0]
    first_name = ''.join(word.capitalize() for word in re.sub(r'[^0-9a-zA-Z]', ' ', first_label).split()) + 'Page'
    imports.append(f"import {first_name} from '{import_module_path}/{first_name}.tsx';")
    child_routes = []
    for label in page_labels:
        page_name = ''.join(word.capitalize() for word in re.sub(r'[^0-9a-zA-Z]', ' ', label).split()) + 'Page'
        imports.append(f"import {page_name} from '{import_module_path}/{page_name}.tsx';")
        path_segment = re.sub(r'[^a-z0-9]+', '-', label.lower()).strip('-')
        if not path_segment:
            path_segment = 'index'
        child_routes.append(f"    {{ path: '{path_segment}', element: <{page_name} /> }}")
    default_redirect = re.sub(r'[^a-z0-9]+', '-', first_label.lower()).strip('-')
    route_entries.append(
        f"  {{ path: '{route_path}', element: <{first_name} />, children: [\n"
        f"    {{ path: '', element: <Navigate to='{default_redirect}' replace /> }},\n"
        + ',\n'.join(child_routes)
        + "\n  ] }}"
    )

route_file.write_text(
    'import { Navigate, useRoutes } from \'react-router-dom\';\n' +
    '\n'.join(sorted(set(imports))) +
    '\n\nconst routes = [\n' +
    '\n'.join(route_entries) +
    '\n];\n\nexport default function OperationsRoutes() {\n  return useRoutes(routes);\n}\n'
)

print('Scaffold complete.')
