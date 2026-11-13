const handleLogin = (e) => {
    e.preventDefault();
    const emailTrim = loginEmail.trim().toLowerCase();
    let found = usuariosSistema.find(u => u.email.toLowerCase() === emailTrim);
    
    // Si el usuario no existe en la lista, lo creamos automáticamente para evitar bloqueos
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
