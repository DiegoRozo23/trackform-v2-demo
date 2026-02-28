import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

// Types
export type FieldType = 'checklist' | 'text' | 'camera' | 'date' | 'number';

export interface FormField {
    id: string;
    type: FieldType;
    label: string;
    required: boolean;
}

export interface FormTemplate {
    id: string;
    name: string;
    machineType: string;
    category: string;
    area: string;
    description: string;
    fields: FormField[];
    createdAt: string;
    version: number;
    active: boolean;
}

export interface Mantenimiento {
    id: string;
    templateId: string;
    machineName: string;
    operatorName: string;
    timestamp: string;
    status: 'Pendiente' | 'Completado' | 'En Progreso';
    answers: Record<string, any>;
    signature?: string;
    gps?: { lat: number, lng: number };
    hash?: string;
    category?: string;
    area?: string;
    offline?: boolean;
}

export interface Tenant {
    id: string;
    name: string;
    plan: 'Básico' | 'Profesional' | 'Enterprise';
    activeMachines: number;
    themeColor: string;
    logoUrl?: string;
}

export interface Machine {
    id: string;
    name: string;
    type: string;
    area: string;
    status: 'Activo' | 'Inactivo' | 'Mantenimiento';
    lastMaintenance?: string;
}

export interface User {
    id: string;
    name: string;
    role: 'Supervisor' | 'Técnico' | 'Administrador';
    email: string;
    avatar?: string;
}

interface DemoState {
    // Current Tenant Context (White-labeling)
    currentTenant: Tenant;
    setCurrentTenant: (tenant: Tenant) => void;
    updateTenantSettings: (settings: Partial<Tenant>) => void;

    // Form Templates
    templates: FormTemplate[];
    addTemplate: (template: Omit<FormTemplate, 'id' | 'createdAt'>) => void;
    updateTemplate: (id: string, template: Partial<Omit<FormTemplate, 'id' | 'createdAt'>>) => void;
    deleteTemplate: (id: string) => void;
    toggleTemplateStatus: (id: string) => void;

    // Executed Maintenances
    mantenimientos: Mantenimiento[];
    addMantenimiento: (mnt: Omit<Mantenimiento, 'id' | 'timestamp'>) => void;
    completeMantenimiento: (id: string, signature: string, answers: Record<string, any>) => void;

    // Machines CRUD
    machines: Machine[];
    addMachine: (machine: Omit<Machine, 'id'>) => void;
    updateMachine: (id: string, machine: Partial<Omit<Machine, 'id'>>) => void;
    deleteMachine: (id: string) => void;

    // Users CRUD
    users: User[];
    addUser: (user: Omit<User, 'id'>) => void;
    updateUser: (id: string, user: Partial<Omit<User, 'id'>>) => void;
    deleteUser: (id: string) => void;
}

// Initial Mock Data
const defaultTenant: Tenant = {
    id: 't-1',
    name: 'AMBATOVY Operations',
    plan: 'Enterprise',
    activeMachines: 142,
    themeColor: '#1976d2',
    logoUrl: '',
};

const defaultTemplates: FormTemplate[] = [
    {
        id: 'tpl-1',
        name: 'Inspección Rutinaria de Compresor',
        machineType: 'Compresor Industrial',
        category: 'Rotativos',
        area: 'Planta de Aire',
        description: 'Verificación de niveles y presión anual.',
        version: 1,
        active: true,
        createdAt: new Date().toISOString(),
        fields: [
            { id: 'f-1', type: 'checklist', label: '¿Niveles de aceite correctos?', required: true },
            { id: 'f-2', type: 'text', label: 'Presión actual (PSI)', required: true },
            { id: 'f-3', type: 'camera', label: 'Foto del manómetro', required: true }
        ]
    }
];

const defaultMantenimientos: Mantenimiento[] = [
    {
        id: 'mnt-0',
        templateId: 'tpl-1',
        machineName: 'Compresor A - Zona Norte',
        operatorName: 'Juan Pérez',
        timestamp: new Date(Date.now() - 30 * 86400000).toISOString(),
        status: 'Completado',
        answers: { 'f-1': true, 'f-2': '110 PSI', 'f-3': 'img_url' },
        signature: 'sig', gps: { lat: -34, lng: -58 }, hash: 'h1'
    },
    {
        id: 'mnt-0.1',
        templateId: 'tpl-1',
        machineName: 'Compresor A - Zona Norte',
        operatorName: 'Juan Pérez',
        timestamp: new Date(Date.now() - 25 * 86400000).toISOString(),
        status: 'Completado',
        answers: { 'f-1': false, 'f-2': '90 PSI', 'f-3': 'img_url' }, // Una falla detectada
        signature: 'sig', gps: { lat: -34, lng: -58 }, hash: 'h2'
    },
    {
        id: 'mnt-0.2',
        templateId: 'tpl-1',
        machineName: 'Compresor A - Zona Norte',
        operatorName: 'María Gómez',
        timestamp: new Date(Date.now() - 20 * 86400000).toISOString(),
        status: 'Completado',
        answers: { 'f-1': true, 'f-2': '115 PSI', 'f-3': 'img_url' }, // Recuperación
        signature: 'sig', gps: { lat: -34, lng: -58 }, hash: 'h3'
    },
    {
        id: 'mnt-0.3',
        templateId: 'tpl-1',
        machineName: 'Compresor A - Zona Norte',
        operatorName: 'Juan Pérez',
        timestamp: new Date(Date.now() - 15 * 86400000).toISOString(),
        status: 'Completado',
        answers: { 'f-1': true, 'f-2': '112 PSI', 'f-3': 'img_url' },
        signature: 'sig', gps: { lat: -34, lng: -58 }, hash: 'h4'
    },
    {
        id: 'mnt-0.4',
        templateId: 'tpl-1',
        machineName: 'Compresor A - Zona Norte',
        operatorName: 'Juan Pérez',
        timestamp: new Date(Date.now() - 10 * 86400000).toISOString(),
        status: 'Completado',
        answers: { 'f-1': false, 'f-2': '100 PSI', 'f-3': 'img_url' }, // Nueva falla
        signature: 'sig', gps: { lat: -34, lng: -58 }, hash: 'h5'
    },
    {
        id: 'mnt-0.5',
        templateId: 'tpl-1',
        machineName: 'Compresor A - Zona Norte',
        operatorName: 'María Gómez',
        timestamp: new Date(Date.now() - 5 * 86400000).toISOString(),
        status: 'Completado',
        answers: { 'f-1': true, 'f-2': '118 PSI', 'f-3': 'img_url' },
        signature: 'sig', gps: { lat: -34, lng: -58 }, hash: 'h6'
    },
    {
        id: 'mnt-1',
        templateId: 'tpl-1',
        machineName: 'Compresor A - Zona Norte',
        operatorName: 'Juan Pérez',
        timestamp: new Date(Date.now() - 1 * 86400000).toISOString(),
        status: 'Completado',
        answers: { 'f-1': true, 'f-2': '115 PSI', 'f-3': 'img_url' },
        signature: 'mock_signature_data',
        gps: { lat: -34.6037, lng: -58.3816 },
        hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
    },
    {
        id: 'mnt-2',
        templateId: 'tpl-1',
        machineName: 'Compresor B - Zona Sur',
        operatorName: 'María Gómez',
        timestamp: new Date().toISOString(),
        status: 'Pendiente',
        answers: {},
    }
];

