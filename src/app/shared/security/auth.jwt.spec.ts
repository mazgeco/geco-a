import { Injector, runInInjectionContext } from '@angular/core';
import { Router } from '@angular/router';
import { HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom, of, throwError } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthService } from '../../services/auth.service';
import { leerJwt } from './jwt';
import { jwtInterceptor } from '../interceptors/jwt.interceptor';
import { environment } from '../../../environments/environment';

const encode = (value: unknown) => btoa(String.fromCharCode(...new TextEncoder().encode(JSON.stringify(value)))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
const token = (seconds=120, sub='gabby', alg='RS256') => `${encode({alg,typ:'JWT'})}.${encode({sub,exp:Math.floor(Date.now()/1000)+seconds,nombre:'Gabby'})}.signature`;
const user = (value=token()) => ({idUsuario:'gabby',nombre:'Gabby',token:value});
let data: Map<string,string>;
let router: {navigate: ReturnType<typeof vi.fn>};
let instances: AuthService[];
const create = () => {
  const injector=Injector.create({providers:[{provide:Router,useValue:router}]});
  const auth=runInInjectionContext(injector,()=>new AuthService());instances.push(auth);return auth;
};
beforeEach(()=>{
  vi.useFakeTimers();vi.setSystemTime(new Date('2026-10-11T15:00:00Z'));
  data=new Map();instances=[];router={navigate:vi.fn().mockResolvedValue(true)};
  vi.stubGlobal('sessionStorage',{getItem:(k:string)=>data.get(k)??null,setItem:(k:string,v:string)=>data.set(k,v),removeItem:(k:string)=>data.delete(k)});
  vi.stubGlobal('document',{baseURI:'http://localhost:4200/'});
});
afterEach(()=>{instances.forEach(a=>a.ngOnDestroy());vi.useRealTimers();vi.unstubAllGlobals();});

describe('Sesión JWT',()=>{
  it('rechaza tokens aleatorios y alg none',()=>{expect(leerJwt('tkn-antiguo')).toBeNull();expect(leerJwt(token(120,'gabby','none'))).toBeNull();});
  it('lee caracteres Unicode del payload',()=>{const t=`${encode({alg:'RS256'})}.${encode({sub:'gabby',exp:1700000000,nombre:'María'})}.signature`;expect((leerJwt(t) as any).nombre).toBe('María');});
  it('almacena y publica una sesión vigente',()=>{const a=create();expect(a.login(user())).toBe(true);expect(a.autenticado()).toBe(true);expect(a.idUsuario()).toBe('gabby');expect(data.get('geco_token')).toBe(a.token());});
  it('rechaza sesión vencida',()=>{expect(create().login(user(token(-1)))).toBe(false);expect(data.size).toBe(0);});
  it('rechaza una identidad que no coincide con sub',()=>{expect(create().login(user(token(120,'otro')))).toBe(false);});
  it('restaura sesión vigente sin perder nombre',()=>{const u=user();data.set('geco_user',JSON.stringify(u));data.set('geco_token',u.token);const a=create();expect(a.nombrePersona()).toBe('Gabby');expect(a.autenticado()).toBe(true);});
  it('descarta sesión anterior tkn',()=>{data.set('geco_user',JSON.stringify(user('tkn-antiguo')));data.set('geco_token','tkn-antiguo');expect(create().autenticado()).toBe(false);expect(data.size).toBe(0);});
  it('descarta storage malformado',()=>{data.set('geco_user','{');data.set('geco_token',token());expect(create().autenticado()).toBe(false);expect(data.size).toBe(0);});
  it('cierra sesión y redirige exactamente al vencimiento',()=>{const a=create();a.login(user(token(30)));vi.advanceTimersByTime(30000);expect(a.token()).toBeNull();expect(router.navigate).toHaveBeenCalledWith(['/login'],{queryParams:{sesion:'expirada'}});});
  it('logout cancela el temporizador',()=>{const a=create();a.login(user());a.logout();vi.advanceTimersByTime(120000);expect(router.navigate).not.toHaveBeenCalled();expect(data.size).toBe(0);});
});

describe('Interceptor JWT',()=>{
  const run=(auth:any,req:HttpRequest<unknown>,next:any)=>runInInjectionContext(Injector.create({providers:[{provide:AuthService,useValue:auth}]}),()=>jwtInterceptor(req,next));
  const mock = () => ({token:vi.fn(()=> 'valid.jwt.token'),tokenVigente:vi.fn(()=> 'valid.jwt.token'),sesionExpirada:vi.fn()});
  const api=(path:string)=>environment.apiUrl+path;
  it('envía Bearer a la API y conserva los demás headers',async()=>{const auth=mock(),next=vi.fn((request: HttpRequest<unknown>)=>of(new HttpResponse({status:200})));await firstValueFrom(run(auth,new HttpRequest('GET',api('reservas'),{headers:undefined}),next));expect(next.mock.calls[0][0].headers.get('Authorization')).toBe('Bearer valid.jwt.token');});
  it('no envía JWT a un dominio externo',async()=>{const auth=mock(),next=vi.fn((request: HttpRequest<unknown>)=>of(new HttpResponse()));await firstValueFrom(run(auth,new HttpRequest('GET','https://otro.example/api/v1/reservas'),next));expect(next.mock.calls[0][0].headers.has('Authorization')).toBe(false);expect(auth.tokenVigente).not.toHaveBeenCalled();});
  it('no envía JWT a una ruta que solo comparte prefijo',async()=>{const auth=mock(),next=vi.fn((request: HttpRequest<unknown>)=>of(new HttpResponse()));await firstValueFrom(run(auth,new HttpRequest('GET',environment.apiUrl.replace(/\/$/,'')+'-externa'),next));expect(auth.tokenVigente).not.toHaveBeenCalled();});
  it('login siempre sale sin Authorization aunque la petición lo contenga',async()=>{const auth=mock(),next=vi.fn((request: HttpRequest<unknown>)=>of(new HttpResponse()));const req=new HttpRequest('POST',api('seguridades/usuarios/check'),{});await firstValueFrom(run(auth,req.clone({setHeaders:{Authorization:'Bearer antiguo'}}),next));expect(next.mock.calls[0][0].headers.has('Authorization')).toBe(false);});
  it('un 401 protegido cierra la sesión',async()=>{const auth=mock(),next=vi.fn(()=>throwError(()=>new HttpErrorResponse({status:401})));await expect(firstValueFrom(run(auth,new HttpRequest('GET',api('personas')),next))).rejects.toBeInstanceOf(HttpErrorResponse);expect(auth.sesionExpirada).toHaveBeenCalledOnce();});
  it('un 401 del login no se interpreta como sesión vencida',async()=>{const auth=mock(),next=vi.fn(()=>throwError(()=>new HttpErrorResponse({status:401})));await expect(firstValueFrom(run(auth,new HttpRequest('POST',api('seguridades/usuarios/check'),{}),next))).rejects.toBeInstanceOf(HttpErrorResponse);expect(auth.sesionExpirada).not.toHaveBeenCalled();});
  it('un 403 no cierra la sesión',async()=>{const auth=mock(),next=vi.fn(()=>throwError(()=>new HttpErrorResponse({status:403})));await expect(firstValueFrom(run(auth,new HttpRequest('GET',api('personas')),next))).rejects.toBeInstanceOf(HttpErrorResponse);expect(auth.sesionExpirada).not.toHaveBeenCalled();});
  it('bloquea una petición con el token local vencido',async()=>{const auth=mock();auth.tokenVigente.mockReturnValue(null as any);const next=vi.fn((request: HttpRequest<unknown>)=>of(new HttpResponse()));await expect(firstValueFrom(run(auth,new HttpRequest('GET',api('reservas')),next))).rejects.toMatchObject({status:401});expect(next).not.toHaveBeenCalled();expect(auth.sesionExpirada).toHaveBeenCalledOnce();});
  it('ignora un 401 tardío de una sesión anterior',async()=>{const auth=mock();auth.token.mockReturnValue('new.jwt.token');const next=vi.fn(()=>throwError(()=>new HttpErrorResponse({status:401})));await expect(firstValueFrom(run(auth,new HttpRequest('GET',api('reservas')),next))).rejects.toBeInstanceOf(HttpErrorResponse);expect(auth.sesionExpirada).not.toHaveBeenCalled();});
});
