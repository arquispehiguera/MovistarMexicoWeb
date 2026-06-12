/**
 * Configuración centralizada de Lucide Icons
 *
 * Todos los íconos del proyecto se importan aquí para:
 * - Mantener consistencia visual
 * - Tree-shaking automático (solo se empaquetan los usados)
 * - Facilitar mantenimiento y actualizaciones
 *
 * IMPORTANTE: Solo agregar los íconos que realmente se usan en el proyecto
 */

import {
  // Navegación
  Menu,
  Trash2,
  X,
  ArrowLeft,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  ChevronDown,

  // Acciones
  Check,
  Search,
  Plus,
  Edit,
  Download,
  FileText,
  Eye,
  View,
  RefreshCw,

  // Dashboard
  TrendingUp,
  ShoppingCart,
  Target,
  Phone,
  CheckCircle,
  BarChart2,
  CalendarX2,

  // Usuario y Roles
  User,
  Users,
  LogOut,
  Settings,
  ShieldCheck,
  UserPen,

  // Calendario y Tiempo
  Calendar,
  Clock,

  // Comunicación
  Bell,
  MessageCircle,
  Megaphone,
  CheckCheck,
  Inbox,
  Loader2,
  Send,
  History,
  PlusCircle,
  BarChart3,
  EyeOff,

  // Ayuda
  HelpCircle,

  // Estados
  XCircle,

  //libros
  BookCheck,

  // Configuración
  Settings2,

  // Tipificación
  ClipboardList,
  Database,
} from 'lucide-angular';

/**
 * Íconos actualmente en uso en el proyecto
 */
export const APP_ICONS = {
  // Navegación
  Menu,              // Header - menú hamburguesa
  X,                 // Modal - botón cerrar
  LayoutDashboard,   // Sidebar - Dashboard
  ChevronLeft,       // Calendarios - paginación anterior
  ChevronRight,      // Calendarios - paginación siguiente
  ChevronDown,       // Calendarios - accordion collapse
  ArrowLeft,         // Tipificación - volver al paso anterior

  // Acciones
  Check,             // Header - checkmarks en menú de posiciones
  Search,            // Usuarios, Calendarios - búsqueda
  Plus,              // Usuarios - nuevo usuario
  Edit,              // Usuarios, Calendarios - editar
  Download,          // Usuarios - exportar CSV
  FileText,          // Usuarios, Calendarios - exportar PDF / documentos
  Eye,               // Ventas Registradas - ver detalles
  View,              // Ventas Registradas - ver detalles
  RefreshCw,         // Dashboard - actualizar datos

  // Dashboard
  TrendingUp,        // Dashboard - tendencia ventas
  ShoppingCart,      // Dashboard - ventas
  Target,            // Dashboard - métricas de conversión
  Phone,
  CheckCircle,
  BarChart2,
  CalendarX2,        // Dashboard - empty state periodo

  // Usuario y Roles
  User,              // Header - ícono de perfil
  Users,             // Sidebar - Usuarios
  LogOut,            // Header - logout
  Settings,          // Header - configuración de notificaciones
  ShieldCheck,       // Sidebar - Roles
  UserPen,           // Sidebar - Usuarios
  // Calendario y Tiempo
  Calendar,
  Clock,
  // Comunicación
  Bell,              // Header - notificaciones
  MessageCircle,     // Header - mensajes
  Megaphone,         // Header - crear comunicado
  CheckCheck,        // Notificaciones - marcar todas leídas
  Inbox,             // Notificaciones - estado vacío
  Loader2,           // Loading spinner
  Send,              // Enviar comunicado
  History,           // Historial de comunicados
  PlusCircle,        // Nuevo comunicado tab
  BarChart3,         // Estadísticas
  EyeOff,            // No leídos

  // Ayuda
  HelpCircle,        // Header - menú de ayuda

  // Estados
  XCircle,

  // Libros
  BookCheck,

  // Configuración
  Settings2,

  // Tipificación
  ClipboardList,
  Database,

  // Eliminar
  Trash2
};


export type AppIconName = keyof typeof APP_ICONS;
