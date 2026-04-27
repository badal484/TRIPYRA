import { Link } from "react-router-dom"
import styles from "../.."
import Footers from "../../components/Footer"
import { motion, AnimatePresence } from "framer-motion"
import { IconCash, IconShieldCheck, IconClock, IconChartBar, IconCircleCheck, IconDeviceMobile, IconLifebuoy, IconChevronDown } from "@tabler/icons-react"
import EnterpriseHero1 from "../../Assets/enterprise_hero.png"
import EnterpriseHero2 from "../../Assets/enterprise_hero_2.png"
import EnterpriseHero3 from "../../Assets/enterprise_hero_3.png"
import HappyHost from "../../Assets/happy_host_rect.png"
import VendorApp from "../../Assets/vendor_app.png"
import InsuranceBanner from "../../Assets/insurance_banner.png"
import { useState, useEffect } from "react"
import { useSelector } from "react-redux"

const CAROUSEL_IMAGES = [EnterpriseHero1, EnterpriseHero2, EnterpriseHero3];

const HOW_IT_WORKS = [
  { step: "01", title: "List your car", desc: "Sign up as a vendor and list your car with basic details and high-quality photos." },
  { step: "02", title: "We verify", desc: "Our team will conduct a quick physical inspection and verify your documents." },
  { step: "03", title: "Start renting", desc: "Go live! Set your own pricing and availability through the vendor dashboard." },
  { step: "04", title: "Get paid", desc: "Earnings are credited directly to your bank account every week." }
];

const FAQS = [
  { q: "What documents do I need to list my car?", a: "You need your car's RC, Insurance, and a valid ID proof of the owner." },
  { q: "How much can I realistically earn?", a: "Earnings depend on the car model and location. Active hosts usually earn between ₹30,000 to ₹70,000 monthly." },
  { q: "Who pays for the fuel during trips?", a: "Users pay for fuel. You just need to provide the car with a full tank (or as per policy)." },
  { q: "Is my car safe with Tripyra users?", a: "Yes, every user is KYC verified. Additionally, your car is tracked via GPS and covered by our insurance." }
];

