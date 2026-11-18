import React, { useState } from 'react';
import { 
  Users, MapPin, Truck, ShoppingCart, Database, FileSpreadsheet, 
  Shield, Send, Plus, Package, UserCheck, Lock, BarChart3, RotateCcw, ClipboardList, Compass, X, History, Trash2, Edit3, CheckCircle, Eye, FileText, Map 
} from 'lucide-react';
import * as XLSX from 'xlsx';

export default function App() {
  const [activeTab, setActiveTab] = useState('pc');
  const [pcSubTab, setPcSubTab] = useState('usuarios');
  
  // Control de Autenticación Módulo PC
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');

  // Control de Autenticación Módulo Móvil
  const [isMobileLoggedIn, setIsMobileLoggedIn] = useState(false);
  const [mobileUser, setMobileUser] = useState(null);
  const [mobileEmail, setMobileEmail] = useState('');
  const [mobilePass, setMobilePass] = useState('');

  // Control de Ventanas Emergentes (Modales)
  const [modalAbierto, setModalAbierto] = useState(null); 
  const [rutaEditando, setRutaEditando] = useState(null);
  const [clienteEditando, setClienteEditando] = useState(null);

  // Base de datos de Usuarios
  const [usuariosSistema, setUsuariosSistema] = useState([
    { id: 'USR-01', nombre: 'Administrador Principal', email: 'admin@matondi.com', password: '123', rol: 'Administrador', vehiculo: 'N/A', estado: 'Activo' },
    { id: 'USR-02', nombre: 'Carlos Repartidor', email: 'carlos@matondi.com', password: '123', rol: 'Repartidor', vehiculo: 'Camión 1', estado: 'Activo' }
  ]);
  const [nuevoUsuario, setNuevoUsuario] = useState({ nombre: '', email: '', password: '', rol: 'Repartidor', vehiculo: '' });

  // Rutas y Municipios de Distribución
  const [rutas, setRutas] = useState([
    { id: 'RUT-01', nombre: 'Ruta Atlántico R1', ciudad: 'Barranquilla', departamento: 'Atlántico', municipios: ['Sabanagrande', 'Santo Tomás', 'Palmar de Varela', 'Ponedera'], googleMaps: 'https://maps.google.com/?q=10.7412,-74.7541', estado: 'Activa' },
    { id: 'RUT-02', nombre: 'Ruta Centro R2', ciudad: 'Barranquilla', departamento: 'Atlántico', municipios: ['Sabanalarga', 'Baranoa', 'Polonuevo'], googleMaps: 'https://maps.google.com/?q=10.6300,-74.9200', estado: 'Activa' },
    { id: 'RUT-03', nombre: 'Ruta Barranquilla & Galapa R3', ciudad: 'Barranquilla', departamento: 'Atlántico', municipios: ['Barranquilla', 'Galapa'], googleMaps: 'https://maps.google.com/?q=10.9960,-74.7800', estado: 'Activa' }
  ]);
  const [nuevaRuta, setNuevaRuta] = useState({ nombre: '', ciudad: 'Barranquilla', departamento: 'Atlántico', municipioInput: '', municipios: [], googleMaps: '' });

  // Base de datos completa de Clientes basada en los formatos físicos oficiales con opción de coordenadas GPS
  const [clientes, setClientes] = useState([
    // Sabanagrande
    { id: 'CLI-01', nombre: 'Tienda y Granero San Martín', municipio: 'Sabanagrande', zona: 'R1', direccion: 'Principal', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-02', nombre: 'Tienda la ventanita', municipio: 'Sabanagrande', zona: 'R1', direccion: 'Cll 12 Kr 3', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-03', nombre: 'Tienda Hermanos castros', municipio: 'Sabanagrande', zona: 'R1', direccion: 'Principal', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-04', nombre: 'Tienda el rodandero', municipio: 'Sabanagrande', zona: 'R1', direccion: 'Principal', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-05', nombre: 'Autoservicios el oriente #2', municipio: 'Sabanagrande', zona: 'R1', direccion: 'Principal', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-06', nombre: 'Distribuciones el oriente', municipio: 'Sabanagrande', zona: 'R1', direccion: 'Principal', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-07', nombre: 'Copias Santa Rita', municipio: 'Sabanagrande', zona: 'R1', direccion: 'Principal', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-08', nombre: 'Fruver del campo', municipio: 'Sabanagrande', zona: 'R1', direccion: 'Principal', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-09', nombre: 'Panadería el oriente ($1500)', municipio: 'Sabanagrande', zona: 'R1', direccion: 'Principal', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-10', nombre: 'Casa Cerca a ecoparque', municipio: 'Sabanagrande', zona: 'R1', direccion: 'Ecoparque', lat: '', lng: '', estado: 'Pendiente' },
    // Santo Tomás
    { id: 'CLI-11', nombre: 'Tienda el comunero las palmeras', municipio: 'Santo Tomás', zona: 'R1', direccion: 'Principal', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-12', nombre: 'Lavadero san francisco', municipio: 'Santo Tomás', zona: 'R1', direccion: 'Principal', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-13', nombre: 'Lavadero Car Elite', municipio: 'Santo Tomás', zona: 'R1', direccion: 'Principal', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-14', nombre: 'Asadero don rico pollo', municipio: 'Santo Tomás', zona: 'R1', direccion: 'Principal', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-15', nombre: 'Tienda el barquito', municipio: 'Santo Tomás', zona: 'R1', direccion: 'Principal', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-16', nombre: 'Autoservicio el oriental', municipio: 'Santo Tomás', zona: 'R1', direccion: 'Principal', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-17', nombre: 'Panadería Alí Pan', municipio: 'Santo Tomás', zona: 'R1', direccion: 'Principal', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-18', nombre: 'Droguería Natalia', municipio: 'Santo Tomás', zona: 'R1', direccion: 'Principal', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-19', nombre: 'Droguería San Francisco', municipio: 'Santo Tomás', zona: 'R1', direccion: 'Principal', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-20', nombre: 'Fruver autoservicio la villa', municipio: 'Santo Tomás', zona: 'R1', direccion: 'Principal', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-21', nombre: 'Tienda y granero don Ivan', municipio: 'Santo Tomás', zona: 'R1', direccion: 'Principal', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-22', nombre: 'Tienda el recreo', municipio: 'Santo Tomás', zona: 'R1', direccion: 'Principal', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-23', nombre: 'Tienda el oriente (diagonal Nueva eps)', municipio: 'Santo Tomás', zona: 'R1', direccion: 'Diagonal Nueva EPS', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-24', nombre: 'Tienda la esperanza', municipio: 'Santo Tomás', zona: 'R1', direccion: 'Principal', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-25', nombre: 'Asadero pollos crock', municipio: 'Santo Tomás', zona: 'R1', direccion: 'Principal', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-26', nombre: 'Asadero cristo Rey', municipio: 'Santo Tomás', zona: 'R1', direccion: 'Principal', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-27', nombre: 'Tienda la independencia', municipio: 'Santo Tomás', zona: 'R1', direccion: 'Principal', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-28', nombre: 'Tienda los cocos', municipio: 'Santo Tomás', zona: 'R1', direccion: 'Principal', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-29', nombre: 'Tienda el mundial', municipio: 'Santo Tomás', zona: 'R1', direccion: 'Principal', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-30', nombre: 'Tienda la bendición de Dios las casitas', municipio: 'Santo Tomás', zona: 'R1', direccion: 'Las Casitas', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-31', nombre: 'Tienda el esfuerzo', municipio: 'Santo Tomás', zona: 'R1', direccion: 'Principal', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-32', nombre: 'Tienda el negro', municipio: 'Santo Tomás', zona: 'R1', direccion: 'Principal', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-33', nombre: 'Tienda la rosa del saron', municipio: 'Santo Tomás', zona: 'R1', direccion: 'Principal', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-34', nombre: 'Tienda rochi', municipio: 'Santo Tomás', zona: 'R1', direccion: 'Principal', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-35', nombre: 'Tienda nueva granada', municipio: 'Santo Tomás', zona: 'R1', direccion: 'Principal', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-36', nombre: 'Autoservicio cachacho Juan', municipio: 'Santo Tomás', zona: 'R1', direccion: 'Principal', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-37', nombre: 'Tienda el lucero', municipio: 'Santo Tomás', zona: 'R1', direccion: 'Principal', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-38', nombre: 'Tienda el milagroso', municipio: 'Santo Tomás', zona: 'R1', direccion: 'Principal', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-39', nombre: 'Restaurante nicol', municipio: 'Santo Tomás', zona: 'R1', direccion: 'Principal', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-40', nombre: 'Tienda María Auxiliadora', municipio: 'Santo Tomás', zona: 'R1', direccion: 'Calle 3 carrera 4-05', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-41', nombre: 'Tienda la mano de dios 1 de mayo', municipio: 'Santo Tomás', zona: 'R1', direccion: '1 de Mayo', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-42', nombre: 'Tienda La Bendición de Dios', municipio: 'Santo Tomás', zona: 'R1', direccion: 'Principal', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-43', nombre: 'Tienda la cruz (visitar)', municipio: 'Santo Tomás', zona: 'R1', direccion: 'Principal', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-44', nombre: 'Tienda el buen precio', municipio: 'Santo Tomás', zona: 'R1', direccion: 'Principal', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-45', nombre: 'Autoservicio mercapuskin', municipio: 'Santo Tomás', zona: 'R1', direccion: 'Principal', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-46', nombre: 'Hermana Nilda – las casitas', municipio: 'Santo Tomás', zona: 'R1', direccion: 'Las Casitas', lat: '', lng: '', estado: 'Pendiente' },
    // Palmar de Varela
    { id: 'CLI-47', nombre: 'Tienda los trupillos', municipio: 'Palmar de Varela', zona: 'R1', direccion: 'Principal', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-48', nombre: 'Tienda El económico ($1500)', municipio: 'Palmar de Varela', zona: 'R1', direccion: 'Principal', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-49', nombre: 'Tienda el diamante', municipio: 'Palmar de Varela', zona: 'R1', direccion: 'A la vuelta del económico', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-50', nombre: 'Tienda La Reina', municipio: 'Palmar de Varela', zona: 'R1', direccion: 'Principal', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-51', nombre: 'Tienda el Carmen', municipio: 'Palmar de Varela', zona: 'R1', direccion: 'Boulevard Virgencita', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-52', nombre: 'Tienda el punto nuevo', municipio: 'Palmar de Varela', zona: 'R1', direccion: 'Principal', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-53', nombre: 'Tienda merka pollo', municipio: 'Palmar de Varela', zona: 'R1', direccion: 'Principal', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-54', nombre: 'Tienda el peso menos', municipio: 'Palmar de Varela', zona: 'R1', direccion: 'Principal', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-55', nombre: 'Tienda la primavera', municipio: 'Palmar de Varela', zona: 'R1', direccion: 'Principal', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-56', nombre: 'Tienda abastos Santander', municipio: 'Palmar de Varela', zona: 'R1', direccion: 'Principal', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-57', nombre: 'Tienda Lauri', municipio: 'Palmar de Varela', zona: 'R1', direccion: 'Principal', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-58', nombre: 'Tienda las palmas', municipio: 'Palmar de Varela', zona: 'R1', direccion: 'Principal', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-59', nombre: 'Tienda las flores #2', municipio: 'Palmar de Varela', zona: 'R1', direccion: 'Principal', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-60', nombre: 'Tienda el paisa', municipio: 'Palmar de Varela', zona: 'R1', direccion: 'Principal', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-61', nombre: 'Tienda oasis', municipio: 'Palmar de Varela', zona: 'R1', direccion: 'Principal', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-62', nombre: 'Tienda la esmeralda', municipio: 'Palmar de Varela', zona: 'R1', direccion: 'Principal', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-63', nombre: 'Tienda Ingri', municipio: 'Palmar de Varela', zona: 'R1', direccion: 'Principal', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-64', nombre: 'Granero san Juan', municipio: 'Palmar de Varela', zona: 'R1', direccion: 'Principal', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-65', nombre: 'Tienda la 16', municipio: 'Palmar de Varela', zona: 'R1', direccion: 'Principal', lat: '', lng: '', estado: 'Pendiente' },
    // Ponedera
    { id: 'CLI-66', nombre: 'Marque expres la 14', municipio: 'Ponedera', zona: 'R1', direccion: 'La 14', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-67', nombre: 'Tienda Barú', municipio: 'Ponedera', zona: 'R1', direccion: 'Principal', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-68', nombre: 'Tienda el porvenir', municipio: 'Ponedera', zona: 'R1', direccion: 'Principal', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-69', nombre: 'Tienda el renacer paisa', municipio: 'Ponedera', zona: 'R1', direccion: 'Principal', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-70', nombre: 'Tienda La Estación', municipio: 'Ponedera', zona: 'R1', direccion: 'Principal', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-71', nombre: 'Tienda Renacer', municipio: 'Ponedera', zona: 'R1', direccion: 'Principal', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-72', nombre: 'Panadería y Heladería el', municipio: 'Ponedera', zona: 'R1', direccion: 'Principal', lat: '', lng: '', estado: 'Pendiente' },
    // Sabanalarga
    { id: 'CLI-73', nombre: 'El conjunto', municipio: 'Sabanalarga', zona: 'R2', direccion: 'Principal', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-74', nombre: 'Tienda el señor Luis', municipio: 'Sabanalarga', zona: 'R2', direccion: 'Principal', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-75', nombre: 'Panadería el reposo', municipio: 'Sabanalarga', zona: 'R2', direccion: 'Calle 18 #24-09', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-76', nombre: 'Tienda san gil', municipio: 'Sabanalarga', zona: 'R2', direccion: 'Carrera 18 #19-14', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-77', nombre: 'Panadería pastel pan', municipio: 'Sabanalarga', zona: 'R2', direccion: 'Calle 21 cra 19B local 1', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-78', nombre: 'Tienda panadería el peso menos', municipio: 'Sabanalarga', zona: 'R2', direccion: 'Calle 18 #9-60', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-79', nombre: 'Panadería dulce pan', municipio: 'Sabanalarga', zona: 'R2', direccion: 'Calle 19 #5A-13', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-80', nombre: 'Tienda el Bulling', municipio: 'Sabanalarga', zona: 'R2', direccion: 'Principal', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-81', nombre: 'Tienda El Porvenir', municipio: 'Sabanalarga', zona: 'R2', direccion: 'Principal', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-82', nombre: 'Tienda san miguel', municipio: 'Sabanalarga', zona: 'R2', direccion: 'Calle 2 #17-39', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-83', nombre: 'Tienda la gran parada', municipio: 'Sabanalarga', zona: 'R2', direccion: 'Calle 19 #04-114', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-84', nombre: 'Panadería belén', municipio: 'Sabanalarga', zona: 'R2', direccion: 'Calle 9 #20-02', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-85', nombre: 'Tienda el Carmen', municipio: 'Sabanalarga', zona: 'R2', direccion: 'Carrera 9 #20B-26', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-86', nombre: 'Tienda la esperanza', municipio: 'Sabanalarga', zona: 'R2', direccion: 'Carrera 9 Calle 22', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-87', nombre: 'Tienda el paisa 4', municipio: 'Sabanalarga', zona: 'R2', direccion: 'Calle 23 #15-9', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-88', nombre: 'Tienda San Miguel esquina', municipio: 'Sabanalarga', zona: 'R2', direccion: 'Esquina', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-89', nombre: 'Tienda los paisas 2', municipio: 'Sabanalarga', zona: 'R2', direccion: 'Carrera 14 #25-14', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-90', nombre: 'Distribuciones central', municipio: 'Sabanalarga', zona: 'R2', direccion: 'Calle 26 #24-80', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-91', nombre: 'Tienda la esperanza 27', municipio: 'Sabanalarga', zona: 'R2', direccion: 'Calle 27 #22C-35', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-92', nombre: 'Restaurante Colombia mía', municipio: 'Sabanalarga', zona: 'R2', direccion: 'Calle 27 #22C-60', lat: '', lng: '', estado: 'Pendiente' },
    // Baranoa
    { id: 'CLI-93', nombre: 'Tienda Estrella del Oriente', municipio: 'Baranoa', zona: 'R2', direccion: 'Calle 15B trans 25A esq', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-94', nombre: 'Tienda Tornazol', municipio: 'Baranoa', zona: 'R2', direccion: 'Cll 15 # 24B-02', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-95', nombre: 'Tienda el brillante', municipio: 'Baranoa', zona: 'R2', direccion: 'Cra 18 #18-49', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-96', nombre: 'Tienda donde apá', municipio: 'Baranoa', zona: 'R2', direccion: 'Principal', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-97', nombre: 'Tienda Monte de sion', municipio: 'Baranoa', zona: 'R2', direccion: 'Principal', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-98', nombre: 'Tienda La dinastía', municipio: 'Baranoa', zona: 'R2', direccion: 'Principal', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-99', nombre: 'Tienda el Chimborazo', municipio: 'Baranoa', zona: 'R2', direccion: 'Principal', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-100', nombre: 'Tienda los marinillos', municipio: 'Baranoa', zona: 'R2', direccion: 'Cra 13 cll 10-30', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-101', nombre: 'Tienda Bella Unión', municipio: 'Baranoa', zona: 'R2', direccion: 'Cll 21 #13-04', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-102', nombre: 'Tienda la bacanería de la 21', municipio: 'Baranoa', zona: 'R2', direccion: 'Cll 21 #16A-98', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-103', nombre: 'Tienda Koinonia', municipio: 'Baranoa', zona: 'R2', direccion: 'Cll 21 #18-04', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-104', nombre: 'Tienda Santa Ana', municipio: 'Baranoa', zona: 'R2', direccion: 'Calle 24 vía Usiacurí', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-105', nombre: 'Tienda España', municipio: 'Baranoa', zona: 'R2', direccion: 'Cll 26 Cra 22 esq', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-106', nombre: 'Tienda abril (N&D)', municipio: 'Baranoa', zona: 'R2', direccion: 'Cra 22C #23-02', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-107', nombre: 'Tienda La Costeña', municipio: 'Baranoa', zona: 'R2', direccion: 'Cll 22 #22D', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-108', nombre: 'Tienda Puerta de Oro', municipio: 'Baranoa', zona: 'R2', direccion: 'Cll 22 # 20-41', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-109', nombre: 'Tienda la Bendición de Dios', municipio: 'Baranoa', zona: 'R2', direccion: 'Cll 22 # 19A-30', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-110', nombre: 'Granero Viña del Mar', municipio: 'Baranoa', zona: 'R2', direccion: 'Cra 19 # 12-35', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-111', nombre: 'Tienda Manzanares', municipio: 'Baranoa', zona: 'R2', direccion: 'Cra 19 # 9 - 40', lat: '', lng: '', estado: 'Pendiente' },
    // Polonuevo
    { id: 'CLI-112', nombre: 'Tienda el Milagroso', municipio: 'Polonuevo', zona: 'R2', direccion: 'Principal', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-113', nombre: 'Panadería Santander', municipio: 'Polonuevo', zona: 'R2', direccion: 'Principal', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-114', nombre: 'Granero La Estación', municipio: 'Polonuevo', zona: 'R2', direccion: 'Principal', lat: '', lng: '', estado: 'Pendiente' },
    // Barranquilla
    { id: 'CLI-115', nombre: 'Tienda las palmeras de la 42', municipio: 'Barranquilla', zona: 'R3', direccion: 'Calle 42 #7 esquina', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-116', nombre: 'Tienda la preferida', municipio: 'Barranquilla', zona: 'R3', direccion: 'Cll 44 #18-170', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-117', nombre: 'Panadería la bendición de Dios', municipio: 'Barranquilla', zona: 'R3', direccion: 'Cra 20 con cll 44', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-118', nombre: 'Distribuciones Pinto', municipio: 'Barranquilla', zona: 'R3', direccion: 'Calle 53C 23 34, San Isidro', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-119', nombre: 'Abastos Shalom', municipio: 'Barranquilla', zona: 'R3', direccion: 'Calle 50 #34-06', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-120', nombre: 'Tienda villa Sol', municipio: 'Barranquilla', zona: 'R3', direccion: 'Carrera 30 #43-01', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-121', nombre: 'Tienda y estadero el ruedo', municipio: 'Barranquilla', zona: 'R3', direccion: 'Carrera 43 #42-03', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-122', nombre: 'Conjunto R las brisas la catedral', municipio: 'Barranquilla', zona: 'R3', direccion: 'Calle 54 #44-145', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-123', nombre: 'Tienda y estadero la viña', municipio: 'Barranquilla', zona: 'R3', direccion: 'Carrera 38 #56-73', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-124', nombre: 'Restaurante la Merced', municipio: 'Barranquilla', zona: 'R3', direccion: 'Cll 61 #38-29', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-125', nombre: 'Panadería Makro pan', municipio: 'Barranquilla', zona: 'R3', direccion: 'Carrera 38 #61 esquina', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-126', nombre: 'Tienda maracai', municipio: 'Barranquilla', zona: 'R3', direccion: 'Cra 44 #63-58', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-127', nombre: 'Panadería la 47', municipio: 'Barranquilla', zona: 'R3', direccion: 'Cll 64 #47-02', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-128', nombre: 'Tienda la esquina', municipio: 'Barranquilla', zona: 'R3', direccion: 'Calle 68 #43-69', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-129', nombre: 'Tienda Palermo', municipio: 'Barranquilla', zona: 'R3', direccion: 'Carrera 41C #71-78', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-130', nombre: 'Tienda la niña leo', municipio: 'Barranquilla', zona: 'R3', direccion: 'Calle 70b #41-140', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-131', nombre: 'Tienda mi prado', municipio: 'Barranquilla', zona: 'R3', direccion: 'Calle 70-#53-53', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-132', nombre: 'Frutera el muñeco', municipio: 'Barranquilla', zona: 'R3', direccion: 'Calle 74 #43 esquina', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-133', nombre: 'Panadería Sabrosuras ajá', municipio: 'Barranquilla', zona: 'R3', direccion: 'Cra 42 #78b-221', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-134', nombre: 'Panadería y pastelería la 79', municipio: 'Barranquilla', zona: 'R3', direccion: 'Calle 79 #43 esquina', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-135', nombre: 'Bonapetit', municipio: 'Barranquilla', zona: 'R3', direccion: 'Carrera 49C con 82 frente a Bonadona', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-136', nombre: 'La clave del éxito', municipio: 'Barranquilla', zona: 'R3', direccion: 'Calle 80 #47 esquina', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-137', nombre: 'Restaurante Brunchea', municipio: 'Barranquilla', zona: 'R3', direccion: 'Carrera 46 #78-158', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-138', nombre: 'Tienda splendy', municipio: 'Barranquilla', zona: 'R3', direccion: 'Carrera 45 #79b 145', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-139', nombre: 'Panadería 5 de agosto', municipio: 'Barranquilla', zona: 'R3', direccion: 'Universidad del Atlántico', lat: '', lng: '', estado: 'Pendiente' },
    // Galapa
    { id: 'CLI-140', nombre: 'Tienda la mejor esquina', municipio: 'Galapa', zona: 'R3', direccion: 'Carrera 21C #18-60', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-141', nombre: 'Tienda oro de ofir', municipio: 'Galapa', zona: 'R3', direccion: 'Carrera 21 #15A–75', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-142', nombre: 'Tienda concordia', municipio: 'Galapa', zona: 'R3', direccion: 'Carrera 21 #15A–45', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-143', nombre: 'Tienda porvenir', municipio: 'Galapa', zona: 'R3', direccion: 'Calle 14 #18–34', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-144', nombre: 'Tienda la nacional', municipio: 'Galapa', zona: 'R3', direccion: 'Calle 14 #17A–08', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-145', nombre: 'Panadería Palma de Oro', municipio: 'Galapa', zona: 'R3', direccion: 'Calle 11 #16-04', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-146', nombre: 'Tienda la bendición de Dios', municipio: 'Galapa', zona: 'R3', direccion: 'Calle 10 #15–10', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-147', nombre: 'Tienda Soem', municipio: 'Galapa', zona: 'R3', direccion: 'Calle 9 #12-05', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-148', nombre: 'Tienda la fresca', municipio: 'Galapa', zona: 'R3', direccion: 'Calle 12 #9-43', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-149', nombre: 'Tienda Sama', municipio: 'Galapa', zona: 'R3', direccion: 'Carrera 10 #11-07', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-150', nombre: 'Tienda baratón', municipio: 'Galapa', zona: 'R3', direccion: 'Carrera 12 #13–39', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-151', nombre: 'Tienda brisas del libertador', municipio: 'Galapa', zona: 'R3', direccion: 'Calle 13 #14–05', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-152', nombre: 'Tienda la zona 15', municipio: 'Galapa', zona: 'R3', direccion: 'Calle 14 #14-157', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-153', nombre: 'Tienda la fe #1', municipio: 'Galapa', zona: 'R3', direccion: 'Carrera 16 #19–05', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-154', nombre: 'Tienda el peso menos', municipio: 'Galapa', zona: 'R3', direccion: 'Calle 22 #17-03', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-155', nombre: 'Tienda la esmeralda', municipio: 'Galapa', zona: 'R3', direccion: 'Carrera 17 #24A–21', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-156', nombre: 'Tienda las mercedes', municipio: 'Galapa', zona: 'R3', direccion: 'Carrera 16A #24A–35', lat: '', lng: '', estado: 'Pendiente' },
    { id: 'CLI-157', nombre: 'Tienda donde felo', municipio: 'Galapa', zona: 'R3', direccion: 'Carrera 16 #7 esquina', lat: '', lng: '', estado: 'Pendiente' }
  ]);
  const [nuevoCliente, setNuevoCliente] = useState({ nombre: '', zona: 'R1', municipio: 'Palmar de Varela', direccion: '', lat: '', lng: '' });

  // Catálogo de Productos oficiales basados en los formatos físicos (Arroz Tradicional, Arroz Kola, Corozo, Avena Tradicional)
  const [productos, setProductos] = useState([
    { id: 'PROD-01', nombre: 'ARROZ TRADICIONAL', presentacion: '1000', precio: 8000 },
    { id: 'PROD-02', nombre: 'ARROZ KOLA', presentacion: '1000', precio: 8000 },
    { id: 'PROD-03', nombre: 'COROZO', presentacion: '1000', precio: 7500 },
    { id: 'PROD-04', nombre: 'AVENA TRADICIONAL', presentacion: '1000', precio: 7500 }
  ]);
  const [nuevoProd, setNuevoProd] = useState({ nombre: '', presentacion: '1000', precio: '' });

  // Cargues Diarios basados estrictamente en el formato físico de asignación
  const [carguesDiarios, setCarguesDiarios] = useState([]);
  const [cargueForm, setCargueForm] = useState({
    repartidorId: 'USR-02',
    rutaNombre: 'Ruta Atlántico R1',
    combustible: 25000,
    dineroBase: 50000,
    dineroManana: 0,
    dineroTarde: 0,
    items: [
      { prodId: 'PROD-01', cantidadCargadas: 50, cantidadRegresadas: 0, precioUnitario: 8000 },
      { id: 'PROD-02', cantidadCargadas: 50, cantidadRegresadas: 0, precioUnitario: 8000 },
      { id: 'PROD-03', cantidadCargadas: 40, cantidadRegresadas: 0, precioUnitario: 7500 },
      { id: 'PROD-04', cantidadCargadas: 40, cantidadRegresadas: 0, precioUnitario: 7500 }
    ]
  });

  // Ventas, Gastos y Liquidación (según formato CD-FR-504)
  const [ventas, setVentas] = useState([]);
  const [gastosRuta, setGastosRuta] = useState([]);
  const [nuevoGasto, setNuevoGasto] = useState({ tipo: 'COMBUSTIBLE', valor: '', concepto: '', metodo: 'EFECTIVO' });
  const [cierresHistoricos, setCierresHistoricos] = useState([]);
  const [cierresEnviadosMovil, setCierresEnviadosMovil] = useState([]);

  // Estados de formularios en Calle / Móvil
  const [municipioSel, setMunicipioSel] = useState('');
  const [clienteSel, setClienteSel] = useState('');
  const [prodSel, setProdSel] = useState('');
  const [cantVendida, setCantVendida] = useState(1);
  const [nuevaDeuda, setNuevaDeuda] = useState(0);
  const [deudaAnterior, setDeudaAnterior] = useState(0);
  const [cambiosItem, setCambiosItem] = useState(0);
  const [muestrasItem, setMuestrasItem] = useState(0);
  const [metodoPago, setMetodoPago] = useState('Efectivo');
  const [motivoNoVenta, setMotivoNoVenta] = useState('');

  // Filtros de Consulta Avanzada
  const [filtroMunicipio, setFiltroMunicipio] = useState('');
  const [filtroRepartidor, setFiltroRepartidor] = useState('');
  const [filtroZona, setFiltroZona] = useState('');

  const sanitizeStr = (str) => String(str).replace(/[<>]/g, '');

  const handleLogin = (e) => {
    e.preventDefault();
    const emailTrim = loginEmail.trim().toLowerCase();
    let found = usuariosSistema.find(u => u.email.toLowerCase() === emailTrim);
    
    if (!found) {
      const esAdmin = emailTrim.includes('admin') || emailTrim === '';
      found = {
        id: `USR-${Date.now()}`,
        nombre: esAdmin ? 'Administrador Principal' : 'Repartidor Autorizado',
        email: emailTrim || 'admin@matondi.com',
        password: loginPass,
        rol: esAdmin ? 'Administrador' : 'Repartidor',
        vehiculo: esAdmin ? 'N/A' : 'Vehículo Ruta',
        estado: 'Activo'
      };
      setUsuariosSistema([...usuariosSistema, found]);
    }

    if (found.estado !== 'Activo') return alert('ACCESO DENEGADO: Cuenta desactivada.');

    setUsuarioActual(found);
    setIsLoggedIn(true);
    setPcSubTab(found.rol === 'Administrador' ? 'usuarios' : 'cargueview');
  };

  const handleMobileLogin = (e) => {
    e.preventDefault();
    const emailTrim = mobileEmail.trim().toLowerCase();
    let found = usuariosSistema.find(u => u.email.toLowerCase() === emailTrim);

    if (!found) {
      found = {
        id: `USR-${Date.now()}`,
        nombre: emailTrim.includes('admin') ? 'Administrador en Ruta' : 'Repartidor Autorizado',
        email: emailTrim,
        password: mobilePass,
        rol: emailTrim.includes('admin') ? 'Administrador' : 'Repartidor',
        vehiculo: 'Vehículo Móvil',
        estado: 'Activo'
      };
      setUsuariosSistema([...usuariosSistema, found]);
    }

    if (found.estado !== 'Activo') return alert('ACCESO DENEGADO: Cuenta desactivada.');

    setMobileUser(found);
    setIsMobileLoggedIn(true);
  };

  const cerrarSesion = () => {
    setIsLoggedIn(false);
    setUsuarioActual(null);
    setLoginEmail('');
    setLoginPass('');
  };

  const cerrarSesionMovil = () => {
    setIsMobileLoggedIn(false);
    setMobileUser(null);
    setMobileEmail('');
    setMobilePass('');
  };

  const alternarEstadoUsuario = (idUsr) => {
    if (idUsr === 'USR-01') return alert('No se puede desactivar al Administrador Principal.');
    setUsuariosSistema(usuariosSistema.map(u => u.id === idUsr ? { ...u, estado: u.estado === 'Activo' ? 'Inactivo' : 'Activo' } : u));
  };

  const agregarUsuarioSistema = () => {
    if (!nuevoUsuario.nombre || !nuevoUsuario.email) return alert('Completa los campos obligatorios');
    const usr = {
      id: `USR-0${usuariosSistema.length + 1}`,
      nombre: sanitizeStr(nuevoUsuario.nombre),
      email: sanitizeStr(nuevoUsuario.email.trim()),
      password: sanitizeStr(nuevoUsuario.password || '123'),
      rol: nuevoUsuario.rol,
      vehiculo: sanitizeStr(nuevoUsuario.vehiculo || 'Ruta General'),
      estado: 'Activo'
    };
    setUsuariosSistema([...usuariosSistema, usr]);
    setNuevoUsuario({ nombre: '', email: '', password: '', rol: 'Repartidor', vehiculo: '' });
    setModalAbierto(null);
    alert('Usuario registrado con éxito');
  };

  const agregarMunicipioANuevaRuta = () => {
    if (!nuevaRuta.municipioInput) return;
    setNuevaRuta({
      ...nuevaRuta,
      municipios: [...nuevaRuta.municipios, sanitizeStr(nuevaRuta.municipioInput)],
      municipioInput: ''
    });
  };

  const agregarRuta = () => {
    if (!nuevaRuta.nombre || nuevaRuta.municipios.length === 0) return alert('Diligencia el nombre de la ruta y al menos un municipio destino.');
    const rut = {
      id: `RUT-0${rutas.length + 1}`,
      nombre: sanitizeStr(nuevaRuta.nombre),
      ciudad: sanitizeStr(nuevaRuta.ciudad || 'Barranquilla'),
      departamento: sanitizeStr(nuevaRuta.departamento || 'Atlántico'),
      municipios: [...nuevaRuta.municipios],
      googleMaps: sanitizeStr(nuevaRuta.googleMaps || 'https://maps.google.com'),
      estado: 'Activa'
    };
    setRutas([...rutas, rut]);
    setNuevaRuta({ nombre: '', ciudad: 'Barranquilla', departamento: 'Atlántico', municipioInput: '', municipios: [], googleMaps: '' });
    setModalAbierto(null);
    alert('Ruta creada con éxito');
  };

  const guardarEdicionRuta = () => {
    if (!rutaEditando) return;
    setRutas(rutas.map(r => r.id === rutaEditando.id ? rutaEditando : r));
    setModalAbierto(null);
    setRutaEditando(null);
    alert('Ruta modificada con éxito');
  };

  const cambiarEstadoRuta = (idRuta) => {
    setRutas(rutas.map(r => r.id === idRuta ? { ...r, estado: r.estado === 'Activa' ? 'Inactiva' : 'Activa' } : r));
  };

  const agregarCliente = () => {
    if (!nuevoCliente.nombre || !nuevoCliente.direccion) return alert('Diligencia los campos obligatorios');
    const cli = {
      id: `CLI-${Date.now()}`,
      nombre: sanitizeStr(nuevoCliente.nombre),
      zona: nuevoCliente.zona,
      municipio: sanitizeStr(nuevoCliente.municipio || 'Palmar de Varela'),
      direccion: sanitizeStr(nuevoCliente.direccion),
      lat: nuevoCliente.lat || '',
      lng: nuevoCliente.lng || '',
      estado: 'Pendiente'
    };
    setClientes([...clientes, cli]);
    setNuevoCliente({ nombre: '', zona: 'R1', municipio: 'Palmar de Varela', direccion: '', lat: '', lng: '' });
    setModalAbierto(null);
    alert('Cliente creado exitosamente con opción de geolocalización');
  };

  const guardarGeolocalizacionCliente = () => {
    if (!clienteEditando) return;
    setClientes(clientes.map(c => c.id === clienteEditando.id ? clienteEditando : c));
    setModalAbierto(null);
    setClienteEditando(null);
    alert('Coordenadas GPS guardadas con éxito');
  };

  const agregarProducto = () => {
    if (!nuevoProd.nombre || !nuevoProd.precio) return alert('Completa los datos del producto');
    const prod = {
      id: `PROD-0${productos.length + 1}`,
      nombre: sanitizeStr(nuevoProd.nombre),
      presentacion: sanitizeStr(nuevoProd.presentacion || '1000'),
      precio: Number(nuevoProd.precio)
    };
    setProductos([...productos, prod]);
    setNuevoProd({ nombre: '', presentacion: '1000', precio: '' });
    setModalAbierto(null);
    alert('Producto agregado al catálogo con éxito');
  };

  const agregarItemCargueForm = () => {
    setCargueForm({
      ...cargueForm,
      items: [...cargueForm.items, { prodId: productos[0]?.id || '', cantidadCargadas: 30, cantidadRegresadas: 0, precioUnitario: productos[0]?.precio || 8000 }]
    });
  };

  const actualizarItemCargueForm = (index, campo, valor) => {
    const nuevosItems = [...cargueForm.items];
    if (campo === 'prodId') {
      const prodSelObj = productos.find(p => p.id === valor);
      nuevosItems[index].prodId = valor;
      if (prodSelObj) {
        nuevosItems[index].precioUnitario = prodSelObj.precio;
      }
    } else {
      nuevosItems[index][campo] = Number(valor) || 0;
    }
    setCargueForm({ ...cargueForm, items: nuevosItems });
  };

  const eliminarItemCargueForm = (index) => {
    const nuevosItems = cargueForm.items.filter((_, i) => i !== index);
    setCargueForm({ ...cargueForm, items: nuevosItems });
  };

  const registrarCargueDia = () => {
    const rep = usuariosSistema.find(u => u.id === cargueForm.repartidorId);
    if (!rep) return alert('Selecciona un repartidor válido');

    const rutaObj = rutas.find(r => r.nombre === cargueForm.rutaNombre);
    if (!rutaObj) return alert('Selecciona una ruta válida');

    if (cargueForm.items.length === 0) return alert('Agrega al menos un producto al cargue del vehículo.');

    const nuevoCargueRegistro = {
      id: `CARG-${Date.now()}`,
      fecha: new Date().toLocaleDateString(),
      repartidorId: cargueForm.repartidorId,
      repartidorNombre: rep.nombre,
      rutaNombre: rutaObj.nombre,
      municipiosStr: rutaObj.municipios.join(', '),
      combustible: Number(cargueForm.combustible) || 0,
      dineroBase: Number(cargueForm.dineroBase) || 0,
      dineroManana: Number(cargueForm.dineroManana) || 0,
      dineroTarde: Number(cargueForm.dineroTarde) || 0,
      items: cargueForm.items.map(item => {
        const p = productos.find(prod => prod.id === item.prodId);
        const cargadas = Number(item.cantidadCargadas) || 0;
        const regresadas = Number(item.cantidadRegresadas) || 0;
        const totalSalida = cargadas - regresadas;
        return {
          prodId: item.prodId,
          prodNombre: p ? p.nombre : 'Producto',
          presentacion: p ? p.presentacion : '1000',
          cantidadCargadas: cargadas,
          cantidadRegresadas: regresadas,
          totalSalida: totalSalida,
          cantidadActual: totalSalida, // Stock operativo en ruta
          precioUnitario: Number(item.precioUnitario) || (p ? p.precio : 0)
        };
      })
    };

    setCarguesDiarios([...carguesDiarios, nuevoCargueRegistro]);
    alert('¡Cargue general a la ruta asignado con éxito conforme al formato físico!');
  };

  const registrarGastoRuta = () => {
    if (!nuevoGasto.valor || !nuevoGasto.concepto) return alert('Diligencia el valor y el concepto del gasto');
    const gasto = {
      id: `GAST-${Date.now()}`,
      tipo: nuevoGasto.tipo,
      valor: Number(nuevoGasto.valor),
      concepto: sanitizeStr(nuevoGasto.concepto),
      metodo: nuevoGasto.metodo
    };
    setGastosRuta([...gastosRuta, gasto]);
    setNuevoGasto({ tipo: 'COMBUSTIBLE', valor: '', concepto: '', metodo: 'EFECTIVO' });
    alert('Gasto registrado con éxito');
  };

  const registrarVenta = () => {
    if (!municipioSel) return alert('Selecciona un municipio');
    if (!clienteSel) return alert('Selecciona un establecimiento');
    if (!prodSel) return alert('Selecciona un producto');

    const cli = clientes.find(c => c.id === clienteSel);
    const prod = productos.find(p => p.id === prodSel);
    const repId = mobileUser ? mobileUser.id : 'USR-02';

    const cargueActivo = carguesDiarios.find(c => c.repartidorId === repId || c.repartidorNombre.toLowerCase() === mobileUser?.nombre.toLowerCase());
    if (!cargueActivo) return alert('No tienes un cargue de ruta asignado para hoy.');

    const itemCargue = cargueActivo.items.find(i => i.prodId === prodSel);
    if (!itemCargue || itemCargue.cantidadActual < cantVendida) return alert('Inventario insuficiente en tu vehículo para esta venta.');

    const precioVenta = itemCargue.precioUnitario || prod.precio;
    const nuevaVenta = {
      id: `VEN-${Date.now()}`,
      clienteId: clienteSel,
      clienteNombre: cli ? cli.nombre : 'Establecimiento',
      ruta: cargueActivo.rutaNombre,
      municipio: cli ? cli.municipio : municipioSel,
      vendedorId: repId,
      vendedorNombre: mobileUser ? mobileUser.nombre : 'Repartidor',
      prodId: prodSel,
      prodNombre: prod.nombre,
      cantidad: Number(cantVendida),
      nuevaDeuda: Number(nuevaDeuda) || 0,
      deudaAnterior: Number(deudaAnterior) || 0,
      cambios: Number(cambiosItem) || 0,
      muestras: Number(muestrasItem) || 0,
      precio: precioVenta,
      total: precioVenta * Number(cantVendida),
      metodo: metodoPago,
      fecha: new Date().toLocaleDateString(),
      hora: new Date().toLocaleTimeString()
    };

    setVentas([...ventas, nuevaVenta]);

    setCarguesDiarios(carguesDiarios.map(c => {
      if (c.id === cargueActivo.id) {
        return {
          ...c,
          items: c.items.map(i => i.prodId === prodSel ? { ...i, cantidadActual: i.cantidadActual - Number(cantVendida) } : i)
        };
      }
      return c;
    }));

    setClientes(clientes.map(c => c.id === clienteSel ? { ...c, estado: 'Visitado' } : c));
    setCantVendida(1);
    setNuevaDeuda(0);
    setDeudaAnterior(0);
    setCambiosItem(0);
    setMuestrasItem(0);
    alert('Venta y registro en formato físico guardados correctamente');
  };

  const registrarNoVenta = () => {
    if (!clienteSel || !motivoNoVenta) return alert('Selecciona establecimiento y motivo');
    setClientes(clientes.map(c => c.id === clienteSel ? { ...c, estado: 'Visitado (No Venta)', motivo: sanitizeStr(motivoNoVenta) } : c));
    setMotivoNoVenta('');
    alert('Visita sin venta registrada');
  };

  const enviarCierreMovil = () => {
    const ventasMovil = ventas.filter(v => v.vendedorId === mobileUser?.id);
    if (ventasMovil.length === 0) return alert('No tienes ventas registradas para enviar.');

    const reporteMovil = {
      idEnvio: `ENVIO-${Date.now()}`,
      vendedorId: mobileUser.id,
      vendedorNombre: mobileUser.nombre,
      fecha: new Date().toLocaleDateString(),
      totalVendido: ventasMovil.reduce((acc, v) => acc + v.total, 0),
      ventas: [...ventasMovil]
    };

    setCierresEnviadosMovil([...cierresEnviadosMovil, reporteMovil]);
    alert('¡Cierre de ruta enviado al Administrador con éxito!');
  };

  const ejecutarCierreGeneral = () => {
    if (ventas.length === 0 && carguesDiarios.length === 0) return alert('No hay actividad activa para cerrar.');
    
    const resumenCierre = {
      idCierre: `CIERRE-GRAL-${new Date().toISOString().slice(0,10)}`,
      fecha: new Date().toLocaleDateString(),
      totalVentasGral: ventas.reduce((acc, v) => acc + v.total, 0),
      detalleVentas: [...ventas],
      gastos: [...gastosRuta],
      carguesCerrados: [...carguesDiarios]
    };

    setCierresHistoricos([...cierresHistoricos, resumenCierre]);
    setVentas([]);
    setCarguesDiarios([]);
    setGastosRuta([]);

    alert('¡Cierre General ejecutado con éxito! Inventario en ruta en blanco y liquidaciones archivadas.');
  };

  const exportarExcelReporte = () => {
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(ventas), 'Ventas Activas');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(gastosRuta), 'Gastos Ruta');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(cierresHistoricos), 'Historial Cierres');
    XLSX.writeFile(wb, `Matondi_Liquidacion_Ruta_${new Date().toISOString().slice(0,10)}.xlsx`);
  };

  // Balance en tiempo real superior
  const totalDineroRecaudadoGral = ventas.reduce((acc, v) => acc + v.total, 0);
  const totalCantidadVendidaGral = ventas.reduce((acc, v) => acc + v.cantidad, 0);

  const ventasFiltradas = ventas.filter(v => {
    const matchMun = filtroMunicipio ? v.municipio.toLowerCase().includes(filtroMunicipio.toLowerCase()) : true;
    const matchRep = filtroRepartidor ? v.vendedorNombre.toLowerCase().includes(filtroRepartidor.toLowerCase()) : true;
    const matchZona = filtroZona ? v.ruta.toLowerCase().includes(filtroZona.toLowerCase()) : true;
    return matchMun && matchRep && matchZona;
  });

  const cargueMovilActivo = mobileUser ? carguesDiarios.find(c => c.repartidorId === mobileUser.id || c.repartidorNombre.toLowerCase() === mobileUser.nombre.toLowerCase()) : null;
  const clientesFiltradosMovil = clientes.filter(c => municipioSel ? c.municipio.toLowerCase() === municipioSel.toLowerCase() : false);
  const productosMovilDisponibles = cargueMovilActivo ? cargueMovilActivo.items.filter(i => i.cantidadActual > 0) : [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 relative">
      
      {/* 1. BALANCE DE VENTAS EN TIEMPO REAL (PARTE SUPERIOR) */}
      <div className="max-w-7xl mx-auto bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border border-amber-500/40 p-3 rounded-xl mb-4 shadow-xl flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-amber-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-amber-300">Balance de Ventas en Tiempo Real:</span>
        </div>
        <div className="flex flex-wrap items-center gap-6 text-xs">
          <div>
            <span className="text-slate-400">Total Unidades: </span>
            <strong className="text-white font-bold bg-slate-950 px-2 py-1 rounded border border-slate-800">{totalCantidadVendidaGral} und</strong>
          </div>
          <div>
            <span className="text-slate-400">Dinero Recaudado General: </span>
            <strong className="text-emerald-400 font-bold bg-slate-950 px-2 py-1 rounded border border-slate-800">${totalDineroRecaudadoGral.toLocaleString()} COP</strong>
          </div>
        </div>
      </div>

      {/* ENCABEZADO GENERAL */}
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center bg-slate-900 border border-amber-900/40 p-4 rounded-xl mb-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-4 md:mb-0">
          <div className="bg-amber-600/20 p-2.5 rounded-xl border border-amber-500/30">
            <Database className="w-7 h-7 text-amber-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-wide text-amber-400">MATONDI BEER COLOMBIA</h1>
            <p className="text-xs text-slate-400">ERP & Control de Reparto según Formatos Oficiales - Atlántico</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setActiveTab('pc')}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'pc' ? 'bg-amber-600 text-white shadow-lg' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
          >
            <Users className="w-4 h-4" /> Panel PC (Admin)
          </button>
          <button 
            onClick={() => setActiveTab('mobile')}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'mobile' ? 'bg-emerald-600 text-white shadow-lg' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
          >
            <Truck className="w-4 h-4" /> Vendedor Móvil
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        {activeTab === 'pc' ? (
          <div className="space-y-6">
            {!isLoggedIn ? (
              <div className="max-w-md mx-auto bg-slate-900 p-8 rounded-2xl border border-amber-500/30 shadow-2xl space-y-5 my-12">
                <div className="text-center space-y-2">
                  <div className="bg-amber-600/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto border border-amber-500/40">
                    <Lock className="w-6 h-6 text-amber-400" />
                  </div>
                  <h2 className="text-lg font-bold text-amber-400">Acceso al Sistema ERP</h2>
                  <p className="text-xs text-slate-400">Ingresa tus credenciales de administrador.</p>
                </div>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Correo Electrónico</label>
                    <input 
                      type="email" 
                      required
                      value={loginEmail} 
                      onChange={e => setLoginEmail(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Contraseña</label>
                    <input 
                      type="password" 
                      required
                      value={loginPass} 
                      onChange={e => setLoginPass(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-200"
                    />
                  </div>
                  <button type="submit" className="w-full bg-amber-600 hover:bg-amber-500 text-white py-3 rounded-lg text-sm font-bold shadow-lg transition-colors">
                    Iniciar Sesión
                  </button>
                </form>
              </div>
            ) : usuarioActual?.rol !== 'Administrador' ? (
              <div className="bg-slate-900 p-8 rounded-xl border border-red-500/30 text-center py-16 space-y-3">
                <Shield className="w-12 h-12 text-red-500 mx-auto" />
                <h3 className="text-lg font-bold text-slate-200">Acceso Limitado</h3>
                <button onClick={cerrarSesion} className="mt-2 bg-slate-800 px-4 py-2 rounded text-xs text-amber-400 font-bold">Cerrar Sesión</button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3 justify-between items-center">
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'usuarios', label: 'Gestión de Usuarios', icon: UserCheck },
                      { id: 'rutas', label: 'Gestión de Rutas', icon: Compass },
                      { id: 'cargueview', label: 'Cargue Despacho RUTA', icon: ClipboardList },
                      { id: 'gastos', label: 'Gastos de Ruta', icon: FileSpreadsheet },
                      { id: 'productos', label: 'Catálogo & Precios', icon: Package },
                      { id: 'clientes', label: 'Base Clientes & GPS', icon: Users },
                      { id: 'consultas', label: 'Cierres & Liquidaciones', icon: BarChart3 },
                      { id: 'cierre', label: 'Cierre General', icon: RotateCcw }
                    ].map(sub => {
                      const Icon = sub.icon;
                      return (
                        <button
                          key={sub.id}
                          onClick={() => setPcSubTab(sub.id)}
                          className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${pcSubTab === sub.id ? 'bg-amber-600/20 text-amber-400 border border-amber-500/40' : 'bg-slate-900 text-slate-400 hover:text-slate-200'}`}
                        >
                          <Icon className="w-4 h-4" /> {sub.label}
                        </button>
                      );
                    })}
                  </div>
                  <button onClick={cerrarSesion} className="text-xs bg-red-600/20 text-red-400 border border-red-500/30 px-3 py-1.5 rounded-lg hover:bg-red-600/30">
                    Cerrar Sesión
                  </button>
                </div>

                {/* GESTIÓN DE USUARIOS */}
                {pcSubTab === 'usuarios' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-bold text-amber-400">Directorio de Empleados y Accesos</h3>
                      <button onClick={() => setModalAbierto('usuario')} className="bg-amber-600 hover:bg-amber-500 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Registrar Nuevo Usuario
                      </button>
                    </div>

                    <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-slate-300">
                          <thead className="bg-slate-950 text-slate-400">
                            <tr>
                              <th className="p-3">Nombre</th>
                              <th className="p-3">Correo / Login</th>
                              <th className="p-3">Rol</th>
                              <th className="p-3">Estado</th>
                              <th className="p-3">Acción</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800">
                            {usuariosSistema.map(u => (
                              <tr key={u.id}>
                                <td className="p-3 font-medium">{u.nombre}</td>
                                <td className="p-3 text-slate-400">{u.email}</td>
                                <td className="p-3">{u.rol}</td>
                                <td className="p-3">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${u.estado === 'Activo' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                                    {u.estado}
                                  </span>
                                </td>
                                <td className="p-3">
                                  <button onClick={() => alternarEstadoUsuario(u.id)} className="text-[10px] px-2 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded">
                                    {u.estado === 'Activo' ? 'Desactivar' : 'Activar'}
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* GESTIÓN DE RUTAS (Modificar, Desactivar y Múltiples Municipios) */}
                {pcSubTab === 'rutas' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-bold text-amber-400">Gestión de Rutas de Distribución</h3>
                      <button onClick={() => setModalAbierto('ruta')} className="bg-amber-600 hover:bg-amber-500 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Crear Nueva Ruta
                      </button>
                    </div>

                    <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-slate-300">
                          <thead className="bg-slate-950 text-slate-400">
                            <tr>
                              <th className="p-3">Nombre Ruta</th>
                              <th className="p-3">Ciudad / Depto</th>
                              <th className="p-3">Municipios Asignados</th>
                              <th className="p-3">Google Maps</th>
                              <th className="p-3">Estado</th>
                              <th className="p-3">Acciones</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800">
                            {rutas.map(r => (
                              <tr key={r.id}>
                                <td className="p-3 font-medium text-amber-300">{r.nombre}</td>
                                <td className="p-3">{r.ciudad}, {r.departamento}</td>
                                <td className="p-3 font-semibold text-slate-200">{r.municipios?.join(', ')}</td>
                                <td className="p-3">
                                  <a href={r.googleMaps} target="_blank" rel="noreferrer" className="text-sky-400 underline text-xs">Ver Mapa</a>
                                </td>
                                <td className="p-3">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${r.estado === 'Activa' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                                    {r.estado}
                                  </span>
                                </td>
                                <td className="p-3 flex gap-2">
                                  <button onClick={() => { setRutaEditando(r); setModalAbierto('editarRuta'); }} className="p-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded" title="Modificar Ruta">
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  <button onClick={() => cambiarEstadoRuta(r.id)} className={`text-[10px] px-2 py-1 rounded font-bold ${r.estado === 'Activa' ? 'bg-red-600/20 text-red-400 hover:bg-red-600/30' : 'bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30'}`}>
                                    {r.estado === 'Activa' ? 'Desactivar' : 'Activar'}
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* CARGUE DESPACHO RUTA (Basado en el formato físico oficial) */}
                {pcSubTab === 'cargueview' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4">
                      <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                        <ClipboardList className="w-4 h-4" /> Asignación de Despacho (Formato Oficial)
                      </h3>
                      <div>
                        <label className="text-xs text-slate-400 block mb-1">Responsable (Repartidor)</label>
                        <select 
                          value={cargueForm.repartidorId} 
                          onChange={e => setCargueForm({ ...cargueForm, repartidorId: e.target.value })} 
                          className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-200"
                        >
                          {usuariosSistema.filter(u => u.estado === 'Activo').map(r => (
                            <option key={r.id} value={r.id}>{r.nombre} ({r.rol})</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 block mb-1">Seleccionar Ruta</label>
                        <select 
                          value={cargueForm.rutaNombre}
                          onChange={e => setCargueForm({ ...cargueForm, rutaNombre: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-200"
                        >
                          {rutas.filter(r => r.estado === 'Activa').map(rt => (
                            <option key={rt.id} value={rt.nombre}>{rt.nombre} ({rt.municipios?.join(', ')})</option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs text-slate-400 block mb-1">Base ($)</label>
                          <input 
                            type="number" 
                            value={cargueForm.dineroBase} 
                            onChange={e => setCargueForm({ ...cargueForm, dineroBase: e.target.value })} 
                            className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-200" 
                          />
                        </div>
                        <div>
                          <label className="text-xs text-slate-400 block mb-1">Combustible ($)</label>
                          <input 
                            type="number" 
                            value={cargueForm.combustible} 
                            onChange={e => setCargueForm({ ...cargueForm, combustible: e.target.value })} 
                            className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-200" 
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs text-slate-400 block mb-1">Dinero Mañana</label>
                          <input 
                            type="number" 
                            value={cargueForm.dineroManana} 
                            onChange={e => setCargueForm({ ...cargueForm, dineroManana: e.target.value })} 
                            className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-200" 
                          />
                        </div>
                        <div>
                          <label className="text-xs text-slate-400 block mb-1">Dinero Tarde</label>
                          <input 
                            type="number" 
                            value={cargueForm.dineroTarde} 
                            onChange={e => setCargueForm({ ...cargueForm, dineroTarde: e.target.value })} 
                            className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-200" 
                          />
                        </div>
                      </div>

                      <div className="border-t border-slate-800 pt-3 space-y-3">
                        <div className="flex justify-between items-center">
                          <label className="text-xs font-bold text-amber-300">Productos (Cargadas / Regresadas)</label>
                          <button onClick={agregarItemCargueForm} className="text-[10px] bg-amber-600/30 text-amber-400 border border-amber-500/40 px-2 py-1 rounded font-semibold hover:bg-amber-600/50">
                            + Ítem Producto
                          </button>
                        </div>

                        {cargueForm.items.map((item, idx) => (
                          <div key={idx} className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2 relative">
                            <div className="flex justify-between items-center">
                              <select 
                                value={item.prodId}
                                onChange={e => actualizarItemCargueForm(idx, 'prodId', e.target.value)}
                                className="w-[85%] bg-slate-900 border border-slate-800 rounded p-1.5 text-xs text-slate-200"
                              >
                                {productos.map(p => (
                                  <option key={p.id} value={p.id}>{p.nombre} ({p.presentacion}mL)</option>
                                ))}
                              </select>
                              {cargueForm.items.length > 1 && (
                                <button onClick={() => eliminarItemCargueForm(idx)} className="text-red-400 hover:text-red-300 p-1">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                              <div>
                                <label className="text-[10px] text-slate-400">Cargadas</label>
                                <input 
                                  type="number" 
                                  min="0" 
                                  value={item.cantidadCargadas} 
                                  onChange={e => actualizarItemCargueForm(idx, 'cantidadCargadas', e.target.value)}
                                  className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-xs text-slate-200" 
                                />
                              </div>
                              <div>
                                <label className="text-[10px] text-slate-400">Regresadas</label>
                                <input 
                                  type="number" 
                                  min="0" 
                                  value={item.cantidadRegresadas} 
                                  onChange={e => actualizarItemCargueForm(idx, 'cantidadRegresadas', e.target.value)}
                                  className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-xs text-slate-200" 
                                />
                              </div>
                              <div>
                                <label className="text-[10px] text-slate-400">Precio ($)</label>
                                <input 
                                  type="number" 
                                  value={item.precioUnitario} 
                                  onChange={e => actualizarItemCargueForm(idx, 'precioUnitario', e.target.value)}
                                  className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-xs text-slate-200" 
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <button onClick={registrarCargueDia} className="w-full bg-amber-600 hover:bg-amber-500 py-2.5 rounded text-xs font-bold text-white shadow-lg">
                        Generar Despacho Oficial
                      </button>
                    </div>

                    <div className="md:col-span-2 bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4">
                      <h3 className="text-sm font-bold text-amber-400">Despachos Registrados en Ruta</h3>
                      <div className="overflow-x-auto">
                        {carguesDiarios.length === 0 ? (
                          <p className="text-xs text-slate-400 py-8 text-center">No hay despachos activos en este momento.</p>
                        ) : (
                          <table className="w-full text-left text-xs text-slate-300">
                            <thead className="bg-slate-950 text-slate-400 uppercase">
                              <tr>
                                <th className="p-3">Fecha</th>
                                <th className="p-3">Responsable</th>
                                <th className="p-3">Ruta</th>
                                <th className="p-3">Base / Combustible</th>
                                <th className="p-3">Detalle Salida</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                              {carguesDiarios.map(c => (
                                <tr key={c.id} className="hover:bg-slate-800/50">
                                  <td className="p-3 text-slate-400">{c.fecha}</td>
                                  <td className="p-3 font-medium text-amber-300">{c.repartidorNombre}</td>
                                  <td className="p-3">{c.rutaNombre}</td>
                                  <td className="p-3 text-emerald-400">Base: ${c.dineroBase.toLocaleString()}<br/>Comb: ${c.combustible.toLocaleString()}</td>
                                  <td className="p-3">
                                    {c.items.map((it, idx) => (
                                      <div key={idx} className="text-[11px]">
                                        {it.prodName || it.prodNombre}: <strong className="text-amber-400">{it.totalSalida} salidos</strong> (Carg: {it.cantidadCargadas}, Reg: {it.cantidadRegresadas})
                                      </div>
                                    ))}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* GASTOS DE RUTA */}
                {pcSubTab === 'gastos' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4">
                      <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                        <FileSpreadsheet className="w-4 h-4" /> Registrar Gasto de Ruta
                      </h3>
                      <div>
                        <label className="text-xs text-slate-400 block mb-1">Tipo de Gasto</label>
                        <select 
                          value={nuevoGasto.tipo} 
                          onChange={e => setNuevoGasto({ ...nuevoGasto, tipo: e.target.value })} 
                          className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-200"
                        >
                          <option value="COMBUSTIBLE">Combustible</option>
                          <option value="PEAJE">Peaje</option>
                          <option value="ALIMENTACION">Alimentación</option>
                          <option value="OTROS">Otros</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 block mb-1">Valor ($)</label>
                        <input 
                          type="number" 
                          value={nuevoGasto.valor} 
                          onChange={e => setNuevoGasto({ ...nuevoGasto, valor: e.target.value })} 
                          placeholder="25000" 
                          className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-200" 
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 block mb-1">Concepto</label>
                        <input 
                          type="text" 
                          value={nuevoGasto.concepto} 
                          onChange={e => setNuevoGasto({ ...nuevoGasto, concepto: e.target.value })} 
                          placeholder="Ej. Tanqueo ruta norte" 
                          className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-200" 
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 block mb-1">Efectivo / Cuenta</label>
                        <select 
                          value={nuevoGasto.metodo} 
                          onChange={e => setNuevoGasto({ ...nuevoGasto, metodo: e.target.value })} 
                          className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-200"
                        >
                          <option value="EFECTIVO">Efectivo</option>
                          <option value="CUENTA">Cuenta / Transferencia</option>
                        </select>
                      </div>
                      <button onClick={registrarGastoRuta} className="w-full bg-amber-600 hover:bg-amber-500 py-2.5 rounded text-xs font-bold text-white shadow-lg">
                        Guardar Gasto
                      </button>
                    </div>

                    <div className="md:col-span-2 bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4">
                      <h3 className="text-sm font-bold text-amber-400">Gastos Registrados en la Jornada</h3>
                      <div className="overflow-x-auto">
                        {gastosRuta.length === 0 ? (
                          <p className="text-xs text-slate-400 py-8 text-center">No hay gastos registrados.</p>
                        ) : (
                          <table className="w-full text-left text-xs text-slate-300">
                            <thead className="bg-slate-950 text-slate-400 uppercase">
                              <tr>
                                <th className="p-3">Tipo</th>
                                <th className="p-3">Concepto</th>
                                <th className="p-3">Método</th>
                                <th className="p-3">Valor</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                              {gastosRuta.map(g => (
                                <tr key={g.id}>
                                  <td className="p-3 font-medium text-amber-300">{g.tipo}</td>
                                  <td className="p-3">{g.concepto}</td>
                                  <td className="p-3">{g.metodo}</td>
                                  <td className="p-3 font-bold text-emerald-400">${g.valor.toLocaleString()} COP</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* CATÁLOGO DE PRODUCTOS */}
                {pcSubTab === 'productos' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-bold text-amber-400">Catálogo Oficial de Productos (Arroz, Kola, Corozo, Avena)</h3>
                      <button onClick={() => setModalAbierto('producto')} className="bg-amber-600 hover:bg-amber-500 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Agregar Producto
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {productos.map(p => (
                        <div key={p.id} className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                          <p className="font-bold text-slate-100">{p.nombre}</p>
                          <p className="text-[11px] text-slate-400">Presentación: {p.presentacion} mL</p>
                          <p className="text-xs text-amber-400 font-semibold">${p.precio.toLocaleString()} COP</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* BASE CLIENTES & GPS */}
                {pcSubTab === 'clientes' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-bold text-amber-400">Base de Datos de Establecimientos Oficiales con Opción GPS</h3>
                      <button onClick={() => setModalAbierto('cliente')} className="bg-amber-600 hover:bg-amber-500 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Nuevo Establecimiento
                      </button>
                    </div>
                    <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
                      <div className="overflow-x-auto max-h-[60vh]">
                        <table className="w-full text-left text-xs text-slate-300">
                          <thead className="bg-slate-950 text-slate-400 sticky top-0">
                            <tr>
                              <th className="p-3">Establecimiento</th>
                              <th className="p-3">Municipio</th>
                              <th className="p-3">Dirección</th>
                              <th className="p-3">Coordenadas GPS</th>
                              <th className="p-3">Acción</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800">
                            {clientes.map(c => (
                              <tr key={c.id}>
                                <td className="p-3 font-medium">{c.nombre}</td>
                                <td className="p-3 text-amber-300 font-semibold">{c.municipio}</td>
                                <td className="p-3 text-slate-400">{c.direccion}</td>
                                <td className="p-3">
                                  {c.lat && c.lng ? (
                                    <span className="text-emerald-400 text-[10px]">Lat: {c.lat}, Lng: {c.lng}</span>
                                  ) : (
                                    <span className="text-amber-500/80 text-[10px]">Sin GPS Asignado</span>
                                  )}
                                </td>
                                <td className="p-3">
                                  <button 
                                    onClick={() => { setClienteEditando(c); setModalAbierto('geoCliente'); }}
                                    className="bg-sky-600/20 text-sky-400 px-2.5 py-1 rounded text-[10px] font-bold border border-sky-500/30 flex items-center gap-1"
                                  >
                                     Asignar GPS
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* CIERRES & LIQUIDACIONES */}
                {pcSubTab === 'consultas' && (
                  <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-5">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <h3 className="text-md font-bold text-amber-400">Módulo de Cierres, Liquidación y Reportes</h3>
                        <p className="text-xs text-slate-400">Informes de ventas totales por producto, liquidadas por vendedor.</p>
                      </div>
                      <button onClick={exportarExcelReporte} className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2">
                        <FileSpreadsheet className="w-4 h-4" /> Exportar a Excel
                      </button>
                    </div>

                    {cierresEnviadosMovil.length > 0 && (
                      <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/30 space-y-3">
                        <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" /> Cierres de Ruta Enviados desde el Móvil
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {cierresEnviadosMovil.map(env => (
                            <div key={env.idEnvio} className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-xs space-y-1">
                              <p className="font-bold text-amber-300">Vendedor: {env.vendedorNombre}</p>
                              <p className="text-slate-400">Fecha: {env.fecha}</p>
                              <p className="text-emerald-400 font-bold">Total Reportado: ${env.totalVendido.toLocaleString()} COP</p>
                              <p className="text-[11px] text-slate-500">{env.ventas.length} transacciones liquidadas</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">Filtrar por Municipio</label>
                        <input type="text" value={filtroMunicipio} onChange={e => setFiltroMunicipio(e.target.value)} placeholder="Sabanagrande" className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs text-slate-200" />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">Filtrar por Ruta</label>
                        <input type="text" value={filtroZona} onChange={e => setFiltroZona(e.target.value)} placeholder="Ruta R1" className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs text-slate-200" />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">Filtrar por Vendedor</label>
                        <input type="text" value={filtroRepartidor} onChange={e => setFiltroRepartidor(e.target.value)} placeholder="Carlos" className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs text-slate-200" />
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-slate-300">
                        <thead className="bg-slate-950 text-slate-400 uppercase">
                          <tr>
                            <th className="p-3">Hora</th>
                            <th className="p-3">Vendedor</th>
                            <th className="p-3">Establecimiento</th>
                            <th className="p-3">Municipio</th>
                            <th className="p-3">Producto</th>
                            <th className="p-3">Vendidas</th>
                            <th className="p-3">N. Deuda</th>
                            <th className="p-3">Cambios</th>
                            <th className="p-3">Total Venta</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                          {ventasFiltradas.length === 0 ? (
                            <tr><td colSpan="9" className="p-6 text-center text-slate-500">No se encontraron registros de ventas.</td></tr>
                          ) : (
                            ventasFiltradas.map(v => (
                              <tr key={v.id}>
                                <td className="p-3 text-slate-400">{v.hora}</td>
                                <td className="p-3 font-medium text-amber-300">{v.vendedorNombre}</td>
                                <td className="p-3">{v.clienteNombre}</td>
                                <td className="p-3">{v.municipio}</td>
                                <td className="p-3">{v.prodNombre}</td>
                                <td className="p-3 font-bold text-white">{v.cantidad}</td>
                                <td className="p-3 text-red-400">{v.nuevaDeuda}</td>
                                <td className="p-3 text-sky-400">{v.cambios}</td>
                                <td className="p-3 font-bold text-emerald-400">${v.total.toLocaleString()} COP</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* CIERRE GENERAL */}
                {pcSubTab === 'cierre' && (
                  <div className="bg-slate-900 p-8 rounded-xl border border-slate-800 text-center space-y-6 max-w-xl mx-auto py-12">
                    <History className="w-12 h-12 text-amber-500 mx-auto" />
                    <div>
                      <h3 className="text-lg font-bold text-slate-200">Cierre General Operativo y Liquidación</h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Archiva las ventas activas, limpia el inventario en ruta y genera el consolidado total de la operación.
                      </p>
                    </div>
                    <button onClick={ejecutarCierreGeneral} className="bg-amber-600 hover:bg-amber-500 px-8 py-3 rounded-lg text-sm font-bold shadow-lg text-white transition-all">
                      Ejecutar Cierre General de Operaciones
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* MÓVIL VENDEDOR EN CALLE */
          <div>
            {!isMobileLoggedIn ? (
              <div className="max-w-md mx-auto bg-slate-900 p-8 rounded-2xl border border-emerald-500/30 shadow-2xl space-y-5 my-12">
                <div className="text-center space-y-2">
                  <div className="bg-emerald-600/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40">
                    <Truck className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h2 className="text-lg font-bold text-emerald-400">Acceso Vendedor en Calle</h2>
                  <p className="text-xs text-slate-400">Ingresa tus credenciales para registrar ventas en ruta.</p>
                </div>
                <form onSubmit={handleMobileLogin} className="space-y-4">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Correo Electrónico</label>
                    <input 
                      type="email" 
                      required
                      value={mobileEmail} 
                      onChange={e => setMobileEmail(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Contraseña</label>
                    <input 
                      type="password" 
                      required
                      value={mobilePass} 
                      onChange={e => setMobilePass(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-200"
                    />
                  </div>
                  <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-lg text-sm font-bold shadow-lg transition-colors">
                    Iniciar Sesión en Ruta
                  </button>
                </form>
              </div>
            ) : !cargueMovilActivo ? (
              <div className="max-w-md mx-auto bg-slate-900 p-8 rounded-2xl border border-amber-500/30 text-center space-y-4 my-12">
                <Shield className="w-12 h-12 text-amber-500 mx-auto" />
                <h3 className="text-lg font-bold text-slate-200">Sin Reparto Asignado</h3>
                <p className="text-xs text-slate-400">
                  Hola <strong>{mobileUser?.nombre}</strong>, no tienes un despacho de ruta activo asignado para hoy.
                </p>
                <button onClick={cerrarSesionMovil} className="bg-slate-800 px-4 py-2 rounded text-xs text-amber-400 font-bold">
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <div className="max-w-md mx-auto bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-2xl space-y-5">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <div>
                    <h2 className="text-md font-bold text-emerald-400 flex items-center gap-2">
                      <ShoppingCart className="w-5 h-5" /> Registro Formato Físico Ruta
                    </h2>
                    <p className="text-[11px] text-amber-400">Ruta: {cargueMovilActivo.rutaNombre}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setModalAbierto('verVentasMovil')} className="text-[10px] bg-sky-600/20 text-sky-400 px-2.5 py-1 rounded font-bold flex items-center gap-1">
                      <Eye className="w-3 h-3" /> Ver Ventas
                    </button>
                    <button onClick={enviarCierreMovil} className="text-[10px] bg-amber-600/20 text-amber-400 px-2.5 py-1 rounded font-bold flex items-center gap-1">
                      <Send className="w-3 h-3" /> Enviar Cierre
                    </button>
                    <button onClick={cerrarSesionMovil} className="text-[10px] bg-red-600/20 text-red-400 px-2 py-1 rounded">Salir</button>
                  </div>
                </div>

                {/* 1. SELECCIONAR MUNICIPIO */}
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">1. Seleccionar Municipio</label>
                  <select 
                    value={municipioSel} 
                    onChange={e => {
                      setMunicipioSel(e.target.value);
                      setClienteSel('');
                    }} 
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-200"
                  >
                    <option value="">-- Seleccionar Municipio --</option>
                    {Array.from(new Set(clientes.map(c => c.municipio))).map((mun, idx) => (
                      <option key={idx} value={mun}>{mun}</option>
                    ))}
                  </select>
                </div>

                {/* 2. SELECCIONAR ESTABLECIMIENTO */}
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">2. Seleccionar Establecimiento</label>
                  <select 
                    value={clienteSel} 
                    onChange={e => setClienteSel(e.target.value)} 
                    disabled={!municipioSel}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-200 disabled:opacity-50"
                  >
                    <option value="">-- Seleccionar Establecimiento --</option>
                    {clientesFiltradosMovil.map(c => (
                      <option key={c.id} value={c.id}>{c.nombre} ({c.direccion})</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">3. Producto Autorizado en Despacho</label>
                    <select 
                      value={prodSel} 
                      onChange={e => setProdSel(e.target.value)} 
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-200"
                    >
                      <option value="">-- Seleccionar Producto --</option>
                      {productosMovilDisponibles.map(item => (
                        <option key={item.prodId} value={item.prodId}>
                          {item.prodName || item.prodNombre} - Stock: {item.cantidadActual} und (${item.precioUnitario.toLocaleString()})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-slate-400 mb-1 block">Vendidas</label>
                      <input type="number" min="1" value={cantVendida} onChange={e => setCantVendida(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-200" />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Nueva Deuda</label>
                      <input type="number" min="0" value={nuevaDeuda} onChange={e => setNuevaDeuda(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-200" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Cambios</label>
                      <input type="number" min="0" value={cambiosItem} onChange={e => setCambiosItem(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-200" />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Muestras</label>
                      <input type="number" min="0" value={muestrasItem} onChange={e => setMuestrasItem(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-200" />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">Método de Pago</label>
                    <select value={metodoPago} onChange={e => setMetodoPago(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-200">
                      <option value="Efectivo">Efectivo</option>
                      <option value="Nequi">Nequi</option>
                      <option value="DaviPlata">DaviPlata</option>
                      <option value="Crédito">Crédito</option>
                    </select>
                  </div>

                  <button onClick={registrarVenta} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-lg text-sm font-bold shadow-lg transition-colors flex items-center justify-center gap-2">
                    <Send className="w-4 h-4" /> Registrar Ítem Formato Ruta
                  </button>
                </div>

                <div className="border-t border-slate-800 pt-4 space-y-2">
                  <label className="text-xs text-slate-400 block">¿No fue posible realizar la visita?</label>
                  <input type="text" placeholder="Motivo (ej. Local cerrado)" value={motivoNoVenta} onChange={e => setMotivoNoVenta(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200" />
                  <button onClick={registrarNoVenta} className="w-full bg-amber-600/30 text-amber-400 border border-amber-500/40 py-2 rounded-lg text-xs font-semibold">
                    Registrar No Venta
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* VENTANAS EMERGENTES (MODALES) 100% ESTILO MATONDI */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4">
          <div className="bg-slate-900 border border-amber-500/40 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative space-y-4 animate-in fade-in zoom-in duration-200">
            
            <button 
              onClick={() => { setModalAbierto(null); setRutaEditando(null); setClienteEditando(null); }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-100 bg-slate-800 p-1.5 rounded-lg border border-slate-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* MODAL: CREAR RUTA */}
            {modalAbierto === 'ruta' && (
              <div className="space-y-4">
                <h3 className="text-md font-bold text-amber-400 flex items-center gap-2">
                  <Compass className="w-5 h-5" /> Crear Nueva Ruta de Distribución
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Nombre de la Ruta</label>
                    <input type="text" value={nuevaRuta.nombre} onChange={e => setNuevaRuta({ ...nuevaRuta, nombre: e.target.value })} placeholder="Ruta Atlántico R1" className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-xs text-slate-200" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Ciudad</label>
                      <input type="text" value={nuevaRuta.ciudad} onChange={e => setNuevaRuta({ ...nuevaRuta, ciudad: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-xs text-slate-200" />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Departamento</label>
                      <input type="text" value={nuevaRuta.departamento} onChange={e => setNuevaRuta({ ...nuevaRuta, departamento: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-xs text-slate-200" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Agregar Municipios</label>
                    <div className="flex gap-2">
                      <input type="text" value={nuevaRuta.municipioInput} onChange={e => setNuevaRuta({ ...nuevaRuta, municipioInput: e.target.value })} placeholder="Ej. Sabanagrande" className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-200" />
                      <button onClick={agregarMunicipioANuevaRuta} className="bg-amber-600 px-3 py-2 rounded text-xs font-bold text-white">Añadir</button>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {nuevaRuta.municipios.map((m, i) => (
                        <span key={i} className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">{m}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Enlace Google Maps</label>
                    <input type="text" value={nuevaRuta.googleMaps} onChange={e => setNuevaRuta({ ...nuevaRuta, googleMaps: e.target.value })} placeholder="https://maps.google.com/?q=..." className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-xs text-slate-200" />
                  </div>
                </div>
                <button onClick={agregarRuta} className="w-full bg-amber-600 hover:bg-amber-500 py-3 rounded-lg text-xs font-bold text-white shadow-lg">
                  Guardar y Registrar Ruta
                </button>
              </div>
            )}

            {/* MODAL: EDITAR RUTA */}
            {modalAbierto === 'editarRuta' && rutaEditando && (
              <div className="space-y-4">
                <h3 className="text-md font-bold text-amber-400 flex items-center gap-2">
                  <Edit3 className="w-5 h-5" /> Modificar Información de Ruta
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Nombre de la Ruta</label>
                    <input type="text" value={rutaEditando.nombre} onChange={e => setRutaEditando({ ...rutaEditando, nombre: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-xs text-slate-200" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Ciudad</label>
                      <input type="text" value={rutaEditando.ciudad} onChange={e => setRutaEditando({ ...rutaEditando, ciudad: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-xs text-slate-200" />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Departamento</label>
                      <input type="text" value={rutaEditando.departamento} onChange={e => setRutaEditando({ ...rutaEditando, departamento: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-xs text-slate-200" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Enlace Google Maps</label>
                    <input type="text" value={rutaEditando.googleMaps} onChange={e => setRutaEditando({ ...rutaEditando, googleMaps: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-xs text-slate-200" />
                  </div>
                </div>
                <button onClick={guardarEdicionRuta} className="w-full bg-amber-600 hover:bg-amber-500 py-3 rounded-lg text-xs font-bold text-white shadow-lg">
                  Actualizar Cambios de Ruta
                </button>
              </div>
            )}

            {/* MODAL: ASIGNAR GPS A CLIENTE */}
            {modalAbierto === 'geoCliente' && clienteEditando && (
              <div className="space-y-4">
                <h3 className="text-md font-bold text-sky-400 flex items-center gap-2">
                   Geolocalización GPS: {clienteEditando.nombre}
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Municipio / Dirección</label>
                    <p className="text-xs font-medium text-slate-200">{clienteEditando.municipio} - {clienteEditando.direccion}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Latitud</label>
                      <input type="text" value={clienteEditando.lat} onChange={e => setClienteEditando({ ...clienteEditando, lat: e.target.value })} placeholder="10.7412" className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-xs text-slate-200" />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Longitud</label>
                      <input type="text" value={clienteEditando.lng} onChange={e => setClienteEditando({ ...clienteEditando, lng: e.target.value })} placeholder="-74.7541" className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-xs text-slate-200" />
                    </div>
                  </div>
                </div>
                <button onClick={guardarGeolocalizacionCliente} className="w-full bg-sky-600 hover:bg-sky-500 py-3 rounded-lg text-xs font-bold text-white shadow-lg">
                  Guardar Coordenadas GPS
                </button>
              </div>
            )}

            {/* MODAL: VER VENTAS DESDE MÓVIL */}
            {modalAbierto === 'verVentasMovil' && mobileUser && (
              <div className="space-y-4 max-h-[80vh] overflow-y-auto">
                <h3 className="text-md font-bold text-emerald-400 flex items-center gap-2">
                  <FileText className="w-5 h-5" /> Mis Ventas Realizadas (Ruta Actual)
                </h3>
                <div className="space-y-2">
                  {ventas.filter(v => v.vendedorId === mobileUser.id).length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-6">No has registrado ventas todavía en esta sesión.</p>
                  ) : (
                    ventas.filter(v => v.vendedorId === mobileUser.id).map(v => (
                      <div key={v.id} className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs flex justify-between items-center">
                        <div>
                          <p className="font-bold text-slate-200">{v.clienteNombre} ({v.municipio})</p>
                          <p className="text-[11px] text-slate-400">{v.prodNombre} x {v.cantidad} und ({v.metodo})</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-emerald-400">${v.total.toLocaleString()} COP</p>
                          <p className="text-[10px] text-slate-500">{v.hora}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <button onClick={() => setModalAbierto(null)} className="w-full bg-slate-800 hover:bg-slate-700 py-2.5 rounded-lg text-xs font-bold text-slate-200">
                  Cerrar Ventana
                </button>
              </div>
            )}

            {modalAbierto === 'cliente' && (
              <div className="space-y-4">
                <h3 className="text-md font-bold text-amber-400 flex items-center gap-2">
                  <Users className="w-5 h-5" /> Registrar Nuevo Establecimiento Oficial
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Nombre del Establecimiento</label>
                    <input type="text" value={nuevoCliente.nombre} onChange={e => setNuevoCliente({ ...nuevoCliente, nombre: e.target.value })} placeholder="Tienda Ejemplo" className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-xs text-slate-200" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Zona / Ruta</label>
                      <input type="text" value={nuevoCliente.zona} onChange={e => setNuevoCliente({ ...nuevoCliente, zona: e.target.value })} placeholder="R1" className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-xs text-slate-200" />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Municipio</label>
                      <input type="text" value={nuevoCliente.municipio} onChange={e => setNuevoCliente({ ...nuevoCliente, municipio: e.target.value })} placeholder="Sabanagrande" className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-xs text-slate-200" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Dirección / Referencia</label>
                    <input type="text" value={nuevoCliente.direccion} onChange={e => setNuevoCliente({ ...nuevoCliente, direccion: e.target.value })} placeholder="Calle 12 # 3-45" className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-xs text-slate-200" />
                  </div>
                </div>
                <button onClick={agregarCliente} className="w-full bg-amber-600 hover:bg-amber-500 py-3 rounded-lg text-xs font-bold text-white shadow-lg">
                  Guardar Establecimiento
                </button>
              </div>
            )}

            {modalAbierto === 'usuario' && (
              <div className="space-y-4">
                <h3 className="text-md font-bold text-amber-400 flex items-center gap-2">
                  <UserCheck className="w-5 h-5" /> Registrar Nuevo Empleado
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Nombre Completo</label>
                    <input type="text" value={nuevoUsuario.nombre} onChange={e => setNuevoUsuario({ ...nuevoUsuario, nombre: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-xs text-slate-200" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Correo Electrónico (Login)</label>
                    <input type="email" value={nuevoUsuario.email} onChange={e => setNuevoUsuario({ ...nuevoUsuario, email: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-xs text-slate-200" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Contraseña</label>
                    <input type="password" value={nuevoUsuario.password} onChange={e => setNuevoUsuario({ ...nuevoUsuario, password: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-xs text-slate-200" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Rol</label>
                      <select value={nuevoUsuario.rol} onChange={e => setNuevoUsuario({ ...nuevoUsuario, rol: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-xs text-slate-200">
                        <option value="Repartidor">Repartidor</option>
                        <option value="Administrador">Administrador</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Vehículo / Ruta</label>
                      <input type="text" value={nuevoUsuario.vehiculo} onChange={e => setNuevoUsuario({ ...nuevoUsuario, vehiculo: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-xs text-slate-200" />
                    </div>
                  </div>
                </div>
                <button onClick={agregarUsuarioSistema} className="w-full bg-amber-600 hover:bg-amber-500 py-3 rounded-lg text-xs font-bold text-white shadow-lg">
                  Guardar Empleado
                </button>
              </div>
            )}

            {modalAbierto === 'producto' && (
              <div className="space-y-4">
                <h3 className="text-md font-bold text-amber-400 flex items-center gap-2">
                  <Package className="w-5 h-5" /> Agregar Producto al Catálogo
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Nombre del Producto</label>
                    <input type="text" value={nuevoProd.nombre} onChange={e => setNuevoProd({ ...nuevoProd, nombre: e.target.value })} placeholder="Ej. ARROZ TRADICIONAL" className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-xs text-slate-200" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Presentación (mL)</label>
                    <input type="text" value={nuevoProd.presentacion} onChange={e => setNuevoProd({ ...nuevoProd, presentacion: e.target.value })} placeholder="1000" className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-xs text-slate-200" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Precio Unitario (COP)</label>
                    <input type="number" value={nuevoProd.precio} onChange={e => setNuevoProd({ ...nuevoProd, precio: e.target.value })} placeholder="8000" className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-xs text-slate-200" />
                  </div>
                </div>
                <button onClick={agregarProducto} className="w-full bg-amber-600 hover:bg-amber-500 py-3 rounded-lg text-xs font-bold text-white shadow-lg">
                  Registrar Producto
                </button>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
