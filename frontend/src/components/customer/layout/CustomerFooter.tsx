import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../../context/customer/ThemeContext';

const CustomerFooter = () => {
    const { isDark } = useTheme();

    return (
        <footer className={`mt-8 rounded-3xl border p-6 text-sm ${isDark ? 'border-slate-800 bg-slate-950/95 text-slate-400' : 'border-gray-200 bg-white text-slate-500'}`}>
            <div className="mx-auto max-w-[1400px]">
                <div className="grid gap-8 sm:grid-cols-3">
                    <div>
                        <p className="font-semibold text-white mb-3">DigitalSafaris</p>
                        <p>Connected hospitality experiences across accommodation, dining and transport.</p>
                    </div>
                    <div>
                        <p className="font-semibold text-white mb-3">Quick Links</p>
                        <div className="space-y-2">
                            <Link to="/search" className="block hover:text-white transition-colors">Find Stays</Link>
                            <Link to="/food" className="block hover:text-white transition-colors">Order Food</Link>
                            <Link to="/transport" className="block hover:text-white transition-colors">Book Transport</Link>
                        </div>
                    </div>
                    <div>
                        <p className="font-semibold text-white mb-3">Support</p>
                        <div className="space-y-2">
                            <Link to="/support" className="block hover:text-white transition-colors">Help Center</Link>
                            <Link to="/profile" className="block hover:text-white transition-colors">My Account</Link>
                            <Link to="/settings" className="block hover:text-white transition-colors">Settings</Link>
                        </div>
                    </div>
                </div>
                <div className="mt-8 pt-6 border-t border-slate-800 text-center text-xs">
                    <p>© 2026 DigitalSafaris. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default CustomerFooter;