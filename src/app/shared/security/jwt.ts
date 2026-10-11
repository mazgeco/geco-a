export interface JwtSesion {
  sub: string;
  exp: number;
  iss?: string;
  aud?: string[] | string;
  roles?: string[];
}

/** Solo lectura para la UI; la firma se valida exclusivamente en el backend. */
export function leerJwt(token: string | null): JwtSesion | null {
  try {
    const partes = token?.split('.');
    if (!partes || partes.length !== 3 || partes.some((p) => !p)) return null;
    const decode = (parte: string) => {
      const base64 = parte.replace(/-/g, '+').replace(/_/g, '/');
      const bytes = Uint8Array.from(
        atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')),
        (c) => c.charCodeAt(0),
      );
      return JSON.parse(new TextDecoder().decode(bytes));
    };
    const header = decode(partes[0]);
    const payload = decode(partes[1]);
    if (
      header.alg !== 'RS256' ||
      typeof payload.sub !== 'string' ||
      !payload.sub ||
      typeof payload.exp !== 'number' ||
      !Number.isFinite(payload.exp)
    )
      return null;
    return payload as JwtSesion;
  } catch {
    return null;
  }
}
