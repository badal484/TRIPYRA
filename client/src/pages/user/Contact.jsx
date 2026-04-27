
import { motion } from "framer-motion";
import Footers from "../../components/Footer";
import { IconPhone, IconMail, IconMapPin, IconClock, IconMessage2, IconSend } from "@tabler/icons-react";
import toast, { Toaster } from "react-hot-toast";

const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Message sent! Our team will contact you soon.");
    e.target.reset();
  };

  const ContactCard = ({ icon: Icon, title, info, subtitle }) => (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 flex flex-col items-center text-center gap-4 transition-all duration-300 hover:shadow-xl hover:shadow-zoom-green/5"
    >
      <div className="w-16 h-16 rounded-2xl bg-zoom-green/10 flex items-center justify-center text-zoom-green mb-2">
        <Icon size={32} />
      </div>
      <h3 className="text-xl font-bold text-slate-900">{title}</h3>
      <div className="space-y-1">
        <p className="text-lg font-semibold text-slate-700">{info}</p>
        <p className="text-sm text-slate-400 font-medium">{subtitle}</p>
      </div>
    </motion.div>
  );

  return (
    <div className="bg-white">
      <Toaster />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-slate-950 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-zoom-green/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="car-pill car-pill-green mb-6 inline-block">Support Center</span>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tight">
              We're here to help you <span className="text-zoom-green">get moving.</span>
            </h1>
            <p className="text-slate-400 text-xl font-medium leading-relaxed">
              Have questions about a booking or want to host your vehicle? 
              Our dedicated support team is available 24/7 to assist you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 -mt-40 relative z-20">
            <ContactCard 
              icon={IconPhone}
              title="Call Us"
              info="+91 1800-RENT-RIDE"
              subtitle="Mon-Sat, 9am to 9pm"
            />
            <ContactCard 
              icon={IconMail}
              title="Email Support"
              info="support@rentaride.com"
              subtitle="Average response: 2 hours"
            />
            <ContactCard 
              icon={IconMapPin}
              title="Headquarters"
              info="Cyber City, Bengaluru"
              subtitle="Karnataka, India 560001"
            />
          </div>
        </div>
      </section>

      {/* Form & FAQ Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="lg:flex gap-20 items-start">
            
            {/* Contact Form */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:w-1/2 mb-20 lg:mb-0"
            >
              <div className="bg-white rounded-[48px] border border-slate-100 p-10 md:p-14 shadow-2xl shadow-slate-200/50">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white">
                    <IconMessage2 size={24} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Send a Message</h2>
                    <p className="text-slate-500 font-medium italic">We typically respond within an hour.</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                      <input required type="text" placeholder="John Doe" className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-zoom-green transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                      <input required type="email" placeholder="john@example.com" className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-zoom-green transition-all" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Subject</label>
                    <select className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-zoom-green transition-all font-medium">
                      <option>General Inquiry</option>
                      <option>Booking Modification</option>
                      <option>Billing Question</option>
                      <option>Host Partnership</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Your Message</label>
                    <textarea required rows={5} placeholder="How can we help you today?" className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-zoom-green transition-all"></textarea>
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full h-16 bg-zoom-green rounded-2xl text-white font-black text-lg flex items-center justify-center gap-3 shadow-lg shadow-zoom-green/20"
                  >
                    Send Message
                    <IconSend size={20} />
                  </motion.button>
                </form>
              </div>
            </motion.div>

            {/* FAQ / Side Content */}
            <motion.div 
               initial={{ opacity: 0, x: 20 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
              className="lg:w-1/2 lg:pt-10"
            >
              <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Quick Help</h2>
              <p className="text-slate-500 text-lg mb-12 font-medium">Check these common situations before reaching out—you might find your answer instantly.</p>

              <div className="space-y-6">
                {[
                  { q: "How do I cancel my booking?", a: "You can cancel up to 24 hours before your trip starts via the Orders section in your profile." },
                  { q: "What is required to rent a car?", a: "A valid driver's license and a credit/debit card for the security deposit are mandatory." },
                  { q: "Can I extend my trip?", a: "Yes, extensions are possible if the vehicle is available for the next slot. Use the app to request an extension." },
                  { q: "Is insurance included?", a: "Yes, every Tripyra trip is protected by comprehensive roadside assistance and insurance." }
                ].map((item, i) => (
                  <div key={i} className="group border-b border-slate-100 pb-6">
                    <h4 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-zoom-green transition-colors">{item.q}</h4>
                    <p className="text-slate-500 font-medium leading-relaxed">{item.a}</p>
                  </div>
                ))}
              </div>

              <div className="mt-14 p-10 bg-slate-950 rounded-[40px] text-white flex items-center justify-between">
                <div>
                  <h4 className="text-2xl font-bold mb-1">Corporate Office?</h4>
                  <p className="text-slate-400">Our regional hubs are open for visits.</p>
                </div>
                <div className="w-14 h-14 rounded-full glass-effect flex items-center justify-center">
                  <IconClock size={28} />
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      <Footers />
    </div>
  );
};

export default Contact;


import { motion } from "framer-motion";
import Footers from "../../components/Footer";
import { IconPhone, IconMail, IconMapPin, IconClock, IconMessage2, IconSend } from "@tabler/icons-react";
import toast, { Toaster } from "react-hot-toast";

const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Message sent! Our team will contact you soon.");
    e.target.reset();
  };

  const ContactCard = ({ icon: Icon, title, info, subtitle }) => (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 flex flex-col items-center text-center gap-4 transition-all duration-300 hover:shadow-xl hover:shadow-zoom-green/5"
    >
      <div className="w-16 h-16 rounded-2xl bg-zoom-green/10 flex items-center justify-center text-zoom-green mb-2">
        <Icon size={32} />
      </div>
      <h3 className="text-xl font-bold text-slate-900">{title}</h3>
      <div className="space-y-1">
        <p className="text-lg font-semibold text-slate-700">{info}</p>
        <p className="text-sm text-slate-400 font-medium">{subtitle}</p>
      </div>
    </motion.div>
  );

  return (
    <div className="bg-white">
      <Toaster />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-slate-950 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-zoom-green/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="car-pill car-pill-green mb-6 inline-block">Support Center</span>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tight">
              We're here to help you <span className="text-zoom-green">get moving.</span>
            </h1>
            <p className="text-slate-400 text-xl font-medium leading-relaxed">
              Have questions about a booking or want to host your vehicle? 
              Our dedicated support team is available 24/7 to assist you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 -mt-40 relative z-20">
            <ContactCard 
              icon={IconPhone}
              title="Call Us"
              info="+91 1800-RENT-RIDE"
              subtitle="Mon-Sat, 9am to 9pm"
            />
            <ContactCard 
              icon={IconMail}
              title="Email Support"
              info="support@rentaride.com"
              subtitle="Average response: 2 hours"
            />
            <ContactCard 
              icon={IconMapPin}
              title="Headquarters"
              info="Cyber City, Bengaluru"
              subtitle="Karnataka, India 560001"
            />
          </div>
        </div>
      </section>

      {/* Form & FAQ Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="lg:flex gap-20 items-start">
            
            {/* Contact Form */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:w-1/2 mb-20 lg:mb-0"
            >
              <div className="bg-white rounded-[48px] border border-slate-100 p-10 md:p-14 shadow-2xl shadow-slate-200/50">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white">
                    <IconMessage2 size={24} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Send a Message</h2>
                    <p className="text-slate-500 font-medium italic">We typically respond within an hour.</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                      <input required type="text" placeholder="John Doe" className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-zoom-green transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                      <input required type="email" placeholder="john@example.com" className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-zoom-green transition-all" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Subject</label>
                    <select className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-zoom-green transition-all font-medium">
                      <option>General Inquiry</option>
                      <option>Booking Modification</option>
                      <option>Billing Question</option>
                      <option>Host Partnership</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Your Message</label>
                    <textarea required rows={5} placeholder="How can we help you today?" className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-zoom-green transition-all"></textarea>
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full h-16 bg-zoom-green rounded-2xl text-white font-black text-lg flex items-center justify-center gap-3 shadow-lg shadow-zoom-green/20"
                  >
                    Send Message
                    <IconSend size={20} />
                  </motion.button>
                </form>
              </div>
            </motion.div>

            {/* FAQ / Side Content */}
            <motion.div 
               initial={{ opacity: 0, x: 20 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
              className="lg:w-1/2 lg:pt-10"
            >
              <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Quick Help</h2>
              <p className="text-slate-500 text-lg mb-12 font-medium">Check these common situations before reaching out—you might find your answer instantly.</p>

              <div className="space-y-6">
                {[
                  { q: "How do I cancel my booking?", a: "You can cancel up to 24 hours before your trip starts via the Orders section in your profile." },
                  { q: "What is required to rent a car?", a: "A valid driver's license and a credit/debit card for the security deposit are mandatory." },
                  { q: "Can I extend my trip?", a: "Yes, extensions are possible if the vehicle is available for the next slot. Use the app to request an extension." },
                  { q: "Is insurance included?", a: "Yes, every Tripyra trip is protected by comprehensive roadside assistance and insurance." }
                ].map((item, i) => (
                  <div key={i} className="group border-b border-slate-100 pb-6">
                    <h4 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-zoom-green transition-colors">{item.q}</h4>
                    <p className="text-slate-500 font-medium leading-relaxed">{item.a}</p>
                  </div>
                ))}
              </div>

              <div className="mt-14 p-10 bg-slate-950 rounded-[40px] text-white flex items-center justify-between">
                <div>
                  <h4 className="text-2xl font-bold mb-1">Corporate Office?</h4>
                  <p className="text-slate-400">Our regional hubs are open for visits.</p>
                </div>
                <div className="w-14 h-14 rounded-full glass-effect flex items-center justify-center">
                  <IconClock size={28} />
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      <Footers />
    </div>
  );
};

export default Contact;