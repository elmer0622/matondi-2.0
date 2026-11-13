import React, { useState } from 'react';
import { 
  Users, MapPin, Truck, ShoppingCart, Database, FileSpreadsheet, 
  Shield, Send, Plus, Package, DollarSign, UserCheck, Lock, Unlock 
} from 'lucide-react';
import * as XLSX from 'xlsx';

export default function App() {
  const [activeTab, setActiveTab] = useState('pc');
  const [pcSubTab, setPcSubTab] = useState('dashboard');
  
  // Control de Autenticación y Roles
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('Repartidor'); // 'Admin' o 'Repartidor'
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Base de datos de Usuarios del Sistema (Gestión de Accesos)
  const [usuariosSistema, setUsuariosSistema] = useState([
    { id: 'USR-01', nombre: 'Administrador Principal', email: 'admin@matondi.com', rol: 'Administrador', vehiculo: 'N/A', estado: 'Activo' },
    { id: 'USR-02', nombre: 'Carlos Rodríguez', email: 'carlos@matondi.com', rol: 'Repartidor', vehiculo: 'Camión 1 (ABC-123)', estado: 'Activo' }
  ]);

  const [nuevoUsuario, setNuevoUsuario] = useState({ nombre: '', email: '', rol: 'Repartidor', vehiculo: 'Camión Ruta (XYZ)' });

  // Listados en blanco para inicio de operaciones
  const [clientes, setClientes] = useState([]);
  const [productos] = useState([
    { id: 'PROD-01', nombre: 'Cerveza Dorada Especial 330ml', precio: 6500, stockBodega: 120 },
    { id: 'PROD-02', nombre: 'Cerveza Roja Mestiza 330ml', precio: 7000, stockBodega: 95 },
    { id: 'PROD-03', nombre: 'Cerveza Stout Imperial 330ml', precio: 7500, stockBodega: 60 },
    { id: 'PROD-04', nombre: 'Chicha Fermentada Ancestral 1L', precio: 8000, stockBodega: 80 },
    { id: 'PROD-05', nombre: 'Avena Casera Cremosa 1L', precio: 7500, stockBodega: 90 }
  ]);

  const [cargues, setCargues] = useState([
    { id: 'CARG-01', prodId: 'PROD-01', cargado: 48, actual: 48 },
    { id: 'CARG-02', prodId: 'PROD-04', cargado: 24, actual: 24 },
    { id: 'CARG-03', prodId: 'PROD-05', cargado: 24, actual: 24 }
  ]);

  const [ventas, setVentas] = useState([]);

  // Estados de formularios
  const [clienteSel, setClienteSel] = useState('');
  const [prodSel, setProdSel] = useState('PROD-01');
  const [cantSel, setCantSel] = useState(1);
  const [metodoPago, setMetodoPago] = useState('Efectivo');
  const [motivoNoVenta, setMotivoNoVenta] = useState('');
  
  const [nuevoCliente, setNuevoCliente] = useState({ nombre: '', municipio: '', direccion: '', lat: '', lng: '' });

  const sanitizeStr = (str) => String(str).replace(/[<>]/g, '');

  const handleLogin = (e) => {
    e.preventDefault();
    const found = usuariosSistema.find(u => u.email.toLowerCase() === loginEmail.toLowerCase());
    if (found) {
      setUserRole(found.rol);
      setIsLoggedIn(true);
      alert(`Sesión iniciada como: ${found.nombre} (${found.rol})`);
    } else {
      // Ingreso por defecto como Admin si el correo contiene "admin"
      if (loginEmail.includes('admin')) {
        setUserRole('Administrador');
        setIsLoggedIn(true);
      } else {
        setUserRole('Repartidor');
        setIsLoggedIn(true);
      }
    }
  };

  const registrarVenta = () => {
    if (!clienteSel) return alert('Selecciona un cliente');
    const prod = productos.find(p => p.id === prodSel);
    const itemCargue = cargues.find(c => c.prodId === prodSel);

    if (!itemCargue || itemCargue.actual < cantSel) {
      return alert('Inventario insuficiente a bordo del vehículo');
    }

    const nuevaVenta = {
      id: `VEN-${Date.now()}`,
      clienteId: clienteSel,
      prodId: prodSel,
      prodNombre: prod.nombre,
      cantidad: Number(cantSel),
      precio: prod.precio,
      total: prod.precio * cantSel,
      metodo: metodoPago,
      fecha: new Date().toLocaleTimeString()
    };

    setVentas([...ventas, nuevaVenta]);
    setCargues(cargues.map(item => 
      item.prodId === prodSel ? { ...item, actual: item.actual - cantSel } : item
    ));
    setClientes(clientes.map(c => 
      c.id === clienteSel ? { ...c, estado: 'Visitado' } : c
    ));

    alert('Venta registrada con éxito');
  };

  const registrarNoVenta = () => {
    if (!clienteSel || !motivoNoVenta) return alert('Selecciona cliente y motivo');
    setClientes(clientes.map(c => 
      c.id === clienteSel ? { ...c, estado: 'Visitado (No Venta)', motivo: sanitizeStr(motivoNoVenta) } : c
    ));
    setMotivoNoVenta('');
    alert('Visita sin venta registrada');
  };

  const solicitarRevisita = (idCli) => {
    setClientes(clientes.map(c => 
      c.id === idCli ? { ...c, revisita: true } : c
    ));
    alert('Solicitud de re-visita enviada al Administrador');
  };

  const agregarCliente = () => {
    if (!nuevoCliente.nombre || !nuevoCliente.direccion) return alert('Diligencia los campos obligatorios');
    const cli = {
      id: `CLI-0${clientes.length + 1}`,
      nombre: sanitizeStr(nuevoCliente.nombre),
      municipio: sanitizeStr(nuevoCliente.municipio || 'Palmar de Varela'),
      direccion: sanitizeStr(nuevoCliente.direccion),
      lat: Number(nuevoCliente.lat) || 10.7412,
      lng: Number(nuevoCliente.lng) || -74.7541,
      estado: 'Pendiente',
      revisita: false
    };
    setClientes([...clientes, cli]);
    setNuevoCliente({ nombre: '', municipio: '', direccion: '', lat: '', lng: '' });
    alert('Cliente creado exitosamente');
  };

  const agregarUsuarioSistema = () => {
    if (!nuevoUsuario.nombre || !nuevoUsuario.email) return alert('Completa los campos de usuario');
    const usr = {
      id: `USR-0${usuariosSistema.length + 1}`,
      nombre: sanitizeStr(nuevoUsuario.nombre),
      email: sanitizeStr(nuevoUsuario.email),
      rol: nuevoUsuario.rol,
      vehiculo: sanitizeStr(nuevoUsuario.vehiculo),
      estado: 'Activo'
    };
    setUsuariosSistema([...usuariosSistema, usr]);
    setNuevoUsuario({ nombre: '', email: '', rol: 'Repartidor', vehiculo: '' });
    alert('Usuario registrado con éxito en el sistema');
  };

  const exportarExcelCompleto = () => {
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(ventas), 'Ventas');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(clientes), 'Clientes');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(usuariosSistema), 'Usuarios');
    XLSX.writeFile(wb, `Matondi_Beer_Reporte_${new Date().toISOString().slice(0,10)}.xlsx`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4">
      {/* Encabezado General */}
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center bg-slate-900 border border-amber-900/40 p-4 rounded-xl mb-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-4 md:mb-0">
          <div className="bg-amber-600/20 p-2.5 rounded-xl border border-amber-500/30">
            <Database className="w-7 h-7 text-amber-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-wide text-amber-400">MATONDI BEER COLOMBIA</h1>
            <p className="text-xs text-slate-400">Sistema ERP & Distribución de Bebidas Artesanales</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isLoggedIn && (
            <span className="text-xs bg-amber-500/20 text-amber-300 px-3 py-1.5 rounded-lg border border-amber-500/30 font-semibold">
              Rol: {userRole}
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
              /* PANTALLA DE ACCESO ADMINISTRATIVO */
              <div className="max-w-md mx-auto bg-slate-900 p-8 rounded-2xl border border-amber-500/30 shadow-2xl space-y-5 my-12">
                <div className="text-center space-y-2">
                  <div className="bg-amber-600/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto border border-amber-500/40">
                    <Lock className="w-6 h-6 text-amber-400" />
                  </div>
                  <h2 className="text-lg font-bold text-amber-400">Acceso Restringido - Administrador</h2>
                  <p className="text-xs text-slate-400">Inicia sesión con credenciales de administrador para gestionar usuarios y parámetros ERP.</p>
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
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Contraseña</label>
                    <input 
                      type="password" 
                      required
                      value={loginPassword} 
                      onChange={e => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-200"
                    />
                  </div>
                  <button type="submit" className="w-full bg-amber-600 hover:bg-amber-500 text-white py-3 rounded-lg text-sm font-bold shadow-lg transition-colors">
                    Entrar al Sistema
                  </button>
                </form>
              </div>
            ) : userRole !== 'Administrador' ? (
              <div className="bg-slate-900 p-8 rounded-xl border border-red-500/30 text-center py-16 space-y-3">
                <Shield className="w-12 h-12 text-red-500 mx-auto" />
                <h3 className="text-lg font-bold text-slate-200">Acceso Denegado</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Tu cuenta actual está registrada como <strong>Repartidor</strong>. Esta sección de administración requiere privilegios de Administrador.
                </p>
                <button onClick={() => setIsLoggedIn(false)} className="mt-2 bg-slate-800 px-4 py-2 rounded text-xs text-amber-400 font-bold">
                  Cerrar Sesión e Ingresar como Admin
                </button>
              </div>
            ) : (
              /* PANEL DE ADMINISTRADOR COMPLETO */
              <div className="space-y-6">
                <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3 justify-between items-center">
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'dashboard', label: 'Resumen & Stock', icon: Shield },
                      { id: 'usuarios', label: 'Gestión de Usuarios', icon: UserCheck },
                      { id: 'clientes', label: 'Directorio Clientes', icon: Users },
                      { id: 'productos', label: 'Catálogo Productos', icon: Package },
                      { id: 'ventaspc', label: 'Registro de Ventas', icon: DollarSign },
                      { id: 'cierres', label: 'Reportes Excel', icon: FileSpreadsheet }
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
                  <button onClick={() => setIsLoggedIn(false)} className="text-xs bg-red-600/20 text-red-400 border border-red-500/30 px-3 py-1.5 rounded-lg hover:bg-red-600/30">
                    Cerrar Sesión Admin
                  </button>
                </div>

                {/* Sub-vista: Resumen & Stock */}
                {pcSubTab === 'dashboard' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4">
                      <h2 className="text-md font-bold text-amber-400 flex items-center gap-2">
                        <Shield className="w-5 h-5" /> Stock a Bordo (Vehículo)
                      </h2>
                      <div className="space-y-3 text-sm">
                        {cargues.map(c => {
                          const p = productos.find(prod => prod.id === c.prodId);
                          return (
                            <div key={c.id} className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex justify-between items-center">
                              <div>
                                <p className="font-medium text-slate-200">{p?.nombre}</p>
                                <p className="text-xs text-slate-400">Cargado: {c.cargado} | Actual: {c.actual}</p>
                              </div>
                              <span className="text-amber-400 font-bold">{c.actual} und</span>
                            </div>
                          );
                        })}
                      </div>
                      <button onClick={exportarExcelCompleto} className="w-full bg-emerald-600 hover:bg-emerald-500 py-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors">
                        <FileSpreadsheet className="w-4 h-4" /> Exportar a Excel (.XLSX)
                      </button>
                    </div>

                    <div className="md:col-span-2 bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4">
                      <h2 className="text-md font-bold text-amber-400 flex items-center gap-2">
                        <MapPin className="w-5 h-5" /> Visitas y Re-visitas de Clientes
                      </h2>
                      <div className="overflow-x-auto">
                        {clientes.length === 0 ? (
                          <p className="text-xs text-slate-400 py-8 text-center">No hay clientes registrados en la base de datos todavía.</p>
                        ) : (
                          <table className="w-full text-left text-xs text-slate-300">
                            <thead className="bg-slate-950 text-slate-400 uppercase">
                              <tr>
                                <th className="p-3">Local</th>
                                <th className="p-3">Municipio</th>
                                <th className="p-3">Estado</th>
                                <th className="p-3">Re-visita</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                              {clientes.map(cli => (
                                <tr key={cli.id} className="hover:bg-slate-800/50">
                                  <td className="p-3 font-medium">{cli.nombre}</td>
                                  <td className="p-3">{cli.municipio}</td>
                                  <td className="p-3">
                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                      cli.estado === 'Pendiente' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
                                    }`}>
                                      {cli.estado}
                                    </span>
                                  </td>
                                  <td className="p-3">
                                    {cli.revisita ? (
                                      <button 
                                        onClick={() => setClientes(clientes.map(c => c.id === cli.id ? { ...c, revisita: false, estado: 'Pendiente' } : c))}
                                        className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white font-bold text-[10px] rounded"
                                      >
                                        Autorizar Re-visita
                                      </button>
                                    ) : (
                                      <span className="text-[10px] text-slate-500">Sin solicitud</span>
                                    )}
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

                {/* Sub-vista: Gestión de Usuarios del Sistema */}
                {pcSubTab === 'usuarios' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-3">
                      <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Registrar Nuevo Usuario
                      </h3>
                      <div>
                        <label className="text-xs text-slate-400 block mb-1">Nombre Completo</label>
                        <input 
                          type="text" 
                          value={nuevoUsuario.nombre} 
                          onChange={e => setNuevoUsuario({ ...nuevoUsuario, nombre: e.target.value })}
                          placeholder="Ej. Pedro Pérez"
                          className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-200"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 block mb-1">Correo Electrónico (Login)</label>
                        <input 
                          type="email" 
                          value={nuevoUsuario.email} 
                          onChange={e => setNuevoUsuario({ ...nuevoUsuario, email: e.target.value })}
                          placeholder="pedro@matondi.com"
                          className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-200"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 block mb-1">Rol de Acceso</label>
                        <select 
                          value={nuevoUsuario.rol} 
                          onChange={e => setNuevoUsuario({ ...nuevoUsuario, rol: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-200"
                        >
                          <option value="Repartidor">Repartidor (Calle)</option>
                          <option value="Administrador">Administrador (ERP PC)</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 block mb-1">Vehículo Asignado</label>
                        <input 
                          type="text" 
                          value={nuevoUsuario.vehiculo} 
                          onChange={e => setNuevoUsuario({ ...nuevoUsuario, vehiculo: e.target.value })}
                          placeholder="Camión 2 (XYZ-987)"
                          className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-200"
                        />
                      </div>
                      <button onClick={agregarUsuarioSistema} className="w-full bg-amber-600 hover:bg-amber-500 py-2.5 rounded text-xs font-bold text-white transition-colors">
                        Guardar Usuario
                      </button>
                    </div>

                    <div className="md:col-span-2 bg-slate-900 p-5 rounded-xl border border-slate-800">
                      <h3 className="text-sm font-bold text-amber-400 mb-3">Directorio de Usuarios Autorizados</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-slate-300">
                          <thead className="bg-slate-950 text-slate-400">
                            <tr>
                              <th className="p-2">ID</th>
                              <th className="p-2">Nombre</th>
                              <th className="p-2">Correo / Login</th>
                              <th className="p-2">Rol</th>
                              <th className="p-2">Vehículo</th>
                              <th className="p-2">Estado</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800">
                            {usuariosSistema.map(u => (
                              <tr key={u.id}>
                                <td className="p-2 font-mono text-[10px] text-amber-400">{u.id}</td>
                                <td className="p-2 font-medium">{u.nombre}</td>
                                <td className="p-2 text-slate-400">{u.email}</td>
                                <td className="p-2 font-bold text-amber-300">{u.rol}</td>
                                <td className="p-2">{u.vehiculo}</td>
                                <td className="p-2"><span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded text-[10px] font-bold">{u.estado}</span></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* Sub-vista: Directorio Clientes */}
                {pcSubTab === 'clientes' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-3">
                      <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Nuevo Punto de Venta
                      </h3>
                      <div>
                        <label className="text-xs text-slate-400 block mb-1">Nombre del Local</label>
                        <input 
                          type="text" 
                          value={nuevoCliente.nombre} 
                          onChange={e => setNuevoCliente({ ...nuevoCliente, nombre: e.target.value })}
                          placeholder="Ej. Estanco San José"
                          className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-200"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 block mb-1">Municipio</label>
                        <input 
                          type="text" 
                          value={nuevoCliente.municipio} 
                          onChange={e => setNuevoCliente({ ...nuevoCliente, municipio: e.target.value })}
                          placeholder="Palmar de Varela"
                          className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-200"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 block mb-1">Dirección</label>
                        <input 
                          type="text" 
                          value={nuevoCliente.direccion} 
                          onChange={e => setNuevoCliente({ ...nuevoCliente, direccion: e.target.value })}
                          placeholder="Calle 8 # 5-20"
                          className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-200"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs text-slate-400 block mb-1">Latitud</label>
                          <input 
                            type="text" 
                            value={nuevoCliente.lat} 
                            onChange={e => setNuevoCliente({ ...nuevoCliente, lat: e.target.value })}
                            placeholder="10.7412"
                            className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-200"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-slate-400 block mb-1">Longitud</label>
                          <input 
                            type="text" 
                            value={nuevoCliente.lng} 
                            onChange={e => setNuevoCliente({ ...nuevoCliente, lng: e.target.value })}
                            placeholder="-74.7541"
                            className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-200"
                          />
                        </div>
                      </div>
                      <button onClick={agregarCliente} className="w-full bg-amber-600 hover:bg-amber-500 py-2.5 rounded text-xs font-bold text-white transition-colors">
                        Guardar Cliente
                      </button>
                    </div>

                    <div className="md:col-span-2 bg-slate-900 p-5 rounded-xl border border-slate-800">
                      <h3 className="text-sm font-bold text-amber-400 mb-3">Directorio de Tiendas</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-slate-300">
                          <thead className="bg-slate-950 text-slate-400">
                            <tr>
                              <th className="p-2">ID</th>
                              <th className="p-2">Local</th>
                              <th className="p-2">Municipio</th>
                              <th className="p-2">Dirección</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800">
                            {clientes.map(c => (
                              <tr key={c.id}>
                                <td className="p-2 font-mono text-[10px] text-amber-400">{c.id}</td>
                                <td className="p-2 font-medium">{c.nombre}</td>
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

                {/* Sub-vista: Catálogo de Productos */}
                {pcSubTab === 'productos' && (
                  <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
                    <h3 className="text-sm font-bold text-amber-400 mb-4">Catálogo y Stock en Bodega</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {productos.map(p => (
                        <div key={p.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                          <p className="font-bold text-slate-100">{p.nombre}</p>
                          <p className="text-xs text-amber-
