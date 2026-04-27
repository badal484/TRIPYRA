import styles from "../../index";
import Herocar from "../../Assets/homepage_car_copy.jpeg";
import CarSearch from "./CarSearch";
import { HeroParallax } from "../../components/ui/Paralax";
import { useRef } from "react";

import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setIsSweetAlert } from "../../redux/user/userSlice";
import Footers from "../../components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import News1 from "../../Assets/news_1.png";
import News2 from "../../Assets/news_2.png";
import News3 from "../../Assets/news_3.png";

const NEWS_DATA = [
  {
    id: 1,
    image: News1,
    category: "Award",
    title: "Tripyra Wins 'Best Rental Tech 2026' Global Award",
    date: "November 13, 2025",
    readTime: "3 min read"
  },
  {
    id: 2,
    image: News2,
    category: "Environment",
    title: "10 Reasons Why Eco-Friendly Road Trips Are the Future",
    date: "October 25, 2025",
    readTime: "5 min read"
  },
  {
    id: 3,
    image: News3,
    category: "Lifestyle",
    title: "The Ultimate Guide to Planning Your First Family Trip",
    date: "October 20, 2025",
    readTime: "4 min read"
  }
];

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=2070&auto=format&fit=crop"
];


function Home() {
  const ref = useRef(null);
  const { isSweetAlert } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const sweetalert = () => {
    Swal.fire({
      
      show: true,
      title: "",
      text: "Vehicle Booked Successfully",
      icon: "success",
      showDenyButton: true,
      confirmButtonText: "Go to Home",
      confirmButtonColor:"#22c55e",
      denyButtonColor:'black',
      denyButtonText: `See Orders`,
    }).then((result) => {
      if (result.isConfirmed) {
        navigate('/')
      }
      else if(result.isDenied){
        navigate('/orders')
      }
    })
    dispatch(setIsSweetAlert(false))
  };

  return (
    <>
      {isSweetAlert && sweetalert()}

      {/* Dark Theme Full-Bleed Hero Section with Carousel */}
      <div className="relative w-full h-[70vh] lg:h-[80vh] flex items-center justify-center bg-black overflow-hidden">
        {/* Animated Carousel Background */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${HERO_IMAGES[currentImageIndex]}')` }}
            />
          </AnimatePresence>
        </div>

        {/* Gradient Overlays */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
        <div className="absolute inset-0 z-[1] bg-gradient-to-b from-transparent via-transparent to-zoom-dark/95"></div>

        {/* Hero Content with Animations */}
        <div className="relative z-10 w-full max-w-[1200px] px-6 lg:px-12 flex flex-col items-start justify-center h-full pb-16">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-4"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zoom-green bg-white/10 px-4 py-2 rounded-full backdrop-blur-md border border-white/10">
              Premium Mobility Archive
            </span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-white font-black text-4xl md:text-5xl lg:text-8xl leading-tight tracking-tighter mb-4 drop-shadow-2xl"
          >
            The closest car <br />
            <motion.span 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ duration: 1, delay: 1 }}
               className="text-zoom-green transition-all"
            >
              is yours.
            </motion.span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-gray-200 text-lg md:text-xl max-w-lg mb-8 font-light drop-shadow-md"
          >
            Self-drive car rentals available by the hour, day, or week. Skip the counter and hit the road directly.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex gap-4"
          >
            <button
              onClick={() => {
                ref.current?.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                });
              }}
              className="bg-zoom-green text-white hover:bg-[#0e8a0e] transition-all transform hover:shadow-green-500/50 text-sm md:text-base py-4 px-10 rounded-full font-bold shadow-[0_10px_20px_-5px_rgba(34,197,94,0.4)]"
            >
              Find a Car
            </button>
          </motion.div>

          {/* Minimal Classy Stats */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="mt-16 flex gap-10 border-l border-white/20 pl-8"
          >
            <div>
              <p className="text-white font-black text-xl mb-1 tracking-tighter">100%</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Verified Fleet</p>
            </div>
            <div>
              <p className="text-white font-black text-xl mb-1 tracking-tighter">Zero</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Hidden Fees</p>
            </div>
            <div>
              <p className="text-white font-black text-xl mb-1 tracking-tighter">24/7</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Elite Support</p>
            </div>
          </motion.div>
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
          {HERO_IMAGES.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-1 rounded-full transition-all duration-500 ${idx === currentImageIndex ? 'w-8 bg-zoom-green' : 'w-2 bg-white/30'}`}
            />
          ))}
        </div>
      </div>

      <div ref={ref} className="relative z-20 max-w-[1200px] mx-auto px-4 lg:px-12 -mt-20">
        <CarSearch />
      </div>

      {/* The Tripyra Experience Section */}
      <section className="pt-32 pb-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zoom-green mb-6 block">
                The New Standard
              </span>
              <h2 className="text-5xl lg:text-7xl font-black text-slate-900 leading-none tracking-tighter mb-8">
                Rethink how <br/> you <span className="text-zoom-green">explore.</span>
              </h2>
              <p className="text-slate-500 text-lg font-medium leading-relaxed mb-10 max-w-md">
                Tripyra isn't just about getting from A to B. It's about the freedom of the open road, the smell of a fresh interior, and the thrill of a precision-engineered machine at your fingertips.
              </p>
              
              <div className="space-y-6">
                {[
                  { title: "Keyless Sovereignty", desc: "Unlock verified listings directly from your smartphone." },
                  { title: "Curated Excellence", desc: "Every vehicle undergoes a rigorous 50-point quality audit." },
                  { title: "Borderless Travel", desc: "Unlimited kilometers on premium selected routes." }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-6 group">
                    <div className="w-1.5 h-1.5 rounded-full bg-zoom-green mt-3 group-hover:scale-150 transition-transform"></div>
                    <div>
                      <h4 className="font-black text-slate-900 uppercase text-xs tracking-widest mb-1">{item.title}</h4>
                      <p className="text-slate-400 text-sm font-medium">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="relative"
            >
              <div className="aspect-[4/5] rounded-[40px] overflow-hidden bg-slate-100 shadow-2xl relative group">
                <img 
                  src="https://images.unsplash.com/photo-1617469767053-d3b508a0d822?q=80&w=1974&auto=format&fit=crop" 
                  alt="Elite Experience" 
                  className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-10 left-10 right-10">
                  <p className="text-white font-black text-2xl tracking-tighter leading-tight">
                    "The journey is the reward, <br/> and the car is the companion."
                  </p>
                </div>
              </div>
              {/* Floating Badge */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-zoom-green rounded-full flex items-center justify-center p-8 text-white text-center shadow-2xl animate-spin-slow">
                 <p className="text-[10px] font-black uppercase tracking-widest leading-tight">Elite Fleet Selection 2026</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* In the News Section */}
      <section className="py-24 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4 tracking-tight">In the news</h2>
            <div className="w-20 h-1.5 bg-zoom-green rounded-full"></div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {NEWS_DATA.map((news, idx) => (
              <motion.div
                key={news.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="group bg-white rounded-[32px] overflow-hidden border border-gray-100 hover:border-zoom-green transition-all hover:shadow-2xl"
              >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={news.image} 
                    alt={news.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-6 left-6">
                    <span className="bg-zoom-green text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                      {news.category}
                    </span>
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-4 text-[12px] font-bold text-gray-400 mb-4 uppercase tracking-wider">
                    <span>{news.readTime}</span>
                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
                    <span>{news.date}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-6 leading-snug group-hover:text-zoom-green transition-colors">
                    {news.title}
                  </h3>
                  <button className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-gray-900 group/btn">
                    <span>Read</span>
                    <motion.svg 
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-5 w-5 text-zoom-green" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </motion.svg>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Seamless Process Section */}
      <section className="py-32 bg-slate-900 text-white overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12 text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zoom-green mb-6 block">
              The Protocol
            </span>
            <h2 className="text-5xl lg:text-7xl font-black tracking-tighter leading-none mb-6">
              Three steps to <br/> <span className="text-zoom-green">freedom.</span>
            </h2>
          </motion.div>
        </div>

        <div className="max-w-[1200px] mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-3 gap-16">
          {[
            { num: "01", title: "Select Fleet", desc: "Choose from our curated archive of verified premium vehicles." },
            { num: "02", title: "Secure Access", desc: "Instant identity verification and seamless digital checkout." },
            { num: "03", title: "Ignite Passion", desc: "Collect your companion and redefine your travel boundaries." }
          ].map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="relative p-10 rounded-[40px] bg-white/5 border border-white/10 backdrop-blur-sm group hover:bg-white/10 transition-all"
            >
              <div className="text-5xl font-black text-white/10 mb-8 group-hover:text-zoom-green/20 transition-colors">{step.num}</div>
              <h4 className="text-xl font-black mb-4 tracking-tight">{step.title}</h4>
              <p className="text-slate-400 font-medium leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="relative"
      >
        <HeroParallax />
      </motion.div>
      <Footers />
    </>
  );
}

export default Home;