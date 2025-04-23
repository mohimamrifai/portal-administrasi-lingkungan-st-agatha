import { MenuItem } from '@/types/menu'

import {
    LayoutDashboard,
    FileText,
    Users,
    Settings,
    LogOut,
    ClipboardCheck,
    History,
    Home,
    Banknote,
    Trash2,
} from 'lucide-react'

export const navMain: Record<string, MenuItem[]> = {
    SuperUser: [
        { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        {
            label: 'Lingkungan',
            icon: Home,
            children: [
                { label: 'Kas Lingkungan', path: '/lingkungan/kas' },
                { label: 'Dana Mandiri', path: '/lingkungan/mandiri' },
            ],
        },
        { 
            label: 'IKATA', 
            icon: Banknote,
            children: [
                { label: 'Kas IKATA', path: '/ikata/kas' },
                { label: 'Monitoring Penunggak', path: '/ikata/monitoring' },
            ],
        },
        {
            label: 'Kesekretariatan',
            icon: Users,
            children: [
                { label: 'Data Umat', path: '/kesekretariatan/umat' },
                { label: 'Doa Lingkungan', path: '/kesekretariatan/doling' },
                { label: 'Agenda', path: '/kesekretariatan/agenda' },
            ],
        },
        { label: 'Publikasi', path: '/publikasi', icon: FileText },
        { label: 'Approval', path: '/approval', icon: ClipboardCheck },
        { label: 'Histori Pembayaran', path: '/histori', icon: History },
        {
            label: 'Pengaturan',
            icon: Settings,
            children: [
                { label: 'Profil', path: '/pengaturan/profil' },
                { label: 'Ganti Password', path: '/pengaturan/password' },
                { label: 'Wipe Data', path: '/pengaturan/wipe', icon: Trash2 },
            ],
        },
        { label: 'Log Out', path: '/logout', icon: LogOut },
    ],

    Ketua: [
        { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        {
            label: 'Lingkungan',
            icon: Home,
            children: [
                { label: 'Kas Lingkungan', path: '/lingkungan/kas' },
                { label: 'Dana Mandiri', path: '/lingkungan/mandiri' },
            ],
        },
        { 
            label: 'IKATA', 
            icon: Banknote,
            children: [
                { label: 'Kas IKATA', path: '/ikata/kas' },
                { label: 'Monitoring Penunggak', path: '/ikata/monitoring' },
            ],
        },
        {
            label: 'Kesekretariatan',
            icon: Users,
            children: [
                { label: 'Data Umat', path: '/kesekretariatan/umat' },
                { label: 'Doa Lingkungan', path: '/kesekretariatan/doling' },
                { label: 'Agenda', path: '/kesekretariatan/agenda' },
            ],
        },
        { label: 'Publikasi', path: '/publikasi', icon: FileText },
        { label: 'Histori Pembayaran', path: '/histori', icon: History },
        {
            label: 'Pengaturan',
            icon: Settings,
            children: [{ label: 'Ganti Password', path: '/pengaturan/password' }],
        },
        { label: 'Log Out', path: '/logout', icon: LogOut },
    ],

    WakilKetua: [
        { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        {
            label: 'Lingkungan',
            icon: Home,
            children: [
                { label: 'Kas Lingkungan', path: '/lingkungan/kas' },
                { label: 'Dana Mandiri', path: '/lingkungan/mandiri' },
            ],
        },
        { 
            label: 'IKATA', 
            icon: Banknote,
            children: [
                { label: 'Kas IKATA', path: '/ikata/kas' },
                { label: 'Monitoring Penunggak', path: '/ikata/monitoring' },
            ],
        },
        {
            label: 'Kesekretariatan',
            icon: Users,
            children: [
                { label: 'Data Umat', path: '/kesekretariatan/umat' },
                { label: 'Doa Lingkungan', path: '/kesekretariatan/doling' },
                { label: 'Agenda', path: '/kesekretariatan/agenda' },
            ],
        },
        { label: 'Publikasi', path: '/publikasi', icon: FileText },
        { label: 'Histori Pembayaran', path: '/histori', icon: History },
        {
            label: 'Pengaturan',
            icon: Settings,
            children: [{ label: 'Ganti Password', path: '/pengaturan/password' }],
        },
        { label: 'Log Out', path: '/logout', icon: LogOut },
    ],

    Sekretaris: [
        { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        {
            label: 'Kesekretariatan',
            icon: Users,
            children: [
                { label: 'Data Umat', path: '/kesekretariatan/umat' },
                { label: 'Doa Lingkungan', path: '/kesekretariatan/doling' },
                { label: 'Agenda', path: '/kesekretariatan/agenda' },
            ],
        },
        { label: 'Publikasi', path: '/publikasi', icon: FileText },
        { label: 'Histori Pembayaran', path: '/histori', icon: History },
        {
            label: 'Pengaturan',
            icon: Settings,
            children: [{ label: 'Ganti Password', path: '/pengaturan/password' }],
        },
        { label: 'Log Out', path: '/logout', icon: LogOut },
    ],

    WakilSekretaris: [
        { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        {
            label: 'Kesekretariatan',
            icon: Users,
            children: [
                { label: 'Data Umat', path: '/kesekretariatan/umat' },
                { label: 'Doa Lingkungan', path: '/kesekretariatan/doling' },
                { label: 'Agenda', path: '/kesekretariatan/agenda' },
            ],
        },
        {
            label: 'Publikasi',
            icon: FileText,
            path: '/publikasi',
        },
        { label: 'Histori Pembayaran', path: '/histori', icon: History },
        {
            label: 'Pengaturan',
            icon: Settings,
            children: [{ label: 'Ganti Password', path: '/pengaturan/password' }],
        },
        { label: 'Log Out', path: '/logout', icon: LogOut },
    ],

    Bendahara: [
        { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        {
            label: 'Lingkungan',
            icon: Home,
            children: [
                { label: 'Kas Lingkungan', path: '/lingkungan/kas' },
                { label: 'Dana Mandiri', path: '/lingkungan/mandiri' },
            ],
        },
        { 
            label: 'IKATA', 
            icon: Banknote,
            children: [
                { label: 'Kas IKATA', path: '/ikata/kas' },
                { label: 'Monitoring Penunggak', path: '/ikata/monitoring' },
            ],
        },
        { label: 'Approval', path: '/approval', icon: ClipboardCheck },
        {
            label: 'Kesekretariatan',
            icon: Users,
            children: [
                { label: 'Data Umat', path: '/kesekretariatan/umat' },
                { label: 'Agenda', path: '/kesekretariatan/agenda' },
            ],
        },
        { label: 'Histori Pembayaran', path: '/histori', icon: History },
        {
            label: 'Pengaturan',
            icon: Settings,
            children: [{ label: 'Ganti Password', path: '/pengaturan/password' }],
        },
        { label: 'Log Out', path: '/logout', icon: LogOut },
    ],

    WakilBendahara: [
        { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        {
            label: 'Lingkungan',
            icon: Home,
            children: [
                { label: 'Kas Lingkungan', path: '/lingkungan/kas' },
                { label: 'Dana Mandiri', path: '/lingkungan/mandiri' },
            ],
        },
        { 
            label: 'IKATA', 
            icon: Banknote,
            children: [
                { label: 'Kas IKATA', path: '/ikata/kas' },
                { label: 'Monitoring Penunggak', path: '/ikata/monitoring' },
            ],
        },
        {
            label: 'Kesekretariatan',
            icon: Users,
            children: [
                { label: 'Data Umat', path: '/kesekretariatan/umat' },
                { label: 'Agenda', path: '/kesekretariatan/agenda' },
            ],
        },
        { label: 'Histori Pembayaran', path: '/histori', icon: History },
        {
            label: 'Pengaturan',
            icon: Settings,
            children: [{ label: 'Ganti Password', path: '/pengaturan/password' }],
        },
        { label: 'Log Out', path: '/logout', icon: LogOut },
    ],

    Umat: [
        { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        {
            label: 'Publikasi',
            icon: FileText,
            path: '/publikasi',
        },
        { label: 'Histori Pembayaran', path: '/histori', icon: History },
        {
            label: 'Kesekretariatan',
            icon: Users,
            children: [
                { label: 'Doa Lingkungan', path: '/kesekretariatan/doling' },
                { label: 'Agenda', path: '/kesekretariatan/agenda' },
            ],
        },
        {
            label: 'Pengaturan',
            icon: Settings,
            children: [
                { label: 'Profil', path: '/pengaturan/profil' },
                { label: 'Ganti Password', path: '/pengaturan/password' },
            ],
        },
        { label: 'Log Out', path: '/logout', icon: LogOut },
    ],
}