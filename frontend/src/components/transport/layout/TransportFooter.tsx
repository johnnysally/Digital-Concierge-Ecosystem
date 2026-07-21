const TransportFooter = () => (
    <footer className="border-t border-slate-800 bg-slate-950 px-4 py-4 text-sm text-slate-500 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} DigitalSafaris Transport Portal</p>
            <p>Manage fleets, drivers, and rides in one place.</p>
        </div>
    </footer>
);

export default TransportFooter;
