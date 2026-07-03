import { Navigate, useRoutes } from 'react-router-dom';
import AccommodationLocationsPage from '../mapsTracking/pages/AccommodationLocationsPage.tsx';
import AccommodationOverviewPage from '../accommodationMonitoring/pages/AccommodationOverviewPage.tsx';
import AccommodationPerformancePage from '../performanceMonitoring/pages/AccommodationPerformancePage.tsx';
import AccommodationSupportPage from '../partnerSupport/pages/AccommodationSupportPage.tsx';
import ActiveBookingsPage from '../accommodationMonitoring/pages/ActiveBookingsPage.tsx';
import ActiveCustomersPage from '../customerMonitoring/pages/ActiveCustomersPage.tsx';
import ActiveDeliveriesPage from '../riderMonitoring/pages/ActiveDeliveriesPage.tsx';
import ActiveOrdersPage from '../restaurantMonitoring/pages/ActiveOrdersPage.tsx';
import ActiveTripsPage from '../riderMonitoring/pages/ActiveTripsPage.tsx';
import ActivityHistoryPage from '../profile/pages/ActivityHistoryPage.tsx';
import ActivityLogsPage from '../auditCompliance/pages/ActivityLogsPage.tsx';
import AiDashboardPage from '../aiOperationsCenter/pages/AiDashboardPage.tsx';
import AiReportsPage from '../aiOperationsCenter/pages/AiReportsPage.tsx';
import DashboardHomePage from '../dashboard/pages/DashboardHomePage.tsx';
import ExecutiveDashboardPage from '../dashboard/pages/ExecutiveDashboardPage.tsx';
import LiveActivityDashboardPage from '../dashboard/pages/LiveActivityDashboardPage.tsx';
import OperationsKpisPage from '../dashboard/pages/OperationsKpisPage.tsx';
import RegionalDashboardPage from '../dashboard/pages/RegionalDashboardPage.tsx';
import AnnouncementsPage from '../communicationCenter/pages/AnnouncementsPage.tsx';
import ApiHealthPage from '../platformHealth/pages/ApiHealthPage.tsx';
import AuditLogsPage from '../auditCompliance/pages/AuditLogsPage.tsx';
import AvailabilityMonitorPage from '../accommodationMonitoring/pages/AvailabilityMonitorPage.tsx';
import AvailableRidersPage from '../riderMonitoring/pages/AvailableRidersPage.tsx';
import BackgroundJobsPage from '../platformHealth/pages/BackgroundJobsPage.tsx';
import BookingComplaintsPage from '../customerEscalations/pages/BookingComplaintsPage.tsx';
import BookingReportsPage from '../reports/pages/BookingReportsPage.tsx';
import BookingSlaPage from '../slaMonitoring/pages/BookingSlaPage.tsx';
import BookingTrendsPage from '../operationsAnalytics/pages/BookingTrendsPage.tsx';
import BroadcastMessagesPage from '../communicationCenter/pages/BroadcastMessagesPage.tsx';
import BusyRidersPage from '../riderMonitoring/pages/BusyRidersPage.tsx';
import CancelledBookingsPage from '../accommodationMonitoring/pages/CancelledBookingsPage.tsx';
import CancelledOrdersPage from '../restaurantMonitoring/pages/CancelledOrdersPage.tsx';
import CityPerformancePage from '../performanceMonitoring/pages/CityPerformancePage.tsx';
import ComplianceReportsPage from '../auditCompliance/pages/ComplianceReportsPage.tsx';
import CriticalIncidentsPage from '../incidentManagement/pages/CriticalIncidentsPage.tsx';
import CurrentBookingsPage from '../customerMonitoring/pages/CurrentBookingsPage.tsx';
import CurrentOrdersPage from '../customerMonitoring/pages/CurrentOrdersPage.tsx';
import CurrentTripsPage from '../customerMonitoring/pages/CurrentTripsPage.tsx';
import CustomerIssuesPage from '../customerMonitoring/pages/CustomerIssuesPage.tsx';
import CustomerLocationsPage from '../mapsTracking/pages/CustomerLocationsPage.tsx';
import CustomerMessagesPage from '../communicationCenter/pages/CustomerMessagesPage.tsx';
import CustomerOverviewPage from '../customerMonitoring/pages/CustomerOverviewPage.tsx';
import CustomerTimelinePage from '../customerMonitoring/pages/CustomerTimelinePage.tsx';
import DailyAnalyticsPage from '../operationsAnalytics/pages/DailyAnalyticsPage.tsx';
import DailyReportsPage from '../reports/pages/DailyReportsPage.tsx';
import DatabaseStatusPage from '../platformHealth/pages/DatabaseStatusPage.tsx';
import DelayPredictionPage from '../aiOperationsCenter/pages/DelayPredictionPage.tsx';
import DeliveredOrdersPage from '../restaurantMonitoring/pages/DeliveredOrdersPage.tsx';
import DeliveryAssignmentPage from '../dispatchCenter/pages/DeliveryAssignmentPage.tsx';
import DeliveryReportsPage from '../reports/pages/DeliveryReportsPage.tsx';
import DeliverySlaPage from '../slaMonitoring/pages/DeliverySlaPage.tsx';
import DemandAnalysisPage from '../operationsAnalytics/pages/DemandAnalysisPage.tsx';
import DemandForecastPage from '../aiOperationsCenter/pages/DemandForecastPage.tsx';
import DemandHeatMapPage from '../mapsTracking/pages/DemandHeatMapPage.tsx';
import DepartmentsPage from '../userManagement/pages/DepartmentsPage.tsx';
import DispatchDashboardPage from '../dispatchCenter/pages/DispatchDashboardPage.tsx';
import DispatchHistoryPage from '../dispatchCenter/pages/DispatchHistoryPage.tsx';
import DispatchQueuePage from '../dispatchCenter/pages/DispatchQueuePage.tsx';
import DispatchSettingsPage from '../settings/pages/DispatchSettingsPage.tsx';
import DriverAssignmentPage from '../dispatchCenter/pages/DriverAssignmentPage.tsx';
import DriverPerformancePage from '../riderMonitoring/pages/DriverPerformancePage.tsx';
import EmergencyAlertsCommunicationPage from '../communicationCenter/pages/EmergencyAlertsPage.tsx';
import EmergencyAlertsNotificationsPage from '../notifications/pages/EmergencyAlertsPage.tsx';
import EscalatedCasesPage from '../customerEscalations/pages/EscalatedCasesPage.tsx';
import EscalationQueuePage from '../incidentManagement/pages/EscalationQueuePage.tsx';
import ExportCenterPage from '../reports/pages/ExportCenterPage.tsx';
import FoodComplaintsPage from '../customerEscalations/pages/FoodComplaintsPage.tsx';
import FoodTrendsPage from '../operationsAnalytics/pages/FoodTrendsPage.tsx';
import GeneralComplaintsPage from '../customerEscalations/pages/GeneralComplaintsPage.tsx';
import GeneralSettingsPage from '../settings/pages/GeneralSettingsPage.tsx';
import SettingsPage from '../settings/pages/SettingsPage.tsx';
import GpsTrackingPage from '../riderMonitoring/pages/GpsTrackingPage.tsx';
import GrowthReportsPage from '../operationsAnalytics/pages/GrowthReportsPage.tsx';
import InboxPage from '../communicationCenter/pages/InboxPage.tsx';
import IncidentCategoriesPage from '../incidentManagement/pages/IncidentCategoriesPage.tsx';
import IncidentDashboardPage from '../incidentManagement/pages/IncidentDashboardPage.tsx';
import IncidentReportsPage from '../reports/pages/IncidentReportsPage.tsx';
import IncidentTimelinePage from '../incidentManagement/pages/IncidentTimelinePage.tsx';
import IntegrationSettingsPage from '../settings/pages/IntegrationSettingsPage.tsx';
import LiveAccommodationBookingsPage from '../liveOperations/pages/LiveAccommodationBookingsPage.tsx';
import LiveAirportTransfersPage from '../liveOperations/pages/LiveAirportTransfersPage.tsx';
import LiveCustomerActivityPage from '../liveOperations/pages/LiveCustomerActivityPage.tsx';
import LiveFoodDeliveriesPage from '../liveOperations/pages/LiveFoodDeliveriesPage.tsx';
import LiveOperationsMapPage from '../mapsTracking/pages/LiveOperationsMapPage.tsx';
import LiveRestaurantOrdersPage from '../liveOperations/pages/LiveRestaurantOrdersPage.tsx';
import LiveRideRequestsPage from '../liveOperations/pages/LiveRideRequestsPage.tsx';
import ManualDispatchPage from '../dispatchCenter/pages/ManualDispatchPage.tsx';
import MapSettingsPage from '../settings/pages/MapSettingsPage.tsx';
import MonthlyAnalyticsPage from '../operationsAnalytics/pages/MonthlyAnalyticsPage.tsx';
import MonthlyReportsPage from '../reports/pages/MonthlyReportsPage.tsx';
import MyProfilePage from '../profile/pages/MyProfilePage.tsx';
import NotificationCenterPage from '../notifications/pages/NotificationCenterPage.tsx';
import NotificationHistoryPage from '../notifications/pages/NotificationHistoryPage.tsx';
import NotificationPreferencesPage from '../profile/pages/NotificationPreferencesPage.tsx';
import NotificationServicesPage from '../platformHealth/pages/NotificationServicesPage.tsx';
import NotificationSettingsPage from '../settings/pages/NotificationSettingsPage.tsx';
import OfflineRidersPage from '../riderMonitoring/pages/OfflineRidersPage.tsx';
import OnlineRidersPage from '../riderMonitoring/pages/OnlineRidersPage.tsx';
import OpenIncidentsPage from '../incidentManagement/pages/OpenIncidentsPage.tsx';
import OperationalAlertsPage from '../notifications/pages/OperationalAlertsPage.tsx';
import OperationalInsightsPage from '../aiOperationsCenter/pages/OperationalInsightsPage.tsx';
import OperationalSettingsPage from '../settings/pages/OperationalSettingsPage.tsx';
import OperationsOverviewPage from '../operationsAnalytics/pages/OperationsOverviewPage.tsx';
import OperationsUsersPage from '../userManagement/pages/OperationsUsersPage.tsx';
import OptimizationSuggestionsPage from '../aiOperationsCenter/pages/OptimizationSuggestionsPage.tsx';
import PartnerMessagesPage from '../communicationCenter/pages/PartnerMessagesPage.tsx';
import PartnerStatusPage from '../accommodationMonitoring/pages/PartnerStatusPage.tsx';
import PartnerSuspensionPage from '../partnerSupport/pages/PartnerSuspensionPage.tsx';
import PartnerTicketsPage from '../partnerSupport/pages/PartnerTicketsPage.tsx';
import PartnerViolationsPage from '../partnerSupport/pages/PartnerViolationsPage.tsx';
import PartnerWarningsPage from '../partnerSupport/pages/PartnerWarningsPage.tsx';
import PaymentComplaintsPage from '../customerEscalations/pages/PaymentComplaintsPage.tsx';
import PaymentGatewayStatusPage from '../platformHealth/pages/PaymentGatewayStatusPage.tsx';
import PeakHourAnalysisPage from '../performanceMonitoring/pages/PeakHourAnalysisPage.tsx';
import PendingDispatchesPage from '../dispatchCenter/pages/PendingDispatchesPage.tsx';
import PermissionsPage from '../userManagement/pages/PermissionsPage.tsx';
import PlatformPerformancePage from '../performanceMonitoring/pages/PlatformPerformancePage.tsx';
import PlatformStatusPage from '../platformHealth/pages/PlatformStatusPage.tsx';
import PreparingOrdersPage from '../restaurantMonitoring/pages/PreparingOrdersPage.tsx';
import PropertiesPage from '../accommodationMonitoring/pages/PropertiesPage.tsx';
import PropertyPerformancePage from '../accommodationMonitoring/pages/PropertyPerformancePage.tsx';
import QueueMonitoringPage from '../platformHealth/pages/QueueMonitoringPage.tsx';
import ReadyForPickupPage from '../restaurantMonitoring/pages/ReadyForPickupPage.tsx';
import RealTimeActivityFeedPage from '../liveOperations/pages/RealTimeActivityFeedPage.tsx';
import RegionalCoveragePage from '../mapsTracking/pages/RegionalCoveragePage.tsx';
import RegionalPerformancePage from '../performanceMonitoring/pages/RegionalPerformancePage.tsx';
import RegionalSettingsPage from '../settings/pages/RegionalSettingsPage.tsx';
import ResolutionCenterPage from '../customerEscalations/pages/ResolutionCenterPage.tsx';
import ResolvedIncidentsPage from '../incidentManagement/pages/ResolvedIncidentsPage.tsx';
import ResourceAllocationPage from '../aiOperationsCenter/pages/ResourceAllocationPage.tsx';
import ResponseTimePage from '../slaMonitoring/pages/ResponseTimePage.tsx';
import RestaurantAssignmentPage from '../dispatchCenter/pages/RestaurantAssignmentPage.tsx';
import RestaurantAvailabilityPage from '../restaurantMonitoring/pages/RestaurantAvailabilityPage.tsx';
import RestaurantDirectoryPage from '../restaurantMonitoring/pages/RestaurantDirectoryPage.tsx';
import RestaurantLocationsPage from '../mapsTracking/pages/RestaurantLocationsPage.tsx';
import RestaurantOverviewPage from '../restaurantMonitoring/pages/RestaurantOverviewPage.tsx';
import RestaurantPerformancePage from '../performanceMonitoring/pages/RestaurantPerformancePage.tsx';
import RestaurantPerformancePageRestaurant from '../restaurantMonitoring/pages/RestaurantPerformancePage.tsx';
import RestaurantReportsPage from '../reports/pages/RestaurantReportsPage.tsx';
import RestaurantSlaPage from '../slaMonitoring/pages/RestaurantSlaPage.tsx';
import RestaurantSupportPage from '../partnerSupport/pages/RestaurantSupportPage.tsx';
import RevenueAnalysisPage from '../operationsAnalytics/pages/RevenueAnalysisPage.tsx';
import RideAssignmentPage from '../dispatchCenter/pages/RideAssignmentPage.tsx';
import RideComplaintsPage from '../customerEscalations/pages/RideComplaintsPage.tsx';
import RideReportsPage from '../reports/pages/RideReportsPage.tsx';
import RideSlaPage from '../slaMonitoring/pages/RideSlaPage.tsx';
import RideTrendsPage from '../operationsAnalytics/pages/RideTrendsPage.tsx';
import RiderDashboardPage from '../riderMonitoring/pages/RiderDashboardPage.tsx';
import RiderLocationsPage from '../mapsTracking/pages/RiderLocationsPage.tsx';
import RiderPerformancePage from '../performanceMonitoring/pages/RiderPerformancePage.tsx';
import RiderSupportPage from '../partnerSupport/pages/RiderSupportPage.tsx';
import RiskDetectionPage from '../aiOperationsCenter/pages/RiskDetectionPage.tsx';
import RolesPage from '../userManagement/pages/RolesPage.tsx';
import RootCauseAnalysisPage from '../incidentManagement/pages/RootCauseAnalysisPage.tsx';
import SecurityLogsPage from '../auditCompliance/pages/SecurityLogsPage.tsx';
import SecurityPage from '../profile/pages/SecurityPage.tsx';
import SessionsPage from '../profile/pages/SessionsPage.tsx';
import ShiftManagementPage from '../userManagement/pages/ShiftManagementPage.tsx';
import SlaDashboardPage from '../slaMonitoring/pages/SlaDashboardPage.tsx';
import StorageMonitoringPage from '../platformHealth/pages/StorageMonitoringPage.tsx';
import SystemAlertsPage from '../notifications/pages/SystemAlertsPage.tsx';
import SystemEventsPage from '../auditCompliance/pages/SystemEventsPage.tsx';
import TeamsPage from '../userManagement/pages/TeamsPage.tsx';
import TemplatesPage from '../communicationCenter/pages/TemplatesPage.tsx';
import TrafficMapPage from '../mapsTracking/pages/TrafficMapPage.tsx';
import UnreadNotificationsPage from '../notifications/pages/UnreadNotificationsPage.tsx';
import UpcomingCheckInsPage from '../accommodationMonitoring/pages/UpcomingCheckInsPage.tsx';
import UpcomingCheckOutsPage from '../accommodationMonitoring/pages/UpcomingCheckOutsPage.tsx';
import UserActivityPage from '../auditCompliance/pages/UserActivityPage.tsx';
import VehicleMonitoringPage from '../riderMonitoring/pages/VehicleMonitoringPage.tsx';
import ViolationReportsPage from '../slaMonitoring/pages/ViolationReportsPage.tsx';
import VipCustomersPage from '../customerMonitoring/pages/VipCustomersPage.tsx';
import WeeklyAnalyticsPage from '../operationsAnalytics/pages/WeeklyAnalyticsPage.tsx';
import WeeklyReportsPage from '../reports/pages/WeeklyReportsPage.tsx';

