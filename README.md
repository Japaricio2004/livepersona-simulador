# LivePersona

LivePersona es un espacio privado de reflexión personal. Permite guardar notas sobre momentos cotidianos, volver a ellas después y usar ejercicios breves para pausar o aclarar una situación. No es un test psicológico ni una herramienta de diagnóstico.

## Requisitos

- Node.js 20 o posterior
- npm

## Desarrollo

```bash
npm install
npm run dev
```

Vite abre la aplicación en el puerto 5173 o en el siguiente puerto disponible si ese ya está ocupado.

## Compilar para producción

```bash
npm run build
npm run preview
```

Netlify queda configurado mediante `netlify.toml` para ejecutar `npm run build` y publicar `dist/`.

## Privacidad

Las notas y preferencias se guardan en el almacenamiento local del navegador. No se envían a un servidor. La descarga del recorrido abre el diálogo de impresión del navegador; allí se puede elegir «Guardar como PDF».

## Tecnologías

- React
- Vite
- CSS