function Enterprise() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % CAROUSEL_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const benefits = [
    {
      icon: <IconCash className="w-10 h-10 text-zoom-green" />,
      title: "Earn Extra Income",
      description: "Turn your idle car into a money-making machine. Hosts earn up to ₹50,000 per month."
    },
    {
      icon: <IconShieldCheck className="w-10 h-10 text-zoom-green" />,
      title: "Total Protection",
      description: "Your car is covered by our comprehensive insurance policy during every trip."
    },
    {
      icon: <IconClock className="w-10 h-10 text-zoom-green" />,
      title: "Flexible Schedule",
      description: "You decide when your car is available. Block out dates for personal use anytime."
    },
    {
      icon: <IconChartBar className="w-10 h-10 text-zoom-green" />,
      title: "Detailed Insights",
      description: "Track your earnings and vehicle performance through our advanced vendor dashboard."
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Carousel Section */}
      <section className="relative h-[65vh] lg:h-[75vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIdx}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${CAROUSEL_IMAGES[currentIdx]})` }}
            />
          </AnimatePresence>
        </div>
        <div className="absolute inset-0 bg-black/40 z-[1]"></div>
        
        <div className="relative z-10 text-center px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold text-white mb-6"
          >
            Don't let your car <br/> sit idle. <span className="text-zoom-green">Start earning.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto"
          >
            Join thousands of hosts on Tripyra and build your own car rental business today.
          </motion.p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex flex-col items-center"
          >
            <Link 
              to="/vendorSignup" 
              className="bg-zoom-green text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-green-600 transition-all shadow-lg mb-8"
            >
              List Your Car Now
            </Link>
            
            {/* Carousel Indicators */}
            <div className="flex gap-2">
              {CAROUSEL_IMAGES.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`h-1.5 rounded-full transition-all duration-500 ${idx === currentIdx ? 'w-8 bg-zoom-green' : 'w-2 bg-white/50'}`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why host on Tripyra?</h2>
          <p className="text-gray-600 text-lg">We provide the tools and security you need to succeed.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {benefits.map((benefit, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-8 rounded-2xl border border-gray-100 hover:border-zoom-green transition-all hover:shadow-xl bg-white group text-center"
            >
              <div className="mb-6 flex justify-center transform group-hover:scale-110 transition-transform">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
              <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="w-full"
          >
            <img 
              src={HappyHost} 
              alt="Happy host" 
              className="rounded-[32px] shadow-2xl w-full h-[450px] lg:h-[550px] object-cover border-8 border-white"
            />
          </motion.div>
          <div className="max-w-4xl text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">"My car paid for its own upgrade in 6 months."</h2>
            <p className="text-xl text-gray-600 italic mb-6">
              - Rajat S., Host from Bangalore
            </p>
            <p className="text-gray-700 leading-relaxed text-lg">
              Tripyra has completely changed how I think about car ownership. Instead of an expense, my car is now an asset that generates passive income while I'm at work.
            </p>
          </div>
        </div>
      </section>

      {/* How it Works Step-by-Step */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 italic">How it works</h2>
          <p className="text-gray-500 font-medium">Four simple steps to start your car rental business</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {HOW_IT_WORKS.map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="relative p-8 bg-white rounded-3xl border border-gray-100 hover:shadow-2xl transition-all"
            >
              <span className="text-6xl font-black text-gray-100 absolute top-4 right-6 z-0">{item.step}</span>
              <div className="relative z-10">
                <IconCircleCheck className="text-zoom-green w-10 h-10 mb-4" />
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Insurance Showcase Banner */}
      <section className="relative h-[500px] flex items-center justify-center overflow-hidden my-20">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${InsuranceBanner})` }}
        ></div>
        <div className="absolute inset-0 bg-black/60 z-10"></div>
        <div className="relative z-20 text-center text-white max-w-4xl px-6">
          <IconLifebuoy className="w-16 h-16 text-zoom-green mx-auto mb-6 animate-pulse" />
          <h2 className="text-4xl md:text-5xl font-bold mb-6 italic">Peace of Mind, Guaranteed.</h2>
          <p className="text-xl text-gray-300 leading-relaxed">
            Every booking is covered by our ₹20 Lakh Insurance Policy. We handle the damage, the paperwork, and the users, so you don't have to.
          </p>
        </div>
      </section>

      {/* App Showcase Section */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 italic text-gray-900 leading-tight">Manage your fleet <br/> <span className="text-zoom-green">on the go.</span></h2>
              <p className="text-lg text-gray-600 mb-10 leading-relaxed">
                Our powerful vendor app gives you real-time visibility into your earnings, car performance, and upcoming bookings. Handle everything from your pocket.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-3 bg-black text-white px-6 py-3 rounded-2xl cursor-pointer hover:bg-gray-800 transition-all">
                  <IconDeviceMobile />
                  <div>
                    <p className="text-[10px] uppercase">Get it on</p>
                    <p className="text-lg font-bold">Google Play</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-black text-white px-6 py-3 rounded-2xl cursor-pointer hover:bg-gray-800 transition-all">
                  <IconDeviceMobile />
                  <div>
                    <p className="text-[10px] uppercase">Download on</p>
                    <p className="text-lg font-bold">App Store</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
          <motion.div 
            initial={{ opacity: 0, x: 100, rotate: 5 }}
            whileInView={{ opacity: 1, x: 0, rotate: 0 }}
            viewport={{ once: true }}
            className="flex-1"
          >
            <img src={VendorApp} alt="App Mockup" className="rounded-[40px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] border-[12px] border-gray-900" />
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 italic">Common Questions</h2>
            <p className="text-gray-500">Everything you need to know about becoming a host</p>
          </div>
          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
              >
                <div className="flex justify-between items-center cursor-pointer">
                  <h3 className="text-lg font-bold text-gray-800">{faq.q}</h3>
                  <IconChevronDown className="text-zoom-green" />
                </div>
                <p className="mt-4 text-gray-600 leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-20 text-center">
        <h2 className="text-3xl font-bold mb-8">Ready to join the community?</h2>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {currentUser ? (
             <Link 
                to="/vendorDashboard" 
                className="bg-zoom-green text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-green-600 transition-all shadow-md"
             >
                Go to Vendor Dashboard
             </Link>
          ) : (
            <>
              <Link 
                to="/vendorSignin" 
                className="border-2 border-zoom-green text-zoom-green px-10 py-3 rounded-full font-bold hover:bg-green-50 transition-all"
              >
                Login as Vendor
              </Link>
              <Link 
                to="/vendorSignup" 
                className="bg-zoom-green text-white px-10 py-3 rounded-full font-bold hover:bg-green-600 transition-all shadow-md"
              >
                Create Account
              </Link>
            </>
          )}
        </div>
      </section>

      <Footers />
    </div>
  )
}

export default Enterprise