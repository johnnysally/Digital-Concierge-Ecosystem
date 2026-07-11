import { useAuth } from '../context/AuthContext';
import SectionHeader from '../components/ui/SectionHeader';
import StatsCard from '../components/ui/StatsCard';

const ProfilePage = () => {
    const { user } = useAuth();

    return (
        <div className="space-y-6">
            <SectionHeader title="Profile" subtitle="Your admin account details" />
            <div className="grid gap-4 sm:grid-cols-2">
                <StatsCard title="Name" value={`${user?.firstName} ${user?.lastName}`} />
                <StatsCard title="Email" value={user?.email || ''} />
                <StatsCard title="Role" value={user?.role || ''} />
                <StatsCard title="Status" value={user?.isActive ? 'Active' : 'Inactive'} />
            </div>
        </div>
    );
};

export default ProfilePage;