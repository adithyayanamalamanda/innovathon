import React, { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Filter,
    Tractor as TractorIcon,
    ChevronRight,
    Zap,
    ShieldCheck,
    MapPin,
    Gauge,
    Calendar,
    X,
    CheckCircle2,
    IndianRupee
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useNavigate, Link } from 'react-router-dom';

// Simple toast hook
const useToast = () => {
    const [toasts, setToasts] = useState([]);
    const toast = (msg, type = 'success') => {
        const id = Date.now();
        setToasts(t => [...t, { id, msg, type }]);
        setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000);
    };
    return { toasts, toast };
};

const Equipment = () => {
    const navigate = useNavigate();
    const [equipment, setEquipment] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeType, setActiveType] = useState('All');
    const [bookingItem, setBookingItem] = useState(null);
    const { toasts, toast } = useToast();

    useEffect(() => {
        loadEquipment();
    }, []);

    const loadEquipment = async () => {
        setLoading(true);
        try {
            const data = await base44.entities.Equipment.list("-created_date", 50);
            setEquipment(data.length > 0 ? data : mockEquipment);
        } catch (e) {
            setEquipment(mockEquipment);
        } finally {
            setLoading(false);
        }
    };

    const mockEquipment = [
        {
            id: 'e1',
            name: 'John Deere 5310',
            equipment_type: 'Tractor',
            owner_email: 'tractor_hub@example.com',
            hourly_rate: 800,
            daily_rate: 6000,
            fuel_included: false,
            images: ['https://images.unsplash.com/photo-1593110050241-ee7ce35e9700?w=800&q=80'],
            location_address: 'Wyra, Khammam',
            state: 'Telangana',
            district: 'Khammam',
            status: 'Available',
            condition: 'Excellent',
            year: 2023
        },
        {
            id: 'e2',
            name: 'Kubota Combine Harvester',
            equipment_type: 'Harvester',
            owner_email: 'agri_rentals@example.com',
            hourly_rate: 2500,
            daily_rate: 18000,
            fuel_included: true,
            images: ['https://images.unsplash.com/photo-1594494424758-a24a597d2c6f?w=800&q=80'],
            location_address: 'Agri Hub, Guntur',
            state: 'Andhra Pradesh',
            district: 'Guntur',
            status: 'Available',
            condition: 'New',
            year: 2024
        },
        {
            id: 'e3',
            name: 'DJI Agras T40 Drone',
            equipment_type: 'Drone',
            owner_email: 'skytech@example.com',
            hourly_rate: 1500,
            daily_rate: 10000,
            fuel_included: true,
            images: ['https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&q=80'],
            location_address: 'Tech Park, Hyderabad',
            state: 'Telangana',
            district: 'Hyderabad',
            status: 'Busy',
            condition: 'Excellent',
            year: 2023
        }
    ];

    const types = ['All', 'Tractor', 'Harvester', 'Rotavator', 'Drone', 'Sprayer'];

    const filtered = equipment.filter(e => {
        const matchesSearch = e.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = activeType === 'All' || e.equipment_type === activeType;
        return matchesSearch && matchesType;
    });

    return (
        <div className="container mx-auto px-4 pb-20">
            {/* Toast notifications */}
            <div className="fixed top-24 right-4 z-[200] flex flex-col gap-2 pointer-events-none">
                <AnimatePresence>
                    {toasts.map(t => (
                        <motion.div
                            key={t.id}
                            initial={{ opacity: 0, x: 80 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 80 }}
                            className={cn(
                                "px-5 py-3 rounded-2xl shadow-xl text-sm font-bold flex items-center gap-2",
                                t.type === 'success' ? "bg-emerald-600 text-white" : "bg-red-500 text-white"
                            )}
                        >
                            <CheckCircle2 className="w-4 h-4" /> {t.msg}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Equipment Rental</h1>
                    <p className="text-slate-500">Rent modern agricultural machinery at competitive rates.</p>
                </div>
                <Button
                    variant="premium"
                    className="h-14 px-8 rounded-2xl shadow-xl"
                    onClick={() => navigate('/login')}
                >
                    <Plus className="w-5 h-5 mr-2" />
                    List Your Equipment
                </Button>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col lg:flex-row gap-4 mb-12">
                <div className="relative flex-grow">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search tractor, harvester, drone..."
                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-slate-100 shadow-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-slate-700"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
                    {types.map(t => (
                        <button
                            key={t}
                            onClick={() => setActiveType(t)}
                            className={cn(
                                "px-6 py-3 rounded-2xl text-sm font-bold transition-all whitespace-nowrap",
                                activeType === t ? "bg-primary text-white shadow-lg" : "bg-white text-slate-500 border border-slate-100"
                            )}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map(i => <div key={i} className="h-96 bg-slate-50 rounded-3xl animate-pulse"></div>)}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence>
                        {filtered.map((item, i) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <EquipmentCard item={item} onBook={() => setBookingItem(item)} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Booking Modal */}
            <AnimatePresence>
                {bookingItem && (
                    <BookingModal
                        item={bookingItem}
                        onClose={() => setBookingItem(null)}
                        onConfirm={(days) => {
                            setBookingItem(null);
                            toast(`Booking confirmed for ${bookingItem.name} — ${days} day(s)!`);
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

const BookingModal = ({ item, onClose, onConfirm }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [booked, setBooked] = useState(false);

    const days = startDate && endDate
        ? Math.max(1, Math.ceil((new Date(endDate) - new Date(startDate)) / 86400000))
        : 1;
    const total = days * item.daily_rate;

    const handleConfirm = async () => {
        if (!startDate || !endDate) return;
        setLoading(true);
        await new Promise(r => setTimeout(r, 900));
        setLoading(false);
        setBooked(true);
        setTimeout(() => onConfirm(days), 1500);
    };

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                onClick={onClose}
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative bg-white w-full max-w-md rounded-[2rem] shadow-2xl p-8 z-10"
            >
                <button onClick={onClose} className="absolute top-5 right-5 p-2 hover:bg-slate-100 rounded-xl transition-all">
                    <X className="w-5 h-5 text-slate-500" />
                </button>

                {booked ? (
                    <div className="text-center py-8">
                        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                            <CheckCircle2 className="w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-2">Booking Confirmed!</h3>
                        <p className="text-slate-500">Your request for <b>{item.name}</b> has been sent.</p>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center gap-4 mb-6">
                            <img src={item.images?.[0]} className="w-16 h-16 rounded-2xl object-cover" />
                            <div>
                                <h3 className="font-black text-slate-900 text-lg leading-tight">{item.name}</h3>
                                <p className="text-primary font-bold text-sm">₹{item.daily_rate.toLocaleString()}/day</p>
                            </div>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Start Date</label>
                                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full bg-slate-50 border border-slate-100 p-3 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 font-semibold text-slate-700" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">End Date</label>
                                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
                                    min={startDate || new Date().toISOString().split('T')[0]}
                                    className="w-full bg-slate-50 border border-slate-100 p-3 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 font-semibold text-slate-700" />
                            </div>
                        </div>

                        {startDate && endDate && (
                            <div className="bg-slate-50 rounded-2xl p-4 mb-6 border border-slate-100">
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-slate-500 font-medium">{days} day(s) × ₹{item.daily_rate.toLocaleString()}</span>
                                    <span className="font-black text-slate-900">₹{total.toLocaleString()}</span>
                                </div>
                                {item.fuel_included && <p className="text-xs text-emerald-600 font-bold">✓ Fuel included</p>}
                            </div>
                        )}

                        <Button
                            variant="premium"
                            className="w-full h-14 rounded-2xl text-base font-black"
                            disabled={!startDate || !endDate || loading}
                            onClick={handleConfirm}
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : 'Confirm Booking'}
                        </Button>
                    </>
                )}
            </motion.div>
        </div>
    );
};

const EquipmentCard = ({ item, onBook }) => (
    <Card className="overflow-hidden border-none shadow-sm hover:shadow-2xl transition-all duration-500 rounded-[2.5rem] group h-full flex flex-col">
        <div className="relative h-56 overflow-hidden">
            <img src={item.images?.[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute top-4 left-4">
                <span className={cn("px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md shadow-lg", item.status === 'Available' ? 'bg-emerald-500/90 text-white' : 'bg-rose-500/90 text-white')}>
                    {item.status}
                </span>
            </div>
            <div className="absolute top-4 right-4">
                <div className="bg-white/90 backdrop-blur-md p-2 rounded-xl text-primary shadow-lg">
                    <ShieldCheck className="w-5 h-5" />
                </div>
            </div>
            <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">Hourly Rate</span>
                    <span className="text-lg font-black text-slate-900">₹{item.hourly_rate}</span>
                </div>
            </div>
        </div>
        <CardContent className="p-8 flex-grow flex flex-col">
            <div className="flex items-center gap-2 mb-2 text-primary font-bold text-xs uppercase tracking-widest">
                <TractorIcon className="w-4 h-4" />
                {item.equipment_type}
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2 truncate">{item.name}</h3>
            <div className="flex items-center gap-2 text-slate-500 text-sm mb-6">
                <MapPin className="w-4 h-4" />
                <span>{item.district}, {item.state}</span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center">
                    <Gauge className="w-5 h-5 text-slate-400 mb-2" />
                    <span className="text-xs font-bold text-slate-700">{item.condition}</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center">
                    <Calendar className="w-5 h-5 text-slate-400 mb-2" />
                    <span className="text-xs font-bold text-slate-700">{item.year} Model</span>
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
                {item.status === 'Available' ? 'Review & Rent' : 'Currently Busy'}
                {item.status === 'Available' && <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />}
            </Button>
        </CardContent>
    </Card>
);

export default Equipment;
