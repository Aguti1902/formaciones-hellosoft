export const tracks = {
  franquiciados: {
    id: 'franquiciados',
    title: 'Formación de franquiciados',
    shortTitle: 'Franquiciados',
    subtitle: 'Aprende a configurar perfiles, equipos, clientes y la operativa completa de Hello Soft.',
    badge: 'Red de centros',
    modules: [
      {
        id: 'introduccion',
        title: 'Introducción',
        navTitle: 'Introducción',
        file: 'Introducción.mp4',
        durationHint: 'Vista general',
        description:
          'Recorrido inicial por Hello Soft: cómo está organizada la plataforma y qué vas a poder gestionar como franquiciado.',
      },
      {
        id: 'perfiles',
        title: 'Creación y gestión de perfiles',
        navTitle: 'Perfiles',
        file: 'Perfiles.mp4',
        durationHint: 'Permisos y accesos',
        description:
          'Crea y administra los perfiles de usuario, asigna permisos y controla quién puede acceder a cada área del software.',
      },
      {
        id: 'clientes',
        title: 'Creación y gestión de clientes',
        navTitle: 'Clientes',
        file: 'Clientes.mp4',
        durationHint: 'Ficha de cliente',
        description:
          'Alta, edición y seguimiento de clientas: datos de contacto, estado y acceso a la ficha desde el panel de Clientes.',
      },
      {
        id: 'empleados',
        title: 'Creación y gestión de empleados y horarios',
        navTitle: 'Empleados y horarios',
        file: 'Empleados.mp4',
        durationHint: 'Equipo y turnos',
        description:
          'Configura el equipo del centro, sus horarios y la disponibilidad para que la agenda y los fichajes funcionen bien.',
      },
      {
        id: 'fichajes',
        title: 'Fichajes de empleados',
        navTitle: 'Fichajes',
        file: 'Fichajes.mp4',
        durationHint: 'Control horario',
        description:
          'Cómo fichar entradas y salidas, revisar el historial y usar el control horario del personal en Hello Soft.',
      },
      {
        id: 'agenda',
        title: 'Agenda',
        navTitle: 'Agenda',
        file: 'Agenda.mp4',
        durationHint: 'Reservas',
        description:
          'Gestiona citas y reservas: crear, mover y consultar la agenda del centro para organizar el día a día.',
      },
      {
        id: 'pos',
        title: 'Punto de venta y caja',
        navTitle: 'Punto de venta',
        file: 'Punto de venta y caja.mp4',
        durationHint: 'Cobros',
        description:
          'Cobra servicios y productos, cierra caja y revisa el punto de venta para el control diario del centro.',
      },
    ],
  },
  tienda: {
    id: 'tienda',
    title: 'Formación de tienda',
    shortTitle: 'Tienda',
    subtitle: 'Todo lo que el equipo del centro necesita para el día a día: clientas, fichajes, agenda y caja.',
    badge: 'Operativa de centro',
    modules: [
      {
        id: 'clientes',
        title: 'Creación y gestión de clientes',
        navTitle: 'Clientes',
        file: 'Clientes (tienda).mp4',
        durationHint: 'Ficha de cliente',
        description:
          'Da de alta y edita clientas desde tienda, consulta sus datos y mantén la base de clientes al día.',
      },
      {
        id: 'fichajes',
        title: 'Fichajes',
        navTitle: 'Fichajes',
        file: 'Fichaje (tienda).mp4',
        durationHint: 'Control horario',
        description:
          'Aprende a fichar al entrar y salir del turno y a consultar tus registros de jornada.',
      },
      {
        id: 'agenda',
        title: 'Agenda',
        navTitle: 'Agenda',
        file: 'Agenda (tienda).mp4',
        durationHint: 'Reservas',
        description:
          'Usa la agenda para ver citas, crear reservas y organizar el flujo de clientas en el centro.',
      },
      {
        id: 'pos',
        title: 'Punto de venta y caja',
        navTitle: 'Punto de venta',
        file: 'Punto de venta y caja (tienda).mp4',
        durationHint: 'Cobros',
        description:
          'Cobra en el punto de venta, gestiona la caja del centro y cierra el servicio con el ticket correcto.',
      },
    ],
  },
}

export function videoUrl(trackId, file) {
  const folder = trackId === 'tienda' ? 'Tienda' : 'Franquiciados'
  return `/${folder}/${encodeURIComponent(file)}`
}

export const STORAGE_KEY = 'hello-soft-formacion-progress'
