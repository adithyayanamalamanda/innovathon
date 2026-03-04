import React, { useState, useEffect } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts';
import {
    LayoutDashboard,
    TrendingUp,
    CloudSun,
    Sprout,
    ArrowUpRight,
    ArrowDownRight,
    Zap,
    BookOpen,
    Calendar
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { useLanguage } from '@/i18n/LanguageContext';

const Dashboard = () => {
    const { t } = useLanguage();
    
    const [stats, setStats] = useState({
        totalEarnings: '₹45,200',
        activeBookings: 12,
        completionRate: '94%',
        pendingActions: 3
    });

    const soilData = [
        { name: 'Loamy', value: 45 },
        { name: 'Clay', value: 25 },
        { name: 'Sandy', value: 20 },
        { name: 'Others', value: 10 },
    ];

    const bookingTrends = [
        { month: 'Jan', bookings: 45 },
        { month: 'Feb', bookings: 52 },
        { month: 'Mar', bookings: 78 },
        { month: 'Apr', bookings: 40 },
        { month: 'May', bookings: 95 },
        { month: 'Jun', bookings: 110 },
    ];

    const COLORS = ['#059669', '#10b981', '#34d399', '#6ee7b7'];

    return (
        <div className="container mx-auto px-4 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{t('dashboard.title')}</h1>
                    <p className="text-slate-500">{t('dashboard.subtitle')}</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-xl">
                        <Calendar className="w-4 h-4 mr-2" />
                        {t('dashboard.schedule')}
                    </Button>
                    <Button variant="premium">
                        <Zap className="w-4 h-4 mr-2" />
                        {t('dashboard.aiAdvisor')}
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatCard
                    label={t('dashboard.totalEarnings')}
                    value={stats.totalEarnings}
                    trend={t('dashboard.fromLastMonth')}
                    up={true}
                    icon={TrendingUp}
                />
                <StatCard
                    label={t('dashboard.activeBookings')}
                    value={stats.activeBookings}
                    trend={t('dashboard.newToday')}
                    up={true}
                    icon={Calendar}
                />
                <StatCard
                    label={t('dashboard.completionRate')}
                    value={stats.completionRate}
                    trend={t('dashboard.fromLastSeason')}
                    up={false}
                    icon={Sprout}
                />
                <StatCard
                    label={t('dashboard.systemHealth')}
                    value={t('dashboard.optimal')}
                    trend={t('dashboard.allSystemsOnline')}
                    up={true}
                    icon={Zap}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                {/* Main Chart */}
                <Card className="lg:col-span-2 shadow-sm">
                    <CardHeader>
                        <CardTitle>{t('dashboard.bookingTrends')}</CardTitle>
                        <CardDescription>{t('dashboard.bookingTrendsDesc')}</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={bookingTrends}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dx={-10} />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="bookings" fill="#059669" radius={[6, 6, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Soil Distribution Pie */}
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle>{t('dashboard.regionalSoilTypes')}</CardTitle>
                        <CardDescription>{t('dashboard.basedOnListings')}</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] flex flex-col items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={soilData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {soilData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Weather card */}
                <Card className="shadow-sm border-l-4 border-l-primary overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div>
                            <CardTitle>{t('dashboard.smartWeather')}</CardTitle>
                            <CardDescription>{t('dashboard.aiPoweredAdvice')}</CardDescription>
                        </div>
                        <CloudSun className="w-8 h-8 text-primary" />
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="bg-slate-50 p-6 rounded-2xl mb-6">
                            <h4 className="font-bold text-slate-900 mb-2">{t('dashboard.optimalHarvestWindow')}</h4>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                {t('dashboard.harvestAdvice')}
                            </p>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="p-4 rounded-xl border border-slate-100 bg-white shadow-sm">
                                <span className="block text-xs font-bold text-slate-400 uppercase mb-1">{t('dashboard.humidity')}</span>
                                <span className="text-lg font-bold text-slate-900">65%</span>
                            </div>
                            <div className="p-4 rounded-xl border border-slate-100 bg-white shadow-sm">
                                <span className="block text-xs font-bold text-slate-400 uppercase mb-1">{t('dashboard.visibility')}</span>
                                <span className="text-lg font-bold text-slate-900">10km</span>
                            </div>
                            <div className="p-4 rounded-xl border border-slate-100 bg-white shadow-sm">
                                <span className="block text-xs font-bold text-slate-400 uppercase mb-1">{t('dashboard.pressure')}</span>
                                <span className="text-lg font-bold text-slate-900">1012hPa</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Govt Schemes */}
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle>{t('dashboard.govtSchemes')}</CardTitle>
                        <CardDescription>{t('dashboard.recentlyAnnounced')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <SchemeItem
                                title={t('dashboard.pmKisan')}
                                desc={t('dashboard.pmKisanDesc')}
                                tag={t('dashboard.directBenefit')}
                            />
                            <SchemeItem
                                title={t('dashboard.soilHealth')}
                                desc={t('dashboard.soilHealthDesc')}
                                tag={t('dashboard.agriInput')}
                            />
                            <SchemeItem
                                title={t('dashboard.fasal')}
                                desc={t('dashboard.fasalDesc')}
                                tag={t('dashboard.insurance')}
                            />
                        </div>
                        <Button variant="ghost" className="w-full mt-6 text-primary font-bold">
                            {t('dashboard.viewAllSchemes')}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

const StatCard = ({ label, value, trend, up, icon: Icon }) => (
    <Card className="shadow-sm card-hover">
        <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-primary/10 text-primary rounded-xl">
                    <Icon className="w-5 h-5" />
                </div>
                {up ? (
                    <div className="flex items-center text-emerald-500 text-xs font-bold">
                        <ArrowUpRight className="w-3 h-3 mr-1" />
                        {trend}
                    </div>
                ) : (
                    <div className="flex items-center text-rose-500 text-xs font-bold">
                        <ArrowDownRight className="w-3 h-3 mr-1" />
                        {trend}
                    </div>
                )}
            </div>
            <div>
                <h4 className="text-slate-500 text-sm font-medium mb-1">{label}</h4>
                <span className="text-3xl font-bold text-slate-900">{value}</span>
            </div>
        </CardContent>
    </Card>
);

const SchemeItem = ({ title, desc, tag }) => (
    <div className="flex gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6" />
        </div>
        <div>
            <div className="flex items-center gap-2 mb-1">
                <h5 className="font-bold text-slate-900">{title}</h5>
                <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">{tag}</span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
        </div>
    </div>
);

export default Dashboard;
