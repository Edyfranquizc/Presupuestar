// PresupuestoPDF.tsx — Documento PDF descargable del presupuesto

import { Document, Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer";
import type { Presupuesto } from "../../types/index.ts";
import { formatCurrency, formatDate } from "../../utils/formatters.ts";

const styles = StyleSheet.create({
  page: { padding: 32, fontSize: 10, fontFamily: "Helvetica", color: "#101015" },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  emisorNombre: { fontSize: 13, fontWeight: "bold" },
  emisorDato: { fontSize: 8, color: "#81818E", marginTop: 2 },
  avatar: { width: 56, height: 56, borderRadius: 28 },
  avatarPlaceholder: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: "#EBEBEF",
    alignItems: "center", justifyContent: "center",
  },
  avatarLetra: { fontSize: 22, fontWeight: "bold", color: "#D2D2D9" },
  presupuestoBox: {
    borderWidth: 1, borderColor: "#EBEBEF", borderRadius: 6,
    paddingHorizontal: 10, paddingVertical: 8, alignItems: "flex-end",
  },
  presupuestoTitulo: { fontSize: 9, fontWeight: "bold" },
  presupuestoDato: { fontSize: 8, color: "#81818E", marginTop: 2 },
  tabla: { marginTop: 8 },
  filaHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#EBEBEF",
    paddingBottom: 6,
    marginBottom: 4,
  },
  fila: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#EBEBEF",
    paddingVertical: 8,
  },
  colDescripcion: { flex: 3 },
  colCantidad: { flex: 1, textAlign: "center" },
  colPrecio: { flex: 1.5, textAlign: "right" },
  colTotal: { flex: 1.5, textAlign: "right" },
  colHeaderText: { fontSize: 8, color: "#81818E" },
  itemNombre: { fontSize: 10, fontWeight: "bold" },
  itemValor: { fontSize: 9 },
  totales: { marginTop: 12 },
  totalFila: { flexDirection: "row", justifyContent: "space-between", marginBottom: 3 },
  totalLabel: { fontSize: 9, color: "#81818E" },
  totalValor: { fontSize: 9 },
  totalFinalBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#42378D",
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginTop: 6,
  },
  totalFinalLabel: { fontSize: 12, fontWeight: "bold", color: "#F0F0F9" },
  totalFinalValor: { fontSize: 12, fontWeight: "bold", color: "#F0F0F9" },
  notas: { marginTop: 16, borderWidth: 1, borderColor: "#EBEBEF", borderRadius: 6, padding: 10 },
  notasTitulo: { fontSize: 9, fontWeight: "bold", marginBottom: 2 },
  notasTexto: { fontSize: 8, color: "#81818E" },
});

interface PresupuestoPDFProps {
  presupuesto: Presupuesto;
  emisorNombre: string;
  emisorRubro?: string;
  emisorCuit?: string;
  emisorMoneda?: string;
  logoUrl?: string;
}

export default function PresupuestoPDF({
  presupuesto,
  emisorNombre,
  emisorRubro,
  emisorCuit,
  emisorMoneda,
  logoUrl,
}: PresupuestoPDFProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.emisorNombre}>{emisorNombre}</Text>
            {emisorRubro && <Text style={styles.emisorDato}>{emisorRubro}</Text>}
            {emisorCuit && <Text style={styles.emisorDato}>CUIT: {emisorCuit}</Text>}
          </View>

          {logoUrl ? (
            <Image src={logoUrl} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarLetra}>{emisorNombre[0]?.toUpperCase() ?? "E"}</Text>
            </View>
          )}

          <View style={styles.presupuestoBox}>
            <Text style={styles.presupuestoTitulo}>Presupuesto</Text>
            <Text style={styles.presupuestoDato}>Nº: {presupuesto.numero}</Text>
            <Text style={styles.presupuestoDato}>{formatDate(presupuesto.fecha_creacion)}</Text>
            <Text style={styles.presupuestoDato}>{presupuesto.cliente_nombre}</Text>
          </View>
        </View>

        <View style={styles.tabla}>
          <View style={styles.filaHeader}>
            <Text style={[styles.colHeaderText, styles.colDescripcion]}>Producto / Servicio</Text>
            <Text style={[styles.colHeaderText, styles.colCantidad]}>Cantidad</Text>
            <Text style={[styles.colHeaderText, styles.colPrecio]}>Precio unitario</Text>
            <Text style={[styles.colHeaderText, styles.colTotal]}>Total</Text>
          </View>
          {presupuesto.items.map((item) => (
            <View style={styles.fila} key={item.id}>
              <Text style={[styles.itemNombre, styles.colDescripcion]}>{item.descripcion}</Text>
              <Text style={[styles.itemValor, styles.colCantidad]}>{item.cantidad}</Text>
              <Text style={[styles.itemValor, styles.colPrecio]}>{formatCurrency(item.precio_unitario, emisorMoneda)}</Text>
              <Text style={[styles.itemValor, styles.colTotal]}>{formatCurrency(item.subtotal, emisorMoneda)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.totales}>
          <View style={styles.totalFila}>
            <Text style={styles.totalLabel}>Subtotal:</Text>
            <Text style={styles.totalValor}>{formatCurrency(presupuesto.subtotal, emisorMoneda)}</Text>
          </View>
          {Number(presupuesto.descuento_monto) > 0 && (
            <View style={styles.totalFila}>
              <Text style={styles.totalLabel}>Descuento:</Text>
              <Text style={styles.totalValor}>- {formatCurrency(presupuesto.descuento_monto, emisorMoneda)}</Text>
            </View>
          )}
          <View style={styles.totalFila}>
            <Text style={styles.totalLabel}>IVA ({presupuesto.iva_porcentaje}%)</Text>
            <Text style={styles.totalValor}>{formatCurrency(presupuesto.iva_monto, emisorMoneda)}</Text>
          </View>
          <View style={styles.totalFinalBox}>
            <Text style={styles.totalFinalLabel}>Total:</Text>
            <Text style={styles.totalFinalValor}>{formatCurrency(presupuesto.total, emisorMoneda)}</Text>
          </View>
        </View>

        {presupuesto.notas && (
          <View style={styles.notas}>
            <Text style={styles.notasTitulo}>Observaciones</Text>
            <Text style={styles.notasTexto}>{presupuesto.notas}</Text>
          </View>
        )}
      </Page>
    </Document>
  );
}