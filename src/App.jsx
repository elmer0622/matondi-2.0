import React, { useState } from 'react';
import { 
  Users, MapPin, Truck, ShoppingCart, Database, FileSpreadsheet, 
  Shield, Send, Plus, Package, UserCheck, Lock, BarChart3, RotateCcw, ClipboardList, Compass, X, History, Trash2 
} from 'lucide-react';
import * as XLSX from 'xlsx';

export default function App() {
  const [activeTab, setActiveTab] = useState('pc');
  const [pcSubTab, setPcSubTab] = useState('usuarios');
  
  // Control de Autenticación Módulo PC
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [loginEmail, setLoginEmail] = useState('');

  // Control de Autenticación Módulo Móvil
  const [isMobileLoggedIn, setIsMobileLoggedIn] = useState(false);
  const [mobileUser, setMobileUser] = useState(null);
  const [mobileEmail, setMobileEmail] = useState('');

  // Control de Ventanas Emergentes (Modales)
  const [modalAbierto, setModalAbierto] = useState(null);

  // Base de datos de Usuarios
  const [usuariosSistema, setUsuariosSistema] = useState([
    { id: 'USR-01', nombre: 'Administrador Principal', email: 'admin@matondi.com', rol: 'Administrador', vehiculo: 'N/A', estado: 'Activo' },
    { id: 'USR-02', nombre: 'Carlos Repartidor', email: 'carlos@matondi.com', rol: 'Repartidor', vehiculo: 'Camión 1', estado: 'Activo' }
  ]);
  const [nuevoUsuario, setNuevoUsuario] = useState({ nombre: '', email: '', rol: 'Repartidor', vehiculo: '' });

  // Módulo de Creación de Rutas
  const [rutas, setRutas] = useState([
    { id: 'RUT-01', nombre: 'Ruta Atlántico Centro', ciudad: 'Barranquilla', departamento: 'Atlántico', municipio: 'Palmar de Varela', googleMaps: 'https://maps.google.com/?q=10.7412,-74.7541' }
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

  // Asignación de Cargues del Día por Ruta
  const [carguesDiarios, setCarguesDiarios] = useState([]);
  const [cargueForm, setCargueForm] = useState({
    repartidorId: 'USR-02',
    rutaNombre: 'Ruta Atlántico Centro',
    combustible: 25000,
    dineroBase: 50000,
    items: [{ prodId: 'PROD-01', cantidad: 40, precioUnitario: 6500 }]
  });

  // Historial de Ventas, Inventario Despachado y Cierres Históricos
  const [ventas, setVentas] = useState([]);
  const [cierresHistoricos, setCierresHistoricos] = useState([]);

  // Estados de formularios en Calle / Móvil
  const [municipioSel, setMunicipioSel] = useState('');
  const [clienteSel, setClienteSel] = useState('');
  const [prodSel, setProdSel] = useState('');
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
        nombre: emailTrim.includes('admin') ? 'Administrador en Ruta' : 'Repartidor Autorizado',
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
    setNuevoCliente({ nombre: '', zona: 'Zona Norte', municipio: 'Palmar de Varela', direccion: '', lat: '', lng: '' });
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

  const agregarItemCargueForm = () => {
    setCargueForm({
      ...cargueForm,
      items: [...cargueForm.items, { prodId: productos[0]?.id || '', cantidad: 10, precioUnitario: productos[0]?.precio || 5000 }]
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
      nuevosItems[index][campo] = valor;
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
      municipio: rutaObj.municipio,
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
    alert('¡Cargue general a la ruta asignado con éxito!');
  };

  const registrarVenta = () => {
    if (!municipioSel) return alert('Selecciona un municipio');
    if (!clienteSel) return alert('Selecciona una tienda');
    if (!prodSel) return alert('Selecciona un producto');

    const cli = clientes.find(c => c.id === clienteSel);
    const prod = productos.find(p => p.id === prodSel);
    const repId = mobileUser ? mobileUser.id : 'USR-02';

    const cargueActivo = carguesDiarios.find(c => 
      c.repartidorId === repId || 
      (mobileUser && c.repartidorNombre.toLowerCase() === mobileUser.nombre.toLowerCase())
    );
    if (!cargueActivo) return alert('No tienes un cargue de ruta asignado para hoy.');

    const itemCargue = cargueActivo.items.find(i => i.prodId === prodSel);
    if (!itemCargue || itemCargue.cantidadActual < cantSel) return alert('Inventario insuficiente para este producto en tu vehículo.');

    const precioVenta = itemCargue.precioUnitario || prod.precio;
    const nuevaVenta = {
      id: `VEN-${Date.now()}`,
      clienteId: clienteSel,
      clienteNombre: cli ? cli.nombre : 'Cliente',
      ruta: cargueActivo.rutaNombre,
      municipio: cli ? cli.municipio : cargueActivo.municipio,
      zona: cli ? cli.zona : 'Zona General',
      vendedorId: repId,
      vendedorNombre: mobileUser ? mobileUser.nombre : 'Repartidor',
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

  const ejecutarCierreGeneral = () => {
    if (ventas.length === 0 && carguesDiarios.length === 0) return alert('No hay actividad activa para cerrar.');
    
    const resumenCierre = {
      idCierre: `CIERRE-GRAL-${new Date().toISOString().slice(0,10)}`,
      fecha: new Date().toLocaleDateString(),
      totalVentasGral: ventas.reduce((acc, v) => acc + v.total, 0),
      detalleVentas: [...ventas],
      carguesCerrados: [...carguesDiarios]
    };

    setCierresHistoricos([...cierresHistoricos, resumenCierre]);
    setVentas([]);
    setCarguesDiarios([]);

    alert('¡Cierre General ejecutado con éxito! El inventario despachado ha quedado en blanco.');
  };

  const exportarExcelReporte = () => {
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(ventas), 'Ventas Activas');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(cierresHistoricos), 'Historial Cierres');
    XLSX.writeFile(wb, `Matondi_Consolidado_${new Date().toISOString().slice(0,10)}.xlsx`);
  };

  const ventasFiltradas = ventas.filter(v => {
    const matchMun = filtroMunicipio ? v.municipio.toLowerCase().includes(filtroMunicipio.toLowerCase()) : true;
    const matchRep = filtroRepartidor ? v.vendedorNombre.toLowerCase().includes(filtroRepartidor.toLowerCase()) : true;
    const matchZona = filtroZona ? v.zona.toLowerCase().includes(filtroZona.toLowerCase()) : true;
    return matchMun && matchRep && matchZona;
  });

  // Detección de cargue móvil con coincidencia flexible por ID o por Nombre de Usuario
  const cargueMovilActivo = mobileUser ? carguesDiarios.find(c => 
    c.repartidorId === mobileUser.id || 
    c.repartidorNombre.toLowerCase() === mobileUser.nombre.toLowerCase()
  ) : null;

  const clientesFiltradosMovil = clientes.filter(c => municipioSel ? c.municipio.toLowerCase() === municipioSel.toLowerCase() : false);
  const productosMovilDisponibles = cargueMovilActivo ? cargueMovilActivo.items.filter(i => i.cantidadActual > 0) : [];

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
                      { id: 'inventariodespachado', label: 'Inventario Despachado', icon: Package },
                      { id: 'productos', label: 'Catálogo & Precios', icon: Package },
                      { id: 'clientes', label: 'Directorio Clientes', icon: Users },
                      { id: 'consultas', label: 'Consulta & Reportes', icon: BarChart3 },
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

                {/* GESTIÓN DE RUTAS */}
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
                              <th className="p-3">Ciudad</th>
                              <th className="p-3">Departamento</th>
                              <th className="p-3">Municipio Destino</th>
                              <th className="p-3">Google Maps</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800">
                            {rutas.map(r => (
                              <tr key={r.id}>
                                <td className="p-3 font-medium text-amber-300">{r.nombre}</td>
                                <td className="p-3">{r.ciudad}</td>
                                <td className="p-3">{r.departamento}</td>
                                <td className="p-3">{r.municipio}</td>
                                <td className="p-3">
                                  <a href={r.googleMaps} target="_blank" rel="noreferrer" className="text-sky-400 underline text-xs">Ver Mapa</a>
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
                        <ClipboardList className="w-4 h-4" /> Asignar Cargue a Ruta
                      </h3>
                      <div>
                        <label className="text-xs text-slate-400 block mb-1">Repartidor Asignado</label>
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
                        <label className="text-xs text-slate-400 block mb-1">Seleccionar Ruta de Distribución</label>
                        <select 
                          value={cargueForm.rutaNombre}
                          onChange={e => setCargueForm({ ...cargueForm, rutaNombre: e.target.value })}
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
                            className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-200" 
                          />
                        </div>
                      </div>

                      <div className="border-t border-slate-800 pt-3 space-y-3">
                        <div className="flex justify-between items-center">
                          <label className="text-xs font-bold text-amber-300">Productos Cargados al Vehículo</label>
                          <button onClick={agregarItemCargueForm} className="text-[10px] bg-amber-600/30 text-amber-400 border border-amber-500/40 px-2 py-1 rounded font-semibold hover:bg-amber-600/50">
                            + Agregar Producto
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
                                  <option key={p.id} value={p.id}>{p.nombre}</option>
                                ))}
                              </select>
                              {cargueForm.items.length > 1 && (
                                <button onClick={() => eliminarItemCargueForm(idx)} className="text-red-400 hover:text-red-300 p-1">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="text-[10px] text-slate-400">Cantidad</label>
                                <input 
                                  type="number" 
                                  min="1" 
                                  value={item.cantidad} 
                                  onChange={e => actualizarItemCargueForm(idx, 'cantidad', e.target.value)}
                                  className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-xs text-slate-200" 
                                />
                              </div>
                              <div>
                                <label className="text-[10px] text-slate-400">Precio Unitario ($)</label>
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
                        Asignar Cargue a la Ruta
                      </button>
                    </div>

                    <div className="md:col-span-2 bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4">
                      <h3 className="text-sm font-bold text-amber-400">Cargues Asignados por Ruta</h3>
                      <div className="overflow-x-auto">
                        {carguesDiarios.length === 0 ? (
                          <p className="text-xs text-slate-400 py-8 text-center">No hay cargues activos en este momento.</p>
                        ) : (
                          <table className="w-full text-left text-xs text-slate-300">
                            <thead className="bg-slate-950 text-slate-400 uppercase">
                              <tr>
                                <th className="p-3">Fecha</th>
                                <th className="p-3">Repartidor</th>
                                <th className="p-3">Ruta</th>
                                <th className="p-3">Municipio</th>
                                <th className="p-3">Combustible / Base</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                              {carguesDiarios.map(c => (
                                <tr key={c.id} className="hover:bg-slate-800/50">
                                  <td className="p-3 text-slate-400">{c.fecha}</td>
                                  <td className="p-3 font-medium text-amber-300">{c.repartidorNombre}</td>
                                  <td className="p-3">{c.rutaNombre}</td>
                                  <td className="p-3">{c.municipio}</td>
                                  <td className="p-3 text-emerald-400">Comb: ${c.combustible.toLocaleString()}<br/>Base: ${c.dineroBase.toLocaleString()}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* INVENTARIO DESPACHADO */}
                {pcSubTab === 'inventariodespachado' && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-amber-400">Inventario Actual Despachado por Repartidor</h3>
                    <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
                      {carguesDiarios.length === 0 ? (
                        <p className="text-xs text-slate-400 py-8 text-center">El inventario despachado se encuentra en blanco (vacío o cerrado).</p>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {carguesDiarios.map(c => (
                            <div key={c.id} className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
                              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                                <span className="font-bold text-amber-300">{c.repartidorNombre}</span>
                                <span className="text-[10px] bg-sky-500/20 text-sky-400 px-2 py-0.5 rounded font-semibold">{c.rutaNombre}</span>
                              </div>
                              <div className="space-y-1 pt-1">
                                {c.items.map((it, idx) => (
                                  <div key={idx} className="flex justify-between text-xs">
                                    <span className="text-slate-300">{it.prodNombre}</span>
                                    <span className="font-bold text-amber-400">{it.cantidadActual} und (Asignado: {it.cantidadAsignada})</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* CATÁLOGO DE PRODUCTOS */}
                {pcSubTab === 'productos' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-bold text-amber-400">Catálogo Oficial de Productos</h3>
                      <button onClick={() => setModalAbierto('producto')} className="bg-amber-600 hover:bg-amber-500 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Agregar Producto
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {productos.map(p => (
                        <div key={p.id} className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                          <p className="font-bold text-slate-100">{p.nombre}</p>
                          <p className="text-xs text-amber-400 font-semibold">${p.precio.toLocaleString()} COP</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* DIRECTORIO CLIENTES */}
                {pcSubTab === 'clientes' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-bold text-amber-400">Directorio de Puntos de Venta (Con Municipio Asignado)</h3>
                      <button onClick={() => setModalAbierto('cliente')} className="bg-amber-600 hover:bg-amber-500 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Nuevo Punto de Venta
                      </button>
                    </div>
                    <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
                      <table className="w-full text-left text-xs text-slate-300">
                        <thead className="bg-slate-950 text-slate-400">
                          <tr>
                            <th className="p-3">Local</th>
                            <th className="p-3">Zona</th>
                            <th className="p-3">Municipio</th>
                            <th className="p-3">Dirección</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                          {clientes.map(c => (
                            <tr key={c.id}>
                              <td className="p-3 font-medium">{c.nombre}</td>
                              <td className="p-3">{c.zona}</td>
                              <td className="p-3 text-amber-300 font-semibold">{c.municipio}</td>
                              <td className="p-3 text-slate-400">{c.direccion}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* CONSULTAS & REPORTES */}
                {pcSubTab === 'consultas' && (
                  <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-5">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <h3 className="text-md font-bold text-amber-400">Módulo de Consulta y Consolidado de Ventas</h3>
                        <p className="text-xs text-slate-400">Filtra por vendedor (repartidor), zona o municipio.</p>
                      </div>
                      <button onClick={exportarExcelReporte} className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2">
                        <FileSpreadsheet className="w-4 h-4" /> Exportar a Excel
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">Filtrar por Municipio</label>
                        <input type="text" value={filtroMunicipio} onChange={e => setFiltroMunicipio(e.target.value)} placeholder="Palmar de Varela" className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs text-slate-200" />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">Filtrar por Zona</label>
                        <input type="text" value={filtroZona} onChange={e => setFiltroZona(e.target.value)} placeholder="Zona Norte" className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs text-slate-200" />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">Filtrar por Vendedor / Repartidor</label>
                        <input type="text" value={filtroRepartidor} onChange={e => setFiltroRepartidor(e.target.value)} placeholder="Carlos" className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs text-slate-200" />
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-slate-300">
                        <thead className="bg-slate-950 text-slate-400 uppercase">
                          <tr>
                            <th className="p-3">Hora</th>
                            <th className="p-3">Vendedor</th>
                            <th className="p-3">Cliente</th>
                            <th className="p-3">Ruta</th>
                            <th className="p-3">Municipio</th>
                            <th className="p-3">Producto</th>
                            <th className="p-3">Cant</th>
                            <th className="p-3">Total Venta</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                          {ventasFiltradas.length === 0 ? (
                            <tr><td colSpan="8" className="p-6 text-center text-slate-500">No se encontraron registros.</td></tr>
                          ) : (
                            ventasFiltradas.map(v => (
                              <tr key={v.id}>
                                <td className="p-3 text-slate-400">{v.hora}</td>
                                <td className="p-3 font-medium text-amber-300">{v.vendedorNombre}</td>
                                <td className="p-3">{v.clienteNombre}</td>
                                <td className="p-3">{v.ruta}</td>
                                <td className="p-3">{v.municipio}</td>
                                <td className="p-3">{v.prodNombre}</td>
                                <td className="p-3">{v.cantidad}</td>
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
                      <h3 className="text-lg font-bold text-slate-200">Cierre General Operativo</h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Al ejecutar el cierre general, el inventario despachado quedará completamente en blanco y se guardarán los informes históricos para consulta y filtrado futuro.
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
                  <h2 className="text-lg font-bold text-emerald-400">Acceso Vendedor / Admin en Calle</h2>
                  <p className="text-xs text-slate-400">Ingresa con tu correo registrado para habilitar el módulo de despacho móvil.</p>
                </div>
                <form onSubmit={handleMobileLogin} className="space-y-4">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Correo Electrónico</label>
                    <input 
                      type="email" 
                      required
                      value={mobileEmail} 
                      onChange={e => setMobileEmail(e.target.value)}
                      placeholder="carlos@matondi.com"
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
                  Hola <strong>{mobileUser?.nombre}</strong>, no tienes un cargue activo asignado para hoy por el Administrador.
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
                      <ShoppingCart className="w-5 h-5" /> Registrar Venta en Calle
                    </h2>
                    <p className="text-[11px] text-amber-400">Ruta: {cargueMovilActivo.rutaNombre}</p>
                  </div>
                  <button onClick={cerrarSesionMovil} className="text-[10px] bg-red-600/20 text-red-400 px-2 py-1 rounded">Salir</button>
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

                {/* 2. SELECCIONAR TIENDA (Filtro automático basado en el municipio elegido) */}
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">2. Seleccionar Tienda (Cliente)</label>
                  <select 
                    value={clienteSel} 
                    onChange={e => setClienteSel(e.target.value)} 
                    disabled={!municipioSel}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-200 disabled:opacity-50"
                  >
                    <option value="">-- Seleccionar Tienda --</option>
                    {clientesFiltradosMovil.map(c => (
                      <option key={c.id} value={c.id}>{c.nombre} ({c.direccion})</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">3. Producto Autorizado en tu Cargue</label>
                    <select 
                      value={prodSel} 
                      onChange={e => setProdSel(e.target.value)} 
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-200"
                    >
                      <option value="">-- Seleccionar Producto del Cargue --</option>
                      {productosMovilDisponibles.map(item => (
                        <option key={item.prodId} value={item.prodId}>
                          {item.prodNombre} - Stock: {item.cantidadActual} und (${item.precioUnitario.toLocaleString()})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-slate-400 mb-1 block">Cantidad</label>
                      <input type="number" min="1" value={cantSel} onChange={e => setCantSel(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-200" />
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
                  </div>

                  <button onClick={registrarVenta} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-lg text-sm font-bold shadow-lg transition-colors flex items-center justify-center gap-2">
                    <Send className="w-4 h-4" /> Confirmar & Registrar Venta
                  </button>
                </div>

                <div className="border-t border-slate-800 pt-4 space-y-2">
                  <label className="text-xs text-slate-400 block">¿No fue posible realizar la venta?</label>
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

      {/* ======================================================== */}
      {/* VENTANAS EMERGENTES (MODALES) - ESTILO MATONDI 100% OSCURO */}
      {/* ======================================================== */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4">
          <div className="bg-slate-900 border border-amber-500/40 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative space-y-4 animate-in fade-in zoom-in duration-200">
            
            <button 
              onClick={() => setModalAbierto(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-100 bg-slate-800 p-1.5 rounded-lg border border-slate-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {modalAbierto === 'ruta' && (
              <div className="space-y-4">
                <h3 className="text-md font-bold text-amber-400 flex items-center gap-2">
                  <Compass className="w-5 h-5" /> Crear Nueva Ruta de Distribución
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Nombre de la Ruta</label>
                    <input type="text" value={nuevaRuta.nombre} onChange={e => setNuevaRuta({ ...nuevaRuta, nombre: e.target.value })} placeholder="Ej. Ruta Atlántico Centro" className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-xs text-slate-200" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Ciudad</label>
                      <input type="text" value={nuevaRuta.ciudad} onChange={e => setNuevaRuta({ ...nuevaRuta, ciudad: e.target.value })} placeholder="Barranquilla" className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-xs text-slate-200" />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Departamento</label>
                      <input type="text" value={nuevaRuta.departamento} onChange={e => setNuevaRuta({ ...nuevaRuta, departamento: e.target.value })} placeholder="Atlántico" className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-xs text-slate-200" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Municipio Destino</label>
                    <input type="text" value={nuevaRuta.municipio} onChange={e => setNuevaRuta({ ...nuevaRuta, municipio: e.target.value })} placeholder="Palmar de Varela, Santo Tomás..." className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-xs text-slate-200" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Enlace / Ubicación Google Maps</label>
                    <input type="text" value={nuevaRuta.googleMaps} onChange={e => setNuevaRuta({ ...nuevaRuta, googleMaps: e.target.value })} placeholder="https://maps.google.com/?q=..." className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-xs text-slate-200" />
                  </div>
                </div>
                <button onClick={agregarRuta} className="w-full bg-amber-600 hover:bg-amber-500 py-3 rounded-lg text-xs font-bold text-white transition-colors shadow-lg">
                  Guardar y Registrar Ruta
                </button>
              </div>
            )}

            {modalAbierto === 'cliente' && (
              <div className="space-y-4">
                <h3 className="text-md font-bold text-amber-400 flex items-center gap-2">
                  <Users className="w-5 h-5" /> Registrar Nuevo Punto de Venta
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Nombre del Local</label>
                    <input type="text" value={nuevoCliente.nombre} onChange={e => setNuevoCliente({ ...nuevoCliente, nombre: e.target.value })} placeholder="Estanco El Trébol" className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-xs text-slate-200" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Zona</label>
                      <input type="text" value={nuevoCliente.zona} onChange={e => setNuevoCliente({ ...nuevoCliente, zona: e.target.value })} placeholder="Zona Norte" className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-xs text-slate-200" />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Municipio</label>
                      <input type="text" value={nuevoCliente.municipio} onChange={e => setNuevoCliente({ ...nuevoCliente, municipio: e.target.value })} placeholder="Palmar de Varela" className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-xs text-slate-200" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Dirección</label>
                    <input type="text" value={nuevoCliente.direccion} onChange={e => setNuevoCliente({ ...nuevoCliente, direccion: e.target.value })} placeholder="Calle 8 # 5-20" className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-xs text-slate-200" />
                  </div>
                </div>
                <button onClick={agregarCliente} className="w-full bg-amber-600 hover:bg-amber-500 py-3 rounded-lg text-xs font-bold text-white transition-colors shadow-lg">
                  Guardar Cliente
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
                    <input type="text" value={nuevoUsuario.nombre} onChange={e => setNuevoUsuario({ ...nuevoUsuario, nombre: e.target.value })} placeholder="Carlos Pérez" className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-xs text-slate-200" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Correo Electrónico (Login)</label>
                    <input type="email" value={nuevoUsuario.email} onChange={e => setNuevoUsuario({ ...nuevoUsuario, email: e.target.value })} placeholder="carlos@matondi.com" className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-xs text-slate-200" />
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
                      <input type="text" value={nuevoUsuario.vehiculo} onChange={e => setNuevoUsuario({ ...nuevoUsuario, vehiculo: e.target.value })} placeholder="Camión 1" className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-xs text-slate-200" />
                    </div>
                  </div>
                </div>
                <button onClick={agregarUsuarioSistema} className="w-full bg-amber-600 hover:bg-amber-500 py-3 rounded-lg text-xs font-bold text-white transition-colors shadow-lg">
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
                    <input type="text" value={nuevoProd.nombre} onChange={e => setNuevoProd({ ...nuevoProd, nombre: e.target.value })} placeholder="Cerveza Artesanal 330ml" className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-xs text-slate-200" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Precio Unitario (COP)</label>
                    <input type="number" value={nuevoProd.precio} onChange={e => setNuevoProd({ ...nuevoProd, precio: e.target.value })} placeholder="7000" className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-xs text-slate-200" />
                  </div>
                </div>
                <button onClick={agregarProducto} className="w-full bg-amber-600 hover:bg-amber-500 py-3 rounded-lg text-xs font-bold text-white transition-colors shadow-lg">
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
