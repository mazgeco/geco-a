import { describe,it,expect,vi,afterEach } from 'vitest';
import { Injector,runInInjectionContext } from '@angular/core';
import { Subject,of } from 'rxjs';
import { ConfirmationService } from 'primeng/api';
import { ItinerarioReservaService } from '../../../services/itinerario-reserva.service';
import { ProveedoresService } from '../../../services/proveedores.service';
import { FrmRes0018 } from './frm-res0018/frm-res0018';
import { FrmRes0011 } from './frm-res0011/frm-res0011';
import { GrdRes0019 } from './grd-res0019/grd-res0019';
const crear=<T>(tipo:new()=>T,api:any)=>runInInjectionContext(Injector.create({providers:[
 {provide:ItinerarioReservaService,useValue:api},{provide:ProveedoresService,useValue:{buscaInsumos:()=>of({data:[]})}},
 {provide:ConfirmationService,useValue:{confirm:vi.fn(c=>c.accept())}}
]}),()=>new tipo());
const dia={idItinerarioRes:1,idDetalleReserva:10,diaItinerario:1};
const catalogos={idiomas:[{codigo:'ES',etiqueta:'Español'},{codigo:'EN',etiqueta:'Inglés'}],inclusiones:[]};
describe('Días e idiomas de reserva',()=>{
 it('carga días reales y usa el primer idioma guardado cuando no existe el preferido',()=>{
  const f=crear(FrmRes0018,{dias:()=>of({data:[dia]}),catalogos:()=>of({data:catalogos}),textos:()=>of({data:[{idIdioma:'EN',descripcionItinerario:'English'}]})});
  f.idDetalleReserva=10;f.ngOnChanges();expect(f.dia()?.idItinerarioRes).toBe(1);expect(f.texto.idIdioma).toBe('EN');expect(f.texto.descripcionItinerario).toBe('English');f.ngOnDestroy();
 });
 it('cancelar la carga antigua evita que sobrescriba el día recién seleccionado',()=>{
  const primera=new Subject<any>(),segunda=new Subject<any>();const api={textos:vi.fn().mockReturnValueOnce(primera).mockReturnValueOnce(segunda)};
  const f=crear(FrmRes0018,api);f.catalogos.set(catalogos);f.seleccionar(dia);
  // During loading, selection is blocked by the UI; once loaded, moving is allowed.
  primera.next({data:[{idIdioma:'ES',descripcionItinerario:'Día 1'}]});f.seleccionar({...dia,idItinerarioRes:2,diaItinerario:2});
  segunda.next({data:[{idIdioma:'ES',descripcionItinerario:'Día 2'}]});primera.next({data:[{idIdioma:'ES',descripcionItinerario:'Respuesta antigua'}]});
  expect(f.texto.descripcionItinerario).toBe('Día 2');f.ngOnDestroy();
 });
 it('bloquea el cambio de día con textos pendientes y permite descartar',()=>{
  const f=crear(FrmRes0018,{textos:()=>of({data:[{idIdioma:'ES',descripcionItinerario:'Original'}]})});f.catalogos.set(catalogos);f.seleccionar(dia);
  f.texto.descripcionItinerario='Modificado';f.cambiar();f.seleccionar({...dia,idItinerarioRes:2});expect(f.dia()?.idItinerarioRes).toBe(1);
  f.descartar();expect(f.texto.descripcionItinerario).toBe('Original');expect(f.puedeSalir()).toBe(true);f.ngOnDestroy();
 });
 it('un idioma sin traducción inicia campos vacíos y conserva los otros textos',()=>{
  const f=crear(FrmRes0018,{textos:()=>of({data:[{idIdioma:'ES',descripcionItinerario:'Original'}]})});f.catalogos.set(catalogos);f.seleccionar(dia);f.idioma('EN');
  expect(f.texto.descripcionItinerario).toBeUndefined();expect(f.texto.idItinerarioRes).toBe(1);expect(f.textos[0].descripcionItinerario).toBe('Original');f.ngOnDestroy();
 });
 it('si falla el texto mantiene la edición para reintentar y no muestra éxito',()=>{
  const guardar=new Subject<any>();const f=crear(FrmRes0018,{guardaDia:()=>of({data:dia}),guardaTexto:()=>guardar});f.dia.set(dia);f.diaModelo=dia;f.texto={idIdioma:'ES',descripcionItinerario:'Nuevo'};f.cambiar();
  const emit=vi.spyOn(f.modificado,'emit');f.guardar();guardar.error({error:{message:'Fallo'}});expect(f.sucio()).toBe(true);expect(f.guardando()).toBe(false);expect(f.texto.descripcionItinerario).toBe('Nuevo');expect(emit).not.toHaveBeenCalled();f.ngOnDestroy();
 });
});
describe('Formulario y tabla de insumos reservados',()=>{
 it('edita una copia del insumo sin modificar la tabla hasta guardar',()=>{const f=crear(FrmRes0011,{});f.fila={idInsumo:30,descripcionInsumo:'Lunch',cantidadInsumo:2};f.ngOnChanges();f.modelo['cantidadInsumo']=3;expect(f.fila.cantidadInsumo).toBe(2);expect(f.insumo?.descripcionInsumo).toBe('Lunch');f.ngOnDestroy();});
 it('busca solamente el insumo y guarda su ID',()=>{const api={guardaInsumo:vi.fn(()=>new Subject())};const f=crear(FrmRes0011,api);f.fila={idItinerarioRes:1,cantidadInsumo:1};f.ngOnChanges();f.seleccionar({value:{idInsumo:30,descripcionInsumo:'Lunch',costoPresupuestado:15}});f.guardar();expect(api.guardaInsumo).toHaveBeenCalledWith(expect.objectContaining({idInsumo:30,idItinerarioRes:1,costoPresupuestado:15}));f.ngOnDestroy();});
 it('mantiene el formulario abierto ante error de guardado',()=>{const request=new Subject<any>();const f=crear(FrmRes0011,{guardaInsumo:()=>request});f.fila={idItinerarioRes:1,idInsumo:30};f.ngOnChanges();const emit=vi.spyOn(f.guardado,'emit');f.guardar();request.error({error:{message:'Error de impuestos'}});expect(f.mensaje()).toBe('Error de impuestos');expect(f.guardando()).toBe(false);expect(emit).not.toHaveBeenCalled();f.ngOnDestroy();});
 it('calcula los totales del día sobre todas las filas',()=>{const f=crear(GrdRes0019,{});f.filas.set([{totalPresupuestado:10,totalReal:20},{totalPresupuestado:15,totalReal:30}]);expect(f.totalPresupuestado()).toBe(25);expect(f.totalReal()).toBe(50);f.ngOnDestroy();});
 it('actualiza el registro devuelto por el servidor sin duplicar filas',()=>{const f=crear(GrdRes0019,{});f.filas.set([{idInsumoXItinerarioRes:9,cantidadInsumo:1}]);f.editar(f.filas()[0]);expect(f.puedeSalir()).toBe(false);f.guardado({idInsumoXItinerarioRes:9,cantidadInsumo:2});expect(f.filas().length).toBe(1);expect(f.filas()[0].cantidadInsumo).toBe(2);expect(f.puedeSalir()).toBe(true);f.ngOnDestroy();});
});
