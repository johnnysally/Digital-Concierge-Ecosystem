import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../../context/customer/ThemeContext';

const CustomerFooter = () => {
    const { isDark } = useTheme();

    return (
        <footer className={`mt-8 rounded-3xl border p-4 text-sm sm:p-6 ${isDark ? 'border-slate-800 bg-slate-950/95 text-slate-400' : 'border-gray-200 bg-white text-slate-500'}`}>
            <div className="mx-auto max-w-[1400px]">
                <div className="grid gap-6 sm:grid-cols-3">
                    <div>
                        <p className={`mb-3 font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>DigitalSafaris</p>
                        <p>Connected hospitality experiences across accommodation, dining and transport.</p>
                    </div>
                    <div>
                        <p className={`mb-3 font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Quick Links</p>
                        <div className="space-y-2">
                            <Link to="/search" className={`block transition-colors ${isDark ? 'hover:text-white' : 'hover:text-slate-900'}`}>Find Stays</Link>
                            <Link to="/food" className={`block transition-colors ${isDark ? 'hover:text-white' : 'hover:text-slate-900'}`}>Order Food</Link>
                            <Link to="/transport" className={`block transition-colors ${isDark ? 'hover:text-white' : 'hover:text-slate-900'}`}>Book Transport</Link>
                        </div>
                    </div>
                    <div>
                        <p className={`mb-3 font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Support</p>
                        <div className="space-y-2">
                            <Link to="/support" className={`block transition-colors ${isDark ? 'hover:text-white' : 'hover:text-slate-900'}`}>Help Center</Link>
                            <Link to="/profile" className={`block transition-colors ${isDark ? 'hover:text-white' : 'hover:text-slate-900'}`}>My Account</Link>
                            <Link to="/settings" className={`block transition-colors ${isDark ? 'hover:text-white' : 'hover:text-slate-900'}`}>Settings</Link>
                        </div>
                    </div>
                </div>
                <div className={`mt-8 border-t pt-6 text-center text-xs ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                    <p>© 2026 DigitalSafaris. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default CustomerFooter;