const defaultMachines: Machine[] = [
    { id: 'm-1', name: 'Compresor A - Zona Norte', type: 'Compresor Industrial', area: 'Planta de Aire', status: 'Activo', lastMaintenance: new Date(Date.now() - 1 * 86400000).toISOString() },
    { id: 'm-2', name: 'Compresor B - Zona Sur', type: 'Compresor Industrial', area: 'Planta de Aire', status: 'Mantenimiento', lastMaintenance: new Date().toISOString() },
    { id: 'm-3', name: 'Montacargas T-800', type: 'Vehículo Industrial', area: 'Almacén Central', status: 'Activo', lastMaintenance: new Date(Date.now() - 20 * 86400000).toISOString() },
];

const defaultUsers: User[] = [
    { id: 'u-1', name: 'Juan Pérez', role: 'Técnico', email: 'juan.perez@ambatovy.mg' },
    { id: 'u-2', name: 'María Gómez', role: 'Técnico', email: 'maria.gomez@ambatovy.mg' },
    { id: 'u-3', name: 'Carlos Admin', role: 'Supervisor', email: 'carlos.admin@ambatovy.mg' },
];

export const useDemoStore = create<DemoState>((set) => ({
    currentTenant: defaultTenant,
    setCurrentTenant: (tenant) => set({ currentTenant: tenant }),
    updateTenantSettings: (settings) => set((state) => ({
        currentTenant: { ...state.currentTenant, ...settings }
    })),

    templates: defaultTemplates,
    addTemplate: (template) => set((state) => ({
        templates: [...state.templates, {
            ...template,
            id: uuidv4(),
            createdAt: new Date().toISOString(),
            version: 1,
            active: true
        }]
    })),
    updateTemplate: (id, template) => set((state) => ({
        templates: state.templates.map(t => t.id === id ? { ...t, ...template, version: t.version + 1 } : t)
    })),
    deleteTemplate: (id) => set((state) => ({
        templates: state.templates.filter(t => t.id !== id)
    })),
    toggleTemplateStatus: (id) => set((state) => ({
        templates: state.templates.map(t => t.id === id ? { ...t, active: !t.active } : t)
    })),

    mantenimientos: defaultMantenimientos,
    addMantenimiento: (mnt) => set((state) => ({
        mantenimientos: [{
            ...mnt,
            id: uuidv4(),
            timestamp: new Date().toISOString()
        }, ...state.mantenimientos]
    })),
    completeMantenimiento: (id, signature, answers) => set((state) => ({
        mantenimientos: state.mantenimientos.map(m =>
            m.id === id
                ? {
                    ...m,
                    status: 'Completado',
                    signature,
                    answers,
                    gps: { lat: (Math.random() * 180 - 90), lng: (Math.random() * 360 - 180) },
                    hash: uuidv4(), // Mock hash
                    timestamp: new Date().toISOString()
                }
                : m
        )
    })),

    // Machines CRUD Implementation
    machines: defaultMachines,
    addMachine: (machine) => set((state) => ({
        machines: [...state.machines, { ...machine, id: uuidv4() }]
    })),
    updateMachine: (id, machine) => set((state) => ({
        machines: state.machines.map(m => m.id === id ? { ...m, ...machine } : m)
    })),
    deleteMachine: (id) => set((state) => ({
        machines: state.machines.filter(m => m.id !== id)
    })),

    // Users CRUD Implementation
    users: defaultUsers,
    addUser: (user) => set((state) => ({
        users: [...state.users, { ...user, id: uuidv4() }]
    })),
    updateUser: (id, user) => set((state) => ({
        users: state.users.map(u => u.id === id ? { ...u, ...user } : u)
    })),
    deleteUser: (id) => set((state) => ({
        users: state.users.filter(u => u.id !== id)
    }))
}));
