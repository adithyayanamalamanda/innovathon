import React, { useState, useEffect } from 'react';
import {
    Search, MapPin, CircleDot, Filter, Eye, CalendarRange, Ruler,
    IndianRupee, X, ChevronRight, Layers
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { base44 } from '@/api/base44Client';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const Lands = () => {
    const [lands, setLands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState('All');
    const [selectedLand, setSelectedLand] = useState(null);

    useEffect(() => {
        base44.entities.Land.list("-created_date", 50).then(data => {
            setLands(data.length > 0 ? data : mockLands);
            setLoading(false);
        }).catch(() => {
            setLands(mockLands);
            setLoading(false);
        });
    }, []);

    const mockLands = [
        { id: '1', title: 'Fertile Black Soil Land', land_type: 'Black', total_area: 5, area_unit: 'Acres', location: 'Khammam, Telangana', status: 'Available', rental_price: 25000, description: 'Rich black soil perfect for cotton, chili and paddy cultivation. Borewell and drip irrigation available.', owner_name: 'Venkat Rao', image_url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600' },
        { id: '2', title: 'Red Soil Farmland', land_type: 'Red', total_area: 3, area_unit: 'Acres', location: 'Warangal, Telangana', status: 'Available', rental_price: 18000, description: 'Red soil land suitable for groundnut and turmeric. Well maintained with proper fencing.', owner_name: 'Srinivas Goud', image_url: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600' },
        { id: '3', title: 'Irrigated Wet Land', land_type: 'Wet', total_area: 10, area_unit: 'Acres', location: 'Guntur, Andhra Pradesh', status: 'Available', rental_price: 45000, description: 'Canal-irrigated wetland ideal for paddy cultivation. Access to both Kharif and Rabi seasons.', owner_name: 'Ravi Kumar', image_url: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=600' },
        { id: '4', title: 'Dry Land Farm Plot', land_type: 'Dry', total_area: 8, area_unit: 'Acres', location: 'Nizamabad, Telangana', status: 'Rented', rental_price: 15000, description: 'Well drainable dry land for maize and soybean. Near highway for easy transport access.', owner_name: 'Ramesh Patil', image_url: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=600' },
    ];

    const landTypes = ['All', 'Black', 'Red', 'Wet', 'Dry'];
    const filtered = lands.filter(l => (selectedType === 'All' || l.land_type === selectedType) && (l.title?.toLowerCase().includes(searchTerm.toLowerCase()) || l.location?.toLowerCase().includes(searchTerm.toLowerCase())));

    const typeColors = { 'Black': 'bg-slate-800 text-white', 'Red': 'bg-red-600 text-white', 'Wet': 'bg-blue-600 text-white', 'Dry': 'bg-amber-600 text-white' };

    return (
        <div className="container mx-auto px-4 pb-20 page-transition">
            {/* Header */}
            <div className="mb-12">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <div className="flex items-center gap-3 text-primary font-bold text-sm uppercase tracking-widest mb-3">
                        <Layers className="w-4 h-4" />
                        Marketplace
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4 heading-decoration">Available Lands</h1>
                    <p className="text-slate-500 text-lg max-w-2xl mt-6">Browse verified agricultural lands across India, ready for lease. Filter by soil type and find the perfect plot.</p>
                </motion.div>
            </div>

            {/* Filters */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-white/80 backdrop-blur-lg rounded-[2rem] shadow-card border border-slate-200/40 p-6 mb-10 flex flex-col md:flex-row gap-5 items-center"
            >
                <div className="relative flex-grow w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" placeholder="Search by land name or location..." value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="input-modern w-full pl-11 pr-4 py-3.5 text-sm" />
                </div>
                <div className="flex gap-2 flex-wrap shrink-0">
                    {landTypes.map(type => (
                        <button key={type} onClick={() => setSelectedType(type)}
                            className={cn("px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 border",
                                selectedType === type
                                    ? "bg-primary text-white border-primary shadow-md shadow-primary/20"
                                    : "bg-white text-slate-600 border-slate-200 hover:border-primary/30 hover:text-primary hover:shadow-sm")}>
                            {type}
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map(i => <div key={i} className="h-96 rounded-[2rem] skeleton"></div>)}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence>
                        {filtered.map((land, index) => (
                            <motion.div
                                key={land.id}
                                layout
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: index * 0.06, duration: 0.4 }}
                            >
                                <Card className="overflow-hidden rounded-[2rem] border border-slate-200/40 shadow-card bg-white/80 backdrop-blur-lg card-hover cursor-pointer group h-full"
                                    onClick={() => setSelectedLand(land)}>
                                    <div className="relative h-52 overflow-hidden">
                                        <img src={land.image_url || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600'} alt={land.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent"></div>
                                        {/* Status badge */}
                                        <div className="absolute top-4 left-4">
                                            <span className={cn("px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md border",
                                                land.status === 'Available' ? 'bg-emerald-500/90 text-white border-emerald-400/30' : 'bg-white/90 text-slate-600 border-white/50')}>
                                                {land.status}
                                            </span>
                                        </div>
                                        {/* Type badge */}
                                        <div className="absolute top-4 right-4">
                                            <span className={cn("px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md", typeColors[land.land_type] || 'bg-slate-800 text-white')}>
                                                {land.land_type} Soil
                                            </span>
                                        </div>
                                        {/* Bottom details */}
                                        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white">
                                            <div>
                                                <h3 className="font-extrabold text-xl tracking-tight leading-tight drop-shadow-lg">{land.title}</h3>
                                                <p className="text-white/80 text-xs font-medium flex items-center gap-1 mt-1">
                                                    <MapPin className="w-3 h-3" /> {land.location}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between mb-5">
                                            <div className="flex items-center gap-1.5">
                                                <IndianRupee className="w-4 h-4 text-primary" />
                                                <span className="text-2xl font-extrabold text-slate-900">{land.rental_price?.toLocaleString()}</span>
                                                <span className="text-xs text-slate-500 font-medium">/year</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-xl text-sm font-bold text-slate-600 border border-slate-100">
                                                <Ruler className="w-3.5 h-3.5 text-slate-400" />
                                                {land.total_area} {land.area_unit}
                                            </div>
                                        </div>
                                        <Button variant="outline" className="w-full rounded-2xl h-12 font-bold text-sm border-slate-200 hover:border-primary hover:text-primary group-hover:bg-primary/5 transition-all">
                                            <Eye className="w-4 h-4 mr-2" /> View Details
                                        </Button>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Empty State */}
            {!loading && filtered.length === 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                        <MapPin className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">No lands found</h3>
                    <p className="text-slate-500">Try adjusting your search or filters.</p>
                </motion.div>
            )}

            {/* Detail Modal */}
            <AnimatePresence>
                {selectedLand && (
                    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setSelectedLand(null)} />
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden z-10 max-h-[85vh] flex flex-col">
                            <div className="relative h-60 shrink-0">
                                <img src={selectedLand.image_url || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600'} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                                <button onClick={() => setSelectedLand(null)} className="absolute top-5 right-5 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/40 transition-all text-white border border-white/30">
                                    <X className="w-5 h-5" />
                                </button>
                                <div className="absolute bottom-5 left-6 right-6 text-white">
                                    <h3 className="text-2xl font-extrabold tracking-tight mb-1">{selectedLand.title}</h3>
                                    <div className="flex items-center gap-2 text-white/80 text-sm font-medium">
                                        <MapPin className="w-3.5 h-3.5" /> {selectedLand.location}
                                    </div>
                                </div>
                            </div>
                            <div className="p-8 overflow-y-auto">
                                <div className="grid grid-cols-3 gap-3 mb-8">
                                    <div className="bg-slate-50 p-4 rounded-2xl text-center border border-slate-100">
                                        <div className="text-xs text-slate-500 font-bold uppercase mb-1">Area</div>
                                        <div className="text-lg font-extrabold text-slate-900">{selectedLand.total_area} {selectedLand.area_unit}</div>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-2xl text-center border border-slate-100">
                                        <div className="text-xs text-slate-500 font-bold uppercase mb-1">Soil</div>
                                        <div className="text-lg font-extrabold text-slate-900">{selectedLand.land_type}</div>
                                    </div>
                                    <div className="bg-emerald-50 p-4 rounded-2xl text-center border border-emerald-100">
                                        <div className="text-xs text-emerald-600 font-bold uppercase mb-1">Price</div>
                                        <div className="text-lg font-extrabold text-emerald-700">₹{selectedLand.rental_price?.toLocaleString()}</div>
                                    </div>
                                </div>
                                {selectedLand.description && (
                                    <div className="mb-8">
                                        <h4 className="font-bold text-xs text-slate-500 uppercase tracking-widest mb-3">Description</h4>
                                        <p className="text-slate-600 leading-relaxed">{selectedLand.description}</p>
                                    </div>
                                )}
                                {selectedLand.owner_name && (
                                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 mb-8">
                                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                                            {selectedLand.owner_name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-900">{selectedLand.owner_name}</div>
                                            <div className="text-xs text-slate-500 font-medium">Landowner</div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-slate-300 ml-auto" />
                                    </div>
                                )}
                                <div className="flex gap-3">
                                    <Button variant="outline" className="flex-1 rounded-2xl h-13 font-bold" onClick={() => setSelectedLand(null)}>Close</Button>
                                    <Button variant="premium" className="flex-1 rounded-2xl h-13 font-bold">Book Land</Button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Lands;
