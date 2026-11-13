import React, { useState } from 'react';
import { 
  Users, MapPin, Truck, ShoppingCart, Database, FileSpreadsheet, 
  Shield, Send, Plus, Package, UserCheck, Lock, BarChart3, RotateCcw, ClipboardList 
} from 'lucide-react';
import * as XLSX from 'xlsx';

export default function App() {
  const [activeTab, setActiveTab] = useState('pc');
  const [pcSubTab, setPcSubTab] = useState('usuarios');
  
  // Control de Autenticación y Roles
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [loginEmail, setLoginEmail] = useState('');

  // Base de datos de Usuarios
  const [usuariosSistema, setUsuariosSistema] = useState([
    { id: 'USR-01', nombre: 'Administrador Principal', email: 'admin@matondi.com', rol: 'Administrador', vehiculo: 'N/A', estado: 'Activo' },
    { id: 'USR-02', nombre: 'Carlos Repartidor', email: 'carlos@matondi.com', rol: 'Repartidor', vehiculo: 'Camión 1', estado: 'Activo' }
  ]);
  const [nuevoUsuario, setNuevoUsuario] = useState({ nombre: '', email: '', rol: 'Repartidor', vehiculo: '' });

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
    items: [
      { prodId: 'PROD-01', cantidad: 40, precioUnitario: 6500 }
    ]
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
    let found = usuariosSistema.find(u => u.email.toLowerCase() === emailTrim);
    
    if (!found) {
      const esAdmin = emailTrim.includes('admin') || emailTrim === '';
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

    if (found.estado !== 'Activo') {
      return alert('ACCESO DENEGADO: Esta cuenta se encuentra desactivada.');
    }

    setUsuarioActual(found);
    setIsLoggedIn(true);
    setPcSubTab(found.rol === 'Administrador' ? 'usuarios' : 'cargueview');
  };

  const cerrarSesion = () => {
    setIsLoggedIn(false);
    setUsuarioActual(null);
    setLoginEmail('');
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
    alert('Usuario registrado con éxito');
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
    alert('¡Cargue diario asignado con éxito al repartidor!');
  };

  const registrarVenta = () => {
    if (!clienteSel) return alert('Selecciona un cliente');
    const cli = clientes.find(c => c.id === clienteSel);
    const prod = productos.find(p => p.id === prodSel);
    const repId = usuarioActual ? usuarioActual.id : 'USR-02';

    const cargueActivo = carguesDiarios.find(c => c.repartidorId === repId);
    if (!cargueActivo) {
      return alert('No tienes un cargue de productos asignado para hoy por el Administrador.');
    }

    const itemCargue = cargueActivo.items.find(i => i.prodId === prodSel);
    if (!itemCargue || itemCargue.cantidadActual < cantSel) {
      return alert('No cuentas con la disposición suficiente de este producto en tu vehículo.');
    }

    const precioVenta = itemCargue.precioUnitario || prod.precio;

    const nuevaVenta = {
      id: `VEN-${Date.now()}`,
      clienteId: clienteSel,
      clienteNombre: cli ? cli.nombre : 'Cliente',
      ruta: cargueActivo.ruta,
      municipio: cli ? cli.municipio : cargueActivo.municipio,
      zona: cli ? cli.zona : 'Zona General',
      vendedorId: repId,
      vendedorNombre: usuarioActual ? usuarioActual.nombre : 'Repartidor',
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

    alert('¡Cierre de día ejecutado con éxito! Los cargues y ventas activas han sido archivados.');
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
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4">
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
          {isLoggedIn && (
            <span className="text-xs bg-amber-500/20 text-amber-300 px-3 py-1.5 rounded-lg border border-amber-500/30 font-semibold">
              {usuarioActual?.nombre} ({usuarioActual?.rol})
            </span>
          )}
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
                  <p className="text-xs text-slate-400">Ingresa con tu correo registrado (ej. admin@matondi.com).</p>
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
            ) : userRole !== 'Administrador' ? (
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
                      { id: 'cargueview', label: 'Cargue Diario (Ruta)', icon: ClipboardList },
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

                {pcSubTab === 'usuarios' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-3">
                      <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Registrar Nuevo Empleado
                      </h3>
                      <div>
                        <label className="text-xs text-slate-400 block mb-1">Nombre</label>
                        <input type="text" value={nuevoUsuario.nombre} onChange={e => setNuevoUsuario({ ...nuevoUsuario, nombre: e.target.value })} placeholder="Ej. Carlos Pérez" className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-200" />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 block mb-1">Correo (Login)</label>
                        <input type="email" value={nuevoUsuario.email} onChange={e => setNuevoUsuario({ ...nuevoUsuario, email: e.target.value })} placeholder="carlos@matondi.com" className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-200" />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 block mb-1">Rol</label>
                        <select value={nuevoUsuario.rol} onChange={e => setNuevoUsuario({ ...nuevoUsuario, rol: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-200">
                          <option value="Repartidor">Repartidor</option>
                          <option value="Administrador">Administrador</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 block mb-1">Vehículo / Ruta</label>
                        <input type="text" value={nuevoUsuario.vehiculo} onChange={e => setNuevoUsuario({ ...nuevoUsuario, vehiculo: e.target.value })} placeholder="Camión 1" className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-200" />
                      </div>
                      <button onClick={agregarUsuarioSistema} className="w-full bg-amber-600 hover:bg-amber-500 py-2.5 rounded text-xs font-bold text-white">Guardar Usuario</button>
                    </div>

                    <div className="md:col-span-2 bg-slate-900 p-5 rounded-xl border border-slate-800">
                      <h3 className="text-sm font-bold text-amber-400 mb-3">Directorio y Estado de Usuarios</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-slate-300">
                          <thead className="bg-slate-950 text-slate-400">
                            <tr>
                              <th className="p-2">Nombre</th>
                              <th className="p-2">Rol</th>
                              <th className="p-2">Estado</th>
                              <th className="p-2">Acción</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800">
                            {usuariosSistema.map(u => (
                              <tr key={u.id}>
                                <td className="p-2 font-medium">{u.nombre} <span className="block text-[10px] text-slate-500">{u.email}</span></td>
                                <td className="p-2">{u.rol}</td>
                                <td className="p-2">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${u.estado === 'Activo' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                                    {u.estado}
                                  </span>
                                </td>
                                <td className="p-2">
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

                {pcSubTab === 'cargueview' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4">
                      <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                        <ClipboardList className="w-4 h-4" /> Asignar Cargue del Día
                      </h3>
                      <div>
                        <label className="text-xs text-slate-400 block mb-1">Repartidor Asignado</label>
                        <select 
                          value={cargueForm.repartidorId} 
                          onChange={e => setCargueForm({ ...cargueForm, repartidorId: e.target.value })} 
                          className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-200"
                        >
                          {usuariosSistema.filter(u => u.rol === 'Repartidor' && u.estado === 'Activo').map(r => (
                            <option key={r.id} value={r.id}>{r.nombre} ({r.vehiculo})</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 block mb-1">Nombre de la Ruta</label>
                        <input 
                          type="text" 
                          value={cargueForm.ruta} 
                          onChange={e => setCargueForm({ ...cargueForm, ruta: e.target.value })} 
                          placeholder="Ej. Ruta Atlántico Centro" 
                          className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-200" 
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 block mb-1">Municipio Destino</label>
                        <input 
                          type="text" 
                          value={cargueForm.municipio} 
                          onChange={e => setCargueForm({ ...cargueForm, municipio: e.target.value })} 
                          placeholder="Ej. Palmar de Varela" 
                          className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-200" 
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs text-slate-400 block mb-1">Dinero Combustible ($)</label>
                          <input 
                            type="number" 
                            value={cargueForm.combustible} 
                            onChange={e => setCargueForm({ ...cargueForm, combustible: e.target.value })} 
                            className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-200" 
                          />
                        </div>
                        <div>
                          <label className="text-xs text-slate-400 block mb-1">Dinero Base Caja ($)</label>
                          <input 
                            type="number" 
                            value={cargueForm.dineroBase} 
                            onChange={e => setCargueForm({ ...cargueForm, dineroBase: e.target.value })} 
                            className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-200" 
                          />
                        </div>
                      </div>

                      <div className="border-t border-slate-800 pt-3 space-y-3">
                        <p className="text-xs font-bold text-amber-300">Productos y Precios Individuales</p>
                        {cargueForm.items.map((item, idx) => (
                          <div key={idx} className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
                            <select 
                              value={item.prodId}
                              onChange={e => {
                                const newProdId = e.target.value;
                                const pObj = productos.find(p => p.id === newProdId);
                                const updatedItems = [...cargueForm.items];
                                updatedItems[idx].prodId = newProdId;
                                updatedItems[idx].precioUnitario = pObj ? pObj.precio : 0;
                                setCargueForm({ ...cargueForm, items: updatedItems });
                              }}
                              className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-xs text-slate-200"
                            >
                              {productos.map(p => (
                                <option key={p.id} value={p.id}>{p.nombre}</option>
                              ))}
                            </select>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="text-[10px] text-slate-400">Cantidad</label>
                                <input 
                                  type="number" 
                                  min="1" 
                                  value={item.cantidad} 
                                  onChange={e => {
                                    const updatedItems = [...cargueForm.items];
                                    updatedItems[idx].cantidad = e.target.value;
                                    setCargueForm({ ...cargueForm, items: updatedItems });
                                  }}
                                  className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-xs text-slate-200" 
                                />
                              </div>
                              <div>
                                <label className="text-[10px] text-slate-400">Precio Individual ($)</label>
                                <input 
                                  type="number" 
                                  value={item.precioUnitario} 
                                  onChange={e => {
                                    const updatedItems = [...cargueForm.items];
                                    updatedItems[idx].precioUnitario = e.target.value;
                                    setCargueForm({ ...cargueForm, items: updatedItems });
                                  }}
                                  className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-xs text-slate-200" 
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <button onClick={registrarCargueDia} className="w-full bg-amber-600 hover:bg-amber-500 py-2.5 rounded text-xs font-bold text-white">
                        Registrar y Asignar Cargue
                      </button>
                    </div>

                    <div className="md:col-span-2 bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4">
                      <h3 className="text-sm font-bold text-amber-400">Cargues Activos en Ruta</h3>
                      <div className="overflow-x-auto">
                        {carguesDiarios.length === 0 ? (
                          <p className="text-xs text-slate-400 py-8 text-center">No hay cargues diarios asignados en este momento.</p>
                        ) : (
                          <table className="w-full text-left text-xs text-slate-300">
                            <thead className="bg-slate-950 text-slate-400 uppercase">
                              <tr>
                                <th className="p-3">Fecha</th>
                                <th className="p-3">Repartidor</th>
                                <th className="p-3">Ruta / Municipio</th>
                                <th className="p-3">Combustible / Base</th>
                                <th className="p-3">Detalle Cargue</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                              {carguesDiarios.map(c => (
                                <tr key={c.id} className="hover:bg-slate-800/50">
                                  <td className="p-3 text-slate-400">{c.fecha}</td>
                                  <td className="p-3 font-medium text-amber-300">{c.repartidorNombre}</td>
                                  <td className="p-3">{c.ruta} <span className="block text-[10px] text-slate-400">{c.municipio}</span></td>
                                  <td className="p-3 text-emerald-400">Comb: ${c.combustible.toLocaleString()}<br/>Base: ${c.dineroBase.toLocaleString()}</td>
                                  <td className="p-3">
                                    {c.items.map((it, idx) => (
                                      <div key={idx} className="text-[11px]">
                                        {it.prodNombre}: <strong className="text-amber-400">{it.cantidadActual} und</strong> (${it.precioUnitario.toLocaleString()})
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

                {pcSubTab === 'productos' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-3">
                      <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Agregar Producto
                      </h3>
                      <div>
                        <label className="text-xs text-slate-400 block mb-1">Nombre del Producto</label>
                        <input type="text" value={nuevoProd.nombre} onChange={e => setNuevoProd({ ...nuevoProd, nombre: e.target.value })} placeholder="Ej. Cerveza Artesanal 330ml" className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-200" />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 block mb-1">Precio Catálogo Base (COP)</label>
                        <input type="number" value={nuevoProd.precio} onChange={e => setNuevoProd({ ...nuevoProd, precio: e.target.value })} placeholder="7000" className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-200" />
                      </div>
                      <button onClick={agregarProducto} className="w-full bg-amber-600 hover:bg-amber-500 py-2.5 rounded text-xs font-bold text-white">Registrar Producto</button>
                    </div>

                    <div className="md:col-span-2 bg-slate-900 p-5 rounded-xl border border-slate-800">
                      <h3 className="text-sm font-bold text-amber-400 mb-3">Catálogo y Precios Oficiales</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {productos.map(p => (
                          <div key={p.id} className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex justify-between items-center">
                            <div>
                              <p className="font-medium text-slate-200">{p.nombre}</p>
                              <p className="text-xs text-amber-400 font-semibold">${p.precio.toLocaleString()} COP</p>
                            </div>
                            <span className="text-[10px] bg-sky-500/20 text-sky-400 px-2 py-1 rounded font-bold">Oficial</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {pcSubTab === 'clientes' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-3">
                      <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Nuevo Punto de Venta
                      </h3>
                      <div>
                        <label className="text-xs text-slate-400 block mb-1">Nombre del Local</label>
                        <input type="text" value={nuevoCliente.nombre} onChange={e => setNuevoCliente({ ...nuevoCliente, nombre: e.target.value })} placeholder="Estanco El Trébol" className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-200" />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 block mb-1">Zona</label>
                        <input type="text" value={nuevoCliente.zona} onChange={e => setNuevoCliente({ ...nuevoCliente, zona: e.target.value })} placeholder="Zona Norte" className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-200" />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 block mb-1">Municipio</label>
                        <input type="text" value={nuevoCliente.municipio} onChange={e => setNuevoCliente({ ...nuevoCliente, municipio: e.target.value })} placeholder="Palmar de Varela" className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-200" />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 block mb-1">Dirección</label>
                        <input type="text" value={nuevoCliente.direccion} onChange={e => setNuevoCliente({ ...nuevoCliente, direccion: e.target.value })} placeholder="Calle 8 # 5-20" className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-200" />
                      </div>
                      <button onClick={agregarCliente} className="w-full bg-amber-600 hover:bg-amber-500 py-2.5 rounded text-xs font-bold text-white">Guardar Cliente</button>
                    </div>

                    <div className="md:col-span-2 bg-slate-900 p-5 rounded-xl border border-slate-800">
                      <h3 className="text-sm font-bold text-amber-400 mb-3">Directorio de Clientes</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-slate-300">
                          <thead className="bg-slate-950 text-slate-400">
                            <tr>
                              <th className="p-2">Local</th>
                              <th className="p-2">Zona</th>
                              <th className="p-2">Municipio</th>
                              <th className="p-2">Dirección</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800">
                            {clientes.map(c => (
                              <tr key={c.id}>
                                <td className="p-2 font-medium">{c.nombre}</td>
                                <td className="p-2">{c.zona}</td>
                                <td className="p-2">{c.municipio}</td>
                                <td className="p-2 text-slate-400">{c.direccion}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {pcSubTab === 'consultas' && (
                  <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-5">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <h3 className="text-md font-bold text-amber-400">Módulo de Consulta y Consolidado de Ventas</h3>
                        <p className="text-xs text-slate-400">Filtra por zona, municipio o repartidor para auditar valores vendidos.</p>
                      </div>
                      <button onClick={exportarExcelReporte} className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2">
                        <FileSpreadsheet className="w-4 h-4" /> Exportar Reporte a Excel
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">Filtrar por Municipio</label>
                        <input type="text" value={filtroMunicipio} onChange={e => setFiltroMunicipio(e.target.value)} placeholder="Ej. Palmar de Varela" className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs text-slate-200" />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">Filtrar por Zona</label>
                        <input type="text" value={filtroZona} onChange={e => setFiltroZona(e.target.value)} placeholder="Ej. Zona Norte" className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs text-slate-200" />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">Filtrar por Repartidor</label>
                        <input type="text" value={filtroRepartidor} onChange={e => setFiltroRepartidor(e.target.value)} placeholder="Ej. Carlos" className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs text-slate-200" />
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-slate-300">
                        <thead className="bg-slate-950 text-slate-400 uppercase">
                          <tr>
                            <th className="p-3">Hora</th>
                            <th className="p-3">Repartidor</th>
                            <th className="p-3">Cliente</th>
                            <th className="p-3">Zona</th>
                            <th className="p-3">Municipio</th>
                            <th className="p-3">Producto</th>
                            <th className="p-3">Cant</th>
                            <th className="p-3">Total Venta</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                          {ventasFiltradas.length === 0 ? (
                            <tr><td colSpan="8" className="p-6 text-center text-slate-500">No se encontraron registros con los filtros seleccionados.</td></tr>
                          ) : (
                            ventasFiltradas.map(v => (
                              <tr key={v.id}>
                                <td className="p-3 text-slate-400">{v.hora}</td>
                                <td className="p-3 font-medium text-amber-300">{v.vendedorNombre}</td>
                                <td className="p-3">{v.clienteNombre}</td>
                                <td className="p-3">{v.zona}</td>
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

                {pcSubTab === 'cierre' && (
                  <div className="bg-slate-900 p-8 rounded-xl border border-slate-800 text-center space-y-6 max-w-xl mx-auto py-12">
                    <RotateCcw className="w-12 h-12 text-amber-500 mx-auto" />
                    <div>
                      <h3 className="text-lg font-bold text-slate-200">Cierre Operativo de Día</h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Al ejecutar el cierre diario, los cargues y las ventas activas quedarán archivados en el histórico administrativo.
                      </p>
                    </div>
                    <button onClick={ejecutarCierreDia} className="bg-amber-600 hover:bg-amber-500 px-8 py-3 rounded-lg text-sm font-bold shadow-lg text-white transition-all">
                      Ejecutar Cierre Diario de Repartos
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="max-w-md mx-auto bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-2xl space-y-5">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h2 className="text-md font-bold text-emerald-400 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" /> Registrar Venta en Calle
              </h2>
              <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-full font-semibold">Repartidor</span>
            </div>

            <div>
              <label className="text-xs text-slate-400 mb-1 block">Seleccionar Punto de Venta</label>
              <select value={clienteSel} onChange={e => setClienteSel(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-200">
                <option value="">-- Seleccionar Tienda --</option>
                {clientes.map(c => (
                  <option key={c.id} value={c.id}>{c.nombre} ({c.municipio})</option>
                ))}
              </select>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Producto a Entregar</label>
                <select value={prodSel} onChange={e => setProdSel(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-200">
                  {productos.map(p => (
                    <option key={p.id} value={p.id}>{p.nombre} - ${p.precio.toLocaleString()} COP</option>
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
      </main>
    </div>
  );
}
