import React, { useState } from 'react';
import { 
  Users, MapPin, Truck, ShoppingCart, Database, FileSpreadsheet, 
  Shield, Send, Plus, Package, UserCheck, Lock, BarChart3, RotateCcw, ClipboardList, Compass, X 
} from 'lucide-react';
import * as XLSX from 'xlsx';

export default function App() {
  const [activeTab, setActiveTab] = useState('pc');
  const [pcSubTab, setPcSubTab] = useState('usuarios');
  
  // Control de Autenticación General (PC y Móvil)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [loginEmail, setLoginEmail] = useState('');

  // Estados de Autenticación para el Modo Móvil
  const [isMobileLoggedIn, setIsMobileLoggedIn] = useState(false);
  const [mobileUser, setMobileUser] = useState(null);
  const [mobileEmail, setMobileEmail] = useState('');

  // Control de Ventanas Emergentes (Modales)
  const [modalAbierto, setModalAbierto] = useState(null); // 'ruta', 'cliente', 'usuario', 'producto'

  // Base de datos de Usuarios
  const [usuariosSistema, setUsuariosSistema] = useState([
    { id: 'USR-01', nombre: 'Administrador Principal', email: 'admin@matondi.com', rol: 'Administrador', vehiculo: 'N/A', estado: 'Activo' },
    { id: 'USR-02', nombre: 'Carlos Repartidor', email: 'carlos@matondi.com', rol: 'Repartidor', vehiculo: 'Camión 1', estado: 'Activo' }
  ]);
  const [nuevoUsuario, setNuevoUsuario] = useState({ nombre: '', email: '', rol: 'Repartidor', vehiculo: '' });

  // Módulo de Creación de Rutas (Ciudad, Departamento, Municipio, Google Maps)
  const [rutas, setRutas] = useState([
    { id: 'RUT-01', nombre: 'Ruta Centro Atlántico', ciudad: 'Barranquilla', departamento: 'Atlántico', municipio: 'Palmar de Varela', googleMaps: 'https://maps.google.com/?q=10.7412,-74.7541' }
  ]);
  const [nuevaRuta, setNuevaRuta] = useState({ nombre: '', ciudad: 'Barranquilla', departamento: 'Atlántico', municipio: '', googleMaps: '' });

  // Directorio de Clientes
  const [clientes, setClientes] = useState([
    { id: 'CLI-01', nombre: 'Estanco El Trébol', zona: 'Zona Norte', municipio: 'Palmar de Varela', direccion: 'Calle 8 # 5-20', lat: 10.7412, lng: -74.7541, estado: 'Pendiente', revisita: false }
  ]);
  const [nuevoCliente, setNuevoCliente] = useState({ nombre: '', zona: 'Zona Norte', municipio: 'Palmar de Varela', direccion: '', lat: '', lng: '' });

  // Catálogo de Productos
  const [productos, setProductos] = useState([
    { id: 'PROD-01', nombre: 'Cerveza Dorada Especial 330ml', precio: 6500 },
    { id: 'PROD-02', nombre: 'Cerveza Roja Mestiza 330ml', precio: 7000 },
    { id: 'PROD-03', nombre: 'Cerveza Stout Imperial 330ml', precio: 7500 },
    { id: 'PROD-04', nombre: 'Chicha Fermentada Ancestral 1L', precio: 8000 },
    { id: 'PROD-05', nombre: 'Avena Casera Cremosa 1L', precio: 7500 }
  ]);
  const [nuevoProd, setNuevoProd] = useState({ nombre: '', precio: '' });

  // Asignación de Cargues del Día
  const [carguesDiarios, setCarguesDiarios] = useState([]);
  const [cargueForm, setCargueForm] = useState({
    repartidorId: 'USR-02',
    ruta: 'Ruta Atlántico Centro',
    municipio: 'Palmar de Varela',
    combustible: 25000,
    dineroBase: 50000,
    items: [{ prodId: 'PROD-01', cantidad: 40, precioUnitario: 6500 }]
  });

  // Historial de Ventas y Cierres Históricos
  const [ventas, setVentas] = useState([]);
  const [cierresHistoricos, setCierresHistoricos] = useState([]);

  // Estados de formularios en Calle / PC
  const [clienteSel, setClienteSel] = useState('');
  const [prodSel, setProdSel] = useState('PROD-01');
  const [cantSel, setCantSel] = useState(1);
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
    const esAdmin = emailTrim.includes('admin') || emailTrim.includes('mavondi') || emailTrim === '';
    let found = usuariosSistema.find(u => u.email.toLowerCase() === emailTrim);
    
    if (!found) {
      found = {
        id: `USR-${Date.now()}`,
        nombre: esAdmin ? 'Administrador Principal' : 'Repartidor Autorizado',
        email: emailTrim || 'admin@matondi.com',
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
        nombre: 'Usuario Autorizado en Calle',
        email: emailTrim,
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
  };

  const cerrarSesionMovil = () => {
    setIsMobileLoggedIn(false);
    setMobileUser(null);
    setMobileEmail('');
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
      rol: nuevoUsuario.rol,
      vehiculo: sanitizeStr(nuevoUsuario.vehiculo || 'Ruta General'),
      estado: 'Activo'
    };
    setUsuariosSistema([...usuariosSistema, usr]);
    setNuevoUsuario({ nombre: '', email: '', rol: 'Repartidor', vehiculo: '' });
    setModalAbierto(null);
    alert('Usuario registrado con éxito');
  };

  const agregarRuta = () => {
    if (!nuevaRuta.nombre || !nuevaRuta.municipio) return alert('Diligencia el nombre de la ruta y el municipio');
    const rut = {
      id: `RUT-0${rutas.length + 1}`,
      nombre: sanitizeStr(nuevaRuta.nombre),
      ciudad: sanitizeStr(nuevaRuta.ciudad || 'Barranquilla'),
      departamento: sanitizeStr(nuevaRuta.departamento || 'Atlántico'),
      municipio: sanitizeStr(nuevaRuta.municipio),
      googleMaps: sanitizeStr(nuevaRuta.googleMaps || 'https://maps.google.com')
    };
    setRutas([...rutas, rut]);
    setNuevaRuta({ nombre: '', ciudad: 'Barranquilla', departamento: 'Atlántico', municipio: '', googleMaps: '' });
    setModalAbierto(null);
    alert('Ruta creada con éxito');
  };

  const agregarCliente = () => {
    if (!nuevoCliente.nombre || !nuevoCliente.direccion) return alert('Diligencia los campos obligatorios');
    const cli = {
      id: `CLI-0${clientes.length + 1}`,
      nombre: sanitizeStr(nuevoCliente.nombre),
      zona: nuevoCliente.zona,
      municipio: sanitizeStr(nuevoCliente.municipio || 'Palmar de Varela'),
      direccion: sanitizeStr(nuevoCliente.direccion),
      lat: Number(nuevoCliente.lat) || 10.7412,
      lng: Number(nuevoCliente.lng) || -74.7541,
      estado: 'Pendiente',
      revisita: false
    };
    setClientes([...clientes, cli]);
    setNuevoCliente({ nombre: '', zona: 'Zona Norte', municipio: '', direccion: '', lat: '', lng: '' });
    setModalAbierto(null);
    alert('Cliente creado exitosamente');
  };

  const agregarProducto = () => {
    if (!nuevoProd.nombre || !nuevoProd.precio) return alert('Completa los datos del producto');
    const prod = {
      id: `PROD-0${productos.length + 1}`,
      nombre: sanitizeStr(nuevoProd.nombre),
      precio: Number(nuevoProd.precio)
    };
    setProductos([...productos, prod]);
    setNuevoProd({ nombre: '', precio: '' });
    setModalAbierto(null);
    alert('Producto agregado al catálogo con éxito');
  };

  const registrarCargueDia = () => {
    const rep = usuariosSistema.find(u => u.id === cargueForm.repartidorId);
    if (!rep) return alert('Selecciona un repartidor válido');

    const nuevoCargueRegistro = {
      id: `CARG-${Date.now()}`,
      fecha: new Date().toLocaleDateString(),
      repartidorId: cargueForm.repartidorId,
      repartidorNombre: rep.nombre,
      ruta: sanitizeStr(cargueForm.ruta),
      municipio: sanitizeStr(cargueForm.municipio),
      combustible: Number(cargueForm.combustible) || 0,
      dineroBase: Number(cargueForm.dineroBase) || 0,
      items: cargueForm.items.map(item => {
        const p = productos.find(prod => prod.id === item.prodId);
        return {
          prodId: item.prodId,
          prodNombre: p ? p.nombre : 'Producto',
          cantidadAsignada: Number(item.cantidad),
          cantidadActual: Number(item.cantidad),
          precioUnitario: Number(item.precioUnitario) || (p ? p.precio : 0)
        };
      })
    };

    setCarguesDiarios([...carguesDiarios, nuevoCargueRegistro]);
    alert('¡Cargue diario asignado con éxito!');
  };

  const registrarVenta = () => {
    if (!clienteSel) return alert('Selecciona un cliente');
    const cli = clientes.find(c => c.id === clienteSel);
    const prod = productos.find(p => p.id === prodSel);
    const repId = mobileUser ? mobileUser.id : 'USR-02';

    const cargueActivo = carguesDiarios.find(c => c.repartidorId === repId);
    if (!cargueActivo) return alert('No tienes un cargue asignado para hoy.');

    const itemCargue = cargueActivo.items.find(i => i.prodId === prodSel);
    if (!itemCargue || itemCargue.cantidadActual < cantSel) return alert('Inventario insuficiente en ruta.');

    const precioVenta = itemCargue.precioUnitario || prod.precio;
    const nuevaVenta = {
      id: `VEN-${Date.now()}`,
      clienteId: clienteSel,
      clienteNombre: cli ? cli.nombre : 'Cliente',
      ruta: cargueActivo.ruta,
      municipio: cli ? cli.municipio : cargueActivo.municipio,
      zona: cli ? cli.zona : 'Zona General',
      vendedorId: repId,
      vendedorNombre: mobileUser ? mobileUser.name || mobileUser.nombre : 'Repartidor',
      prodId: prodSel,
      prodNombre: prod.nombre,
      cantidad: Number(cantSel),
      precio: precioVenta,
      total: precioVenta * cantSel,
      metodo: metodoPago,
      fecha: new Date().toLocaleDateString(),
      hora: new Date().toLocaleTimeString()
    };

    setVentas([...ventas, nuevaVenta]);
    setCarguesDiarios(carguesDiarios.map(c => {
      if (c.id === cargueActivo.id) {
        return {
          ...c,
          items: c.items.map(i => i.prodId === prodSel ? { ...i, cantidadActual: i.cantidadActual - Number(cantSel) } : i)
        };
      }
      return c;
    }));

    setClientes(clientes.map(c => c.id === clienteSel ? { ...c, estado: 'Visitado' } : c));
    alert('Venta registrada correctamente');
  };

  const registrarNoVenta = () => {
    if (!clienteSel || !motivoNoVenta) return alert('Selecciona cliente y motivo');
    setClientes(clientes.map(c => c.id === clienteSel ? { ...c, estado: 'Visitado (No Venta)', motivo: sanitizeStr(motivoNoVenta) } : c));
    setMotivoNoVenta('');
    alert('Visita sin venta registrada');
  };

  const ejecutarCierreDia = () => {
    if (ventas.length === 0) return alert('No hay ventas registradas para cerrar el día.');
    const resumenCierre = {
      idCierre: `CIERRE-${new Date().toISOString().slice(0,10)}`,
      fecha: new Date().toLocaleDateString(),
      totalVentasDia: ventas.reduce((acc, v) => acc + v.total, 0),
      detalleVentas: [...ventas]
    };
    setCierresHistoricos([...cierresHistoricos, resumenCierre]);
    setVentas([]);
    setCarguesDiarios([]);
    alert('¡Cierre de día ejecutado con éxito!');
  };

  const exportarExcelReporte = () => {
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(ventas), 'Ventas Activas');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(clientes), 'Clientes');
    XLSX.writeFile(wb, `Matondi_Consolidado_${new Date().toISOString().slice(0,10)}.xlsx`);
  };

  const ventasFiltradas = ventas.filter(v => {
    const matchMun = filtroMunicipio ? v.municipio.toLowerCase().includes(filtroMunicipio.toLowerCase()) : true;
    const matchRep = filtroRepartidor ? v.vendedorNombre.toLowerCase().includes(filtroRepartidor.toLowerCase()) : true;
    const matchZona = filtroZona ? v.zona.toLowerCase().includes(filtroZona.toLowerCase()) : true;
    return matchMun && matchRep && matchZona;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 relative">
      {/* ENCABEZADO GENERAL */}
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center bg-slate-900 border border-amber-900/40 p-4 rounded-xl mb-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-4 md:mb-0">
          <div className="bg-amber-600/20 p-2.5 rounded-xl border border-amber-500/30">
            <Database className="w-7 h-7 text-amber-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-wide text-amber-400">MATONDI BEER COLOMBIA</h1>
            <p className="text-xs text-slate-400">ERP & Distribución por Repartos - Atlántico</p>
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
                  <p className="text-xs text-slate-400">Ingresa con tu correo de administrador.</p>
                </div>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Correo Electrónico</label>
                    <input 
                      type="email" 
                      required
                      value={loginEmail} 
                      onChange={e => setLoginEmail(e.target.value)}
                      placeholder="admin@matondi.com"
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
                      { id: 'cargueview', label: 'Cargue Diario', icon: ClipboardList },
                      { id: 'productos', label: 'Catálogo & Precios', icon: Package },
                      { id: 'clientes', label: 'Directorio Clientes', icon: Users },
                      { id: 'consultas', label: 'Consulta & Reportes', icon: BarChart3 },
                      { id: 'cierre', label: 'Cierre de Día', icon: RotateCcw }
                    ].map(sub => {
                      const Icon = sub.icon;
                      return (
                        <button
                          key={sub.id}
                          onClick={() => setPcSubTab(sub.id)}
                          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${pcSubTab === sub.id ? 'bg-amber-600/20 text-amber-400 border border-amber-500/40' : 'bg-slate-900 text-slate-400 hover:text-slate-200'}`}
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

                {/* GESTIÓN DE RUTAS (CIUDAD, DEPARTAMENTO, MUNICIPIO, GOOGLE MAPS) */}
                {pcSubTab === 'rutas' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-bold text-amber-400">Rutas de Distribución Asignadas</h3>
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
                              <th className="p-3">Ciudad / Departamento</th>
                              <th className="p-3">Municipio Destino</th>
                              <th className="p-3">Ubicación Google Maps</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800">
                            {rutas.map(r => (
                              <tr key={r.id}>
                                <td className="p-3 font-medium text-amber-300">{r.nombre}</td>
                                <td className="p-3">{r.ciudad}, {r.departamento}</td>
                                <td className="p-3">{r.municipio}</td>
                                <td className="p-3">
                                  <a href={r.googleMaps} target="_blank" rel="noreferrer" className="text-sky-400 underline text-xs">Abrir en Mapa</a>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* CARGUE DIARIO */}
                {pcSubTab === 'cargueview' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4">
                      <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                        <ClipboardList className="w-4 h-4" /> Asignar Cargue del Día
                      </h3>
                      <div>
                        <label className="text-xs text-slate-400 block mb-1">Repartidor / Admin Asignado</label>
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
                        <label className="text-xs text-slate-400 block mb-1">Nombre de la Ruta</label>
                        <select 
                          value={cargueForm.ruta}
                          onChange={e => {
                            const rObj = rutas.find(rt => rt.nombre === e.target.value);
                            setCargueForm({ 
                              ...cargueForm, 
                              ruta: e.target.value, 
                              municipio: rObj ? rObj.municipio : cargueForm.municipio 
                            });
                          }}
                          className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-200"
                        >
                          {rutas.map(rt => (
                            <option key={rt.id} value={rt.nombre}>{rt.nombre} ({rt.municipio})</option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs text-slate-400 block mb-1">Combustible ($)</label>
                          <input 
                            type="number" 
                            value={cargueForm.combustible} 
                            onChange={e => setCargueForm({ ...cargueForm, combustible: e.target.value })} 
                            className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-200" 
                          />
                        </div>
                        <div>
                          <label className="text-xs text-slate-400 block mb-1">Dinero Base ($)</label>
                          <input 
                            type="number" 
                            value={cargueForm.dineroBase} 
                            onChange={e => setCargueForm({ ...cargueForm, dineroBase: e.target.value })} 
                            className="w-full bg-slate-950 border
