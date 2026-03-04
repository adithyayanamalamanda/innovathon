import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/i18n/LanguageContext';
import {
    ArrowRight,
    Map,
    Tractor,
    Users,
    Zap,
    ShieldCheck,
    TrendingUp,
    MapPin,
    Star,
    CheckCircle2,
    Sprout,
    BarChart3,
    Sun,
    CloudRain,
    Wind,
    Eye,
    Loader2,
    LocateFixed,
    Thermometer
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

// Generate AI farming advice based on real weather data
const generateFarmingAdvice = (temp, rain, windspeed, humidity) => {
    const tips = [];
    if (rain > 60) tips.push('Heavy rain likely — avoid spraying pesticides or fertilizers today.');
    else if (rain > 30) tips.push('Moderate rain chance — hold off on irrigation to conserve water.');
    else tips.push('Dry conditions ahead — ensure adequate irrigation for crops.');

    if (temp > 38) tips.push('Extreme heat alert: water crops in early morning or evening to reduce evaporation.');
    else if (temp > 32) tips.push('High temperature: monitor soil moisture closely and provide shade for young seedlings.');
    else if (temp < 15) tips.push('Cool conditions: ideal for sowing Rabi crops like wheat and mustard.');
    else tips.push('Moderate temperature: favorable for most field operations.');

    if (windspeed > 30) tips.push('Strong winds: avoid harvesting or spraying. Secure greenhouse covers.');
    else if (windspeed > 15) tips.push('Moderate winds: good for natural pollination of flowering crops.');

    if (humidity > 80) tips.push('High humidity: watch for fungal diseases — inspect crops for early blight or powdery mildew.');

    return tips.slice(0, 2).join(' ');
};

const Home = () => {
    const [recentLands, setRecentLands] = useState([]);
    const [activeTab, setActiveTab] = useState('prices');
    const { t } = useLanguage();

    // Weather state
    const [weather, setWeather] = useState(null);
    const [locationName, setLocationName] = useState('');
    const [weatherLoading, setWeatherLoading] = useState(false);
    const [weatherError, setWeatherError] = useState('');
    const [locationRequested, setLocationRequested] = useState(false);

    useEffect(() => {
        base44.entities.Land.list("-created_date", 3).then(setRecentLands).catch(() => { });
    }, []);

    const fetchWeather = () => {
        if (!navigator.geolocation) {
            setWeatherError('Geolocation is not supported by your browser.');
            return;
        }
        setWeatherLoading(true);
        setWeatherError('');
        setLocationRequested(true);
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const { latitude: lat, longitude: lon } = pos.coords;
                try {
                    // Reverse geocode with Nominatim
                    const geoRes = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
                        { headers: { 'Accept-Language': 'en' } }
                    );
                    const geoData = await geoRes.json();
                    const city = geoData.address?.city || geoData.address?.town || geoData.address?.village || geoData.address?.county || 'Your Location';
                    const state = geoData.address?.state || '';
                    setLocationName(state ? `${city}, ${state}` : city);

                    // Fetch weather from Open-Meteo (free, no API key)
                    const weatherRes = await fetch(
                        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation_probability,wind_speed_10m,uv_index,weather_code&timezone=auto`
                    );
                    const weatherData = await weatherRes.json();
                    const c = weatherData.current;
                    setWeather({
                        temp: Math.round(c.temperature_2m),
                        humidity: Math.round(c.relative_humidity_2m),
                        rain: Math.round(c.precipitation_probability),
                        wind: Math.round(c.wind_speed_10m),
                        uv: c.uv_index != null ? (c.uv_index >= 8 ? 'Very High' : c.uv_index >= 6 ? 'High' : c.uv_index >= 3 ? 'Moderate' : 'Low') : 'N/A',
                        advice: generateFarmingAdvice(c.temperature_2m, c.precipitation_probability, c.wind_speed_10m, c.relative_humidity_2m),
                    });
                } catch (e) {
                    setWeatherError('Could not fetch weather data. Please try again.');
                } finally {
                    setWeatherLoading(false);
                }
            },
            (err) => {
                setWeatherLoading(false);
                setWeatherError('Location access denied. Please allow location permission and try again.');
            },
            { timeout: 10000 }
        );
    };

    const stats = [
        { label: t('home.activeFarmers'), value: '50K+', icon: Users },
        { label: t('home.acresListed'), value: '120K+', icon: Map },
        { label: t('home.equipmentAvailable'), value: '15K+', icon: Tractor },
        { label: t('home.successfulBookings'), value: '200K+', icon: CheckCircle2 },
    ];

    const cropPrices = [
        { crop: 'Paddy', price: '₹2,183/qntl', trend: '+2.4%', state: 'Telangana' },
        { crop: 'Cotton', price: '₹7,020/qntl', trend: '-1.1%', state: 'Maharashtra' },
        { crop: 'Wheat', price: '₹2,275/qntl', trend: '+0.8%', state: 'Punjab' },
        { crop: 'Maize', price: '₹1,960/qntl', trend: '+1.7%', state: 'Karnataka' },
    ];

    return (
        <div className="overflow-hidden">
            {/* ── Hero Section ── */}
            <section className="relative pt-16 pb-32 px-4 hero-gradient overflow-hidden">
                {/* Animated mesh orbs */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full animate-float-slow"
                        style={{ background: 'radial-gradient(circle, rgba(5,150,105,0.12) 0%, transparent 70%)' }} />
                    <div className="absolute bottom-[-5%] left-[-5%] w-[400px] h-[400px] rounded-full animate-float"
                        style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)', animationDelay: '2s' }} />
                    <div className="absolute top-1/2 left-1/4 w-[300px] h-[300px] rounded-full animate-float-slow"
                        style={{ background: 'radial-gradient(circle, rgba(5,150,105,0.06) 0%, transparent 70%)', animationDelay: '4s' }} />
                    {/* Grid pattern */}
                    <div className="absolute inset-0 opacity-[0.02]"
                        style={{ backgroundImage: 'linear-gradient(rgba(5,150,105,1) 1px, transparent 1px), linear-gradient(90deg, rgba(5,150,105,1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
                </div>

                <div className="container mx-auto relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        >
                            {/* Trust badge */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
                                className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full mb-8 relative"
                                style={{ background: 'linear-gradient(135deg, rgba(5,150,105,0.1), rgba(16,185,129,0.06))', border: '1px solid rgba(5,150,105,0.2)' }}
                            >
                                <Zap className="w-4 h-4 text-primary fill-primary" />
                                <span className="text-primary font-bold text-xs uppercase tracking-widest">{t('home.badge')}</span>
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            </motion.div>

                            {/* Main heading */}
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                className="text-5xl md:text-7xl font-black text-slate-900 mb-6 leading-[1.05] tracking-tight"
                                style={{ fontFamily: 'Outfit, Inter, sans-serif' }}
                            >
                                {t('home.heroTitle1')}
                                <span
                                    className="block text-shimmer"
                                    style={{ fontStyle: 'italic' }}
                                >
                                    {t('home.heroTitleHighlight')}
                                </span>
                                {t('home.heroTitle2') && <span className="block text-slate-900">{t('home.heroTitle2')}</span>}
                            </motion.h1>

                            {/* Subtext */}
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.45, duration: 0.7 }}
                                className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed font-medium"
                            >
                                {t('home.heroDesc')}
                            </motion.p>

                            {/* CTAs */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6, duration: 0.6 }}
                                className="flex flex-col sm:flex-row gap-4 justify-center"
                            >
                                <Link to="/lands">
                                    <button className="btn-premium group w-full sm:w-auto text-base py-4 px-9 rounded-2xl flex items-center gap-2 justify-center font-bold">
                                        {t('home.exploreMarketplace')}
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                                    </button>
                                </Link>
                                <button
                                    className="w-full sm:w-auto text-base py-4 px-9 rounded-2xl font-bold text-slate-700 hover:text-primary transition-all glass border border-slate-200/60 hover:border-primary/30 hover:shadow-lg active:scale-[0.98]"
                                    onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                                >
                                    {t('home.howItWorks')}
                                </button>
                            </motion.div>

                            {/* Social proof strip */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.9 }}
                                className="flex items-center justify-center gap-6 mt-12 pt-8 border-t border-slate-200/50"
                            >
                                <div className="flex -space-x-2">
                                    {['https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=60', 'https://images.unsplash.com/photo-1580213144054-e372f741c235?w=60', 'https://images.unsplash.com/photo-1540560522866-da2270928e4a?w=60', 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=60'].map((src, i) => (
                                        <img key={i} src={src} alt="farmer" className="w-9 h-9 rounded-full border-2 border-white object-cover shadow-sm hover:scale-110 hover:z-10 transition-transform relative" />
                                    ))}
                                </div>
                                <div className="text-left">
                                    <div className="flex items-center gap-1">
                                        {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />)}
                                    </div>
                                    <p className="text-xs text-slate-500 font-medium">Trusted by <b className="text-slate-800">15,000+</b> farmers</p>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Stats Counter */}
            <section className="py-14 bg-white/60 backdrop-blur-lg border-y border-slate-200/40 relative z-20">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                        {stats.map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.5 }}
                                className="text-center p-6 md:p-8 rounded-[2rem] glass-card card-hover group"
                            >
                                <div className="w-14 h-14 bg-primary/8 group-hover:bg-primary text-primary group-hover:text-white transition-all duration-300 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm group-hover:shadow-lg group-hover:shadow-primary/20">
                                    <stat.icon className="w-7 h-7" />
                                </div>
                                <div className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">{stat.value}</div>
                                <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Live Market & AI Insights */}
            <section className="py-24 px-4 bg-slate-50 relative overflow-hidden">
                {/* Subtle bg decoration */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
                <div className="container mx-auto relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <h2 className="text-4xl font-bold text-slate-900 mb-6 leading-tight">
                                {t('home.realTimeTitle1')}<br />
                                <span className="gradient-text">{t('home.realTimeTitle2')}</span>
                            </h2>
                            <p className="text-slate-600 mb-10 text-lg leading-relaxed">
                                {t('home.realTimeDesc')}
                            </p>

                            <Card className="border border-slate-200/40 shadow-elevated rounded-3xl overflow-hidden bg-white">
                                <div className="premium-gradient px-8 py-5 flex justify-between items-center">
                                    <span className="text-white font-bold flex items-center gap-2.5 text-lg">
                                        <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
                                            <TrendingUp className="w-5 h-5" />
                                        </div>
                                        {t('home.marketPulse')}
                                    </span>
                                    <span className="bg-white/15 px-3 py-1.5 rounded-full text-white/90 text-[10px] uppercase tracking-widest font-bold border border-white/20 backdrop-blur-sm flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse inline-block" />
                                        {t('home.updatedToday')}
                                    </span>
                                </div>
                                <CardContent className="p-0">
                                    <div className="divide-y divide-slate-100/80">
                                        {cropPrices.map((item, i) => (
                                            <div key={i} className="px-8 py-5 flex items-center justify-between hover:bg-primary/3 transition-all cursor-pointer group">
                                                <div>
                                                    <div className="font-extrabold text-slate-900 text-lg group-hover:text-primary transition-colors">{item.crop}</div>
                                                    <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-1 flex items-center gap-1">
                                                        <MapPin className="w-3 h-3 text-slate-400" /> {item.state}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-bold text-slate-900 text-lg">{item.price}</div>
                                                    <div className={cn("text-xs font-bold px-2.5 py-0.5 rounded-lg inline-block mt-1",
                                                        item.trend.startsWith('+') ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-rose-50 text-rose-600 border border-rose-100")}>
                                                        {item.trend}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <div className="relative">
                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className="relative z-10"
                            >
                                <div className="rounded-[2.5rem] overflow-hidden p-8 md:p-10 border border-slate-200/60 premium-shadow relative bg-white/95 backdrop-blur-sm">
                                    {/* Header */}
                                    <div className="flex items-center justify-between gap-4 mb-8">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-gradient-to-br from-amber-50 to-amber-100 text-amber-500 rounded-2xl shadow-sm border border-amber-200/50">
                                                <Sun className="w-8 h-8" />
                                            </div>
                                            <div>
                                                <h3 className="font-extrabold text-slate-900 text-xl md:text-2xl">{t('home.aiWeatherAdvisor')}</h3>
                                                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider flex items-center gap-1 mt-1">
                                                    <MapPin className="w-3 h-3" />
                                                    {weather ? locationName : 'Detect your location'}
                                                </p>
                                            </div>
                                        </div>
                                        {/* Detect Location Button */}
                                        <button
                                            onClick={fetchWeather}
                                            disabled={weatherLoading}
                                            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-dark transition-all shadow-md hover:shadow-lg active:scale-[0.97] disabled:opacity-60 shrink-0 border border-primary-dark/20"
                                        >
                                            {weatherLoading
                                                ? <Loader2 className="w-4 h-4 animate-spin" />
                                                : <LocateFixed className="w-4 h-4" />}
                                            <span className="hidden sm:inline">{weatherLoading ? 'Detecting...' : 'My Location'}</span>
                                        </button>
                                    </div>

                                    {/* Error State */}
                                    {weatherError && (
                                        <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-2xl p-4 mb-6 animate-fade-up">
                                            {weatherError}
                                        </div>
                                    )}

                                    {/* Initial / Not yet requested */}
                                    {!locationRequested && !weatherLoading && (
                                        <div className="bg-slate-50 rounded-2xl p-6 mb-6 border border-slate-100 text-center">
                                            <LocateFixed className="w-8 h-8 text-primary mx-auto mb-3 animate-subtle-bounce" />
                                            <p className="text-slate-600 font-medium text-sm">Click <strong>My Location</strong> to get real-time weather and AI-powered farming advice for your area.</p>
                                        </div>
                                    )}

                                    {/* Loading Skeleton */}
                                    {weatherLoading && (
                                        <div className="space-y-4 mb-6">
                                            <div className="h-20 bg-slate-100 rounded-2xl skeleton"></div>
                                            <div className="grid grid-cols-4 gap-3">
                                                {[1, 2, 3, 4].map(i => <div key={i} className="h-16 bg-slate-100 rounded-xl skeleton" style={{ animationDelay: `${i * 0.15}s` }}></div>)}
                                            </div>
                                        </div>
                                    )}

                                    {/* Weather Data */}
                                    {weather && !weatherLoading && (
                                        <div className="animate-fade-up">
                                            {/* AI Advice */}
                                            <div className="bg-emerald-50/80 rounded-2xl p-5 mb-6 border border-emerald-100">
                                                <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-widest mb-2">
                                                    <Sprout className="w-3 h-3" /> AI Farming Advice
                                                </div>
                                                <p className="text-slate-700 italic border-l-4 border-primary pl-4 py-1 text-sm leading-relaxed">
                                                    "{weather.advice}"
                                                </p>
                                            </div>

                                            {/* Weather Stats Grid */}
                                            <div className="grid grid-cols-4 gap-3">
                                                <div className="text-center p-3 rounded-xl bg-amber-50/80 border border-amber-100 hover:shadow-md transition-shadow">
                                                    <Thermometer className="w-4 h-4 text-amber-500 mx-auto mb-1" />
                                                    <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">Temp</div>
                                                    <div className="font-bold text-slate-900 text-base">{weather.temp}°C</div>
                                                </div>
                                                <div className="text-center p-3 rounded-xl bg-blue-50/80 border border-blue-100 hover:shadow-md transition-shadow">
                                                    <CloudRain className="w-4 h-4 text-blue-500 mx-auto mb-1" />
                                                    <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">Rain</div>
                                                    <div className="font-bold text-slate-900 text-base">{weather.rain}%</div>
                                                </div>
                                                <div className="text-center p-3 rounded-xl bg-purple-50/80 border border-purple-100 hover:shadow-md transition-shadow">
                                                    <Wind className="w-4 h-4 text-purple-500 mx-auto mb-1" />
                                                    <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">Wind</div>
                                                    <div className="font-bold text-slate-900 text-base">{weather.wind}<span className="text-[10px]">km/h</span></div>
                                                </div>
                                                <div className="text-center p-3 rounded-xl bg-slate-50 border border-slate-100 hover:shadow-md transition-shadow">
                                                    <Sun className="w-4 h-4 text-orange-400 mx-auto mb-1" />
                                                    <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">UV</div>
                                                    <div className="font-bold text-slate-900 text-sm">{weather.uv}</div>
                                                </div>
                                            </div>

                                            {/* Humidity bar */}
                                            <div className="mt-4">
                                                <div className="flex justify-between text-xs text-slate-500 font-medium mb-1">
                                                    <span>Humidity</span>
                                                    <span className="font-bold text-slate-700">{weather.humidity}%</span>
                                                </div>
                                                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-primary to-emerald-400 rounded-full transition-all duration-1000 ease-out"
                                                        style={{ width: `${weather.humidity}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>

                            {/* Decorative elements */}
                            <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-primary/15 rounded-full blur-3xl -z-10"></div>
                            <div className="absolute top-1/2 -right-12 w-48 h-48 bg-emerald-100/50 rounded-full -z-10 blur-2xl"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Services */}
            <section id="services" className="py-24 px-4 bg-white relative overflow-hidden">
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/3 rounded-full blur-[150px] pointer-events-none" />
                <div className="container mx-auto relative z-10">
                    <div className="flex justify-between items-end mb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <div className="text-primary font-bold text-sm uppercase tracking-widest mb-4">{t('home.ourEcosystem')}</div>
                            <h2 className="text-4xl font-bold text-slate-900 heading-decoration">{t('home.onePlatform')}</h2>
                        </motion.div>
                        <Link to="/lands" className="hidden md:flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all group">
                            {t('home.viewAllServices')} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <ServiceCard
                            title={t('home.landLeasing')}
                            desc={t('home.landLeasingDesc')}
                            icon={Map}
                            color="bg-emerald-50 text-emerald-600"
                            borderColor="hover:border-emerald-200"
                            link="/lands"
                            t={t}
                            delay={0}
                        />
                        <ServiceCard
                            title={t('home.equipmentRentalTitle')}
                            desc={t('home.equipmentRentalDesc')}
                            icon={Tractor}
                            color="bg-blue-50 text-blue-600"
                            borderColor="hover:border-blue-200"
                            link="/equipment"
                            t={t}
                            delay={0.1}
                        />
                        <ServiceCard
                            title={t('home.skilledLabor')}
                            desc={t('home.skilledLaborDesc')}
                            icon={Users}
                            color="bg-amber-50 text-amber-600"
                            borderColor="hover:border-amber-200"
                            link="/workers"
                            t={t}
                            delay={0.2}
                        />
                    </div>
                </div>
            </section>

            {/* Trust Badges / Partners */}
            <section className="py-20 bg-slate-900 overflow-hidden relative">
                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl font-bold text-white mb-4">{t('home.trustedByFarmers')}</h2>
                        <div className="h-1 w-20 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto rounded-full"></div>
                    </motion.div>

                    {/* Partner marquee */}
                    <div className="overflow-hidden relative">
                        <div className="flex gap-16 items-center animate-marquee whitespace-nowrap">
                            {[...['Krishi Vigyan', 'AgriTech India', 'National Seeds', 'FPO Alliance', 'NABARD', 'ICAR'], ...['Krishi Vigyan', 'AgriTech India', 'National Seeds', 'FPO Alliance', 'NABARD', 'ICAR']].map((p, i) => (
                                <span key={i} className="text-white/30 font-black text-xl md:text-2xl tracking-tighter hover:text-white/60 transition-colors cursor-default">{p}</span>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.4)_100%)]"></div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-4 relative overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-primary-darkest">
                <div className="container mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">{t('home.readyToGrow')}</h2>
                        <p className="text-white/80 text-lg mb-12 max-w-2xl mx-auto">
                            {t('home.ctaDesc')}
                        </p>
                        <Link to="/profile">
                            <Button size="2xl" className="bg-white !text-primary hover:bg-white/95 shadow-[0_15px_40px_-5px_rgba(255,255,255,0.25)] transform hover:scale-105 active:scale-[0.98] transition-all font-bold rounded-2xl px-12">
                                {t('home.getStarted')}
                            </Button>
                        </Link>
                    </motion.div>
                </div>
                {/* Decorative Circles */}
                <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-white/8 blur-3xl"></div>
                <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-black/10 blur-3xl"></div>
                {/* Diagonal stripes */}
                <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255,255,255,1) 20px, rgba(255,255,255,1) 21px)' }}></div>
            </section>
        </div>
    );
};

const ServiceCard = ({ title, desc, icon: Icon, color, borderColor, link, t, delay = 0 }) => (
    <Link to={link}>
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.5 }}
            className={cn("bg-white/80 backdrop-blur-lg p-8 rounded-[2rem] border border-slate-200/40 shadow-card card-hover h-full flex flex-col relative overflow-hidden group", borderColor)}
        >
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary/5 to-transparent blur-2xl -mr-10 -mt-10 pointer-events-none rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mb-8 shadow-sm border border-white/50 relative z-10 group-hover:scale-110 transition-transform duration-300", color)}>
                <Icon className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900 mb-4 tracking-tight group-hover:text-primary transition-colors">{title}</h3>
            <p className="text-slate-600 leading-relaxed mb-8 font-medium flex-grow">{desc}</p>
            <div className="flex items-center gap-2 text-primary font-bold text-sm tracking-wide group-hover:gap-4 transition-all mt-auto pt-6 border-t border-slate-100">
                {t('home.learnMore')} <ArrowRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform" />
            </div>
        </motion.div>
    </Link>
);

export default Home;
