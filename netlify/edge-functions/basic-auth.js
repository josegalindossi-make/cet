// Netlify Edge Function: protege el sitio con usuario/clave (Basic Auth).
// Las credenciales se leen de variables de entorno configuradas en
// Netlify (Site configuration > Environment variables):
//   BASIC_USERNAME
//   BASIC_PASSWORD
// Si no están configuradas, el sitio queda accesible sin clave (no bloquea).

export default async (request, context) => {
  const username = Netlify.env.get("BASIC_USERNAME");
  const password = Netlify.env.get("BASIC_PASSWORD");

  // Si no se configuraron credenciales, no se exige autenticación.
  if (!username || !password) {
    return context.next();
  }

  const expected = "Basic " + btoa(`${username}:${password}`);
  const authHeader = request.headers.get("Authorization");

  if (authHeader !== expected) {
    return new Response("Autenticación requerida", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Dashboard GSE"',
      },
    });
  }

  return context.next();
};