const routes = [
  { path: 'dashboard', element: <DashboardHomePage />, children: [
    { path: '', element: <Navigate to='dashboard-home' replace /> },
    { path: 'dashboard-home', element: <DashboardHomePage /> },
    { path: 'executive-dashboard', element: <ExecutiveDashboardPage /> },
    { path: 'regional-dashboard', element: <RegionalDashboardPage /> },
    { path: 'live-activity-dashboard', element: <LiveActivityDashboardPage /> },
    { path: 'operations-kpis', element: <OperationsKpisPage /> }
  ] },
  { path: 'liveOperations', element: <LiveAccommodationBookingsPage />, children: [
    { path: '', element: <Navigate to='live-accommodation-bookings' replace /> },
    { path: 'live-accommodation-bookings', element: <LiveAccommodationBookingsPage /> },
    { path: 'live-restaurant-orders', element: <LiveRestaurantOrdersPage /> },
    { path: 'live-ride-requests', element: <LiveRideRequestsPage /> },
    { path: 'live-food-deliveries', element: <LiveFoodDeliveriesPage /> },
    { path: 'live-airport-transfers', element: <LiveAirportTransfersPage /> },
    { path: 'live-customer-activity', element: <LiveCustomerActivityPage /> },
    { path: 'real-time-activity-feed', element: <RealTimeActivityFeedPage /> }
  ] },
  { path: 'dispatchCenter', element: <DispatchDashboardPage />, children: [
    { path: '', element: <Navigate to='dispatch-dashboard' replace /> },
    { path: 'dispatch-dashboard', element: <DispatchDashboardPage /> },
    { path: 'pending-dispatches', element: <PendingDispatchesPage /> },
    { path: 'driver-assignment', element: <DriverAssignmentPage /> },
    { path: 'restaurant-assignment', element: <RestaurantAssignmentPage /> },
    { path: 'ride-assignment', element: <RideAssignmentPage /> },
    { path: 'delivery-assignment', element: <DeliveryAssignmentPage /> },
    { path: 'dispatch-queue', element: <DispatchQueuePage /> },
    { path: 'manual-dispatch', element: <ManualDispatchPage /> },
    { path: 'dispatch-history', element: <DispatchHistoryPage /> }
  ] },
  { path: 'accommodationMonitoring', element: <AccommodationOverviewPage />, children: [
    { path: '', element: <Navigate to='accommodation-overview' replace /> },
    { path: 'accommodation-overview', element: <AccommodationOverviewPage /> },
    { path: 'properties', element: <PropertiesPage /> },
    { path: 'active-bookings', element: <ActiveBookingsPage /> },
    { path: 'upcoming-check-ins', element: <UpcomingCheckInsPage /> },
    { path: 'upcoming-check-outs', element: <UpcomingCheckOutsPage /> },
    { path: 'cancelled-bookings', element: <CancelledBookingsPage /> },
    { path: 'availability-monitor', element: <AvailabilityMonitorPage /> },
    { path: 'property-performance', element: <PropertyPerformancePage /> },
    { path: 'partner-status', element: <PartnerStatusPage /> }
  ] },
  { path: 'restaurantMonitoring', element: <RestaurantOverviewPage />, children: [
    { path: '', element: <Navigate to='restaurant-overview' replace /> },
    { path: 'restaurant-overview', element: <RestaurantOverviewPage /> },
    { path: 'restaurant-directory', element: <RestaurantDirectoryPage /> },
    { path: 'active-orders', element: <ActiveOrdersPage /> },
    { path: 'preparing-orders', element: <PreparingOrdersPage /> },
    { path: 'ready-for-pickup', element: <ReadyForPickupPage /> },
    { path: 'delivered-orders', element: <DeliveredOrdersPage /> },
    { path: 'cancelled-orders', element: <CancelledOrdersPage /> },
    { path: 'restaurant-performance', element: <RestaurantPerformancePageRestaurant /> },
    { path: 'restaurant-availability', element: <RestaurantAvailabilityPage /> }
  ] },
  { path: 'riderMonitoring', element: <RiderDashboardPage />, children: [
    { path: '', element: <Navigate to='rider-dashboard' replace /> },
    { path: 'rider-dashboard', element: <RiderDashboardPage /> },
    { path: 'online-riders', element: <OnlineRidersPage /> },
    { path: 'offline-riders', element: <OfflineRidersPage /> },
    { path: 'busy-riders', element: <BusyRidersPage /> },
    { path: 'available-riders', element: <AvailableRidersPage /> },
    { path: 'vehicle-monitoring', element: <VehicleMonitoringPage /> },
    { path: 'active-trips', element: <ActiveTripsPage /> },
    { path: 'active-deliveries', element: <ActiveDeliveriesPage /> },
    { path: 'driver-performance', element: <DriverPerformancePage /> },
    { path: 'gps-tracking', element: <GpsTrackingPage /> }
  ] },
  { path: 'customerMonitoring', element: <CustomerOverviewPage />, children: [
    { path: '', element: <Navigate to='customer-overview' replace /> },
    { path: 'customer-overview', element: <CustomerOverviewPage /> },
    { path: 'active-customers', element: <ActiveCustomersPage /> },
    { path: 'current-trips', element: <CurrentTripsPage /> },
    { path: 'current-orders', element: <CurrentOrdersPage /> },
    { path: 'current-bookings', element: <CurrentBookingsPage /> },
    { path: 'customer-timeline', element: <CustomerTimelinePage /> },
    { path: 'vip-customers', element: <VipCustomersPage /> },
    { path: 'customer-issues', element: <CustomerIssuesPage /> }
  ] },
  { path: 'mapsTracking', element: <LiveOperationsMapPage />, children: [
    { path: '', element: <Navigate to='live-operations-map' replace /> },
    { path: 'live-operations-map', element: <LiveOperationsMapPage /> },
    { path: 'rider-locations', element: <RiderLocationsPage /> },
    { path: 'restaurant-locations', element: <RestaurantLocationsPage /> },
    { path: 'accommodation-locations', element: <AccommodationLocationsPage /> },
    { path: 'customer-locations', element: <CustomerLocationsPage /> },
    { path: 'demand-heat-map', element: <DemandHeatMapPage /> },
    { path: 'traffic-map', element: <TrafficMapPage /> },
    { path: 'regional-coverage', element: <RegionalCoveragePage /> }
  ] },
  { path: 'incidentManagement', element: <IncidentDashboardPage />, children: [
    { path: '', element: <Navigate to='incident-dashboard' replace /> },
    { path: 'incident-dashboard', element: <IncidentDashboardPage /> },
    { path: 'open-incidents', element: <OpenIncidentsPage /> },
    { path: 'critical-incidents', element: <CriticalIncidentsPage /> },
    { path: 'resolved-incidents', element: <ResolvedIncidentsPage /> },
    { path: 'incident-categories', element: <IncidentCategoriesPage /> },
    { path: 'escalation-queue', element: <EscalationQueuePage /> },
    { path: 'incident-timeline', element: <IncidentTimelinePage /> },
    { path: 'root-cause-analysis', element: <RootCauseAnalysisPage /> }
  ] },
  { path: 'customerEscalations', element: <BookingComplaintsPage />, children: [
    { path: '', element: <Navigate to='booking-complaints' replace /> },
    { path: 'booking-complaints', element: <BookingComplaintsPage /> },
    { path: 'food-complaints', element: <FoodComplaintsPage /> },
    { path: 'ride-complaints', element: <RideComplaintsPage /> },
    { path: 'payment-complaints', element: <PaymentComplaintsPage /> },
    { path: 'general-complaints', element: <GeneralComplaintsPage /> },
    { path: 'escalated-cases', element: <EscalatedCasesPage /> },
    { path: 'resolution-center', element: <ResolutionCenterPage /> }
  ] },
  { path: 'partnerSupport', element: <AccommodationSupportPage />, children: [
    { path: '', element: <Navigate to='accommodation-support' replace /> },
    { path: 'accommodation-support', element: <AccommodationSupportPage /> },
    { path: 'restaurant-support', element: <RestaurantSupportPage /> },
    { path: 'rider-support', element: <RiderSupportPage /> },
    { path: 'partner-tickets', element: <PartnerTicketsPage /> },
    { path: 'partner-violations', element: <PartnerViolationsPage /> },
    { path: 'partner-warnings', element: <PartnerWarningsPage /> },
    { path: 'partner-suspension', element: <PartnerSuspensionPage /> }
  ] },
  { path: 'slaMonitoring', element: <SlaDashboardPage />, children: [
    { path: '', element: <Navigate to='sla-dashboard' replace /> },
    { path: 'sla-dashboard', element: <SlaDashboardPage /> },
    { path: 'booking-sla', element: <BookingSlaPage /> },
    { path: 'restaurant-sla', element: <RestaurantSlaPage /> },
    { path: 'ride-sla', element: <RideSlaPage /> },
    { path: 'delivery-sla', element: <DeliverySlaPage /> },
    { path: 'response-time', element: <ResponseTimePage /> },
    { path: 'violation-reports', element: <ViolationReportsPage /> }
  ] },
  { path: 'performanceMonitoring', element: <PlatformPerformancePage />, children: [
    { path: '', element: <Navigate to='platform-performance' replace /> },
    { path: 'platform-performance', element: <PlatformPerformancePage /> },
    { path: 'accommodation-performance', element: <AccommodationPerformancePage /> },
    { path: 'restaurant-performance', element: <RestaurantPerformancePage /> },
    { path: 'rider-performance', element: <RiderPerformancePage /> },
    { path: 'regional-performance', element: <RegionalPerformancePage /> },
    { path: 'city-performance', element: <CityPerformancePage /> },
    { path: 'peak-hour-analysis', element: <PeakHourAnalysisPage /> }
  ] },
  { path: 'operationsAnalytics', element: <OperationsOverviewPage />, children: [
    { path: '', element: <Navigate to='operations-overview' replace /> },
    { path: 'operations-overview', element: <OperationsOverviewPage /> },
    { path: 'daily-analytics', element: <DailyAnalyticsPage /> },
    { path: 'weekly-analytics', element: <WeeklyAnalyticsPage /> },
    { path: 'monthly-analytics', element: <MonthlyAnalyticsPage /> },
    { path: 'demand-analysis', element: <DemandAnalysisPage /> },
    { path: 'revenue-analysis', element: <RevenueAnalysisPage /> },
    { path: 'booking-trends', element: <BookingTrendsPage /> },
    { path: 'ride-trends', element: <RideTrendsPage /> },
    { path: 'food-trends', element: <FoodTrendsPage /> },
    { path: 'growth-reports', element: <GrowthReportsPage /> }
  ] },
  { path: 'aiOperationsCenter', element: <AiDashboardPage />, children: [
    { path: '', element: <Navigate to='ai-dashboard' replace /> },
    { path: 'ai-dashboard', element: <AiDashboardPage /> },
    { path: 'operational-insights', element: <OperationalInsightsPage /> },
    { path: 'demand-forecast', element: <DemandForecastPage /> },
    { path: 'resource-allocation', element: <ResourceAllocationPage /> },
    { path: 'delay-prediction', element: <DelayPredictionPage /> },
    { path: 'risk-detection', element: <RiskDetectionPage /> },
    { path: 'optimization-suggestions', element: <OptimizationSuggestionsPage /> },
    { path: 'ai-reports', element: <AiReportsPage /> }
  ] },
  { path: 'communicationCenter', element: <InboxPage />, children: [
    { path: '', element: <Navigate to='inbox' replace /> },
    { path: 'inbox', element: <InboxPage /> },
    { path: 'customer-messages', element: <CustomerMessagesPage /> },
    { path: 'partner-messages', element: <PartnerMessagesPage /> },
    { path: 'broadcast-messages', element: <BroadcastMessagesPage /> },
    { path: 'announcements', element: <AnnouncementsPage /> },
    { path: 'emergency-alerts', element: <EmergencyAlertsCommunicationPage /> },
    { path: 'templates', element: <TemplatesPage /> }
  ] },
  { path: 'notifications', element: <NotificationCenterPage />, children: [
    { path: '', element: <Navigate to='notification-center' replace /> },
    { path: 'notification-center', element: <NotificationCenterPage /> },
    { path: 'unread-notifications', element: <UnreadNotificationsPage /> },
    { path: 'system-alerts', element: <SystemAlertsPage /> },
    { path: 'operational-alerts', element: <OperationalAlertsPage /> },
    { path: 'emergency-alerts', element: <EmergencyAlertsNotificationsPage /> },
    { path: 'notification-history', element: <NotificationHistoryPage /> }
  ] },
  { path: 'reports', element: <DailyReportsPage />, children: [
    { path: '', element: <Navigate to='daily-reports' replace /> },
    { path: 'daily-reports', element: <DailyReportsPage /> },
    { path: 'weekly-reports', element: <WeeklyReportsPage /> },
    { path: 'monthly-reports', element: <MonthlyReportsPage /> },
    { path: 'booking-reports', element: <BookingReportsPage /> },
    { path: 'restaurant-reports', element: <RestaurantReportsPage /> },
    { path: 'ride-reports', element: <RideReportsPage /> },
    { path: 'delivery-reports', element: <DeliveryReportsPage /> },
    { path: 'incident-reports', element: <IncidentReportsPage /> },
    { path: 'export-center', element: <ExportCenterPage /> }
  ] },
  { path: 'auditCompliance', element: <AuditLogsPage />, children: [
    { path: '', element: <Navigate to='audit-logs' replace /> },
    { path: 'audit-logs', element: <AuditLogsPage /> },
    { path: 'activity-logs', element: <ActivityLogsPage /> },
    { path: 'security-logs', element: <SecurityLogsPage /> },
    { path: 'compliance-reports', element: <ComplianceReportsPage /> },
    { path: 'system-events', element: <SystemEventsPage /> },
    { path: 'user-activity', element: <UserActivityPage /> }
  ] },
  { path: 'platformHealth', element: <PlatformStatusPage />, children: [
    { path: '', element: <Navigate to='platform-status' replace /> },
    { path: 'platform-status', element: <PlatformStatusPage /> },
    { path: 'api-health', element: <ApiHealthPage /> },
    { path: 'database-status', element: <DatabaseStatusPage /> },
    { path: 'queue-monitoring', element: <QueueMonitoringPage /> },
    { path: 'notification-services', element: <NotificationServicesPage /> },
    { path: 'payment-gateway-status', element: <PaymentGatewayStatusPage /> },
    { path: 'storage-monitoring', element: <StorageMonitoringPage /> },
    { path: 'background-jobs', element: <BackgroundJobsPage /> }
  ] },
  { path: 'userManagement', element: <OperationsUsersPage />, children: [
    { path: '', element: <Navigate to='operations-users' replace /> },
    { path: 'operations-users', element: <OperationsUsersPage /> },
    { path: 'roles', element: <RolesPage /> },
    { path: 'permissions', element: <PermissionsPage /> },
    { path: 'teams', element: <TeamsPage /> },
    { path: 'departments', element: <DepartmentsPage /> },
    { path: 'shift-management', element: <ShiftManagementPage /> }
  ] },
  { path: 'profile', element: <MyProfilePage />, children: [
    { path: '', element: <Navigate to='my-profile' replace /> },
    { path: 'my-profile', element: <MyProfilePage /> },
    { path: 'security', element: <SecurityPage /> },
    { path: 'notification-preferences', element: <NotificationPreferencesPage /> },
    { path: 'activity-history', element: <ActivityHistoryPage /> },
    { path: 'sessions', element: <SessionsPage /> }
  ] },
  { path: 'settings', element: <SettingsPage />, children: [
    { path: '', element: <Navigate to='general-settings' replace /> },
    { path: 'general-settings', element: <GeneralSettingsPage /> },
    { path: 'regional-settings', element: <RegionalSettingsPage /> },
    { path: 'operational-settings', element: <OperationalSettingsPage /> },
    { path: 'dispatch-settings', element: <DispatchSettingsPage /> },
    { path: 'notification-settings', element: <NotificationSettingsPage /> },
    { path: 'map-settings', element: <MapSettingsPage /> },
    { path: 'integration-settings', element: <IntegrationSettingsPage /> }
  ] },
];

export default function OperationsRoutes() {
  return useRoutes(routes);
}
