<script setup lang="ts">
const columns= [
  {
    label: "Nama Survei",
    field: "survei",
  },
  {
    label: "Kegiatan",
    field: "kegiatan",
  },
  {
    label: "Tanggal Pelaksanaan",
    field: "tanggal",
    type: "date",
    dateInputFormat: "yyyy-MM-dd",
    dateOutputFormat: "dd MMM yyyy",
  },
  {
    label: "Status Kegiatan",
    field: "status",
  },
  {
    label: "Status Persetujuan",
    field: "persetujuan",
  },
]
const rows= [
  { id: 1, survei: "Sensus Penduduk 2020", kegiatan: "Lapangan", tanggal: "2020-01-12", status:3 , persetujuan:3 },
  { id: 1, survei: "Sensus Penduduk 2020", kegiatan: "Lapangan", tanggal: "2020-01-12", status:2 , persetujuan:2 },
  { id: 4, survei: "SAKERNAS 2021", kegiatan: "Lapangan", tanggal: "2021-01-12", status:1 , persetujuan:1 },
  { id: 5, survei: "Survei 2022", kegiatan: "Lapangan", tanggal: "2022-02-12", status:1 , persetujuan:0 },
  { id: 3, survei: "SUSENAS 2022", kegiatan: "Lapangan", tanggal: "2022-08-17", status:1 , persetujuan:2 },
  { id: 2, survei: "Sensus Pertanian 2023", kegiatan: "Lapangan", tanggal: "2022-01-12", status:0 , persetujuan:0 },
]
</script>

<template>
  <div>
    <vue-good-table
      :columns="columns"
      :rows="rows"
      :sort-options="{
        enabled: true,
        initialSortBy: { field: 'tanggal', type: 'asc' },
      }"
    >
      <template #table-row="props">
        <span v-if="props.column.field == 'status'">
          <ButtonKegiatan :status="props.row.status" />
          {{ props.row.status }}
        </span>
        <span v-else-if="props.column.field == 'persetujuan'">
          <ButtonPersetujuan :status="props.row.persetujuan" />
          {{ props.row.persetujuan }}
        </span>
        <span v-else>
          {{ props.formattedRow[props.column.field] }}
        </span>
      </template>
    </vue-good-table>
  </div>
</template>
