import { Link, NavLink, useNavigate } from "react-router-dom";
import { links } from '../data/vendorSidebarContents.jsx'
import { IconLogout, IconLayoutDashboard, IconSettings, IconX, IconChevronRight } from "@tabler/icons-react";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "../../../redux/user/userSlice.jsx";
import { showSidebarOrNot } from "../../../redux/adminSlices/adminDashboardSlice/DashboardSlice.jsx";
import { motion } from "framer-motion";

const VendorSidebar = () => {
    const { activeMenu, screenSize } = useSelector((state) => state.adminDashboardSlice);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const activeLink = "flex items-center gap-4 px-6 py-4 rounded-xl text-white bg-zoom-green shadow-lg shadow-zoom-green/20 font-bold text-sm transition-all";
    const normalLink = "flex items-center gap-4 px-6 py-4 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 font-medium text-sm transition-all group";

    const handleSignout = async () => {
        const res = await fetch("/api/admin/signout", { method: "GET" });
        const data = await res.json();
        if (data) {
            dispatch(signOut());
            navigate("/signin");
        }
    };

    return (
        <div className="h-screen bg-slate-900 border-r border-white/5 flex flex-col p-6 overflow-hidden">
            {activeMenu && (
                <>
                    {/* Header/Logo */}
                    <div className="flex justify-between items-center mb-10 px-2">
                        <Link to="/vendorDashboard" className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-zoom-green rounded-lg flex items-center justify-center text-white">
                                <IconLayoutDashboard size={20} />
                            </div>
                            <span className="text-lg font-bold text-white tracking-tight">Tripyra</span>
                        </Link>
                        <button 
                            className="md:hidden text-slate-400 hover:text-white transition-colors"
                            onClick={() => dispatch(showSidebarOrNot(false))}
                        >
                            <IconX size={20} />
                        </button>
                    </div>

                    {/* Navigation Links */}
                    <div className="flex-1 space-y-8 overflow-y-auto custom-scrollbar pr-2">
                        {links.map((section, idx) => (
                            <div key={idx} className="space-y-3">
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4">{section.title}</p>
                                <div className="space-y-1">
                                    {section.links.map((link) => (
                                        <NavLink
                                            to={`/vendorDashboard/${link.name}`}
                                            key={link.name}
                                            onClick={() => {
                                                if (screenSize <= 900) dispatch(showSidebarOrNot(false));
                                            }}
                                            className={({ isActive }) => isActive ? activeLink : normalLink}
                                        >
                                            <span className="group-hover:scale-105 transition-transform">{link.icon}</span>
                                            <span className="capitalize flex-1">{link.name}</span>
                                        </NavLink>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer Section */}
                    <div className="mt-auto pt-6 border-t border-white/5 space-y-4">
                        <div className="px-4 py-3 rounded-xl bg-white/5 border border-white/5 flex items-center gap-3">
                            <div className="w-7 h-7 rounded-lg bg-zoom-green flex items-center justify-center text-white font-bold text-[10px]">V</div>
                            <div className="flex-1 overflow-hidden">
                                <p className="text-xs font-bold text-white truncate">Vendor Portal</p>
                                <p className="text-[9px] font-medium text-slate-500 uppercase">Enterprise</p>
                            </div>
                        </div>

                        <button
                            onClick={handleSignout}
                            className="w-full flex items-center gap-4 px-6 py-4 rounded-xl text-red-400 hover:bg-red-400/10 font-bold text-sm transition-all group"
                        >
                            <IconLogout size={18} />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default VendorSidebar;