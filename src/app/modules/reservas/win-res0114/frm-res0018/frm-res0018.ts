import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  inject,
  signal,
  OnChanges,
  OnDestroy,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { Subscription, forkJoin, concatMap } from 'rxjs';
import { ConfirmationService } from 'primeng/api';
import { PRIMENG_MODULES } from '../../../../shared/primeng/primeng.imports';
import { ItinerarioReservaService } from '../../../../services/itinerario-reserva.service';
import {
  DiaReserva,
  TextoDiaReserva,
  CatalogosItinerario,
} from '../../../../interfaces/itinerario-reserva.interfaces';
import { GrdRes0019 } from '../grd-res0019/grd-res0019';
import { FuntionsService } from '../../../../services/functions.service';
@Component({
  selector: 'app-frm-res0018',
  imports: [...PRIMENG_MODULES, DatePipe, GrdRes0019],
  providers: [ConfirmationService],
  templateUrl: './frm-res0018.html',
  styleUrl: './frm-res0018.css',
})
export class FrmRes0018 implements OnChanges, OnDestroy {
  @Input() idDetalleReserva = 0;
  @Output() modificado = new EventEmitter<void>();
  @ViewChild(GrdRes0019) grilla?: GrdRes0019;

  //DEFINICIONES PRINCIPALES PROPIAS DEL OBJETO
  idContenedor = signal<string>('WinRes0114');
  idObjeto = signal<string>('FrmRes0018');
  idTabla = signal<string>('247');
  permiso = signal<string>('w');

  //INJECTIONS PÚBLICAS
  funciones = inject(FuntionsService);

