// PresupuestoPDF.tsx — Documento PDF descargable del presupuesto

import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { Presupuesto } from "../../types/index.ts";
import { formatCurrency, formatDate } from "../../utils/formatters.ts";

const styles = StyleSheet.create({
  page: { padding: 32, fontSize: 10, fontFamily: "Helvetica", color: "#111827" },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingBottom: 12,
    marginBottom: 12,
  },
  emisorNombre: { fontSize: 13, fontWeight: "bold" },
  emisorEmail: { fontSize: 9, color: "#6b7280" },
  presupuestoNumero: { fontSize: 11, fontWeight: "bold", textAlign: "right" },
  presupuestoFecha: { fontSize: 9, color: "#6b7280", textAlign: "right" },
  section: { marginBottom: 12 },
  label: { fontSize: 8, color: "#9ca3af", marginBottom: 2 },
  clienteNombre: { fontSize: 11, fontWeight: "bold" },
  clienteDato: { fontSize: 9, color: "#6b7280" },
  tabla: { marginTop: 8 },
  filaHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#111827",
    paddingBottom: 4,
    marginBottom: 4,
  },
  fila: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#e5e7eb",
    paddingVertical: 4,
  },
  colDescripcion: { flex: 3 },
  colCantidad: { flex: 1, textAlign: "right" },
  colPrecio: { flex: 1.5, textAlign: "right" },
  colSubtotal: { flex: 1.5, textAlign: "right" },
  colHeaderText: { fontSize: 8, color: "#9ca3af" },
  totales: { marginTop: 12, alignItems: "flex-end" },
  totalFila: { flexDirection: "row", justifyContent: "space-between", width: 180, marginBottom: 2 },
  totalLabel: { fontSize: 9, color: "#6b7280" },
  totalValor: { fontSize: 9 },
  totalFinalFila: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 180,
    marginTop: 4,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: "#111827",
  },
  totalFinalLabel: { fontSize: 11, fontWeight: "bold" },
  totalFinalValor: { fontSize: 11, fontWeight: "bold" },
  notas: { marginTop: 16, paddingTop: 8, borderTopWidth: 0.5, borderTopColor: "#e5e7eb" },
});

interface PresupuestoPDFProps {
  presupuesto: Presupuesto;
  emisorNombre: string;
  emisorEmail?: string;
}

export default function PresupuestoPDF({ presupuesto, emisorNombre, emisorEmail }: PresupuestoPDFProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerRow}>
          <View>
            {/* TODO: reemplazar por nombre/logo del negocio cuando exista el endpoint de Onboarding */}
            <Text style={styles.emisorNombre}>{emisorNombre}</Text>
            {emisorEmail && <Text style={styles.emisorEmail}>{emisorEmail}</Text>}
          </View>
          <View>
            <Text style={styles.presupuestoNumero}>Presupuesto #{presupuesto.numero}</Text>
            <Text style={styles.presupuestoFecha}>
              Emitido el {formatDate(presupuesto.fecha_creacion)}
              {presupuesto.fecha_vencimiento && ` · Vence el ${formatDate(presupuesto.fecha_vencimiento)}`}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Cliente</Text>
          <Text style={styles.clienteNombre}>{presupuesto.cliente_nombre}</Text>
          {presupuesto.cliente_email && <Text style={styles.clienteDato}>{presupuesto.cliente_email}</Text>}
          {presupuesto.cliente_telefono && <Text style={styles.clienteDato}>{presupuesto.cliente_telefono}</Text>}
        </View>

        <View style={styles.tabla}>
          <View style={styles.filaHeader}>
            <Text style={[styles.colHeaderText, styles.colDescripcion]}>Descripción</Text>
            <Text style={[styles.colHeaderText, styles.colCantidad]}>Cant.</Text>
            <Text style={[styles.colHeaderText, styles.colPrecio]}>Precio</Text>
            <Text style={[styles.colHeaderText, styles.colSubtotal]}>Subtotal</Text>
          </View>
          {presupuesto.items.map((item) => (
            <View style={styles.fila} key={item.id}>
              <Text style={styles.colDescripcion}>{item.descripcion}</Text>
              <Text style={styles.colCantidad}>{item.cantidad}</Text>
              <Text style={styles.colPrecio}>{formatCurrency(item.precio_unitario)}</Text>
              <Text style={styles.colSubtotal}>{formatCurrency(item.subtotal)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.totales}>
          <View style={styles.totalFila}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalValor}>{formatCurrency(presupuesto.subtotal)}</Text>
          </View>
          {Number(presupuesto.descuento_monto) > 0 && (
            <View style={styles.totalFila}>
              <Text style={styles.totalLabel}>Descuento</Text>
              <Text style={styles.totalValor}>- {formatCurrency(presupuesto.descuento_monto)}</Text>
            </View>
          )}
          <View style={styles.totalFila}>
            <Text style={styles.totalLabel}>IVA ({presupuesto.iva_porcentaje}%)</Text>
            <Text style={styles.totalValor}>{formatCurrency(presupuesto.iva_monto)}</Text>
          </View>
          <View style={styles.totalFinalFila}>
            <Text style={styles.totalFinalLabel}>Total</Text>
            <Text style={styles.totalFinalValor}>{formatCurrency(presupuesto.total)}</Text>
          </View>
        </View>

        {presupuesto.notas && (
          <View style={styles.notas}>
            <Text style={styles.label}>Notas</Text>
            <Text style={styles.clienteDato}>{presupuesto.notas}</Text>
          </View>
        )}
      </Page>
    </Document>
  );
}