import React, { useState, useEffect } from 'react';
import {
    Truck,
    MapPin,
    Phone,
    Weight,
    Navigation,
    Plus,
    Search,
    Filter,
    Package,
    CheckCircle2,
    ChevronRight,
    ShieldCheck,
    X,
    Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const useToast = () => {
    const [toasts, setToasts] = useState([]);
    const toast = (msg, type = 'success') => {
        const id = Date.now();
        setToasts(t => [...t, { id, msg, type }]);
        setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000);
    };
    return { toasts, toast };
};

const Transport = () => {
    const navigate = useNavigate();
    const [transports, setTransports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [bookingItem, setBookingItem] = useState(null);
    const { toasts, toast } = useToast();

    useEffect(() => {
        loadTransports();
    }, []);

    const loadTransports = async () => {
        setLoading(true);
        try {
            const data = await base44.entities.Transport.list("-created_date", 50);
            setTransports(data.length > 0 ? data : mockTransports);
        } catch (e) {
            setTransports(mockTransports);
        } finally {
            setLoading(false);
        }
    };

    const mockTransports = [
        { id: 't1', name: 'Ashok Leyland Dost', provider: 'Sri Rama Transport', location: 'Wyra Road, Khammam', capacity: '2.5 Tons', rate: '₹18/km', image: 'https://images.unsplash.com/photo-1519003722824-192d99787cdf?w=600&q=80', status: 'Available', verified: true },
        { id: 't2', name: 'Tata Ace (Chota Hathi)', provider: 'Vinayaka Logistics', location: 'Guntur bypass', capacity: '1.5 Tons', rate: '₹15/km', image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&q=80', status: 'Available', verified: true },
        { id: 't3', name: 'Eicher Pro 2059', provider: 'Bhavani Carriers', location: 'Hyderabad Hwy', capacity: '5.0 Tons', rate: '₹25/km', image: 'https://images.unsplash.com/photo-1586864387917-f749f55939c1?w=600&q=80', status: 'Busy', verified: true }
    ];

    const filtered = transports.filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()) || t.provider.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="container mx-auto px-4 pb-20">
            {/* Toasts */}
            <div className="fixed top-24 right-4 z-[200] flex flex-col gap-2 pointer-events-none">
                <AnimatePresence>
                    {toasts.map(t => (
                        <motion.div key={t.id} initial={{ opacity: 0, x: 80 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 80 }}
                            className="px-5 py-3 rounded-2xl shadow-xl text-sm font-bold flex items-center gap-2 bg-emerald-600 text-white">
                            <CheckCircle2 className="w-4 h-4" /> {t.msg}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2 underline decoration-primary decoration-4 underline-offset-8">Transport Services</h1>
                    <p className="text-slate-500 mt-4 font-medium">Book reliable transport for your produce and equipment.</p>
                </div>
                <Button className="btn-premium h-14 px-8 rounded-[1.25rem] shadow-[0_8px_20px_-6px_rgba(5,150,105,0.4)] text-[15px]" onClick={() => navigate('/login')}>
                    <Plus className="w-5 h-5 mr-2" />
                    Become a Provider
                </Button>
            </div>

            <div className="glass p-4 rounded-3xl border border-white/60 shadow-xl shadow-slate-200/50 mb-12 flex flex-col lg:flex-row gap-4 items-center">
                <div className="relative flex-grow w-full">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input type="text" placeholder="Search vehicle type or provider..."
                        className="w-full pl-14 pr-4 py-4 rounded-2xl bg-white/50 backdrop-blur-md border border-slate-200/50 outline-none focus:bg-white focus:ring-2 focus:ring-primary/30 transition-all font-semibold text-slate-800 shadow-sm"
                        value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <Button variant="outline" className="h-14 px-6 rounded-2xl border-slate-200/60 bg-white hover:bg-slate-50 shadow-sm text-slate-600">
                    <Filter className="w-5 h-5 mr-2" /> Filter capacity
                </Button>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map(i => <div key={i} className="h-96 bg-slate-50 rounded-3xl animate-pulse"></div>)}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence>
                        {filtered.map((item, i) => (
                            <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                                <TransportCard item={item} onBook={() => setBookingItem(item)} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            <AnimatePresence>
                {bookingItem && (
                    <TransportBookingModal
                        item={bookingItem}
                        onClose={() => setBookingItem(null)}
                        onConfirm={() => {
                            setBookingItem(null);
                            toast(`Transport booked — ${bookingItem.name} from ${bookingItem.provider}!`);
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

const TransportBookingModal = ({ item, onClose, onConfirm }) => {
    const [pickup, setPickup] = useState('');
    const [drop, setDrop] = useState('');
    const [date, setDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [booked, setBooked] = useState(false);

    const handleConfirm = async () => {
        if (!pickup || !drop || !date) return;
        setLoading(true);
        await new Promise(r => setTimeout(r, 900));
        setLoading(false);
        setBooked(true);
        setTimeout(() => onConfirm(), 1500);
    };

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative bg-white w-full max-w-md rounded-[2rem] shadow-2xl p-8 z-10">
                <button onClick={onClose} className="absolute top-5 right-5 p-2 hover:bg-slate-100 rounded-xl transition-all">
                    <X className="w-5 h-5 text-slate-500" />
                </button>

                {booked ? (
                    <div className="text-center py-8">
                        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                            <CheckCircle2 className="w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-2">Transport Booked!</h3>
                        <p className="text-slate-500">Your request for <b>{item.name}</b> has been sent to {item.provider}.</p>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center gap-4 mb-6">
                            <img src={item.image} className="w-16 h-16 rounded-2xl object-cover" />
                            <div>
                                <h3 className="font-black text-slate-900 text-lg leading-tight">{item.name}</h3>
                                <p className="text-primary font-bold text-sm">{item.rate} • {item.capacity}</p>
                            </div>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Pickup Location</label>
                                <input type="text" placeholder="e.g. Khammam Market Yard" value={pickup} onChange={e => setPickup(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-100 p-3 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 font-semibold text-slate-700" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Drop Location</label>
                                <input type="text" placeholder="e.g. Hyderabad APMC" value={drop} onChange={e => setDrop(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-100 p-3 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 font-semibold text-slate-700" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Pickup Date</label>
                                <input type="date" value={date} onChange={e => setDate(e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full bg-slate-50 border border-slate-100 p-3 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 font-semibold text-slate-700" />
                            </div>
                        </div>

                        <div className="bg-blue-50 rounded-2xl p-4 mb-6 border border-blue-100">
                            <p className="text-blue-700 text-xs font-medium">
                                <b>Response time:</b> Under 15 minutes. Provider will call you to confirm route and final fare.
                            </p>
                        </div>

                        <Button className="btn-premium w-full h-14 rounded-[1.25rem] text-base font-black shadow-[0_8px_20px_-6px_rgba(5,150,105,0.4)]"
                            disabled={!pickup || !drop || !date || loading} onClick={handleConfirm}>
                            {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Confirm Booking'}
                        </Button>
                    </>
                )}
            </motion.div>
        </div>
    );
};

const TransportCard = ({ item, onBook }) => (
    <Card className="glass-card overflow-hidden border-white/60 hover:border-primary/20 shadow-lg shadow-slate-200/40 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1.5 transition-all duration-500 rounded-[2.5rem] group h-full flex flex-col">
        <div className="relative h-56 overflow-hidden rounded-t-[2.5rem] m-2">
            <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 rounded-t-[2rem]" />
            <div className="absolute top-4 left-4">
                <span className={cn("px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md shadow-lg border border-white/20", item.status === 'Available' ? 'bg-emerald-500/90 text-white' : 'bg-rose-500/90 text-white')}>
                    {item.status}
                </span>
            </div>
            {item.verified && (
                <div className="absolute top-4 right-4">
                    <div className="bg-white/90 backdrop-blur-md p-2 rounded-xl text-primary shadow-lg">
                        <ShieldCheck className="w-5 h-5" />
                    </div>
                </div>
            )}
        </div>
        <CardContent className="p-8 flex-grow flex flex-col">
            <div className="flex items-center gap-2 mb-2 text-primary">
                <Truck className="w-4 h-4" />
                <span className="text-xs font-black uppercase tracking-widest">{item.capacity} Capacity</span>
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2 truncate">{item.name}</h3>
            <div className="flex items-center gap-2 text-slate-500 text-sm mb-6">
                <Navigation className="w-4 h-4" />
                <span>{item.provider} • {item.location}</span>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Base Rate</span>
                    <span className="text-lg font-black text-slate-900">{item.rate}</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Response</span>
                    <span className="text-lg font-black text-slate-900">Under 15m</span>
                </div>
            </div>
            <Button
                onClick={onBook}
                disabled={item.status !== 'Available'}
                className={cn(
                    "w-full mt-auto h-14 rounded-2xl transition-all shadow-lg text-white font-black flex items-center justify-center gap-2 group/btn",
                    item.status === 'Available' ? "bg-slate-900 hover:bg-primary" : "bg-slate-300 cursor-not-allowed"
                )}
            >
                {item.status === 'Available' ? 'Book Transport' : 'Currently Busy'}
                {item.status === 'Available' && <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />}
            </Button>
        </CardContent>
    </Card>
);

export default Transport;