  private api = inject(ItinerarioReservaService);
  private confirmar = inject(ConfirmationService);
  dias = signal<DiaReserva[]>([]);
  dia = signal<DiaReserva | null>(null);
  catalogos = signal<CatalogosItinerario>({ idiomas: [], inclusiones: [] });
  textos: TextoDiaReserva[] = [];
  texto: TextoDiaReserva = {};
  diaModelo: DiaReserva = {};
  cargando = signal(false);
  guardando = signal(false);
  sucio = signal(false);
  mensaje = signal('');
  error = signal(false);
  private carga?: Subscription;
  private idiomas?: Subscription;
  private escritura?: Subscription;
  private version = 0;
  ngOnChanges() {
    this.cargar();
  }
  puedeSalir() {
    return (
      !this.guardando() && !this.cargando() && !this.sucio() && (this.grilla?.puedeSalir() ?? true)
    );
  }
  private informa(texto: string, error = false) {
    this.mensaje.set(texto);
    this.error.set(error);
  }
  private falla(e: any) {
    this.informa(e.error?.message ?? e.message ?? 'No se pudo completar la operación.', true);
    this.cargando.set(false);
    this.guardando.set(false);
  }
  cargar(id?: number) {
    this.carga?.unsubscribe();
    this.idiomas?.unsubscribe();
    const version = ++this.version;
    this.cargando.set(true);
    this.dia.set(null);
    this.texto = {};
    this.textos = [];
    this.carga = forkJoin({
      dias: this.api.dias(this.idDetalleReserva),
      catalogos: this.api.catalogos(),
    }).subscribe({
      next: (r) => {
        if (this.version !== version) return;
        this.dias.set(r.dias.data);
        this.catalogos.set(r.catalogos.data);
        this.cargando.set(false);
        this.sucio.set(false);
        const dia = r.dias.data.find((d) => d.idItinerarioRes === id) ?? r.dias.data[0];
        if (dia) this.selecciona(dia);
      },
      error: (e) => this.falla(e),
    });
  }
  seleccionar(d: DiaReserva) {
    if (d.idItinerarioRes === this.dia()?.idItinerarioRes) return;
    if (!this.puedeSalir()) {
      this.informa(
        'Guarde o descarte la ficha y cierre el formulario del insumo antes de cambiar de día.',
        true,
      );
      return;
    }
    this.selecciona(d);
  }
  private selecciona(d: DiaReserva) {
    this.idiomas?.unsubscribe();
    const version = ++this.version;
    this.dia.set(d);
    this.diaModelo = { ...d };
    this.texto = {};
    this.sucio.set(false);
    this.cargando.set(true);
    this.idiomas = this.api.textos(d.idItinerarioRes!).subscribe({
      next: (r) => {
        if (this.version !== version) return;
        this.textos = r.data;
        const preferido =
          r.data.find((t) => t.idIdioma === this.catalogos().idiomas[0]?.codigo) ?? r.data[0];
        this.texto = preferido
          ? { ...preferido }
          : {
              idItinerarioRes: d.idItinerarioRes,
              idIdioma: String(this.catalogos().idiomas[0]?.codigo ?? ''),
            };
        this.cargando.set(false);
      },
      error: (e) => this.falla(e),
    });
  }
  idioma(valor: string) {
    const anterior = this.texto.idIdioma;
    if (this.sucio() || this.guardando()) {
      this.texto = { ...this.texto, idIdioma: anterior };
      this.informa('Guarde o descarte los cambios antes de cambiar de idioma.', true);
      return;
    }
    this.texto = {
      ...(this.textos.find((t) => t.idIdioma === valor) ?? {
        idItinerarioRes: this.dia()?.idItinerarioRes,
        idIdioma: valor,
      }),
    };
  }
  cambiar() {
    this.sucio.set(true);
    this.mensaje.set('Cambios pendientes de guardar.');
  }
  descartar() {
    this.diaModelo = { ...this.dia()! };
    const id = this.texto.idIdioma;
    this.texto = {
      ...(this.textos.find((t) => t.idIdioma === id) ?? {
        idItinerarioRes: this.dia()?.idItinerarioRes,
        idIdioma: id,
      }),
    };
    this.sucio.set(false);
    this.informa('Cambios descartados.');
  }
  guardar() {
    if (this.guardando() || this.cargando() || !this.dia()?.idItinerarioRes || !this.texto.idIdioma)
      return;
    this.guardando.set(true);
    this.escritura = this.api
      .guardaDia({
        ...this.diaModelo,
        horaInicio: this.diaModelo.horaInicio || null,
        horaFin: this.diaModelo.horaFin || null,
      })
      .pipe(
        concatMap((r) => {
          this.dia.set(r.data);
          this.diaModelo = { ...r.data };
          this.dias.update((v) =>
            v.map((d) => (d.idItinerarioRes === r.data.idItinerarioRes ? r.data : d)),
          );
          return this.api.guardaTexto({ ...this.texto, idItinerarioRes: r.data.idItinerarioRes });
        }),
      )
      .subscribe({
        next: (r) => {
          this.texto = { ...r.data };
          this.textos = [...this.textos.filter((t) => t.idIdioma !== r.data.idIdioma), r.data];
          this.guardando.set(false);
          this.sucio.set(false);
          this.informa(r.message);
          this.modificado.emit();
        },
        error: (e) => this.falla(e),
      });
  }
  agregar() {
    if (!this.puedeSalir()) {
      this.informa('Guarde o descarte los cambios antes de agregar un día.', true);
      return;
    }
    this.guardando.set(true);
    this.escritura = this.api.guardaDia({ idDetalleReserva: this.idDetalleReserva }).subscribe({
      next: (r) => {
        this.guardando.set(false);
        this.informa(r.message);
        this.modificado.emit();
        this.cargar(r.idSecuencial);
      },
      error: (e) => this.falla(e),
    });
  }
  eliminar() {
    if (!this.puedeSalir() || !this.dia()) return;
    const id = this.dia()!.idItinerarioRes!;
    this.confirmar.confirm({
      header: 'Eliminar día',
      message:
        'Se eliminarán este día, sus textos e insumos y se renumerarán los restantes. ¿Continuar?',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      accept: () => {
        if (!this.puedeSalir()) return;
        this.guardando.set(true);
        this.escritura = this.api.borraDia(id).subscribe({
          next: (r) => {
            this.guardando.set(false);
            this.informa(r.message);
            this.modificado.emit();
            this.cargar();
          },
          error: (e) => this.falla(e),
        });
      },
    });
  }
  ngOnDestroy() {
    this.version++;
    this.carga?.unsubscribe();
    this.idiomas?.unsubscribe();
    this.escritura?.unsubscribe();
  }
}
