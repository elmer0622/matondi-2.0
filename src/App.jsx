import React, { useState } from 'react';
import { 
  Users, MapPin, Truck, ShoppingCart, Database, FileSpreadsheet, 
  Shield, Send, Plus, CheckCircle 
} from 'lucide-react';
import * as XLSX from 'xlsx';

export default function App() {
  const [activeTab, setActiveTab] = useState('pc');
  const [pcSubTab, setPcSubTab] = useState('dashboard');
  
  const [clientes, setClientes] = useState([
    { id: 'CLI-01', nombre: 'Estanco El Trébol', municipio: 'Palmar de Varela', direccion: 'Calle 8 # 5-20', lat: 10.7412, lng: -74.7541, estado: 'Pendiente', revisita: false },
    { id: 'CLI-02', nombre: 'Billares La Gran Parada', municipio: 'Palmar de Varela', direccion: 'Cra 4 # 10-15', lat: 10.7425, lng: -74.7550, estado: 'Pendiente', revisita: false },
    { id: 'CLI-03', nombre: 'Tienda La Central', municipio: 'Santo Tomás', direccion: 'Calle 12 # 8-04', lat: 10.7580, lng: -74.7610, estado: 'Pendiente', revisita: false }
  ]);

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

  const [clienteSel, setClienteSel] = useState('');
  const [prodSel, setProdSel] = useState('PROD-01');
  const [cantSel, setCantSel] = useState(1);
  const [metodoPago, setMetodoPago] = useState('Efectivo');
  const [motivoNoVenta, setMotivoNoVenta] = useState('');
  const [nuevoCliente, setNuevoCliente] = useState({ nombre: '', municipio: 'Palmar de Varela', direccion: '', lat: '', lng: '' });

  const sanitizeStr = (str) => String(str).replace(/[<>]/g, '');

  const registrarVenta = () => {
    if (!clienteSel) return alert('Selecciona un cliente');
    const prod = productos.find(p => p.id === prodSel);
    const itemCargue = cargues.find(c => c.prodId === prodSel);

    if (!itemCargue || itemCargue.actual < cantSel) {
      return alert('Inventario insuficiente en el vehículo');
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
      municipio: nuevoCliente.municipio,
      direccion: sanitizeStr(nuevoCliente.direccion),
      lat: Number(nuevoCliente.lat) || 10.7412,
      lng: Number(nuevoCliente.lng) || -74.7541,
      estado: 'Pendiente',
      revisita: false
    };
    setClientes([...clientes, cli]);
    setNuevoCliente({ nombre: '', municipio: 'Palmar de Varela', direccion: '', lat: '', lng: '' });
    alert('Cliente creado exitosamente');
  };

  const exportarExcelCompleto = () => {
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(ventas), 'Ventas');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(clientes), 'Clientes');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(cargues), 'Inventario Cargado');
    XLSX.writeFile(wb, `Matondi_Beer_Reporte_${new Date().toISOString().slice(0,10)}.xlsx`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4">
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

        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTab('pc')}
            className={`px-4 py-2.5 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'pc' ? 'bg-amber-600 text-white shadow-lg' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
          >
            <Users className="w-4 h-4" /> Panel PC (Administrador)
          </button>
          <button 
            onClick={() => setActiveTab('mobile')}
            className={`px-4 py-2.5 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'mobile' ? 'bg-emerald-600 text-white shadow-lg' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
          >
            <Truck className="w-4 h-4" /> Vendedor Móvil (Calle)
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        {activeTab === 'pc' ? (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
              {[
                { id: 'dashboard', label: 'Resumen & Stock', icon: Shield },
                { id: 'clientes', label: 'Directorio Clientes', icon: Users },
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
                      className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Dirección</label>
                    <input 
                      type="text" 
                      value={nuevoCliente.direccion} 
                      onChange={e => setNuevoCliente({ ...nuevoCliente, direccion: e.target.value })}
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

            {pcSubTab === 'cierres' && (
              <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 text-center py-10 space-y-4">
                <FileSpreadsheet className="w-12 h-12 text-emerald-500 mx-auto" />
                <h3 className="text-lg font-bold text-slate-200">Consolidación de Reportes</h3>
                <p className="text-xs text-slate-400 max-w-lg mx-auto">
                  Exporta todas las ventas, inventarios y estados de clientes en un formato organizado para Microsoft Excel.
                </p>
                <button onClick={exportarExcelCompleto} className="bg-emerald-600 hover:bg-emerald-500 px-8 py-3 rounded-lg text-sm font-bold shadow-lg transition-all inline-flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5" /> Descargar Consolidado (.XLSX)
                </button>
              </div>
            )}
          </div>
        ) : (
          /* MÓVIL VENDEDOR EN CALLE */
          <div className="max-w-md mx-auto bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-2xl space-y-5">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h2 className="text-md font-bold text-emerald-400 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" /> Registrar Venta en Calle
              </h2>
              <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-full font-semibold">Repartidor</span>
            </div>

            <div>
              <label className="text-xs text-slate-400 mb-1 block">Seleccionar Punto de Venta</label>
              <select 
                value={clienteSel} 
                onChange={e => setClienteSel(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-200"
              >
                <option value="">-- Seleccionar Tienda --</option>
                {clientes.map(c => (
                  <option key={c.id} value={c.id} disabled={c.estado !== 'Pendiente' && !c.revisita}>
                    {c.nombre} ({c.estado}) {c.revisita ? ' - [RE-VISITA]' : ''}
                  </option>
                ))}
              </select>
            </div>

            {clienteSel && (
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex justify-between items-center">
                <span className="text-xs text-slate-400">Ir al local vía GPS</span>
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${clientes.find(c => c.id === clienteSel)?.lat},${clientes.find(c => c.id === clienteSel)?.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-sky-600 hover:bg-sky-500 text-white text-xs px-3 py-1.5 rounded-md flex items-center gap-1 font-semibold"
                >
                  <MapPin className="w-3.5 h-3.5" /> Google Maps
                </a>
              </div>
            )}

            <div className="space-y-3 pt-2">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Producto a Entregar</label>
                <select 
                  value={prodSel} 
                  onChange={e => setProdSel(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-200"
                >
                  {productos.map(p => (
                    <option key={p.id} value={p.id}>{p.nombre} - ${p.precio.toLocaleString()} COP</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Cantidad</label>
                  <input 
                    type="number" 
                    min="1" 
                    value={cantSel} 
                    onChange={e => setCantSel(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Método de Pago</label>
                  <select 
                    value={metodoPago} 
                    onChange={e => setMetodoPago(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-200"
                  >
                    <option value="Efectivo">Efectivo</option>
                    <option value="Nequi">Nequi</option>
                    <option value="DaviPlata">DaviPlata</option>
                    <option value="Crédito">Crédito</option>
                  </select>
                </div>
              </div>

              <button 
                onClick={registrarVenta} 
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-lg text-sm font-bold shadow-lg transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" /> Confirmar & Registrar Venta
              </button>
            </div>

            <div className="border-t border-slate-800 pt-4 space-y-2">
              <label className="text-xs text-slate-400 block">¿No fue posible realizar la venta?</label>
              <input 
                type="text"
                placeholder="Escribe el motivo (ej. Local cerrado)"
                value={motivoNoVenta}
                onChange={e => setMotivoNoVenta(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200"
              />
              <div className="flex gap-2">
                <button 
                  onClick={registrarNoVenta}
                  className="flex-1 bg-amber-600/30 hover:bg-amber-600/50 text-amber-400 border border-amber-500/40 py-2 rounded-lg text-xs font-semibold"
                >
                  Registrar No Venta
                </button>
                {clienteSel && clientes.find(c => c.id === clienteSel)?.estado !== 'Pendiente' && (
                  <button 
                    onClick={() => solicitarRevisita(clienteSel)}
                    className="flex-1 bg-sky-600/30 hover:bg-sky-600/50 text-sky-400 border border-sky-500/40 py-2 rounded-lg text-xs font-semibold"
                  >
                    Pedir Re-visita
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}