import * as XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';

const data = [
  {
    "Hora": "08:30",
    "Tipo (PARTIDA/CHEGADA)": "PARTIDA",
    "Clientes (separados por vírgula)": "PRIMAVERA",
    "Veículo (Matrícula)": "AT-58-LP",
    "Distância (km)": 60,
    "Tracker (S5/S7)": "S5",
    "Destino": "Lisboa → Setúbal"
  },
  {
    "Hora": "10:15",
    "Tipo (PARTIDA/CHEGADA)": "CHEGADA",
    "Clientes (separados por vírgula)": "KOOL",
    "Veículo (Matrícula)": "MX-12-AB",
    "Distância (km)": 35,
    "Tracker (S5/S7)": "S7",
    "Destino": "Hotel vila galé tavira"
  },
  {
    "Hora": "14:00",
    "Tipo (PARTIDA/CHEGADA)": "PARTIDA",
    "Clientes (separados por vírgula)": "BEST 4U, PRIMAVERA",
    "Veículo (Matrícula)": "ZZ-99-ZZ",
    "Distância (km)": 120,
    "Tracker (S5/S7)": "S5",
    "Destino": "Lisboa → Porto"
  }
];

const ws = XLSX.utils.json_to_sheet(data);

// Adjust column widths
const wscols = [
  { wch: 10 }, // Hora
  { wch: 25 }, // Tipo
  { wch: 35 }, // Clientes
  { wch: 20 }, // Veículo
  { wch: 15 }, // Distância
  { wch: 15 }, // Tracker
  { wch: 40 }  // Destino
];
ws['!cols'] = wscols;

const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, "Serviços");

const destDir = path.join(process.cwd(), 'public');
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir);
}

const dest = path.join(destDir, 'template_servicos.xlsx');
XLSX.writeFile(wb, dest);

console.log('Template generated at', dest);
