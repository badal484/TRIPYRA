import styles from "../index";
import { navLinks } from "../constants";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RxHamburgerMenu } from "react-icons/rx";
import { MdMenuOpen } from "react-icons/md";
import { useState } from "react";
import { Drawer } from "antd";
import { motion } from "framer-motion";


function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [nav, setNav] = useState(false);

  return (
    <div
      className={`sticky top-0 z-[100] w-full flex justify-between items-center px-6 sm:px-12 md:px-18 lg:px-28 py-3 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 mx-auto transition-all duration-300`}
    >
      <Link to="/">
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           className="text-[24px] md:text-[32px] lg:text-[40px] font-poppins font-black tracking-tighter"
        >
          Tripyra
        </motion.div>
      </Link>

      <div className="hidden lg:block">
        <ul className="flex list-none gap-8">
          {navLinks.map((navlink, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={navlink.path}
                className="relative group text-slate-900 font-poppins cursor-pointer font-bold text-sm tracking-tight outline-none"
              >
                {navlink.title}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-zoom-green transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </motion.li>
          ))}
        </ul>
      </div>
      <div className="flex gap-4 items-center">
        <div className="hidden lg:flex items-center justify-center">
          {currentUser ? (
            <div className="flex items-center gap-4">
              {currentUser.isAdmin && (
                <Link to="/adminDashboard">
                  <button className="bg-slate-900 text-white py-2 px-6 text-xs font-bold uppercase tracking-widest rounded-full hover:bg-slate-800 transition-all shadow-lg outline-none">
                    Admin Portal
                  </button>
                </Link>
              )}
              {currentUser.isVendor && !currentUser.isAdmin && (
                <Link to="/vendorDashboard">
                  <button className="bg-zoom-green text-white py-2 px-6 text-xs font-bold uppercase tracking-widest rounded-full hover:bg-green-600 transition-all shadow-lg outline-none">
                    Vendor Hub
                  </button>
                </Link>
              )}
              <Link to="/profile" className="outline-none">
                <img
                  src={`${currentUser.profilePicture}`}
                  alt="profile"
                  className="h-10 w-10 rounded-2xl object-cover ring-2 ring-slate-100 ring-offset-2 hover:ring-zoom-green transition-all"
                />
              </Link>
            </div>
          ) : (
            <div className="flex gap-4">
              <Link to="/signin" className="outline-none">
                <button className="border border-slate-200 py-2 px-6 text-xs font-bold uppercase tracking-widest rounded-full hover:bg-slate-50 transition-all outline-none">
                  Sign In
                </button>
              </Link>
              <Link to="/signup" className="outline-none">
                <button className="bg-zoom-green text-white py-2 px-6 text-xs font-bold uppercase tracking-widest rounded-full hover:bg-green-600 transition-all shadow-lg shadow-green-100 outline-none">
                  Sign Up
                </button>
              </Link>
            </div>
          )}
        </div>


        {/*  Mobile Menu */}
        <div className="relative lg:hidden flex justify-center items-center">
          <button onClick={() => setNav(!nav)}>
            <div>{nav ? <MdMenuOpen /> : <RxHamburgerMenu />}</div>
          </button>
          <Drawer
            destroyOnClose={true}
            onClose={() => setNav(false)}
            open={nav}
          >
            <div className="flex flex-col items-start justify-between gap-y-10">
              {navLinks.map((navlink, index) => (
            
                  <Link
                    key={index}
                    to={navlink.path}
                    className="text-[26px]"
                    onClick={() => setNav(false)}
                  >
                    {navlink.title}
                  </Link>
              
              ))}

              {currentUser && !currentUser.isAdmin && !currentUser.isVendor && (
                <div>
                  <Link to={"/profile"}>
                    <div id="signup" className={` rounded-md font-semibold text-[24px]`}>
                      Profile
                    </div>
                  </Link>
                </div>
              )}

              <div>
                <Link to={"/signIn"}>
                  {currentUser &&
                  !currentUser.isAdmin &&
                  !currentUser.isVendor ? (
                    ""
                  ) : (
                    <button
                      id="signin"
                      className={` rounded-md  text-[24px] font-semibold  `}
                    >
                      Sign In
                    </button>
                  )}
                </Link>
              </div>

              <div>
                {currentUser &&
                !currentUser.isAdmin &&
                !currentUser.isVendor ? (
                  ""
                ) : (
                  <div>
                    <Link to={"/signup"}>
                      <button
                        id="signup"
                        className=" rounded-md  text-[24px] font-semibold "
                      >
                        Sign Up
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </Drawer>
          {nav && (
            <div>
              <div className="absolute top-6 z-10 right-0  ">
                <Link to={"/signIn"}>
                  {currentUser &&
                  !currentUser.isAdmin &&
                  !currentUser.isVendor ? (
                    ""
                  ) : (
                    <button
                      id="signin"
                      className={`border-[1px] w-[80px]  border-green-500 bg-green-500  py-1 text-[10px]   px-2  font-normal sm:font-semibold  `}
                    >
                      Sign In
                    </button>
                  )}
                </Link>
              </div>

              <div>
                {currentUser &&
                  !currentUser.isAdmin &&
                  !currentUser.isVendor && (
                    <div className="hidden lg:inline-flex">
                      <Link to={"/signup"}>
                        <button id="signup" className={`${styles.button} `}>
                          Sign Up
                        </button>
                      </Link>
                    </div>
                  )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;